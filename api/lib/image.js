const Responses = require('./responses');
const fileType = require('file-type');
const { v4: uuidv4 } = require('uuid');
const AWS = require('aws-sdk');

const s3 = new AWS.S3();

const allowedMimes = ['image/jpeg', 'image/png', 'image/jpg'];
const { BUCKET } = process.env;
const uploadImage = async body => {
    try {

        if (!body.imagen || !body.mime) {
            throw new Error('incorrect body on request');
        }

        if (!allowedMimes.includes(body.mime)) {
            throw new Error('mime is not allowed');
        }

        let imageData;
        if (body.imagen.includes('data:image')) {
            imageData = body.imagen.replace(/^data:image\/\w+;base64,/, '');
        } else if (body.imagen.startsWith('base64,')) {
            imageData = body.imagen.substr(7, body.imagen.length);
        } else {
            imageData = body.imagen;
        }

        const buffer = new Buffer.from(imageData, 'base64');
        const fileInfo = await fileType.fromBuffer(buffer);

        const detectedExt = fileInfo.ext;
        const detectedMime = fileInfo.mime;

        // Normalizar mime types: 'image/jpg' -> 'image/jpeg'
        const normalizedBodyMime = body.mime === 'image/jpg' ? 'image/jpeg' : body.mime;
        const normalizedDetectedMime = detectedMime === 'image/jpg' ? 'image/jpeg' : detectedMime;

        if (normalizedDetectedMime !== normalizedBodyMime) {
            console.error('Mime type mismatch:', {
                bodyMime: body.mime,
                normalizedBodyMime,
                detectedMime,
                normalizedDetectedMime
            });
            throw new Error(`mime types dont match: expected ${normalizedBodyMime}, got ${normalizedDetectedMime}`);
        }

        const name = uuidv4();
        const key = `${name}.${detectedExt}`;


        await s3
            .putObject({
                Body: buffer,
                Key: key,
                ContentType: body.mime,
                Bucket: BUCKET,
                // ACL está deprecado - usar políticas de bucket para acceso público
                // ACL: 'public-read',
            })
            .promise();

        const url = `https://${BUCKET}.s3.amazonaws.com/${key}`;
        return url;

    } catch (error) {
        console.log('error', error);

        return { message: error.message || 'failed to upload image' };
    }
};

module.exports = { uploadImage }