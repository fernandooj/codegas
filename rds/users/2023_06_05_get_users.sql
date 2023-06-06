CREATE FUNCTION get_users(
    _limit INT,
    _start INT,
    _acceso character varying,
    _search character varying
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
    cedulaPadre character varying
)
LANGUAGE plpgsql
AS $function$
BEGIN
    IF _acceso = 'All' THEN
        RETURN QUERY
        SELECT u._id, u.uid, u.created, u.razon_social, u.cedula, u.direccion_factura, u.email, u.nombre, u.celular, u.tipo, u.descuento, u.acceso, u.tokenPhone, u.token, u.codMagister, u.avatar, u.codt, u.codigoRegistro, u.valorUnitario, u.editado, u.activo, u.eliminado, u.idPadre, u2.nombre, u2.cedula
        FROM users u
        LEFT JOIN users u2 ON u.idPadre = u2._id
        WHERE (CONCAT(u._id, u.uid, u.created, u.razon_social, u.cedula, u.direccion_factura, u.email, u.nombre, u.celular, u.tipo, u.descuento, u.acceso, u.tokenPhone, u.token, u.codMagister, u.avatar, u.codt, u.codigoRegistro, u.valorUnitario, u.editado, u.activo, u.eliminado, u.idPadre) ILIKE '%' || _search || '%')
        LIMIT _limit OFFSET _start;

    ELSIF _acceso = 'administradores' THEN
        RETURN QUERY
        SELECT u._id, u.uid, u.created, u.razon_social, u.cedula, u.direccion_factura, u.email, u.nombre, u.celular, u.tipo, u.descuento, u.acceso, u.tokenPhone, u.token, u.codMagister, u.avatar, u.codt, u.codigoRegistro, u.valorUnitario, u.editado, u.activo, u.eliminado, u.idPadre, u2.nombre, u2.cedula
        FROM users u
        LEFT JOIN users u2 ON u.idPadre = u2._id
        WHERE (CONCAT(u._id, u.uid, u.created, u.razon_social, u.cedula, u.direccion_factura, u.email, u.nombre, u.celular, u.tipo, u.descuento, u.acceso, u.tokenPhone, u.token, u.codMagister, u.avatar, u.codt, u.codigoRegistro, u.valorUnitario, u.editado, u.activo, u.eliminado, u.idPadre) ILIKE '%' || _search || '%')
        AND u.acceso = 'admin' 
        OR u.acceso = 'veo' 
        OR u.acceso = 'comercial'
        LIMIT _limit OFFSET _start;
        
    ELSIF _acceso = 'clientes' THEN
        RETURN QUERY
        SELECT u._id, u.uid, u.created, u.razon_social, u.cedula, u.direccion_factura, u.email, u.nombre, u.celular, u.tipo, u.descuento, u.acceso, u.tokenPhone, u.token, u.codMagister, u.avatar, u.codt, u.codigoRegistro, u.valorUnitario, u.editado, u.activo, u.eliminado, u.idPadre, u2.nombre, u2.cedula
        FROM users u
        LEFT JOIN users u2 ON u.idPadre = u2._id
        WHERE (CONCAT(u._id, u.uid, u.created, u.razon_social, u.cedula, u.direccion_factura, u.email, u.nombre, u.celular, u.tipo, u.descuento, u.acceso, u.tokenPhone, u.token, u.codMagister, u.avatar, u.codt, u.codigoRegistro, u.valorUnitario, u.editado, u.activo, u.eliminado, u.idPadre) ILIKE '%' || _search || '%')
        AND u.acceso = 'cliente'
        LIMIT _limit OFFSET _start;

    ELSE
        RETURN QUERY
        SELECT u._id, u.uid, u.created, u.razon_social, u.cedula, u.direccion_factura, u.email, u.nombre, u.celular, u.tipo, u.descuento, u.acceso, u.tokenPhone, u.token, u.codMagister, u.avatar, u.codt, u.codigoRegistro, u.valorUnitario, u.editado, u.activo, u.eliminado, u.idPadre, u2.nombre, u2.cedula
        FROM users u
        LEFT JOIN users u2 ON u.idPadre = u2._id
        WHERE (CONCAT(u._id, u.uid, u.created, u.razon_social, u.cedula, u.direccion_factura, u.email, u.nombre, u.celular, u.tipo, u.descuento, u.acceso, u.tokenPhone, u.token, u.codMagister, u.avatar, u.codt, u.codigoRegistro, u.valorUnitario, u.editado, u.activo, u.eliminado, u.idPadre) ILIKE '%' || _search || '%')
        AND u.acceso != 'cliente'
        LIMIT _limit OFFSET _start;

    END IF;

    RETURN;
END;
$function$;
