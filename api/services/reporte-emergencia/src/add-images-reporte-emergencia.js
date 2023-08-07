const { poolConection } = require('../../../lib/connection-pg.js');
const DatabaseError = require('../../../lib/errors/database-error');
const { uploadImage } = require('../../../lib/image');
const { uploadPDF } = require('../../../lib/pdf');
 
const ADD_IMAGES_REPORTE_EMERGENCIA = 'SELECT * FROM add_images_reporte_emergencia($1, $2, $3)';

module.exports.main = async (event) => {
  const body = JSON.parse(event.body);
  const { images, idReporte, type, name } = body;

  try {
    const client = await poolConection.connect();
    const uploadedUrls = [];

    if(body.mime=="application/pdf"){
      const uri = await uploadPDF(body);
      uploadedUrls.push({uri, name});
    } else {
      const uri = await uploadImage(body);
      uploadedUrls.push(uri);
    }
   
    await client.query(ADD_IMAGES_REPORTE_EMERGENCIA, [uploadedUrls, type, idReporte]);

    return {
      status: true,
    };
  } catch (error) {
    console.error(error);
    throw new DatabaseError(error);
  }
};

  
 
 