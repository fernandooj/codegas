const { poolConection } = require('../../../lib/connection-pg.js');
const DatabaseError = require('../../../lib/errors/database-error');
const { uploadPDF } = require('../../../lib/pdf');

/**
 * Genera un PDF de factura/remisión con la información completa del pedido
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
        p.observacion AS observacion_pedido,
        u.email,
        u.codt,
        u.razon_social,
        u.nombre,
        u.cedula,
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

        // Importar PDFDocument dinámicamente para evitar problemas con webpack
        // Como pdfkit está en externals, se requiere directamente desde node_modules
        const PDFDocument = require('pdfkit');

        // Crear el documento PDF
        const doc = new PDFDocument({
            size: 'LETTER',
            margins: { top: 50, bottom: 50, left: 50, right: 50 }
        });

        const chunks = [];
        doc.on('data', chunk => chunks.push(chunk));
        doc.on('end', () => { });

        // Header con logo y título
        doc.fontSize(24)
            .font('Helvetica-Bold')
            .fillColor('#002587')
            .text('CodeGas Colombia', 50, 50, { align: 'center' });

        doc.fontSize(18)
            .font('Helvetica-Bold')
            .fillColor('#000000')
            .text('FACTURA / REMISIÓN', 50, 90, { align: 'center' });

        doc.moveDown(0.5);

        // Información de la empresa
        doc.fontSize(10)
            .font('Helvetica')
            .fillColor('#666666')
            .text('Nit: 900.123.456-7', 50, doc.y, { align: 'center' });
        doc.text('Calle 123 #45-67, Bogotá, Colombia', 50, doc.y, { align: 'center' });
        doc.text('Tel: (601) 123-4567 | Email: info@codegascolombia.com', 50, doc.y, { align: 'center' });

        doc.moveDown(1);
        doc.strokeColor('#cccccc')
            .lineWidth(1)
            .moveTo(50, doc.y)
            .lineTo(550, doc.y)
            .stroke();

        doc.moveDown(1);

        // Información del pedido
        let yPos = doc.y;

        doc.fontSize(12)
            .font('Helvetica-Bold')
            .fillColor('#000000')
            .text('INFORMACIÓN DEL PEDIDO', 50, yPos);

        yPos += 25;

        const infoLeft = 50;
        const infoRight = 300;
        const lineHeight = 18;

        doc.fontSize(10)
            .font('Helvetica')
            .fillColor('#333333');

        doc.text(`Número de Pedido:`, infoLeft, yPos);
        doc.font('Helvetica-Bold').text(`#${pedido._id}`, infoRight, yPos);

        yPos += lineHeight;
        doc.font('Helvetica');

        if (pedido.factura) {
            doc.text(`Factura:`, infoLeft, yPos);
            doc.font('Helvetica-Bold').text(pedido.factura, infoRight, yPos);
            yPos += lineHeight;
            doc.font('Helvetica');
        }

        if (pedido.remision) {
            doc.text(`Remisión:`, infoLeft, yPos);
            doc.font('Helvetica-Bold').text(pedido.remision, infoRight, yPos);
            yPos += lineHeight;
            doc.font('Helvetica');
        }

        if (pedido.fechaEntrega) {
            const fechaEntrega = new Date(pedido.fechaEntrega).toLocaleDateString('es-CO', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            doc.text(`Fecha de Entrega:`, infoLeft, yPos);
            doc.font('Helvetica-Bold').text(fechaEntrega, infoRight, yPos);
            yPos += lineHeight;
            doc.font('Helvetica');
        }

        if (pedido.fechaEntregado) {
            const fechaEntregado = new Date(pedido.fechaEntregado).toLocaleDateString('es-CO', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            doc.text(`Fecha de Cierre:`, infoLeft, yPos);
            doc.font('Helvetica-Bold').text(fechaEntregado, infoRight, yPos);
            yPos += lineHeight;
            doc.font('Helvetica');
        }

        doc.moveDown(1);
        doc.strokeColor('#cccccc')
            .lineWidth(1)
            .moveTo(50, doc.y)
            .lineTo(550, doc.y)
            .stroke();

        doc.moveDown(1);

        // Información del cliente
        yPos = doc.y;
        doc.fontSize(12)
            .font('Helvetica-Bold')
            .fillColor('#000000')
            .text('INFORMACIÓN DEL CLIENTE', 50, yPos);

        yPos += 25;
        doc.fontSize(10)
            .font('Helvetica')
            .fillColor('#333333');

        if (pedido.razon_social) {
            doc.text(`Razón Social:`, infoLeft, yPos);
            doc.font('Helvetica-Bold').text(pedido.razon_social, infoRight, yPos);
            yPos += lineHeight;
            doc.font('Helvetica');
        }

        if (pedido.nombre) {
            doc.text(`Nombre:`, infoLeft, yPos);
            doc.font('Helvetica-Bold').text(pedido.nombre, infoRight, yPos);
            yPos += lineHeight;
            doc.font('Helvetica');
        }

        if (pedido.codt) {
            doc.text(`Código Cliente (CODT):`, infoLeft, yPos);
            doc.font('Helvetica-Bold').text(pedido.codt, infoRight, yPos);
            yPos += lineHeight;
            doc.font('Helvetica');
        }

        if (pedido.cedula) {
            doc.text(`Cédula/NIT:`, infoLeft, yPos);
            doc.font('Helvetica-Bold').text(pedido.cedula, infoRight, yPos);
            yPos += lineHeight;
            doc.font('Helvetica');
        }

        if (pedido.email) {
            doc.text(`Email:`, infoLeft, yPos);
            doc.font('Helvetica-Bold').text(pedido.email, infoRight, yPos);
            yPos += lineHeight;
            doc.font('Helvetica');
        }

        doc.moveDown(1);
        doc.strokeColor('#cccccc')
            .lineWidth(1)
            .moveTo(50, doc.y)
            .lineTo(550, doc.y)
            .stroke();

        doc.moveDown(1);

        // Información del punto de servicio
        if (pedido.direccion || pedido.punto_nombre) {
            yPos = doc.y;
            doc.fontSize(12)
                .font('Helvetica-Bold')
                .fillColor('#000000')
                .text('PUNTO DE SERVICIO', 50, yPos);

            yPos += 25;
            doc.fontSize(10)
                .font('Helvetica')
                .fillColor('#333333');

            if (pedido.punto_nombre) {
                doc.text(`Nombre:`, infoLeft, yPos);
                doc.font('Helvetica-Bold').text(pedido.punto_nombre, infoRight, yPos);
                yPos += lineHeight;
                doc.font('Helvetica');
            }

            if (pedido.direccion) {
                doc.text(`Dirección:`, infoLeft, yPos);
                doc.font('Helvetica-Bold').text(pedido.direccion, infoRight, yPos);
                yPos += lineHeight;
                doc.font('Helvetica');
            }

            if (pedido.capacidad) {
                doc.text(`Capacidad:`, infoLeft, yPos);
                doc.font('Helvetica-Bold').text(`${pedido.capacidad}`, infoRight, yPos);
                yPos += lineHeight;
                doc.font('Helvetica');
            }

            if (pedido.zona) {
                doc.text(`Zona:`, infoLeft, yPos);
                doc.font('Helvetica-Bold').text(pedido.zona, infoRight, yPos);
                yPos += lineHeight;
                doc.font('Helvetica');
            }

            doc.moveDown(1);
            doc.strokeColor('#cccccc')
                .lineWidth(1)
                .moveTo(50, doc.y)
                .lineTo(550, doc.y)
                .stroke();

            doc.moveDown(1);
        }

        // Información del vehículo y conductor
        if (pedido.conductor || pedido.placa) {
            yPos = doc.y;
            doc.fontSize(12)
                .font('Helvetica-Bold')
                .fillColor('#000000')
                .text('INFORMACIÓN DE ENTREGA', 50, yPos);

            yPos += 25;
            doc.fontSize(10)
                .font('Helvetica')
                .fillColor('#333333');

            if (pedido.conductor) {
                doc.text(`Conductor:`, infoLeft, yPos);
                doc.font('Helvetica-Bold').text(pedido.conductor, infoRight, yPos);
                yPos += lineHeight;
                doc.font('Helvetica');
            }

            if (pedido.placa) {
                doc.text(`Placa del Vehículo:`, infoLeft, yPos);
                doc.font('Helvetica-Bold').text(pedido.placa, infoRight, yPos);
                yPos += lineHeight;
                doc.font('Helvetica');
            }

            doc.moveDown(1);
            doc.strokeColor('#cccccc')
                .lineWidth(1)
                .moveTo(50, doc.y)
                .lineTo(550, doc.y)
                .stroke();

            doc.moveDown(1);
        }

        // Detalles del producto/servicio
        yPos = doc.y;
        doc.fontSize(12)
            .font('Helvetica-Bold')
            .fillColor('#000000')
            .text('DETALLES DEL SERVICIO', 50, yPos);

        yPos += 25;
        doc.fontSize(10)
            .font('Helvetica')
            .fillColor('#333333');

        if (pedido.cantidadKl) {
            doc.text(`Cantidad (KL):`, infoLeft, yPos);
            doc.font('Helvetica-Bold').text(`${pedido.cantidadKl}`, infoRight, yPos);
            yPos += lineHeight;
            doc.font('Helvetica');
        }

        if (pedido.kilos) {
            doc.text(`Kilos Entregados:`, infoLeft, yPos);
            doc.font('Helvetica-Bold').text(`${pedido.kilos}`, infoRight, yPos);
            yPos += lineHeight;
            doc.font('Helvetica');
        }

        if (pedido.valorUnitario) {
            const valorUnitario = parseFloat(pedido.valorUnitario) || 0;
            doc.text(`Valor Unitario:`, infoLeft, yPos);
            doc.font('Helvetica-Bold').text(`$${valorUnitario.toLocaleString('es-CO')}`, infoRight, yPos);
            yPos += lineHeight;
            doc.font('Helvetica');
        }

        if (pedido.valor_total) {
            const valorTotal = parseFloat(pedido.valor_total) || 0;
            doc.text(`Valor Total:`, infoLeft, yPos);
            doc.font('Helvetica-Bold')
                .fillColor('#002587')
                .text(`$${valorTotal.toLocaleString('es-CO')}`, infoRight, yPos);
            yPos += lineHeight;
            doc.font('Helvetica')
                .fillColor('#333333');
        }

        if (pedido.forma_pago) {
            doc.text(`Forma de Pago:`, infoLeft, yPos);
            doc.font('Helvetica-Bold').text(pedido.forma_pago, infoRight, yPos);
            yPos += lineHeight;
            doc.font('Helvetica');
        }

        doc.moveDown(1);
        doc.strokeColor('#cccccc')
            .lineWidth(1)
            .moveTo(50, doc.y)
            .lineTo(550, doc.y)
            .stroke();

        doc.moveDown(1)
            .strokeColor('#cccccc')
            .lineWidth(1)
            .moveTo(50, doc.y)
            .lineTo(550, doc.y)
            .stroke();

        doc.moveDown(0.8);

        // Observaciones
        if (pedido.observacion_pedido) {
            yPos = doc.y;
            doc.fontSize(12)
                .font('Helvetica-Bold')
                .fillColor('#000000')
                .text('OBSERVACIONES', 50, yPos);

            yPos += 25;
            doc.fontSize(10)
                .font('Helvetica')
                .fillColor('#333333')
                .text(pedido.observacion_pedido, 50, yPos, {
                    width: 500,
                    align: 'left'
                });

            doc.moveDown(1);
            doc.strokeColor('#cccccc')
                .lineWidth(1)
                .moveTo(50, doc.y)
                .lineTo(550, doc.y)
                .stroke();

            doc.moveDown(1);
        }

        // Footer
        const footerY = 750;
        doc.fontSize(8)
            .font('Helvetica')
            .fillColor('#666666')
            .text('Este documento fue generado automáticamente por el sistema CodeGas Colombia', 50, footerY, {
                align: 'center',
                width: 500
            });

        doc.text(`Generado el: ${new Date().toLocaleString('es-CO')}`, 50, doc.y + 10, {
            align: 'center',
            width: 500
        });

        // Finalizar el PDF
        doc.end();

        // Esperar a que el PDF se genere completamente
        await new Promise((resolve, reject) => {
            doc.on('end', resolve);
            doc.on('error', reject);
        });

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

    if (event.httpMethod === 'OPTIONS') {
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

