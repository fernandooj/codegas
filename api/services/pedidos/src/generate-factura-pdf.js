const { poolConection } = require('../../../lib/connection-pg.js');
const DatabaseError = require('../../../lib/errors/database-error');
const { uploadPDF } = require('../../../lib/pdf');
const { resolveImageToDataUri } = require('../../../lib/image');
const { renderRemisionContratoPdf } = require('./pdf-remision-contrato');

function isPedidoCerrado(p) {
    return p.entregado === true
        || p.entregado === 't'
        || String(p.entregado).toLowerCase() === 'true';
}

/**
 * Genera PDF remisión + resumen contrato (2 páginas) con la información del pedido.
 */
const GET_PEDIDO_COMPLETO = `
    SELECT 
        p._id,
        p.creado,
        p.fechaSolicitud,
        p.fechaEntrega,
        p.fechaEntregado,
        p.forma,
        p.cantidadKl,
        p.kilos,
        p.cantidadPrecio,
        p.estado,
        p.entregado,
        p.factura,
        p.valor_total,
        p.remision,
        p.forma_pago,
        p.valorUnitario,
        p.observacion AS observacion_pedido,
        u.email,
        u.codt,
        u.razon_social,
        u.nombre,
        u.cedula,
        u.valorUnitario AS valor_unitario_usuario,
        pt.direccion,
        pt.capacidad,
        pt.observacion AS observacion_punto,
        pt.nombre AS punto_nombre,
        pt.email AS punto_email,
        pt.celular AS punto_celular,
        c.placa,
        u3.nombre AS conductor,
        z.nombre AS zona,
        p.firma_conductor,
        p.firma_usuario
    FROM pedidos p
    LEFT JOIN users u ON p.usuarioId = u._id
    LEFT JOIN puntos pt ON p.puntoId = pt._id
    LEFT JOIN carros c ON p.carroId = c._id
    LEFT JOIN users u3 ON p.conductorId = u3._id
    LEFT JOIN zonas z ON pt.idZona = z._id
    WHERE p._id = $1
`;

const generateFacturaPDF = async (pedidoId) => {
    const client = await poolConection.connect();

    try {
        // Obtener información completa del pedido
        const { rows } = await client.query(GET_PEDIDO_COMPLETO, [pedidoId]);

        if (!rows || rows.length === 0) {
            throw new Error('Pedido no encontrado');
        }

        const pedido = rows[0];

        if (isPedidoCerrado(pedido) && pedido.firma_usuario) {
            pedido.firma_usuario_datauri = await resolveImageToDataUri(pedido.firma_usuario);
            console.log('PDF firma cliente:', pedido.firma_usuario_datauri ? 'incrustada' : `no se pudo leer ${pedido.firma_usuario}`);
        }

        const PDFDocument = require('pdfkit');

        const doc = new PDFDocument({
            size: 'LETTER',
            margins: { top: 36, bottom: 36, left: 36, right: 36 },
            bufferPages: false
        });

        const chunks = [];
        doc.on('data', (chunk) => chunks.push(chunk));

        renderRemisionContratoPdf(doc, pedido);

        const endPromise = new Promise((resolve, reject) => {
            doc.on('end', resolve);
            doc.on('error', reject);
        });
        doc.end();
        await endPromise;

        // Convertir chunks a buffer
        const pdfBuffer = Buffer.concat(chunks);

        // Convertir buffer a base64
        const pdfBase64 = `data:application/pdf;base64,${pdfBuffer.toString('base64')}`;

        // Subir PDF a S3
        const pdfUrl = await uploadPDF({
            imagen: pdfBase64,
            mime: 'application/pdf'
        });

        return {
            status: true,
            pdfUrl: pdfUrl,
            pdfBase64: pdfBase64
        };

    } catch (error) {
        console.error('Error generando PDF de factura:', error);
        throw new DatabaseError(error);
    } finally {
        client.release();
    }
};

module.exports.main = async (event) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
        'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
        'Content-Type': 'application/json',
    };

    const method = event.httpMethod || event.requestContext?.http?.method;
    if (method === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ message: 'OK' })
        };
    }

    try {
        const pedidoId = event.pathParameters?.id;

        if (!pedidoId) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({
                    status: false,
                    message: 'ID del pedido es requerido'
                })
            };
        }

        const result = await generateFacturaPDF(pedidoId);

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify(result)
        };

    } catch (error) {
        console.error('Error en generate-factura-pdf:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                status: false,
                message: error.message || 'Error al generar el PDF de factura'
            })
        };
    }
};

module.exports.generateFacturaPDF = generateFacturaPDF;

