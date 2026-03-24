import RNFS from 'react-native-fs';
import axios from 'axios';

// Obtener la URL base de la API desde la configuración de axios (manejada desde App.tsx)
const getApiUrl = () => {
    // Usar la baseURL configurada en axios desde App.tsx vía updateBaseURL
    if (axios.defaults.baseURL) {
        console.log('📡 [S3Upload] Usando baseURL de axios:', axios.defaults.baseURL);
        return axios.defaults.baseURL;
    }

    // Fallback si no está configurado (no debería pasar)
    console.warn('⚠️ [S3Upload] axios.defaults.baseURL no está configurado');
    throw new Error('La URL base de la API no está configurada. Por favor, configura axios.defaults.baseURL desde App.tsx');
};

// Función para subir imagen o PDF a S3 (mismo endpoint /upload/s3)
export const uploadImageToS3 = async (imageUri: string, fileName?: string): Promise<string> => {
    try {
        console.log('🚀 [S3Upload] Iniciando subida...');
        console.log('📎 [S3Upload] URI (preview):', imageUri.slice(0, 80));

        let fileExtension = 'jpg';
        let mimeType = 'image/jpeg';

        if (imageUri.startsWith('data:')) {
            const dataMatch = imageUri.match(/^data:([^;]+);base64,/);
            if (dataMatch) {
                const fullMime = dataMatch[1].toLowerCase();
                if (fullMime === 'application/pdf') {
                    fileExtension = 'pdf';
                    mimeType = 'application/pdf';
                } else if (fullMime.startsWith('image/')) {
                    const sub = fullMime.replace('image/', '');
                    fileExtension = sub === 'jpeg' ? 'jpg' : sub;
                    mimeType = fullMime;
                }
            }
        } else {
            const pathWithoutQuery = imageUri.split('?')[0];
            const extension = pathWithoutQuery.split('.').pop()?.toLowerCase() || 'jpg';
            fileExtension = extension;
            if (extension === 'pdf') {
                mimeType = 'application/pdf';
            } else if (extension === 'jpg' || extension === 'jpeg') {
                mimeType = 'image/jpeg';
            } else if (extension === 'png') {
                mimeType = 'image/png';
            } else {
                mimeType = extension.startsWith('image') ? extension : `image/${extension}`;
            }
        }

        // Crear un nombre único para el archivo
        const timestamp = Date.now();
        const randomString = Math.random().toString(36).substring(2, 15);
        const finalFileName = fileName || `emergencia_${timestamp}_${randomString}.${fileExtension}`;

        console.log('📝 [S3Upload] File extension:', fileExtension);
        console.log('📝 [S3Upload] Mime type:', mimeType);
        console.log('📝 [S3Upload] Final file name:', finalFileName);

        console.log('🔄 [S3Upload] Convirtiendo a base64...');
        const base64Data = await convertImageToBase64(imageUri);
        console.log('✅ [S3Upload] Base64 conversion completada. Longitud:', base64Data.length);

        // Crear el objeto para enviar al backend (el backend se encarga de subir a S3)
        const requestBody = {
            image: base64Data,
            mime: mimeType
        };

        console.log('🌐 [S3Upload] Enviando request al backend...');
        const apiUrl = getApiUrl();
        // El backend maneja la subida a S3, solo necesitamos el endpoint correcto
        const uploadUrl = `${apiUrl}/upload/s3`;
        console.log('🔗 [S3Upload] URL:', uploadUrl);
        console.log('📦 [S3Upload] Request body size:', JSON.stringify(requestBody).length, 'bytes');
        console.log('📦 [S3Upload] Request body preview:', {
            image_length: requestBody.image.length,
            mime: requestBody.mime
        });

        // Subir a S3 a través del endpoint de upload usando axios para mantener consistencia
        const response = await axios.post(uploadUrl, requestBody, {
            headers: {
                'Content-Type': 'application/json',
            },
            timeout: 120000,
        });

        console.log('📡 [S3Upload] Response status:', response.status);
        console.log('📡 [S3Upload] Response recibida:', response.data);

        let result: { url?: string; error?: string } = response.data;
        if (typeof result === 'string') {
            try {
                result = JSON.parse(result) as { url?: string; error?: string };
            } catch {
                throw new Error('Respuesta del servidor no es JSON válido');
            }
        }

        if (result && typeof result === 'object' && result.error) {
            throw new Error(String(result.error));
        }

        const imageUrl = result?.url;
        if (!imageUrl || typeof imageUrl !== 'string') {
            throw new Error('El servidor no devolvió url de imagen');
        }
        console.log('🔗 [S3Upload] URL de imagen obtenida:', imageUrl);

        return imageUrl;
    } catch (error) {
        console.error('❌ [S3Upload] Error uploading image to S3:', error);
        throw error;
    }
};

// Función para subir múltiples imágenes a S3
export const uploadMultipleImagesToS3 = async (imageUris: string[]): Promise<string[]> => {
    try {
        const uploadPromises = imageUris.map((uri, index) =>
            uploadImageToS3(uri, `emergencia_${Date.now()}_${index}.jpg`)
        );

        const urls = await Promise.all(uploadPromises);
        return urls;
    } catch (error) {
        console.error('Error uploading multiple images to S3:', error);
        throw error;
    }
};

function isPdfPickerItem(item: { uri?: string; base64?: string | null; name?: string }): boolean {
    const hint = `${item.name || ''} ${item.uri || ''}`.toLowerCase();
    return hint.includes('.pdf');
}

/** Data URL o file URI para uploadImageToS3 (PDF si el nombre/uri termina en .pdf) */
function pickerItemToUploadUri(item: { uri?: string; base64?: string | null; name?: string }): string {
    const b64 = item.base64?.trim();
    if (b64) {
        if (isPdfPickerItem(item)) {
            return `data:application/pdf;base64,${b64}`;
        }
        return `data:image/jpeg;base64,${b64}`;
    }
    const u = item.uri;
    if (!u) {
        throw new Error('El archivo no tiene uri ni base64');
    }
    return u;
}

/**
 * Sube imágenes desde react-native-image-picker (`{ uri, base64 }`) sin Redux.
 * Evita thunks anidados que en algunos entornos no devuelven la promesa correctamente.
 */
export const uploadPickerImagesToS3 = async (
    items: { uri?: string; base64?: string | null; name?: string }[]
): Promise<string[]> => {
    const ts = Date.now();
    const uploads = items.map((item, index) => {
        const pdf = isPdfPickerItem(item);
        const ext = pdf ? 'pdf' : 'jpg';
        const prefix = pdf ? 'documento' : 'emergencia';
        return uploadImageToS3(
            pickerItemToUploadUri(item),
            `${prefix}_${ts}_${index}.${ext}`
        );
    });
    return Promise.all(uploads);
};

const convertImageToBase64 = async (imageUri: string): Promise<string> => {
    try {
        if (imageUri.startsWith('data:')) {
            const comma = imageUri.indexOf(',');
            if (comma !== -1) {
                return imageUri.slice(comma + 1);
            }
        }

        // Si es una URI local, leer el archivo con RNFS
        const normalizedUri = imageUri.replace('file://', '');

        // Verificar que el archivo existe
        const exists = await RNFS.exists(normalizedUri);
        if (!exists) {
            throw new Error(`El archivo no existe: ${normalizedUri}`);
        }

        // Leer el archivo en base64
        const base64 = await RNFS.readFile(normalizedUri, 'base64');
        return base64;
    } catch (error: any) {
        console.error('❌ [S3Upload] Error converting image to base64:', error);
        throw new Error(`Error al convertir imagen a base64: ${error?.message || String(error)}`);
    }
};

