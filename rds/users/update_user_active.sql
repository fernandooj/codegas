CREATE OR REPLACE FUNCTION update_user_active(
    p_id INT,
    p_active BOOLEAN
)
RETURNS TEXT AS $$
BEGIN
    UPDATE users
    SET activo = p_active
    WHERE _id = p_id;
    
    IF FOUND THEN
        RETURN 'Usuario ' || (CASE WHEN p_active THEN 'activado' ELSE 'desactivado' END) || ' correctamente';
    ELSE
        RETURN 'Usuario no encontrado';
    END IF;
END;
$$ LANGUAGE plpgsql;
