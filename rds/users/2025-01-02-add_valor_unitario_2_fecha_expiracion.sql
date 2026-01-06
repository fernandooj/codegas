-- Add valor_unitario_2 and fecha_expiracion to users table
-- Migration: 2025-01-02

-- Add valor_unitario_2 column
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS valor_unitario_2 INT;

-- Add fecha_expiracion column
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS fecha_expiracion DATE;

-- Add comments
COMMENT ON COLUMN users.valor_unitario_2 IS 'Segundo valor unitario para el usuario';
COMMENT ON COLUMN users.fecha_expiracion IS 'Fecha de expiración del usuario';

