DROP FUNCTION IF EXISTS change_orden_fecha_entrega;
CREATE OR REPLACE FUNCTION change_orden_fecha_entrega(p_datos jsonb)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
    -- Recorre el array de datos
    FOR i IN 0 .. jsonb_array_length(p_datos) - 1 LOOP
        -- Obtiene el id, orden y fechaEntrega de cada elemento del array
        DECLARE
            v_id INT := (p_datos->i->>'_id')::INT;
            v_orden INT := (p_datos->i->>'orden')::INT;
            v_fechaentrega TEXT := p_datos->i->>'fechaEntrega';
            v_fechaentrega_timestamp TIMESTAMP;
        BEGIN
            -- Convertir la fecha si viene
            IF v_fechaentrega IS NOT NULL AND v_fechaentrega != '' THEN
                BEGIN
                    -- Normalizar el formato de fecha: reemplazar 'T' con espacio
                    v_fechaentrega := REPLACE(v_fechaentrega, 'T', ' ');
                    
                    -- Remover zona horaria (Z, +HH:MM, -HH:MM)
                    -- Buscar 'Z' al final
                    IF v_fechaentrega LIKE '%Z' THEN
                        v_fechaentrega := SUBSTRING(v_fechaentrega FROM 1 FOR LENGTH(v_fechaentrega) - 1);
                    END IF;
                    
                    -- Buscar '+' o '-' después de la hora (después de posición 19 que es "YYYY-MM-DD HH:MI:SS")
                    IF LENGTH(v_fechaentrega) > 19 THEN
                        -- Si tiene más de 19 caracteres, probablemente tiene zona horaria
                        IF SUBSTRING(v_fechaentrega FROM 20 FOR 1) IN ('+', '-') THEN
                            v_fechaentrega := SUBSTRING(v_fechaentrega FROM 1 FOR 19);
                        END IF;
                    END IF;
                    
                    -- Si solo tiene fecha sin hora, agregar hora por defecto
                    IF LENGTH(TRIM(v_fechaentrega)) = 10 THEN
                        v_fechaentrega := v_fechaentrega || ' 00:00:00';
                    END IF;
                    
                    -- Parsear la fecha (PostgreSQL puede manejar varios formatos)
                    v_fechaentrega_timestamp := v_fechaentrega::TIMESTAMP;
                EXCEPTION
                    WHEN OTHERS THEN
                        -- Si falla, intentar solo con la fecha
                        BEGIN
                            IF LENGTH(TRIM(v_fechaentrega)) >= 10 THEN
                                v_fechaentrega_timestamp := SUBSTRING(v_fechaentrega FROM 1 FOR 10)::DATE;
                            ELSE
                                v_fechaentrega_timestamp := NULL;
                            END IF;
                        EXCEPTION
                            WHEN OTHERS THEN
                                v_fechaentrega_timestamp := NULL;
                        END;
                END;
            END IF;
            
            -- Actualiza el pedido con el id correspondiente
            UPDATE pedidos
            SET orden = v_orden,
                fechaEntrega = COALESCE(v_fechaentrega_timestamp, fechaEntrega)
            WHERE _id = v_id;
        END;
    END LOOP;
END;
$$;

-- SELECT change_orden_fecha_entrega('[{"_id": 89949, "orden": 1, "fechaEntrega": "2023-05-17 00:00:00"}]'::jsonb);

