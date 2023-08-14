CREATE OR REPLACE FUNCTION get_data_carro_user(idUser INT)
RETURNS TABLE (
    _id INT, 
    placa VARCHAR(45), 
    centro INT, 
    bodega INT, 
    usuarioCrea JSON,
    creado BIGINT, 
    conductor JSON,
    eliminado BOOLEAN,
    activo BOOLEAN,
    nombreUserCrea VARCHAR,
    nombreConductor VARCHAR
) AS $$
BEGIN
    RETURN QUERY SELECT
        carros._id,
        carros.placa,
        carros.centro,
        carros.bodega,
        json_build_object(
            '_id', users._id,
            'acceso', users.acceso,
            'email', users.email,
            'nombre', users.nombre,
            'celular', users.celular,
            'cedula', users.cedula,
            'razon_social', users.razon_social
        ) AS "usuarioCrea",
        extract(epoch from carros.creado)::bigint * 1000 AS "creado",
        json_build_object(
            '_id', users_conductor._id,
            'created', users_conductor.created,
            'token', users_conductor.token,
            'idPadre', users_conductor.idPadre,
            'acceso', users_conductor.acceso,
            'email', users_conductor.email,
            'nombre', users_conductor.nombre,
            'codt', users_conductor.codt,
            'celular', users_conductor.celular,
            'tipo', users_conductor.tipo,
            'direccion_factura', users_conductor.direccion_factura,
            'cedula', users_conductor.cedula,
            'razon_social', users_conductor.razon_social,
            'avatar', users_conductor.avatar,
            'valorUnitario', users_conductor.valorUnitario,
            'codMagister', users_conductor.codMagister,
            'eliminado', users_conductor.eliminado,
            'activo', users_conductor.activo,
            'editado', users_conductor.editado
        ) AS "conductor",
        carros.eliminado,
        carros.activo,
        users.nombre AS "nombreUserCrea",
        users_conductor.nombre AS "nombreConductor"
    FROM
        carros
        LEFT JOIN users ON carros.usuarioCrea = users._id
        LEFT JOIN users AS users_conductor ON carros.conductor = users_conductor._id
    WHERE carros.eliminado = FALSE
    AND (carros.conductor = idUser OR idUser IS NULL)
    ORDER BY
        carros._id DESC;
END;
$$ LANGUAGE plpgsql;




-- SELECT * FROM get_puntos_user(2);
 

 