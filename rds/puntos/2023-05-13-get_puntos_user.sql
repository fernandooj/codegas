CREATE OR REPLACE FUNCTION get_puntos_user(idUser INT)
RETURNS TABLE (
  _id INT, 
  direccion varchar(45), 
  capacidad varchar, 
  idZona INT, 
  idCliente INT, 
  idPadre INT,
  observacion varchar,
  nombreZona varchar,
  nombreUser varchar
) AS $$
BEGIN
    RETURN QUERY 
    SELECT p._id AS _id, p.direccion, p.capacidad, p.idZona, p.idCliente, p.idPadre, p.observacion, zonas.nombre AS nombreZona, users.nombre AS nombreUser
    FROM puntos p
    INNER JOIN zonas ON p.idZona = zonas._id
    INNER JOIN users ON users._id = p.idCliente
    WHERE users._id = idUser
    and p.activo=true;
END;
$$ LANGUAGE plpgsql;




-- SELECT * FROM get_puntos_user(2);
 

 