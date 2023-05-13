-- CREATE TABLE CARRO
create table if not exists carros(
    id_carro SERIAL PRIMARY KEY,
    id_mongo_carro character varying,
    creado timestamp DEFAULT NOW(),
    centro INT,
    bodega INT,
	placa character varying,
    activo BOOLEAN DEFAULT FALSE,
    eliminado BOOLEAN DEFAULT FALSE,
    conductor INT,
    usuarioCrea INT
);

-- COMMENT ON TABLE carros IS 'Info data of PEDIDO';
    