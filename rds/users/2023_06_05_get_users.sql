DROP FUNCTION IF EXISTS get_users;

-- Función auxiliar para obtener todos los descendientes de un usuario (incluyendo él mismo)
CREATE OR REPLACE FUNCTION get_users(_user_id INT)
RETURNS TABLE(descendant_id INT)
LANGUAGE plpgsql
AS $get_descendants$
BEGIN
    RETURN QUERY
    WITH RECURSIVE user_tree AS (
        -- Caso base: el usuario inicial
        SELECT _id as user_id
        FROM users
        WHERE _id = _user_id
        AND eliminado = false
        
        UNION ALL
        
        -- Caso recursivo: todos los hijos de los usuarios ya encontrados
        SELECT u._id
        FROM users u
        INNER JOIN user_tree ut ON u.idPadre = ut.user_id
        WHERE u.eliminado = false
    )
    SELECT user_id FROM user_tree;
END;
$get_descendants$;

-- Función principal con parámetro adicional para el ID del usuario que hace la petición
CREATE OR REPLACE FUNCTION get_users(
    _limit INT,
    _start INT,
    _acceso character varying,
    _search character varying,
    _user_id INT DEFAULT NULL
)
RETURNS JSON
LANGUAGE plpgsql
AS $function$
DECLARE
    record_item RECORD;
    result_array JSON := '[]'::JSON;
    user_obj JSON;
    final_result JSON;
    padre_info JSON;
BEGIN
    -- Caso especial para clientes: buscar clientes según jerarquía del usuario
    IF _acceso = 'clientes' THEN
        -- Si se proporciona _user_id, buscar solo clientes en el árbol de ese usuario
        IF _user_id IS NOT NULL THEN
            FOR record_item IN
                SELECT 
                    u._id, u.uid, u.created, u.razon_social, u.cedula, u.direccion_factura,
                    u.email, u.nombre, u.celular, u.tipo, u.descuento, u.acceso,
                    u.tokenPhone, u.token, u.codMagister, u.avatar, u.codt, u.codigoRegistro,
                    u.valorUnitario, u.editado, u.activo, u.eliminado, u.idPadre
                FROM users u
                WHERE u.acceso = 'cliente'
                AND u.eliminado = false
                AND u.idPadre IN (
                    SELECT descendant_id FROM get_users(_user_id)
                )
                AND (
                    _search IS NULL OR _search = '' OR
                    (CONCAT(u._id::text, COALESCE(u.uid,''), u.created::text, COALESCE(u.razon_social,''), 
                           COALESCE(u.cedula,''), COALESCE(u.direccion_factura,''), COALESCE(u.email,''), 
                           COALESCE(u.nombre,''), COALESCE(u.celular,''), COALESCE(u.tipo,''), 
                           COALESCE(u.descuento,''), COALESCE(u.acceso,''), COALESCE(u.tokenPhone,''), 
                           u.token::text, COALESCE(u.codMagister,''), COALESCE(u.avatar,''), 
                           COALESCE(u.codt,''), COALESCE(u.codigoRegistro,''), 
                           u.valorUnitario::text) ILIKE '%' || _search || '%')
                )
                ORDER BY u._id DESC
                LIMIT _limit OFFSET _start
            LOOP
                -- Obtener información del padre si existe
                padre_info := NULL;
                IF record_item.idPadre IS NOT NULL THEN
                    SELECT json_build_object(
                        '_id', p._id,
                        'uid', p.uid,
                        'nombre', p.nombre,
                        'email', p.email,
                        'celular', p.celular,
                        'acceso', p.acceso,
                        'razon_social', p.razon_social,
                        'cedula', p.cedula
                    ) INTO padre_info
                    FROM users p
                    WHERE p._id = record_item.idPadre
                    AND p.eliminado = false
                    AND p.activo = true;
                END IF;
                
                -- Construir objeto usuario con información del padre
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
                    'idPadre', record_item.idPadre,
                    'padre', COALESCE(padre_info, 'null'::JSON),
                    'children', '[]'::JSON
                );
                
                -- Agregar al array resultado
                result_array := result_array::jsonb || user_obj::jsonb;
            END LOOP;
        ELSE
            -- Si el usuario NO es 'veo', buscar TODOS los clientes
            FOR record_item IN
                SELECT 
                    u._id, u.uid, u.created, u.razon_social, u.cedula, u.direccion_factura,
                    u.email, u.nombre, u.celular, u.tipo, u.descuento, u.acceso,
                    u.tokenPhone, u.token, u.codMagister, u.avatar, u.codt, u.codigoRegistro,
                    u.valorUnitario, u.editado, u.activo, u.eliminado, u.idPadre
                FROM users u
                WHERE u.acceso = 'cliente'
                AND u.eliminado = false
                AND u.activo = true
                AND (
                    _search IS NULL OR _search = '' OR
                    (CONCAT(u._id::text, COALESCE(u.uid,''), u.created::text, COALESCE(u.razon_social,''), 
                           COALESCE(u.cedula,''), COALESCE(u.direccion_factura,''), COALESCE(u.email,''), 
                           COALESCE(u.nombre,''), COALESCE(u.celular,''), COALESCE(u.tipo,''), 
                           COALESCE(u.descuento,''), COALESCE(u.acceso,''), COALESCE(u.tokenPhone,''), 
                           u.token::text, COALESCE(u.codMagister,''), COALESCE(u.avatar,''), 
                           COALESCE(u.codt,''), COALESCE(u.codigoRegistro,''), 
                           u.valorUnitario::text) ILIKE '%' || _search || '%')
                )
                ORDER BY u._id DESC
                LIMIT _limit OFFSET _start
            LOOP
                -- Obtener información del padre si existe
                padre_info := NULL;
                IF record_item.idPadre IS NOT NULL THEN
                    SELECT json_build_object(
                        '_id', p._id,
                        'uid', p.uid,
                        'nombre', p.nombre,
                        'email', p.email,
                        'celular', p.celular,
                        'acceso', p.acceso,
                        'razon_social', p.razon_social,
                        'cedula', p.cedula
                    ) INTO padre_info
                    FROM users p
                    WHERE p._id = record_item.idPadre
                    AND p.eliminado = false
                    AND p.activo = true;
                END IF;
                
                -- Construir objeto usuario con información del padre
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
                    'idPadre', record_item.idPadre,
                    'padre', COALESCE(padre_info, 'null'::JSON),
                    'children', '[]'::JSON
                );
                
                -- Agregar al array resultado
                result_array := result_array::jsonb || user_obj::jsonb;
            END LOOP;
        END IF;
    
    ELSE
        -- Lógica original para otros tipos de acceso
        FOR record_item IN
            SELECT 
                u._id, u.uid, u.created, u.razon_social, u.cedula, u.direccion_factura,
                u.email, u.nombre, u.celular, u.tipo, u.descuento, u.acceso,
                u.tokenPhone, u.token, u.codMagister, u.avatar, u.codt, u.codigoRegistro,
                u.valorUnitario, u.editado, u.activo, u.eliminado, u.idPadre
            FROM users u
            WHERE u.idPadre IS NULL
            AND u.eliminado = false
            AND u.activo = true
            AND (
                CASE _acceso
                    WHEN 'All' THEN true
                    WHEN 'administradores' THEN u.acceso IN ('admin', 'veo', 'comercial')
                    WHEN 'veo' THEN u.acceso IN ('veo', 'comercial')
                    WHEN 'conductor' THEN u.acceso = 'conductor'
                    ELSE false
                END
            )
            AND (
                _search IS NULL OR _search = '' OR
                (CONCAT(u._id::text, COALESCE(u.uid,''), u.created::text, COALESCE(u.razon_social,''), 
                       COALESCE(u.cedula,''), COALESCE(u.direccion_factura,''), COALESCE(u.email,''), 
                       COALESCE(u.nombre,''), COALESCE(u.celular,''), COALESCE(u.tipo,''), 
                       COALESCE(u.descuento,''), COALESCE(u.acceso,''), COALESCE(u.tokenPhone,''), 
                       u.token::text, COALESCE(u.codMagister,''), COALESCE(u.avatar,''), 
                       COALESCE(u.codt,''), COALESCE(u.codigoRegistro,''), 
                       u.valorUnitario::text) ILIKE '%' || _search || '%')
            )
            ORDER BY u.nombre
            LIMIT _limit OFFSET _start
        LOOP
            -- Construir objeto padre sin hijos para este caso
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
                'idPadre', record_item.idPadre,
                'children', '[]'::JSON
            );
            
            -- Agregar al array resultado
            result_array := result_array::jsonb || user_obj::jsonb;
        END LOOP;
    END IF;
    
    -- Construir respuesta final
    final_result := json_build_object('users', result_array);
    
    RETURN COALESCE(final_result, '{"users": []}');
END;
$function$;