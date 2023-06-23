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
