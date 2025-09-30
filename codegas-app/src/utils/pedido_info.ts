export const forma = [
  { label: 'Monto $', key: 'monto' },
  { label: 'Cantidad KG', key: 'cantidad' },
  { label: 'Lleno Total', key: 'lleno' },
];

export const frecuencias = [
  { label: 'Semanal', key: 'semanal' },
  { label: 'Quincenal', key: 'quincenal' },
  { label: 'Mensual', key: 'mensual' },
];

export const diasN = [];
for (let i = 1; i <= 31; i++) {
  diasN.push({ label: i.toString(), key: i });
}

export const dia1 = [];
for (let i = 1; i <= 15; i++) {
  dia1.push({ label: i.toString(), key: i });
}

export const dia2 = [];
for (let i = 16; i <= 31; i++) {
  dia2.push({ label: i.toString(), key: i });
}

export const dias = [
  { label: 'Lunes', key: 1 },
  { label: 'Martes', key: 2 },
  { label: 'Miercoles', key: 3 },
  { label: 'Jueves', key: 4 },
  { label: 'Viernes', key: 5 },
  { label: 'Sabado', key: 6 },
  { label: 'Domingo', key: 7 },
];

export const motivoNoCierre = [
  { label: 'C01 TANQUE LLENO', key: 'C01 TANQUE LLENO' },
  { label: 'C02 SIN AUTORIZACIÓN', key: 'C02 SIN AUTORIZACIÓN' },
  { label: 'C03 NADIE RECIBE', key: 'C03 NADIE RECIBE' },
  { label: 'C04 COMPETENCIA', key: 'C04 COMPETENCIA' },
  { label: 'M01 VARADA', key: 'M01 VARADA' },
  { label: 'M02 ACCIDENTE', key: 'M02 ACCIDENTE' },
  { label: 'M03 MTTO PREVENTIVO', key: 'M03 MTTO PREVENTIVO' },
  { label: 'M04 MTTO CORRECTIVO', key: 'M04 MTTO CORRECTIVO' },
  { label: 'R01 VEHÍCULO NO ADECUADO', key: 'R01 VEHÍCULO NO ADECUADO' },
  { label: 'R02 FALTA DE PRODUCTO', key: 'R02 FALTA DE PRODUCTO' },
  { label: 'R03 INCUMPLIMIENTO DE HORARIO', key: 'R03 INCUMPLIMIENTO DE HORARIO' },
  { label: 'R04 COMPETENCIA', key: 'R04 COMPETENCIA' },
  { label: 'R05 PEDIDO NO REPORTADO', key: 'R05 PEDIDO NO REPORTADO' },
  { label: 'R06 DPTO TÉCNICO', key: 'R06 DPTO TÉCNICO' },
  { label: 'R07 TIEMPO NO ALCANZO', key: 'R07 TIEMPO NO ALCANZO' },
  { label: 'T01 TRAFICO', key: 'T01 TRAFICO' },
  { label: 'T02 CLIMA', key: 'T02 CLIMA' },
  { label: 'T03 DEMORAS EN EL CARGUE', key: 'T03 DEMORAS EN EL CARGUE' },
  { label: 'O01 INFORMACIÓN ERRADA PEDIDO', key: 'O01 INFORMACIÓN ERRADA PEDIDO' },
  { label: 'O02 VEHÍCULO EN RUTA', key: 'O02 VEHÍCULO EN RUTA' },
  { label: 'O03 SIN COBERTURA', key: 'O03 SIN COBERTURA' },
  { label: 'O04 ENTREGADO SIN SUBIR APP', key: 'O04 ENTREGADO SIN SUBIR APP' },
  { label: 'O05 CIERRE EN LA VÍA', key: 'O05 CIERRE EN LA VÍA' },
  { label: 'O06 NO ENTREGADO / SIN CERRAR APP', key: 'O06 NO ENTREGADO / SIN CERRAR APP' },
  { label: 'O07 CAMBIO DE PEDIDO', key: 'O07 CAMBIO DE PEDIDO' },
  { label: 'O08 FRECUENCIA ERRADA', key: 'O08 FRECUENCIA ERRADA' },
];
