-- CREATE TABLE PUNTOS
create table if not exists puntos(
    _id SERIAL PRIMARY KEY,
    direccion character varying,
    capacidad character varying,
    observacion character varying,
    punto character varying,
    activo BOOLEAN DEFAULT TRUE,
    creado TIMESTAMP DEFAULT (NOW() - INTERVAL '5 hours'),
    idZona INT,
    idCliente INT,
    idPadre INT
    coordenadas POINT
    place_name character varying,
);

COMMENT ON TABLE puntos IS 'Info data of PUNTOS';
