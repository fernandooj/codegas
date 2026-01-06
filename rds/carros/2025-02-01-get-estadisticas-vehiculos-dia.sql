-- Función para obtener estadísticas detalladas de vehículos con pedidos del día actual
-- Incluye información completa de cada pedido con estados y horas de entrega
-- Esta función es una extensión de get_vehiculos_con_pedidos_dia con más detalles

DROP FUNCTION IF EXISTS get_estadisticas_vehiculos_dia();

CREATE OR REPLACE FUNCTION get_estadisticas_vehiculos_dia()
RETURNS TABLE (
    vehiculo_id INT,
    placa VARCHAR,
    conductor_id INT,
    conductor_nombre VARCHAR,
    conductor_avatar VARCHAR,
    capacidad INT,
    total_pedidos BIGINT,
    pedidos_entregados BIGINT,
    pedidos_en_ruta BIGINT,
    pedidos_no_entregados BIGINT,
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
            z.nombre as zona_nombre,
            -- Determinar estado del pedido
            CASE 
                WHEN p.entregado = true THEN 'entregado'
                WHEN p.estado = 'activo' OR p.estado = 'en_ruta' THEN 'en_ruta'
                ELSE 'no_entregado'
            END as estado_calculado
        FROM pedidos p
        LEFT JOIN users u ON p.usuarioId = u._id
        LEFT JOIN puntos pt ON p.puntoId = pt._id
        LEFT JOIN zonas z ON pt.idZona = z._id
        WHERE p.eliminado = false
          AND p.carroId IS NOT NULL
          -- Filtrar por fechaEntrega = hoy (pedidos programados para hoy)
          AND (
              p.fechaentrega IS NOT NULL
              AND TRIM(p.fechaentrega::TEXT) != ''
              AND safe_parse_fecha_entrega(p.fechaentrega::TEXT) = fecha_actual
          )
    ),
    promedios_cliente AS (
        -- Calcular promedios de kilos por cliente
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
        GROUP BY p.usuarioId
    ),
    pedidos_con_kilos AS (
        SELECT 
            pd.*,
            -- Calcular kilos
            CASE 
                WHEN pd.cantidadkl IS NOT NULL AND pd.cantidadkl > 0 THEN pd.cantidadkl::NUMERIC
                WHEN pd.kilos IS NOT NULL 
                     AND TRIM(pd.kilos) != '' 
                     AND pd.kilos ~ '^[0-9]+\.?[0-9]*$' 
                THEN pd.kilos::NUMERIC
                WHEN pc.promedio_kilos IS NOT NULL AND pc.promedio_kilos > 0 THEN pc.promedio_kilos
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
        COUNT(CASE WHEN p.estado_calculado = 'en_ruta' THEN 1 END)::BIGINT as pedidos_en_ruta,
        COUNT(CASE WHEN p.estado_calculado = 'no_entregado' THEN 1 END)::BIGINT as pedidos_no_entregados,
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
                    'forma_pago', p.forma_pago,
                    'puntoId', p.puntoId,
                    'usuarioId', p.usuarioId
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

COMMENT ON FUNCTION get_estadisticas_vehiculos_dia IS 'Obtiene estadísticas detalladas de vehículos con sus pedidos asignados programados para hoy (fechaEntrega = hoy). fechaEntregado se devuelve sin filtro para todos los pedidos entregados.';

-- Ejemplo de uso:
-- SELECT * FROM get_estadisticas_vehiculos_dia();

