import { Image } from 'react-native';
import { sharePdfFile } from '../../utils/sharePdfFile';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import RNFS from 'react-native-fs';
import { safetyChecklistQuestions } from '../../utils/constants';

const MARGIN = 24;
const FOOTER_H = 22;
const BORDER: [number, number, number] = [0, 0, 0];
const BRAND: [number, number, number] = [0, 37, 135];
const FORM_CODE = 'F-DGR-002';
const FORM_VERSION = '06';
const FORM_FECHA_DOC = '24/07/2023';
const NIT = '830.130.648-0';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const LOGO_MODULE = require('../../assets/img/pg1/fondo1.jpg');

export type SafetyChecklistPdfMeta = {
    cliente?: string;
    codt?: string;
    direccion?: string;
    telefono?: string;
    /** Fecha operación (se parte en D / M / A si se pasan vacíos los tres) */
    fecha?: string;
    presionInicial?: string;
    presionFinal?: string;
    planillaDiariaNo?: string;
    placaVehiculo?: string;
    noRemision?: string;
    capTanque?: string;
    noPedido?: string;
    noTanque?: string;
    pctInicial?: string;
    pctFinal?: string;
    conductorNombre?: string;
    pedidoId?: string;
};

function t(v: string | number | undefined | null): string {
    if (v === undefined || v === null || v === '') return '';
    return String(v);
}

function splitFecha(fecha?: string): { d: string; m: string; a: string } {
    if (!fecha) return { d: '', m: '', a: '' };
    try {
        const d = new Date(fecha);
        if (isNaN(d.getTime())) return { d: '', m: '', a: '' };
        return {
            d: d.getDate().toString().padStart(2, '0'),
            m: (d.getMonth() + 1).toString().padStart(2, '0'),
            a: String(d.getFullYear())
        };
    } catch {
        return { d: '', m: '', a: '' };
    }
}

async function loadLogoBase64(): Promise<string | null> {
    try {
        const resolved = Image.resolveAssetSource(LOGO_MODULE);
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

type DocWithAutoTable = jsPDF & { lastAutoTable?: { finalY: number } };

const TEXTO_IMPORTANTE =
    'IMPORTANTE: El conductor y el cliente o usuario autorizado deben velar por el cumplimiento de las condiciones de seguridad. ' +
    'Ante cualquier situación de riesgo, la operación podrá ser suspendida.';

function drawFooter(doc: jsPDF, page: number, total: number, generado: string): void {
    const pageW = doc.internal.pageSize.getWidth();
    const pageH = doc.internal.pageSize.getHeight();
    doc.setFontSize(6);
    doc.setTextColor(90, 90, 90);
    doc.text(`Codegas · ${generado} · ${page}/${total}`, MARGIN, pageH - 10);
    doc.setTextColor(0, 0, 0);
}

/**
 * PDF lista de chequeo (pág. 1 formato calidad) + observaciones (pág. 2).
 */
export async function shareSafetyChecklistPdf(
    checklist: { pregunta: string; respuesta: string }[],
    observacion: string,
    meta: SafetyChecklistPdfMeta
): Promise<void> {
    const logoB64 = await loadLogoBase64();
    const doc = new jsPDF({ unit: 'pt', format: 'a4', orientation: 'portrait' });
    const pageW = doc.internal.pageSize.getWidth();
    const innerW = pageW - 2 * MARGIN;

    const { d, m, a } = splitFecha(meta.fecha);

    const respByPregunta = new Map<string, string>();
    (checklist || []).forEach((c) => respByPregunta.set(c.pregunta, c.respuesta));

    const checklistRows = safetyChecklistQuestions.map((q) => {
        const r = respByPregunta.get(q.question);
        const esSi = r === 'Sí' || r === 'Si' || r === 'SI';
        const esNo = r === 'No' || r === 'NO';
        return [
            {
                content: q.question,
                styles: { fontSize: 7, valign: 'middle' as const }
            },
            {
                content: esSi ? 'X' : '',
                styles: { halign: 'center' as const, fontStyle: 'bold', fontSize: 9 }
            },
            {
                content: esNo ? 'X' : '',
                styles: { halign: 'center' as const, fontStyle: 'bold', fontSize: 9 }
            },
            { content: '', styles: { fontSize: 7 } }
        ];
    });

    let y = MARGIN;

    /* Cabecera 3 columnas */
    autoTable(doc, {
        startY: y,
        margin: { left: MARGIN, right: MARGIN, bottom: FOOTER_H },
        tableWidth: innerW,
        theme: 'grid',
        styles: {
            fontSize: 8,
            cellPadding: 4,
            lineColor: BORDER,
            lineWidth: 0.35
        },
        columnStyles: {
            0: { cellWidth: innerW * 0.34 },
            1: { cellWidth: innerW * 0.42 },
            2: { cellWidth: innerW * 0.24 }
        },
        body: [
            [
                { content: ' ', styles: { minCellHeight: 64, valign: 'top' as const } },
                {
                    content:
                        'LISTA DE CHEQUEO / ANTES, DURANTE Y DESPUÉS DEL SUMINISTRO DE GLP',
                    styles: {
                        fontStyle: 'bold',
                        fontSize: 8,
                        halign: 'center' as const,
                        valign: 'middle' as const
                    }
                },
                {
                    content: `Código: ${FORM_CODE}\nVersión: ${FORM_VERSION}\nFecha: ${FORM_FECHA_DOC}`,
                    styles: { fontSize: 7, valign: 'middle' as const }
                }
            ]
        ],
        didDrawCell: (data) => {
            if (data.section === 'body' && data.row.index === 0 && data.column.index === 0) {
                const { x, y: cy } = data.cell;
                if (logoB64) {
                    try {
                        doc.addImage(`data:image/jpeg;base64,${logoB64}`, 'JPEG', x + 3, cy + 3, 48, 20);
                    } catch {
                        /* ignore */
                    }
                }
                doc.setFont('helvetica', 'bold');
                doc.setFontSize(8);
                doc.setTextColor(...BRAND);
                doc.text('CODEGAS', x + 3, cy + 30);
                doc.setFont('helvetica', 'normal');
                doc.setFontSize(6);
                doc.setTextColor(50, 50, 50);
                doc.text('EL GAS QUE NO TE FALLA', x + 3, cy + 40);
                doc.text(`Nit: ${NIT}`, x + 3, cy + 50);
                doc.setTextColor(0, 0, 0);
            }
        }
    });

    y = ((doc as DocWithAutoTable).lastAutoTable?.finalY ?? y) + 2;

    /* Datos generales */
    autoTable(doc, {
        startY: y,
        margin: { left: MARGIN, right: MARGIN, bottom: FOOTER_H },
        tableWidth: innerW,
        theme: 'grid',
        styles: { fontSize: 7, cellPadding: 3, lineColor: BORDER, lineWidth: 0.35 },
        body: [
            [
                `Cliente: ${t(meta.cliente)}`,
                `Codt: ${t(meta.codt)}`,
                `Dirección: ${t(meta.direccion)}`,
                `Fecha  D: ${d || '  '}  M: ${m || '  '}  A: ${a || '    '}`
            ],
            [
                `Tel: ${t(meta.telefono)}`,
                `Presión Inicial: ${t(meta.presionInicial)}`,
                `Presión Final: ${t(meta.presionFinal)}`,
                `Planilla Diaria No.: ${t(meta.planillaDiariaNo)}`
            ],
            [
                `Placa Vehículo: ${t(meta.placaVehiculo)}`,
                `No. Remisión: ${t(meta.noRemision)}`,
                `Cap. Tanque: ${t(meta.capTanque)}`,
                `No. Pedido: ${t(meta.noPedido)}`
            ],
            [
                `No. Tanque: ${t(meta.noTanque)}`,
                `% Inicial: ${t(meta.pctInicial)}`,
                `% Final: ${t(meta.pctFinal)}`,
                meta.pedidoId ? `Ref. pedido: ${t(meta.pedidoId)}` : ''
            ]
        ],
        columnStyles: {
            0: { cellWidth: innerW * 0.28 },
            1: { cellWidth: innerW * 0.24 },
            2: { cellWidth: innerW * 0.28 },
            3: { cellWidth: innerW * 0.2 }
        }
    });

    y = ((doc as DocWithAutoTable).lastAutoTable?.finalY ?? y) + 2;

    autoTable(doc, {
        startY: y,
        margin: { left: MARGIN, right: MARGIN, bottom: FOOTER_H },
        tableWidth: innerW,
        theme: 'grid',
        styles: { fontSize: 7, cellPadding: 5, lineColor: BORDER, lineWidth: 0.35 },
        body: [
            [
                {
                    content: TEXTO_IMPORTANTE,
                    styles: {
                        fontStyle: 'bold',
                        fillColor: [220, 220, 220] as [number, number, number],
                        fontSize: 7
                    }
                }
            ]
        ]
    });

    y = ((doc as DocWithAutoTable).lastAutoTable?.finalY ?? y) + 4;

    autoTable(doc, {
        startY: y,
        margin: { left: MARGIN, right: MARGIN, bottom: FOOTER_H },
        tableWidth: innerW,
        theme: 'grid',
        styles: { fontSize: 7, cellPadding: 2, lineColor: BORDER, lineWidth: 0.35 },
        headStyles: {
            fillColor: [200, 200, 200] as [number, number, number],
            textColor: 0,
            fontStyle: 'bold',
            fontSize: 8,
            halign: 'center' as const
        },
        head: [['DESCRIPCIÓN', 'SI', 'NO', 'COMENTARIOS']],
        columnStyles: {
            0: { cellWidth: innerW * 0.62 },
            1: { cellWidth: innerW * 0.09, halign: 'center' as const },
            2: { cellWidth: innerW * 0.09, halign: 'center' as const },
            3: { cellWidth: innerW * 0.2 }
        },
        body: checklistRows
    });

    y = ((doc as DocWithAutoTable).lastAutoTable?.finalY ?? y) + 10;

    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    const protoTxt = doc.splitTextToSize(
        'SE CUMPLIERON LOS PASOS DEL PROTOCOLO DE SEGURIDAD ANTES, DURANTE Y DESPUÉS DEL SUMINISTRO.',
        innerW
    );
    doc.text(protoTxt, MARGIN, y);
    y += protoTxt.length * 9 + 8;

    autoTable(doc, {
        startY: y,
        margin: { left: MARGIN, right: MARGIN, bottom: FOOTER_H },
        tableWidth: innerW,
        theme: 'grid',
        styles: { fontSize: 7, lineColor: BORDER, lineWidth: 0.35, minCellHeight: 80 },
        body: [
            [
                {
                    content: 'NOMBRE CONDUCTOR Y FIRMA\n\n\nC.C. _______________________',
                    styles: {
                        halign: 'center' as const,
                        valign: 'top' as const,
                        fontStyle: 'bold'
                    }
                },
                {
                    content: 'NOMBRE CLIENTE Y FIRMA\n\n\nC.C. _______________________',
                    styles: {
                        halign: 'center' as const,
                        valign: 'top' as const,
                        fontStyle: 'bold'
                    }
                }
            ]
        ],
        columnStyles: {
            0: { cellWidth: innerW * 0.5 },
            1: { cellWidth: innerW * 0.5 }
        },
        willDrawCell: (data) => {
            if (data.section === 'body' && data.row.index === 0 && data.column.index <= 1) {
                const { cell } = data;
                doc.setTextColor(220, 220, 220);
                doc.setFont('helvetica', 'bold');
                doc.setFontSize(22);
                doc.text(
                    data.column.index === 0 ? 'REALIZADO' : 'AUTORIZADO',
                    cell.x + cell.width / 2,
                    cell.y + cell.height / 2 + 4,
                    { align: 'center' }
                );
                doc.setTextColor(0, 0, 0);
            }
        },
        didDrawCell: (data) => {
            if (data.section === 'body' && data.row.index === 0 && data.column.index === 0) {
                const nm = t(meta.conductorNombre);
                if (nm) {
                    doc.setFont('helvetica', 'normal');
                    doc.setFontSize(9);
                    doc.setTextColor(0, 0, 0);
                    doc.text(nm, data.cell.x + data.cell.width / 2, data.cell.y + 26, { align: 'center' });
                }
            }
        }
    });

    const generadoStr = new Date().toLocaleString('es-CO', {
        dateStyle: 'short',
        timeStyle: 'short'
    });
    drawFooter(doc, 1, 2, generadoStr);

    /* ——— Página 2: Observaciones ——— */
    doc.addPage();
    const y2 = MARGIN + 8;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(...BRAND);
    doc.text('Observaciones del checklist', MARGIN, y2);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(80, 80, 80);
    const sub = doc.splitTextToSize(
        'Observaciones adicionales registradas en la lista de chequeo de seguridad.',
        pageW - 2 * MARGIN
    );
    doc.text(sub, MARGIN, y2 + 18);

    const obs = (observacion || '').trim() || '— Sin observaciones —';
    const obsLines = doc.splitTextToSize(obs, pageW - 2 * MARGIN - 16);

    autoTable(doc, {
        startY: y2 + 18 + sub.length * 11 + 12,
        margin: { left: MARGIN, right: MARGIN, bottom: FOOTER_H },
        tableWidth: innerW,
        theme: 'grid',
        styles: {
            fontSize: 10,
            cellPadding: 10,
            lineColor: BORDER,
            lineWidth: 0.35,
            minCellHeight: Math.max(120, obsLines.length * 12 + 24)
        },
        body: [[{ content: obsLines.join('\n'), styles: { valign: 'top' as const } }]]
    });

    drawFooter(doc, 2, 2, generadoStr);

    const dataUri = doc.output('datauristring') as string;
    const i = dataUri.indexOf(',');
    const base64 = i >= 0 ? dataUri.slice(i + 1) : dataUri;

    const safeId = t(meta.pedidoId).replace(/[^a-zA-Z0-9_-]/g, '_') || 'checklist';
    const path = `${RNFS.DocumentDirectoryPath}/Lista_chequeo_${safeId}.pdf`;
    await RNFS.writeFile(path, base64, 'base64');

    await sharePdfFile({
        path,
        title: 'Lista de chequeo de seguridad'
    });
}
