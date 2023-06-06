CREATE OR REPLACE FUNCTION add_images_tanque(
    _tanqueId INT,
    _type character varying,
    _image_url character varying[]
)
RETURNS text
LANGUAGE plpgsql
AS $function$
DECLARE
    i INT;
BEGIN
    IF _type = 'placa' THEN
        FOR i IN 1..array_length(_image_url, 1) LOOP
            UPDATE tanques 
            SET placa[i] = _image_url[i]
            WHERE _id = _tanqueId;
        END LOOP;
    ELSIF _type = 'placaMantenimiento' THEN
        FOR i IN 1..array_length(_image_url, 1) LOOP
            UPDATE tanques 
            SET placamantenimiento[i] = _image_url[i]
            WHERE _id = _tanqueId;
        END LOOP;
    ELSIF _type = 'placaFabricante' THEN
        FOR i IN 1..array_length(_image_url, 1) LOOP
            UPDATE tanques 
            SET placaFabricante[i] = _image_url[i]
            WHERE _id = _tanqueId;
        END LOOP;
    ELSIF _type = 'dossier' THEN
        FOR i IN 1..array_length(_image_url, 1) LOOP
            UPDATE tanques 
            SET dossier[i] = _image_url[i]
            WHERE _id = _tanqueId;
        END LOOP;
    ELSIF _type = 'cerFabricante' THEN
        FOR i IN 1..array_length(_image_url, 1) LOOP
            UPDATE tanques 
            SET cerFabricante[i] = _image_url[i]
            WHERE _id = _tanqueId;
        END LOOP;
    ELSIF _type = 'cerOnac' THEN
        FOR i IN 1..array_length(_image_url, 1) LOOP
            UPDATE tanques 
            SET cerOnac[i] = _image_url[i]
            WHERE _id = _tanqueId;
        END LOOP;
    ELSIF _type = 'visual' THEN
        FOR i IN 1..array_length(_image_url, 1) LOOP
            UPDATE tanques 
            SET visual[i] = _image_url[i]
            WHERE _id = _tanqueId;
        END LOOP;
    ELSE
        -- Handle the case when the field name is unknown or unsupported
        RAISE EXCEPTION 'Unknown field name: %', _type;
    END IF;

    RETURN 'Images added successfully';
END;
$function$;
