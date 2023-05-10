const AWS = require('aws-sdk')
const S3 = new AWS.S3()
const {poolConection} = require('../../../lib/connection-pg.js')
const {uploadImage}   = require('../../../lib/image')

/** create user */
const SAVE_EVENT = 'SELECT * FROM save_events($1, $2, $3, $4, $5, $6, $7)';

/**
 * Inserts an event into the database.
 *
 * @param {object} event - Object containing the data of the event to insert.
 * @param {string} event.title - Title of the event.
 * @param {string} event.description - Description of the event.
 * @param {string} event.event_date - Date and time of the event in ISO 8601 format.
 * @param {string} event.image_url - URL of the event's image.
 * @param {number} event.category_id - Identifier of the event's category.
 * @param {object} event.location - Object containing the latitude and longitude of the event's location.
 * @param {number} event.location.latitude - Latitude of the event's location.
 * @param {number} event.location.longitude - Longitude of the event's location.
 * @returns {Promise<object>} - Promise that resolves with an object indicating whether the operation was successful.
 * @throws {string} - Throws a string with an error message if the operation fails.
 */

module.exports.main = async (event) => {
  const body = JSON.parse(event.body);
  const {
    title, description, event_date, category_id, place_name, location
  } = body;
  const client = await poolConection.connect();

  try {
    
    const image_url = await uploadImage(body);

    await client.query(SAVE_EVENT, [title, description, event_date, image_url, category_id, place_name, location])
    return {
        statusCode: 200,
        body: image_url
      }
  } catch (error) {
    throw JSON.stringify(error);
  }
};