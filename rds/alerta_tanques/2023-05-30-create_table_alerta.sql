-- CREATE TABLE alertaTanques
create table if not exists alertaTanques(
    _id SERIAL PRIMARY KEY,
    creado timestamp DEFAULT NOW(),
    alertaImagen character varying[],
    alertaText character varying,
    cerradoText character varying,
    activo BOOLEAN DEFAULT TRUE,
    eliminado BOOLEAN DEFAULT FALSE,
    usuarioCrea INT,
    usuarioCierra INT,
    tanqueId INT
);

-- COMMENT ON TABLE alertaTanques IS 'Info data of Alerta Tanques';
