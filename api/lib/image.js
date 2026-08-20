const Responses = require('./responses');
const fileType = require('file-type');
const { v4: uuidv4 } = require('uuid');
const AWS = require('aws-sdk');

const s3 = new AWS.S3();

const allowedMimes = ['image/jpeg', 'image/png', 'image/jpg'];
const { BUCKET } = process.env;

function parseS3Url(urlOrData) {
    if (!urlOrData || typeof urlOrData !== 'string') return null;
    const s = urlOrData.trim();
    if (!s || s.startsWith('data:')) return null;
    try {
        const u = new URL(s);
        const path = decodeURIComponent(u.pathname.replace(/^\//, ''));
        const host = u.hostname || '';
        const virtual = host.match(/^(.+)\.s3(?:[.-][a-z0-9-]+)?\.amazonaws\.com$/i);
        if (virtual) {
            return { bucket: virtual[1], key: path };
        }
        if (host === 's3.amazonaws.com' || host.startsWith('s3.')) {
            const parts = path.split('/');
            return { bucket: parts[0], key: parts.slice(1).join('/') };
        }
        return { bucket: BUCKET, key: path };
    } catch {
        return { bucket: BUCKET, key: s.replace(/^\//, '') };
    }
}
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

/**
 * URL temporal para mostrar imágenes de un bucket privado (app, PDF download).
 */
const signS3Url = (urlOrData, expires = 3600) => {
    if (!urlOrData || typeof urlOrData !== 'string') return '';
    const s = urlOrData.trim();
    if (!s) return '';
    if (s.startsWith('data:')) return s;
    const parsed = parseS3Url(s);
    if (!parsed?.bucket || !parsed?.key) return '';
    return s3.getSignedUrl('getObject', {
        Bucket: parsed.bucket,
        Key: parsed.key,
        Expires: expires
    });
};

/**
 * Convierte una URL de S3 (o data URI) a data URI para incrustar en PDF.
 * El bucket es privado: no se puede usar fetch HTTP; hay que usar getObject.
 */
const resolveImageToDataUri = async (urlOrData) => {
    if (!urlOrData || typeof urlOrData !== 'string') return '';
    const s = urlOrData.trim();
    if (!s) return '';
    if (s.startsWith('data:')) return s;

    const parsed = parseS3Url(s);
    if (!parsed?.bucket || !parsed?.key) {
        console.warn('resolveImageToDataUri: no se pudo parsear', s);
        return '';
    }

    try {
        const obj = await s3.getObject({ Bucket: parsed.bucket, Key: parsed.key }).promise();
        const buf = Buffer.isBuffer(obj.Body) ? obj.Body : Buffer.from(obj.Body);
        const mime = obj.ContentType && String(obj.ContentType).startsWith('image/')
            ? obj.ContentType
            : 'image/png';
        return `data:${mime};base64,${buf.toString('base64')}`;
    } catch (error) {
        console.warn('resolveImageToDataUri falló:', parsed, error.message);
        return '';
    }
};

module.exports = { uploadImage, resolveImageToDataUri, signS3Url }