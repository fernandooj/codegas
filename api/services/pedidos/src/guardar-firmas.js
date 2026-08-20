const { poolConection } = require('../../../lib/connection-pg.js');
const DatabaseError = require('../../../lib/errors/database-error');
const { uploadImage, signS3Url, resolveImageToDataUri } = require('../../../lib/image');

/**
 * Query SQL para actualizar firmas del pedido
 */
const UPDATE_FIRMAS_SQL = `
UPDATE pedidos 
SET 
    firma_conductor = COALESCE($2, firma_conductor),
    firma_usuario = COALESCE($3, firma_usuario)
WHERE _id = $1
RETURNING _id, firma_conductor, firma_usuario;
`;

/**
 * Guarda las firmas (conductor y usuario) de un pedido
 * 
 * @param {object} event - Evento de Lambda
 * @param {object} event.pathParameters - Parámetros de ruta
 * @param {string} event.pathParameters.pedidoId - ID del pedido
 * @param {object} event.body - Cuerpo de la petición (JSON string)
 * @param {string} event.body.firmaConductor - Imagen en base64 de la firma del conductor
 * @param {string} event.body.firmaUsuario - Imagen en base64 de la firma del usuario
 * @returns {Promise<object>} - Resultado de la operación
 */
module.exports.main = async (event) => {
    const { pedidoId } = event.pathParameters;
    const body = JSON.parse(event.body);
    const { firmaConductor, firmaUsuario } = body;

    let client;

    try {
        console.log('📝 Guardando firmas para pedido:', pedidoId);
        
        // Validar que al menos una firma esté presente
        if (!firmaConductor && !firmaUsuario) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    status: false,
                    message: 'Se requiere al menos una firma'
                })
            };
        }

        client = await poolConection.connect();

        const asS3Url = (value) => (
            typeof value === 'string' && /^https?:\/\//.test(value) ? value : null
        );

        // Subir firma del conductor si existe
        let firmaConductorUrl = null;
        if (firmaConductor) {
            console.log('📤 Subiendo firma del conductor...');
            const uploaded = await uploadImage({
                imagen: firmaConductor,
                mime: firmaConductor.match(/data:([^;]+);base64,/)?.[1] || 'image/png'
            });
            firmaConductorUrl = asS3Url(uploaded);
            if (!firmaConductorUrl) {
                throw new Error(uploaded?.message || 'No se pudo subir la firma del conductor');
            }
            console.log('✅ Firma conductor subida:', firmaConductorUrl);
        }

        // Subir firma del usuario si existe
        let firmaUsuarioUrl = null;
        if (firmaUsuario) {
            console.log('📤 Subiendo firma del usuario...');
            const uploaded = await uploadImage({
                imagen: firmaUsuario,
                mime: firmaUsuario.match(/data:([^;]+);base64,/)?.[1] || 'image/png'
            });
            firmaUsuarioUrl = asS3Url(uploaded);
            if (!firmaUsuarioUrl) {
                throw new Error(uploaded?.message || 'No se pudo subir la firma del cliente');
            }
            console.log('✅ Firma usuario subida:', firmaUsuarioUrl);
        }

        // Actualizar la base de datos
        const result = await client.query(UPDATE_FIRMAS_SQL, [
            pedidoId,
            firmaConductorUrl,
            firmaUsuarioUrl
        ]);

        console.log('✅ Firmas guardadas en base de datos');

        return {
            statusCode: 200,
            body: JSON.stringify({
                status: true,
                message: 'Firmas guardadas correctamente',
                data: result.rows[0]
            })
        };
    } catch (error) {
        console.error('❌ Error guardando firmas:', error);
        throw new DatabaseError(error);
    } finally {
        if (client) {
            client.release();
        }
    }
};

/**
 * Obtiene las firmas de un pedido
 */
module.exports.getFirmas = async (event) => {
    const { pedidoId } = event.pathParameters;
    
    let client;
    
    try {
        client = await poolConection.connect();
        
        const result = await client.query(
            'SELECT _id, firma_conductor, firma_usuario FROM pedidos WHERE _id = $1',
            [pedidoId]
        );
        
        if (result.rows.length === 0) {
            return {
                statusCode: 404,
                body: JSON.stringify({
                    status: false,
                    message: 'Pedido no encontrado'
                })
            };
        }
        
        const row = result.rows[0];
        const [firmaConductorDatauri, firmaUsuarioDatauri] = await Promise.all([
            resolveImageToDataUri(row.firma_conductor),
            resolveImageToDataUri(row.firma_usuario)
        ]);
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                status: true,
                data: {
                    _id: row._id,
                    firma_conductor: row.firma_conductor,
                    firma_usuario: row.firma_usuario,
                    firma_conductor_url: signS3Url(row.firma_conductor) || null,
                    firma_usuario_url: signS3Url(row.firma_usuario) || null,
                    firma_conductor_datauri: firmaConductorDatauri || null,
                    firma_usuario_datauri: firmaUsuarioDatauri || null
                }
            })
        };
    } catch (error) {
        console.error('❌ Error obteniendo firmas:', error);
        throw new DatabaseError(error);
    } finally {
        if (client) {
            client.release();
        }
    }
};
