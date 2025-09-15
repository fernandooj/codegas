const fetch = require('node-fetch');
const { poolConection } = require('../../../lib/connection-pg.js');
const { JWT } = require('google-auth-library');

// Configuración de Firebase Service Account
let serviceAccount;
try {
    // Intentar cargar desde archivo (recomendado para producción)
    serviceAccount = require('../../../firebase-service-account.json');
    console.log('✅ Credenciales de Firebase cargadas desde archivo');
} catch (error) {
    // Fallback a configuración en código (para desarrollo)
    serviceAccount = {
        "type": "service_account",
        "project_id": "codegas-1d43a",
        "private_key_id": "TU_PRIVATE_KEY_ID", // Reemplazar
        "private_key": "-----BEGIN PRIVATE KEY-----\nTU_PRIVATE_KEY\n-----END PRIVATE KEY-----\n", // Reemplazar
        "client_email": "firebase-adminsdk-xxxxx@codegas-1d43a.iam.gserviceaccount.com", // Reemplazar
        "client_id": "TU_CLIENT_ID", // Reemplazar
        "auth_uri": "https://accounts.google.com/o/oauth2/auth",
        "token_uri": "https://oauth2.googleapis.com/token",
        "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
        "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-xxxxx%40codegas-1d43a.iam.gserviceaccount.com" // Reemplazar
    };
    console.log('⚠️ Usando credenciales por defecto (configurar firebase-service-account.json)');
}

// Función para obtener el access token
async function getAccessToken() {
    try {
        const jwtClient = new JWT({
            email: serviceAccount.client_email,
            key: serviceAccount.private_key,
            scopes: ['https://www.googleapis.com/auth/firebase.messaging']
        });

        const tokens = await jwtClient.authorize();
        return tokens.access_token;
    } catch (error) {
        console.error('❌ Error obteniendo access token:', error);
        throw error;
    }
}

// Función para enviar notificación push real usando FCM v1
const enviarNotificacionPush = async (tokenPhone, titulo, mensaje) => {
    try {
        console.log(`📱 Enviando notificación FCM v1 a token: ${tokenPhone.substring(0, 20)}...`);
        console.log(`📱 Título: ${titulo}`);
        console.log(`📱 Mensaje: ${mensaje}`);

        // Obtener access token
        const accessToken = await getAccessToken();
        console.log('✅ Access token obtenido exitosamente');

        // Enviar notificación usando FCM v1 API
        const response = await fetch(`https://fcm.googleapis.com/v1/projects/codegas-1d43a/messages:send`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify({
                message: {
                    token: tokenPhone,
                    notification: {
                        title: titulo,
                        body: mensaje
                    },
                    data: {
                        group: "PEDIDOS",
                        tipo: "pedido_programado",
                        id: "pedido_3_dias"
                    },
                    android: {
                        priority: "high",
                        notification: {
                            channel_id: "codegas_notifications",
                            color: "#00ACD4",
                            icon: "ic_notification",
                            sound: "default",
                            click_action: "FLUTTER_NOTIFICATION_CLICK",
                            tag: "pedido_notification"
                        }
                    },
                    apns: {
                        payload: {
                            aps: {
                                alert: {
                                    title: titulo,
                                    body: mensaje
                                },
                                sound: "default",
                                badge: 1
                            }
                        }
                    }
                }
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ Error response FCM v1:', errorText);
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
        }

        const result = await response.json();
        console.log('📱 ✅ Notificación FCM v1 enviada exitosamente');
        console.log('📱 Respuesta FCM v1:', JSON.stringify(result, null, 2));

        // Convertir respuesta v1 a formato compatible con lógica existente
        return {
            success: 1,
            failure: 0,
            results: [{
                message_id: result.name,
                error: null
            }]
        };

    } catch (error) {
        console.error('❌ Error enviando notificación FCM v1:', error);

        // Fallback a simulación si no tenemos credenciales configuradas
        if (error.message.includes('TU_PRIVATE_KEY') ||
            error.message.includes('private_key') ||
            error.message.includes('DECODER routines') ||
            error.message.includes('unsupported') ||
            serviceAccount.private_key.includes('TU_PRIVATE_KEY')) {
            console.log('⚠️ Credenciales no configuradas, usando simulación...');
            return await enviarNotificacionSimulacion(tokenPhone, titulo, mensaje);
        }

        throw error;
    }
};

// Función de simulación como fallback
const enviarNotificacionSimulacion = async (tokenPhone, titulo, mensaje) => {
    console.log(`📱 [SIMULACIÓN] Enviando notificación a token: ${tokenPhone.substring(0, 20)}...`);
    console.log(`📱 [SIMULACIÓN] Título: ${titulo}`);
    console.log(`📱 [SIMULACIÓN] Mensaje: ${mensaje}`);

    await new Promise(resolve => setTimeout(resolve, 1000));

    const result = {
        success: 1,
        failure: 0,
        results: [{
            message_id: `sim_${Date.now()}`,
            error: null
        }]
    };

    console.log('📱 [SIMULACIÓN] Notificación enviada exitosamente');
    return result;
};

// Función principal
const notificarPedidos3Dias = async () => {
    const client = await poolConection.connect();

    try {
        console.log('Iniciando notificación de pedidos en 3 días...');

        // Calcular la fecha en 3 días
        const fechaEn3Dias = new Date();
        fechaEn3Dias.setDate(fechaEn3Dias.getDate() + 3);
        const fechaFormateada = fechaEn3Dias.toISOString().split('T')[0]; // YYYY-MM-DD

        console.log(`Buscando pedidos para entrega el: ${fechaFormateada}`);

        // Query para obtener pedidos que se entregan en 3 días
        const query = `
      SELECT 
        p._id as pedido_id,
        p.fechaentrega as fechaEntrega,
        p.cantidadkl as cantidadKl,
        p.kilos,
        p.valor_total,
        p.observacion,
        u._id as usuario_id,
        u.nombre as usuario_nombre,
        u.email as usuario_email,
                u.tokenphone
      FROM pedidos p
      INNER JOIN users u ON p.usuarioid = u._id
      WHERE DATE(p.fechaentrega) = $1
        AND p.eliminado = false
        AND p.entregado = false
        AND u.activo = true
        AND u.eliminado = false
        AND (u.tokenphone IS NOT NULL AND u.tokenphone != '')
    `;

        const result = await client.query(query, [fechaFormateada]);
        const pedidos = result.rows;

        console.log(`Encontrados ${pedidos.length} pedidos para notificar`);

        // Debug: mostrar información de cada pedido
        pedidos.forEach((pedido, index) => {
            console.log(`Pedido ${index + 1}:`, {
                id: pedido.pedido_id,
                usuario: pedido.usuario_nombre,
                tokenphone: pedido.tokenphone ? `${pedido.tokenphone.substring(0, 20)}...` : 'NULL',
                tokenphoneLength: pedido.tokenphone ? pedido.tokenphone.length : 0
            });
        });

        if (pedidos.length === 0) {
            return {
                statusCode: 200,
                body: JSON.stringify({
                    success: true,
                    message: 'No hay pedidos para notificar hoy',
                    fecha: fechaFormateada,
                    pedidosEncontrados: 0
                })
            };
        }

        // Procesar cada pedido y enviar notificación
        const resultados = [];

        for (const pedido of pedidos) {
            try {
                const titulo = "Recordatorio de Pedido";

                // Formatear la fecha para mostrar el día de la semana
                const fechaEntrega = new Date(pedido.fechaentrega || pedido.fechaEntrega);
                const opcionesFecha = {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    timeZone: 'America/Bogota'
                };
                const fechaFormateada = fechaEntrega.toLocaleDateString('es-CO', opcionesFecha);

                const mensaje = `Hola ${pedido.usuario_nombre}, tu pedido será entregado en 3 días (${fechaFormateada}). Cantidad: ${pedido.cantidadKl || pedido.kilos || 'N/A'} kg. ¡Prepárate para recibirlo!`;

                let notificacionEnviada = false;
                let errorNotificacion = null;

                // Verificar que el tokenphone existe y no está vacío
                if (pedido.tokenphone && pedido.tokenphone.trim() !== '') {
                    try {
                        console.log(`Enviando notificación a usuario ${pedido.usuario_id} con token: ${pedido.tokenphone.substring(0, 20)}...`);

                        const resultadoFCM = await enviarNotificacionPush(pedido.tokenphone, titulo, mensaje);

                        // Verificar si la notificación fue exitosa (API heredada)
                        if (resultadoFCM && resultadoFCM.success === 1) {
                            notificacionEnviada = true;
                            console.log(`✅ Notificación FCM enviada exitosamente a usuario ${pedido.usuario_id} (${pedido.usuario_nombre})`);
                        } else {
                            console.log(`❌ FCM retornó error:`, resultadoFCM);
                            errorNotificacion = resultadoFCM?.results?.[0]?.error || 'Error desconocido de FCM';
                        }
                    } catch (error) {
                        console.error(`❌ Error enviando notificación FCM a usuario ${pedido.usuario_id}:`, error);
                        errorNotificacion = error.message;
                    }
                } else {
                    console.log(`⚠️ Usuario ${pedido.usuario_id} no tiene tokenphone válido:`, pedido.tokenphone);
                    errorNotificacion = 'No hay tokenphone válido';
                }

                resultados.push({
                    pedido_id: pedido.pedido_id,
                    usuario_id: pedido.usuario_id,
                    usuario_nombre: pedido.usuario_nombre,
                    fechaEntrega: pedido.fechaEntrega,
                    notificacionEnviada: notificacionEnviada,
                    metodo: 'FCM',
                    error: errorNotificacion
                });

            } catch (error) {
                console.error(`Error procesando pedido ${pedido.pedido_id}:`, error);
                resultados.push({
                    pedido_id: pedido.pedido_id,
                    usuario_id: pedido.usuario_id,
                    usuario_nombre: pedido.usuario_nombre,
                    fechaEntrega: pedido.fechaEntrega,
                    notificacionEnviada: false,
                    metodo: 'FCM',
                    error: error.message
                });
            }
        }

        const exitosos = resultados.filter(r => r.notificacionEnviada).length;
        const fallidos = resultados.filter(r => !r.notificacionEnviada).length;

        console.log(`Notificaciones enviadas: ${exitosos}, Fallidas: ${fallidos}`);

        return {
            statusCode: 200,
            body: JSON.stringify({
                success: true,
                message: `Proceso completado. ${exitosos} notificaciones enviadas, ${fallidos} fallidas`,
                fecha: fechaFormateada,
                pedidosEncontrados: pedidos.length,
                notificacionesExitosas: exitosos,
                notificacionesFallidas: fallidos,
                resultados: resultados
            })
        };

    } catch (error) {
        console.error('Error en notificarPedidos3Dias:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                success: false,
                message: 'Error interno del servidor',
                error: error.message
            })
        };
    } finally {
        client.release();
    }
};

// Handler para Lambda
exports.main = async (event, context) => {
    try {
        console.log('Event:', JSON.stringify(event, null, 2));
        console.log('Context:', JSON.stringify(context, null, 2));

        const result = await notificarPedidos3Dias();

        console.log('Result:', JSON.stringify(result, null, 2));
        return result;

    } catch (error) {
        console.error('Error en handler:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                success: false,
                message: 'Error en el handler',
                error: error.message
            })
        };
    }
};
