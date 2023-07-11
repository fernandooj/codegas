CREATE OR REPLACE FUNCTION change_multiple_date_entrega(p_datos jsonb)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
    -- Recorre el array de datos
    FOR i IN 0 .. jsonb_array_length(p_datos) - 1 LOOP
        -- Obtiene el id y valor de cada elemento del array
        DECLARE
            v_id INT := (p_datos->i->>'_id')::INT;
            v_fechaentrega VARCHAR := (p_datos->i->>'fechaentrega')::VARCHAR;
        BEGIN
            -- Actualiza el usuario con el id correspondiente
            UPDATE pedidos
            SET fechaEntrega = v_fechaentrega
            WHERE _id = v_id;
        END;
    END LOOP;
END;
$$;


-- SELECT change_multiple_date_entrega('[{"_id": 20, "fechaEntrega": "2023-05-17"}, {"_id": 27, "fechaEntrega": "2023-05-17"}]'::jsonb);

