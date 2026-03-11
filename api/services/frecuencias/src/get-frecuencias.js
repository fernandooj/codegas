const nodemailer = require('nodemailer');
const { poolConection } = require('../../../lib/connection-pg.js');
const DatabaseError = require('../../../lib/errors/database-error');

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
 * Enriquecer filas con nombre de cliente y dirección a partir de la tabla pedidos/users/puntos.
 * Intenta detectar el id de pedido en las filas (pedido_id, _id, id_pedido, pedidoid).
 */
const enrichWithClienteDireccion = async (client, rows) => {
    if (!rows || rows.length === 0) return rows;

    const getPedidoIdFromRow = (row) =>
        row.pedido_id ||
        row._id ||
        row.id_pedido ||
        row.pedidoid ||
        null;

    const pedidoIds = Array.from(
        new Set(
            rows
                .map(getPedidoIdFromRow)
                .filter(id => id !== null && id !== undefined)
        )
    );

    if (pedidoIds.length === 0) {
        return rows;
    }

    const GET_INFO_PEDIDOS = `
        SELECT 
            p._id AS pedido_id,
            u.nombre,
            u.razon_social,
            u.codt,
            COALESCE(pt.direccion, '') AS punto_direccion
        FROM pedidos p
        LEFT JOIN users u ON u._id = p.usuarioid
        LEFT JOIN puntos pt ON pt._id = p.puntoid
        WHERE p._id = ANY($1::int[])
    `;

    const { rows: info } = await client.query(GET_INFO_PEDIDOS, [pedidoIds]);
    const infoMap = new Map(info.map(r => [r.pedido_id, r]));

    return rows.map(row => {
        const pedidoId = getPedidoIdFromRow(row);
        const extra = pedidoId ? infoMap.get(pedidoId) : null;
        if (!extra) return row;

        return {
            ...row,
            nombre: row.nombre || extra.nombre,
            razon_social: row.razon_social || extra.razon_social,
            codt: row.codt || extra.codt,
            punto_direccion: row.punto_direccion || extra.punto_direccion
        };
    });
};

const toDateOnly = (value) => {
    const d = value instanceof Date ? value : new Date(value);
    if (isNaN(d.getTime())) return null;
    return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
};

const buildFrecuenciaListsAndCreateIndividuales = async (client, fechaSolicitud, diaSemanaObjetivo) => {
    const fechaSolicitudStr = fechaSolicitud instanceof Date
        ? fechaSolicitud.toISOString().split('T')[0]
        : String(fechaSolicitud).split('T')[0];

    const GET_PADRES_INDIVIDUALES = `
        SELECT
            p._id,
            p.forma,
            p.cantidadkl,
            p.cantidadprecio,
            p.frecuencia,
            p.dia1,
            p.dia2,
            p.usuarioid,
            p.usuariocrea,
            p.puntoid,
            p.creado,
            p.observacion,
            u.nombre,
            u.razon_social,
            u.codt,
            u.valorunitario,
            pt.direccion as punto_direccion
        FROM pedidos p
        JOIN users u ON u._id = p.usuarioid
        LEFT JOIN puntos pt ON pt._id = p.puntoid
        WHERE p.eliminado = FALSE
          AND p.grupo_id IS NULL
          AND p.pedidopadre IS NULL
          AND p.frecuencia IS NOT NULL
    `;

    const GET_HIJO_EXISTENTE = `
        SELECT
            p._id as pedido_id,
            p.forma,
            p.cantidadkl,
            p.cantidadprecio,
            COALESCE(p.frecuencia, pp.frecuencia::text) as frecuencia,
            COALESCE(p.dia1, pp.dia1) as dia1,
            COALESCE(p.dia2, pp.dia2) as dia2,
            p.usuarioid,
            p.usuariocrea,
            p.puntoid,
            p.observacion,
            u.nombre,
            u.razon_social,
            u.codt,
            u.valorunitario,
            pt.direccion as punto_direccion
        FROM pedidos p
        LEFT JOIN pedidos pp ON pp._id = p.pedidopadre
        JOIN users u ON u._id = p.usuarioid
        LEFT JOIN puntos pt ON pt._id = p.puntoid
        WHERE p.pedidopadre = $1
          AND p.eliminado = FALSE
          AND p.fechasolicitud::date = $2::date
        ORDER BY p._id DESC
        LIMIT 1
    `;

    const INSERT_PEDIDO_INDIVIDUAL = `
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
            frecuencia,
            dia1,
            dia2
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
        RETURNING _id
    `;

    const { rows: padres } = await client.query(GET_PADRES_INDIVIDUALES);

    const semanal = [];
    const cada2semanas = [];
    const cada3semanas = [];
    const cada4semanas = [];
    const cada5semanas = [];

    const normalizeFrecuencia = (frecuencia) => {
        const raw = String(frecuencia || '').trim().toLowerCase();
        if (['1', 'semanal'].includes(raw)) return 1;
        if (['2', 'quincenal'].includes(raw)) return 2;
        if (['3', 'tressemanas'].includes(raw)) return 3;
        if (['4', 'cuatrosemanas'].includes(raw)) return 4;
        if (['5', 'cincosemanas'].includes(raw)) return 5;
        return null;
    };

    const pushByFrecuencia = (frecuenciaWeeks, row) => {
        if (frecuenciaWeeks === 1) semanal.push(row);
        else if (frecuenciaWeeks === 2) cada2semanas.push(row);
        else if (frecuenciaWeeks === 3) cada3semanas.push(row);
        else if (frecuenciaWeeks === 4) cada4semanas.push(row);
        else if (frecuenciaWeeks === 5) cada5semanas.push(row);
    };

    for (const pedido of padres) {
        const frecuenciaWeeks = normalizeFrecuencia(pedido.frecuencia);
        if (!frecuenciaWeeks) continue;
        const dia1 = Number(pedido.dia1);
        let aplica = false;
        if (dia1 === diaSemanaObjetivo) {
            if (frecuenciaWeeks === 1) {
                aplica = true;
            } else {
                const creada = toDateOnly(pedido.creado);
                const objetivo = toDateOnly(fechaSolicitudStr);
                if (creada && objetivo) {
                    const diffDays = Math.floor((objetivo.getTime() - creada.getTime()) / (1000 * 60 * 60 * 24));
                    const diffWeeks = Math.floor(diffDays / 7);
                    aplica = diffWeeks >= frecuenciaWeeks && diffWeeks % frecuenciaWeeks === 0;
                }
            }
        }

        if (!aplica) continue;

        const { rows: hijoExistente } = await client.query(GET_HIJO_EXISTENTE, [pedido._id, fechaSolicitudStr]);
        if (hijoExistente.length > 0) {
            pushByFrecuencia(frecuenciaWeeks, hijoExistente[0]);
            continue;
        }

        const { rows: inserted } = await client.query(INSERT_PEDIDO_INDIVIDUAL, [
            pedido.forma,
            pedido.cantidadkl || 0,
            pedido.cantidadprecio || 0,
            pedido.valorunitario,
            pedido.observacion || null,
            pedido._id,
            'espera',
            fechaSolicitudStr,
            pedido.usuarioid,
            pedido.puntoid,
            pedido.usuariocrea || pedido.usuarioid,
            null,
            null,
            null
        ]);

        pushByFrecuencia(frecuenciaWeeks, {
            pedido_id: inserted[0]._id,
            forma: pedido.forma,
            cantidadkl: pedido.cantidadkl,
            cantidadprecio: pedido.cantidadprecio,
            frecuencia: pedido.frecuencia,
            dia1: pedido.dia1,
            dia2: pedido.dia2,
            usuarioid: pedido.usuarioid,
            usuariocrea: pedido.usuariocrea || pedido.usuarioid,
            puntoid: pedido.puntoid,
            observacion: pedido.observacion,
            nombre: pedido.nombre,
            razon_social: pedido.razon_social,
            codt: pedido.codt,
            valorunitario: pedido.valorunitario,
            punto_direccion: pedido.punto_direccion
        });
    }

    return { semanal, cada2semanas, cada3semanas, cada4semanas, cada5semanas };
};


/**
 * Genera una tabla HTML estilizada para mostrar los datos.
 * Agrega siempre columnas visibles de Cliente y Dirección al inicio,
 * usando los campos disponibles en los datos (razon_social, nombre, punto_direccion, direccion, etc.).
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

    // Enriquecer filas con columnas legibles de Cliente y Dirección
    const enhancedData = data.map(row => {
        const cliente =
            row.razon_social ||
            row.nombre ||
            row.cliente ||
            row.cliente_nombre ||
            row.nombre_cliente ||
            '-';

        const direccion =
            row.punto_direccion ||
            row.direccion ||
            row.direccion_punto ||
            row.direccion_cliente ||
            '-';

        const tipo = row.grupo_id ? 'Grupal' : 'Individual';

        return {
            Tipo: tipo,
            Cliente: cliente,
            Direccion: direccion,
            ...row
        };
    });

    // No repetir las columnas técnicas/originales que no queremos mostrar
    const headers = Object.keys(enhancedData[0]).filter(
        (h) => ![
            'nombre',
            'razon_social',
            'punto_direccion',
            'usuarioid',
            'usuariocrea',
            'puntoid',
            'frecuencia',
            'forma',
            'cantidadkl',
            'cantidadprecio',
            'dia2'
        ].includes(h)
    );

    const dayHeaderKeys = ['dia', 'dia_semana', 'dia1'];
    const dayNames = {
        1: 'Lunes',
        2: 'Martes',
        3: 'Miércoles',
        4: 'Jueves',
        5: 'Viernes',
        6: 'Sábado',
        7: 'Domingo'
    };

    return `
        <div class="section">
            <h3 style="color: ${color}; margin: 0 0 15px 0; font-size: 18px; font-weight: 600;">
                📊 ${title} (${enhancedData.length} registros)
            </h3>
            <div class="table-container">
                <table style="width: 100%; border-collapse: collapse; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                    <thead>
                        <tr style="background: #f1f3f5;">
                            ${headers.map(header => `
                                <th style="padding: 12px 15px; text-align: left; color: #495057; font-weight: 600; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">
                                    ${header.replace(/_/g, ' ')}
                                </th>
                            `).join('')}
                        </tr>
                    </thead>
                    <tbody>
                        ${enhancedData.map((row, index) => `
                            <tr style="border-bottom: 1px solid #eee; background: ${index % 2 === 0 ? '#fff' : '#f8f9fa'};">
                                ${headers.map(header => `
                                    <td style="padding: 12px 15px; color: #495057; font-size: 13px; border-right: 1px solid #f0f0f0;">
                                        ${(() => {
            const value = row[header];
            if (dayHeaderKeys.includes(header)) {
                const n = Number(value);
                if (!Number.isFinite(n)) {
                    return value || '-';
                }
                return dayNames[n] || value || '-';
            }
            return value !== undefined && value !== null && value !== '' ? value : '-';
        })()
        }
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
 * Genera el HTML completo del email con diseño moderno,
 * separando pedidos individuales y de grupos por tipo de frecuencia.
 */
const generateEmailHTML = (semanal, cada2semanas, cada3semanas, cada4semanas, cada5semanas, grupos = []) => {
    const currentDate = new Date().toLocaleDateString('es-CO', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    // Distribuir pedidos de grupos según su configuración
    const gruposSemanal = grupos.filter(g => g.grupo_intervalo_semanas === 1 || (!g.grupo_intervalo_semanas && g.grupo_tipo_frecuencia !== 'mensual'));
    const gruposQuincenal = grupos.filter(g => g.grupo_intervalo_semanas === 2);
    const gruposTresSemanas = grupos.filter(g => g.grupo_intervalo_semanas === 3);
    const gruposMensual = grupos.filter(g => g.grupo_tipo_frecuencia === 'mensual');

    const totalIndividualSemanal = semanal.length;
    const totalIndividualCada2 = cada2semanas.length;
    const totalIndividualCada3 = cada3semanas.length;
    const totalIndividualCada4 = cada4semanas.length;
    const totalIndividualCada5 = cada5semanas.length;

    const totalGruposSemanal = gruposSemanal.length;
    const totalGruposQuincenal = gruposQuincenal.length;
    const totalGruposTresSemanas = gruposTresSemanas.length;
    const totalGruposMensual = gruposMensual.length;

    const totalIndividual =
        totalIndividualSemanal +
        totalIndividualCada2 +
        totalIndividualCada3 +
        totalIndividualCada4 +
        totalIndividualCada5;
    const totalGrupos = totalGruposSemanal + totalGruposQuincenal + totalGruposTresSemanas + totalGruposMensual;

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
                    <!-- Totales generales -->
                    <div style="display: flex; gap: 20px; flex-wrap: wrap; justify-content: center; margin-bottom: 20px;">
                        <div style="flex: 1; min-width: 220px; background: white; padding: 20px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.07); border-left: 4px solid #007bff; text-align: center;">
                            <h4 style="margin: 0 0 10px 0; color: #007bff; font-size: 16px; font-weight: 600;">Individuales</h4>
                            <p style="margin: 0; font-size: 32px; font-weight: 700; color: #007bff;">${totalIndividual}</p>
                            <p style="margin: 5px 0 0 0; color: #666; font-size: 14px;">pedidos</p>
                        </div>
                        <div style="flex: 1; min-width: 220px; background: white; padding: 20px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.07); border-left: 4px solid #6f42c1; text-align: center;">
                            <h4 style="margin: 0 0 10px 0; color: #6f42c1; font-size: 16px; font-weight: 600;">Grupos</h4>
                            <p style="margin: 0; font-size: 32px; font-weight: 700; color: #6f42c1;">${totalGrupos}</p>
                            <p style="margin: 5px 0 0 0; color: #666; font-size: 14px;">pedidos</p>
                        </div>
                    </div>

                    <!-- Detalle por tipo de frecuencia -->
                    <div style="display: flex; gap: 20px; flex-wrap: wrap; justify-content: center;">
                        <!-- Individuales -->
                        <div style="flex: 1; min-width: 260px;">
                            <h3 style="margin: 0 0 12px 0; font-size: 16px; font-weight: 700; color: #007bff;">Individuales</h3>
                            <div style="display: flex; flex-direction: column; gap: 10px;">
                                <div style="background: white; padding: 12px 16px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); border-left: 4px solid #28a745;">
                                    <div style="display: flex; justify-content: space-between; align-items: center;">
                                        <span style="font-size: 14px; font-weight: 600; color: #28a745;">Semanal</span>
                                        <span style="font-size: 20px; font-weight: 700; color: #28a745;">${totalIndividualSemanal}</span>
                                    </div>
                                </div>
                                <div style="background: white; padding: 12px 16px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); border-left: 4px solid #ffc107;">
                                    <div style="display: flex; justify-content: space-between; align-items: center;">
                                        <span style="font-size: 14px; font-weight: 600; color: #ffc107;">Cada 2 semanas</span>
                                        <span style="font-size: 20px; font-weight: 700; color: #ffc107;">${totalIndividualCada2}</span>
                                    </div>
                                </div>
                                <div style="background: white; padding: 12px 16px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); border-left: 4px solid #17a2b8;">
                                    <div style="display: flex; justify-content: space-between; align-items: center;">
                                        <span style="font-size: 14px; font-weight: 600; color: #17a2b8;">Cada 3 semanas</span>
                                        <span style="font-size: 20px; font-weight: 700; color: #17a2b8;">${totalIndividualCada3}</span>
                                    </div>
                                </div>
                                <div style="background: white; padding: 12px 16px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); border-left: 4px solid #e83e8c;">
                                    <div style="display: flex; justify-content: space-between; align-items: center;">
                                        <span style="font-size: 14px; font-weight: 600; color: #e83e8c;">Cada 4 semanas</span>
                                        <span style="font-size: 20px; font-weight: 700; color: #e83e8c;">${totalIndividualCada4}</span>
                                    </div>
                                </div>
                                <div style="background: white; padding: 12px 16px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); border-left: 4px solid #6c757d;">
                                    <div style="display: flex; justify-content: space-between; align-items: center;">
                                        <span style="font-size: 14px; font-weight: 600; color: #6c757d;">Cada 5 semanas</span>
                                        <span style="font-size: 20px; font-weight: 700; color: #6c757d;">${totalIndividualCada5}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Grupos -->
                        <div style="flex: 1; min-width: 260px;">
                            <h3 style="margin: 0 0 12px 0; font-size: 16px; font-weight: 700; color: #6f42c1;">Grupos</h3>
                            <div style="display: flex; flex-direction: column; gap: 10px;">
                                <div style="background: white; padding: 12px 16px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); border-left: 4px solid #28a745;">
                                    <div style="display: flex; justify-content: space-between; align-items: center;">
                                        <span style="font-size: 14px; font-weight: 600; color: #28a745;">Semanal</span>
                                        <span style="font-size: 20px; font-weight: 700; color: #28a745;">${totalGruposSemanal}</span>
                                    </div>
                                </div>
                                <div style="background: white; padding: 12px 16px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); border-left: 4px solid #ffc107;">
                                    <div style="display: flex; justify-content: space-between; align-items: center;">
                                        <span style="font-size: 14px; font-weight: 600; color: #ffc107;">Cada 2 semanas</span>
                                        <span style="font-size: 20px; font-weight: 700; color: #ffc107;">${totalGruposQuincenal}</span>
                                    </div>
                                </div>
                                <div style="background: white; padding: 12px 16px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); border-left: 4px solid #fd7e14;">
                                    <div style="display: flex; justify-content: space-between; align-items: center;">
                                        <span style="font-size: 14px; font-weight: 600; color: #fd7e14;">Cada 3 semanas</span>
                                        <span style="font-size: 20px; font-weight: 700; color: #fd7e14;">${totalGruposTresSemanas}</span>
                                    </div>
                                </div>
                                <div style="background: white; padding: 12px 16px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); border-left: 4px solid #17a2b8;">
                                    <div style="display: flex; justify-content: space-between; align-items: center;">
                                        <span style="font-size: 14px; font-weight: 600; color: #17a2b8;">Mensual</span>
                                        <span style="font-size: 20px; font-weight: 700; color: #17a2b8;">${totalGruposMensual}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Data Tables -->
                <div style="padding: 30px;">
                    <!-- Individuales -->
                    <h2 style="margin: 0 0 20px 0; font-size: 20px; font-weight: 700; color: #007bff;">Pedidos Individuales</h2>
                    ${generateTable(semanal, 'Individuales - Semanales', '#28a745')}
                    ${generateTable(cada2semanas, 'Individuales - Cada 2 Semanas', '#ffc107')}
                    ${generateTable(cada3semanas, 'Individuales - Cada 3 Semanas', '#17a2b8')}
                    ${generateTable(cada4semanas, 'Individuales - Cada 4 Semanas', '#e83e8c')}
                    ${generateTable(cada5semanas, 'Individuales - Cada 5 Semanas', '#6c757d')}

                    <!-- Grupos -->
                    <h2 style="margin: 30px 0 20px 0; font-size: 20px; font-weight: 700; color: #6f42c1;">Pedidos por Grupos</h2>
                    ${generateTable(gruposSemanal, 'Grupos - Semanales', '#28a745')}
                    ${generateTable(gruposQuincenal, 'Grupos - Cada 2 Semanas', '#ffc107')}
                    ${generateTable(gruposTresSemanas, 'Grupos - Cada 3 Semanas', '#fd7e14')}
                    ${generateTable(gruposMensual, 'Grupos - Mensuales', '#17a2b8')}
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

        // Crear/listar pedidos individuales (frecuencia + dia1) en este mismo endpoint
        const individuales = await buildFrecuenciaListsAndCreateIndividuales(
            client,
            fechaSolicitud,
            diaSemanaObjetivo,
        );

        // Enriquecer con nombre de cliente y dirección para que aparezcan en las tablas del correo
        const semanal = await enrichWithClienteDireccion(client, individuales.semanal);
        const cada2semanas = await enrichWithClienteDireccion(client, individuales.cada2semanas);
        const cada3semanas = await enrichWithClienteDireccion(client, individuales.cada3semanas);
        const cada4semanas = await enrichWithClienteDireccion(client, individuales.cada4semanas);
        const cada5semanas = await enrichWithClienteDireccion(client, individuales.cada5semanas);

        // Obtener pedidos plantilla con grupos y verificar cuáles deben crear pedidos HOY
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
                AND p.pedidopadre IS NULL
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
                        const diaObjetivo = Number(pedido.dia_semana);
                        if (!Number.isFinite(diaObjetivo) || diaObjetivo < 1 || diaObjetivo > 7) {
                            razon += ', dia_semana inválido';
                            continue;
                        }
                        const diaObjetivoJS = diaObjetivo === 7 ? 0 : diaObjetivo;

                        // Encontrar la primera fecha de entrega desde la creación del pedido
                        let primeraFechaEntrega = new Date(fechaCreacionPedido);
                        let maxIter = 8;
                        while (primeraFechaEntrega.getUTCDay() !== diaObjetivoJS && maxIter > 0) {
                            primeraFechaEntrega.setUTCDate(primeraFechaEntrega.getUTCDate() + 1);
                            maxIter--;
                        }
                        if (maxIter <= 0 && primeraFechaEntrega.getUTCDay() !== diaObjetivoJS) {
                            razon += ', no se pudo alinear primera fecha de entrega';
                            continue;
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

        const totalPedidosCreados =
            semanal.length +
            cada2semanas.length +
            cada3semanas.length +
            cada4semanas.length +
            cada5semanas.length +
            pedidosGruposCreados;

        // Configurar el email
        const mailOptions = {
            from: {
                name: 'CodeGas Colombia - Sistema Automático',
                address: EMAIL_USER
            },
            to: recipients,
            subject: `📊 Reporte de Pedidos Frecuencias - ${new Date().toLocaleDateString('es-CO')}`,
            html: generateEmailHTML(
                semanal,
                cada2semanas,
                cada3semanas,
                cada4semanas,
                cada5semanas,
                pedidosGrupos
            ),
            attachments: []
        };

        // Enviar el email (no bloquear creación de pedidos si falla)
        let info = { messageId: null };
        try {
            info = await transporter.sendMail(mailOptions);
        } catch (emailError) {
            console.error('❌ Error enviando correo de reporte de frecuencias (no crítico):', emailError);
        }

        return {
            status: true,
            message: info.messageId
                ? 'Pedidos creados y email enviado exitosamente'
                : 'Pedidos creados, pero el email de reporte falló',
            messageId: info.messageId,
            totalPedidosCreados: totalPedidosCreados,
            totalSemanal: semanal.length,
            totalQuincenal: cada2semanas.length,
            totalTresSemanas: cada3semanas.length,
            totalCuatroSemanas: cada4semanas.length,
            totalCincoSemanas: cada5semanas.length,
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
            quincenal: cada2semanas,
            tressemanas: cada3semanas,
            cuatrosemanas: cada4semanas,
            cincosemanas: cada5semanas,
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