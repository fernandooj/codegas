CREATE FUNCTION save_users(
    _razon_social character varying,
    _uid character varying,
    _cedula character varying,
    _direccion_factura character varying,
    _email character varying,
    _nombre character varying,
    _celular character varying,
    _tipo character varying,
    _descuento character varying,
    _acceso character varying,
    _tokenPhone character varying,
    _token INT,
    _codMagister character varying,
    _codt character varying,
    _codigoRegistro character varying,
    _valorUnitario INT,
    _idPadre INT
)
RETURNS text
LANGUAGE plpgsql
AS $function$
DECLARE
    email_exists boolean;
    new_id integer;
BEGIN
    SELECT EXISTS(SELECT 1 FROM users WHERE email = _email) INTO email_exists;
    
    IF email_exists THEN
        RETURN null; 
    ELSE
        INSERT INTO users(razon_social, cedula, direccion_factura, email, nombre, celular, tipo, descuento, acceso, tokenPhone, token, codMagister, codt, codigoRegistro, valorUnitario, idPadre, uid)
        VALUES(_razon_social, _cedula, _direccion_factura, _email, _nombre, _celular, _tipo, _descuento, _acceso, _tokenPhone, _token, _codMagister, _codt, _codigoRegistro, _valorUnitario, _idPadre, _uid)
        RETURNING _id INTO new_id;
        RETURN new_id::text;
    END IF;
END;
$function$

-- select * from save_users('1', '2', '3', '4');
