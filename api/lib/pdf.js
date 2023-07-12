const Responses = require('./responses');
const fileType = require('file-type');
const { v4: uuidv4 } = require('uuid');
const AWS = require('aws-sdk');

const s3 = new AWS.S3();

const allowedMimes = ['application/pdf'];
const { BUCKET_PDF } = process.env;

const uploadPDF = async body => {
  try {
    if (!body.imagen || !body.mime) {
      Responses._200({ message: 'incorrect body on request' });
    }

    if (!allowedMimes.includes(body.mime)) {
      Responses._200({ message: 'mime is not allowed ' });
    }

    const pdfData = body.imagen.replace(/^data:application\/\w+;base64,/, '');
    if (body.imagen.substr(0, 7) === 'base64,') {
      pdfData = body.imagen.substr(7, body.imagen.length);
    }

    const buffer = new Buffer.from(pdfData, 'base64');
    const fileInfo = await fileType.fromBuffer(buffer);

    const detectedExt = fileInfo.ext;
    const detectedMime = fileInfo.mime;

    if (detectedMime !== body.mime) {
      Responses._200({ message: 'mime types dont match' });
    }

    const name = uuidv4();
    const key = `${name}.${detectedExt}`;

    await s3
      .putObject({
        Body: buffer,
        Key: key,
        ContentType: body.mime,
        Bucket: BUCKET_PDF,
        ACL: 'public-read',
      })
      .promise();

    const url = `https://${BUCKET_PDF}.s3.amazonaws.com/${key}`;
    return url;
  } catch (error) {
    console.log('error', error);
    return { message: error.message || 'failed to upload PDF' };
  }
};

module.exports = { uploadPDF };
