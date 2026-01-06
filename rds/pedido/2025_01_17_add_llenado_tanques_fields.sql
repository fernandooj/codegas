-- Agregar campos de llenado de tanques a la tabla pedidos
ALTER TABLE pedidos
ADD COLUMN IF NOT EXISTS presion_inicial NUMERIC(10, 2),
ADD COLUMN IF NOT EXISTS presion_final NUMERIC(10, 2),
ADD COLUMN IF NOT EXISTS porcentaje_inicial NUMERIC(5, 2),
ADD COLUMN IF NOT EXISTS porcentaje_final NUMERIC(5, 2);

COMMENT ON COLUMN pedidos.presion_inicial IS 'Presión inicial del tanque en PSI';
COMMENT ON COLUMN pedidos.presion_final IS 'Presión final del tanque en PSI';
COMMENT ON COLUMN pedidos.porcentaje_inicial IS 'Porcentaje inicial de llenado del tanque';
COMMENT ON COLUMN pedidos.porcentaje_final IS 'Porcentaje final de llenado del tanque';

