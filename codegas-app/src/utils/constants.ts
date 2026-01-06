import type { ChecklistQuestion } from './constants.types';

export const accesos = [
    { label: 'Administrador', value: 'admin', key: 'administrador' },
    { label: 'Solución Cliente', value: 'solucion', key: 'solucion' },
    { label: 'Despachos', value: 'despacho', key: 'despacho' },
    { label: 'Conductor', value: 'conductor', key: 'conductor' },
    { label: 'Veo', value: 'veo', key: 'veo' },
    { label: 'Cliente', value: 'cliente', key: 'cliente' },
    { label: 'Comercial', value: 'comercial', key: 'comercial' },
    { label: 'Departamento Tecnico', value: 'depTecnico', key: 'depTecnico' },
    { label: 'Inspector Seguridad', value: 'insSeguridad', key: 'insSeguridad' },
    { label: 'Administrador Tanques', value: 'adminTanque', key: 'adminTanque' }
];

export const sectores = [{ key: "E2", label: "E2" }, { key: "E3", label: "E3" }, { key: "E4", label: "E4" }, { key: "E5", label: "E5" }, { key: "E6", label: "E6" }, { key: "O", label: "O" }, { key: "C", label: "C" }, { key: "I", label: "I" }, { key: "OT", label: "OT" }]
export const ubicaciones = [{ key: "Azotea", label: "Azotea" }, { key: "Enterrado", label: "Enterrado" }, { key: "Piso", label: "Piso" }]
export const propiedades = [{ key: "Usuario", label: "Usuario" }, { key: "Propio", label: "Propio" }]
export const m3s = [{ key: "Si", label: "Si" }, { key: "No", label: "No" }]



export const images = [
    { title: 'Soporte Entrega', type: 'soporteEntrega', mime: 'image/jpeg', source: 'imgSoporteEntrega' },
    { title: 'Punto Consumo', type: 'puntoConsumo', mime: 'image/jpeg', source: 'imgPuntoConsumo' },
    { title: 'Visual instalación', type: 'visual', mime: 'image/jpeg', source: 'imgVisual' },
    { title: 'Doc. de comodato', type: 'nComodato', mime: 'application/pdf', source: 'imgNComodato' },
    { title: 'Isometrico', type: 'isometrico', mime: 'application/pdf', source: 'imgIsometrico' },
    { title: 'Otros Comodato', type: 'otrosComodato', mime: 'application/pdf', source: 'imgOtrosComodato' },
    { title: 'Protocolo Llenado', type: 'protocoloLlenado', mime: 'application/pdf', source: 'imgProtocoloLlenado' },
    { title: 'Hoja Seguridad', type: 'hojaSeguridad', mime: 'application/pdf', source: 'imgHojaSeguridad' },
    { title: 'Otros Si', type: 'otrosSi', mime: 'application/pdf', source: 'imgOtrosSi' },
    { title: 'Documento', type: 'documento', mime: 'application/pdf', source: 'imgDocumento' },
    { title: 'Dep. Tecnico', type: 'depTecnico', mime: 'application/pdf', source: 'imgDepTecnico' }
];

// Safety Checklist Questions
export const safetyChecklistQuestions: ChecklistQuestion[] = [
    {
        id: 1,
        question: "¿Verificó visualmente la zona alrededor, entre el tanque y la planta móvil que estén libres de fuentes de ignición, hojarasca o cualquier situación de riesgo?"
    },
    {
        id: 2,
        question: "¿Verificó visualmente la hermeticidad de las mangueras, conexiones y de los empaques?"
    },
    {
        id: 3,
        question: "¿Revisó las válvulas del tanque estacionario, incluyendo indicador del nivel antes del llenado?"
    },
    {
        id: 4,
        question: "¿Utilizó el indicador fijo de nivel (grifo), o el día del flotador, para evitar sobrellenados?"
    },
    {
        id: 5,
        question: "¿Ubicó los extintores del carro?"
    },
    {
        id: 6,
        question: "¿Ubicó los conos?"
    },
    {
        id: 7,
        question: "¿Estableció la distancia mínima de 3m?"
    },
    {
        id: 8,
        question: "¿Utilizó adecuadamente los implementos personales de seguridad (la tripulación)?"
    },
    {
        id: 9,
        question: "¿Verificó que no haya personal cerca, no autorizado para realizar la operación?"
    },
    {
        id: 10,
        question: "¿Verificó que al conectar la manguera de suministro no quedó escapes?"
    },
    {
        id: 11,
        question: "¿Verificó que durante y después del suministro no hayan quedado fugas en la válvula de llenado y/o accesorios?"
    }
];