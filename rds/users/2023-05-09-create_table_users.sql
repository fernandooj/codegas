-- CREATE TABLE USERS
create table if not exists users(
    _id SERIAL PRIMARY KEY,
    uid character varying,
    created	timestamp DEFAULT NOW(),
    razon_social character varying,
    cedula character varying,
    direccion_factura character varying,
    email	character varying,
    nombre	character varying,
    celular character varying,
    tipo 	character varying,
    descuento 	character varying,
    acceso		character varying,
    tokenPhone 	character varying,
    token	 	INT,
    codMagister character varying,
    avatar character varying,
    codt	character varying,
    codigoRegistro character varying,
    valorUnitario INT,
    editado BOOLEAN DEFAULT FALSE,
    activo  BOOLEAN DEFAULT FALSE,
    eliminado BOOLEAN DEFAULT FALSE,
    idPadre INT
);

COMMENT ON TABLE USERS IS 'Info data of USERS';
