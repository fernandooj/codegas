-- CREATE TABLE REPORTE EMERGENCIA
create table if not exists reporte_emergencia(
    _id SERIAL PRIMARY KEY,
    creado TIMESTAMP DEFAULT (NOW() - INTERVAL '5 hours'),
    tanque     BOOLEAN DEFAULT FALSE,
    red     BOOLEAN DEFAULT FALSE,
    puntos     BOOLEAN DEFAULT FALSE,
    fuga     BOOLEAN DEFAULT FALSE,
    pqr     BOOLEAN DEFAULT FALSE,

    otrosText          character varying,
    cerradoText          character varying,
    ruta          character varying[],
    documento          character varying[],
    rutaCerrar          character varying[],

    activo     BOOLEAN DEFAULT TRUE,
    eliminado     BOOLEAN DEFAULT FALSE,
    usuarioCrea INT,
    usuarioCierra INT,
    usuarioId INT,
    puntoId INT
);

COMMENT ON TABLE reporte_emergencia IS 'Info data of REPORTE EMERGENCIA';
    