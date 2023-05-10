/** @module database-error */

/**
 * Structures the error into a standard format
 * object to be handled by the `Lambdas`
 * @param {Object} error - error caught
 * @returns {void}
 */
module.exports = function DatabaseError(error) {
  this.errorType = error.routine || error.code;
  this.httpStatus = error.statusCode || 500;
  this.message = (error.error || error.message).replace(/["]/g, "'");
  this.stack = error.stack;
};
