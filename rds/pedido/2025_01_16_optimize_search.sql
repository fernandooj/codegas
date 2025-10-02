-- Optimización de la función de búsqueda de pedidos
-- Crear índices para mejorar el rendimiento de búsqueda

-- Índice para búsqueda en pedidos por campos principales
CREATE INDEX IF NOT EXISTS idx_pedidos_search_main 
ON pedidos USING gin(to_tsvector('spanish', 
    COALESCE(_id::text, '') || ' ' || 
    COALESCE(fechaSolicitud, '') || ' ' || 
    COALESCE(forma, '') || ' ' || 
    COALESCE(estado, '') || ' ' ||
    COALESCE(observacion, '')
));

-- Índice para búsqueda en users por campos principales
CREATE INDEX IF NOT EXISTS idx_users_search_main 
ON users USING gin(to_tsvector('spanish', 
    COALESCE(nombre, '') || ' ' || 
    COALESCE(razon_social, '') || ' ' || 
    COALESCE(cedula, '') || ' ' || 
    COALESCE(codt, '')
));

-- Índice para búsqueda en puntos
CREATE INDEX IF NOT EXISTS idx_puntos_search_main 
ON puntos USING gin(to_tsvector('spanish', 
    COALESCE(direccion, '') || ' ' || 
    COALESCE(observacion, '') || ' ' ||
    COALESCE(email, '') || ' ' ||
    COALESCE(celular, '') || ' ' ||
    COALESCE(nombre, '')
));

-- Índice compuesto para filtros comunes
CREATE INDEX IF NOT EXISTS idx_pedidos_estado_eliminado 
ON pedidos (estado, eliminado) WHERE eliminado = false;

-- Índice para conductor
CREATE INDEX IF NOT EXISTS idx_pedidos_conductor_fecha 
ON pedidos (conductorId, fechaEntrega) WHERE conductorId IS NOT NULL;

-- Función optimizada para búsqueda rápida
DROP FUNCTION IF EXISTS get_pedidos_search_optimized;

CREATE OR REPLACE FUNCTION get_pedidos_search_optimized(
    _usuarioId INT,
    _limit INT,
    _start INT,
    _acceso VARCHAR(10),
    _busqueda VARCHAR(255),
    _estado_filtro VARCHAR(20),
    _orden_por VARCHAR(50),
    _tipo_orden VARCHAR(4)
)
RETURNS TABLE (
    _id INT,
    creado TIMESTAMP,
    fechaSolicitud VARCHAR(255),
    fechaEntrega TIMESTAMP,
    forma VARCHAR(255),
    cantidadKl INT,
    kilos VARCHAR(30),
    cantidadPrecio INT,
    estado VARCHAR(255),
    entregado BOOLEAN,
    novedades BOOLEAN,
    imagenCerrar VARCHAR(255),
    valorUnitario INT,
    usuarioId INT,
    tokenPhone VARCHAR(30),
    email VARCHAR(30),
    valorUnitarioUsuario INT,
    codt VARCHAR(10),
    razon_social VARCHAR(255),
    nombre VARCHAR(255),
    cedula VARCHAR(20),
    direccion VARCHAR(255),
    capacidad VARCHAR(10),
    observacion VARCHAR(250),
    placa VARCHAR(10),
    zona VARCHAR(150),
    usuarioCrea VARCHAR(255),
    conductor VARCHAR(255),
    puntoId INT,
    motivo_no_cierre VARCHAR(255),
    perfil_novedad VARCHAR(255),
    factura VARCHAR(255),
    valor_total character varying,
    remision character varying,
    forma_pago character varying,
    observacion_pedido VARCHAR(255),
    coordenadas point,
    lat double precision,
    lng double precision,
    punto_email VARCHAR(255),
    punto_celular VARCHAR(255),
    punto_nombre VARCHAR(255),
    total INT
)
LANGUAGE plpgsql AS
$func$
DECLARE
    _total INT;
    _search_condition TEXT;
BEGIN
    -- Construir condición de búsqueda más eficiente
    IF _busqueda IS NOT NULL AND _busqueda != '' THEN
        _search_condition := '
            AND (
                p._id::text ILIKE ''%' || _busqueda || '%'' OR
                p.fechaSolicitud ILIKE ''%' || _busqueda || '%'' OR
                p.forma ILIKE ''%' || _busqueda || '%'' OR
                p.estado ILIKE ''%' || _busqueda || '%'' OR
                p.observacion ILIKE ''%' || _busqueda || '%'' OR
                u.nombre ILIKE ''%' || _busqueda || '%'' OR
                u.razon_social ILIKE ''%' || _busqueda || '%'' OR
                u.cedula ILIKE ''%' || _busqueda || '%'' OR
                u.codt ILIKE ''%' || _busqueda || '%'' OR
                pt.direccion ILIKE ''%' || _busqueda || '%'' OR
                pt.email ILIKE ''%' || _busqueda || '%'' OR
                pt.celular ILIKE ''%' || _busqueda || '%'' OR
                pt.nombre ILIKE ''%' || _busqueda || '%'' OR
                c.placa ILIKE ''%' || _busqueda || '%'' OR
                z.nombre ILIKE ''%' || _busqueda || '%''
            )';
    ELSE
        _search_condition := '';
    END IF;

    IF _acceso = 'admin' OR _acceso = 'despacho' OR _acceso = 'comercial' THEN
        -- Query optimizada para admin/despacho/comercial
        EXECUTE '
            SELECT COUNT(*) FROM pedidos p
            LEFT JOIN puntos pt ON p.puntoId = pt._id
            LEFT JOIN zonas z ON pt.idZona = z._id
            LEFT JOIN users u ON p.usuarioId = u._id
            LEFT JOIN users u2 ON p.usuarioCrea = u2._id
            LEFT JOIN carros c ON p.carroId = c._id
            LEFT JOIN users u3 ON p.conductorId = u3._id
            WHERE p.eliminado = false
            ' || _search_condition || '
            AND (
                $1 = ''todos'' OR 
                ($1 = ''espera'' AND p.estado = ''espera'') OR
                ($1 = ''noentregado'' AND p.estado = ''noentregado'') OR
                ($1 = ''innactivo'' AND p.estado = ''innactivo'') OR
                ($1 = ''activo'' AND p.estado = ''activo'' AND p.entregado = false AND (p.conductorId IS NULL OR p.fechaEntrega IS NULL)) OR
                ($1 = ''asignado'' AND p.estado = ''activo'' AND p.entregado = false AND p.conductorId IS NOT NULL AND p.fechaEntrega IS NOT NULL) OR
                ($1 = ''otro'' AND (
                    p.estado NOT IN (''espera'', ''noentregado'', ''innactivo'') AND 
                    NOT (p.estado = ''activo'' AND p.entregado = false)
                ))
            )
        ' INTO _total USING _estado_filtro;

        -- Query principal optimizada
        RETURN QUERY EXECUTE '
            SELECT p._id, p.creado, p.fechaSolicitud, p.fechaEntrega, p.forma, p.cantidadKl, p.kilos, p.cantidadPrecio, p.estado, p.entregado, p.novedades, p.imagenCerrar, p.valorUnitario, p.usuarioId, u.tokenPhone, u.email, u.valorUnitario, u.codt, u.razon_social, u.nombre, u.cedula, pt.direccion, pt.capacidad, pt.observacion, c.placa, z.nombre, u2.nombre, u3.nombre, p.puntoId, p.motivo_no_cierre, p.perfil_novedad, p.factura, p.valor_total, p.remision, p.forma_pago, p.observacion AS observacion_pedido, pt.coordenadas,
                   CASE WHEN pt.coordenadas IS NOT NULL THEN pt.coordenadas[1] ELSE NULL END AS lat,
                   CASE WHEN pt.coordenadas IS NOT NULL THEN pt.coordenadas[0] ELSE NULL END AS lng,
                   pt.email AS punto_email, pt.celular AS punto_celular, pt.nombre AS punto_nombre,
                   $1::INT
            FROM pedidos p
            LEFT JOIN puntos pt ON p.puntoId = pt._id
            LEFT JOIN zonas z ON pt.idZona = z._id
            LEFT JOIN users u ON p.usuarioId = u._id
            LEFT JOIN users u2 ON p.usuarioCrea = u2._id
            LEFT JOIN carros c ON p.carroId = c._id
            LEFT JOIN users u3 ON p.conductorId = u3._id
            WHERE p.eliminado = false
            ' || _search_condition || '
            AND (
                $2 = ''todos'' OR 
                ($2 = ''espera'' AND p.estado = ''espera'') OR
                ($2 = ''noentregado'' AND p.estado = ''noentregado'') OR
                ($2 = ''innactivo'' AND p.estado = ''innactivo'') OR
                ($2 = ''activo'' AND p.estado = ''activo'' AND p.entregado = false AND (p.conductorId IS NULL OR p.fechaEntrega IS NULL)) OR
                ($2 = ''asignado'' AND p.estado = ''activo'' AND p.entregado = false AND p.conductorId IS NOT NULL AND p.fechaEntrega IS NOT NULL) OR
                ($2 = ''otro'' AND (
                    p.estado NOT IN (''espera'', ''noentregado'', ''innactivo'') AND 
                    NOT (p.estado = ''activo'' AND p.entregado = false)
                ))
            )
            ORDER BY p._id DESC
            LIMIT $3 OFFSET $4
        ' USING _total, _estado_filtro, _limit, _start;

    ELSIF _acceso = 'conductor' THEN
        -- Query optimizada para conductor
        EXECUTE '
            SELECT COUNT(*) FROM pedidos p
            LEFT JOIN puntos pt ON p.puntoId = pt._id
            LEFT JOIN zonas z ON pt.idZona = z._id
            LEFT JOIN users u ON p.usuarioId = u._id
            LEFT JOIN users u2 ON p.usuarioCrea = u2._id
            LEFT JOIN carros c ON p.carroId = c._id
            LEFT JOIN users u3 ON p.conductorId = u3._id
            WHERE p.fechaEntrega > (now() - interval ''1 day'')
            AND p.eliminado = false
            AND p.conductorId = $1
            ' || _search_condition || '
            AND (
                $2 = ''todos'' OR 
                ($2 = ''espera'' AND p.estado = ''espera'') OR
                ($2 = ''noentregado'' AND p.estado = ''noentregado'') OR
                ($2 = ''innactivo'' AND p.estado = ''innactivo'') OR
                ($2 = ''activo'' AND p.estado = ''activo'' AND p.entregado = false AND (p.conductorId IS NULL OR p.fechaEntrega IS NULL)) OR
                ($2 = ''asignado'' AND p.estado = ''activo'' AND p.entregado = false AND p.conductorId IS NOT NULL AND p.fechaEntrega IS NOT NULL) OR
                ($2 = ''otro'' AND (
                    p.estado NOT IN (''espera'', ''noentregado'', ''innactivo'') AND 
                    NOT (p.estado = ''activo'' AND p.entregado = false)
                ))
            )
        ' INTO _total USING _usuarioId, _estado_filtro;

        RETURN QUERY EXECUTE '
            SELECT p._id, p.creado, p.fechaSolicitud, p.fechaEntrega, p.forma, p.cantidadKl, p.kilos, p.cantidadPrecio, p.estado, p.entregado, p.novedades, p.imagenCerrar, p.valorUnitario, p.usuarioId, u.tokenPhone, u.email, u.valorUnitario, u.codt, u.razon_social, u.nombre, u.cedula, pt.direccion, pt.capacidad, pt.observacion, c.placa, z.nombre, u2.nombre, u3.nombre, p.puntoId, p.motivo_no_cierre, p.perfil_novedad, p.factura, p.valor_total, p.remision, p.forma_pago, p.observacion AS observacion_pedido, pt.coordenadas,
                   CASE WHEN pt.coordenadas IS NOT NULL THEN pt.coordenadas[1] ELSE NULL END AS lat,
                   CASE WHEN pt.coordenadas IS NOT NULL THEN pt.coordenadas[0] ELSE NULL END AS lng,
                   pt.email AS punto_email, pt.celular AS punto_celular, pt.nombre AS punto_nombre,
                   $1::INT
            FROM pedidos p
            LEFT JOIN puntos pt ON p.puntoId = pt._id
            LEFT JOIN zonas z ON pt.idZona = z._id
            LEFT JOIN users u ON p.usuarioId = u._id
            LEFT JOIN users u2 ON p.usuarioCrea = u2._id
            LEFT JOIN carros c ON p.carroId = c._id
            LEFT JOIN users u3 ON p.conductorId = u3._id
            WHERE p.fechaEntrega > (now() - interval ''1 day'')
            AND p.eliminado = false
            AND p.conductorId = $2
            ' || _search_condition || '
            AND (
                $3 = ''todos'' OR 
                ($3 = ''espera'' AND p.estado = ''espera'') OR
                ($3 = ''noentregado'' AND p.estado = ''noentregado'') OR
                ($3 = ''innactivo'' AND p.estado = ''innactivo'') OR
                ($3 = ''activo'' AND p.estado = ''activo'' AND p.entregado = false AND (p.conductorId IS NULL OR p.fechaEntrega IS NULL)) OR
                ($3 = ''asignado'' AND p.estado = ''activo'' AND p.entregado = false AND p.conductorId IS NOT NULL AND p.fechaEntrega IS NOT NULL) OR
                ($3 = ''otro'' AND (
                    p.estado NOT IN (''espera'', ''noentregado'', ''innactivo'') AND 
                    NOT (p.estado = ''activo'' AND p.entregado = false)
                ))
            )
            ORDER BY p._id DESC
            LIMIT $4 OFFSET $5
        ' USING _total, _usuarioId, _estado_filtro, _limit, _start;

    ELSE
        -- Query optimizada para otros usuarios (cliente, etc.)
        EXECUTE '
            SELECT COUNT(*) FROM pedidos p
            LEFT JOIN puntos pt ON p.puntoId = pt._id
            LEFT JOIN zonas z ON pt.idZona = z._id
            LEFT JOIN users u ON p.usuarioId = u._id
            LEFT JOIN users u2 ON p.usuarioCrea = u2._id
            LEFT JOIN carros c ON p.carroId = c._id
            LEFT JOIN users u3 ON p.conductorId = u3._id
            WHERE p.usuarioId IN (
                WITH RECURSIVE arbol AS (
                    SELECT u._id
                    FROM users u
                    WHERE u._id = $1
                    UNION ALL
                    SELECT u._id
                    FROM users u
                    JOIN arbol a ON u.idPadre = a._id
                )
                SELECT arbol._id FROM arbol
            ) 
            AND p.eliminado = false
            ' || _search_condition || '
            AND (
                $2 = ''todos'' OR 
                ($2 = ''espera'' AND p.estado = ''espera'') OR
                ($2 = ''noentregado'' AND p.estado = ''noentregado'') OR
                ($2 = ''innactivo'' AND p.estado = ''innactivo'') OR
                ($2 = ''activo'' AND p.estado = ''activo'' AND p.entregado = false AND (p.conductorId IS NULL OR p.fechaEntrega IS NULL)) OR
                ($2 = ''asignado'' AND p.estado = ''activo'' AND p.entregado = false AND p.conductorId IS NOT NULL AND p.fechaEntrega IS NOT NULL) OR
                ($2 = ''otro'' AND (
                    p.estado NOT IN (''espera'', ''noentregado'', ''innactivo'') AND 
                    NOT (p.estado = ''activo'' AND p.entregado = false)
                ))
            )
        ' INTO _total USING _usuarioId, _estado_filtro;

        RETURN QUERY EXECUTE '
            SELECT p._id, p.creado, p.fechaSolicitud, p.fechaEntrega, p.forma, p.cantidadKl, p.kilos, p.cantidadPrecio, p.estado, p.entregado, p.novedades, p.imagenCerrar, p.valorUnitario, p.usuarioId, u.tokenPhone, u.email, u.valorUnitario AS valorUnitarioUsuario, u.codt, u.razon_social, u.nombre, u.cedula, pt.direccion, pt.capacidad, pt.observacion, c.placa, z.nombre AS zona, u2.nombre AS usuarioCrea, u3.nombre AS conductor, p.puntoId, p.motivo_no_cierre, p.perfil_novedad, p.factura, p.valor_total, p.remision, p.forma_pago, p.observacion AS observacion_pedido, pt.coordenadas,
                   CASE WHEN pt.coordenadas IS NOT NULL THEN pt.coordenadas[1] ELSE NULL END AS lat,
                   CASE WHEN pt.coordenadas IS NOT NULL THEN pt.coordenadas[0] ELSE NULL END AS lng,
                   pt.email AS punto_email, pt.celular AS punto_celular, pt.nombre AS punto_nombre,
                   $1::INT
            FROM pedidos p
            LEFT JOIN puntos pt ON p.puntoId = pt._id
            LEFT JOIN zonas z ON pt.idZona = z._id
            LEFT JOIN users u ON p.usuarioId = u._id
            LEFT JOIN users u2 ON p.usuarioCrea = u2._id
            LEFT JOIN carros c ON p.carroId = c._id
            LEFT JOIN users u3 ON p.conductorId = u3._id
            WHERE p.usuarioId IN (
                WITH RECURSIVE arbol AS (
                    SELECT u._id
                    FROM users u
                    WHERE u._id = $2
                    UNION ALL
                    SELECT u._id
                    FROM users u
                    JOIN arbol a ON u.idPadre = a._id
                )
                SELECT arbol._id FROM arbol
            ) 
            AND p.eliminado = false
            ' || _search_condition || '
            AND (
                $3 = ''todos'' OR 
                ($3 = ''espera'' AND p.estado = ''espera'') OR
                ($3 = ''noentregado'' AND p.estado = ''noentregado'') OR
                ($3 = ''innactivo'' AND p.estado = ''innactivo'') OR
                ($3 = ''activo'' AND p.estado = ''activo'' AND p.entregado = false AND (p.conductorId IS NULL OR p.fechaEntrega IS NULL)) OR
                ($3 = ''asignado'' AND p.estado = ''activo'' AND p.entregado = false AND p.conductorId IS NOT NULL AND p.fechaEntrega IS NOT NULL) OR
                ($3 = ''otro'' AND (
                    p.estado NOT IN (''espera'', ''noentregado'', ''innactivo'') AND 
                    NOT (p.estado = ''activo'' AND p.entregado = false)
                ))
            )
            ORDER BY p._id DESC
            LIMIT $4 OFFSET $5
        ' USING _total, _usuarioId, _estado_filtro, _limit, _start;
    END IF;

    RETURN;
END
$func$;
