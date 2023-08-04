-- CREATE FUNCTION save_revisiones(
--     _usuarioId INT,
--     _tanqueId INT[],
--     _puntoId INT,
-- 	_propiedad         character varying,
--     _lote character varying,
-- 	_sector            character varying,
-- 	_barrio            character varying,
-- 	_usuariosAtendidos character varying,
--     _m3                character varying,
-- 	_nMedidorText      character varying,
--     _nMedidor character varying[],
--     _nComodato character varying[],
--     _nComodatoText     character varying,
-- 	_ubicacion      	  character varying,
--     _otrosSi	   		  character varying[],
--     _usuarioCrea INT
-- )
-- RETURNS text
-- LANGUAGE plpgsql
-- AS $function$
 
-- BEGIN
-- INSERT INTO revisiones(usuarioId, tanqueId, puntoId, propiedad, lote, sector, barrio, usuariosAtendidos, m3, nMedidorText, nMedidor, nComodato, nComodatoText, ubicacion, otrosSi, usuarioCrea)
--     VALUES(_usuarioId, _tanqueId, _puntoId, _propiedad, _lote, _sector, _barrio, _usuariosAtendidos, _m3, _nMedidorText, _nMedidor, _nComodato, _nComodatoText, _ubicacion, _otrosSi, _usuarioCrea);
--     RETURN 'revision creado exitosamente';
-- END;
-- $function$




CREATE OR REPLACE FUNCTION save_revision(
    _tanqueId INT[],
    _usuarioId INT,
    _puntoId INT,
    _usuarioCrea INT
)
RETURNS INT
LANGUAGE plpgsql
AS $function$
DECLARE
    revision_id INT;
BEGIN
    INSERT INTO revisiones(tanqueId, usuarioId, puntoId, usuarioCrea)
    VALUES (_tanqueId, _usuarioId, _puntoId, _usuarioCrea)
    RETURNING id INTO revision_id;
    
    RETURN revision_id;
END;
$function$





-- select * from save_revisiones(1, ARRAY[3], 1,  'propiedad 5', 'lote 5', 'sector 5', 'barrio 5', 'usuariosAtendidos 5', 'm3', 'nMedidorText', ARRAY['nMedidor'], ARRAY['nComodato'], 'nComodatoText', 'ubicacion', ARRAY['otrosSi'], 1);
