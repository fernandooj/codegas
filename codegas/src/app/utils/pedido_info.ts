export const forma = [
  {label: "Monto $", value: "monto" },
  {label: "Cantidad KG", value: "cantidad" },
  {label: "Lleno Total", value: "lleno" },
]

export const frecuencia = [
  {label: "Semanal", value: "semanal" },
  {label: "Quincenal", value: "quincenal" },
  {label: "Mensual", value: "mensual" },
]

export const mes: number[] = [];
for(let i=1; i<=31; i++) mes.push(i)


export const dia1: number[] = [];
for(let i=1; i<=15; i++) dia1.push(i)


export const dia2: number[] = [];
for(let i=16; i<=31; i++) dia2.push(i)


export const diaSemana = [
  {label: "Lunes", value: 1 },
  {label: "Martes", value: 2 },
  {label: "Miercoles", value: 3 },
  {label: "Jueves", value: 4 },
  {label: "Viernes", value: 5 },
  {label: "Sabado", value: 6 },
  {label: "Domingo", value: 7 }
]