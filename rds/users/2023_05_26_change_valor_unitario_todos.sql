CREATE OR REPLACE FUNCTION change_valor_unitario_todos(
    _valorUnitario INT, 
    _type VARCHAR(10)
)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  IF _type = 'adicion' THEN
    UPDATE users
    SET valorUnitario = valorUnitario + _valorUnitario;
  ELSIF _type = 'porcentaje' THEN
    UPDATE users
    SET valorUnitario = valorUnitario +((valorUnitario*_valorUnitario)/100);
  ELSE
    UPDATE users
    SET valorUnitario = _valorUnitario;
  END IF;
END;
$$;


-- SELECT change_valor_unitario_todos('porcentaje', 15);

-- drop function change_valor_unitario_todos(INT, VARCHAR)