export const forma = [
  {label: 'Monto $', key: 'monto'},
  {label: 'Cantidad KG', key: 'cantidad'},
  {label: 'Lleno Total', key: 'lleno'},
];

export const frecuencias = [
  {label: 'Semanal', key: 'semanal'},
  {label: 'Quincenal', key: 'quincenal'},
  {label: 'Mensual', key: 'mensual'},
];

export const diasN: number[] = [];
for (let i = 1; i <= 31; i++) {
  diasN.push(i);
}

export const dia1: number[] = [];
for (let i = 1; i <= 15; i++) {
  dia1.push(i);
}

export const dia2: number[] = [];
for (let i = 16; i <= 31; i++) {
  dia2.push(i);
}

export const dias = [
  {label: 'Lunes', key: 1},
  {label: 'Martes', key: 2},
  {label: 'Miercoles', key: 3},
  {label: 'Jueves', key: 4},
  {label: 'Viernes', key: 5},
  {label: 'Sabado', key: 6},
  {label: 'Domingo', key: 7},
];

export const motivoNoCierre = [
  'C01 TANQUE LLENO',
  'C02 SIN AUTORIZACIÓN',
  'C03 NADIE RECIBE',
  'C04 COMPETENCIA',
  'M01 VARADA',
  'M02 ACCIDENTE',
  'M03 MTTO PREVENTIVO',
  'M04 MTTO CORRECTIVO',
  'R01 VEHÍCULO NO ADECUADO',
  'R02 FALTA DE PRODUCTO',
  'R03 INCUMPLIMIENTO DE HORARIO',
  'R04 COMPETENCIA',
  'R05 PEDIDO NO REPORTADO',
  'R06 DPTO TÉCNICO',
  'R07 TIEMPO NO ALCANZO',
  'T01 TRAFICO',
  'T02 CLIMA',
  'T03 DEMORAS EN EL CARGUE',
  'O01 INFORMACIÓN ERRADA PEDIDO',
  'O02 VEHÍCULO EN RUTA',
  'O03 SIN COBERTURA',
  'O04 ENTREGADO SIN SUBIR APP',
  'O05 CIERRE EN LA VÍA',
  'O06 NO ENTREGADO / SIN CERRAR APP',
  'O07 CAMBIO DE PEDIDO',
];
