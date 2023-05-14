CREATE FUNCTION edit_carros(
    idUser INT,
    _centro INT,
    _bodega INT,
    _placa character varying
)
RETURNS text
LANGUAGE plpgsql
AS $function$
DECLARE
    placa_exists boolean;
    new_id integer;
BEGIN
    SELECT EXISTS(SELECT 1 FROM carros WHERE placa = _placa) INTO placa_exists;
    
    IF placa_exists THEN
        RETURN null; 
    ELSE
        UPDATE carros SET centro = _centro, bodega = _bodega, placa = _placa WHERE _id = idUser
        RETURNING _id INTO new_id;
        RETURN new_id::text;
    END IF;
END;
$function$

--select * from edit_carros(1, 2, 4, '3');
