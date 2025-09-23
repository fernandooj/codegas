DROP FUNCTION IF EXISTS get_puntos_user;
CREATE OR REPLACE FUNCTION get_puntos_user(idUser INT)
RETURNS TABLE (
  _id INT, 
  direccion varchar(45), 
  capacidad varchar, 
  idZona INT, 
  idCliente INT, 
  idPadre INT,
  coordenadas point,
  observacion varchar,
  nombreZona varchar,
  nombreUser varchar,
  place_name varchar,
  activo boolean,
  lat double precision,
  lng double precision
) AS $$
BEGIN
    RETURN QUERY 
    SELECT p._id AS _id, p.direccion, p.capacidad, p.idZona, p.idCliente, p.idPadre, p.coordenadas, p.observacion, zonas.nombre AS nombreZona, users.nombre AS nombreUser, p.place_name, p.activo,
           CASE WHEN p.coordenadas IS NOT NULL THEN p.coordenadas[1] ELSE NULL END AS lat,
           CASE WHEN p.coordenadas IS NOT NULL THEN p.coordenadas[0] ELSE NULL END AS lng
    FROM puntos p
    INNER JOIN zonas ON p.idZona = zonas._id
    INNER JOIN users ON users._id = p.idCliente
    WHERE users._id = idUser
    and p.activo=true;
END;
$$ LANGUAGE plpgsql;




-- SELECT * FROM get_puntos_user(2);
 

 