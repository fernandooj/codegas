CREATE OR REPLACE FUNCTION get_user_with_zonas(
  _limit INT,
  _start INT,
  _idZona INT,
  _type VARCHAR(10),
  _busqueda VARCHAR(255)
)
RETURNS TABLE (
  _id INT, 
  codt varchar(45),
  razon_social varchar(45),
  capacidad varchar(45),
  activo boolean, 
  idCliente INT, 
  nombre varchar(45), 
  email varchar(45), 
  nombreZona varchar(45),
  celular varchar(45),
  idZona INT, 
  idPadre INT,
  valorUnitario INT
) AS $$
BEGIN
    IF _type = 'BySearch' THEN
    RETURN QUERY 
    SELECT
      p._id AS "_id",
      users.codt AS "codt",
      users.razon_social AS "razon_social",
      p.capacidad AS "capacidad",
      p.activo AS "activo",
      p.idCliente AS "idCliente",
      users.nombre AS "nombre",
      users.email AS "email",
      zonas.nombre AS "nombreZona",
      users.celular AS "celular",
      p.idZona AS "idZona",
      p.idPadre AS "idPadre",
      users.valorUnitario AS "valorUnitario"
    FROM puntos as p
    JOIN users ON p.idCliente = users._id
    JOIN zonas ON p.idZona = zonas._id
    WHERE (CONCAT(p._id, users.codt, users.razon_social, p.activo, users.codt, users.razon_social, users.nombre, users.cedula, p.direccion, p.capacidad, zonas.nombre) ILIKE '%' || _busqueda || '%')
        LIMIT _limit OFFSET _start;

    ELSE
     RETURN QUERY 
      SELECT
        p._id AS "_id",
        users.codt AS "codt",
        users.razon_social AS "razon_social",
        p.capacidad AS "capacidad",
        p.activo AS "activo",
        p.idCliente AS "idCliente",
        users.nombre AS "nombre",
        users.email AS "email",
        zonas.nombre AS "nombreZona",
        users.celular AS "celular",
        p.idZona AS "idZona",
        p.idPadre AS "idPadre",
        users.valorUnitario AS "valorUnitario"
      FROM puntos as p
      JOIN users ON p.idCliente = users._id
      JOIN zonas ON p.idZona = zonas._id
      WHERE zonas._id = _idZona;
    END IF;
    RETURN;
END;
$$ LANGUAGE plpgsql;





-- SELECT * FROM get_user_with_zonas(10, 1, 1, 'BySearch', 'norte');
 

 