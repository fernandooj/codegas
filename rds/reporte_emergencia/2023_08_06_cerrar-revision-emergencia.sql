CREATE OR REPLACE FUNCTION cerrar_reporte_emergencia(
    _tanque BOOLEAN,
    _red BOOLEAN,
    _puntos BOOLEAN,
    _fuga BOOLEAN,
    _pqr BOOLEAN,
    _cerradoText CHARACTER VARYING,
    _usuarioCierra INT,
    _idReporte INT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS
$$
BEGIN
    UPDATE reporte_emergencia
    SET tanque = _tanque,
        red = _red,
        puntos = _puntos,
        fuga = _fuga,
        pqr = _pqr,
        cerradoText = _cerradoText,
        usuarioCierra = _usuarioCierra
    WHERE _id = _idReporte;

    RETURN true; 
END;
$$;
