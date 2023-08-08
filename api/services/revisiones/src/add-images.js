const { poolConection } = require('../../../lib/connection-pg.js');
const DatabaseError = require('../../../lib/errors/database-error');
const { uploadImage } = require('../../../lib/image');
const { uploadPDF } = require('../../../lib/pdf');

const ADD_IMAGES_REVISION = 'SELECT * FROM add_images_revisiones($1, $2, $3)';

module.exports.main = async (event) => {
  const body = JSON.parse(event.body);
  const { revisionId, type, name } = body;

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
   

    await client.query(ADD_IMAGES_REVISION, [uploadedUrls, type, revisionId]);

    return {
      status: true,
    };
  } catch (error) {
    console.error(error);
    throw new DatabaseError(error);
  }
};

  
// PDF:nComodato  ok
// 	isometrico      ok
// 	otrosComodato	  
// 	protocoloLlenado ok
// 	hojaSeguridad  	ok
// 	otrosSi ok
//     documento  
//     depTecnico
//  Imagen:
// 	soporteEntrega	
// 	puntoConsumo	  
// 	visual
// Alerta


 