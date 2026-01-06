-- Crear tabla de grupos de frecuencias
-- Los grupos contienen la configuración de frecuencias que pueden ser reutilizadas

CREATE TABLE IF NOT EXISTS grupos_frecuencias (
    _id SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    tipo_frecuencia VARCHAR(20) NOT NULL CHECK (tipo_frecuencia IN ('semanal', 'mensual')),
    
    -- Campos para frecuencia semanal
    dia_semana INT CHECK (dia_semana >= 1 AND dia_semana <= 5), -- 1=Lunes, 5=Viernes
    intervalo_semanas INT DEFAULT 1 CHECK (intervalo_semanas IN (1, 2, 3)), -- Cada 1, 2 o 3 semanas
    
    -- Campos para frecuencia mensual
    dia_mes INT CHECK (dia_mes >= 1 AND dia_mes <= 31), -- Día del mes (1-31)
    dia_semana_mensual INT CHECK (dia_semana_mensual >= 1 AND dia_semana_mensual <= 5), -- Día de la semana (1=Lunes, 5=Viernes)
    
    -- Metadatos
    creado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    eliminado BOOLEAN DEFAULT FALSE,
    
    -- Validaciones
    CONSTRAINT check_semanal_fields CHECK (
        (tipo_frecuencia = 'semanal' AND dia_semana IS NOT NULL AND intervalo_semanas IS NOT NULL) OR
        (tipo_frecuencia != 'semanal')
    ),
    CONSTRAINT check_mensual_fields CHECK (
        (tipo_frecuencia = 'mensual' AND dia_mes IS NOT NULL AND dia_semana_mensual IS NOT NULL) OR
        (tipo_frecuencia != 'mensual')
    )
);

-- Índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_grupos_frecuencias_tipo ON grupos_frecuencias(tipo_frecuencia) WHERE eliminado = FALSE;
CREATE INDEX IF NOT EXISTS idx_grupos_frecuencias_eliminado ON grupos_frecuencias(eliminado);

-- Agregar campo grupo_id a la tabla pedidos (si no existe)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'pedidos' AND column_name = 'grupo_id'
    ) THEN
        ALTER TABLE pedidos ADD COLUMN grupo_id INT REFERENCES grupos_frecuencias(_id) ON DELETE SET NULL;
        CREATE INDEX IF NOT EXISTS idx_pedidos_grupo_id ON pedidos(grupo_id);
    END IF;
END $$;

-- Comentarios para documentación
COMMENT ON TABLE grupos_frecuencias IS 'Tabla que almacena grupos de frecuencias reutilizables';
COMMENT ON COLUMN grupos_frecuencias.nombre IS 'Nombre descriptivo del grupo de frecuencia';
COMMENT ON COLUMN grupos_frecuencias.tipo_frecuencia IS 'Tipo de frecuencia: semanal o mensual';
COMMENT ON COLUMN grupos_frecuencias.dia_semana IS 'Día de la semana para frecuencia semanal (1=Lunes, 5=Viernes)';
COMMENT ON COLUMN grupos_frecuencias.intervalo_semanas IS 'Cada cuántas semanas se repite (1, 2 o 3 semanas)';
COMMENT ON COLUMN grupos_frecuencias.dia_mes IS 'Día del mes para frecuencia mensual (1-31)';
COMMENT ON COLUMN grupos_frecuencias.dia_semana_mensual IS 'Día de la semana para frecuencia mensual (1=Lunes, 5=Viernes)';

