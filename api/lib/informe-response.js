const { Parser } = require('@json2csv/plainjs');
const XLSX = require('xlsx');

/**
 * Lee ?format=xlsx o ?format=csv (por defecto csv).
 */
function getExportFormat(event) {
  const q = event.queryStringParameters || {};
  const f = String(q.format || '').toLowerCase().trim();
  return f === 'xlsx' || f === 'excel' ? 'xlsx' : 'csv';
}

function toLabeledRows(fields, data) {
  return (data || []).map((row) => {
    const o = {};
    fields.forEach((f) => {
      const v = row[f.value];
      o[f.label] = v === null || v === undefined ? '' : v;
    });
    return o;
  });
}

/**
 * Respuesta HTTP para un solo informe (una hoja en Excel).
 */
function buildInformeResponse({ fields, data, format, filenameBase }) {
  const safeName = String(filenameBase || 'informe').replace(/[^\w.-]+/g, '_');

  if (format === 'xlsx') {
    const labeled = toLabeledRows(fields, data);
    const ws = XLSX.utils.json_to_sheet(labeled.length ? labeled : [{ Sin_datos: 'Sin registros' }]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Informe');
    const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="${safeName}.xlsx"`,
      },
      body: Buffer.from(buf).toString('base64'),
      isBase64Encoded: true,
    };
  }

  const parser = new Parser({ fields, withBOM: true });
  const csv = parser.parse(data || []);
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${safeName}.csv"`,
    },
    body: csv,
  };
}

/**
 * Excel con varias hojas (ej. frecuencias: pedidos + grupos).
 */
function buildMultiSheetXlsxResponse({ sheets, filenameBase }) {
  const safeName = String(filenameBase || 'informe').replace(/[^\w.-]+/g, '_');
  const wb = XLSX.utils.book_new();

  sheets.forEach(({ name, fields, data }) => {
    const sheetName = String(name || 'Hoja').substring(0, 31).replace(/[:\\/?*[\]]/g, '-');
    const labeled = toLabeledRows(fields, data);
    const ws = XLSX.utils.json_to_sheet(labeled.length ? labeled : [{ Sin_datos: 'Sin registros' }]);
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
  });

  const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="${safeName}.xlsx"`,
    },
    body: Buffer.from(buf).toString('base64'),
    isBase64Encoded: true,
  };
}

/**
 * CSV combinando dos bloques con encabezados (UTF-8 BOM al inicio).
 */
function buildTwoBlockCsv({ fieldsA, dataA, titleA, fieldsB, dataB, titleB, filenameBase }) {
  const safeName = String(filenameBase || 'informe').replace(/[^\w.-]+/g, '_');
  const parserA = new Parser({ fields: fieldsA, withBOM: true });
  const parserB = new Parser({ fields: fieldsB, withBOM: false });
  const blockA = parserA.parse(dataA || []);
  const blockB = parserB.parse(dataB || []);
  const headA = titleA ? `${titleA}\n` : '';
  const headB = titleB ? `${titleB}\n` : '';
  const csv = `${headA}${blockA}\n\n${headB}${blockB}`;
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${safeName}.csv"`,
    },
    body: csv,
  };
}

module.exports = {
  getExportFormat,
  buildInformeResponse,
  buildMultiSheetXlsxResponse,
  buildTwoBlockCsv,
};
