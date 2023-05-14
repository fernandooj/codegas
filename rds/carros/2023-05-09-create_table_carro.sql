-- CREATE TABLE CARRO
create table if not exists carros(
    _id SERIAL PRIMARY KEY,
    creado timestamp DEFAULT NOW(),
    centro INT,
    bodega INT,
	placa character varying,
    activo BOOLEAN DEFAULT TRUE,
    eliminado BOOLEAN DEFAULT FALSE,
    conductor INT,
    usuarioCrea INT
);

-- COMMENT ON TABLE carros IS 'Info data of CARROS';
    