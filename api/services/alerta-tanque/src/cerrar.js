const { poolConection } = require('../../../lib/connection-pg.js');
const DatabaseError = require('../../../lib/errors/database-error');
const { uploadImage } = require('../../../lib/image');

const CERRAR_ALERTA_TANQUE = 'SELECT * FROM cerrar_alerta_tanque($1, $2, $3, $4)';

module.exports.main = async (event) => {
  const { idTanque, } = event.pathParameters;
  const body = JSON.parse(event.body);
  const { images, cerradoText, usuarioCierra } = body;

  try {
    const client = await poolConection.connect();
    const uploadedUrls = [];

    for (const image of images) {
 
      const imageUrl = await uploadImage(image);
      uploadedUrls.push(imageUrl);
    }

    await client.query(CERRAR_ALERTA_TANQUE, [idTanque, cerradoText, usuarioCierra, uploadedUrls]);

    return {
      status: true,
    };
  } catch (error) {
    console.error(error);
    throw new DatabaseError(error);
  }
};

 