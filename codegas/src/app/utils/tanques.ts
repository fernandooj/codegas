export const ano = []
for(let i=1950; i<=2023; i++) ano.push(i)

export const ubicacion = [
  {label: "Cliente", value: "cliente" },
  {label: "Bodega", value: "bodega" }
]

export const propiedad = [
  {label: "Usuario", value: "usuario" },
  {label: "propio", value: "propio" }
]

export const fields = [
  {label: "Codigo Activo", value: "placaText", type:"text"},
  {label: "Capacidad", value: "capacidad", type:"select" },
  {label: "Fabricante", value: "fabricante", type:"text" },
  {label: "Fecha Mto", value: "fechaUltimaRev", type:"date" },
  {label: "N Placa mto", value: "nPlaca", type:"text" },
  {label: "Serie", value: "serie", type:"text" },
  {label: "Año Fabricación", value: "anoFabricacion", type:"select" },
  {label: "Ubicación", value: "existeTanque", type:"select" },
  {label: "Propiedad", value: "propiedad", type:"select" },
  {label: "Registro Onac", value: "registroOnac", type:"text" },
  {label: "Ultima Rev Total", value: "ultimRevTotal", type:"date" }
]
export const capacidad = [
  '22000',
  '20000',
  '14000',
  '10000',
  '7610',
  '7000',
  '6400',
  '6000',
  '5000',
  '4220',
  '4000',
  '3300',
  '3000',
  '2978',
  '2940',
  '2400',
  '2140',
  '2086',
  '2000',
  '1800',
  '1790',
  '1500',
  '1400',
  '1235',
  '1200',
  '1000',
  '919',
  '700',
  '600',
  '500',
  '450',
  '300',
  '270',
  '261',
  '250',
  '230',
  '211',
  '130',
  '120',
  '100',
  '80',
  '70',
  '50',
];

export const imagenes = [
  {label: "Placa", value: "placa"},
  {label: "Placa Mantenimiento", value: "placaMantenimiento"},
  {label: "Placa Fabricante", value: "placaFabricante"},
  {label: "Dossier", value: "dossier"},
  {label: "Certificado Fabricante", value: "cerFabricante"},
  {label: "Certificado Onac", value: "cerOnac"},
  {label: "Visual", value: "visual"},
];
