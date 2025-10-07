-- Update edit_carros function to include capacidad field
drop function if exists edit_carros;
CREATE OR REPLACE FUNCTION edit_carros(
    idUser INT,
    _centro INT,
    _bodega INT,
    _placa character varying,
    _capacidad INT DEFAULT 0,
    _activo BOOLEAN DEFAULT TRUE
)
RETURNS text
LANGUAGE plpgsql
AS $function$
DECLARE
    placa_exists boolean;
    new_id integer;
BEGIN
    -- Check if placa exists for other vehicles (excluding current one)
    SELECT EXISTS(SELECT 1 FROM carros WHERE placa = _placa AND _id != idUser) INTO placa_exists;
    
    IF placa_exists THEN
        RETURN null; 
    ELSE
        UPDATE carros 
        SET centro = _centro, 
            bodega = _bodega, 
            placa = _placa, 
            capacidad = _capacidad,
            activo = _activo
        WHERE _id = idUser
        RETURNING _id INTO new_id;
        RETURN new_id::text;
    END IF;
END;
$function$

-- Example usage: select * from edit_carros(1, 2, 4, 'ABC123', 1000, true);

