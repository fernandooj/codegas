-- Create table for scheduled date changes
-- Migration: 2025-01-XX

CREATE TABLE IF NOT EXISTS fechas_programadas_valor (
    _id SERIAL PRIMARY KEY,
    fecha_aplicar DATE NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT (NOW() AT TIME ZONE 'America/Bogota'),
    ejecutado BOOLEAN DEFAULT FALSE,
    fecha_ejecucion TIMESTAMP,
    usuarios_actualizados INT DEFAULT 0,
    creado_por VARCHAR(255),
    observaciones TEXT
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_fechas_programadas_fecha ON fechas_programadas_valor(fecha_aplicar);
CREATE INDEX IF NOT EXISTS idx_fechas_programadas_ejecutado ON fechas_programadas_valor(ejecutado);

-- Add comments
COMMENT ON TABLE fechas_programadas_valor IS 'Tabla para almacenar fechas programadas para aplicar cambios de valorUnitario';
COMMENT ON COLUMN fechas_programadas_valor.fecha_aplicar IS 'Fecha en la que se debe aplicar el cambio';
COMMENT ON COLUMN fechas_programadas_valor.ejecutado IS 'Indica si el cambio ya fue ejecutado';
COMMENT ON COLUMN fechas_programadas_valor.usuarios_actualizados IS 'Cantidad de usuarios actualizados cuando se ejecutó';

