/**
 * PDF remisión + resumen contrato — replica el HTML
 * recursos/proforma-codegas (1).html
 *
 * Hoja apaisada, 2 columnas (ticket | contrato). Página 1 ORIGINAL, página 2 COPIA.
 * Logos embebidos (SGS ISO 9001 + CODEGAS) para que salgan en Lambda.
 */

const { logoJpg, sgsJpg } = require('./pdf-assets');

const NIT = '830.130.648-0';
const AZUL = '#0d2f6e';
const ROJO = '#e2231a';
const GRIS = '#1a1a1a';
const BORDE = '#0d2f6e';
const GRIS_CAJA = '#d9d9d9';
const GRIS_TH = '#f2f2f2';
const GRIS_LINEA = '#999999';

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

function drawImage(doc, buf, x, y, opts) {
    if (!buf) return false;
    try {
        doc.image(buf, x, y, opts);
        return true;
    } catch (e) {
        console.warn('PDF imagen:', e.message);
        return false;
    }
}

function strokeRect(doc, x, y, w, h, color = BORDE, lw = 1) {
    doc.save();
    doc.lineWidth(lw).strokeColor(color).rect(x, y, w, h).stroke();
    doc.restore();
}

function fillRect(doc, x, y, w, h, color) {
    doc.save();
    doc.rect(x, y, w, h).fill(color);
    doc.restore();
}

function hLine(doc, x1, y, x2, color = '#333333', lw = 0.55) {
    doc.save();
    doc.strokeColor(color).lineWidth(lw).moveTo(x1, y).lineTo(x2, y).stroke();
    doc.restore();
}

function vLine(doc, x, y1, y2, color = BORDE, lw = 0.55) {
    doc.save();
    doc.strokeColor(color).lineWidth(lw).moveTo(x, y1).lineTo(x, y2).stroke();
    doc.restore();
}

function checkbox(doc, x, y, checked, size = 7) {
    strokeRect(doc, x, y, size, size, '#333333', 0.7);
    if (checked) {
        doc.save();
        doc.strokeColor('#333333').lineWidth(1.1);
        doc.moveTo(x + 1.2, y + size * 0.55)
            .lineTo(x + size * 0.4, y + size - 1.3)
            .lineTo(x + size - 1.2, y + 1.3)
            .stroke();
        doc.restore();
    }
}

function field(doc, x, y, w, label, value, fontSize = 6.5) {
    doc.font('Helvetica-Bold').fontSize(fontSize).fillColor(GRIS);
    const labelW = label ? doc.widthOfString(label) + 2.5 : 0;
    if (label) doc.text(label, x, y, { lineBreak: false });
    hLine(doc, x + labelW, y + fontSize + 0.8, x + w, '#333333', 0.5);
    if (value) {
        doc.font('Helvetica').fontSize(fontSize).fillColor('#000');
        doc.text(String(value), x + labelW + 1, y, {
            width: Math.max(8, w - labelW - 2),
            lineBreak: false,
            ellipsis: true
        });
    }
}

function para(doc, x, y, w, titulo, cuerpo, fontSize) {
    doc.font('Helvetica-Bold').fontSize(fontSize).fillColor(AZUL);
    doc.text(`${titulo}: `, x, y, { continued: true, width: w });
    doc.font('Helvetica').fillColor(GRIS);
    doc.text(cuerpo, { width: w, align: 'justify' });
    return doc.y + 1.4;
}

function drawIsoBadge(doc, x, y, w) {
    const ok = drawImage(doc, sgsJpg, x, y, { fit: [w, w] });
    if (!ok) {
        const cx = x + w / 2;
        const cy = y + w * 0.42;
        const r = w * 0.32;
        doc.save();
        doc.circle(cx, cy, r).fill('#2e9e3f');
        doc.restore();
        doc.save();
        doc.strokeColor('#fff').lineWidth(2);
        doc.moveTo(cx - r * 0.4, cy)
            .lineTo(cx - r * 0.1, cy + r * 0.35)
            .lineTo(cx + r * 0.42, cy - r * 0.3)
            .stroke();
        doc.restore();
    }
    doc.font('Helvetica-Bold').fontSize(5.4).fillColor(GRIS);
    doc.text('CO17/7410', x, y + w - 2, { width: w, align: 'center', characterSpacing: 0.4 });
}

const CONTRATOS = [
    {
        t: 'OBJETO',
        b: 'En virtud del presente contrato la EMPRESA, se obliga con el SUSCRIPTOR o USUARIO a suministrarle GAS LICUADO DE PETROLEO, a granel es decir a través de carrotanque, a solicitud del segundo y entregarlo en la EDIFICACIÓN que aquel indique.'
    },
    {
        t: 'ALCANCE DEL SUMINISTRO',
        b: 'La obligación de prestación del servicio sin interrupciones por parte de la EMPRESA queda enmarcada dentro de las posibilidades técnicas y financieras. La EMPRESA quedará exonerada en casos de fuerza mayor, caso fortuito o cuando se presente problemas de escasez del producto, que no se haya originado por culpa de esta.'
    },
    {
        t: 'CALIDAD DEL GAS',
        b: 'EL GAS que se obliga la EMPRESA a suministrar será de aquella calidad que determinan las autoridades competentes y estará dentro de los mismos estándares del que entregan los grandes comercializadores.'
    },
    {
        t: 'MARGEN DE TOLERANCIA',
        b: 'Por ser un producto entregado en volumen la cantidad, estarán dentro de los márgenes de tolerancia por defecto o por exceso, que señalen las autoridades competentes y a falta de dicho señalamiento, aquellos que deriven de las condiciones técnicas de llenado y disposición de residuos.'
    },
    {
        t: 'PRECIO',
        b: 'El precio del GAS será aquel que resulte de las tarifas aprobadas vigentes por las autoridades competentes, en tanto sigan reguladas.'
    },
    {
        t: 'SOLIDARIDAD',
        b: 'En el cumplimiento de las prestaciones de este contrato existirá solidaridad entre el SUSCRIPTOR y el USUARIO del servicio.'
    },
    {
        t: 'MANTENIMIENTO DE LAS INSTALACIONES',
        b: 'Corresponde al SUSCRIPTOR el mantenimiento adecuado de las instalaciones y gasodomésticos, labor que debe ser contratada con un organismo de inspección acreditado; el SUSCRIPTOR responderá por todo daño que se origine por el inadecuado mantenimiento de las instalaciones.'
    },
    {
        t: 'QUEJA, PETICIÓN Y RECURSO',
        b: 'EL SUSCRIPTOR o USUARIO tendrá derecho a presentar queja, petición o recursos de la EMPRESA, cuando lo considere oportuno, en torno al desarrollo de este contrato. Por los medios publicados en esta factura de venta.'
    },
    {
        t: 'MANIPULACIÓN DEL GAS',
        b: 'Exija a los funcionarios, que todos los equipos necesarios para el suministro de GLP cumplan con las normas de seguridad y que se encuentren en buen estado. Adicionalmente una vez realizado el suministro exija que se verifiquen con agua jabonosa, que no hayan fugas en las válvulas del tanque.'
    },
    {
        t: 'ADHESIÓN INTEGRAL AL CONTENIDO DEL CONTRATO',
        b: 'EL SUSCRIPTOR O USUARIO, libre de cualquier vicio, mediante la firma del presente resumen acepta el contenido integral del contrato para la prestación del servicio del gas licuado de petróleo, en tanques estacionarios, cuyo contenido puede ser revisado completamente a través de la página web www.codegascolombia.com encontrándolo ajustado a su voluntad contractual. En caso que la página web se encuentre caída o exista algún problema técnico, el SUSCRIPTOR O USUARIO está en la obligación de dar aviso a la EMPRESA, para que el contenido del contrato le sea remitido de cualquier otra forma, sin que esto vicie, de ninguna manera y bajo ninguna circunstancia, la aceptación que por esta vía se consolidó.'
    }
];

function drawTicket(doc, p, boxX, boxY, boxW, boxH, marca) {
    strokeRect(doc, boxX, boxY, boxW, boxH, BORDE, 1.5);
    const pad = 6;
    const x = boxX + pad;
    const maxX = boxX + boxW - pad;
    const w = maxX - x;
    let y = boxY + 5;

    const headH = 62;
    strokeRect(doc, x, y, w, headH, GRIS_LINEA, 0.6);
    const logoW = 108;
    doc.font('Helvetica-Bold').fontSize(5.2).fillColor(GRIS);
    doc.text('COMPAÑÍA DE SERVICIOS PÚBLICOS', x + 2, y + 3, { width: logoW, align: 'center' });
    doc.text('CODEGAS S.A. E.S.P.', x + 2, y + 10, { width: logoW, align: 'center' });
    drawImage(doc, logoJpg, x + 8, y + 16, { fit: [logoW - 12, 30] });
    doc.font('Helvetica-Bold').fontSize(6).fillColor(GRIS);
    doc.text(`Nit: ${NIT}`, x + 2, y + headH - 10, { width: logoW, align: 'center' });

    vLine(doc, x + logoW + 8, y + 3, y + headH - 3, GRIS_LINEA, 0.55);
    doc.font('Helvetica').fontSize(5.3).fillColor(GRIS);
    doc.text(
        'KM 1.8 VÍA MADRID - PTE. PIEDRA / MADRID CUND.\n' +
            'PBX: 794 2333  •  Línea Nacional (01-800-518-5245)\n' +
            'Emergencias: 794 5484 - Medellín: 4310188\n' +
            'Cel: 320 805 9341 - 321 475 1283\n' +
            'www.codegascolombia.com\n' +
            'E-mail: coord.cartera@codegascolombia.com\n' +
            'facturacion@codegascolombia.com\n' +
            'soluciones@codegascolombia.com',
        x + logoW + 12,
        y + 4,
        { width: w - logoW - 16, align: 'center', lineGap: 0.2 }
    );
    y += headH + 4;

    doc.font('Helvetica-Bold').fontSize(4.9).fillColor(GRIS);
    doc.text(
        'FAVOR CONSIGNAR A LAS SIGUIENTES CUENTAS: CTA. CTE. 30419858301 BANCOLOMBIA',
        x,
        y,
        { width: w, align: 'center' }
    );
    doc.text('CTA. CTE. 23507654-4 BANCO OCCIDENTE  -  CTA. CTE. 018044370 BANCO BOGOTÁ', x, y + 7, {
        width: w,
        align: 'center'
    });
    doc.font('Helvetica').fontSize(4.9);
    doc.text('Descuento de Retefuente 0.1 % por combustible', x, y + 14, { width: w, align: 'center' });
    y += 22;

    // Espacio en blanco del HTML (~5 cm) para alinear con el contrato
    y += 78;

    const c3 = w / 3;
    field(doc, x, y, c3 - 6, 'Fecha:', fmtFecha(p.fechaEntregado || p.fechaEntrega || p.creado));
    field(doc, x + c3, y, c3 - 6, 'Fecha Vto.:', fmtFecha(p.fechaEntrega));
    field(doc, x + c3 * 2, y, c3 - 2, 'Placa.:', t(p.placa));
    y += 12;

    field(doc, x, y, w, 'Nombre o Razón Social:', t(p.razon_social) || t(p.nombre));
    y += 12;
    field(doc, x, y, w, '', '');
    y += 12;

    field(doc, x, y, w * 0.62, 'Numero de Pedido APP:', t(p._id));
    field(doc, x + w * 0.64, y, w * 0.36, 'Tel:', t(p.punto_celular));
    y += 12;

    const fp = (t(p.forma_pago) || t(p.forma) || '').toLowerCase();
    const contado = fp.includes('contado');
    const credito = fp.includes('cred') || fp.includes('crédito');
    field(doc, x, y, w * 0.4, 'NIT.:', t(p.cedula));
    field(doc, x + w * 0.42, y, w * 0.26, 'CODT:', t(p.codt));
    doc.font('Helvetica-Bold').fontSize(6.5).fillColor(GRIS);
    doc.text('Contado:', x + w * 0.72, y, { lineBreak: false });
    checkbox(doc, x + w * 0.72 + 38, y + 0.5, contado);
    y += 12;

    field(doc, x, y, w * 0.68, 'Dirección:', t(p.direccion));
    doc.font('Helvetica-Bold').fontSize(6.5).fillColor(GRIS);
    doc.text('Crédito:', x + w * 0.72, y, { lineBreak: false });
    checkbox(doc, x + w * 0.72 + 38, y + 0.5, credito);
    y += 12;

    field(doc, x, y, w, 'Correo:', t(p.email) || t(p.punto_email));
    y += 13;

    const fvTop = y;
    const isoW = 48;
    doc.font('Helvetica-Bold').fontSize(8).fillColor(AZUL);
    doc.text('FV', x, fvTop + 2, { width: 48, align: 'center' });
    doc.text('PROFORMA', x, fvTop + 11, { width: 48, align: 'center' });
    strokeRect(doc, x + 50, fvTop, 118, 22, BORDE, 0.8);
    doc.font('Helvetica-Bold').fontSize(6.5).fillColor(GRIS);
    doc.text('No. GL', x + 54, fvTop + 2, { lineBreak: false });
    const glVal = t(p.remision) || t(p.factura);
    if (glVal) {
        doc.font('Helvetica').fontSize(7).fillColor('#000');
        doc.text(glVal, x + 54, fvTop + 11, { width: 110 });
    }
    doc.font('Helvetica').fontSize(5.1).fillColor(GRIS);
    doc.text(
        'INFORMAR EL CORREO ELECTRÓNICO, donde desea recibir la factura de venta y registrarlo al correo: facturacion@codegascolombia.com reportando número de FV PROFORMA.',
        x,
        fvTop + 26,
        { width: w - isoW - 8 }
    );
    drawIsoBadge(doc, maxX - isoW, fvTop, isoW);
    y = fvTop + 50;

    const kilos = parseFloat(String(p.kilos || p.cantidadKl || '').replace(',', '.')) || 0;
    const vTotal = parseFloat(p.valor_total) || parseFloat(p.cantidadPrecio) || 0;
    const vu =
        parseFloat(p.valorUnitario) ||
        parseFloat(p.valor_unitario_usuario) ||
        (kilos > 0 && vTotal > 0 ? vTotal / kilos : 0);

    const cols = [
        { t: 'Productos', w: w * 0.4 },
        { t: 'Cantidad', w: w * 0.18 },
        { t: 'Precio Unitario', w: w * 0.22 },
        { t: 'Valor Total', w: w * 0.2 }
    ];
    const rowH = 11;
    const headerH = 12;
    const nData = 5;
    const tableH = headerH + rowH * nData;
    const tableTop = y;
    strokeRect(doc, x, tableTop, w, tableH, BORDE, 0.8);
    fillRect(doc, x, tableTop, w, headerH, GRIS_TH);
    const totalRowTop = tableTop + headerH + rowH * (nData - 1);
    let cx = x;
    doc.font('Helvetica-Bold').fontSize(5.8).fillColor(GRIS);
    for (let i = 0; i < cols.length; i++) {
        if (i > 0) vLine(doc, cx, tableTop, i === 3 ? tableTop + tableH : totalRowTop, BORDE, 0.55);
        doc.text(cols[i].t, cx + 2, tableTop + 2.5, { width: cols[i].w - 4 });
        cx += cols[i].w;
    }
    hLine(doc, x, tableTop + headerH, maxX, BORDE, 0.55);

    const rows = [
        ['G.l.p. Granel Kg.', kilos > 0 ? String(kilos) : '', vu > 0 ? fmtMoney(vu) : '', vTotal > 0 ? fmtMoney(vTotal) : ''],
        ['CM 18 Kg', '', '', ''],
        ['CM 15 Kg', '', '', ''],
        ['Fletes', '', '', ''],
        ['Total', '', '', vTotal > 0 ? fmtMoney(vTotal) : '']
    ];
    for (let i = 0; i < rows.length; i++) {
        const ry = tableTop + headerH + i * rowH;
        if (i > 0) hLine(doc, x, ry, maxX, BORDE, 0.55);
        const bold = i === rows.length - 1;
        doc.font(bold ? 'Helvetica-Bold' : 'Helvetica').fontSize(5.8).fillColor('#000');
        let xx = x;
        const align = ['left', 'center', 'right', 'right'];
        for (let c = 0; c < 4; c++) {
            if (bold && c === 0) {
                doc.text(rows[i][c], xx + 2, ry + 2, { width: cols[0].w + cols[1].w + cols[2].w - 4 });
            } else if (!(bold && c < 3)) {
                doc.text(rows[i][c], xx + 2, ry + 2, { width: cols[c].w - 4, align: align[c] });
            }
            xx += cols[c].w;
        }
    }
    y = tableTop + tableH;

    const notaH = 20;
    strokeRect(doc, x, y, w, notaH, BORDE, 0.8);
    const notaW = w * 0.5;
    const m3W = w * 0.18;
    vLine(doc, x + notaW, y, y + notaH, BORDE, 0.55);
    vLine(doc, x + notaW + m3W, y, y + notaH, BORDE, 0.55);
    doc.font('Helvetica-Bold').fontSize(5.8).fillColor(GRIS);
    doc.text('Nota:', x + 3, y + 3, { lineBreak: false });
    doc.font('Helvetica').fontSize(5.4).fillColor('#000');
    doc.text(t(p.observacion_pedido) || '', x + 22, y + 3, { width: notaW - 26 });
    doc.font('Helvetica-Bold').fontSize(6.2).fillColor(GRIS);
    doc.text('M³', x + notaW, y + 6, { width: m3W, align: 'center' });
    doc.text('Factura de\nVenta No.', x + notaW + m3W, y + 2, {
        width: w - notaW - m3W,
        align: 'center'
    });
    if (t(p.factura)) {
        doc.font('Helvetica').fontSize(5.4).fillColor('#000');
        doc.text(t(p.factura), x + notaW + m3W, y + 13, { width: w - notaW - m3W, align: 'center' });
    }
    y += notaH + 5;

    hLine(doc, x, y, maxX, '#333', 0.5);
    y += 3;
    doc.font('Helvetica-Bold').fontSize(5.6).fillColor(GRIS);
    doc.text('Vigilada Superintendencia de Servicios Públicos', x, y, { width: w, align: 'center' });
    y += 11;

    field(doc, x, y, w, 'ENTREGADO POR:', t(p.conductor), 6.3);
    y += 13;
    field(doc, x, y, w, 'RECIBIDO POR (Nombre y Apellido):', t(p.nombre) || t(p.razon_social), 6.3);
    y += 14;

    doc.font('Helvetica-Bold').fontSize(6.3).fillColor(GRIS);
    doc.text('FIRMA :', x, y, { lineBreak: false });
    const firmaLabelW = doc.widthOfString('FIRMA :') + 3;
    const firmaLineW = w * 0.5;
    const firmaData = t(p.firma_usuario_datauri);
    if (firmaData.startsWith('data:')) {
        try {
            doc.image(Buffer.from(firmaData.split(',')[1], 'base64'), x + firmaLabelW, y - 14, { fit: [110, 26] });
        } catch (e) {
            hLine(doc, x + firmaLabelW, y + 8, x + firmaLabelW + firmaLineW, '#333', 0.5);
        }
    } else {
        hLine(doc, x + firmaLabelW, y + 8, x + firmaLabelW + firmaLineW, '#333', 0.5);
    }
    const ccX = x + firmaLabelW + firmaLineW + 6;
    doc.font('Helvetica-Bold').fontSize(6.3).fillColor(GRIS);
    doc.text('C.C.', ccX, y, { lineBreak: false });
    hLine(doc, ccX + 16, y + 8, maxX, '#333', 0.5);
    if (t(p.cedula)) {
        doc.font('Helvetica').fontSize(6.2).fillColor('#000');
        doc.text(t(p.cedula), ccX + 18, y, { width: maxX - ccX - 20, lineBreak: false });
    }

    doc.font('Helvetica-Bold').fontSize(6.5).fillColor('#333');
    doc.text(marca, maxX - 52, boxY + boxH - 12, { width: 50, align: 'right', characterSpacing: 0.8 });
}

function drawContrato(doc, boxX, boxY, boxW, boxH) {
    const pad = 5;
    const x = boxX + pad;
    const w = boxW - pad * 2;
    let y = boxY + 2;

    doc.font('Helvetica-Bold').fontSize(7.4).fillColor(AZUL);
    doc.text('RESUMEN CONTRATO DE PRESTACIÓN DE SERVICIO', x, y, { width: w, align: 'center' });
    doc.text('PÚBLICO DE GAS PROPANO A TANQUES ESTACIONARIOS', x, y + 9, {
        width: w,
        align: 'center'
    });
    y += 20;

    for (const sec of CONTRATOS) {
        y = para(doc, x, y, w, sec.t, sec.b, 5.15);
    }

    doc.font('Helvetica').fontSize(5.15).fillColor(GRIS);
    doc.text(
        'Este es el resumen del CONTRATO DE CONDICIONES UNIFORMES DE PRESTACIÓN DEL SERVICIO PÚBLICO DOMICILIARIO DE GLP, por lo tanto, se deja constancia de la existencia del mismo, ya que en caso de que no exista un contrato de condiciones uniformes previo y a pesar de haberle estado prestando el servicio de suministro, este estaba y está publicado en la página web del distribuidor para consultas (www.codegascolombia.com), así como también el respectivo resumen en las remisiones de entrega de producto, factura proforma y/o las facturas de venta. El usuario no podrá utilizar dicho argumento de excusa para informar desconocimiento de lo aquí descrito.',
        x,
        y,
        { width: w, align: 'justify' }
    );
    y = doc.y + 3;

    doc.font('Helvetica-Bold').fontSize(5.2).fillColor(GRIS);
    doc.text(
        'Reclame su remisión en el momento del suministro y verifique que ésta tenga el timbre o el soporte de registro de los kilos suministrados.',
        x,
        y,
        { width: w, align: 'justify' }
    );
    y = doc.y + 2;
    doc.text(
        'La facturación se realizará de manera electrónica al correo registrado por el usuario, ésta facturación se realizará de acuerdo a la normatividad vigente.',
        x,
        y,
        { width: w, align: 'justify' }
    );
    y = doc.y + 5;

    const pagoTop = y;
    const pagoH = 78;
    strokeRect(doc, x, pagoTop, w, pagoH, BORDE, 1.1);
    fillRect(doc, x, pagoTop, w, 10, GRIS_CAJA);
    doc.font('Helvetica-Bold').fontSize(6.2).fillColor(AZUL);
    doc.text('PUNTO DE PAGO', x, pagoTop + 1.8, { width: w, align: 'center' });
    fillRect(doc, x, pagoTop + 10, w, 11, GRIS_CAJA);
    doc.font('Helvetica').fontSize(4.6).fillColor(GRIS);
    doc.text(
        'Enviar soporte de pago al E-mail: coord.cartera@codegascolombia.com - aux.cartera2@codegascolombia.com',
        x,
        pagoTop + 12.5,
        { width: w, align: 'center' }
    );

    const tTop = pagoTop + 21;
    const tH = pagoH - 21;
    const colW = [62, 62, 68, 58, w - 62 - 62 - 68 - 58];
    const colX = [x];
    for (let i = 0; i < colW.length - 1; i++) colX.push(colX[i] + colW[i]);
    fillRect(doc, x, tTop, w, 9, GRIS_TH);
    doc.font('Helvetica-Bold').fontSize(4.7).fillColor(GRIS);
    doc.text('Pago oficinas de entidades financieras a nombre de CODEGAS S.A.', x, tTop + 1.6, {
        width: w,
        align: 'center'
    });
    hLine(doc, x, tTop + 9, x + w, GRIS_LINEA, 0.45);
    const thY = tTop + 9;
    fillRect(doc, x, thY, w, 9, GRIS_TH);
    const headers = ['Medios de Pago', 'Banco', 'No. de Cuenta', 'Tipo de Cuenta', 'Para pago en cheque'];
    doc.font('Helvetica-Bold').fontSize(4.5).fillColor(GRIS);
    for (let i = 0; i < headers.length; i++) {
        if (i > 0) vLine(doc, colX[i], thY, tTop + tH, GRIS_LINEA, 0.4);
        doc.text(headers[i], colX[i] + 1, thY + 1.8, { width: colW[i] - 2, align: 'center' });
    }
    hLine(doc, x, thY + 9, x + w, GRIS_LINEA, 0.45);

    const banks = [
        ['Bancolombia', '30419858301', 'Corriente'],
        ['Bogotá', '018044370', 'Corriente'],
        ['Occidente', '235-07654-4', 'Corriente']
    ];
    const bodyTop = thY + 9;
    const bodyH = tTop + tH - bodyTop;
    const brh = bodyH / 3;
    doc.font('Helvetica').fontSize(4.8).fillColor('#000');
    for (let i = 0; i < banks.length; i++) {
        const by = bodyTop + i * brh;
        if (i > 0) hLine(doc, colX[1], by, colX[4], GRIS_LINEA, 0.4);
        doc.text(banks[i][0], colX[1] + 1, by + 3, { width: colW[1] - 2, align: 'center' });
        doc.text(banks[i][1], colX[2] + 1, by + 3, { width: colW[2] - 2, align: 'center' });
        doc.text(banks[i][2], colX[3] + 1, by + 3, { width: colW[3] - 2, align: 'center' });
    }
    doc.font('Helvetica').fontSize(4.2).fillColor(GRIS);
    doc.text('www.bancodeoccidente.com.co', colX[0] + 1, bodyTop + 2, { width: colW[0] - 2, align: 'center' });
    doc.text('Ingrese al link:', colX[0] + 1, bodyTop + 10, { width: colW[0] - 2, align: 'center' });
    doc.font('Helvetica-Bold').fontSize(4.6).fillColor(AZUL);
    doc.text('AvalPay Center / PSE', colX[0] + 1, bodyTop + 20, { width: colW[0] - 2, align: 'center' });
    doc.font('Helvetica').fontSize(4.3).fillColor(GRIS);
    doc.text('A nombre de:', colX[4] + 2, bodyTop + 3, { width: colW[4] - 4, align: 'center' });
    doc.font('Helvetica-Bold').fontSize(4.5).fillColor('#000');
    doc.text('Compañía de Servicios Públicos S.A. E.S.P.\ny/o CODEGAS S.A. E.S.P.', colX[4] + 2, bodyTop + 12, {
        width: colW[4] - 4,
        align: 'center'
    });

    y = pagoTop + pagoH + 4;

    const infoTop = y;
    const infoH = boxY + boxH - infoTop - 2;
    strokeRect(doc, x, infoTop, w, infoH, BORDE, 1.1);
    fillRect(doc, x, infoTop, w, 11, GRIS_CAJA);
    doc.font('Helvetica-Bold').fontSize(6.4).fillColor(AZUL);
    doc.text('INFORMACIÓN IMPORTANTE', x, infoTop + 2.2, { width: w, align: 'center' });

    const colLegalW = w * 0.52;
    const colContW = w * 0.45;
    const legalX = x + 4;
    const contX = legalX + colLegalW + 4;
    let ly = infoTop + 14;
    const legales = [
        'RECUERDA QUE LA LEY 142 DE 1994 DICE: En caso de presentar una reclamación en relación con el monto de tu factura deberás proceder al pago de las sumas que no se han objeto de reclamación.',
        'Art. 130 de la ley 142 de 1994: Esta factura de cobro presta mérito ejecutivo, en concordancia con el art. 774 C. de C. (Esta factura de venta se asimila en todos sus efectos a una letra de cambio).',
        'Para mayor información y atención de PQR’S (peticiones, quejas y reclamos) marca a nuestras líneas telefónicas o envía al e-mail: administracion@codegascolombia.com — pqr@codegascolombia.com'
    ];
    doc.font('Helvetica').fontSize(4.7).fillColor(GRIS);
    for (const ptxt of legales) {
        doc.text(ptxt, legalX, ly, { width: colLegalW - 4, align: 'justify' });
        ly = doc.y + 2;
    }

    const cajaW = colContW - 2;
    const cajaH = 52;
    strokeRect(doc, contX, infoTop + 14, cajaW, cajaH, GRIS_LINEA, 0.55);
    doc.font('Helvetica-Bold').fontSize(4.8).fillColor(AZUL);
    doc.text('Centro de venta, pagos, servicios y reclamos', contX + 3, infoTop + 16, { width: cajaW - 6 });
    doc.font('Helvetica').fontSize(4.5).fillColor(GRIS);
    doc.text(
        '• Planta Madrid: km 1.8 Vía Madrid - Pte. Piedra - Cund.\n• Planta Antioquia: Vereda Bellavista - Guarne Antioquia',
        contX + 3,
        infoTop + 24,
        { width: cajaW - 6 }
    );
    hLine(doc, contX + 3, infoTop + 40, contX + cajaW - 3, GRIS_LINEA, 0.4);
    doc.fontSize(4.3).text(
        'Para Mayor información sobre su factura marca al: 794 2333 o al E-mail: facturacion@codegascolombia.com',
        contX + 3,
        infoTop + 42,
        { width: cajaW - 6 }
    );
    hLine(doc, contX + 3, infoTop + 54, contX + cajaW - 3, GRIS_LINEA, 0.4);
    doc.font('Helvetica-Bold').fontSize(9).fillColor(ROJO);
    doc.text('!', contX + 4, infoTop + 55.5, { lineBreak: false });
    doc.font('Helvetica').fontSize(4.3).fillColor(ROJO);
    doc.text(
        '¡Por la seguridad de su hogar! Consulte con nuestro departamento técnico el mantenimiento de tanques y/o instalaciones.',
        contX + 12,
        infoTop + 56.5,
        { width: cajaW - 16 }
    );

    const boxYc = infoTop + infoH - 32;
    const contactH = 28;
    const boxes = [
        { t: 'PQR:', b: '794 2333 Ext. 601' },
        { t: 'Servicio Técnico y Emergencias:', b: '794 23 33 Ext. 301\n321 429 44 59 - 314 237 6337' },
        { t: 'Atención al Cliente', b: '794 23 33 Ext. 205 - 313 228 8896\n310 284 7552 - 314 237 6337' }
    ];
    const contactGap = 3;
    const contactW = (w - 8 - contactGap * 2) / 3;
    boxes.forEach((bx, i) => {
        const bxX = x + 4 + i * (contactW + contactGap);
        strokeRect(doc, bxX, boxYc, contactW, contactH, GRIS_LINEA, 0.55);
        doc.font('Helvetica-Bold').fontSize(4.5).fillColor(AZUL);
        doc.text(bx.t, bxX + 2, boxYc + 2, { width: contactW - 4, align: 'center' });
        doc.font('Helvetica').fontSize(4.3).fillColor(GRIS);
        doc.text(bx.b, bxX + 2, boxYc + 10, { width: contactW - 4, align: 'center' });
    });
}

function drawHoja(doc, pedido, marca) {
    const pageW = doc.page.width;
    const pageH = doc.page.height;
    const m = 10;
    const gap = 8;
    const colW = (pageW - m * 2 - gap) / 2;
    const colH = pageH - m * 2;
    drawTicket(doc, pedido, m, m, colW, colH, marca);
    drawContrato(doc, m + colW + gap, m, colW, colH);
}

function renderRemisionContratoPdf(doc, pedido) {
    drawHoja(doc, pedido, 'ORIGINAL');
}

module.exports = {
    renderRemisionContratoPdf
};
