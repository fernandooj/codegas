CREATE OR REPLACE FUNCTION get_alerta_tanque(
    _type VARCHAR(10),
    _usuarioId INT,
    _tanqueId INT,
    _alertaTanqueId INT
)
RETURNS TABLE (
    _id INT,
    creado TIMESTAMP,
    alertaImagen character varying[],
    alertaText VARCHAR(255),
    cerradoText VARCHAR(255),
    idUsuarioCrea INT,
    usuarioCrea VARCHAR(255),
    idUsuarioCierra INT,
    usuarioCierra VARCHAR(255),
    tanqueId INT
)
LANGUAGE plpgsql AS
$func$
BEGIN
    IF _type = 'All' THEN
        RETURN QUERY 
        SELECT alt._id, alt.creado, alt.alertaImagen, alt.alertaText, alt.cerradoText, u._id, u.nombre, u2._id, u2.nombre, alt.tanqueId
        FROM alertaTanques alt
        LEFT JOIN users u ON alt.usuarioCrea = u._id
        LEFT JOIN users u2 ON alt.usuarioCierra = u2._id
        LEFT JOIN tanques t ON alt.tanqueId = t._id
        WHERE alt.eliminado = false
        ORDER BY alt._id DESC;

    ELSIF _type = 'usuarioId' THEN
        RETURN QUERY 
        SELECT alt._id, alt.creado, alt.alertaImagen, alt.alertaText, alt.cerradoText, u._id, u.nombre, u2._id, u2.nombre, alt.tanqueId
        FROM alertaTanques alt
        LEFT JOIN users u ON alt.usuarioCrea = u._id
        LEFT JOIN users u2 ON alt.usuarioCierra = u2._id
        LEFT JOIN tanques t ON alt.tanqueId = t._id
        WHERE alt.eliminado = false
        AND alt.usuarioCrea = _usuarioId
        ORDER BY alt._id DESC;

    ELSIF _type = 'tanqueId' THEN
        RETURN QUERY 
        SELECT alt._id, alt.creado, alt.alertaImagen, alt.alertaText, alt.cerradoText, u._id, u.nombre, u2._id, u2.nombre, alt.tanqueId
        FROM alertaTanques alt
        LEFT JOIN users u ON alt.usuarioCrea = u._id
        LEFT JOIN users u2 ON alt.usuarioCierra = u2._id
        LEFT JOIN tanques t ON alt.tanqueId = t._id
        WHERE alt.eliminado = false
        AND alt.tanqueId = _tanqueId
        ORDER BY alt._id DESC;
    ELSE
        RETURN QUERY
        SELECT alt._id, alt.creado, alt.alertaImagen, alt.alertaText, alt.cerradoText, u._id, u.nombre, u2._id, u2.nombre, alt.tanqueId
        FROM alertaTanques alt
        LEFT JOIN users u ON alt.usuarioCrea = u._id
        LEFT JOIN users u2 ON alt.usuarioCierra = u2._id
        LEFT JOIN tanques t ON alt.tanqueId = t._id
        WHERE alt.eliminado = false
        AND alt._id = _alertaTanqueId
        ORDER BY alt._id DESC;
    END IF;

    RETURN;
END
$func$;





-- SELECT get_pedidos(1, 10, 0,  10, '2023-05-14 22:58:28.152', 'cliente') ;



-- WITH RECURSIVE arbol AS (
--     SELECT _id, nombre, idPadre
--     FROM users
--     WHERE _id = 4

--     UNION ALL

--     SELECT u._id, u.nombre, u.idPadre
--     FROM users u
--     LEFT JOIN arbol a ON u.idPadre = a._id
-- )
-- SELECT *
-- FROM arbol;