CREATE OR REPLACE FUNCTION informe_revisiones(
    _limit INT,
    _start INT
)
  RETURNS TABLE (
    _id INTEGER,
    usuariocrea character varying,
    creado timestamp,
    barrio character varying,
    m3 character varying,
    nComodatoText character varying,
    nMedidorText character varying,
    direccion VARCHAR(255),
    sector character varying,
    ubicacion character varying,
    razon_social VARCHAR(255),
    codt VARCHAR(255),
    usuariosAtendidos character varying,
    accesorios BOOLEAN,
    avisos BOOLEAN,
    distancias BOOLEAN,
    electricas BOOLEAN,
    extintores BOOLEAN,
    poblado character varying,
    depTecnicoEstado BOOLEAN,
    observaciones character varying,
    activo BOOLEAN,
    depTecnico character varying[],
    documento character varying[],
    alerta character varying[],
    otrosSi character varying[],
    nComodato character varying[],
    hojaSeguridad character varying[],
    protocoloLlenado character varying[],
    visual character varying[],
    puntoConsumo character varying[],
    soporteEntrega character varying[],
    otrosComodato character varying[],
    isometrico character varying[],
    estado INTEGER
  )
AS $$
BEGIN
  RETURN QUERY
    SELECT
      r._id,
      u2.nombre,
      r.creado,
      r.barrio,
      r.m3,
      r.nComodatoText,
      r.nMedidorText,
      p.direccion,
      r.sector,
      r.ubicacion,
      u.razon_social,
      u.codt,
      r.usuariosAtendidos,
      r.accesorios,
      r.avisos,
      r.distancias,
      r.electricas,
      r.extintores,
      r.poblado,
      r.depTecnicoEstado,
      r.observaciones,
      r.activo,
      ARRAY(SELECT DISTINCT unnest(r.depTecnico)) AS depTecnico,
      ARRAY(SELECT DISTINCT unnest(r.documento)) AS documento,
      ARRAY(SELECT DISTINCT unnest(r.alerta)) AS alerta,
      ARRAY(SELECT DISTINCT unnest(r.otrosSi)) AS otrosSi,
      ARRAY(SELECT DISTINCT unnest(r.nComodato)) AS nComodato,
      ARRAY(SELECT DISTINCT unnest(r.hojaSeguridad)) AS hojaSeguridad,
      ARRAY(SELECT DISTINCT unnest(r.protocoloLlenado)) AS protocoloLlenado,
      ARRAY(SELECT DISTINCT unnest(r.visual)) AS visual,
      ARRAY(SELECT DISTINCT unnest(r.puntoConsumo)) AS puntoConsumo,
      ARRAY(SELECT DISTINCT unnest(r.soporteEntrega)) AS soporteEntrega,
      ARRAY(SELECT DISTINCT unnest(r.otrosComodato)) AS otrosComodato,
      ARRAY(SELECT DISTINCT unnest(r.isometrico)) AS isometrico,
      r.estado
    FROM revisiones r
    LEFT JOIN puntos p ON r.puntoId = p._id
    LEFT JOIN users u ON r.usuarioId = u._id
    LEFT JOIN users u2 ON r.usuarioCrea = u._id
    WHERE p.creado >= _start::timestamp AND p.creado < _end::timestamp
    AND r.eliminado = false
    ORDER BY r._id DESC;

  RETURN;
END;
$$ LANGUAGE plpgsql;
