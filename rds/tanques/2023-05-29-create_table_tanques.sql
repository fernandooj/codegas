-- CREATE TABLE TANQUES
create table if not exists tanques(
    _id SERIAL PRIMARY KEY,
    capacidad character varying,
	placaText          character varying,
	fabricante		   character varying,
	registroOnac  	   character varying,
	fechaUltimaRev     character varying,
	nPlaca         	   character varying,
	codigoActivo       character varying,
	serie              character varying,
	anoFabricacion	   character varying,
	existeTanque	   character varying,
	ultimRevTotal	   character varying,
	propiedad	   	   character varying,
    usuarioId INT,
    usuarioCrea INT,
    puntoId INT,
    placa              character varying[],
	placaMantenimiento character varying[],
	placaFabricante    character varying[],
	dossier			   character varying[],
	cerFabricante	   character varying[],
	cerOnac	   		   character varying[],
	visual	   		   character varying[],
    activo BOOLEAN DEFAULT TRUE,
    eliminado BOOLEAN DEFAULT FALSE,
    creado timestamp DEFAULT NOW()

);

COMMENT ON TABLE tanques IS 'Info data of TANQUES';
