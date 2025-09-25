drop function if exists change_multiple_status;
CREATE OR REPLACE FUNCTION change_multiple_status(p_datos jsonb)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
    -- Recorre el array de datos
    FOR i IN 0 .. jsonb_array_length(p_datos) - 1 LOOP
        -- Obtiene el id, estado y motivo de cada elemento del array
        DECLARE
            v_id INT := (p_datos->i->>'_id')::INT;
            v_estado VARCHAR := (p_datos->i->>'estado')::VARCHAR;
            v_motivo_no_cierre VARCHAR := (p_datos->i->>'motivo_no_cierre')::VARCHAR;
        BEGIN
            -- Actualiza el pedido con el id correspondiente
            UPDATE pedidos
            SET estado = v_estado,
                motivo_no_cierre = COALESCE(v_motivo_no_cierre, motivo_no_cierre)
            WHERE _id = v_id;
        END;
    END LOOP;
END;
$$;


-- SELECT change_multiple_date_entrega('[{"_id": 20, "estado": "2023-05-17"}, {"_id": 27, "estado": "2023-05-17"}]'::jsonb);

