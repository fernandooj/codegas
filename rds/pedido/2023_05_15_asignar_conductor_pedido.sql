drop function if exists asignar_conductor_pedido;
CREATE OR REPLACE FUNCTION asignar_conductor_pedido(
    _pedidoId INT,
    _carroId INT,
    _fechaEntrega VARCHAR(20),
    _usuarioAsigna INT
)
RETURNS text
LANGUAGE plpgsql
AS $function$
DECLARE
    new_id integer;
    idUser integer;
    idConductor integer;
    newOrden integer;
    fechaEntregaTimestamp TIMESTAMP; -- Variable para almacenar la fecha como TIMESTAMP
    fechaActual TIMESTAMP; -- Variable para almacenar la fecha actual del pedido
BEGIN
    -- Convertir la fecha solo si llega un valor
    IF _fechaEntrega IS NOT NULL AND _fechaEntrega != '' THEN
        fechaEntregaTimestamp := TO_TIMESTAMP(_fechaEntrega, 'YYYY-MM-DD HH24:MI:SS');
    END IF;
    
    SELECT conductor INTO idConductor FROM carros WHERE _id = _carroId;
    
    -- Obtener la fecha actual del pedido y calcular el nuevo orden
    SELECT fechaEntrega INTO fechaActual FROM pedidos WHERE _id = _pedidoId;
    
    -- Usar la nueva fecha si llega, o mantener la actual
    SELECT orden INTO newOrden 
    FROM pedidos 
    WHERE fechaEntrega = COALESCE(fechaEntregaTimestamp, fechaActual) 
    AND conductorId = idConductor;
    
    IF newOrden IS NULL THEN newOrden := 0+1; ELSE newOrden := newOrden + 1; END IF;

    UPDATE pedidos 
    SET carroId = _carroId, 
        conductorId = idConductor, 
        usuarioAsignaVehiculo = _usuarioAsigna, 
        orden = newOrden, 
        fechaEntrega = COALESCE(fechaEntregaTimestamp, fechaEntrega)
    WHERE _id = _pedidoId
    RETURNING _id INTO new_id;

    RETURN new_id::text;
END;
$function$;

--  SELECT save_pedidos('forma1', 100, 12345,  'frecuencia1',  'lunes', 'martes', '2023-05-15', 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ) ;

