-- Función auxiliar para calcular los kilos de un pedido
-- Reglas:
-- 1. Si cantidadkl existe y no es null/0, usarlo
-- 2. Si no, calcular el promedio del último año del cliente basado en pedidos entregados

DROP FUNCTION IF EXISTS calculate_kilos_pedido(INT);

CREATE OR REPLACE FUNCTION calculate_kilos_pedido(_pedido_id INT)
RETURNS NUMERIC
LANGUAGE plpgsql
AS $$
DECLARE
    _cantidadkl NUMERIC;
    _usuarioid INT;
    _kilos_result NUMERIC;
    _promedio_kilos NUMERIC;
BEGIN
    -- Obtener cantidadkl y usuarioid del pedido
    SELECT p.cantidadKl, p.usuarioId
    INTO _cantidadkl, _usuarioid
    FROM pedidos p
    WHERE p._id = _pedido_id;
    
    -- Si cantidadkl existe y no es null/0, usarlo
    IF _cantidadkl IS NOT NULL AND _cantidadkl > 0 THEN
        RETURN _cantidadkl;
    END IF;
    
    -- Si no, calcular el promedio del último año del cliente
    -- Buscar pedidos entregados del último año del mismo cliente
    -- Convertir kilos (VARCHAR) a NUMERIC para el cálculo del promedio
    SELECT COALESCE(AVG(
        CASE 
            WHEN p.kilos IS NOT NULL AND TRIM(p.kilos) != '' THEN
                CASE 
                    WHEN p.kilos ~ '^[0-9]+\.?[0-9]*$' THEN p.kilos::NUMERIC
                    ELSE NULL
                END
            ELSE NULL
        END
    ), 0)
    INTO _promedio_kilos
    FROM pedidos p
    WHERE p.usuarioId = _usuarioid
      AND p.entregado = true
      AND p.estado = 'activo'
      AND p.fechaentregado IS NOT NULL
      AND p.kilos IS NOT NULL
      AND TRIM(p.kilos) != ''
      AND p.kilos ~ '^[0-9]+\.?[0-9]*$'; -- Solo valores numéricos válidos
    
    -- Si no hay promedio, retornar 0 o NULL
    RETURN COALESCE(_promedio_kilos, 0);
END;
$$;

COMMENT ON FUNCTION calculate_kilos_pedido IS 'Calcula los kilos de un pedido: usa cantidadkl si existe, sino calcula promedio del último año del cliente';

-- Ahora creamos una función que calcula los kilos en línea (para usar en SELECT)
-- Nota: kilos es VARCHAR en la tabla pedidos, así que aceptamos VARCHAR y hacemos casting
CREATE OR REPLACE FUNCTION get_kilos_pedido(
    _cantidadkl INT,
    _usuarioid INT,
    _kilos VARCHAR
)
RETURNS NUMERIC
LANGUAGE plpgsql
STABLE
AS $$
DECLARE
    _promedio_kilos NUMERIC;
    _kilos_numeric NUMERIC;
BEGIN
    -- Si cantidadkl existe y no es null/0, usarlo
    IF _cantidadkl IS NOT NULL AND _cantidadkl > 0 THEN
        RETURN _cantidadkl::NUMERIC;
    END IF;
    
    -- Si kilos ya existe y no es null/vacío, intentar convertirlo a numérico
    IF _kilos IS NOT NULL AND TRIM(_kilos) != '' THEN
        BEGIN
            _kilos_numeric := _kilos::NUMERIC;
            IF _kilos_numeric > 0 THEN
                RETURN _kilos_numeric;
            END IF;
        EXCEPTION
            WHEN OTHERS THEN
                -- Si no se puede convertir, continuar con el promedio
                NULL;
        END;
    END IF;
    
    -- Si no, calcular el promedio del último año del cliente
    -- Convertir kilos (VARCHAR) a NUMERIC para el cálculo del promedio
    SELECT COALESCE(AVG(
        CASE 
            WHEN p.kilos IS NOT NULL AND TRIM(p.kilos) != '' THEN
                CASE 
                    WHEN p.kilos ~ '^[0-9]+\.?[0-9]*$' THEN p.kilos::NUMERIC
                    ELSE NULL
                END
            ELSE NULL
        END
    ), 0)
    INTO _promedio_kilos
    FROM pedidos p
    WHERE p.usuarioId = _usuarioid
      AND p.entregado = true
      AND p.estado = 'activo'
      AND p.fechaentregado IS NOT NULL
      AND p.kilos IS NOT NULL
      AND TRIM(p.kilos) != ''
      AND p.kilos ~ '^[0-9]+\.?[0-9]*$'; -- Solo valores numéricos válidos
    
    -- Si no hay promedio, retornar 0
    RETURN COALESCE(_promedio_kilos, 0);
END;
$$;

COMMENT ON FUNCTION get_kilos_pedido IS 'Calcula los kilos de un pedido en línea: usa cantidadkl si existe, sino kilos, sino promedio del último año del cliente';

