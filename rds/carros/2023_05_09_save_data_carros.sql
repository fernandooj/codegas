CREATE FUNCTION save_carros(
    _centro INT,
    _bodega INT,
    _placa character varying,
    _conductor INT,
    _usuarioCrea INT
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
        INSERT INTO carros(centro, bodega, placa, conductor, usuarioCrea)
        VALUES(_centro, _bodega, _placa, _conductor, _usuarioCrea)
        RETURNING _id INTO new_id;
        RETURN new_id::text;
    END IF;
END;
$function$

-- select * from save_carros(1, 2, '3', 4, 5);
