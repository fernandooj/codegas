const { poolConection } = require('../../../lib/connection-pg.js');
const DatabaseError = require('../../../lib/errors/database-error');
const { uploadImage } = require('../../../lib/image');
const { uploadPDF } = require('../../../lib/pdf');

const ADD_IMAGES_REPORTE_EMERGENCIA = 'SELECT * FROM add_images_reporte_emergencia($1, $2, $3)';

module.exports.main = async (event) => {
  const body = JSON.parse(event.body);
  const { idReporte, type, name } = body;

  try {
    // Validar que los campos requeridos existen
    if (!body.imagen || !body.mime || !idReporte || !type) {
      throw new Error('Missing required fields: imagen, mime, idReporte, type');
    }

    const client = await poolConection.connect();
    const uploadedUrls = [];

    let uploadedUri = null;
    if (body.mime == "application/pdf") {
      uploadedUri = await uploadPDF(body);
      uploadedUrls.push({ uri: uploadedUri, name });
    } else {
      uploadedUri = await uploadImage(body);
      uploadedUrls.push({ uri: uploadedUri, name });
    }

    await client.query(ADD_IMAGES_REPORTE_EMERGENCIA, [uploadedUrls, type, idReporte]);

    return {
      status: true,
      url: uploadedUri // Devolver la URL para uso inmediato
    };
  } catch (error) {
    console.error(error);
    throw new DatabaseError(error);
  }
};



