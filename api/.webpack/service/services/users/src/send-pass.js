/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 2496:
/***/ ((module) => {

"use strict";
module.exports = require("aws-sdk");

/***/ }),

/***/ 9104:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const AWS = __webpack_require__(2496);
const ses = new AWS.SES();

 
const SOURCE = 'app@codegascolombia.com';

/** update user info
 *  save user in the table
 * @param {string} email - email
 
 * @returns {response} Response contains the data
 */
module.exports.main = async (event) => {
  const body = JSON.parse(event.body);
 
  const {
    email,
    pass
  } = body;

  const params = {
    Destination: {
      ToAddresses: [email],
    },
    Message: {
      Body: {
        Html: {
          Data: `tu nueva contraseña es:<br/><br/> ${pass}`,
        },
      },
      Subject: {
        Data: 'Contraseña actualizada',
      },
    },
    Source: SOURCE,
  };
  
  try {
    await ses.sendEmail(params).promise();  
    return true
  } catch (error) {
    console.error(error);
  }
}

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module used 'module' so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__(9104);
/******/ 	module.exports = __webpack_exports__;
/******/ 	
/******/ })()
;