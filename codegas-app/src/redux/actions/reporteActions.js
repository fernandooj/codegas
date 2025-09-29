import axios from 'axios';
import { Platform } from 'react-native';

// Action types
export const REPORTE_EMERGENCIA_LOADING = 'REPORTE_EMERGENCIA_LOADING';
export const REPORTE_EMERGENCIA_SUCCESS = 'REPORTE_EMERGENCIA_SUCCESS';
export const REPORTE_EMERGENCIA_ERROR = 'REPORTE_EMERGENCIA_ERROR';
export const REPORTE_EMERGENCIA_SEARCH = 'REPORTE_EMERGENCIA_SEARCH';
export const REPORTE_EMERGENCIA_BY_ID_LOADING = 'REPORTE_EMERGENCIA_BY_ID_LOADING';
export const REPORTE_EMERGENCIA_BY_ID_SUCCESS = 'REPORTE_EMERGENCIA_BY_ID_SUCCESS';
export const REPORTE_EMERGENCIA_BY_ID_ERROR = 'REPORTE_EMERGENCIA_BY_ID_ERROR';
export const REPORTE_EMERGENCIA_CREATE_LOADING = 'REPORTE_EMERGENCIA_CREATE_LOADING';
export const REPORTE_EMERGENCIA_CREATE_SUCCESS = 'REPORTE_EMERGENCIA_CREATE_SUCCESS';
export const REPORTE_EMERGENCIA_CREATE_ERROR = 'REPORTE_EMERGENCIA_CREATE_ERROR';
export const REPORTE_EMERGENCIA_CLOSE_LOADING = 'REPORTE_EMERGENCIA_CLOSE_LOADING';
export const REPORTE_EMERGENCIA_CLOSE_SUCCESS = 'REPORTE_EMERGENCIA_CLOSE_SUCCESS';
export const REPORTE_EMERGENCIA_CLOSE_ERROR = 'REPORTE_EMERGENCIA_CLOSE_ERROR';
export const REPORTE_EMERGENCIA_UPLOAD_LOADING = 'REPORTE_EMERGENCIA_UPLOAD_LOADING';
export const REPORTE_EMERGENCIA_UPLOAD_SUCCESS = 'REPORTE_EMERGENCIA_UPLOAD_SUCCESS';
export const REPORTE_EMERGENCIA_UPLOAD_ERROR = 'REPORTE_EMERGENCIA_UPLOAD_ERROR';

// Action creators
export const getReportesEmergencia = (start = 0, limit = 100, search = '') => {
    return async (dispatch) => {
        dispatch({ type: REPORTE_EMERGENCIA_LOADING });

        try {
            const response = await axios.get(`/rep/reporte-emergencia/${start}/${limit}/${search}`);
            dispatch({
                type: REPORTE_EMERGENCIA_SUCCESS,
                payload: response.data.reporte || []
            });
        } catch (error) {
            console.error('Error fetching reportes emergencia:', error);
            dispatch({
                type: REPORTE_EMERGENCIA_ERROR,
                payload: error.message
            });
        }
    };
};

export const getReporteEmergenciaById = (reporteId) => {
    return async (dispatch) => {
        dispatch({ type: REPORTE_EMERGENCIA_BY_ID_LOADING });

        try {
            const response = await axios.get(`/rep/reporte-emergencia/byId/${reporteId}`);
            dispatch({
                type: REPORTE_EMERGENCIA_BY_ID_SUCCESS,
                payload: response.data.reporte
            });
        } catch (error) {
            console.error('Error fetching reporte by id:', error);
            dispatch({
                type: REPORTE_EMERGENCIA_BY_ID_ERROR,
                payload: error.message
            });
        }
    };
};

export const createReporteEmergencia = (reporteData) => {
    return async (dispatch) => {
        dispatch({ type: REPORTE_EMERGENCIA_CREATE_LOADING });

        try {
            const response = await axios({
                method: 'post',
                url: `/rep/reporte-emergencia`,
                data: JSON.stringify(reporteData),
                headers: {
                    'Content-Type': 'application/json'
                },
            });

            dispatch({
                type: REPORTE_EMERGENCIA_CREATE_SUCCESS,
                payload: response.data.reporte
            });
        } catch (error) {
            console.error('Error creating reporte emergencia:', error);
            dispatch({
                type: REPORTE_EMERGENCIA_CREATE_ERROR,
                payload: error.message
            });
        }
    };
};

export const closeReporteEmergencia = (closeData) => {
    return async (dispatch) => {
        dispatch({ type: REPORTE_EMERGENCIA_CLOSE_LOADING });

        try {
            const response = await axios({
                method: 'put',
                url: `/rep/reporte-emergencia/cerrar`,
                data: JSON.stringify(closeData),
                headers: {
                    'Content-Type': 'application/json'
                },
            });

            dispatch({
                type: REPORTE_EMERGENCIA_CLOSE_SUCCESS,
                payload: response.data
            });
        } catch (error) {
            console.error('Error closing reporte emergencia:', error);
            dispatch({
                type: REPORTE_EMERGENCIA_CLOSE_ERROR,
                payload: error.message
            });
        }
    };
};

export const uploadImagenReporteEmergencia = (imagenData) => {
    return async (dispatch) => {
        dispatch({ type: REPORTE_EMERGENCIA_UPLOAD_LOADING });

        try {
            const response = await axios({
                method: 'PUT',
                url: `/rep/reporte-emergencia/add-images-reporte-emergencia`,
                data: JSON.stringify(imagenData),
                headers: {
                    'Content-Type': 'application/json'
                },
            });

            dispatch({
                type: REPORTE_EMERGENCIA_UPLOAD_SUCCESS,
                payload: response.data
            });
        } catch (error) {
            console.error('Error uploading imagen:', error);
            dispatch({
                type: REPORTE_EMERGENCIA_UPLOAD_ERROR,
                payload: error.message
            });
        }
    };
};

export const searchReportesEmergencia = (searchTerm) => {
    return (dispatch) => {
        dispatch({
            type: REPORTE_EMERGENCIA_SEARCH,
            payload: searchTerm
        });
    };
};

// Función para convertir imagen a base64
const convertImageToBase64 = async (imageUri) => {
    try {
        console.log('🔄 [ReporteActions] Convirtiendo imagen a base64...');
        console.log('📸 [ReporteActions] Image URI:', imageUri);

        // Para React Native, necesitamos usar una librería como react-native-fs
        // Por ahora, vamos a simular la conversión para testing
        // En producción, deberías usar react-native-fs o similar

        if (Platform.OS === 'web') {
            // En web, podemos usar fetch
            const response = await fetch(imageUri);
            const blob = await response.blob();
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    const base64 = reader.result.split(',')[1];
                    console.log('✅ [ReporteActions] Base64 conversion completada. Longitud:', base64.length);
                    resolve(base64);
                };
                reader.onerror = reject;
                reader.readAsDataURL(blob);
            });
        } else {
            // En React Native, esta función no debería ser llamada si tenemos base64
            // del react-native-image-picker. Si llegamos aquí, es un error.
            console.error('❌ [ReporteActions] convertImageToBase64 no debería ser llamada en React Native');
            console.error('❌ [ReporteActions] El base64 debería venir directamente de react-native-image-picker');
            throw new Error('Base64 conversion no disponible en React Native. Use react-native-image-picker con includeBase64: true');
        }
    } catch (error) {
        console.error('❌ [ReporteActions] Error converting image to base64:', error);
        throw error;
    }
};

// Función para subir imagen a S3
export const uploadImageToS3 = (imageData, fileName) => {
    return async (dispatch) => {
        try {
            console.log('🚀 [ReporteActions] Iniciando subida de imagen a S3...');
            console.log('📸 [ReporteActions] Image data:', imageData);

            const imageUri = imageData.uri || imageData;
            const base64Data = imageData.base64;

            // Crear un nombre único para el archivo
            const timestamp = Date.now();
            const randomString = Math.random().toString(36).substring(2, 15);
            const fileExtension = imageUri.split('.').pop() || 'jpg';
            const finalFileName = fileName || `emergencia_${timestamp}_${randomString}.${fileExtension}`;

            console.log('📝 [ReporteActions] File extension:', fileExtension);
            console.log('📝 [ReporteActions] Final file name:', finalFileName);

            // Requerir base64 del react-native-image-picker
            if (!base64Data) {
                console.error('❌ [ReporteActions] Base64 es requerido pero no está disponible');
                throw new Error('Base64 data is required. Make sure react-native-image-picker is configured with includeBase64: true');
            }

            console.log('✅ [ReporteActions] Usando base64 proporcionado directamente');
            const finalBase64Data = base64Data;

            const requestBody = {
                image: finalBase64Data,
                mime: fileExtension === 'jpg' ? 'image/jpeg' : `image/${fileExtension}`
            };

            console.log('🌐 [ReporteActions] Enviando request al backend...');
            console.log('🔗 [ReporteActions] URL: /upload/s3');
            console.log('📦 [ReporteActions] Request body size:', JSON.stringify(requestBody).length, 'bytes');
            console.log('📦 [ReporteActions] Request body preview:', {
                image_length: requestBody.image.length,
                mime: requestBody.mime
            });

            // Subir a S3 a través del endpoint de upload
            const response = await axios({
                method: 'POST',
                url: '/upload/s3',
                data: JSON.stringify(requestBody),
                headers: {
                    'Content-Type': 'application/json'
                },
            });

            console.log('📡 [ReporteActions] Response status:', response.status);
            console.log('📡 [ReporteActions] Response data:', response.data);

            if (response.data.error) {
                throw new Error(response.data.error);
            }

            const imageUrl = response.data.url;
            console.log('✅ [ReporteActions] URL de imagen obtenida:', imageUrl);

            return imageUrl; // URL de la imagen en S3
        } catch (error) {
            console.error('❌ [ReporteActions] Error uploading image to S3:', error);
            throw error;
        }
    };
};

// Función para subir múltiples imágenes a S3
export const uploadMultipleImagesToS3 = (imageDataArray) => {
    return async (dispatch) => {
        try {
            console.log('📸 [ReporteActions] uploadMultipleImagesToS3 llamada con:', imageDataArray.length, 'imágenes');

            const uploadPromises = imageDataArray.map((imageData, index) =>
                dispatch(uploadImageToS3(imageData, `emergencia_${Date.now()}_${index}.jpg`))
            );

            const urls = await Promise.all(uploadPromises);
            console.log('✅ [ReporteActions] URLs obtenidas:', urls);

            return urls;
        } catch (error) {
            console.error('❌ [ReporteActions] Error uploading multiple images to S3:', error);
            throw error;
        }
    };
};
