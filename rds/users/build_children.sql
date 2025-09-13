
-- Función auxiliar para construir hijos recursivamente
CREATE OR REPLACE FUNCTION build_children(parent_id INT, _acceso character varying, _search character varying, _user_id INT DEFAULT NULL)
RETURNS JSON
LANGUAGE plpgsql
AS $build_children$
DECLARE
    child_record RECORD;
    children_array JSON := '[]'::JSON;
    child_obj JSON;
BEGIN
    FOR child_record IN
        SELECT 
            u._id, u.uid, u.created, u.razon_social, u.cedula, u.direccion_factura,
            u.email, u.nombre, u.celular, u.tipo, u.descuento, u.acceso,
            u.tokenPhone, u.token, u.codMagister, u.avatar, u.codt, u.codigoRegistro,
            u.valorUnitario, u.editado, u.activo, u.eliminado, u.idPadre
        FROM users u
        WHERE u.idPadre = parent_id
        AND u.eliminado = false
        AND u.activo = true
        AND (
            CASE _acceso
                WHEN 'All' THEN true
                WHEN 'admin' THEN u.acceso IN ('admin', 'veo', 'comercial')
                WHEN 'veo' THEN u.acceso IN ('veo', 'comercial')
                WHEN 'clientes' THEN u.acceso = 'cliente'
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
    LOOP
        -- Construir objeto hijo con sus propios hijos recursivamente
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
            'children', build_children(child_record._id, _acceso, _search, _user_id)
        );
        
        -- Agregar al array de hijos
        children_array := children_array::jsonb || child_obj::jsonb;
    END LOOP;
    
    RETURN children_array;
END;
$build_children$;