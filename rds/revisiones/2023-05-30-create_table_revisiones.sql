-- CREATE TABLE TANQUES
create table if not exists revisiones(
    _id SERIAL PRIMARY KEY,
    creado TIMESTAMP DEFAULT (NOW() - INTERVAL '5 hours'),
	sector            character varying, --
	barrio            character varying, --
	propiedad         character varying, --
    lote character varying, --
	usuariosAtendidos character varying, --
	m3                character varying, --
	nMedidorText      character varying, --
	nComodatoText     character varying, --
	ubicacion      	  character varying, --
	poblado     	    character varying,   
	ciudad     	      character varying,   
	dpto     	        character varying,   
	
    nComodato character varying[], --
	isometrico      character varying[],
	otrosComodato	  character varying[],
	protocoloLlenado character varying[],
	hojaSeguridad  	character varying[],
	otrosSi	   		  character varying[], --
    documento character varying[], 
    depTecnico  character varying[],

	soporteEntrega	character varying[],
	puntoConsumo	  character varying[],
	visual	  		  character varying[],
	
    observaciones	  character varying,
	solicitudServicio character varying,
	usuarioSolicita	  INT,
	avisos			  BOOLEAN DEFAULT FALSE,
	extintores		  BOOLEAN DEFAULT FALSE,
	distancias 		  BOOLEAN DEFAULT FALSE,
	electricas		  BOOLEAN DEFAULT FALSE, 
	accesorios		  BOOLEAN DEFAULT FALSE, 


    alerta character varying[],
	alertaText character varying,
	alertaFecha character varying,
	nActa character varying,
    coordenadas POINT,
    activo BOOLEAN DEFAULT TRUE,
    eliminado BOOLEAN DEFAULT FALSE,
    usuarioCrea INT, --
	tanqueId INT[], --


	depTecnicoText character varying,
	depTecnicoEstado  BOOLEAN DEFAULT FALSE,

    usuarioId INT, --
    puntoId INT, --
    estado INT default 1

);

-- COMMENT ON TABLE revisiones IS 'Info data of revisiones';
