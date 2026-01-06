-- Función para obtener vehículos con sus pedidos asignados
-- Muestra todos los pedidos no entregados (entregado = false), sin importar la fecha
-- Y también pedidos entregados del día actual (entregado = true con fechaEntregado = hoy)

DROP FUNCTION IF EXISTS get_vehiculos_con_pedidos_dia();

CREATE OR REPLACE FUNCTION get_vehiculos_con_pedidos_dia()
RETURNS TABLE (
    vehiculo_id INT,
    placa VARCHAR,
    conductor_id INT,
    conductor_nombre VARCHAR,
    conductor_avatar VARCHAR,
    capacidad INT,
    total_pedidos BIGINT,
    pedidos_entregados BIGINT,
    pedidos JSONB
)
LANGUAGE plpgsql
AS $$
DECLARE
    fecha_actual DATE;
BEGIN
    -- Obtener la fecha actual en la zona horaria de Colombia
    fecha_actual := (NOW() AT TIME ZONE 'America/Bogota')::DATE;
    
    RETURN QUERY
    WITH pedidos_asignados AS (
        SELECT 
            p.*,
            u.nombre as cliente_nombre,
            u.razon_social as cliente_razon_social,
            pt.direccion as punto_direccion,
            pt.coordenadas as punto_coordenadas,
            pt.nombre as punto_nombre,
            z.nombre as zona_nombre
        FROM pedidos p
        LEFT JOIN users u ON p.usuarioId = u._id
        LEFT JOIN puntos pt ON p.puntoId = pt._id
        LEFT JOIN zonas z ON pt.idZona = z._id
        WHERE p.eliminado = false
          AND p.carroId IS NOT NULL
          -- Filtrar por fechaEntrega = hoy (pedidos programados para hoy)
          -- fechaEntregado se devuelve sin filtro (todos los pedidos entregados, sin importar fecha)
          AND (
              p.fechaentrega IS NOT NULL
              AND TRIM(p.fechaentrega::TEXT) != ''
              AND safe_parse_fecha_entrega(p.fechaentrega::TEXT) = fecha_actual
          )
        -- Nota: Se muestran todos los pedidos programados para hoy (fechaEntrega = hoy)
        -- fechaEntregado se devuelve sin filtro para todos los pedidos entregados
        -- Para optimizar, asegúrese de tener índices en: eliminado, carroId, entregado, creado, fechaentrega, fechaentregado
    ),
    promedios_cliente AS (
        -- Calcular promedios de kilos por cliente de una sola vez para optimizar
        SELECT 
            p.usuarioId,
            COALESCE(AVG(
                CASE 
                    WHEN p.kilos IS NOT NULL 
                         AND TRIM(p.kilos) != '' 
                         AND p.kilos ~ '^[0-9]+\.?[0-9]*$' 
                    THEN p.kilos::NUMERIC
                    ELSE NULL
                END
            ), 0) as promedio_kilos
        FROM pedidos p
        WHERE p.entregado = true
          AND p.estado = 'activo'
          AND p.fechaentregado IS NOT NULL
          AND p.kilos IS NOT NULL
          AND TRIM(p.kilos) != ''
          AND p.kilos ~ '^[0-9]+\.?[0-9]*$'
          -- Nota: Se calculan promedios de todos los pedidos entregados con kilos válidos
          -- No filtramos por fecha para evitar problemas de conversión de tipos
        GROUP BY p.usuarioId
    ),
    pedidos_con_kilos AS (
        SELECT 
            pd.*,
            -- Calcular kilos: usar cantidadkl, luego parsear kilos, luego promedio del cliente, 
            -- y como último recurso usar get_kilos_pedido (solo si el promedio es 0 o NULL)
            CASE 
                -- Prioridad 1: cantidadkl si existe y es > 0
                WHEN pd.cantidadkl IS NOT NULL AND pd.cantidadkl > 0 THEN pd.cantidadkl::NUMERIC
                -- Prioridad 2: parsear kilos si es válido
                WHEN pd.kilos IS NOT NULL 
                     AND TRIM(pd.kilos) != '' 
                     AND pd.kilos ~ '^[0-9]+\.?[0-9]*$' 
                THEN pd.kilos::NUMERIC
                -- Prioridad 3: usar promedio del cliente si existe y es > 0
                WHEN pc.promedio_kilos IS NOT NULL AND pc.promedio_kilos > 0 THEN pc.promedio_kilos
                -- Prioridad 4: llamar a get_kilos_pedido como último recurso (puede ser lento pero asegura un valor)
                ELSE get_kilos_pedido(pd.cantidadkl, pd.usuarioId, pd.kilos)
            END as kilos_calculados
        FROM pedidos_asignados pd
        LEFT JOIN promedios_cliente pc ON pd.usuarioId = pc.usuarioId
    ),
    vehiculos_con_pedidos AS (
        SELECT DISTINCT
            c._id as vehiculo_id,
            c.placa,
            c.capacidad,
            c.conductor as conductor_id,
            u.nombre as conductor_nombre,
            u.avatar as conductor_avatar
        FROM carros c
        INNER JOIN pedidos_con_kilos p ON p.carroId = c._id
        LEFT JOIN users u ON c.conductor = u._id
        WHERE c.eliminado = false
          AND c.activo = true
    )
    SELECT 
        v.vehiculo_id,
        v.placa,
        v.conductor_id,
        v.conductor_nombre,
        v.conductor_avatar,
        v.capacidad,
        COUNT(p._id)::BIGINT as total_pedidos,
        COUNT(CASE WHEN p.entregado = true THEN 1 END)::BIGINT as pedidos_entregados,
        COALESCE(
            jsonb_agg(
                jsonb_build_object(
                    '_id', p._id,
                    'estado', p.estado,
                    'entregado', p.entregado,
                    'cliente', p.cliente_nombre,
                    'razon_social', p.cliente_razon_social,
                    'direccion', p.punto_direccion,
                    'punto_nombre', p.punto_nombre,
                    'zona', p.zona_nombre,
                    'coordenadas', p.punto_coordenadas,
                    'fechaEntrega', p.fechaentrega,
                    'fechaEntregado', p.fechaentregado,
                    'orden', p.orden,
                    'kilos', p.kilos_calculados,
                    'valor_total', p.valor_total,
                    'remision', p.remision,
                    'forma_pago', p.forma_pago
                ) ORDER BY p.orden ASC NULLS LAST, p._id ASC
            ) FILTER (WHERE p._id IS NOT NULL),
            '[]'::jsonb
        ) as pedidos
    FROM vehiculos_con_pedidos v
    LEFT JOIN pedidos_con_kilos p ON p.carroId = v.vehiculo_id
    GROUP BY 
        v.vehiculo_id,
        v.placa,
        v.capacidad,
        v.conductor_id,
        v.conductor_nombre,
        v.conductor_avatar
    ORDER BY v.placa ASC;
END;
$$;

COMMENT ON FUNCTION get_vehiculos_con_pedidos_dia IS 'Obtiene todos los vehículos con sus pedidos asignados programados para hoy (fechaEntrega = hoy). fechaEntregado se devuelve sin filtro para todos los pedidos entregados.';

-- Ejemplo de uso:
-- SELECT * FROM get_vehiculos_con_pedidos_dia();

