-- CREATE TABLE PLANILLAS
create table if not exists planillas(
    _id SERIAL PRIMARY KEY,
    creado TIMESTAMP DEFAULT (NOW() AT TIME ZONE 'America/Bogota'),
    -- Campos de la primera imagen (Formulario principal)
    ruta character varying,
    guia character varying,
    no_planilla INT,
    placa_vehiculo character varying,
    fecha DATE,
    kilometraje_inicial INT,
    kilometraje_final INT,
    remision_inicial character varying,
    remision_final character varying,
    -- Campos de la segunda imagen (Inventario)
    inventario_inicial_porcentaje numeric(5,2),
    inventario_final_porcentaje numeric(5,2),
    inventario_inicial_kl numeric(10,2),
    inventario_final_kl numeric(10,2),
    novedades text,
    -- Campos adicionales
    gastos JSONB DEFAULT '[]'::jsonb,
    user_id INT REFERENCES users(_id),
    -- Campos de control
    activo BOOLEAN DEFAULT TRUE,
    eliminado BOOLEAN DEFAULT FALSE
);

COMMENT ON TABLE planillas IS 'Planillas de entrega de conductores';
COMMENT ON COLUMN planillas.gastos IS 'Array de objetos con concepto y valor: [{"concepto": "string", "valor": number}]';

-- Crear índice para búsquedas por user_id
CREATE INDEX IF NOT EXISTS idx_planillas_user_id ON planillas(user_id);

-- Crear índice para búsquedas por fecha
CREATE INDEX IF NOT EXISTS idx_planillas_fecha ON planillas(fecha);

