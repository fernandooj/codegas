-- Función simple para obtener conductores
CREATE OR REPLACE FUNCTION get_conductores_simple(
    _limit INT DEFAULT 1000,
    _start INT DEFAULT 0
)
RETURNS JSON
LANGUAGE plpgsql
AS $function$
DECLARE
    result_array JSON := '[]'::JSON;
    user_obj JSON;
    record_item RECORD;
BEGIN
    -- Obtener todos los usuarios con acceso = 'conductor' que no estén eliminados
    FOR record_item IN
        SELECT 
            u._id, u.uid, u.created, u.razon_social, u.cedula, u.direccion_factura,
            u.email, u.nombre, u.celular, u.tipo, u.descuento, u.acceso,
            u.tokenPhone, u.token, u.codMagister, u.avatar, u.codt, u.codigoRegistro,
            u.valorUnitario, u.editado, u.activo, u.eliminado, u.idPadre
        FROM users u
        WHERE u.acceso = 'conductor'
        AND u.eliminado = false
        AND u.activo = true
        ORDER BY u.nombre
        LIMIT _limit OFFSET _start
    LOOP
        -- Construir objeto usuario simple
        user_obj := json_build_object(
            '_id', record_item._id,
            'uid', record_item.uid,
            'created', record_item.created,
            'razon_social', record_item.razon_social,
            'cedula', record_item.cedula,
            'direccion_factura', record_item.direccion_factura,
            'email', record_item.email,
            'nombre', record_item.nombre,
            'celular', record_item.celular,
            'tipo', record_item.tipo,
            'descuento', record_item.descuento,
            'acceso', record_item.acceso,
            'tokenPhone', record_item.tokenPhone,
            'token', record_item.token,
            'codMagister', record_item.codMagister,
            'avatar', record_item.avatar,
            'codt', record_item.codt,
            'codigoRegistro', record_item.codigoRegistro,
            'valorUnitario', record_item.valorUnitario,
            'editado', record_item.editado,
            'activo', record_item.activo,
            'eliminado', record_item.eliminado,
            'idPadre', record_item.idPadre
        );
        
        -- Agregar al array resultado
        result_array := result_array::jsonb || user_obj::jsonb;
    END LOOP;
    
    -- Construir respuesta final
    RETURN json_build_object('users', result_array);
END;
$function$;
