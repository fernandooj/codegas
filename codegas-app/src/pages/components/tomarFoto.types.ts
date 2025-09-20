export interface TomarFotoProps {
    source?: string[];
    width?: number;
    titulo?: string;
    descripcion?: string;
    multiple?: boolean;
    limiteImagenes?: number;
    imagenes?: (imagenes: any) => void;
    avatar?: boolean;
    tipoMensaje?: boolean;
    cerrar?: () => void;
    soloLectura?: boolean;
    mostrarSoloConImagenes?: boolean;
    permitirSubir?: boolean;
}

export interface ImagenData {
    uri: string;
    type?: string;
    name?: string;
    path?: string;
    imagen?: string;
}
