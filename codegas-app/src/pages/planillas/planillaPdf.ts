import { Platform, Share, Image } from 'react-native';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import RNFS from 'react-native-fs';
import type { Planilla, PedidoConductor } from './types';

const MARGIN = 28;
const FOOTER_RESERVE = 28;
/** Bordes estilo formulario impreso */
const BORDER: [number, number, number] = [0, 0, 0];
const PLACEHOLDER_GRAY: [number, number, number] = [150, 150, 150];
const FORM_CODE = 'F-DGR-001';
const FORM_VERSION = '10';
const FORM_FECHA_DOC = '01-09-2024';
const NIT = '830.130.648-0';
const REMISION_BODY_ROWS = 11;
const GASTO_BODY_ROWS = 5;

// eslint-disable-next-line @typescript-eslint/no-require-imports
const LOGO_MODULE = require('../../assets/img/pg1/fondo1.jpg');

export type PlanillaPdfOpciones = {
    /** Pedidos del conductor para llenar remisiones de recaudo (hasta 22 líneas en grilla 2×11). */
    pedidos?: PedidoConductor[];
};

function txt(v: string | number | undefined | null): string {
    if (v === undefined || v === null || v === '') return '';
    return String(v);
}

function fmtNum(v: number | undefined | null): string {
    if (v === undefined || v === null || Number.isNaN(v)) return '';
    return String(v);
}

function fmtFecha(raw: string | Date | undefined): string {
    if (!raw) return '';
    try {
        const d = typeof raw === 'string' ? new Date(raw) : raw;
        if (isNaN(d.getTime())) return '';
        const dia = d.getDate().toString().padStart(2, '0');
        const mes = (d.getMonth() + 1).toString().padStart(2, '0');
        const año = d.getFullYear();
        return `${dia}/${mes}/${año}`;
    } catch {
        return '';
    }
}

function fmtMoney(n: number): string {
    return `$${Number(n).toLocaleString('es-CO')}`;
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
            if (typeof globalThis.btoa === 'function') {
                return globalThis.btoa(binary);
            }
            return null;
        }

        const path = uri.replace(/^file:\/\//, '');
        return await RNFS.readFile(path, 'base64');
    } catch {
        return null;
    }
}

type DocWithAutoTable = jsPDF & { lastAutoTable?: { finalY: number } };

function tableLineStyle(): Record<string, unknown> {
    return {
        lineColor: BORDER,
        lineWidth: 0.35
    };
}

function pedidosFiltradosPorFechaPlanilla(planilla: Planilla, pedidos: PedidoConductor[]): PedidoConductor[] {
    if (!pedidos?.length) return [];
    const fp = planilla.fecha || planilla.creado;
    if (!fp) return pedidos;
    try {
        const d0 = new Date(fp).toDateString();
        const filtrados = pedidos.filter((p) => {
            if (!p.fechaEntregado) return true;
            return new Date(p.fechaEntregado).toDateString() === d0;
        });
        return filtrados.length ? filtrados : pedidos;
    } catch {
        return pedidos;
    }
}

function buildRemisionesGrid(pedidos: PedidoConductor[]): {
    rows: string[][];
    totalRecaudo: number;
    countRemisiones: number;
} {
    const pairs: { rem: string; val: string; valorNum: number }[] = [];
    for (const p of pedidos) {
        const valNum = Number(p.valor_total);
        const valorOk = !Number.isNaN(valNum) ? valNum : 0;
        const hasRem = txt(p.remision) !== '';
        pairs.push({
            rem: hasRem ? String(p.remision) : '#R.M.',
            val:
                p.valor_total != null && String(p.valor_total).trim() !== ''
                    ? fmtMoney(valorOk)
                    : '$',
            valorNum: valorOk
        });
    }
    const totalRecaudo = pairs.reduce((s, x) => s + x.valorNum, 0);
    const countRemisiones = pedidos.filter((p) => txt(p.remision) !== '').length;

    const rows: string[][] = [];
    for (let r = 0; r < REMISION_BODY_ROWS; r++) {
        const i = r * 2;
        const a = pairs[i];
        const b = pairs[i + 1];
        const ph = (side: (typeof pairs)[0] | undefined) => {
            if (!side) return { rem: '#R.M.', val: '$' };
            return { rem: side.rem, val: side.val };
        };
        const A = ph(a);
        const B = ph(b);
        rows.push([A.rem, A.val, B.rem, B.val]);
    }
    return { rows, totalRecaudo, countRemisiones };
}

function drawFooters(doc: jsPDF, generado: string): void {
    const n = doc.getNumberOfPages();
    const pageW = doc.internal.pageSize.getWidth();
    const pageH = doc.internal.pageSize.getHeight();
    for (let i = 1; i <= n; i++) {
        doc.setPage(i);
        const yLine = pageH - 18;
        doc.setDrawColor(180, 180, 180);
        doc.setLineWidth(0.3);
        doc.line(MARGIN, yLine, pageW - MARGIN, yLine);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(6);
        doc.setTextColor(100, 100, 100);
        doc.text(`Codegas · Generado ${generado} · Pág. ${i}/${n}`, MARGIN, yLine + 9);
        doc.setTextColor(0, 0, 0);
    }
}

/**
 * PDF estilo formulario PLANILLA DIARIA (calidad Codegas).
 */
export async function sharePlanillaAsPdf(planilla: Planilla, opciones?: PlanillaPdfOpciones): Promise<void> {
    const logoB64 = await loadLogoBase64();
    const doc = new jsPDF({ unit: 'pt', format: 'a4', orientation: 'portrait' });
    const pageW = doc.internal.pageSize.getWidth();

    const pedidosUsar = pedidosFiltradosPorFechaPlanilla(planilla, opciones?.pedidos || []);
    const { rows: remisionesRows, totalRecaudo, countRemisiones } = buildRemisionesGrid(pedidosUsar);

    const ruta = txt(planilla.ruta) || '—';
    const guia = txt(planilla.guia) || '—';
    const noPlan = fmtNum(planilla.no_planilla as number | undefined) || '—';
    const placa = txt(planilla.placa_vehiculo) || '—';
    const fecha = fmtFecha(planilla.fecha || planilla.creado) || '—';
    const kmI = fmtNum(planilla.kilometraje_inicial) || '—';
    const kmF = fmtNum(planilla.kilometraje_final) || '—';
    const remI = txt(planilla.remision_inicial) || '—';
    const remF = txt(planilla.remision_final) || '—';
    const conductor = txt(planilla.usuario_nombre) || '—';

    let y = MARGIN;

    /* ——— Cabecera tipo formulario (3 zonas) ——— */
    autoTable(doc, {
        startY: y,
        margin: { left: MARGIN, right: MARGIN, bottom: FOOTER_RESERVE },
        tableWidth: pageW - 2 * MARGIN,
        theme: 'grid',
        styles: {
            fontSize: 8,
            cellPadding: 5,
            ...tableLineStyle(),
            valign: 'middle' as const
        },
        columnStyles: {
            0: { cellWidth: (pageW - 2 * MARGIN) * 0.38 },
            1: { cellWidth: (pageW - 2 * MARGIN) * 0.34 },
            2: { cellWidth: (pageW - 2 * MARGIN) * 0.28 }
        },
        body: [
            [
                {
                    content: ' ',
                    styles: { minCellHeight: 68, valign: 'top' as const }
                },
                {
                    content: 'PLANILLA DIARIA\n\nSISTEMA GESTIÓN DE LA CALIDAD',
                    styles: {
                        halign: 'center' as const,
                        fontStyle: 'bold',
                        fontSize: 10,
                        valign: 'middle' as const
                    }
                },
                {
                    content: [
                        `CÓDIGO: ${FORM_CODE}`,
                        `VERSIÓN: ${FORM_VERSION}`,
                        `FECHA: ${FORM_FECHA_DOC}`
                    ].join('\n'),
                    styles: { halign: 'left' as const, fontSize: 8, valign: 'middle' as const }
                }
            ]
        ],
        didDrawCell: (data) => {
            if (data.section === 'body' && data.row.index === 0 && data.column.index === 0) {
                const { x, y: cy } = data.cell;
                if (logoB64) {
                    try {
                        doc.addImage(`data:image/jpeg;base64,${logoB64}`, 'JPEG', x + 4, cy + 4, 52, 22);
                    } catch {
                        /* ignore */
                    }
                }
                doc.setFont('helvetica', 'bold');
                doc.setFontSize(9);
                doc.setTextColor(0, 37, 135);
                doc.text('CODEGAS', x + 4, cy + 34);
                doc.setFont('helvetica', 'normal');
                doc.setFontSize(7);
                doc.setTextColor(40, 40, 40);
                doc.text('EL GAS QUE NO TE FALLA', x + 4, cy + 44);
                doc.text(`Nit: ${NIT}`, x + 4, cy + 54);
                doc.setTextColor(0, 0, 0);
            }
        }
    });

    y = ((doc as DocWithAutoTable).lastAutoTable?.finalY ?? y) + 2;

    /* ——— Datos generales ——— */
    autoTable(doc, {
        startY: y,
        margin: { left: MARGIN, right: MARGIN, bottom: FOOTER_RESERVE },
        tableWidth: pageW - 2 * MARGIN,
        theme: 'grid',
        styles: { fontSize: 8, cellPadding: 4, ...tableLineStyle() },
        columnStyles: {
            0: { cellWidth: (pageW - 2 * MARGIN) / 3 },
            1: { cellWidth: (pageW - 2 * MARGIN) / 3 },
            2: { cellWidth: (pageW - 2 * MARGIN) / 3 }
        },
        body: [
            [`Ruta: ${ruta}`, `Guía: ${guia}`, `No. ${noPlan}`],
            [`Placa Vehículo: ${placa}`, `Fecha: ${fecha}`, ''],
            [`Kilometraje inicial: ${kmI}`, `Kilometraje Final: ${kmF}`, ''],
            [`Remisión inicial: ${remI}`, `Remisión Final: ${remF}`, '']
        ]
    });
    y = ((doc as DocWithAutoTable).lastAutoTable?.finalY ?? y) + 8;

    /* ——— Remisiones de recaudo ——— */
    const remisionBodyCells = remisionesRows.map((row) =>
        row.map((cell, idx) => {
            const display = cell === '' ? (idx % 2 === 0 ? '#R.M.' : '$') : cell;
            const isPlaceholder = (idx === 0 || idx === 2) && (display === '#R.M.' || display === '');
            const isMoneyPh = (idx === 1 || idx === 3) && (display === '$' || display === '');
            return {
                content: display,
                styles: {
                    textColor: isPlaceholder || isMoneyPh ? PLACEHOLDER_GRAY : [0, 0, 0],
                    fontStyle: isPlaceholder || isMoneyPh ? 'italic' : 'normal',
                    halign: 'center' as const
                }
            };
        })
    );

    autoTable(doc, {
        startY: y,
        margin: { left: MARGIN, right: MARGIN, bottom: FOOTER_RESERVE },
        tableWidth: pageW - 2 * MARGIN,
        theme: 'grid',
        styles: { fontSize: 8, cellPadding: 3, ...tableLineStyle() },
        body: [
            [
                {
                    content: 'Remisiones de Recaudo',
                    colSpan: 4,
                    styles: {
                        halign: 'center' as const,
                        fontStyle: 'bold',
                        fillColor: [230, 230, 230] as [number, number, number]
                    }
                }
            ],
            [
                {
                    content: 'No. Remisión',
                    styles: { fontStyle: 'bold', halign: 'center' as const, fillColor: [240, 240, 240] as [number, number, number] }
                },
                {
                    content: 'Valor',
                    styles: { fontStyle: 'bold', halign: 'center' as const, fillColor: [240, 240, 240] as [number, number, number] }
                },
                {
                    content: 'No. Remisión',
                    styles: { fontStyle: 'bold', halign: 'center' as const, fillColor: [240, 240, 240] as [number, number, number] }
                },
                {
                    content: 'Valor',
                    styles: { fontStyle: 'bold', halign: 'center' as const, fillColor: [240, 240, 240] as [number, number, number] }
                }
            ],
            ...remisionBodyCells
        ] as unknown as string[][]
    });
    y = ((doc as DocWithAutoTable).lastAutoTable?.finalY ?? y) + 2;

    autoTable(doc, {
        startY: y,
        margin: { left: MARGIN, right: MARGIN, bottom: FOOTER_RESERVE },
        tableWidth: pageW - 2 * MARGIN,
        theme: 'grid',
        styles: { fontSize: 8, cellPadding: 4, ...tableLineStyle() },
        columnStyles: {
            0: { cellWidth: (pageW - 2 * MARGIN) * 0.5 },
            1: { cellWidth: (pageW - 2 * MARGIN) * 0.5 }
        },
        body: [
            [
                `Total Recaudo: ${fmtMoney(totalRecaudo)}`,
                `Total # Remisiones: ${countRemisiones || '—'}`
            ]
        ]
    });
    y = ((doc as DocWithAutoTable).lastAutoTable?.finalY ?? y) + 10;

    /* ——— Relación de gastos ——— */
    const gastos = planilla.gastos || [];
    const totalGastos = gastos.reduce((s, g) => s + (g.valor || 0), 0);
    const gastoRows: { content: string; styles?: Record<string, unknown> }[][] = [];
    for (let i = 0; i < GASTO_BODY_ROWS; i++) {
        const g = gastos[i];
        if (g) {
            gastoRows.push([
                { content: g.concepto },
                { content: fmtMoney(g.valor || 0), styles: { halign: 'right' as const } },
                { content: '—', styles: { textColor: PLACEHOLDER_GRAY } }
            ]);
        } else {
            gastoRows.push([
                { content: '' },
                { content: '$', styles: { textColor: PLACEHOLDER_GRAY, halign: 'right' as const, fontStyle: 'italic' } },
                { content: '', styles: { textColor: PLACEHOLDER_GRAY } }
            ]);
        }
    }

    autoTable(doc, {
        startY: y,
        margin: { left: MARGIN, right: MARGIN, bottom: FOOTER_RESERVE },
        tableWidth: pageW - 2 * MARGIN,
        theme: 'grid',
        styles: { fontSize: 8, cellPadding: 3, ...tableLineStyle() },
        body: [
            [
                {
                    content: 'Relación de Gastos',
                    colSpan: 3,
                    styles: {
                        halign: 'center' as const,
                        fontStyle: 'bold',
                        fillColor: [230, 230, 230] as [number, number, number]
                    }
                }
            ],
            [
                { content: 'Concepto:', styles: { fontStyle: 'bold' } },
                { content: 'Valor:', styles: { fontStyle: 'bold', halign: 'center' as const } },
                { content: 'CE/CC:', styles: { fontStyle: 'bold', halign: 'center' as const } }
            ],
            ...gastoRows
        ] as unknown as string[][]
    });
    y = ((doc as DocWithAutoTable).lastAutoTable?.finalY ?? y) + 2;

    autoTable(doc, {
        startY: y,
        margin: { left: MARGIN, right: MARGIN, bottom: FOOTER_RESERVE },
        tableWidth: pageW - 2 * MARGIN,
        theme: 'grid',
        styles: { fontSize: 8, cellPadding: 4, ...tableLineStyle() },
        columnStyles: {
            0: { cellWidth: (pageW - 2 * MARGIN) * 0.5 },
            1: { cellWidth: (pageW - 2 * MARGIN) * 0.5 }
        },
        body: [
            [`Total Gastos $: ${fmtMoney(totalGastos)}`, 'Valor Entregado $: —']
        ]
    });
    y = ((doc as DocWithAutoTable).lastAutoTable?.finalY ?? y) + 10;

    /* ——— Inventario / ACPM ——— */
    const invIp = fmtNum(planilla.inventario_inicial_porcentaje);
    const invFp = fmtNum(planilla.inventario_final_porcentaje);
    const invIkl = fmtNum(planilla.inventario_inicial_kl);
    const invFkl = fmtNum(planilla.inventario_final_kl);

    autoTable(doc, {
        startY: y,
        margin: { left: MARGIN, right: MARGIN, bottom: FOOTER_RESERVE },
        tableWidth: pageW - 2 * MARGIN,
        theme: 'grid',
        styles: { fontSize: 8, cellPadding: 4, ...tableLineStyle() },
        body: [
            [{ content: 'ACPM GLS', colSpan: 3, styles: { fontStyle: 'bold' } }],
            [
                `Inventario Inicial %: ${invIp || '—'}`,
                `Inventario Final %: ${invFp || '—'}`,
                `Total Ventas KLS: —`
            ],
            [`Inventario Inicial KL: ${invIkl || '—'}`, `Inventario Final KL: ${invFkl || '—'}`, '']
        ],
        columnStyles: {
            0: { cellWidth: (pageW - 2 * MARGIN) / 3 },
            1: { cellWidth: (pageW - 2 * MARGIN) / 3 },
            2: { cellWidth: (pageW - 2 * MARGIN) / 3 }
        }
    });
    y = ((doc as DocWithAutoTable).lastAutoTable?.finalY ?? y) + 10;

    /* ——— Novedades ——— */
    const nov = txt(planilla.novedades);
    autoTable(doc, {
        startY: y,
        margin: { left: MARGIN, right: MARGIN, bottom: FOOTER_RESERVE },
        tableWidth: pageW - 2 * MARGIN,
        theme: 'grid',
        styles: { fontSize: 8, cellPadding: 4, ...tableLineStyle(), minCellHeight: 14 },
        body: [
            [{ content: 'Novedades:', styles: { fontStyle: 'bold' } }],
            [{ content: nov || ' ', styles: { minCellHeight: nov ? 36 : 14 } }],
            [{ content: ' ', styles: { minCellHeight: 14 } }],
            [{ content: ' ', styles: { minCellHeight: 14 } }],
            [{ content: ' ', styles: { minCellHeight: 14 } }]
        ]
    });
    y = ((doc as DocWithAutoTable).lastAutoTable?.finalY ?? y) + 14;

    /* ——— Firmas ——— */
    autoTable(doc, {
        startY: y,
        margin: { left: MARGIN, right: MARGIN, bottom: FOOTER_RESERVE },
        tableWidth: pageW - 2 * MARGIN,
        theme: 'plain',
        styles: { fontSize: 8, cellPadding: 6, lineWidth: 0, fillColor: [255, 255, 255] },
        body: [
            [
                {
                    content: '_______________________________\nNombre del Conductor:',
                    styles: { halign: 'center' as const }
                },
                {
                    content: '_______________________________\nNombre del Auxiliar:',
                    styles: { halign: 'center' as const }
                },
                {
                    content: '_______________________________\nProgramado por:',
                    styles: { halign: 'center' as const }
                }
            ],
            [
                {
                    content: conductor,
                    styles: { halign: 'center' as const, fontStyle: 'normal', fontSize: 7, textColor: [60, 60, 60] }
                },
                { content: '', styles: { halign: 'center' as const } },
                { content: '', styles: { halign: 'center' as const } }
            ]
        ],
        columnStyles: {
            0: { cellWidth: (pageW - 2 * MARGIN) / 3 },
            1: { cellWidth: (pageW - 2 * MARGIN) / 3 },
            2: { cellWidth: (pageW - 2 * MARGIN) / 3 }
        }
    });

    const generadoStr = new Date().toLocaleString('es-CO', {
        dateStyle: 'short',
        timeStyle: 'short'
    });
    drawFooters(doc, generadoStr);

    const dataUri = doc.output('datauristring') as string;
    const i = dataUri.indexOf(',');
    const base64 = i >= 0 ? dataUri.slice(i + 1) : dataUri;

    const baseName = `Planilla_${planilla.no_planilla ?? planilla._id}`.replace(/[^a-zA-Z0-9_-]/g, '_');
    const path = `${RNFS.DocumentDirectoryPath}/${baseName}.pdf`;
    await RNFS.writeFile(path, base64, 'base64');

    const url = Platform.OS === 'android' ? `file://${path}` : path;
    await Share.share({
        title: `Planilla ${planilla.no_planilla ?? ''}`,
        message: `Planilla ${planilla.no_planilla ?? planilla._id}`,
        url
    });
}
