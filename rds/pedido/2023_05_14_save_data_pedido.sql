CREATE OR REPLACE FUNCTION save_pedidos(
    _forma character varying,
    _cantidadKl INT,
    _cantidadPrecio INT,
    _frecuencia character varying,
    _dia1 character varying,
    _dia2 character varying,
    _fechaSolicitud character varying,
    _puntoId INT,
    _usuarioCrea INT,
    _usuarioId INT,
    _pedidoPadre INT
)
RETURNS text
LANGUAGE plpgsql
AS $function$
DECLARE
    new_id integer;
    idUser integer;
    user_acceso character varying;
    user_valor_unitario integer;
BEGIN
    SELECT _id, acceso, valorunitario INTO idUser, user_acceso, user_valor_unitario FROM users WHERE _id = _usuarioCrea;

    IF user_acceso = 'cliente' THEN
        INSERT INTO pedidos(forma, cantidadKl, cantidadPrecio, frecuencia, dia1, dia2, fechaSolicitud, puntoId, valorUnitario, pedidoPadre, usuarioCrea, usuarioId)
        VALUES (_forma, _cantidadKl, _cantidadPrecio, _frecuencia, _dia1, _dia2, _fechaSolicitud, _puntoId, user_valor_unitario, _pedidoPadre, _usuarioCrea, idUser)
        RETURNING _id INTO new_id;
    ELSE
        INSERT INTO pedidos(forma, cantidadKl, cantidadPrecio, frecuencia, dia1, dia2, fechaSolicitud, valorUnitario, pedidoPadre, puntoId, usuarioCrea, usuarioId)
        VALUES (_forma, _cantidadKl, _cantidadPrecio, _frecuencia, _dia1, _dia2, _fechaSolicitud, user_valor_unitario, _pedidoPadre, _puntoId, _usuarioCrea, _usuarioId)
        RETURNING _id INTO new_id;
    END IF;

    RETURN new_id::text;
END;
$function$

--  SELECT save_pedidos('forma1', 100, 12345,  'frecuencia1',  'lunes', 'martes', '2023-05-15', 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ) ;

