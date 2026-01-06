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

// Función para subir una imagen a S3
export const uploadImageToS3 = async (imageUri: string, fileName?: string): Promise<string> => {
    try {
        console.log('🚀 [S3Upload] Iniciando subida de imagen...');
        console.log('📸 [S3Upload] Image URI:', imageUri);

        // Determinar extensión y mime type correctamente
        let fileExtension = 'jpg';
        let mimeType = 'image/jpeg';
        
        if (imageUri.startsWith('data:image')) {
            // Si es base64, extraer el mime type del prefijo
            const mimeMatch = imageUri.match(/data:image\/([^;]+);base64,/);
            if (mimeMatch) {
                const mime = mimeMatch[1].toLowerCase();
                fileExtension = mime === 'jpeg' ? 'jpg' : mime;
                mimeType = `image/${mime}`;
            }
        } else {
            // Si es una URI de archivo, extraer extensión del path
            const pathWithoutQuery = imageUri.split('?')[0]; // Remover query params si los hay
            const extension = pathWithoutQuery.split('.').pop()?.toLowerCase() || 'jpg';
            fileExtension = extension;
            mimeType = extension === 'jpg' || extension === 'jpeg' 
                ? 'image/jpeg' 
                : extension === 'png' 
                ? 'image/png' 
                : `image/${extension}`;
        }

        // Crear un nombre único para el archivo
        const timestamp = Date.now();
        const randomString = Math.random().toString(36).substring(2, 15);
        const finalFileName = fileName || `emergencia_${timestamp}_${randomString}.${fileExtension}`;

        console.log('📝 [S3Upload] File extension:', fileExtension);
        console.log('📝 [S3Upload] Mime type:', mimeType);
        console.log('📝 [S3Upload] Final file name:', finalFileName);

        // Convertir la imagen a base64
        console.log('🔄 [S3Upload] Convirtiendo imagen a base64...');
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
            timeout: 30000, // 30 segundos de timeout
        });

        console.log('📡 [S3Upload] Response status:', response.status);
        console.log('✅ [S3Upload] Response recibida:', response.data);

        const result = response.data;

        // El endpoint de upload/s3 retorna la URL directamente
        const imageUrl = result.url;
        console.log('🔗 [S3Upload] URL de imagen obtenida:', imageUrl);

        return imageUrl; // URL de la imagen en S3
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

// Función para convertir imagen a base64
const convertImageToBase64 = async (imageUri: string): Promise<string> => {
    try {
        // Si ya es base64, retornarlo directamente
        if (imageUri.startsWith('data:image')) {
            // Extraer solo la parte base64 sin el prefijo data:image/...;base64,
            const base64Data = imageUri.split(',')[1] || imageUri.replace(/^data:image\/[^;]+;base64,/, '');
            return base64Data;
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

