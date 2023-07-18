CREATE or replace FUNCTION save_puntos(
    _direccion character varying,
    _capacidad character varying,
    _observacion character varying,
    _punto character varying,
    _coordenadas point,
    _place_name character varying,
    _idZona INT,
    _idCliente INT,
    _idPadre INT
)
RETURNS text
LANGUAGE plpgsql
AS $function$
 
BEGIN
    INSERT INTO puntos( direccion, capacidad, observacion, punto, place_name, coordenadas, idZona, idCliente, idPadre)
    VALUES(_direccion, _capacidad, _observacion, _punto, _place_name,  _coordenadas, _idZona, _idCliente, _idPadre);
    RETURN 'PUNTO creada exitosamente';
END;
$function$

-- select * from save_puntos('1', '2', '3','4', '4.6230545, -74.1910443', 5 ,6, 7);
