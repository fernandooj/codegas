import type { NavigationProp } from '@react-navigation/native';

export type TanqueFieldKey =
    | 'codigo_activo'
    | 'placa_text'
    | 'capacidad'
    | 'fabricante'
    | 'fecha_mantenimiento'
    | 'n_placa'
    | 'serie'
    | 'ano_fabricacion'
    | 'existe_tanque'
    | 'propiedad'
    | 'registro_onac'
    | 'fecha_ultima_rev'

export type TanqueForm = Record<TanqueFieldKey, string>;

export type MediaKey =
    | 'placa'
    | 'placaMantenimiento'
    | 'placaFabricante'
    | 'visual'
    | 'dossier'
    | 'cerFabricante'
    | 'cerOnac';

export type MediaState = Record<MediaKey, any[]>;

export type ClienteItem = {
    _id: string;
    nombre?: string;
    razon_social?: string;
    codt?: string;
    email?: string;
    cedula?: string;
    celular?: string;
};

export type PuntoItem = {
    _id: string;
    direccion: string;
    capacidad?: number | string;
    nombre?: string;
    celular?: string;
    email?: string;
    observacion?: string;
};

export type NuevaRevisionProps = {
    navigation: NavigationProp<any>;
    route: any;
};

export type RootState = {
    usuario: {
        usuarios: ClienteItem[];
    };
};

export type TanqueFieldOption = {
    label: string;
    value: string;
};

export type TanqueFieldConfig = {
    key: TanqueFieldKey;
    label: string;
    placeholder: string;
    keyboardType?: 'default' | 'numeric';
    inputType?: 'text' | 'select' | 'year' | 'date';
    options?: TanqueFieldOption[];
};
