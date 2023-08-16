CREATE OR REPLACE FUNCTION novedad_pedidos(
    _pedidoId INT,
    _novedad character varying,
    _perfil_novedad character varying,
    _fechaEntrega character varying,
    _conductorId INT
)
RETURNS text
LANGUAGE plpgsql
AS $function$
DECLARE
    new_id integer;
    _entregado BOOLEAN;
    _novedades BOOLEAN;
    newOrden integer;
    _fechaEntregado TIMESTAMP DEFAULT NOW() - INTERVAL '5 hours';
    fechaEntregaTimestamp TIMESTAMP;
    _estado VARCHAR(11);
BEGIN
    _entregado := true;
    _novedades := true;
    _fechaEntregado := now() - INTERVAL '5 hours';
    fechaEntregaTimestamp := TO_TIMESTAMP(_fechaEntrega, 'YYYY-MM-DD HH24:MI:SS');
    _estado := 'noentregado';
    SELECT orden_cerrado INTO newOrden FROM pedidos WHERE fechaEntrega = fechaEntregaTimestamp AND conductorId = _conductorId AND entregado = true;
    IF newOrden IS NULL THEN newOrden := 0+1; ELSE newOrden := newOrden + 1; END IF;
    
    UPDATE pedidos 
    SET entregado = _entregado,
    estado = _estado,
    orden_cerrado = newOrden,
    motivo_no_cierre = _novedad,
    perfil_novedad = _perfil_novedad,
    fechaEntregado = _fechaEntregado,
    novedades = _novedades
    WHERE _id = _pedidoId
        RETURNING _id INTO new_id;

    RETURN new_id::text;
END;
$function$

--  SELECT save_pedidos('forma1', 100, 12345,  'frecuencia1',  'lunes', 'martes', '2023-05-15', 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ) ;

