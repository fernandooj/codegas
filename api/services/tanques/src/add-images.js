const { poolConection } = require('../../../lib/connection-pg.js');
const DatabaseError = require('../../../lib/errors/database-error');
const { uploadImage } = require('../../../lib/image');

const ADD_IMAGES_TANQUE = 'SELECT * FROM add_images_tanque($1, $2, $3)';

module.exports.main = async (event) => {
  const { idTanque, type } = event.pathParameters;
  const body = JSON.parse(event.body);
  const { images } = body;

  try {
    const client = await poolConection.connect();
    const uploadedUrls = [];

    for (const image of images) {
 
      const imageUrl = await uploadImage(image);
      uploadedUrls.push(imageUrl);
    }

    await client.query(ADD_IMAGES_TANQUE, [idTanque, type, uploadedUrls]);

    return {
      status: true,
    };
  } catch (error) {
    console.error(error);
    throw new DatabaseError(error);
  }
};

  
  //   const {
  //     placa,
  //     placaMantenimiento,
  //     placaFabricante,
  //     dossier,
  //     cerFabricante,
  //     cerOnac,
  //     visual
  //   } = body;