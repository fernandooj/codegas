CREATE OR REPLACE FUNCTION finalizar_pedidos(
    _pedidoId INT,
    _kilos character varying,
    _factura character varying,
    _valor_total character varying,
    _forma_pago character varying,
    _remision character varying,
    _fechaEntrega character varying,
    _imagenCerrar character varying,
    _conductorId INT
)
RETURNS text
LANGUAGE plpgsql
AS $function$
DECLARE
    new_id integer;
    _entregado BOOLEAN;
    newOrden integer;
    _fechaEntregado timestamp;
BEGIN
    _entregado := true;
    _fechaEntregado := now();
    SELECT orden_cerrado INTO newOrden FROM pedidos WHERE fechaEntrega = _fechaEntrega AND conductorId = _conductorId AND entregado = true;
    IF newOrden IS NULL THEN newOrden := 0+1; ELSE newOrden := newOrden + 1; END IF;
    
    UPDATE pedidos 
    SET entregado = _entregado,
    kilos = _kilos,
    factura = _factura,
    valor_total = _valor_total,
    forma_pago = _forma_pago,
    remision = _remision,
    orden_cerrado = newOrden,
    imagenCerrar = _imagenCerrar,
    fechaEntregado = _fechaEntregado
    WHERE _id = _pedidoId
        RETURNING _id INTO new_id;

    RETURN new_id::text;
END;
$function$

--  SELECT save_pedidos('forma1', 100, 12345,  'frecuencia1',  'lunes', 'martes', '2023-05-15', 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ) ;

