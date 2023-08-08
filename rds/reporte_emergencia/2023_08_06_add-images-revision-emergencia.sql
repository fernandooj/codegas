CREATE OR REPLACE FUNCTION add_images_reporte_emergencia(
    param_nuevos character varying[],
    _type character varying,
    _idReporte INT
)
RETURNS text
LANGUAGE plpgsql
AS
$$
BEGIN
  IF _type = 'documento' THEN
    UPDATE reporte_emergencia
    SET documento = array_cat(documento, param_nuevos)
    WHERE _id = _idReporte;
  ELSIF _type = 'rutaCerrar' THEN
    UPDATE reporte_emergencia
    SET rutaCerrar = array_cat(rutaCerrar, param_nuevos)
    WHERE _id = _idReporte;
  ELSIF _type = 'ruta' THEN
    UPDATE reporte_emergencia
    SET ruta = array_cat(ruta, param_nuevos)
    WHERE _id = _idReporte;
  END IF;

  RETURN 'Images added successfully';
END;
$$;
