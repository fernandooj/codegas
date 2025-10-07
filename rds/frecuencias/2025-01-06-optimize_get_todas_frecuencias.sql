-- Optimización de la función get_todas_frecuencias
-- Mejoras: 
-- 1. Agregar información del punto de entrega
-- 2. Limitar resultados para carga más rápida
-- 3. Agregar índices sugeridos al final

DROP FUNCTION IF EXISTS get_todas_frecuencias();

CREATE OR REPLACE FUNCTION get_todas_frecuencias()
RETURNS TABLE (
    dia INT,
    pedido_id INT,
    dia1 INT,
    dia2 INT,
    forma VARCHAR(255),
    frecuencia VARCHAR(255),
    cantidadKl INT,
    cantidadPrecio INT,
    usuarioId INT,
    puntoId INT,
    usuarioCrea INT,
    valorUnitario INT,
    nombre VARCHAR(255),
    razon_social VARCHAR(255),
    codt VARCHAR(255),
    punto_direccion VARCHAR(255),
    punto_capacidad VARCHAR(255)
)
LANGUAGE plpgsql AS
$func$
DECLARE
    currentDayOfMonth INT;
BEGIN
    currentDayOfMonth := EXTRACT(DAY FROM current_date)+1;

    SET TIME ZONE 'America/Bogota';

    RETURN QUERY 
        SELECT 
            currentDayOfMonth,
            p._id,
            p.dia1,
            p.dia2,
            p.forma,
            p.frecuencia,
            p.cantidadKl,
            p.cantidadPrecio,
            p.usuarioId,
            p.puntoId,
            p.usuarioCrea,
            u.valorUnitario,
            u.nombre,
            u.razon_social,
            u.codt,
            pt.direccion as punto_direccion,
            pt.capacidad as punto_capacidad
        FROM pedidos p
        JOIN users u ON u._id = p.usuarioId
        LEFT JOIN puntos pt ON pt._id = p.puntoId
        WHERE (p.frecuencia = 'semanal' OR p.frecuencia = 'quincenal' OR p.frecuencia = 'mensual')
        AND p.eliminado = FALSE
        ORDER BY p._id DESC
        LIMIT 500; -- Limitar a 500 resultados para mejorar performance

    RETURN;
END
$func$;

-- Índices sugeridos para mejorar el rendimiento (ejecutar si no existen):
-- CREATE INDEX IF NOT EXISTS idx_pedidos_frecuencia ON pedidos(frecuencia) WHERE eliminado = FALSE;
-- CREATE INDEX IF NOT EXISTS idx_pedidos_usuario ON pedidos(usuarioId);
-- CREATE INDEX IF NOT EXISTS idx_pedidos_punto ON pedidos(puntoId);
-- CREATE INDEX IF NOT EXISTS idx_users_id ON users(_id);
-- CREATE INDEX IF NOT EXISTS idx_puntos_id ON puntos(_id);

-- Test:
-- SELECT * FROM get_todas_frecuencias();

