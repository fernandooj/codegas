-- CREATE TABLE PUNTOS
create table if not exists puntos(
    id_punto SERIAL PRIMARY KEY,
    id_mongo_punto character varying,
    observacion character varying,
    capacidad INT,
    idZona INT,
    idCliente INT,
    idPadre INT,
    activo BOOLEAN DEFAULT TRUE,
    creado timestamp DEFAULT NOW()
);

COMMENT ON TABLE puntos IS 'Info data of PUNTOS';
