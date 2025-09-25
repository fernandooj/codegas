DROP FUNCTION IF EXISTS get_users(_user_id INT);
DROP FUNCTION IF EXISTS get_users(
    _limit INT,
    _start INT,
    _acceso character varying,
    _search character varying,
    _user_id INT,
    _requester_id INT
);
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

-- Función principal corregida con estructura jerárquica
CREATE OR REPLACE FUNCTION get_users(
    _limit INT,
    _start INT,
    _acceso character varying,
    _search character varying,
    _user_id INT DEFAULT NULL,
    _requester_id INT DEFAULT NULL
)
RETURNS JSON
LANGUAGE plpgsql
AS $function$
DECLARE
    record_item RECORD;
    child_record RECORD;
    result_array JSON := '[]'::JSON;
    children_array JSON := '[]'::JSON;
    user_obj JSON;
    child_obj JSON;
    final_result JSON;
    padre_info JSON;
    requester_user_type VARCHAR;
    is_admin_or_higher BOOLEAN := false;
BEGIN
    -- Obtener el tipo de acceso del usuario que hace la petición (_user_id)
    SELECT acceso INTO requester_user_type 
    FROM users 
    WHERE _id = _user_id AND eliminado = false;
    
    -- Verificar si el usuario puede ver todos los usuarios
    is_admin_or_higher := (requester_user_type IN ('admin', 'comercial', 'solucion'));
    
    -- Lógica principal basada en el tipo de usuario y el parámetro _acceso
    IF _acceso = 'cliente' THEN
        -- Buscar solo usuarios con acceso = 'cliente' (sin jerarquía padre-hijo)
        IF is_admin_or_higher THEN
            -- Admin/comercial/solucion pueden ver TODOS los clientes
            FOR record_item IN
                SELECT 
                    u._id, u.uid, u.created, u.razon_social, u.cedula, u.direccion_factura,
                    u.email, u.nombre, u.celular, u.tipo, u.descuento, u.acceso,
                    u.tokenPhone, u.token, u.codMagister, u.avatar, u.codt, u.codigoRegistro,
                    u.valorUnitario, u.editado, u.activo, u.eliminado, u.idPadre
                FROM users u
                WHERE u.acceso = 'cliente'
                AND u.eliminado = false
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
                    AND p.eliminado = false;
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
        ELSIF requester_user_type = 'veo' THEN
            -- Usuarios tipo 'veo' solo pueden ver clientes que son descendientes de ellos
            FOR record_item IN
                SELECT 
                    u._id, u.uid, u.created, u.razon_social, u.cedula, u.direccion_factura,
                    u.email, u.nombre, u.celular, u.tipo, u.descuento, u.acceso,
                    u.tokenPhone, u.token, u.codMagister, u.avatar, u.codt, u.codigoRegistro,
                    u.valorUnitario, u.editado, u.activo, u.eliminado, u.idPadre
                FROM users u
                WHERE u.acceso = 'cliente'
                AND u.eliminado = false
                AND u._id IN (
                    SELECT descendant_id FROM get_users(_user_id)
                    WHERE descendant_id != _user_id
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
                    AND p.eliminado = false;
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
            -- Otros usuarios solo pueden ver clientes que son sus descendientes
            FOR record_item IN
                SELECT 
                    u._id, u.uid, u.created, u.razon_social, u.cedula, u.direccion_factura,
                    u.email, u.nombre, u.celular, u.tipo, u.descuento, u.acceso,
                    u.tokenPhone, u.token, u.codMagister, u.avatar, u.codt, u.codigoRegistro,
                    u.valorUnitario, u.editado, u.activo, u.eliminado, u.idPadre
                FROM users u
                WHERE u.acceso = 'cliente'
                AND u.eliminado = false
                AND u._id IN (
                    SELECT descendant_id FROM get_users(_user_id)
                    WHERE descendant_id != _user_id
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
                -- Construir objeto usuario
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
        
    ELSE
        -- _acceso != 'cliente' - Implementar estructura jerárquica padre-hijo RECURSIVA
        IF is_admin_or_higher THEN
            -- Admin/veo/comercial/solucion pueden ver TODOS los usuarios no-clientes con jerarquía RECURSIVA
            
            -- Función recursiva para construir el árbol completo
            CREATE OR REPLACE FUNCTION build_user_tree(_parent_id INT, _acceso VARCHAR, _search VARCHAR)
            RETURNS JSON
            LANGUAGE plpgsql
            AS $build_tree$
            DECLARE
                child_record RECORD;
                child_obj JSON;
                children_array JSON := '[]'::JSON;
                child_children JSON;
            BEGIN
                -- Obtener todos los hijos directos del padre
                FOR child_record IN
                    SELECT 
                        c._id, c.uid, c.created, c.razon_social, c.cedula, c.direccion_factura,
                        c.email, c.nombre, c.celular, c.tipo, c.descuento, c.acceso,
                        c.tokenPhone, c.token, c.codMagister, c.avatar, c.codt, c.codigoRegistro,
                        c.valorUnitario, c.editado, c.activo, c.eliminado, c.idPadre
                    FROM users c
                    WHERE c.idPadre = _parent_id
                    AND c.eliminado = false
                    AND c.acceso != 'cliente'
                    AND (
                        CASE _acceso
                            WHEN 'All' THEN true
                            WHEN 'admin' THEN c.acceso IN ('admin', 'veo', 'comercial', 'conductor', 'solucion')
                            WHEN 'administradores' THEN c.acceso IN ('admin', 'veo', 'comercial', 'solucion')
                            WHEN 'veo' THEN c.acceso = 'veo'
                            WHEN 'comercial' THEN c.acceso = 'comercial'
                            WHEN 'conductor' THEN c.acceso = 'conductor'
                            WHEN 'solucion' THEN c.acceso = 'solucion'
                            ELSE c.acceso = _acceso
                        END
                    )
                    AND (
                        _search IS NULL OR _search = '' OR
                        (CONCAT(c._id::text, COALESCE(c.uid,''), c.created::text, COALESCE(c.razon_social,''), 
                               COALESCE(c.cedula,''), COALESCE(c.direccion_factura,''), COALESCE(c.email,''), 
                               COALESCE(c.nombre,''), COALESCE(c.celular,''), COALESCE(c.tipo,''), 
                               COALESCE(c.descuento,''), COALESCE(c.acceso,''), COALESCE(c.tokenPhone,''), 
                               c.token::text, COALESCE(c.codMagister,''), COALESCE(c.avatar,''), 
                               COALESCE(c.codt,''), COALESCE(c.codigoRegistro,''), 
                               c.valorUnitario::text) ILIKE '%' || _search || '%')
                    )
                    ORDER BY c.nombre
                LOOP
                    -- RECURSIVAMENTE obtener los hijos de este hijo
                    child_children := build_user_tree(child_record._id, _acceso, _search);
                    
                    -- Construir objeto hijo con sus hijos recursivos
                    child_obj := json_build_object(
                        '_id', child_record._id,
                        'uid', child_record.uid,
                        'created', child_record.created,
                        'razon_social', child_record.razon_social,
                        'cedula', child_record.cedula,
                        'direccion_factura', child_record.direccion_factura,
                        'email', child_record.email,
                        'nombre', child_record.nombre,
                        'celular', child_record.celular,
                        'tipo', child_record.tipo,
                        'descuento', child_record.descuento,
                        'acceso', child_record.acceso,
                        'tokenPhone', child_record.tokenPhone,
                        'token', child_record.token,
                        'codMagister', child_record.codMagister,
                        'avatar', child_record.avatar,
                        'codt', child_record.codt,
                        'codigoRegistro', child_record.codigoRegistro,
                        'valorUnitario', child_record.valorUnitario,
                        'editado', child_record.editado,
                        'activo', child_record.activo,
                        'eliminado', child_record.eliminado,
                        'idPadre', child_record.idPadre,
                        'children', child_children
                    );
                    
                    -- Agregar hijo al array de children
                    children_array := children_array::jsonb || child_obj::jsonb;
                END LOOP;
                
                RETURN children_array;
            END;
            $build_tree$;
            
            -- Obtener solo los padres principales (usuarios sin padre)
            FOR record_item IN
                SELECT 
                    u._id, u.uid, u.created, u.razon_social, u.cedula, u.direccion_factura,
                    u.email, u.nombre, u.celular, u.tipo, u.descuento, u.acceso,
                    u.tokenPhone, u.token, u.codMagister, u.avatar, u.codt, u.codigoRegistro,
                    u.valorUnitario, u.editado, u.activo, u.eliminado, u.idPadre
                FROM users u
                WHERE u.acceso != 'cliente'
                AND u.eliminado = false
                AND u.idPadre IS NULL  -- Solo padres principales (sin padre)
                AND (
                    CASE _acceso
                        WHEN 'All' THEN true
                        WHEN 'admin' THEN u.acceso IN ('admin', 'veo', 'comercial', 'conductor', 'solucion')
                        WHEN 'administradores' THEN u.acceso IN ('admin', 'veo', 'comercial', 'solucion')
                        WHEN 'veo' THEN u.acceso = 'veo'
                        WHEN 'comercial' THEN u.acceso = 'comercial'
                        WHEN 'conductor' THEN u.acceso = 'conductor'
                        WHEN 'solucion' THEN u.acceso = 'solucion'
                        ELSE u.acceso = _acceso
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
                -- Usar la función recursiva para obtener TODOS los descendientes
                children_array := build_user_tree(record_item._id, _acceso, _search);
                
                -- Construir objeto padre con sus children recursivos
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
                    'children', children_array
                );
                
                -- Agregar al array resultado
                result_array := result_array::jsonb || user_obj::jsonb;
            END LOOP;
            
            -- Limpiar la función auxiliar
            DROP FUNCTION IF EXISTS build_user_tree(INT, VARCHAR, VARCHAR);
        ELSIF requester_user_type = 'veo' THEN
            -- Usuarios tipo 'veo' pueden ver estructura jerárquica de usuarios por debajo de ellos
            FOR record_item IN
                SELECT 
                    u._id, u.uid, u.created, u.razon_social, u.cedula, u.direccion_factura,
                    u.email, u.nombre, u.celular, u.tipo, u.descuento, u.acceso,
                    u.tokenPhone, u.token, u.codMagister, u.avatar, u.codt, u.codigoRegistro,
                    u.valorUnitario, u.editado, u.activo, u.eliminado, u.idPadre
                FROM users u
                WHERE u.acceso != 'cliente'
                AND u.eliminado = false
                AND u.idPadre = _user_id  -- Solo hijos directos del usuario veo
                AND (
                    CASE _acceso
                        WHEN 'All' THEN true
                        WHEN 'admin' THEN u.acceso IN ('admin', 'veo', 'comercial', 'conductor', 'solucion')
                        WHEN 'administradores' THEN u.acceso IN ('admin', 'veo', 'comercial', 'solucion')
                        WHEN 'veo' THEN u.acceso = 'veo'
                        WHEN 'comercial' THEN u.acceso = 'comercial'
                        WHEN 'conductor' THEN u.acceso = 'conductor'
                        WHEN 'solucion' THEN u.acceso = 'solucion'
                        ELSE u.acceso = _acceso
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
                -- Obtener los children de este usuario
                children_array := '[]'::JSON;
                FOR child_record IN
                    SELECT 
                        c._id, c.uid, c.created, c.razon_social, c.cedula, c.direccion_factura,
                        c.email, c.nombre, c.celular, c.tipo, c.descuento, c.acceso,
                        c.tokenPhone, c.token, c.codMagister, c.avatar, c.codt, c.codigoRegistro,
                        c.valorUnitario, c.editado, c.activo, c.eliminado, c.idPadre
                    FROM users c
                    WHERE c.idPadre = record_item._id
                    AND c.eliminado = false
                    AND c.acceso != 'cliente'
                    AND (
                        CASE _acceso
                            WHEN 'All' THEN true
                            WHEN 'admin' THEN c.acceso IN ('admin', 'veo', 'comercial', 'conductor', 'solucion')
                            WHEN 'administradores' THEN c.acceso IN ('admin', 'veo', 'comercial', 'solucion')
                            WHEN 'veo' THEN c.acceso = 'veo'
                            WHEN 'comercial' THEN c.acceso = 'comercial'
                            WHEN 'conductor' THEN c.acceso = 'conductor'
                            WHEN 'solucion' THEN c.acceso = 'solucion'
                            ELSE c.acceso = _acceso
                        END
                    )
                    ORDER BY c.nombre
                LOOP
                    -- Construir objeto hijo
                    child_obj := json_build_object(
                        '_id', child_record._id,
                        'uid', child_record.uid,
                        'created', child_record.created,
                        'razon_social', child_record.razon_social,
                        'cedula', child_record.cedula,
                        'direccion_factura', child_record.direccion_factura,
                        'email', child_record.email,
                        'nombre', child_record.nombre,
                        'celular', child_record.celular,
                        'tipo', child_record.tipo,
                        'descuento', child_record.descuento,
                        'acceso', child_record.acceso,
                        'tokenPhone', child_record.tokenPhone,
                        'token', child_record.token,
                        'codMagister', child_record.codMagister,
                        'avatar', child_record.avatar,
                        'codt', child_record.codt,
                        'codigoRegistro', child_record.codigoRegistro,
                        'valorUnitario', child_record.valorUnitario,
                        'editado', child_record.editado,
                        'activo', child_record.activo,
                        'eliminado', child_record.eliminado,
                        'idPadre', child_record.idPadre,
                        'children', '[]'::JSON
                    );
                    
                    -- Agregar hijo al array de children
                    children_array := children_array::jsonb || child_obj::jsonb;
                END LOOP;
                
                -- Construir objeto usuario con sus children
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
                    'children', children_array
                );
                
                -- Agregar al array resultado
                result_array := result_array::jsonb || user_obj::jsonb;
            END LOOP;
        ELSE
            -- Otros usuarios solo pueden ver usuarios no-clientes que son sus descendientes (sin implementar jerarquía compleja)
            FOR record_item IN
                SELECT 
                    u._id, u.uid, u.created, u.razon_social, u.cedula, u.direccion_factura,
                    u.email, u.nombre, u.celular, u.tipo, u.descuento, u.acceso,
                    u.tokenPhone, u.token, u.codMagister, u.avatar, u.codt, u.codigoRegistro,
                    u.valorUnitario, u.editado, u.activo, u.eliminado, u.idPadre
                FROM users u
                WHERE u.acceso != 'cliente'
                AND u.eliminado = false
                AND u._id IN (
                    SELECT descendant_id FROM get_users(_user_id)
                    WHERE descendant_id != _user_id
                )
                AND (
                    CASE _acceso
                        WHEN 'All' THEN true
                        WHEN 'admin' THEN u.acceso IN ('admin', 'veo', 'comercial', 'conductor', 'solucion')
                        WHEN 'administradores' THEN u.acceso IN ('admin', 'veo', 'comercial', 'solucion')
                        WHEN 'veo' THEN u.acceso = 'veo'
                        WHEN 'comercial' THEN u.acceso = 'comercial'
                        WHEN 'conductor' THEN u.acceso = 'conductor'
                        WHEN 'solucion' THEN u.acceso = 'solucion'
                        ELSE u.acceso = _acceso
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
                -- Construir objeto usuario sin children para usuarios no-admin
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
    END IF;
    
    -- Construir respuesta final
    final_result := json_build_object('users', result_array);
    
    RETURN COALESCE(final_result, '{"users": []}');
END;
$function$;

 