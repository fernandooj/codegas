import { Image } from 'react-native';
import { jsPDF } from 'jspdf';
import RNFS from 'react-native-fs';
import { sharePdfFile } from '../../utils/sharePdfFile';

const AZUL: [number, number, number] = [13, 47, 110];
const ROJO: [number, number, number] = [226, 35, 26];
const GRIS: [number, number, number] = [26, 26, 26];
const GRIS_CAJA: [number, number, number] = [217, 217, 217];
const GRIS_TH: [number, number, number] = [242, 242, 242];
const GRIS_LINEA: [number, number, number] = [153, 153, 153];
const NIT = '830.130.648-0';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const LOGO_MODULE = require('../../assets/img/pg1/fondo1.jpg');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const SGS_MODULE = require('../../assets/img/sgs_iso9001.jpg');

export type RemisionPdfPedido = {
    _id?: string | number;
    creado?: string;
    fechaEntrega?: string;
    fechaEntregado?: string;
    placa?: string;
    razon_social?: string;
    nombre?: string;
    punto_celular?: string;
    cedula?: string;
    codt?: string;
    forma_pago?: string;
    forma?: string;
    direccion?: string;
    punto_nombre?: string;
    email?: string;
    punto_email?: string;
    remision?: string;
    factura?: string;
    kilos?: number | string;
    cantidadKl?: number | string;
    valorUnitario?: number | string;
    valor_unitarioUsuario?: number | string;
    valor_total?: number | string;
    cantidadPrecio?: number | string;
    observacion_pedido?: string;
    conductor?: string;
    firma_usuario_datauri?: string | null;
};

const CONTRATOS: { t: string; b: string }[] = [
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

function t(v: unknown): string {
    if (v === undefined || v === null) return '';
    return String(v).trim();
}

function fmtFecha(d?: string): string {
    if (!d) return '';
    try {
        const x = new Date(d);
        if (Number.isNaN(x.getTime())) return '';
        return x.toLocaleDateString('es-CO', { day: '2-digit', month: '2-digit', year: 'numeric' });
    } catch {
        return '';
    }
}

function fmtMoney(n: number): string {
    if (Number.isNaN(n) || n === 0) return '';
    return `$${n.toLocaleString('es-CO', { maximumFractionDigits: 0 })}`;
}

async function loadAssetBase64(mod: number): Promise<string | null> {
    try {
        const resolved = Image.resolveAssetSource(mod);
        const uri = resolved?.uri;
        if (!uri) return null;
        if (uri.startsWith('http')) {
            const res = await fetch(uri);
            const buf = await res.arrayBuffer();
            const bytes = new Uint8Array(buf);
            let binary = '';
            for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
            if (typeof globalThis.btoa === 'function') return globalThis.btoa(binary);
            return null;
        }
        const path = uri.replace(/^file:\/\//, '');
        return await RNFS.readFile(path, 'base64');
    } catch {
        return null;
    }
}

function strokeRect(doc: jsPDF, x: number, y: number, w: number, h: number, color = AZUL, lw = 1) {
    doc.setDrawColor(...color);
    doc.setLineWidth(lw);
    doc.rect(x, y, w, h);
}

function fillRect(doc: jsPDF, x: number, y: number, w: number, h: number, color: [number, number, number]) {
    doc.setFillColor(...color);
    doc.rect(x, y, w, h, 'F');
}

function hLine(doc: jsPDF, x1: number, y: number, x2: number, color: [number, number, number] = [51, 51, 51], lw = 0.5) {
    doc.setDrawColor(...color);
    doc.setLineWidth(lw);
    doc.line(x1, y, x2, y);
}

function vLine(doc: jsPDF, x: number, y1: number, y2: number, color: [number, number, number] = AZUL, lw = 0.5) {
    doc.setDrawColor(...color);
    doc.setLineWidth(lw);
    doc.line(x, y1, x, y2);
}

function txt(doc: jsPDF, str: string, x: number, y: number, opts?: { w?: number; align?: 'left' | 'center' | 'right' | 'justify'; size?: number; bold?: boolean; color?: [number, number, number] }) {
    doc.setFont('helvetica', opts?.bold ? 'bold' : 'normal');
    if (opts?.size) doc.setFontSize(opts.size);
    if (opts?.color) doc.setTextColor(...opts.color);
    const align = opts?.align || 'left';
    const tx = align === 'center' && opts?.w ? x + opts.w / 2 : align === 'right' && opts?.w ? x + opts.w : x;
    doc.text(str, tx, y, { baseline: 'top', maxWidth: opts?.w, align });
}

function field(doc: jsPDF, x: number, y: number, w: number, label: string, value: string, fontSize = 6.5) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(fontSize);
    doc.setTextColor(...GRIS);
    const labelW = label ? doc.getTextWidth(label) + 2.5 : 0;
    if (label) doc.text(label, x, y, { baseline: 'top' });
    hLine(doc, x + labelW, y + fontSize + 0.6, x + w);
    if (value) {
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(0, 0, 0);
        doc.text(value, x + labelW + 1, y, { baseline: 'top', maxWidth: Math.max(8, w - labelW - 2) });
    }
}

function checkbox(doc: jsPDF, x: number, y: number, checked: boolean, size = 7) {
    strokeRect(doc, x, y, size, size, [51, 51, 51], 0.7);
    if (checked) {
        doc.setDrawColor(51, 51, 51);
        doc.setLineWidth(1.1);
        doc.line(x + 1.2, y + size * 0.55, x + size * 0.4, y + size - 1.3);
        doc.line(x + size * 0.4, y + size - 1.3, x + size - 1.2, y + 1.3);
    }
}

function para(doc: jsPDF, x: number, y: number, w: number, titulo: string, cuerpo: string, fontSize: number): number {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(fontSize);
    doc.setTextColor(...AZUL);
    const title = `${titulo}: `;
    const tw = doc.getTextWidth(title);
    doc.text(title, x, y, { baseline: 'top' });
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...GRIS);
    const firstMax = Math.max(20, w - tw);
    const all = doc.splitTextToSize(cuerpo, w) as string[];
    const first = doc.splitTextToSize(cuerpo, firstMax) as string[];
    doc.text(first[0] || '', x + tw, y, { baseline: 'top' });
    const restSrc = first.length > 1 ? first.slice(1).join(' ') : '';
    if (!restSrc) return y + fontSize + 2.2;
    const rest = doc.splitTextToSize(restSrc, w) as string[];
    doc.text(rest, x, y + fontSize + 0.8, { baseline: 'top' });
    return y + fontSize + 0.8 + rest.length * (fontSize + 0.6) + 1.6;
}

function drawIso(doc: jsPDF, x: number, y: number, w: number, sgsB64: string | null) {
    if (sgsB64) {
        try {
            doc.addImage(`data:image/jpeg;base64,${sgsB64}`, 'JPEG', x, y, w, w);
        } catch {
            sgsB64 = null;
        }
    }
    if (!sgsB64) {
        const cx = x + w / 2;
        const cy = y + w * 0.4;
        const r = w * 0.32;
        doc.setFillColor(46, 158, 63);
        doc.circle(cx, cy, r, 'F');
        doc.setDrawColor(255, 255, 255);
        doc.setLineWidth(1.8);
        doc.line(cx - r * 0.4, cy, cx - r * 0.08, cy + r * 0.32);
        doc.line(cx - r * 0.08, cy + r * 0.32, cx + r * 0.42, cy - r * 0.28);
    }
    txt(doc, 'CO17/7410', x, y + w - 1, { w, align: 'center', size: 5.4, bold: true, color: GRIS });
}

function drawTicket(doc: jsPDF, p: RemisionPdfPedido, boxX: number, boxY: number, boxW: number, boxH: number, marca: string, logoB64: string | null, sgsB64: string | null) {
    strokeRect(doc, boxX, boxY, boxW, boxH, AZUL, 1.5);
    const pad = 6;
    const x = boxX + pad;
    const maxX = boxX + boxW - pad;
    const w = maxX - x;
    let y = boxY + 5;

    const headH = 62;
    strokeRect(doc, x, y, w, headH, GRIS_LINEA, 0.6);
    const logoW = 108;
    txt(doc, 'COMPAÑÍA DE SERVICIOS PÚBLICOS', x + 2, y + 3, { w: logoW, align: 'center', size: 5.2, bold: true, color: GRIS });
    txt(doc, 'CODEGAS S.A. E.S.P.', x + 2, y + 10, { w: logoW, align: 'center', size: 5.2, bold: true, color: GRIS });
    if (logoB64) {
        try {
            doc.addImage(`data:image/jpeg;base64,${logoB64}`, 'JPEG', x + 8, y + 16, logoW - 12, 28);
        } catch { /* skip */ }
    }
    txt(doc, `Nit: ${NIT}`, x + 2, y + headH - 10, { w: logoW, align: 'center', size: 6, bold: true, color: GRIS });
    vLine(doc, x + logoW + 8, y + 3, y + headH - 3, GRIS_LINEA, 0.55);
    txt(
        doc,
        'KM 1.8 VÍA MADRID - PTE. PIEDRA / MADRID CUND.\nPBX: 794 2333  •  Línea Nacional (01-800-518-5245)\nEmergencias: 794 5484 - Medellín: 4310188\nCel: 320 805 9341 - 321 475 1283\nwww.codegascolombia.com\nE-mail: coord.cartera@codegascolombia.com\nfacturacion@codegascolombia.com\nsoluciones@codegascolombia.com',
        x + logoW + 12,
        y + 4,
        { w: w - logoW - 16, align: 'center', size: 5.3, color: GRIS }
    );
    y += headH + 4;

    txt(doc, 'FAVOR CONSIGNAR A LAS SIGUIENTES CUENTAS: CTA. CTE. 30419858301 BANCOLOMBIA', x, y, { w, align: 'center', size: 4.9, bold: true, color: GRIS });
    txt(doc, 'CTA. CTE. 23507654-4 BANCO OCCIDENTE  -  CTA. CTE. 018044370 BANCO BOGOTÁ', x, y + 7, { w, align: 'center', size: 4.9, bold: true, color: GRIS });
    txt(doc, 'Descuento de Retefuente 0.1 % por combustible', x, y + 14, { w, align: 'center', size: 4.9, color: GRIS });
    y += 100;

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

    const fp = (t(p.forma_pago) || t(p.forma)).toLowerCase();
    const contado = fp.includes('contado');
    const credito = fp.includes('cred') || fp.includes('crédito');
    field(doc, x, y, w * 0.4, 'NIT.:', t(p.cedula));
    field(doc, x + w * 0.42, y, w * 0.26, 'CODT:', t(p.codt));
    txt(doc, 'Contado:', x + w * 0.72, y, { size: 6.5, bold: true, color: GRIS });
    checkbox(doc, x + w * 0.72 + 38, y + 0.5, contado);
    y += 12;
    field(doc, x, y, w * 0.68, 'Dirección:', t(p.direccion) || t(p.punto_nombre));
    txt(doc, 'Crédito:', x + w * 0.72, y, { size: 6.5, bold: true, color: GRIS });
    checkbox(doc, x + w * 0.72 + 38, y + 0.5, credito);
    y += 12;
    field(doc, x, y, w, 'Correo:', t(p.email) || t(p.punto_email));
    y += 13;

    const fvTop = y;
    const isoW = 48;
    txt(doc, 'FV', x, fvTop + 2, { w: 48, align: 'center', size: 8, bold: true, color: AZUL });
    txt(doc, 'PROFORMA', x, fvTop + 11, { w: 48, align: 'center', size: 8, bold: true, color: AZUL });
    strokeRect(doc, x + 50, fvTop, 118, 22, AZUL, 0.8);
    txt(doc, 'No. GL', x + 54, fvTop + 2, { size: 6.5, bold: true, color: GRIS });
    const glVal = t(p.remision) || t(p.factura);
    if (glVal) txt(doc, glVal, x + 54, fvTop + 11, { size: 7, color: [0, 0, 0] });
    txt(
        doc,
        'INFORMAR EL CORREO ELECTRÓNICO, donde desea recibir la factura de venta y registrarlo al correo: facturacion@codegascolombia.com reportando número de FV PROFORMA.',
        x,
        fvTop + 26,
        { w: w - isoW - 8, size: 5.1, color: GRIS }
    );
    drawIso(doc, maxX - isoW, fvTop, isoW, sgsB64);
    y = fvTop + 50;

    const kilos = parseFloat(String(p.kilos || p.cantidadKl || '').replace(',', '.')) || 0;
    const vTotal = parseFloat(String(p.valor_total || p.cantidadPrecio || '')) || 0;
    const vu =
        parseFloat(String(p.valorUnitario || p.valor_unitarioUsuario || '')) ||
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
    strokeRect(doc, x, tableTop, w, tableH, AZUL, 0.8);
    fillRect(doc, x, tableTop, w, headerH, GRIS_TH);
    const totalRowTop = tableTop + headerH + rowH * (nData - 1);
    let cx = x;
    for (let i = 0; i < cols.length; i++) {
        if (i > 0) vLine(doc, cx, tableTop, i === 3 ? tableTop + tableH : totalRowTop, AZUL, 0.55);
        txt(doc, cols[i].t, cx + 2, tableTop + 2.5, { w: cols[i].w - 4, size: 5.8, bold: true, color: GRIS });
        cx += cols[i].w;
    }
    hLine(doc, x, tableTop + headerH, maxX, AZUL, 0.55);
    const rows: string[][] = [
        ['G.l.p. Granel Kg.', kilos > 0 ? String(kilos) : '', vu > 0 ? fmtMoney(vu) : '', vTotal > 0 ? fmtMoney(vTotal) : ''],
        ['CM 18 Kg', '', '', ''],
        ['CM 15 Kg', '', '', ''],
        ['Fletes', '', '', ''],
        ['Total', '', '', vTotal > 0 ? fmtMoney(vTotal) : '']
    ];
    for (let i = 0; i < rows.length; i++) {
        const ry = tableTop + headerH + i * rowH;
        if (i > 0) hLine(doc, x, ry, maxX, AZUL, 0.55);
        const bold = i === rows.length - 1;
        let xx = x;
        const align: Array<'left' | 'center' | 'right'> = ['left', 'center', 'right', 'right'];
        for (let c = 0; c < 4; c++) {
            if (bold && c === 0) {
                txt(doc, rows[i][c], xx + 2, ry + 2, { w: cols[0].w + cols[1].w + cols[2].w - 4, size: 5.8, bold: true, color: [0, 0, 0] });
            } else if (!(bold && c < 3)) {
                txt(doc, rows[i][c], xx + 2, ry + 2, { w: cols[c].w - 4, align: align[c], size: 5.8, bold, color: [0, 0, 0] });
            }
            xx += cols[c].w;
        }
    }
    y = tableTop + tableH;

    const notaH = 20;
    strokeRect(doc, x, y, w, notaH, AZUL, 0.8);
    const notaW = w * 0.5;
    const m3W = w * 0.18;
    vLine(doc, x + notaW, y, y + notaH, AZUL, 0.55);
    vLine(doc, x + notaW + m3W, y, y + notaH, AZUL, 0.55);
    txt(doc, 'Nota:', x + 3, y + 3, { size: 5.8, bold: true, color: GRIS });
    txt(doc, t(p.observacion_pedido), x + 22, y + 3, { w: notaW - 26, size: 5.4, color: [0, 0, 0] });
    txt(doc, 'M³', x + notaW, y + 6, { w: m3W, align: 'center', size: 6.2, bold: true, color: GRIS });
    txt(doc, 'Factura de\nVenta No.', x + notaW + m3W, y + 2, { w: w - notaW - m3W, align: 'center', size: 6.2, bold: true, color: GRIS });
    if (t(p.factura)) txt(doc, t(p.factura), x + notaW + m3W, y + 13, { w: w - notaW - m3W, align: 'center', size: 5.4, color: [0, 0, 0] });
    y += notaH + 5;
    hLine(doc, x, y, maxX, [51, 51, 51], 0.5);
    y += 3;
    txt(doc, 'Vigilada Superintendencia de Servicios Públicos', x, y, { w, align: 'center', size: 5.6, bold: true, color: GRIS });
    y += 11;
    field(doc, x, y, w, 'ENTREGADO POR:', t(p.conductor), 6.3);
    y += 13;
    field(doc, x, y, w, 'RECIBIDO POR (Nombre y Apellido):', t(p.nombre) || t(p.razon_social), 6.3);
    y += 14;
    txt(doc, 'FIRMA :', x, y, { size: 6.3, bold: true, color: GRIS });
    const firmaLabelW = 32;
    const firmaLineW = w * 0.5;
    const firmaData = t(p.firma_usuario_datauri);
    if (firmaData.startsWith('data:')) {
        try {
            const fmt = firmaData.includes('png') ? 'PNG' : 'JPEG';
            doc.addImage(firmaData, fmt, x + firmaLabelW, y - 14, 110, 26);
        } catch {
            hLine(doc, x + firmaLabelW, y + 8, x + firmaLabelW + firmaLineW);
        }
    } else {
        hLine(doc, x + firmaLabelW, y + 8, x + firmaLabelW + firmaLineW);
    }
    const ccX = x + firmaLabelW + firmaLineW + 6;
    txt(doc, 'C.C.', ccX, y, { size: 6.3, bold: true, color: GRIS });
    hLine(doc, ccX + 16, y + 8, maxX);
    if (t(p.cedula)) txt(doc, t(p.cedula), ccX + 18, y, { w: maxX - ccX - 20, size: 6.2, color: [0, 0, 0] });

    txt(doc, marca, maxX - 52, boxY + boxH - 12, { w: 50, align: 'right', size: 6.5, bold: true, color: [51, 51, 51] });
}

function drawContrato(doc: jsPDF, boxX: number, boxY: number, boxW: number, boxH: number) {
    const pad = 5;
    const x = boxX + pad;
    const w = boxW - pad * 2;
    let y = boxY + 2;
    txt(doc, 'RESUMEN CONTRATO DE PRESTACIÓN DE SERVICIO', x, y, { w, align: 'center', size: 7.4, bold: true, color: AZUL });
    txt(doc, 'PÚBLICO DE GAS PROPANO A TANQUES ESTACIONARIOS', x, y + 9, { w, align: 'center', size: 7.4, bold: true, color: AZUL });
    y += 20;
    for (const sec of CONTRATOS) {
        y = para(doc, x, y, w, sec.t, sec.b, 5.15);
    }
    txt(
        doc,
        'Este es el resumen del CONTRATO DE CONDICIONES UNIFORMES DE PRESTACIÓN DEL SERVICIO PÚBLICO DOMICILIARIO DE GLP, por lo tanto, se deja constancia de la existencia del mismo, ya que en caso de que no exista un contrato de condiciones uniformes previo y a pesar de haberle estado prestando el servicio de suministro, este estaba y está publicado en la página web del distribuidor para consultas (www.codegascolombia.com), así como también el respectivo resumen en las remisiones de entrega de producto, factura proforma y/o las facturas de venta. El usuario no podrá utilizar dicho argumento de excusa para informar desconocimiento de lo aquí descrito.',
        x,
        y,
        { w, align: 'justify', size: 5.15, color: GRIS }
    );
    y = doc.getTextDimensions(
        'Este es el resumen del CONTRATO DE CONDICIONES UNIFORMES DE PRESTACIÓN DEL SERVICIO PÚBLICO DOMICILIARIO DE GLP, por lo tanto, se deja constancia de la existencia del mismo, ya que en caso de que no exista un contrato de condiciones uniformes previo y a pesar de haberle estado prestando el servicio de suministro, este estaba y está publicado en la página web del distribuidor para consultas (www.codegascolombia.com), así como también el respectivo resumen en las remisiones de entrega de producto, factura proforma y/o las facturas de venta. El usuario no podrá utilizar dicho argumento de excusa para informar desconocimiento de lo aquí descrito.',
        { fontSize: 5.15, maxWidth: w }
    ).h + y + 3;

    txt(doc, 'Reclame su remisión en el momento del suministro y verifique que ésta tenga el timbre o el soporte de registro de los kilos suministrados.', x, y, { w, align: 'justify', size: 5.2, bold: true, color: GRIS });
    y += 12;
    txt(doc, 'La facturación se realizará de manera electrónica al correo registrado por el usuario, ésta facturación se realizará de acuerdo a la normatividad vigente.', x, y, { w, align: 'justify', size: 5.2, bold: true, color: GRIS });
    y += 14;

    const pagoTop = y;
    const pagoH = 78;
    strokeRect(doc, x, pagoTop, w, pagoH, AZUL, 1.1);
    fillRect(doc, x, pagoTop, w, 10, GRIS_CAJA);
    txt(doc, 'PUNTO DE PAGO', x, pagoTop + 1.8, { w, align: 'center', size: 6.2, bold: true, color: AZUL });
    fillRect(doc, x, pagoTop + 10, w, 11, GRIS_CAJA);
    txt(doc, 'Enviar soporte de pago al E-mail: coord.cartera@codegascolombia.com - aux.cartera2@codegascolombia.com', x, pagoTop + 12.5, { w, align: 'center', size: 4.6, color: GRIS });

    const tTop = pagoTop + 21;
    const tH = pagoH - 21;
    const colW = [62, 62, 68, 58, w - 62 - 62 - 68 - 58];
    const colX = [x, x + 62, x + 124, x + 192, x + 250];
    fillRect(doc, x, tTop, w, 9, GRIS_TH);
    txt(doc, 'Pago oficinas de entidades financieras a nombre de CODEGAS S.A.', x, tTop + 1.6, { w, align: 'center', size: 4.7, bold: true, color: GRIS });
    hLine(doc, x, tTop + 9, x + w, GRIS_LINEA, 0.45);
    const thY = tTop + 9;
    fillRect(doc, x, thY, w, 9, GRIS_TH);
    const headers = ['Medios de Pago', 'Banco', 'No. de Cuenta', 'Tipo de Cuenta', 'Para pago en cheque'];
    for (let i = 0; i < headers.length; i++) {
        if (i > 0) vLine(doc, colX[i], thY, tTop + tH, GRIS_LINEA, 0.4);
        txt(doc, headers[i], colX[i] + 1, thY + 1.8, { w: colW[i] - 2, align: 'center', size: 4.5, bold: true, color: GRIS });
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
    for (let i = 0; i < banks.length; i++) {
        const by = bodyTop + i * brh;
        if (i > 0) hLine(doc, colX[1], by, colX[4], GRIS_LINEA, 0.4);
        txt(doc, banks[i][0], colX[1] + 1, by + 3, { w: colW[1] - 2, align: 'center', size: 4.8, color: [0, 0, 0] });
        txt(doc, banks[i][1], colX[2] + 1, by + 3, { w: colW[2] - 2, align: 'center', size: 4.8, color: [0, 0, 0] });
        txt(doc, banks[i][2], colX[3] + 1, by + 3, { w: colW[3] - 2, align: 'center', size: 4.8, color: [0, 0, 0] });
    }
    txt(doc, 'www.bancodeoccidente.com.co', colX[0] + 1, bodyTop + 2, { w: colW[0] - 2, align: 'center', size: 4.2, color: GRIS });
    txt(doc, 'Ingrese al link:', colX[0] + 1, bodyTop + 10, { w: colW[0] - 2, align: 'center', size: 4.2, color: GRIS });
    txt(doc, 'AvalPay Center / PSE', colX[0] + 1, bodyTop + 20, { w: colW[0] - 2, align: 'center', size: 4.6, bold: true, color: AZUL });
    txt(doc, 'A nombre de:', colX[4] + 2, bodyTop + 3, { w: colW[4] - 4, align: 'center', size: 4.3, color: GRIS });
    txt(doc, 'Compañía de Servicios Públicos S.A. E.S.P.\ny/o CODEGAS S.A. E.S.P.', colX[4] + 2, bodyTop + 12, { w: colW[4] - 4, align: 'center', size: 4.5, bold: true, color: [0, 0, 0] });

    y = pagoTop + pagoH + 4;
    const infoTop = y;
    const infoH = boxY + boxH - infoTop - 2;
    strokeRect(doc, x, infoTop, w, infoH, AZUL, 1.1);
    fillRect(doc, x, infoTop, w, 11, GRIS_CAJA);
    txt(doc, 'INFORMACIÓN IMPORTANTE', x, infoTop + 2.2, { w, align: 'center', size: 6.4, bold: true, color: AZUL });

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
    for (const ptxt of legales) {
        txt(doc, ptxt, legalX, ly, { w: colLegalW - 4, align: 'justify', size: 4.7, color: GRIS });
        const dim = doc.getTextDimensions(ptxt, { fontSize: 4.7, maxWidth: colLegalW - 4 });
        ly += dim.h + 2;
    }

    const cajaW = colContW - 2;
    strokeRect(doc, contX, infoTop + 14, cajaW, 52, GRIS_LINEA, 0.55);
    txt(doc, 'Centro de venta, pagos, servicios y reclamos', contX + 3, infoTop + 16, { w: cajaW - 6, size: 4.8, bold: true, color: AZUL });
    txt(doc, '• Planta Madrid: km 1.8 Vía Madrid - Pte. Piedra - Cund.\n• Planta Antioquia: Vereda Bellavista - Guarne Antioquia', contX + 3, infoTop + 24, { w: cajaW - 6, size: 4.5, color: GRIS });
    hLine(doc, contX + 3, infoTop + 40, contX + cajaW - 3, GRIS_LINEA, 0.4);
    txt(doc, 'Para Mayor información sobre su factura marca al: 794 2333 o al E-mail: facturacion@codegascolombia.com', contX + 3, infoTop + 42, { w: cajaW - 6, size: 4.3, color: GRIS });
    hLine(doc, contX + 3, infoTop + 54, contX + cajaW - 3, GRIS_LINEA, 0.4);
    txt(doc, '!', contX + 4, infoTop + 55.5, { size: 9, bold: true, color: ROJO });
    txt(doc, '¡Por la seguridad de su hogar! Consulte con nuestro departamento técnico el mantenimiento de tanques y/o instalaciones.', contX + 12, infoTop + 56.5, { w: cajaW - 16, size: 4.3, color: ROJO });

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
        txt(doc, bx.t, bxX + 2, boxYc + 2, { w: contactW - 4, align: 'center', size: 4.5, bold: true, color: AZUL });
        txt(doc, bx.b, bxX + 2, boxYc + 10, { w: contactW - 4, align: 'center', size: 4.3, color: GRIS });
    });
}

function drawHoja(doc: jsPDF, pedido: RemisionPdfPedido, marca: string, logoB64: string | null, sgsB64: string | null) {
    const pageW = doc.internal.pageSize.getWidth();
    const pageH = doc.internal.pageSize.getHeight();
    const m = 10;
    const gap = 8;
    const colW = (pageW - m * 2 - gap) / 2;
    const colH = pageH - m * 2;
    drawTicket(doc, pedido, m, m, colW, colH, marca, logoB64, sgsB64);
    drawContrato(doc, m + colW + gap, m, colW, colH);
}

export async function generateAndShareRemisionPdf(pedido: RemisionPdfPedido): Promise<{ status: true; path: string }> {
    const [logoB64, sgsB64] = await Promise.all([loadAssetBase64(LOGO_MODULE), loadAssetBase64(SGS_MODULE)]);
    const doc = new jsPDF({ unit: 'pt', format: 'letter', orientation: 'landscape' });
    drawHoja(doc, pedido, 'ORIGINAL', logoB64, sgsB64);

    const dataUri = doc.output('datauristring') as string;
    const i = dataUri.indexOf(',');
    const base64 = i >= 0 ? dataUri.slice(i + 1) : dataUri;
    const safeId = t(pedido._id).replace(/[^a-zA-Z0-9_-]/g, '_') || 'pedido';
    const path = `${RNFS.DocumentDirectoryPath}/Remision_pedido_${safeId}.pdf`;
    await RNFS.writeFile(path, base64, 'base64');
    await sharePdfFile({
        path,
        title: `Remisión / contrato pedido #${safeId}`
    });
    return { status: true, path };
}
