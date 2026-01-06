const { poolConection } = require('../../../lib/connection-pg.js');
const DatabaseError = require('../../../lib/errors/database-error');
const { uploadImage } = require('../../../lib/image');
const { uploadPDF } = require('../../../lib/pdf');

const ADD_IMAGES_TANQUE = 'SELECT * FROM add_images_tanque($1, $2, $3)';

module.exports.main = async (event) => {
  console.log('[add-images] Event received:', {
    method: event.requestContext?.http?.method || event.httpMethod,
    path: event.requestContext?.http?.path || event.path,
    hasBody: !!event.body
  });

  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'PUT, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  };

  // Handle OPTIONS request for CORS
  if (event.requestContext?.http?.method === 'OPTIONS' || event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  let body;
  try {
    body = typeof event.body === 'string' ? JSON.parse(event.body) : (event.body || {});
  } catch (parseError) {
    console.error('[add-images] Error parsing body:', parseError);
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({
        status: false,
        message: 'Invalid JSON in request body'
      })
    };
  }

  const { idTanque, type, images } = body;

  console.log('[add-images] Parsed data:', {
    idTanque,
    type,
    imagesCount: images?.length || 0
  });

  if (!idTanque || !type || !Array.isArray(images) || images.length === 0) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({
        status: false,
        message: 'idTanque, type e images son requeridos. images debe ser un array no vacío.'
      })
    };
  }

  const client = await poolConection.connect();

  try {
    const metadataEntries = [];
    const now = new Date().toISOString();

    for (const [index, image] of images.entries()) {
      const isPdf = image.mime === 'application/pdf';
      console.log(`[add-images] Processing image ${index + 1}/${images.length}, isPdf: ${isPdf}`);

      const imageUrl = isPdf ? await uploadPDF(image) : await uploadImage(image);
      console.log(`[add-images] Image ${index + 1} uploaded to: ${imageUrl}`);

      const entry = {
        nombre: image?.name || `${type}-${index + 1}`,
        url: imageUrl,
        fecha: now
      };

      metadataEntries.push(JSON.stringify(entry));
    }

    console.log('[add-images] Calling add_images_tanque with:', {
      idTanque,
      type,
      entriesCount: metadataEntries.length
    });

    await client.query(ADD_IMAGES_TANQUE, [idTanque, type, metadataEntries]);

    console.log('[add-images] Successfully added images to tanque');

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        status: true,
        message: 'Images added successfully'
      })
    };
  } catch (error) {
    console.error('[add-images] Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        status: false,
        message: error.message || 'Error adding images to tanque',
        error: process.env.NODE_ENV === 'development' ? error.stack : undefined
      })
    };
  } finally {
    client.release();
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