-- CREATE TABLE ZONA
create table if not exists zonas(
    id_zona SERIAL PRIMARY KEY,
    id_mongo_zona character varying,
    created	timestamp DEFAULT NOW(),
    nombre	character varying,
    activo  BOOLEAN DEFAULT FALSE
);

COMMENT ON TABLE ZONA IS 'Info data of ZONA';
