-- Actualizar restricciones de grupos_frecuencias para incluir sábado y domingo
-- Cambiar de 1-5 (Lunes-Viernes) a 1-7 (Lunes-Domingo)

-- Primero, eliminar las restricciones CHECK existentes en las columnas
ALTER TABLE grupos_frecuencias 
    DROP CONSTRAINT IF EXISTS grupos_frecuencias_dia_semana_check,
    DROP CONSTRAINT IF EXISTS grupos_frecuencias_dia_semana_mensual_check;

-- Actualizar restricciones para permitir días 1-7 (Lunes-Domingo)
ALTER TABLE grupos_frecuencias 
    ADD CONSTRAINT grupos_frecuencias_dia_semana_check 
    CHECK (dia_semana IS NULL OR (dia_semana >= 1 AND dia_semana <= 7));

ALTER TABLE grupos_frecuencias 
    ADD CONSTRAINT grupos_frecuencias_dia_semana_mensual_check 
    CHECK (dia_semana_mensual IS NULL OR (dia_semana_mensual >= 1 AND dia_semana_mensual <= 7));

-- Actualizar comentarios en la documentación
COMMENT ON COLUMN grupos_frecuencias.dia_semana IS 'Día de la semana para frecuencia semanal (1=Lunes, 5=Viernes, 6=Sábado, 7=Domingo)';
COMMENT ON COLUMN grupos_frecuencias.dia_semana_mensual IS 'Día de la semana para frecuencia mensual (1=Lunes, 5=Viernes, 6=Sábado, 7=Domingo)';
