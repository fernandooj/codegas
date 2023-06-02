CREATE OR REPLACE FUNCTION get_puntos_user(idUser INT)
RETURNS TABLE (
  _id INT, 
  direccion varchar(45), 
  capacidad varchar, 
  idZona INT, 
  idCliente INT, 
  idPadre INT,
  nombreZona varchar,
  nombreUser varchar
) AS $$
BEGIN
    RETURN QUERY SELECT puntos._id AS _id, puntos.direccion, puntos.capacidad, puntos.idZona, puntos.idCliente, puntos.idPadre, zonas.nombre AS nombreZona, users.nombre AS nombreUser
    FROM puntos
    INNER JOIN zonas ON puntos.idZona = zonas._id
    INNER JOIN users ON users._id = puntos.idCliente
    WHERE users._id = idUser;
END;
$$ LANGUAGE plpgsql;




-- SELECT * FROM get_puntos_user(2);
 

 