-- Script para actualizar la función get_pedidos con los campos del punto
-- Ejecutar este script en la base de datos PostgreSQL

DROP FUNCTION IF EXISTS get_pedidos;

CREATE OR REPLACE FUNCTION get_pedidos(
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
    valor_total    character varying,
    remision       character varying,
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
    _query TEXT;
BEGIN
    IF _acceso = 'admin' OR _acceso = 'despacho' OR _acceso = 'comercial' THEN
        SELECT COUNT(*) INTO _total 
        FROM pedidos p
        LEFT JOIN puntos pt ON p.puntoId = pt._id
        LEFT JOIN zonas z ON pt.idZona = z._id
        LEFT JOIN users u ON p.usuarioId = u._id
        LEFT JOIN users u2 ON p.usuarioCrea = u2._id
        LEFT JOIN carros c ON p.carroId = c._id
        LEFT JOIN users u3 ON p.conductorId = u3._id
        WHERE p.eliminado = false
        AND (CONCAT(p._id, p.creado, p.fechaSolicitud, p.fechaEntrega, p.forma, p.cantidadKl, p.kilos, p.cantidadPrecio, p.estado, p.imagenCerrar, p.valorUnitario, u.codt, u.razon_social, u.nombre, u.cedula, pt.direccion, pt.capacidad, pt.observacion, c.placa, z.nombre, u2.nombre, u3.nombre, p.motivo_no_cierre, p.perfil_novedad, p.observacion) ILIKE '%' || _busqueda || '%')
        AND (
            _estado_filtro = 'todos' OR 
            (_estado_filtro = 'espera' AND p.estado = 'espera') OR
            (_estado_filtro = 'noentregado' AND p.estado = 'noentregado') OR
            (_estado_filtro = 'innactivo' AND p.estado = 'innactivo') OR
            (_estado_filtro = 'activo' AND p.estado = 'activo' AND p.entregado = false AND (p.conductorId IS NULL OR p.fechaEntrega IS NULL)) OR
            (_estado_filtro = 'asignado' AND p.estado = 'activo' AND p.entregado = false AND p.conductorId IS NOT NULL AND p.fechaEntrega IS NOT NULL) OR
            (_estado_filtro = 'otro' AND (
                p.estado NOT IN ('espera', 'noentregado', 'innactivo') AND 
                NOT (p.estado = 'activo' AND p.entregado = false)
            ))
        );

        RETURN QUERY 
        SELECT p._id, p.creado, p.fechaSolicitud, p.fechaEntrega, p.forma, p.cantidadKl, p.kilos, p.cantidadPrecio, p.estado, p.entregado, p.novedades, p.imagenCerrar, p.valorUnitario, p.usuarioId, u.tokenPhone, u.email, u.valorUnitario, u.codt, u.razon_social, u.nombre, u.cedula, pt.direccion, pt.capacidad, pt.observacion, c.placa, z.nombre, u2.nombre, u3.nombre, p.puntoId, p.motivo_no_cierre, p.perfil_novedad, p.factura, p.valor_total, p.remision, p.forma_pago, p.observacion AS observacion_pedido, pt.coordenadas,
               CASE WHEN pt.coordenadas IS NOT NULL THEN pt.coordenadas[1] ELSE NULL END AS lat,
               CASE WHEN pt.coordenadas IS NOT NULL THEN pt.coordenadas[0] ELSE NULL END AS lng,
               pt.email AS punto_email, pt.celular AS punto_celular, pt.nombre AS punto_nombre,
               _total
        FROM pedidos p
        LEFT JOIN puntos pt ON p.puntoId = pt._id
        LEFT JOIN zonas z ON pt.idZona = z._id
        LEFT JOIN users u ON p.usuarioId = u._id
        LEFT JOIN users u2 ON p.usuarioCrea = u2._id
        LEFT JOIN carros c ON p.carroId = c._id
        LEFT JOIN users u3 ON p.conductorId = u3._id
        WHERE p.eliminado = false
        AND (CONCAT(p._id, p.creado, p.fechaSolicitud, p.fechaEntrega, p.forma, p.cantidadKl, p.kilos, p.cantidadPrecio, p.estado, p.imagenCerrar, p.valorUnitario, p.usuarioId, u.codt, u.razon_social, u.nombre, u.cedula, pt.direccion, pt.capacidad, pt.observacion, c.placa, z.nombre, u2.nombre, u3.nombre, p.motivo_no_cierre, p.perfil_novedad, p.observacion) ILIKE '%' || _busqueda || '%')
        AND (
            _estado_filtro = 'todos' OR 
            (_estado_filtro = 'espera' AND p.estado = 'espera') OR
            (_estado_filtro = 'noentregado' AND p.estado = 'noentregado') OR
            (_estado_filtro = 'innactivo' AND p.estado = 'innactivo') OR
            (_estado_filtro = 'activo' AND p.estado = 'activo' AND p.entregado = false AND (p.conductorId IS NULL OR p.fechaEntrega IS NULL)) OR
            (_estado_filtro = 'asignado' AND p.estado = 'activo' AND p.entregado = false AND p.conductorId IS NOT NULL AND p.fechaEntrega IS NOT NULL) OR
            (_estado_filtro = 'otro' AND (
                p.estado NOT IN ('espera', 'noentregado', 'innactivo') AND 
                NOT (p.estado = 'activo' AND p.entregado = false)
            ))
        )
        ORDER BY 
            CASE 
                WHEN _orden_por = 'fecha_creacion' AND _tipo_orden = 'DESC' THEN p._id
                WHEN _orden_por = 'precio' AND _tipo_orden = 'DESC' THEN p.cantidadPrecio
                WHEN _orden_por = 'cantidad' AND _tipo_orden = 'DESC' THEN p.cantidadKl
                ELSE NULL
            END DESC NULLS LAST,
            CASE 
                WHEN _orden_por = 'fecha_creacion' AND _tipo_orden = 'ASC' THEN p._id
                WHEN _orden_por = 'precio' AND _tipo_orden = 'ASC' THEN p.cantidadPrecio
                WHEN _orden_por = 'cantidad' AND _tipo_orden = 'ASC' THEN p.cantidadKl
                ELSE NULL
            END ASC NULLS LAST,
            CASE 
                WHEN _orden_por = 'razon_social' AND _tipo_orden = 'DESC' THEN u.razon_social
                WHEN _orden_por = 'nombre_cliente' AND _tipo_orden = 'DESC' THEN u.nombre
                WHEN _orden_por = 'vehiculo' AND _tipo_orden = 'DESC' THEN c.placa
                WHEN _orden_por = 'fecha_solicitud' AND _tipo_orden = 'DESC' THEN p.fechaSolicitud
                ELSE NULL
            END DESC NULLS LAST,
            CASE 
                WHEN _orden_por = 'razon_social' AND _tipo_orden = 'ASC' THEN u.razon_social
                WHEN _orden_por = 'nombre_cliente' AND _tipo_orden = 'ASC' THEN u.nombre
                WHEN _orden_por = 'vehiculo' AND _tipo_orden = 'ASC' THEN c.placa
                WHEN _orden_por = 'fecha_solicitud' AND _tipo_orden = 'ASC' THEN p.fechaSolicitud
                ELSE NULL
            END ASC NULLS LAST,
            p._id DESC
        LIMIT _limit OFFSET _start;

    ELSIF _acceso = 'conductor' THEN
        SELECT COUNT(*) INTO _total 
        FROM pedidos p
        LEFT JOIN puntos pt ON p.puntoId = pt._id
        LEFT JOIN zonas z ON pt.idZona = z._id
        LEFT JOIN users u ON p.usuarioId = u._id
        LEFT JOIN users u2 ON p.usuarioCrea = u2._id
        LEFT JOIN carros c ON p.carroId = c._id
        LEFT JOIN users u3 ON p.conductorId = u3._id
        WHERE p.fechaEntrega > (now() - interval '1 day')
        AND p.eliminado = false
        AND p.conductorId = _usuarioId
        AND (
            _estado_filtro = 'todos' OR 
            (_estado_filtro = 'espera' AND p.estado = 'espera') OR
            (_estado_filtro = 'noentregado' AND p.estado = 'noentregado') OR
            (_estado_filtro = 'innactivo' AND p.estado = 'innactivo') OR
            (_estado_filtro = 'activo' AND p.estado = 'activo' AND p.entregado = false AND (p.conductorId IS NULL OR p.fechaEntrega IS NULL)) OR
            (_estado_filtro = 'asignado' AND p.estado = 'activo' AND p.entregado = false AND p.conductorId IS NOT NULL AND p.fechaEntrega IS NOT NULL) OR
            (_estado_filtro = 'otro' AND (
                p.estado NOT IN ('espera', 'noentregado', 'innactivo') AND 
                NOT (p.estado = 'activo' AND p.entregado = false)
            ))
        );

        RETURN QUERY 
        SELECT p._id, p.creado, p.fechaSolicitud, p.fechaEntrega, p.forma, p.cantidadKl, p.kilos, p.cantidadPrecio, p.estado, p.entregado, p.novedades, p.imagenCerrar, p.valorUnitario, p.usuarioId, u.tokenPhone, u.email, u.valorUnitario, u.codt, u.razon_social, u.nombre, u.cedula, pt.direccion, pt.capacidad, pt.observacion, c.placa, z.nombre, u2.nombre, u3.nombre, p.puntoId, p.motivo_no_cierre, p.perfil_novedad, p.factura, p.valor_total, p.remision, p.forma_pago, p.observacion AS observacion_pedido, pt.coordenadas,
               CASE WHEN pt.coordenadas IS NOT NULL THEN pt.coordenadas[1] ELSE NULL END AS lat,
               CASE WHEN pt.coordenadas IS NOT NULL THEN pt.coordenadas[0] ELSE NULL END AS lng,
               pt.email AS punto_email, pt.celular AS punto_celular, pt.nombre AS punto_nombre,
               _total
        FROM pedidos p
        LEFT JOIN puntos pt ON p.puntoId = pt._id
        LEFT JOIN zonas z ON pt.idZona = z._id
        LEFT JOIN users u ON p.usuarioId = u._id
        LEFT JOIN users u2 ON p.usuarioCrea = u2._id
        LEFT JOIN carros c ON p.carroId = c._id
        LEFT JOIN users u3 ON p.conductorId = u3._id
        WHERE p.fechaEntrega > (now() - interval '1 day')
        AND p.eliminado = false
        AND p.conductorId = _usuarioId
        AND (
            _estado_filtro = 'todos' OR 
            (_estado_filtro = 'espera' AND p.estado = 'espera') OR
            (_estado_filtro = 'noentregado' AND p.estado = 'noentregado') OR
            (_estado_filtro = 'innactivo' AND p.estado = 'innactivo') OR
            (_estado_filtro = 'activo' AND p.estado = 'activo' AND p.entregado = false AND (p.conductorId IS NULL OR p.fechaEntrega IS NULL)) OR
            (_estado_filtro = 'asignado' AND p.estado = 'activo' AND p.entregado = false AND p.conductorId IS NOT NULL AND p.fechaEntrega IS NOT NULL) OR
            (_estado_filtro = 'otro' AND (
                p.estado NOT IN ('espera', 'noentregado', 'innactivo') AND 
                NOT (p.estado = 'activo' AND p.entregado = false)
            ))
        )
        ORDER BY 
            CASE 
                WHEN _orden_por = 'fecha_creacion' AND _tipo_orden = 'DESC' THEN p._id
                WHEN _orden_por = 'precio' AND _tipo_orden = 'DESC' THEN p.cantidadPrecio
                WHEN _orden_por = 'cantidad' AND _tipo_orden = 'DESC' THEN p.cantidadKl
                ELSE NULL
            END DESC NULLS LAST,
            CASE 
                WHEN _orden_por = 'fecha_creacion' AND _tipo_orden = 'ASC' THEN p._id
                WHEN _orden_por = 'precio' AND _tipo_orden = 'ASC' THEN p.cantidadPrecio
                WHEN _orden_por = 'cantidad' AND _tipo_orden = 'ASC' THEN p.cantidadKl
                ELSE NULL
            END ASC NULLS LAST,
            CASE 
                WHEN _orden_por = 'razon_social' AND _tipo_orden = 'DESC' THEN u.razon_social
                WHEN _orden_por = 'nombre_cliente' AND _tipo_orden = 'DESC' THEN u.nombre
                WHEN _orden_por = 'vehiculo' AND _tipo_orden = 'DESC' THEN c.placa
                WHEN _orden_por = 'fecha_solicitud' AND _tipo_orden = 'DESC' THEN p.fechaSolicitud
                ELSE NULL
            END DESC NULLS LAST,
            CASE 
                WHEN _orden_por = 'razon_social' AND _tipo_orden = 'ASC' THEN u.razon_social
                WHEN _orden_por = 'nombre_cliente' AND _tipo_orden = 'ASC' THEN u.nombre
                WHEN _orden_por = 'vehiculo' AND _tipo_orden = 'ASC' THEN c.placa
                WHEN _orden_por = 'fecha_solicitud' AND _tipo_orden = 'ASC' THEN p.fechaSolicitud
                ELSE NULL
            END ASC NULLS LAST,
            p._id DESC
        LIMIT _limit
        OFFSET _start;

    ELSE
        RETURN QUERY
        SELECT p._id, p.creado, p.fechaSolicitud, p.fechaEntrega, p.forma, p.cantidadKl, p.kilos, p.cantidadPrecio, p.estado, p.entregado, p.novedades, p.imagenCerrar, p.valorUnitario, p.usuarioId, u.tokenPhone, u.email, u.valorUnitario AS valorUnitarioUsuario, u.codt, u.razon_social, u.nombre, u.cedula, pt.direccion, pt.capacidad, pt.observacion, c.placa, z.nombre AS zona, u2.nombre AS usuarioCrea, u3.nombre AS conductor, p.puntoId, p.motivo_no_cierre, p.perfil_novedad, p.factura, p.valor_total, p.remision, p.forma_pago, p.observacion AS observacion_pedido, pt.coordenadas,
               CASE WHEN pt.coordenadas IS NOT NULL THEN pt.coordenadas[1] ELSE NULL END AS lat,
               CASE WHEN pt.coordenadas IS NOT NULL THEN pt.coordenadas[0] ELSE NULL END AS lng,
               pt.email AS punto_email, pt.celular AS punto_celular, pt.nombre AS punto_nombre,
               _total
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
                WHERE u._id = _usuarioId
                UNION ALL
                SELECT u._id
                FROM users u
                JOIN arbol a ON u.idPadre = a._id
            )
            SELECT arbol._id FROM arbol
        ) 
        AND p.eliminado = false
        AND (CONCAT(p._id, p.creado, p.fechaSolicitud, p.fechaEntrega, p.forma, p.cantidadKl, p.kilos, p.cantidadPrecio, p.estado, p.imagenCerrar, p.valorUnitario, u.codt, u.razon_social, u.nombre, u.cedula, pt.direccion, pt.capacidad, pt.observacion, c.placa, z.nombre, u2.nombre, u3.nombre, p.motivo_no_cierre, p.perfil_novedad, p.observacion) ILIKE '%' || _busqueda || '%')
        AND (
            _estado_filtro = 'todos' OR 
            (_estado_filtro = 'espera' AND p.estado = 'espera') OR
            (_estado_filtro = 'noentregado' AND p.estado = 'noentregado') OR
            (_estado_filtro = 'innactivo' AND p.estado = 'innactivo') OR
            (_estado_filtro = 'activo' AND p.estado = 'activo' AND p.entregado = false AND (p.conductorId IS NULL OR p.fechaEntrega IS NULL)) OR
            (_estado_filtro = 'asignado' AND p.estado = 'activo' AND p.entregado = false AND p.conductorId IS NOT NULL AND p.fechaEntrega IS NOT NULL) OR
            (_estado_filtro = 'otro' AND (
                p.estado NOT IN ('espera', 'noentregado', 'innactivo') AND 
                NOT (p.estado = 'activo' AND p.entregado = false)
            ))
        )
        ORDER BY 
            CASE 
                WHEN _orden_por = 'fecha_creacion' AND _tipo_orden = 'DESC' THEN p._id
                WHEN _orden_por = 'precio' AND _tipo_orden = 'DESC' THEN p.cantidadPrecio
                WHEN _orden_por = 'cantidad' AND _tipo_orden = 'DESC' THEN p.cantidadKl
                ELSE NULL
            END DESC NULLS LAST,
            CASE 
                WHEN _orden_por = 'fecha_creacion' AND _tipo_orden = 'ASC' THEN p._id
                WHEN _orden_por = 'precio' AND _tipo_orden = 'ASC' THEN p.cantidadPrecio
                WHEN _orden_por = 'cantidad' AND _tipo_orden = 'ASC' THEN p.cantidadKl
                ELSE NULL
            END ASC NULLS LAST,
            CASE 
                WHEN _orden_por = 'razon_social' AND _tipo_orden = 'DESC' THEN u.razon_social
                WHEN _orden_por = 'nombre_cliente' AND _tipo_orden = 'DESC' THEN u.nombre
                WHEN _orden_por = 'vehiculo' AND _tipo_orden = 'DESC' THEN c.placa
                WHEN _orden_por = 'fecha_solicitud' AND _tipo_orden = 'DESC' THEN p.fechaSolicitud
                ELSE NULL
            END DESC NULLS LAST,
            CASE 
                WHEN _orden_por = 'razon_social' AND _tipo_orden = 'ASC' THEN u.razon_social
                WHEN _orden_por = 'nombre_cliente' AND _tipo_orden = 'ASC' THEN u.nombre
                WHEN _orden_por = 'vehiculo' AND _tipo_orden = 'ASC' THEN c.placa
                WHEN _orden_por = 'fecha_solicitud' AND _tipo_orden = 'ASC' THEN p.fechaSolicitud
                ELSE NULL
            END ASC NULLS LAST,
            p._id DESC
        LIMIT _limit
        OFFSET _start;
    END IF;

    RETURN;
END
$func$;

-- Verificar que la función se creó correctamente
SELECT routine_name, routine_type 
FROM information_schema.routines 
WHERE routine_name = 'get_pedidos';
