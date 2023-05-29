export const accesos = [
  {label: 'Administrador', value: 'admin', key: 'administrador'},
  {label: 'Solución Cliente', value: 'solucion', key:'solucion'},
  {label: 'Despachos', value: 'despacho', key:'despacho'},
  {label: 'Conductor', value: 'conductor', key: 'conductor'},
  {label: 'Veo', value: 'veo', key: 'veo'},
  {label: 'Cliente', value: 'cliente', key: 'cliente'},
  {label: 'Comercial', value: 'comercial', key: 'comercial'},
  {label: 'Departamento Tecnico', value: 'depTecnico', key: 'depTecnico'},
  {label: 'Inspector Seguridad', value: 'insSeguridad', key: 'insSeguridad'},
  {label: 'Administrador Tanques', value: 'adminTanque', key: 'adminTanque'}
];

export const fields = [
  {label: "Email", value: "email", acceso:"all" },
  {label: "Cedula / Nit", value: "cedula", acceso:"all" },
  {label: "Nombre", value: "nombre", acceso:"all" },
  {label: "Celular", value: "celular", acceso:"all" },
  {label: "Codigo Master", value: "codMagister", acceso:"veo" },
  {label: "Razon Social", value: "razon_social", acceso:"cliente" },
  {label: "Direccion Factura", value: "direccion_factura", acceso:"cliente" },
  {label: "Codt", value: "codt", acceso:"cliente" },
  {label: "Valor Unitario", value: "valorUnitario", acceso:"cliente" },
]

export const tipos = [
  {label: "Residencial", value: "Residencial" },
  {label: "Comercial", value: "comercial" },
  {label: "Industrial", value: "industrial" },
]