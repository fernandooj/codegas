const Responses = require('./responses');
const fileType = require('file-type');
const { v4: uuidv4 } = require('uuid');
const AWS = require('aws-sdk');

const s3 = new AWS.S3();

const allowedMimes = ['image/jpeg', 'image/png', 'image/jpg'];

const uploadImage = async body => {
    try {

        if (!body.image || !body.mime) {
            Responses._200({ message: 'incorrect body on request' });
        }

        if (!allowedMimes.includes(body.mime)) {
            Responses._200({ message: 'mime is not allowed ' });
        }

        const imageData = body.image.replace(/^data:image\/\w+;base64,/, '');
        if (body.image.substr(0, 7) === 'base64,') {
            imageData = body.image.substr(7, body.image.length);
        }

        const buffer = new Buffer.from(imageData, 'base64');
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
            Bucket: process.env.BUCKET,
            ACL: 'public-read',
        })
        .promise();
        
        const url = `https://${process.env.BUCKET}.s3.amazonaws.com/${key}`;
        return url;

    } catch (error) {
        console.log('error', error);

        return { message: error.message || 'failed to upload image' };
    }
};

module.exports = {uploadImage}