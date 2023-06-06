CREATE FUNCTION save_tanques(
    _capacidad character varying,
    _placaText character varying,
    _fabricante character varying,
    _registroOnac character varying,
    _fechaUltimaRev character varying,
    _nPlaca character varying,
    _codigoActivo character varying,
    _serie character varying,
    _anoFabricacion character varying,
    _existeTanque character varying,
    _ultimRevTotal character varying,
    _propiedad character varying,
    _usuarioCrea INT
)
RETURNS INT  
LANGUAGE plpgsql
AS $function$
DECLARE
    inserted_id INT;  
BEGIN
    INSERT INTO tanques(capacidad, placaText, fabricante, registroOnac, fechaUltimaRev, nPlaca, codigoActivo, serie, anoFabricacion, existeTanque, ultimRevTotal, propiedad, usuarioCrea)
    VALUES (_capacidad, _placaText, _fabricante, _registroOnac, _fechaUltimaRev, _nPlaca, _codigoActivo, _serie, _anoFabricacion, _existeTanque, _ultimRevTotal, _propiedad, _usuarioCrea)
    RETURNING _id INTO inserted_id; 

    RETURN inserted_id; 
END;
$function$
