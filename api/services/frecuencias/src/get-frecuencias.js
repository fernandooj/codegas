const nodemailer = require('nodemailer');
const { poolConection } = require('../../../lib/connection-pg.js');
const DatabaseError = require('../../../lib/errors/database-error');

// Usar create_frecuencias_* para crear los pedidos automáticamente
const CREATE_FRECUENCIAL_SEMANAL = 'SELECT * FROM create_frecuencias_semanal($1)';
const CREATE_FRECUENCIAL_QUINCENAL = 'SELECT * FROM create_frecuencias_quincenal($1)';
const CREATE_FRECUENCIAL_MENSUAL = 'SELECT * FROM create_frecuencias_mensual($1)';

const TYPE_SEMANAL = 'semanal'
const TYPE_QUINCENAL = 'quincenal'
const TYPE_MENSUAL = 'mensual'

const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS
    }
});

const recipients = [
    'gestioncalidad@codegascolombia.com',
    'coord.logistica@codegascolombia.com',
    'gerencia@codegascolombia.com',
    'fernandooj@ymail.com'
];

// const recipients = [
//     'fernandooj@ymail.com'
// ];


/**
 * Genera una tabla HTML estilizada para mostrar los datos
 */
const generateTable = (data, title, color) => {
    if (!data || data.length === 0) {
        return `
            <div class="section">
                <h3 style="color: ${color}; margin: 0 0 15px 0; font-size: 18px; font-weight: 600;">
                    📊 ${title}
                </h3>
                <div class="no-data">
                    <p style="margin: 0; color: #666; font-style: italic;">No hay datos disponibles</p>
                </div>
            </div>
        `;
    }

    const headers = Object.keys(data[0]);

    return `
        <div class="section">
            <h3 style="color: ${color}; margin: 0 0 15px 0; font-size: 18px; font-weight: 600;">
                📊 ${title} (${data.length} registros)
            </h3>
            <div class="table-container">
                <table style="width: 100%; border-collapse: collapse; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                    <thead>
                        <tr style="background: linear-gradient(135deg, ${color}, ${color}dd);">
                            ${headers.map(header => `
                                <th style="padding: 12px 15px; text-align: left; color: white; font-weight: 600; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">
                                    ${header.replace(/_/g, ' ')}
                                </th>
                            `).join('')}
                        </tr>
                    </thead>
                    <tbody>
                        ${data.map((row, index) => `
                            <tr style="border-bottom: 1px solid #eee; background: ${index % 2 === 0 ? '#fff' : '#f8f9fa'};">
                                ${headers.map(header => `
                                    <td style="padding: 12px 15px; color: #333; font-size: 13px; border-right: 1px solid #f0f0f0;">
                                        ${row[header] || '-'}
                                    </td>
                                `).join('')}
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
};

/**
 * Genera el HTML completo del email con diseño moderno
 */
const generateEmailHTML = (semanal, quincenal, mensual, grupos = []) => {
    const currentDate = new Date().toLocaleDateString('es-CO', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    // Distribuir pedidos de grupos según su intervalo_semanas
    const gruposSemanal = grupos.filter(g => g.grupo_intervalo_semanas === 1 || !g.grupo_intervalo_semanas);
    const gruposQuincenal = grupos.filter(g => g.grupo_intervalo_semanas === 2);
    const gruposTresSemanas = grupos.filter(g => g.grupo_intervalo_semanas === 3);
    const gruposMensual = grupos.filter(g => g.grupo_tipo_frecuencia === 'mensual');

    // Combinar pedidos individuales con pedidos de grupos
    const semanalCombinado = [...semanal, ...gruposSemanal];
    const quincenalCombinado = [...quincenal, ...gruposQuincenal];
    const tresSemanasCombinado = gruposTresSemanas;
    const mensualCombinado = [...mensual, ...gruposMensual];

    return `
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Reporte de Pedidos Frecuencias</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f7fa; line-height: 1.6;">
            <div style="max-width: 1000px; margin: 0 auto; background: white; box-shadow: 0 0 20px rgba(0,0,0,0.1);">
                
                <!-- Header -->
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center;">
                    <h1 style="margin: 0; font-size: 28px; font-weight: 700; text-shadow: 0 2px 4px rgba(0,0,0,0.3);">
                        📈 Reporte de Pedidos Frecuencias
                    </h1>
                    <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">
                        CodeGas Colombia - ${currentDate}
                    </p>
                </div>

                <!-- Summary Cards -->
                <div style="padding: 30px; background: #f8f9fa;">
                    <div style="display: flex; gap: 20px; flex-wrap: wrap; justify-content: center;">
                        <div style="flex: 1; min-width: 200px; background: white; padding: 20px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.07); border-left: 4px solid #28a745; text-align: center;">
                            <h4 style="margin: 0 0 10px 0; color: #28a745; font-size: 16px; font-weight: 600;">Semanal</h4>
                            <p style="margin: 0; font-size: 32px; font-weight: 700; color: #28a745;">${semanalCombinado.length}</p>
                            <p style="margin: 5px 0 0 0; color: #666; font-size: 14px;">pedidos</p>
                        </div>
                        <div style="flex: 1; min-width: 200px; background: white; padding: 20px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.07); border-left: 4px solid #ffc107; text-align: center;">
                            <h4 style="margin: 0 0 10px 0; color: #ffc107; font-size: 16px; font-weight: 600;">Cada 2 semanas</h4>
                            <p style="margin: 0; font-size: 32px; font-weight: 700; color: #ffc107;">${quincenalCombinado.length}</p>
                            <p style="margin: 5px 0 0 0; color: #666; font-size: 14px;">pedidos</p>
                        </div>
                        <div style="flex: 1; min-width: 200px; background: white; padding: 20px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.07); border-left: 4px solid #fd7e14; text-align: center;">
                            <h4 style="margin: 0 0 10px 0; color: #fd7e14; font-size: 16px; font-weight: 600;">Cada 3 semanas</h4>
                            <p style="margin: 0; font-size: 32px; font-weight: 700; color: #fd7e14;">${tresSemanasCombinado.length}</p>
                            <p style="margin: 5px 0 0 0; color: #666; font-size: 14px;">pedidos</p>
                        </div>
                        <div style="flex: 1; min-width: 200px; background: white; padding: 20px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.07); border-left: 4px solid #17a2b8; text-align: center;">
                            <h4 style="margin: 0 0 10px 0; color: #17a2b8; font-size: 16px; font-weight: 600;">Mensual</h4>
                            <p style="margin: 0; font-size: 32px; font-weight: 700; color: #17a2b8;">${mensualCombinado.length}</p>
                            <p style="margin: 5px 0 0 0; color: #666; font-size: 14px;">pedidos</p>
                        </div>
                    </div>
                </div>

                <!-- Data Tables -->
                <div style="padding: 30px;">
                    ${generateTable(semanalCombinado, 'Pedidos Semanales', '#28a745')}
                    ${generateTable(quincenalCombinado, 'Pedidos Cada 2 Semanas', '#ffc107')}
                    ${generateTable(tresSemanasCombinado, 'Pedidos Cada 3 Semanas', '#fd7e14')}
                    ${generateTable(mensualCombinado, 'Pedidos Mensuales', '#17a2b8')}
                </div>

                <!-- Footer -->
                <div style="background: #343a40; color: white; padding: 25px; text-align: center;">
                    <p style="margin: 0 0 10px 0; font-size: 14px; opacity: 0.8;">
                        Este es un reporte automático generado por el sistema
                    </p>
                    <p style="margin: 0; font-size: 12px; opacity: 0.6;">
                        © ${new Date().getFullYear()} CodeGas Colombia. Todos los derechos reservados.
                    </p>
                </div>

            </div>
        </body>
        </html>
    `;
};

/**
 * Función principal para enviar el reporte de frecuencias
 */
module.exports.main = async (event) => {
    let client;

    try {
        client = await poolConection.connect();

        // Crear pedidos automáticamente basándose en las frecuencias
        // Estas funciones crean los pedidos y retornan los datos
        const { rows: semanal } = await client.query(CREATE_FRECUENCIAL_SEMANAL, [TYPE_SEMANAL]);
        const { rows: quincenal } = await client.query(CREATE_FRECUENCIAL_QUINCENAL, [TYPE_QUINCENAL]);
        const { rows: mensual } = await client.query(CREATE_FRECUENCIAL_MENSUAL, [TYPE_MENSUAL]);

        // ============================================
        // PROCESAR GRUPOS DE FRECUENCIAS
        // ============================================
        // Obtener fecha actual y de mañana en zona horaria de Bogotá
        await client.query("SET TIME ZONE 'America/Bogota'");
        const { rows: fechaInfo } = await client.query(`
            SELECT 
                CURRENT_DATE as fecha_hoy,
                CURRENT_DATE + INTERVAL '1 day' as fecha_manana,
                CURRENT_DATE + INTERVAL '2 days' as fecha_lunes,
                EXTRACT(ISODOW FROM CURRENT_DATE) as dia_semana_hoy,
                EXTRACT(ISODOW FROM CURRENT_DATE + INTERVAL '1 day') as dia_semana_manana,
                EXTRACT(ISODOW FROM CURRENT_DATE + INTERVAL '2 days') as dia_semana_lunes,
                EXTRACT(DAY FROM CURRENT_DATE) as dia_mes_hoy,
                EXTRACT(DAY FROM CURRENT_DATE + INTERVAL '1 day') as dia_mes_manana,
                EXTRACT(DAY FROM CURRENT_DATE + INTERVAL '2 days') as dia_mes_lunes
        `);

        const fechaHoy = fechaInfo[0].fecha_hoy;
        const fechaManana = fechaInfo[0].fecha_manana;
        const fechaLunes = fechaInfo[0].fecha_lunes;
        const diaSemanaHoy = parseInt(fechaInfo[0].dia_semana_hoy);
        const diaSemanaManana = parseInt(fechaInfo[0].dia_semana_manana);
        const diaSemanaLunes = parseInt(fechaInfo[0].dia_semana_lunes);
        const diaMesHoy = parseInt(fechaInfo[0].dia_mes_hoy);
        const diaMesManana = parseInt(fechaInfo[0].dia_mes_manana);
        const diaMesLunes = parseInt(fechaInfo[0].dia_mes_lunes);

        // IMPORTANTE: Los pedidos se crean para 2 días después (fecha de entrega)
        // El dia_semana del grupo es el día de ENTREGA, no de ejecución
        // Ejecución = 2 días antes de la entrega
        const fechaSolicitud = fechaInfo[0].fecha_lunes; // Siempre 2 días después
        const diaSemanaObjetivo = diaSemanaLunes; // Día de la semana en 2 días (día de entrega)
        const diaMesObjetivo = diaMesLunes; // Día del mes en 2 días (día de entrega)

        // 1. Obtener todos los grupos de frecuencias
        const GET_GRUPOS = `
            SELECT 
                _id,
                nombre,
                tipo_frecuencia,
                dia_semana,
                intervalo_semanas,
                dia_mes,
                dia_semana_mensual,
                creado
            FROM grupos_frecuencias
            WHERE eliminado = FALSE
        `;

        const { rows: todosGrupos } = await client.query(GET_GRUPOS);

        // 2. Obtener pedidos con grupos y verificar cuáles deben crear pedidos HOY
        // IMPORTANTE: Usar la misma lógica que crear-pedidos-frecuencia.js
        // El dia_semana del grupo es el día de ENTREGA (2 días después)
        const GET_PEDIDOS_CON_GRUPO = `
            SELECT 
                p._id,
                p.forma,
                p.cantidadkl,
                p.cantidadprecio,
                p.usuarioid,
                p.usuariocrea,
                p.puntoid,
                p.creado,
                p.observacion,
                p.grupo_id,
                u.valorunitario,
                g.tipo_frecuencia,
                g.dia_semana,
                g.intervalo_semanas,
                g.dia_mes,
                g.dia_semana_mensual
            FROM pedidos p
            JOIN users u ON u._id = p.usuarioid
            JOIN grupos_frecuencias g ON g._id = p.grupo_id
            WHERE p.grupo_id IS NOT NULL
                AND p.eliminado = FALSE
                AND g.eliminado = FALSE
        `;

        const { rows: pedidosConGrupo } = await client.query(GET_PEDIDOS_CON_GRUPO);

        const gruposQueDebenCrear = [];
        const gruposDetalle = [];
        const pedidosQueDebenCrear = [];

        for (const pedido of pedidosConGrupo) {
            const tipoFrecuencia = pedido.tipo_frecuencia;
            let debeCrear = false;
            let razon = '';

            if (tipoFrecuencia === 'semanal') {
                // IMPORTANTE: El dia_semana del grupo es el día de ENTREGA (2 días después)
                if (pedido.dia_semana === diaSemanaObjetivo) {
                    razon = `Día de entrega coincide (${pedido.dia_semana})`;

                    if (pedido.intervalo_semanas === 1) {
                        // Cada semana: si el día de entrega coincide, se crea hoy (2 días antes)
                        debeCrear = true;
                        razon += `, Intervalo 1 semana (semanal)`;
                    } else {
                        // IMPORTANTE: Usar la fecha de creación del PEDIDO PADRE, no del grupo
                        let fechaCreacionPedido;
                        try {
                            const fechaStr = String(pedido.creado).split('T')[0];
                            fechaCreacionPedido = new Date(fechaStr + 'T00:00:00.000Z');
                            fechaCreacionPedido.setUTCHours(0, 0, 0, 0);
                        } catch (e) {
                            console.warn(`Error al parsear fecha de creación para pedido ${pedido._id}: ${pedido.creado}`, e);
                            continue;
                        }

                        // Calcular desde la primera fecha de entrega hasta la fecha objetivo
                        const fechaEntregaObjetivo = new Date(fechaSolicitud);
                        fechaEntregaObjetivo.setUTCHours(0, 0, 0, 0);
                        const diaObjetivoJS = pedido.dia_semana === 7 ? 0 : pedido.dia_semana;

                        // Encontrar la primera fecha de entrega desde la creación del pedido
                        let primeraFechaEntrega = new Date(fechaCreacionPedido);
                        while (primeraFechaEntrega.getUTCDay() !== diaObjetivoJS) {
                            primeraFechaEntrega.setUTCDate(primeraFechaEntrega.getUTCDate() + 1);
                        }

                        // Calcular semanas desde la primera fecha de entrega
                        const diffTimeEntrega = fechaEntregaObjetivo.getTime() - primeraFechaEntrega.getTime();
                        const diffDaysEntrega = Math.floor(diffTimeEntrega / (1000 * 60 * 60 * 24));
                        const semanasDesdePrimeraEntrega = Math.floor(diffDaysEntrega / 7);

                        // Verificar que sea múltiplo del intervalo
                        if (semanasDesdePrimeraEntrega >= 0 && semanasDesdePrimeraEntrega % pedido.intervalo_semanas === 0) {
                            debeCrear = true;
                            razon += `, Intervalo ${pedido.intervalo_semanas} semanas, ${semanasDesdePrimeraEntrega} semanas desde primera entrega`;
                        } else {
                            razon += `, NO es múltiplo (${semanasDesdePrimeraEntrega} semanas, intervalo ${pedido.intervalo_semanas})`;
                        }
                    }
                }
            } else if (tipoFrecuencia === 'mensual') {
                // Para mensual: verificar si el día del mes coincide con el día objetivo (2 días después)
                if (pedido.dia_mes === diaMesObjetivo) {
                    debeCrear = true;
                    razon = `Día del mes coincide (${pedido.dia_mes})`;
                }
            }

            if (debeCrear) {
                // Agregar el grupo a la lista si no está ya
                if (!gruposQueDebenCrear.includes(pedido.grupo_id)) {
                    gruposQueDebenCrear.push(pedido.grupo_id);
                    gruposDetalle.push({
                        grupo_id: pedido.grupo_id,
                        nombre: pedido.grupo_id, // Se actualizará después con el nombre real
                        tipo_frecuencia: tipoFrecuencia,
                        razon: razon
                    });
                }
                pedidosQueDebenCrear.push(pedido);
            }
        }

        // 3. Obtener información completa de los pedidos que deben crearse
        let pedidosGrupos = [];

        if (pedidosQueDebenCrear.length > 0) {
            // Obtener información completa de los pedidos y sus grupos
            const pedidoIds = pedidosQueDebenCrear.map(p => p._id);
            const GET_PEDIDOS_POR_GRUPOS = `
                SELECT 
                    p._id as pedido_id,
                    p.forma,
                    p.cantidadkl,
                    p.cantidadprecio,
                    p.frecuencia,
                    p.dia1,
                    p.dia2,
                    p.usuarioid,
                    p.usuariocrea,
                    p.puntoid,
                    p.grupo_id,
                    p.creado,
                    p.observacion,
                    u.nombre,
                    u.razon_social,
                    u.codt,
                    u.valorunitario,
                    pt.direccion as punto_direccion,
                    pt.capacidad as punto_capacidad,
                    g.nombre as grupo_nombre,
                    g.tipo_frecuencia as grupo_tipo_frecuencia,
                    g.dia_semana as grupo_dia_semana,
                    g.intervalo_semanas as grupo_intervalo_semanas,
                    g.dia_mes as grupo_dia_mes
                FROM pedidos p
                JOIN users u ON u._id = p.usuarioid
                LEFT JOIN puntos pt ON pt._id = p.puntoid
                JOIN grupos_frecuencias g ON g._id = p.grupo_id
                WHERE p._id = ANY($1::int[])
                    AND p.eliminado = FALSE
                ORDER BY g.nombre ASC, u.razon_social ASC, u.nombre ASC
            `;

            const { rows: pedidosEncontrados } = await client.query(GET_PEDIDOS_POR_GRUPOS, [pedidoIds]);
            pedidosGrupos = pedidosEncontrados;

            // Actualizar nombres de grupos en gruposDetalle
            for (const detalle of gruposDetalle) {
                const grupoInfo = pedidosEncontrados.find(p => p.grupo_id === detalle.grupo_id);
                if (grupoInfo) {
                    detalle.nombre = grupoInfo.grupo_nombre;
                }
            }
        }

        // 4. Crear los pedidos de grupos
        let pedidosGruposCreados = 0;
        const pedidosGruposCreadosIds = [];

        if (pedidosGrupos.length > 0) {
            const INSERT_PEDIDO_GRUPO = `
                INSERT INTO pedidos (
                    forma,
                    cantidadkl,
                    cantidadprecio,
                    valorunitario,
                    observacion,
                    pedidopadre,
                    estado,
                    fechasolicitud,
                    usuarioid,
                    puntoid,
                    usuariocrea,
                    grupo_id
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
                RETURNING _id
            `;

            for (const pedido of pedidosGrupos) {
                try {
                    const usuarioIdValue = pedido.usuarioid;
                    const puntoIdValue = pedido.puntoid;
                    const usuarioCreaValue = pedido.usuariocrea || pedido.usuarioid;

                    const { rows: nuevoPedido } = await client.query(INSERT_PEDIDO_GRUPO, [
                        pedido.forma,
                        pedido.cantidadkl,
                        pedido.cantidadprecio,
                        pedido.valorunitario,
                        pedido.observacion || null,
                        pedido.pedido_id,
                        'espera',
                        fechaSolicitud,
                        usuarioIdValue,
                        puntoIdValue,
                        usuarioCreaValue,
                        null
                    ]);

                    pedidosGruposCreados++;
                    pedidosGruposCreadosIds.push(nuevoPedido[0]._id);
                } catch (error) {
                    // Error silencioso, continuar con el siguiente pedido
                }
            }
        }

        const totalPedidosCreados = semanal.length + quincenal.length + mensual.length + pedidosGruposCreados;

        // Configurar el email
        const mailOptions = {
            from: {
                name: 'CodeGas Colombia - Sistema Automático',
                address: EMAIL_USER
            },
            to: recipients,
            subject: `📊 Reporte de Pedidos Frecuencias - ${new Date().toLocaleDateString('es-CO')}`,
            html: generateEmailHTML(semanal, quincenal, mensual, pedidosGrupos),
            attachments: []
        };

        // Enviar el email
        const info = await transporter.sendMail(mailOptions);

        return {
            status: true,
            message: 'Pedidos creados y email enviado exitosamente',
            messageId: info.messageId,
            totalPedidosCreados: totalPedidosCreados,
            totalSemanal: semanal.length,
            totalQuincenal: quincenal.length,
            totalMensual: mensual.length,
            totalGruposListados: pedidosGrupos.length,
            totalGruposCreados: pedidosGruposCreados,
            gruposQueDebenCrear: gruposQueDebenCrear,
            gruposDetalle: gruposDetalle,  // Detalle de grupos que deben crear
            fechaActual: fechaHoy,
            fechaManana: fechaManana,
            fechaSolicitud: fechaSolicitud,  // Fecha para la cual se crearán los pedidos (2 días después)
            diaSemanaHoy: diaSemanaHoy,
            diaSemanaManana: diaSemanaManana,
            diaSemanaObjetivo: diaSemanaObjetivo,  // Día de la semana objetivo (2 días después = día de entrega)
            diaMesHoy: diaMesHoy,
            diaMesManana: diaMesManana,
            diaMesObjetivo: diaMesObjetivo,  // Día del mes objetivo (2 días después)
            pedidosGruposCreadosIds: pedidosGruposCreadosIds,  // IDs de los pedidos creados
            semanal,
            quincenal,
            mensual,
            grupos: pedidosGrupos  // Lista de pedidos que pertenecen a grupos (ya creados)
        };

    } catch (error) {
        throw new DatabaseError(error);
    } finally {
        if (client) {
            client.release();
        }
    }
};