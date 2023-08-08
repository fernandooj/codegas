CREATE OR REPLACE FUNCTION save_reporte_emergencia(
    _tanque BOOLEAN,
    _red BOOLEAN,
    _puntos BOOLEAN,
    _fuga BOOLEAN,
    _pqr BOOLEAN,
    _otrosText VARCHAR,
    _usuarioId INT,
    _puntoId INT,
    _usuarioCrea INT
)
RETURNS INT AS $$
DECLARE
    inserted_id INT;
BEGIN
    INSERT INTO reporte_emergencia (
        tanque,
        red,
        puntos,
        fuga,
        pqr,
        otrosText,
        usuarioId,
        puntoId,
        usuarioCrea
    ) VALUES (
        _tanque,
        _red,
        _puntos,
        _fuga,
        _pqr,
        _otrosText,
        _usuarioId,
        _puntoId,
        _usuarioCrea
    )
    RETURNING _id INTO inserted_id;

    RETURN inserted_id;
END;
$$ LANGUAGE plpgsql;
