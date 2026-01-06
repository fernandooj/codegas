-- Agregar campos de firmas a la tabla pedidos
-- Fecha: 2025-11-06
-- Descripción: Agregar campos para almacenar URLs de firmas digitales del conductor y usuario

ALTER TABLE pedidos
ADD COLUMN IF NOT EXISTS firma_conductor VARCHAR(255),
ADD COLUMN IF NOT EXISTS firma_usuario VARCHAR(255);

-- Comentarios para documentar los campos
COMMENT ON COLUMN pedidos.firma_conductor IS 'URL de la imagen de firma del conductor';
COMMENT ON COLUMN pedidos.firma_usuario IS 'URL de la imagen de firma del usuario/cliente';
