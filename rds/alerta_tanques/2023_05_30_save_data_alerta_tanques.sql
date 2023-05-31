CREATE FUNCTION save_alerta_tanques(
    _alertaText character varying,
    _tanqueId INT,
    _usuarioCrea INT
)
RETURNS text
LANGUAGE plpgsql
AS $function$
 
BEGIN
INSERT INTO alertaTanques(alertaText, tanqueId, usuarioCrea)
    VALUES(_alertaText, _tanqueId, _usuarioCrea);
    RETURN 'alerta creada exitosamente';
END;
$function$


select * from save_alerta_tanques('alerta de prueba 3', 2, 1)
