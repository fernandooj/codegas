CREATE FUNCTION get_user_by_email(
    _email character varying
)
RETURNS TABLE(
    id_user INT,
    id_mongo character varying,
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
    idPadre INT
)
LANGUAGE plpgsql
AS $function$
BEGIN
    RETURN QUERY
    SELECT u.id_user, u.id_mongo, u.uid, u.created, u.razon_social, u.cedula, u.direccion_factura, u.email, u.nombre, u.celular, u.tipo, u.descuento, u.acceso, u.tokenPhone, u.token, u.codMagister, u.avatar, u.codt, u.codigoRegistro, u.valorUnitario, u.editado, u.activo, u.eliminado, u.idPadre
    FROM users u
    WHERE u.email = _email;
END;
$function$;


-- select get_categorie_by_uid(1)

