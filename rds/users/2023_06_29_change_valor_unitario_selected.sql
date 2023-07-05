CREATE OR REPLACE FUNCTION change_valor_unitario_selected(p_datos jsonb)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
    -- Recorre el array de datos
    FOR i IN 0 .. jsonb_array_length(p_datos) - 1 LOOP
        -- Obtiene el id y valor de cada elemento del array
        DECLARE
            v_id INT := (p_datos->i->>'_id')::INT;
            v_valor INT := (p_datos->i->>'valorUnitario')::INT;
        BEGIN
            -- Actualiza el usuario con el id correspondiente
            UPDATE users
            SET valorUnitario = v_valor
            WHERE _id = v_id;
        END;
    END LOOP;
END;
$$;


-- SELECT change_valor_unitario_todos('[{"_id": 20, "valorUnitario": 1500}, {"_id": 27, "valorUnitario": 1800}]'::jsonb);

