import type {
    MediaKey,
    TanqueFieldKey,
    TanqueFieldOption,
    TanqueFieldConfig
} from './nuevaRevision.types';

const currentYear = new Date().getFullYear();

export const YEAR_OPTIONS: TanqueFieldOption[] = Array.from(
    { length: currentYear - 1999 },
    (_, index) => {
        const year = (currentYear - index).toString();
        return { label: year, value: year };
    }
);

const ESTADO_OPTIONS: TanqueFieldOption[] = [
    { label: 'Nuevo', value: 'nuevo' },
    { label: 'Usado', value: 'usado' }
];

const PROPIEDAD_OPTIONS: TanqueFieldOption[] = [
    { label: 'Propio', value: 'propio' },
    { label: 'Cliente', value: 'cliente' }
];

export const TANQUE_FIELDS: TanqueFieldConfig[] = [
    { key: 'codigoActivo', label: 'Código Activo', placeholder: 'Ej: A1575', inputType: 'text' },
    { key: 'capacidad', label: 'Capacidad (Kg)', placeholder: 'Ej: 120', keyboardType: 'numeric', inputType: 'text' },
    { key: 'placaText', label: 'Nombre del Tanque', placeholder: 'Ej: Tanque principal', inputType: 'text' },
    { key: 'fabricante', label: 'Fabricante', placeholder: 'Ej: ARCISA', inputType: 'text' },
    { key: 'registroOnac', label: 'Registro ONAC', placeholder: 'Ingrese el registro', inputType: 'text' },
    { key: 'fechaUltimaRev', label: 'Fecha última revisión', placeholder: 'YYYY-MM-DD', inputType: 'text' },
    { key: 'nPlaca', label: 'N° placa Mantenimiento', placeholder: 'Ej: M20202930', inputType: 'text' },
    { key: 'serie', label: 'Serie', placeholder: 'Ej: SERIE-001', inputType: 'text' },
    { key: 'anoFabricacion', label: 'Año fabricación', placeholder: 'Selecciona un año', inputType: 'year' },
    { key: 'existeTanque', label: 'Estado del tanque', placeholder: 'Selecciona estado', inputType: 'select', options: ESTADO_OPTIONS },
    { key: 'ultimRevTotal', label: 'Última rev. total', placeholder: 'Ej: 2024-01-10', inputType: 'text' },
    { key: 'propiedad', label: 'Propiedad', placeholder: 'Selecciona propiedad', inputType: 'select', options: PROPIEDAD_OPTIONS }
];

export const MEDIA_IMAGE_FIELDS: Array<{ key: MediaKey; title: string; helper: string }> = [
    {
        key: 'placa',
        title: 'Placas del tanque',
        helper: 'Toma fotos claras de las placas principales.'
    },
    {
        key: 'placaMantenimiento',
        title: 'Placa de mantenimiento',
        helper: 'Asegura que el número de placa sea legible.'
    },
    {
        key: 'placaFabricante',
        title: 'Placa del fabricante',
        helper: 'Captura el nombre del fabricante e información legal.'
    },
    {
        key: 'visual',
        title: 'Inspección visual',
        helper: 'Registra fotografías generales del estado del tanque.'
    }
];

export const MEDIA_DOC_FIELDS: Array<{ key: MediaKey; title: string; helper: string; limit: number }> = [
    {
        key: 'dossier',
        title: 'Dossier técnico',
        helper: 'Adjunta el dossier en PDF (máx. 2 archivos).',
        limit: 2
    },
    {
        key: 'cerFabricante',
        title: 'Certificado del fabricante',
        helper: 'Documentos emitidos por el fabricante en PDF.',
        limit: 2
    },
    {
        key: 'cerOnac',
        title: 'Certificado ONAC',
        helper: 'Adjunta los certificados vigentes en PDF.',
        limit: 2
    }
];

export const cardShadow = {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3
};
