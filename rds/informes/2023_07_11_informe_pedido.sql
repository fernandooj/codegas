CREATE OR REPLACE FUNCTION informe_get_pedidos(
    _start character varying,
    _end character varying,
    _type character varying
)
RETURNS TABLE (
    _id INT,
    codt VARCHAR(10),
    cedula VARCHAR(20),
    razon_social VARCHAR(255),
    direccion VARCHAR(255),
    zona VARCHAR(150),
    creado TIMESTAMP,
    fechaSolicitud VARCHAR(255),
    estado VARCHAR(255),
    fechaEntrega VARCHAR(255),
    cantidadKl INT,
    cantidadPrecio INT,
    usuarioCrea VARCHAR(255),
    usuarioAsigna VARCHAR(255),
    usuarioAsignaVehiculo VARCHAR(255),
    placa VARCHAR(10),
    centro INT,
    bodega INT,
    conductor VARCHAR(255),
    imagenCerrar VARCHAR(255),
    motivo_no_cierre VARCHAR(255),
    remision VARCHAR(255),
    valorunitarioUser INT,
    valorunitario INT,
    valor_total VARCHAR(255),
    forma_pago VARCHAR(255),
    factura VARCHAR(255)
)
LANGUAGE plpgsql AS
$func$
DECLARE
    _total INT;
BEGIN
    
  IF _type = 'all' THEN
    RETURN QUERY 
    SELECT p._id, u.codt, u.cedula, u.razon_social, pt.direccion, z.nombre, p.creado, p.fechaSolicitud, p.estado, p.fechaEntrega, p.cantidadKl, p.cantidadPrecio, u2.nombre, u4.nombre, u5.nombre,  c.placa, c.centro, c.bodega, u3.nombre, p.imagenCerrar, p.motivo_no_cierre, p.remision, u.valorUnitario, p.valorunitario, p.valor_total, p.forma_pago, p.factura 
    FROM pedidos p
    LEFT JOIN puntos pt ON p.puntoId = pt._id
    LEFT JOIN zonas z ON pt.idZona = z._id
    LEFT JOIN users u ON p.usuarioId = u._id
    LEFT JOIN users u2 ON p.usuarioCrea = u2._id
    LEFT JOIN carros c ON p.carroId = c._id
    LEFT JOIN users u3 ON p.conductorId = u3._id
    LEFT JOIN users u4 ON p.usuarioAsigna = u4._id
    LEFT JOIN users u5 ON p.usuarioAsignaVehiculo = u5._id
    WHERE p.creado >= _start::timestamp AND p.creado < _end::timestamp
    AND  p.eliminado = false
    ORDER BY p._id DESC;
  
  ELSIF _type = 'entregado' THEN
    RETURN QUERY 
    SELECT p._id, u.codt, u.cedula, u.razon_social, pt.direccion, z.nombre, p.creado, p.fechaSolicitud, p.estado, p.fechaEntrega, p.cantidadKl, p.cantidadPrecio, u2.nombre, u4.nombre, u5.nombre,  c.placa, c.centro, c.bodega, u3.nombre, p.imagenCerrar, p.motivo_no_cierre, p.remision, u.valorUnitario, p.valorunitario, p.valor_total, p.forma_pago, p.factura 
    FROM pedidos p
    LEFT JOIN puntos pt ON p.puntoId = pt._id
    LEFT JOIN zonas z ON pt.idZona = z._id
    LEFT JOIN users u ON p.usuarioId = u._id
    LEFT JOIN users u2 ON p.usuarioCrea = u2._id
    LEFT JOIN carros c ON p.carroId = c._id
    LEFT JOIN users u3 ON p.conductorId = u3._id
    LEFT JOIN users u4 ON p.usuarioAsigna = u4._id
    LEFT JOIN users u5 ON p.usuarioAsignaVehiculo = u5._id
    WHERE p.creado >= _start::timestamp AND p.creado < _end::timestamp
    AND p.eliminado = false
    AND p.estado = 'activo'
    AND p.entregado = true
    ORDER BY p._id DESC;

  ELSE
    RETURN QUERY 
    SELECT p._id, u.codt, u.cedula, u.razon_social, pt.direccion, z.nombre, p.creado, p.fechaSolicitud, p.estado, p.fechaEntrega, p.cantidadKl, p.cantidadPrecio, u2.nombre, u4.nombre, u5.nombre,  c.placa, c.centro, c.bodega, u3.nombre, p.imagenCerrar, p.motivo_no_cierre, p.remision, u.valorUnitario, p.valorunitario, p.valor_total, p.forma_pago, p.factura 
    FROM pedidos p
    LEFT JOIN puntos pt ON p.puntoId = pt._id
    LEFT JOIN zonas z ON pt.idZona = z._id
    LEFT JOIN users u ON p.usuarioId = u._id
    LEFT JOIN users u2 ON p.usuarioCrea = u2._id
    LEFT JOIN carros c ON p.carroId = c._id
    LEFT JOIN users u3 ON p.conductorId = u3._id
    LEFT JOIN users u4 ON p.usuarioAsigna = u4._id
    LEFT JOIN users u5 ON p.usuarioAsignaVehiculo = u5._id
    WHERE p.creado >= _start::timestamp AND p.creado < _end::timestamp
    AND p.eliminado = false
    AND p.estado = 'noentregado'
    AND p.entregado = true
    ORDER BY p._id DESC;

  END IF;

  RETURN;
END
$func$;

