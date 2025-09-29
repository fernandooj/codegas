drop FUNCTION if exists save_reporte_emergencia;

CREATE OR REPLACE FUNCTION save_reporte_emergencia(
    _tanque BOOLEAN,
    _red BOOLEAN,
    _puntos BOOLEAN,
    _fuga BOOLEAN,
    _pqr BOOLEAN,
    _otrosText VARCHAR,
    _usuarioId INT,
    _puntoId INT,
    _usuarioCrea INT,
    _imgUrlsS3 TEXT[] DEFAULT NULL
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
        usuarioCrea,
        ruta
    ) VALUES (
        _tanque,
        _red,
        _puntos,
        _fuga,
        _pqr,
        _otrosText,
        _usuarioId,
        _puntoId,
        _usuarioCrea,
        COALESCE(_imgUrlsS3, ARRAY[]::TEXT[])
    )
    RETURNING _id INTO inserted_id;

    RETURN inserted_id;
END;
$$ LANGUAGE plpgsql;
