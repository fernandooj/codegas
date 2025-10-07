-- Función para validar que un punto de entrega pertenece a un cliente específico
-- Esto previene errores de asignación incorrecta de puntos entre clientes

CREATE OR REPLACE FUNCTION validate_punto_belongs_to_cliente(
    _punto_id INT,
    _cliente_id INT
)
RETURNS TABLE (
    is_valid BOOLEAN,
    mensaje TEXT,
    punto_direccion TEXT,
    cliente_nombre TEXT
)
LANGUAGE plpgsql
AS $$
DECLARE
    punto_exists BOOLEAN;
    punto_belongs BOOLEAN;
    v_punto_direccion TEXT;
    v_cliente_nombre TEXT;
    v_punto_usuario_id INT;
BEGIN
    -- Verificar si el punto existe y está activo
    SELECT EXISTS(
        SELECT 1 FROM puntos WHERE _id = _punto_id AND activo = TRUE
    ) INTO punto_exists;

    IF NOT punto_exists THEN
        RETURN QUERY SELECT 
            FALSE as is_valid,
            'El punto de entrega no existe o está inactivo' as mensaje,
            NULL::TEXT as punto_direccion,
            NULL::TEXT as cliente_nombre;
        RETURN;
    END IF;

    -- Obtener información del punto y verificar si pertenece al cliente
    -- La tabla puntos usa idCliente, no usuario_id
    SELECT 
        puntos.direccion,
        puntos.idCliente,
        (puntos.idCliente = _cliente_id) as belongs
    INTO 
        v_punto_direccion,
        v_punto_usuario_id,
        punto_belongs
    FROM puntos
    WHERE puntos._id = _punto_id;

    -- Obtener nombre del cliente
    SELECT nombre INTO v_cliente_nombre
    FROM users
    WHERE _id = _cliente_id;

    IF punto_belongs THEN
        RETURN QUERY SELECT 
            TRUE as is_valid,
            'El punto de entrega pertenece al cliente' as mensaje,
            v_punto_direccion as punto_direccion,
            v_cliente_nombre as cliente_nombre;
    ELSE
        RETURN QUERY SELECT 
            FALSE as is_valid,
            FORMAT(
                'ERROR: El punto de entrega (ID: %s) no pertenece al cliente %s (ID: %s). El punto pertenece al usuario ID: %s',
                _punto_id,
                v_cliente_nombre,
                _cliente_id,
                v_punto_usuario_id
            ) as mensaje,
            v_punto_direccion as punto_direccion,
            v_cliente_nombre as cliente_nombre;
    END IF;
END;
$$;

-- Ejemplos de uso:
-- SELECT * FROM validate_punto_belongs_to_cliente(123, 456);
-- SELECT * FROM validate_punto_belongs_to_cliente(punto_id, cliente_id);

-- Comentarios:
-- Esta función retorna:
-- - is_valid: TRUE si el punto pertenece al cliente, FALSE si no
-- - mensaje: Descripción del resultado de la validación
-- - punto_direccion: Dirección del punto (si existe)
-- - cliente_nombre: Nombre del cliente

