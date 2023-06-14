CREATE OR REPLACE FUNCTION get_revisiones(
    _limit INT,
    _start INT,
    _busqueda VARCHAR(255)
)
  RETURNS TABLE (
    _id INTEGER,
    creado timestamp,
    sector character varying,
    barrio character varying,
    propiedad character varying,
    lote character varying,
    usuariosAtendidos character varying,
    m3 character varying,
    nMedidorText character varying,
    ubicacion character varying,
    nComodatoText character varying,
    poblado character varying,
    ciudad character varying,
    dpto character varying,
    observaciones character varying,
    solicitudServicio character varying,
    usuarioSolicita INTEGER,
    avisos BOOLEAN,
    extintores BOOLEAN,
    distancias BOOLEAN,
    electricas BOOLEAN,
    accesorios BOOLEAN,
    alertaText character varying,
    alertaFecha character varying,
    nActa character varying,
    activo BOOLEAN,
    eliminado BOOLEAN,
    usuarioCrea INTEGER,
    depTecnicoText character varying,
    depTecnicoEstado BOOLEAN,
    estado INTEGER,
    isometrico character varying[],
    otrosComodato character varying[],
    soporteEntrega character varying[],
    puntoConsumo character varying[],
    visual character varying[],
    protocoloLlenado character varying[],
    hojaSeguridad character varying[],
    nComodato character varying[],
    otrosSi character varying[],
    alerta character varying[],
    documento character varying[],
    depTecnico character varying[],
    direccion VARCHAR(255),
    codt VARCHAR(255),
    razon_social VARCHAR(255),
    zonaId INTEGER,
    tanqueId JSONB[],
    total INT
  )
AS $$
BEGIN
  RETURN QUERY
    SELECT
      r._id,
      r.creado,
      r.sector,
      r.barrio,
      r.propiedad,
      r.lote,
      r.usuariosAtendidos,
      r.m3,
      r.nMedidorText,
      r.ubicacion,
      r.nComodatoText,
      r.poblado,
      r.ciudad,
      r.dpto,
      r.observaciones,
      r.solicitudServicio,
      r.usuarioSolicita,
      r.avisos,
      r.extintores,
      r.distancias,
      r.electricas,
      r.accesorios,
      r.alertaText,
      r.alertaFecha,
      r.nActa,
      r.activo,
      r.eliminado,
      r.usuarioCrea,
      r.depTecnicoText,
      r.depTecnicoEstado,
      r.estado,
      ARRAY(SELECT DISTINCT unnest(r.isometrico)) AS isometrico,
      ARRAY(SELECT DISTINCT unnest(r.otrosComodato)) AS otrosComodato,
      ARRAY(SELECT DISTINCT unnest(r.soporteEntrega)) AS soporteEntrega,
      ARRAY(SELECT DISTINCT unnest(r.puntoConsumo)) AS puntoConsumo,
      ARRAY(SELECT DISTINCT unnest(r.visual)) AS visual,
      ARRAY(SELECT DISTINCT unnest(r.protocoloLlenado)) AS protocoloLlenado,
      ARRAY(SELECT DISTINCT unnest(r.hojaSeguridad)) AS hojaSeguridad,
      ARRAY(SELECT DISTINCT unnest(r.nComodato)) AS nComodato,
      ARRAY(SELECT DISTINCT unnest(r.otrosSi)) AS otrosSi,
      ARRAY(SELECT DISTINCT unnest(r.alerta)) AS alerta,
      ARRAY(SELECT DISTINCT unnest(r.documento)) AS documento,
      ARRAY(SELECT DISTINCT unnest(r.depTecnico)) AS depTecnico,
      p.direccion,
      u.codt,
      u.razon_social,
      t.zonaId,
      CASE WHEN count(t._id) > 0 THEN array_agg(jsonb_build_object('_id', t._id, 'capacidad', t.capacidad)) ELSE '{}' END AS tanqueId,
      (
          SELECT count(*)::INT
          FROM revisiones r
          LEFT JOIN puntos p ON r.puntoId = p._id
          LEFT JOIN users u ON r.usuarioId = u._id
          LEFT JOIN tanques t ON t._id = ANY(r.tanqueId)
          WHERE r.eliminado = FALSE
                AND r.activo = TRUE
                AND (
                    CONCAT(
                        r._id::VARCHAR,
                        r.sector,
                        r.barrio,
                        r.propiedad,
                        r.lote,
                        r.usuariosAtendidos,
                        r.m3,
                        r.nMedidorText,
                        r.ubicacion,
                        r.nComodatoText,
                        r.poblado,
                        r.ciudad,
                        r.dpto,
                        r.observaciones,
                        r.solicitudServicio,
                        r.usuarioSolicita,
                        r.alertaText,
                        r.alertaFecha,
                        r.nActa,
                        r.usuarioCrea,
                        r.depTecnicoText,
                        p.direccion,
                        u.razon_social,
                        u.codt
                    ) ILIKE '%' || _busqueda || '%'
                )
            ) AS total
    FROM revisiones r
    LEFT JOIN puntos p ON r.puntoId = p._id
    LEFT JOIN users u ON r.usuarioId = u._id
    LEFT JOIN tanques t ON t._id = ANY(r.tanqueId)
    WHERE r.eliminado = false
    AND r.activo = true
    AND (
      CONCAT(
          r._id::VARCHAR,
          r.sector,
          r.barrio,
          r.propiedad,
          r.lote,
          r.usuariosAtendidos,
          r.m3,
          r.nMedidorText,
          r.ubicacion,
          r.nComodatoText,
          r.poblado,
          r.ciudad,
          r.dpto,
          r.observaciones,
          r.solicitudServicio,
          r.usuarioSolicita,
          r.alertaText,
          r.alertaFecha,
          r.nActa,
          r.usuarioCrea,
          r.depTecnicoText,
          p.direccion,
          u.razon_social,
          u.codt
      ) ILIKE '%' || _busqueda || '%'
    )
    GROUP BY
      r._id,
      r.creado,
      r.sector,
      r.barrio,
      r.propiedad,
      r.lote,
      r.usuariosAtendidos,
      r.m3,
      r.nMedidorText,
      r.ubicacion,
      r.nComodatoText,
      r.poblado,
      r.ciudad,
      r.dpto,
      r.observaciones,
      r.solicitudServicio,
      r.usuarioSolicita,
      r.avisos,
      r.extintores,
      r.distancias,
      r.electricas,
      r.accesorios,
      r.alertaText,
      r.alertaFecha,
      r.nActa,
      r.activo,
      r.eliminado,
      r.usuarioCrea,
      r.depTecnicoText,
      r.depTecnicoEstado,
      r.estado,
      p.direccion,
      u.codt,
      u.razon_social,
      t.zonaId
    ORDER BY
      r._id DESC
    LIMIT _limit
    OFFSET _start;
  RETURN;
END;
$$ LANGUAGE plpgsql;
