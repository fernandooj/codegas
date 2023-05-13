-- CREATE TABLE PUNTOS
create table if not exists puntos(
    _id SERIAL PRIMARY KEY,
    direccion character varying,
    capacidad character varying,
    observacion character varying,
    punto character varying,
    activo BOOLEAN DEFAULT TRUE,
    creado timestamp DEFAULT NOW(),
    idZona INT,
    idCliente INT,
    idPadre INT
);

COMMENT ON TABLE puntos IS 'Info data of PUNTOS';
