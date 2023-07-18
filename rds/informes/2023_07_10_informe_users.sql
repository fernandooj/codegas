CREATE OR REPLACE FUNCTION informe_get_users(
    _acceso character varying,
    _start character varying,
    _end character varying
)
RETURNS TABLE(
    _id INT,
    uid character varying,
    created	timestamp,
    razon_social character varying,
    cedula character varying,
    direccion_factura character varying,
    email	character varying,
    nombre	character varying,
    celular character varying,
    tipo 	character varying,
    descuento 	character varying,
    acceso		character varying,
    tokenPhone 	character varying,
    token	 	INT,
    codMagister character varying,
    avatar character varying,
    codt	character varying,
    codigoRegistro character varying,
    valorUnitario INT,
    editado BOOLEAN,
    activo  BOOLEAN,
    eliminado BOOLEAN,
    idPadre INT,
    nombrePadre character varying,
    cedulaPadre character varying,
    direccion varchar(45),
    observacion varchar,
    nombreZona varchar
)
LANGUAGE plpgsql
AS $function$
BEGIN
  IF _acceso = 'all' THEN
    RETURN QUERY
    SELECT u._id, u.uid, u.created, u.razon_social, u.cedula, u.direccion_factura, u.email, u.nombre, u.celular, u.tipo, u.descuento, u.acceso, u.tokenPhone, u.token, u.codMagister, u.avatar, u.codt, u.codigoRegistro, u.valorUnitario, u.editado, u.activo, u.eliminado, u.idPadre, u2.nombre, u2.cedula, null::varchar AS direccion, null::varchar AS observacion, null::varchar AS nombreZona
    FROM users u
    LEFT JOIN users u2 ON u.idPadre = u2._id
    WHERE u.created >= _start::timestamp AND u.created < (_end::timestamp + INTERVAL '1 day')
    order by u._id DESC;

  ELSIF _acceso = 'administradores' THEN
    RETURN QUERY
    SELECT u._id, u.uid, u.created, u.razon_social, u.cedula, u.direccion_factura, u.email, u.nombre, u.celular, u.tipo, u.descuento, u.acceso, u.tokenPhone, u.token, u.codMagister, u.avatar, u.codt, u.codigoRegistro, u.valorUnitario, u.editado, u.activo, u.eliminado, u.idPadre, u2.nombre, u2.cedula, null::varchar AS direccion, null::varchar AS observacion, null::varchar AS nombreZona
    FROM users u
    LEFT JOIN users u2 ON u.idPadre = u2._id
    WHERE u.created >= _start::timestamp AND u.created < (_end::timestamp + INTERVAL '1 day')
    AND u.acceso = 'admin' 
    OR u.acceso = 'veo' 
    OR u.acceso = 'comercial'
    order by u._id DESC;
      
 ELSIF _acceso = 'clientes' THEN
    RETURN QUERY
    SELECT users._id, users.uid, users.created, users.razon_social, users.cedula, users.direccion_factura, users.email, users.nombre, users.celular, users.tipo, users.descuento, users.acceso, users.tokenPhone, users.token, users.codMagister, users.avatar, users.codt, users.codigoRegistro, users.valorUnitario, users.editado, users.activo, users.eliminado, users.idPadre, p.direccion, u2.nombre AS nombrePadre, u2.cedula AS cedulaPadre, p.observacion, zonas.nombre AS nombreZona
    FROM puntos p
    INNER JOIN zonas ON p.idZona = zonas._id
    INNER JOIN users ON users._id = p.idCliente
    LEFT JOIN users u2 ON users.idPadre = u2._id 
    WHERE users.created >= _start::timestamp AND users.created < (_end::timestamp + INTERVAL '1 day')
    AND users.acceso = 'cliente'
    order by users._id DESC;

  ELSE
      RETURN QUERY
      SELECT u._id, u.uid, u.created, u.razon_social, u.cedula, u.direccion_factura, u.email, u.nombre, u.celular, u.tipo, u.descuento, u.acceso, u.tokenPhone, u.token, u.codMagister, u.avatar, u.codt, u.codigoRegistro, u.valorUnitario, u.editado, u.activo, u.eliminado, u.idPadre, u2.nombre, u2.cedula, null::varchar AS direccion, null::varchar AS observacion, null::varchar AS nombreZona
      FROM users u
      LEFT JOIN users u2 ON u.idPadre = u2._id
      WHERE u.created >= _start::timestamp AND u.created < (_end::timestamp + INTERVAL '1 day')
      AND u.acceso = 'conductor'
      order by u._id DESC;

  END IF;

  RETURN;
END;
$function$;
