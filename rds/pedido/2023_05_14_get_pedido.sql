CREATE OR REPLACE FUNCTION get_pedidos(
    _usuarioId INT,
    _limit INT,
    _start INT,
    _acceso VARCHAR(10),
    _busqueda VARCHAR(255)
)
RETURNS TABLE (
    _id INT,
    creado TIMESTAMP,
    fechaSolicitud VARCHAR(255),
    fechaEntrega VARCHAR(255),
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
    observacion_pedido VARCHAR(255),
    total INT
)
LANGUAGE plpgsql AS
$func$
DECLARE
    _total INT;
BEGIN
    IF _acceso = 'admin' THEN
        SELECT COUNT(*) INTO _total 
        FROM pedidos p
        LEFT JOIN puntos pt ON p.puntoId = pt._id
        LEFT JOIN zonas z ON pt.idZona = z._id
        LEFT JOIN users u ON p.usuarioId = u._id
        LEFT JOIN users u2 ON p.usuarioCrea = u2._id
        LEFT JOIN carros c ON p.carroId = c._id
        LEFT JOIN users u3 ON p.conductorId = u3._id
        WHERE p.eliminado = false
        AND (CONCAT(p._id, p.creado, p.fechaSolicitud, p.fechaEntrega, p.forma, p.cantidadKl, p.kilos, p.cantidadPrecio, p.estado, p.imagenCerrar, p.valorUnitario, u.codt, u.razon_social, u.nombre, u.cedula, pt.direccion, pt.capacidad, pt.observacion, c.placa, z.nombre, u2.nombre, u3.nombre, p.motivo_no_cierre, p.perfil_novedad, p.observacion) ILIKE '%' || _busqueda || '%');

        RETURN QUERY 
        SELECT p._id, p.creado, p.fechaSolicitud, p.fechaEntrega, p.forma, p.cantidadKl, p.kilos, p.cantidadPrecio, p.estado, p.entregado, p.novedades, p.imagenCerrar, p.valorUnitario, p.usuarioId, u.tokenPhone, u.email, u.valorUnitario, u.codt, u.razon_social, u.nombre, u.cedula, pt.direccion, pt.capacidad, pt.observacion, c.placa, z.nombre, u2.nombre, u3.nombre, p.puntoId, p.motivo_no_cierre, p.perfil_novedad, p.observacion AS observacion_pedido, _total
        FROM pedidos p
        LEFT JOIN puntos pt ON p.puntoId = pt._id
        LEFT JOIN zonas z ON pt.idZona = z._id
        LEFT JOIN users u ON p.usuarioId = u._id
        LEFT JOIN users u2 ON p.usuarioCrea = u2._id
        LEFT JOIN carros c ON p.carroId = c._id
        LEFT JOIN users u3 ON p.conductorId = u3._id
        WHERE p.eliminado = false
        AND (CONCAT(p._id, p.creado, p.fechaSolicitud, p.fechaEntrega, p.forma, p.cantidadKl, p.kilos, p.cantidadPrecio, p.estado, p.imagenCerrar, p.valorUnitario, p.usuarioId, u.codt, u.razon_social, u.nombre, u.cedula, pt.direccion, pt.capacidad, pt.observacion, c.placa, z.nombre, u2.nombre, u3.nombre, p.motivo_no_cierre, p.perfil_novedad, p.observacion) ILIKE '%' || _busqueda || '%')
        ORDER BY p._id DESC
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
        AND p.conductorId = _usuarioId;

        RETURN QUERY 
        SELECT p._id, p.creado, p.fechaSolicitud, p.fechaEntrega, p.forma, p.cantidadKl, p.kilos, p.cantidadPrecio, p.estado, p.entregado, p.novedades, p.imagenCerrar, p.valorUnitario, p.usuarioId, u.tokenPhone, u.email, u.valorUnitario, u.codt, u.razon_social, u.nombre, u.cedula, pt.direccion, pt.capacidad, pt.observacion, c.placa, z.nombre, u2.nombre, u3.nombre, p.puntoId, p.motivo_no_cierre, p.perfil_novedad, p.observacion AS observacion_pedido, _total
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
        LIMIT _limit
        OFFSET _start;

    ELSE
        RETURN QUERY
        SELECT p._id, p.creado, p.fechaSolicitud, p.fechaEntrega, p.forma, p.cantidadKl, p.kilos, p.cantidadPrecio, p.estado, p.entregado, p.novedades, p.imagenCerrar, p.valorUnitario, p.usuarioId, u.tokenPhone, u.email, u.valorUnitario AS valorUnitarioUsuario, u.codt, u.razon_social, u.nombre, u.cedula, pt.direccion, pt.capacidad, pt.observacion, c.placa, z.nombre AS zona, u2.nombre AS usuarioCrea, u3.nombre AS conductor, p.puntoId, p.motivo_no_cierre, p.perfil_novedad, p.observacion AS observacion_pedido, _total
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
        ORDER BY p._id DESC
        LIMIT _limit
        OFFSET _start;
    END IF;

    RETURN;
END
$func$;
