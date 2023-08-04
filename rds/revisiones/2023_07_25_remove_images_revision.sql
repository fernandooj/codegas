CREATE OR REPLACE FUNCTION remove_images_revisiones(
  _type character varying,
  _idRevision INT,
  _index INT
)
RETURNS text
LANGUAGE plpgsql
AS
$$
BEGIN
  IF _type = 'nComodato' THEN
    UPDATE revisiones
    SET nComodato = array_remove(nComodato, nComodato[_index])
    WHERE _id = _idRevision AND array_length(nComodato, 1) >= _index;
  ELSIF _type = 'isometrico' THEN
    UPDATE revisiones
    SET isometrico = array_remove(isometrico, isometrico[_index])
    WHERE _id = _idRevision AND array_length(isometrico, 1) >= _index;
  ELSIF _type = 'protocoloLlenado' THEN
     UPDATE revisiones
    SET protocoloLlenado = array_remove(protocoloLlenado, protocoloLlenado[_index])
    WHERE _id = _idRevision AND array_length(protocoloLlenado, 1) >= _index;
  ELSIF _type = 'hojaSeguridad' THEN
     UPDATE revisiones
    SET hojaSeguridad = array_remove(hojaSeguridad, hojaSeguridad[_index])
    WHERE _id = _idRevision AND array_length(hojaSeguridad, 1) >= _index;
  ELSIF _type = 'otrosSi' THEN
     UPDATE revisiones
    SET otrosSi = array_remove(otrosSi, otrosSi[_index])
    WHERE _id = _idRevision AND array_length(otrosSi, 1) >= _index;
  ELSIF _type = 'documento' THEN
    UPDATE revisiones
    SET documento = array_remove(documento, documento[_index])
    WHERE _id = _idRevision AND array_length(documento, 1) >= _index;
  ELSIF _type = 'depTecnico' THEN
    UPDATE revisiones
    SET depTecnico = array_remove(depTecnico, depTecnico[_index])
    WHERE _id = _idRevision AND array_length(depTecnico, 1) >= _index;
  ELSIF _type = 'soporteEntrega' THEN
     UPDATE revisiones
    SET soporteEntrega = array_remove(soporteEntrega, soporteEntrega[_index])
    WHERE _id = _idRevision AND array_length(soporteEntrega, 1) >= _index;
  ELSIF _type = 'puntoConsumo' THEN
    UPDATE revisiones
    SET puntoConsumo = array_remove(puntoConsumo, puntoConsumo[_index])
    WHERE _id = _idRevision AND array_length(puntoConsumo, 1) >= _index;
  ELSIF _type = 'visual' THEN
     UPDATE revisiones
    SET visual = array_remove(visual, visual[_index])
    WHERE _id = _idRevision AND array_length(visual, 1) >= _index;
  END IF;

  RETURN 'Images added successfully';
END;
$$;
