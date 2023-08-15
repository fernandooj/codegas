-- CREATE TABLE PEDIDO
create table if not exists pedidos(
    _id SERIAL PRIMARY KEY, --
    creado TIMESTAMP DEFAULT (NOW() - INTERVAL '5 hours'), --
	forma          character varying, --
	cantidadKl    INT, --
	cantidadPrecio INT,  --
	frecuencia     character varying, --
	dia1           INT, --
    dia2           INT, --
    estado         character varying DEFAULT 'espera', --
    entregado     BOOLEAN DEFAULT FALSE, --
    eliminado     BOOLEAN DEFAULT FALSE, --
    novedades     BOOLEAN DEFAULT FALSE,
    fechaEntrega   character varying, --
    fechaSolicitud character varying, --
    fechaEntregado character varying, --
    kilos          character varying, --
    factura        character varying, --
    valor_total    character varying, --
    remision       character varying, --
    valorUnitario INT, --
    orden         INT, --
    orden_cerrado INT, --
    observacion character varying,
    motivo_no_cierre character varying, --
    perfil_novedad character varying, --
    forma_pago character varying, --
    imagenCerrar character varying, --
    pedidoPadre INT,
    puntoId INT, --
    conductorId INT, --
	carroId INT, --
	usuarioId INT, --
	usuarioCrea INT, --
	usuarioAsigna  INT, --
	usuarioAsignaVehiculo INT --
);

COMMENT ON TABLE pedidos IS 'Info data of PEDIDO';
    