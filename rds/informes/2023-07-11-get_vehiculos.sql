CREATE OR REPLACE FUNCTION informe_get_vehiculos(
    _start character varying,
    _end character varying
)
RETURNS TABLE (
    _id INT, 
    placa VARCHAR(45), 
    centro INT, 
    bodega INT, 
    creado timestamp, 
    usuarioCrea VARCHAR(45),
    conductor VARCHAR(45)
) AS $$
BEGIN
    RETURN QUERY SELECT
        c._id,
        c.placa,
        c.centro,
        c.bodega,
        c.creado,
        users.nombre,
        conductor.nombre
    FROM
        carros as c
        LEFT JOIN users ON c.usuarioCrea = users._id
        JOIN users AS conductor ON c.conductor = conductor._id
    WHERE c.eliminado = FALSE
    AND c.creado >= _start::timestamp AND c.creado < _end::timestamp;
END;
$$ LANGUAGE plpgsql;




-- SELECT * FROM get_puntos_user(2);
 

 