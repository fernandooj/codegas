CREATE OR REPLACE FUNCTION update_user(
    p_id INT,
    p_uid character varying DEFAULT NULL,
    p_razon_social character varying DEFAULT NULL,
    p_cedula character varying DEFAULT NULL,
    p_direccion_factura character varying DEFAULT NULL,
    p_email character varying DEFAULT NULL,
    p_nombre character varying DEFAULT NULL,
    p_celular character varying DEFAULT NULL,
    p_tipo character varying DEFAULT NULL,
    p_descuento character varying DEFAULT NULL,
    p_acceso character varying DEFAULT NULL,
    p_tokenPhone character varying DEFAULT NULL,
    p_token INT DEFAULT NULL,
    p_codMagister character varying DEFAULT NULL,
    p_avatar character varying DEFAULT NULL,
    p_codt character varying DEFAULT NULL,
    p_codigoRegistro character varying DEFAULT NULL,
    p_valorUnitario INT DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
    UPDATE users
    SET 
        uid = COALESCE(p_uid, uid),
        razon_social = COALESCE(p_razon_social, razon_social),
        cedula = COALESCE(p_cedula, cedula),
        direccion_factura = COALESCE(p_direccion_factura, direccion_factura),
        email = COALESCE(p_email, email),
        nombre = COALESCE(p_nombre, nombre),
        celular = COALESCE(p_celular, celular),
        tipo = COALESCE(p_tipo, tipo),
        descuento = COALESCE(p_descuento, descuento),
        acceso = COALESCE(p_acceso, acceso),
        tokenPhone = COALESCE(p_tokenPhone, tokenPhone),
        token = COALESCE(p_token, token),
        codMagister = COALESCE(p_codMagister, codMagister),
        avatar = COALESCE(p_avatar, avatar),
        codt = COALESCE(p_codt, codt),
        codigoRegistro = COALESCE(p_codigoRegistro, codigoRegistro),
        valorUnitario = COALESCE(p_valorUnitario, valorUnitario)
    WHERE _id = p_id;
END;
$$ LANGUAGE plpgsql;
