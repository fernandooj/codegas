CREATE OR REPLACE FUNCTION cerrar_alerta_tanque(
    _tanqueId INT,
    _cerradoText character varying,
    _usuarioCierra INT,
    _image_url character varying[]
)
RETURNS text
LANGUAGE plpgsql
AS $function$
DECLARE
    i INT;
BEGIN
    FOR i IN 1..array_length(_image_url, 1) LOOP
        UPDATE alertaTanques 
        SET alertaImagen[i] = _image_url[i], 
        cerradoText = _cerradoText,
        usuarioCierra = _usuarioCierra 
         WHERE _id = _tanqueId;
    END LOOP;

    RETURN 'Images added successfully';
END;
$function$;
