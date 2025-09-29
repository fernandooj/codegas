const { uploadImage } = require('../../../lib/image');
const { uploadPDF } = require('../../../lib/pdf');

/**
 * Sube una imagen o PDF a S3 usando el sistema existente
 */
module.exports.main = async (event) => {
    try {
        const body = JSON.parse(event.body);
        const { image, mime } = body;

        if (!image || !mime) {
            return {
                statusCode: 400,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Content-Type',
                    'Access-Control-Allow-Methods': 'POST, OPTIONS'
                },
                body: JSON.stringify({
                    error: 'No se proporcionó archivo o mime type'
                })
            };
        }

        // Usar el sistema existente de subida de archivos
        console.log('📄 [UploadS3] Datos recibidos:', {
            image_length: image ? image.length : 'undefined',
            mime: mime,
            image_preview: image ? image.substring(0, 50) + '...' : 'undefined'
        });

        // Determinar qué función usar según el tipo de archivo
        let result;
        if (mime === 'application/pdf' || mime === 'image/pdf') {
            console.log('📄 [UploadS3] Llamando a uploadPDF con:', {
                imagen_length: image ? image.length : 'undefined',
                mime: mime
            });
            result = await uploadPDF({ imagen: image, mime: mime });
        } else {
            console.log('📸 [UploadS3] Llamando a uploadImage con:', {
                imagen_length: image ? image.length : 'undefined',
                mime: mime
            });
            result = await uploadImage({ imagen: image, mime: mime });
        }

        if (result.message) {
            // Si hay un error en la subida
            return {
                statusCode: 400,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Content-Type',
                    'Access-Control-Allow-Methods': 'POST, OPTIONS'
                },
                body: JSON.stringify({
                    error: result.message
                })
            };
        }

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'POST, OPTIONS'
            },
            body: JSON.stringify({
                success: true,
                url: result,
                fileName: result.split('/').pop()
            })
        };

    } catch (error) {
        console.error('Error uploading to S3:', error);
        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'POST, OPTIONS'
            },
            body: JSON.stringify({
                error: 'Error interno del servidor',
                details: error.message
            })
        };
    }
};
