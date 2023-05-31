CREATE FUNCTION save_tanques(
    _capacidad character varying,
	_placaText          character varying,
	_fabricante		   character varying,
	_registroOnac  	   character varying,
	_fechaUltimaRev     character varying,
	_nPlaca         	   character varying,
	_codigoActivo       character varying,
	_serie              character varying,
	_anoFabricacion	   character varying,
	_existeTanque	   character varying,
	_ultimRevTotal	   character varying,
	_propiedad	   	   character varying,
    _usuarioId INT,
    _usuarioCrea INT,
    _zonaId INT,
    _puntoId INT
)
RETURNS text
LANGUAGE plpgsql
AS $function$
 
BEGIN
    INSERT INTO tanques(capacidad, placaText, fabricante, registroOnac, fechaUltimaRev, nPlaca, codigoActivo, serie, anoFabricacion, existeTanque, ultimRevTotal, propiedad, usuarioId, usuarioCrea, zonaId, puntoId )
    VALUES(_capacidad, _placaText,  _fabricante, _registroOnac, _fechaUltimaRev, _nPlaca, _codigoActivo, _serie, _anoFabricacion, _existeTanque, _ultimRevTotal, _propiedad, _usuarioId, _usuarioCrea, _zonaId, _puntoId);
    RETURN 'tanque creado exitosamente';
END;
$function$

-- select * from save_tanques('40', 'zzzz', 'nosotros','987', '2020-10-10', '12', '5489', '989', '2030', 'si', '20-12-12', 'nuestra', 1, 6, 7, 9);
