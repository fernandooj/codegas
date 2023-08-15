-- CREATE TABLE ZONAS
create table if not exists zonas(
    _id SERIAL PRIMARY KEY,
    nombre character varying,
    activo BOOLEAN DEFAULT TRUE,
    creado TIMESTAMP DEFAULT (NOW() - INTERVAL '5 hours') 
);

COMMENT ON TABLE zonas IS 'Info data of ZONAS';
