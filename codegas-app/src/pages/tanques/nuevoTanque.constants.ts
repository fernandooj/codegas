
import type {
    MediaKey,
    TanqueFieldKey,
    TanqueFieldOption,
    TanqueFieldConfig
} from './nuevoTanque.types';
import { capacidad as CAPACIDADES } from '../../utils/tanques';

const currentYear = new Date().getFullYear();

export const YEAR_OPTIONS: TanqueFieldOption[] = Array.from(
    { length: currentYear - 1999 },
    (_, index) => {
        const year = (currentYear - index).toString();
        return { label: year, value: year };
    }
);

const ESTADO_OPTIONS: TanqueFieldOption[] = [
    { label: 'Cliente', value: 'cliente' },
    { label: 'Bodega', value: 'bodega' }
];

const PROPIEDAD_OPTIONS: TanqueFieldOption[] = [
    { label: 'Propio', value: 'propio' },
    { label: 'Cliente', value: 'cliente' }
];

export const CAPACIDAD_OPTIONS: TanqueFieldOption[] = CAPACIDADES.map(value => ({
    label: `${value} Kg`,
    value
}));

export const TANQUE_FIELDS: TanqueFieldConfig[] = [
    { key: 'codigo_activo', label: 'Código Activo', placeholder: 'Ej: A1575', inputType: 'text' },
    { key: 'capacidad', label: 'Capacidad (Kg)', placeholder: 'Selecciona una capacidad', inputType: 'select', options: CAPACIDAD_OPTIONS },
    { key: 'fabricante', label: 'Fabricante', placeholder: 'Ej: ARCISA', inputType: 'text' },
    { key: 'fecha_mantenimiento', label: 'Fecha mantenimiento', placeholder: 'YYYY-MM-DD', inputType: 'date' },
    { key: 'n_placa', label: 'N° placa Mantenimiento', placeholder: 'Ej: M20202930', inputType: 'text' },
    { key: 'serie', label: 'Serie', placeholder: 'Ej: SERIE-001', inputType: 'text' },
    { key: 'ano_fabricacion', label: 'Año fabricación', placeholder: 'Selecciona un año', inputType: 'year' },
    { key: 'existe_tanque', label: 'Ubicación', placeholder: 'Ubicación', inputType: 'select', options: ESTADO_OPTIONS },
    { key: 'propiedad', label: 'Propiedad', placeholder: 'Selecciona propiedad', inputType: 'select', options: PROPIEDAD_OPTIONS },
    { key: 'registro_onac', label: 'Registro ONAC', placeholder: 'Ingrese el registro', inputType: 'text' },
    { key: 'fecha_ultima_rev', label: 'Última rev. total', placeholder: 'Ej: 2024-01-10', inputType: 'date' },
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
