CREATE OR REPLACE FUNCTION informe_tanques(
  _start character varying,
  _end character varying
)
RETURNS TABLE (
  _id INT,
  placaText VARCHAR(255),
  capacidad VARCHAR(255),
  fabricante VARCHAR(255),
  fechaUltimaRev VARCHAR(255),
  propiedad VARCHAR(255),
  nPlaca VARCHAR(255),
  serie VARCHAR(255),
  anoFabricacion VARCHAR(255),
  existeTanque VARCHAR(255),
  creado timestamp,
  visual character varying[],
  cerOnac character varying[],
  razon_social VARCHAR(255),
  codt VARCHAR(255),
  direccion VARCHAR(255),
  cerFabricante character varying[],
  dossier character varying[],
  placaFabricante character varying[],
  placaMantenimiento character varying[],
  placa character varying[]
)
LANGUAGE plpgsql AS
$func$
BEGIN
    RETURN QUERY 
    SELECT
        t._id,
        t.placaText,
        t.capacidad,
        t.fabricante,
        t.fechaUltimaRev,
        t.propiedad,
        t.nPlaca,
        t.serie,
        t.anoFabricacion,
        t.existeTanque,
        t.creado,
        COALESCE(t.visual, ARRAY[]::character varying[]) AS visual,
        COALESCE(t.cerOnac, ARRAY[]::character varying[]) AS cerOnac,
        u.razon_social,
        u.codt,
        p.direccion,
        COALESCE(t.cerFabricante, ARRAY[]::character varying[]) AS cerFabricante,
        COALESCE(t.dossier, ARRAY[]::character varying[]) AS dossier,
        COALESCE(t.placaFabricante, ARRAY[]::character varying[]) AS placaFabricante,
        COALESCE(t.placaMantenimiento, ARRAY[]::character varying[]) AS placaMantenimiento,
        COALESCE(t.placa, ARRAY[]::character varying[]) AS placa
    FROM
        tanques t
        INNER JOIN users u ON t.usuarioId = u._id
        INNER JOIN puntos p ON t.puntoId = p._id
    WHERE t.creado >= _start::timestamp AND t.creado < (_end::timestamp + INTERVAL '1 day')
    ORDER BY t._id DESC;

    RETURN;
END
$func$;
