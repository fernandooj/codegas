CREATE FUNCTION save_zonas(
    _nombre character varying
)
RETURNS text -- especifica el tipo de dato que se va a devolver
LANGUAGE plpgsql
AS $function$
BEGIN
    INSERT INTO zonas(nombre)
    VALUES(_nombre);
    
    RETURN 'Zona creada exitosamente'; -- devuelve un valor de texto
END;
$function$


-- select * from save_zonas('1123aew', 'zona norte');
