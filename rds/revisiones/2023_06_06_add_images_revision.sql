CREATE OR REPLACE FUNCTION add_images_revisiones(
    param_nuevos character varying[],
    _type character varying,
    _idRevision INT
)
RETURNS text
LANGUAGE plpgsql
AS
$$
BEGIN
  IF _type = 'nComodato' THEN
    UPDATE revisiones
    SET nComodato = array_cat(nComodato, param_nuevos)
    WHERE _id = _idRevision;
  ELSIF _type = 'isometrico' THEN
    UPDATE revisiones
    SET isometrico = array_cat(isometrico, param_nuevos)
    WHERE _id = _idRevision;
  ELSIF _type = 'otrosComodato' THEN
    UPDATE revisiones
    SET otrosComodato = array_cat(otrosComodato, param_nuevos)
    WHERE _id = _idRevision;
  ELSIF _type = 'protocoloLlenado' THEN
    UPDATE revisiones
    SET protocoloLlenado = array_cat(protocoloLlenado, param_nuevos)
    WHERE _id = _idRevision;
  ELSIF _type = 'hojaSeguridad' THEN
    UPDATE revisiones
    SET hojaSeguridad = array_cat(hojaSeguridad, param_nuevos)
    WHERE _id = _idRevision;
  ELSIF _type = 'otrosSi' THEN
    UPDATE revisiones
    SET otrosSi = array_cat(otrosSi, param_nuevos)
    WHERE _id = _idRevision;
  ELSIF _type = 'documento' THEN
    UPDATE revisiones
    SET documento = array_cat(documento, param_nuevos)
    WHERE _id = _idRevision;
  ELSIF _type = 'depTecnico' THEN
    UPDATE revisiones
    SET depTecnico = array_cat(depTecnico, param_nuevos)
    WHERE _id = _idRevision;
  ELSIF _type = 'soporteEntrega' THEN
    UPDATE revisiones
    SET soporteEntrega = array_cat(soporteEntrega, param_nuevos)
    WHERE _id = _idRevision;
  ELSIF _type = 'puntoConsumo' THEN
    UPDATE revisiones
    SET puntoConsumo = array_cat(puntoConsumo, param_nuevos)
    WHERE _id = _idRevision;
  ELSIF _type = 'visual' THEN
    UPDATE revisiones
    SET visual = array_cat(visual, param_nuevos)
    WHERE _id = _idRevision;
  END IF;

  RETURN 'Images added successfully';
END;
$$;
