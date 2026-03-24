/**
 * PDF remisión + resumen contrato (2 páginas) — Codegas.
 * Usa pdfkit; no incluye imágenes de logos SGS/PSE (texto de referencia).
 */

const NIT = '830.130.648-0';

function fmtFecha(d) {
    if (!d) return '';
    try {
        const x = new Date(d);
        if (Number.isNaN(x.getTime())) return '';
        return x.toLocaleDateString('es-CO', { day: '2-digit', month: '2-digit', year: 'numeric' });
    } catch {
        return '';
    }
}

function fmtMoney(n) {
    const v = parseFloat(n);
    if (Number.isNaN(v)) return '';
    return `$${v.toLocaleString('es-CO', { maximumFractionDigits: 0 })}`;
}

function t(v) {
    if (v === undefined || v === null) return '';
    return String(v).trim();
}

function drawLine(doc, x1, y1, x2, y2) {
    doc.save();
    doc.strokeColor('#000000').lineWidth(0.5).moveTo(x1, y1).lineTo(x2, y2).stroke();
    doc.restore();
}

/**
 * @param {PDFKit.PDFDocument} doc
 * @param {object} p - fila del pedido (GET_PEDIDO_COMPLETO)
 */
function drawPage1(doc, p) {
    const left = 42;
    const right = 570;
    const w = right - left;
    let y = 42;

    doc.fontSize(11).font('Helvetica-Bold').fillColor('#002587').text('CODEGAS', left, y);
    doc.fontSize(7).font('Helvetica').fillColor('#333333').text('EL GAS QUE NO TE FALLA', left, y + 12);
    doc.text(`Nit: ${NIT}`, left, y + 22);

    const hx = left + 130;
    doc
        .fontSize(7)
        .text(
            'Dir: KM 1.8 Vía Madrid – Zona Industrial. PBX: (601) 744 4000. Emergencias: línea nacional.\n' +
                'Web: www.codegascolombia.com | facturacion@codegascolombia.com | soluciones@codegascolombia.com',
            hx,
            y,
            { width: w - 130, align: 'left' }
        );

    y = Math.max(y + 52, doc.y + 6);

    doc.rect(left, y, w, 48).stroke();
    doc.font('Helvetica-Bold').fontSize(8).text('FAVOR CONSIGNAR A LAS SIGUIENTES CUENTAS', left + 4, y + 4);
    doc.font('Helvetica').fontSize(6.5);
    doc.text(
        'Bancolombia — Cuenta corriente (ver datos en oficina) | Banco de Occidente — Cuenta corriente | Banco de Bogotá — Cuenta corriente',
        left + 4,
        y + 16,
        { width: w - 8 }
    );
    doc.font('Helvetica-Oblique').fontSize(6).text('Descuento de Retefuente 0,1 % por combustible.', left + 4, y + 36);

    y += 54;

    const fechaOp = fmtFecha(p.fechaEntregado || p.fechaEntrega || p.creado);
    const fechaVto = fmtFecha(p.fechaEntrega);

    doc.font('Helvetica').fontSize(7);
    doc.text(`Fecha: ${fechaOp || '____/____/______'}`, left, y);
    doc.text(`Fecha Vto.: ${fechaVto || '____/____/______'}`, left + w * 0.33, y);
    doc.text(`Placa: ${t(p.placa)}`, left + w * 0.66, y);
    y += 14;

    doc.text('Nombre o Razón Social:', left, y);
    doc.font('Helvetica-Bold').text(t(p.razon_social) || t(p.nombre) || '', left + 95, y, { width: w - 95 });
    y += 14;

    doc.font('Helvetica').text(`Número de Pedido APP: ${t(p._id)}`, left, y);
    doc.text(`Tel: ${t(p.punto_celular) || ''}`, left + w * 0.5, y);
    y += 14;

    const fp = (t(p.forma_pago) || '').toLowerCase();
    const contado = fp.includes('contado');
    const credito = fp.includes('cred') || fp.includes('crédito');
    doc.text(`NIT / C.C.: ${t(p.cedula)}`, left, y);
    doc.text(`CODT: ${t(p.codt)}`, left + w * 0.38, y);
    doc.text(`[${contado ? 'X' : ' '}] Contado    [${credito ? 'X' : ' '}] Crédito`, left + w * 0.58, y);
    y += 14;

    doc.font('Helvetica').text('Dirección:', left, y);
    doc.font('Helvetica-Bold').text(t(p.direccion) || '', left + 52, y, { width: w - 52 });
    y += 14;

    doc.font('Helvetica').text('Correo:', left, y);
    doc.font('Helvetica-Bold').text(t(p.email) || t(p.punto_email) || '', left + 42, y, { width: w - 42 });
    y += 18;

    doc.font('Helvetica-Bold').fontSize(7).text('FV PROFORMA / No. GL', left, y);
    doc.font('Helvetica').fontSize(6).text('(Referencia SGS ISO 9001 — sello en documento impreso)', left + 200, y);
    y += 14;

    const tblTop = y;
    const c0 = left;
    const c1 = left + w * 0.42;
    const c2 = left + w * 0.58;
    const c3 = left + w * 0.76;
    const rowH = 16;

    const tblH = rowH * 7 + 40;
    doc.rect(c0, tblTop, w, tblH).stroke();
    drawLine(doc, c1, tblTop, c1, tblTop + tblH);
    drawLine(doc, c2, tblTop, c2, tblTop + tblH);
    drawLine(doc, c3, tblTop, c3, tblTop + tblH);

    let ry = tblTop + 3;
    doc.font('Helvetica-Bold').fontSize(7);
    doc.text('Productos', c0 + 2, ry, { width: c1 - c0 - 4 });
    doc.text('Cantidad', c1 + 2, ry, { width: c2 - c1 - 4, align: 'center' });
    doc.text('Precio Unit.', c2 + 2, ry, { width: c3 - c2 - 4, align: 'right' });
    doc.text('Valor Total', c3 + 2, ry, { width: right - c3 - 4, align: 'right' });
    ry += rowH;
    drawLine(doc, c0, ry - 2, right, ry - 2);

    const kilos = parseFloat(String(p.kilos || '').replace(',', '.')) || 0;
    const vTotal = parseFloat(p.valor_total) || 0;
    let vu =
        parseFloat(p.valorUnitario) ||
        parseFloat(p.valor_unitario_usuario) ||
        (kilos > 0 && vTotal > 0 ? vTotal / kilos : 0);

    const rows = [
        ['G.l.p. Granel Kg.', kilos > 0 ? String(kilos) : '', vu > 0 ? fmtMoney(vu) : '', vTotal > 0 ? fmtMoney(vTotal) : ''],
        ['CM 18 Kg', '', '', ''],
        ['CM 15 Kg', '', '', ''],
        ['Fletes', '', '', ''],
        ['Total', '', '', vTotal > 0 ? fmtMoney(vTotal) : '']
    ];

    doc.font('Helvetica').fontSize(7);
    for (let i = 0; i < rows.length; i++) {
        const [prod, cant, pu, vt] = rows[i];
        const bold = i === rows.length - 1;
        if (bold) doc.font('Helvetica-Bold');
        doc.text(prod, c0 + 2, ry, { width: c1 - c0 - 4 });
        doc.text(cant, c1 + 2, ry, { width: c2 - c1 - 4, align: 'center' });
        doc.text(pu, c2 + 2, ry, { width: c3 - c2 - 4, align: 'right' });
        doc.text(vt, c3 + 2, ry, { width: right - c3 - 4, align: 'right' });
        if (bold) doc.font('Helvetica');
        ry += rowH;
        if (i < rows.length - 1) drawLine(doc, c0, ry - 2, right, ry - 2);
    }

    ry += 4;
    doc.font('Helvetica').fontSize(7);
    doc.text(`Nota: ${t(p.observacion_pedido) || '—'}`, c0 + 2, ry, { width: w - 4 });
    ry += 14;
    doc.text(`M3: ________    Factura de Venta No.: ${t(p.factura) || '—'}`, c0 + 2, ry);
    y = ry + 20;

    doc.font('Helvetica').fontSize(7);
    doc.text(`ENTREGADO POR: ${t(p.conductor) || '________________________'}`, left, y);
    y += 16;
    doc.text('RECIBIDO POR (Nombre y Apellido): ________________________', left, y);
    y += 16;
    doc.text('FIRMA: ________________________    C.C.: ________________________', left, y);
    y += 28;

    doc.font('Helvetica-Bold').fontSize(9).text('ORIGINAL', left, y, { width: w, align: 'center' });
}

const TEXTO_CONTRATO_RESUMEN = [
    {
        t: 'OBJETO',
        b: 'Prestación del servicio público de distribución de gas propano a tanques estacionarios conforme a la normatividad vigente.'
    },
    {
        t: 'ALCANCE DEL SUMINISTRO',
        b: 'Suministro de GLP según programación y condiciones técnicas del punto. El usuario autoriza el acceso a instalaciones para la operación segura.'
    },
    {
        t: 'CALIDAD DEL GAS Y MARGEN DE TOLERANCIA',
        b: 'El gas cumple especificaciones aplicables. Se reconocen márgenes de tolerancia en medición según reglamento del sector.'
    },
    {
        t: 'PRECIO Y SOLIDARIDAD',
        b: 'El precio aplicable es el vigente a la fecha de entrega según tarifas autorizadas o contrato. Obligaciones solidarias conforme a condiciones comerciales.'
    },
    {
        t: 'MANTENIMIENTO Y SEGURIDAD',
        b: 'El usuario es responsable del mantenimiento de instalaciones internas. Codegas orienta sobre buenas prácticas y protocolos de seguridad.'
    },
    {
        t: 'PQR',
        b: 'Puede presentar peticiones, quejas y reclamos según Ley 142 de 1994 y canales oficiales de la empresa.'
    },
    {
        t: 'ADHESIÓN',
        b: 'La firma de recepción y el uso del servicio implican conocimiento de estas condiciones generales.'
    }
];

function drawPage2(doc) {
    const left = 42;
    const right = 570;
    const w = right - left;
    let y = 48;

    doc.fontSize(10).font('Helvetica-Bold').fillColor('#000').text(
        'RESUMEN CONTRATO DE PRESTACIÓN DE SERVICIO PÚBLICO\nDE GAS PROPANO A TANQUES ESTACIONARIOS',
        left,
        y,
        { width: w, align: 'center' }
    );
    y = doc.y + 10;

    doc.fontSize(6.3).fillColor('#111');
    for (const sec of TEXTO_CONTRATO_RESUMEN) {
        doc.font('Helvetica-Bold').text(`${sec.t}: `, left, y, { continued: true });
        doc.font('Helvetica').text(sec.b, { width: w });
        y = doc.y + 4;
        if (y > 620) break;
    }

    y = doc.y + 8;
    doc.font('Helvetica-Bold').fontSize(8).text('PUNTO DE PAGO', left, y);
    y += 10;
    doc.font('Helvetica').fontSize(6.5).text(
        'Envíe soporte de pago a facturacion@codegascolombia.com / cartera@codegascolombia.com',
        left,
        y,
        { width: w }
    );
    y = doc.y + 6;

    const th = 14;
    doc.rect(left, y, w, th * 4).stroke();
    const cw = w / 3;
    drawLine(doc, left + cw, y, left + cw, y + th * 4);
    drawLine(doc, left + 2 * cw, y, left + 2 * cw, y + th * 4);
    doc.font('Helvetica-Bold').fontSize(7);
    doc.text('Banco', left + 2, y + 3, { width: cw - 4 });
    doc.text('No. de Cuenta', left + cw + 2, y + 3, { width: cw - 4 });
    doc.text('Tipo de Cuenta', left + 2 * cw + 2, y + 3, { width: cw - 4 });
    drawLine(doc, left, y + th, right, y + th);
    doc.font('Helvetica').fontSize(6.5);
    const banks = [
        ['Bancolombia', '—', 'Corriente'],
        ['Banco de Bogotá', '—', 'Corriente'],
        ['Banco de Occidente', '—', 'Corriente']
    ];
    let by = y + th + 2;
    for (const [b, n, tipo] of banks) {
        doc.text(b, left + 2, by, { width: cw - 4 });
        doc.text(n, left + cw + 2, by, { width: cw - 4 });
        doc.text(tipo, left + 2 * cw + 2, by, { width: cw - 4 });
        by += th;
        drawLine(doc, left, by - 1, right, by - 1);
    }

    y = y + th * 4 + 8;
    doc.font('Helvetica-Bold').fontSize(6.5).text(
        'Beneficiario: Compañía de Servicios Públicos S.A. E.S.P. y/o CODEGAS S.A. E.S.P.',
        left,
        y,
        { width: w }
    );
    y = doc.y + 8;

    doc.font('Helvetica').fontSize(6.3).text(
        'LEY 142 DE 1994: derecho a presentar PQR ante la empresa y ante la superintendencia del sector.',
        left,
        y,
        { width: w }
    );
    y = doc.y + 6;
    doc.text('Planta Madrid: KM 1.8 Vía Madrid. Planta Antioquia: consulte canales de atención.', left, y, { width: w });
    y = doc.y + 8;

    doc.rect(left, y, w, 36).stroke();
    doc.font('Helvetica-Bold').fontSize(7).fillColor('#b00020').text('¡Por la seguridad de su hogar!', left + 6, y + 6, { width: w - 12 });
    doc.font('Helvetica').fontSize(6.5).fillColor('#000').text(
        'Consulte con nuestro departamento técnico el mantenimiento de tanques y/o instalaciones.',
        left + 6,
        y + 18,
        { width: w - 12 }
    );
    y += 44;

    const fh = 52;
    const fw = w / 3;
    doc.font('Helvetica-Bold').fontSize(6.5);
    doc.text('PQR\nTel: (601) 744 4000', left, y, { width: fw - 4 });
    doc.text('Servicio Técnico y Emergencias\nLínea nacional / Bogotá', left + fw, y, { width: fw - 4 });
    doc.text('Atención al Cliente\ncomercial@codegascolombia.com', left + 2 * fw, y, { width: fw - 4 });
    doc.font('Helvetica').fontSize(6).text('Documento generado electrónicamente.', left, y + fh, { width: w, align: 'center' });
}

function renderRemisionContratoPdf(doc, pedido) {
    drawPage1(doc, pedido);
    doc.addPage();
    drawPage2(doc);
}

module.exports = {
    renderRemisionContratoPdf
};
