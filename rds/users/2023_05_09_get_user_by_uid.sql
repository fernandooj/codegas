CREATE FUNCTION get_user_by_uid(
    _uid character varying
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
    RETURN QUERY
    SELECT u._id, u.uid, u.created, u.razon_social, u.cedula, u.direccion_factura, u.email, u.nombre, u.celular, u.tipo, u.descuento, u.acceso, u.tokenPhone, u.token, u.codMagister, u.avatar, u.codt, u.codigoRegistro, u.valorUnitario, u.editado, u.activo, u.eliminado, u.idPadre, u2.nombre, u2.cedula
    FROM users u
    LEFT JOIN users u2 ON u.idPadre = u2._id
    WHERE u.uid = _uid;
END;
$function$;

