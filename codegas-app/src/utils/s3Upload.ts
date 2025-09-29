import { Platform } from 'react-native';

// Configuración de S3 (estos valores deberían venir de variables de entorno)
const S3_CONFIG = {
    bucketName: 'codegas', // Nombre del bucket de S3
    region: 'us-east-1', // Región de AWS
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'your-access-key',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'your-secret-key',
};

// Función para subir una imagen a S3
export const uploadImageToS3 = async (imageUri: string, fileName?: string): Promise<string> => {
    try {
        console.log('🚀 [S3Upload] Iniciando subida de imagen...');
        console.log('📸 [S3Upload] Image URI:', imageUri);

        // Crear un nombre único para el archivo
        const timestamp = Date.now();
        const randomString = Math.random().toString(36).substring(2, 15);
        const fileExtension = imageUri.split('.').pop() || 'jpg';
        const finalFileName = fileName || `emergencia_${timestamp}_${randomString}.${fileExtension}`;

        console.log('📝 [S3Upload] File extension:', fileExtension);
        console.log('📝 [S3Upload] Final file name:', finalFileName);

        // Convertir la imagen a base64
        console.log('🔄 [S3Upload] Convirtiendo imagen a base64...');
        const base64Data = await convertImageToBase64(imageUri);
        console.log('✅ [S3Upload] Base64 conversion completada. Longitud:', base64Data.length);

        // Crear el objeto para subir a S3
        const uploadData = {
            image: base64Data,
            mime: `image/${fileExtension}`
        };

        const requestBody = {
            image: base64Data,
            mime: `image/${fileExtension}`
        };

        console.log('🌐 [S3Upload] Enviando request al backend...');
        console.log('🔗 [S3Upload] URL:', `${process.env.API_URL || 'http://192.168.0.5:4000'}/upload/s3`);
        console.log('📦 [S3Upload] Request body size:', JSON.stringify(requestBody).length, 'bytes');
        console.log('📦 [S3Upload] Request body preview:', {
            image_length: requestBody.image.length,
            mime: requestBody.mime
        });

        // Subir a S3 a través del endpoint de upload
        const response = await fetch(`${process.env.API_URL || 'http://192.168.0.5:4000'}/upload/s3`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        });

        console.log('📡 [S3Upload] Response status:', response.status);
        console.log('📡 [S3Upload] Response ok:', response.ok);
        console.log('📡 [S3Upload] Response headers:', Object.fromEntries(response.headers.entries()));

        if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ [S3Upload] Error response:', errorText);
            throw new Error(`Error uploading to S3: ${response.statusText}`);
        }

        const result = await response.json();
        console.log('✅ [S3Upload] Response recibida:', result);

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
        // En React Native, necesitamos usar una librería como react-native-fs
        // Por ahora, retornamos la URI como está y el backend la procesará
        return imageUri;
    } catch (error) {
        console.error('Error converting image to base64:', error);
        throw error;
    }
};

// Función para generar URL de S3
export const generateS3Url = (fileName: string): string => {
    return `https://${S3_CONFIG.bucketName}.s3.${S3_CONFIG.region}.amazonaws.com/${fileName}`;
};
