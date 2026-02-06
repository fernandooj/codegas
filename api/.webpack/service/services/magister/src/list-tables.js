/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 2203:
/***/ ((module) => {

"use strict";
module.exports = require("stream");

/***/ }),

/***/ 3398:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/**
 * @fileoverview Cliente HTTP para la API REST de Firebird/Magister
 */

const axios = __webpack_require__(79329);

const API_BASE_URL = process.env.MAGISTER_API_URL || 'http://181.63.224.174:65432';

/**
 * Prueba la conexión a la API
 */
const ping = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/ping`, {
            timeout: 10000
        });
        return response.data;
    } catch (error) {
        throw new Error(`Error al conectar con Magister API: ${error.message}`);
    }
};

/**
 * Ejecuta una query SQL
 * @param {string} sql - Query SQL
 * @param {Array} params - Parámetros
 */
const query = async (sql, params = []) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/query`, {
            sql,
            params
        }, {
            timeout: 30000
        });
        return response.data.data;
    } catch (error) {
        throw new Error(`Error ejecutando query: ${error.message}`);
    }
};

/**
 * Lista las tablas de la base de datos
 */
const listTables = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/tables`, {
            timeout: 10000
        });
        return response.data.data;
    } catch (error) {
        throw new Error(`Error listando tablas: ${error.message}`);
    }
};

module.exports = {
    ping,
    query,
    listTables
};




/***/ }),

/***/ 6188:
/***/ ((module) => {

"use strict";


/** @type {import('./max')} */
module.exports = Math.max;


/***/ }),

/***/ 6549:
/***/ ((module) => {

"use strict";


/** @type {import('./gOPD')} */
module.exports = Object.getOwnPropertyDescriptor;


/***/ }),

/***/ 6585:
/***/ ((module) => {

/**
 * Helpers.
 */

var s = 1000;
var m = s * 60;
var h = m * 60;
var d = h * 24;
var w = d * 7;
var y = d * 365.25;

/**
 * Parse or format the given `val`.
 *
 * Options:
 *
 *  - `long` verbose formatting [false]
 *
 * @param {String|Number} val
 * @param {Object} [options]
 * @throws {Error} throw an error if val is not a non-empty string or a number
 * @return {String|Number}
 * @api public
 */

module.exports = function (val, options) {
  options = options || {};
  var type = typeof val;
  if (type === 'string' && val.length > 0) {
    return parse(val);
  } else if (type === 'number' && isFinite(val)) {
    return options.long ? fmtLong(val) : fmtShort(val);
  }
  throw new Error(
    'val is not a non-empty string or a valid number. val=' +
      JSON.stringify(val)
  );
};

/**
 * Parse the given `str` and return milliseconds.
 *
 * @param {String} str
 * @return {Number}
 * @api private
 */

function parse(str) {
  str = String(str);
  if (str.length > 100) {
    return;
  }
  var match = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
    str
  );
  if (!match) {
    return;
  }
  var n = parseFloat(match[1]);
  var type = (match[2] || 'ms').toLowerCase();
  switch (type) {
    case 'years':
    case 'year':
    case 'yrs':
    case 'yr':
    case 'y':
      return n * y;
    case 'weeks':
    case 'week':
    case 'w':
      return n * w;
    case 'days':
    case 'day':
    case 'd':
      return n * d;
    case 'hours':
    case 'hour':
    case 'hrs':
    case 'hr':
    case 'h':
      return n * h;
    case 'minutes':
    case 'minute':
    case 'mins':
    case 'min':
    case 'm':
      return n * m;
    case 'seconds':
    case 'second':
    case 'secs':
    case 'sec':
    case 's':
      return n * s;
    case 'milliseconds':
    case 'millisecond':
    case 'msecs':
    case 'msec':
    case 'ms':
      return n;
    default:
      return undefined;
  }
}

/**
 * Short format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtShort(ms) {
  var msAbs = Math.abs(ms);
  if (msAbs >= d) {
    return Math.round(ms / d) + 'd';
  }
  if (msAbs >= h) {
    return Math.round(ms / h) + 'h';
  }
  if (msAbs >= m) {
    return Math.round(ms / m) + 'm';
  }
  if (msAbs >= s) {
    return Math.round(ms / s) + 's';
  }
  return ms + 'ms';
}

/**
 * Long format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtLong(ms) {
  var msAbs = Math.abs(ms);
  if (msAbs >= d) {
    return plural(ms, msAbs, d, 'day');
  }
  if (msAbs >= h) {
    return plural(ms, msAbs, h, 'hour');
  }
  if (msAbs >= m) {
    return plural(ms, msAbs, m, 'minute');
  }
  if (msAbs >= s) {
    return plural(ms, msAbs, s, 'second');
  }
  return ms + ' ms';
}

/**
 * Pluralization helper.
 */

function plural(ms, msAbs, n, name) {
  var isPlural = msAbs >= n * 1.5;
  return Math.round(ms / n) + ' ' + name + (isPlural ? 's' : '');
}


/***/ }),

/***/ 7176:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var callBind = __webpack_require__(73126);
var gOPD = __webpack_require__(75795);

var hasProtoAccessor;
try {
	// eslint-disable-next-line no-extra-parens, no-proto
	hasProtoAccessor = /** @type {{ __proto__?: typeof Array.prototype }} */ ([]).__proto__ === Array.prototype;
} catch (e) {
	if (!e || typeof e !== 'object' || !('code' in e) || e.code !== 'ERR_PROTO_ACCESS') {
		throw e;
	}
}

// eslint-disable-next-line no-extra-parens
var desc = !!hasProtoAccessor && gOPD && gOPD(Object.prototype, /** @type {keyof typeof Object.prototype} */ ('__proto__'));

var $Object = Object;
var $getPrototypeOf = $Object.getPrototypeOf;

/** @type {import('./get')} */
module.exports = desc && typeof desc.get === 'function'
	? callBind([desc.get])
	: typeof $getPrototypeOf === 'function'
		? /** @type {import('./get')} */ function getDunder(value) {
			// eslint-disable-next-line eqeqeq
			return $getPrototypeOf(value == null ? value : $Object(value));
		}
		: false;


/***/ }),

/***/ 7598:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/*!
 * mime-db
 * Copyright(c) 2014 Jonathan Ong
 * Copyright(c) 2015-2022 Douglas Christopher Wilson
 * MIT Licensed
 */

/**
 * Module exports.
 */

module.exports = __webpack_require__(81813)


/***/ }),

/***/ 7691:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

const Const = __webpack_require__(52750);
const {doError, doCallback} = __webpack_require__(30216);
const Connection = __webpack_require__(8413);
const Pool = __webpack_require__(12089);
const {escape} = __webpack_require__(70742);

if (typeof(setImmediate) === 'undefined') {
    global.setImmediate = function(cb) {
        process.nextTick(cb);
    };
}

exports.AUTH_PLUGIN_LEGACY = Const.AUTH_PLUGIN_LEGACY;
exports.AUTH_PLUGIN_SRP = Const.AUTH_PLUGIN_SRP;
// exports.AUTH_PLUGIN_SRP256 = Const.AUTH_PLUGIN_SRP256;

exports.WIRE_CRYPT_DISABLE = Const.WIRE_CRYPT_DISABLE;
exports.WIRE_CRYPT_ENABLE = Const.WIRE_CRYPT_ENABLE;

exports.ISOLATION_READ_UNCOMMITTED = Const.ISOLATION_READ_UNCOMMITTED;
exports.ISOLATION_READ_COMMITTED = Const.ISOLATION_READ_COMMITTED;
exports.ISOLATION_REPEATABLE_READ = Const.ISOLATION_REPEATABLE_READ;
exports.ISOLATION_SERIALIZABLE = Const.ISOLATION_SERIALIZABLE;
exports.ISOLATION_READ_COMMITTED_READ_ONLY = Const.ISOLATION_READ_COMMITTED_READ_ONLY;

if (!String.prototype.padLeft) {
    String.prototype.padLeft = function(max, c) {
        var self = this;
        return new Array(Math.max(0, max - self.length + 1)).join(c || ' ') + self;
    };
}

exports.escape = escape;

exports.attach = function(options, callback) {
    var host = options.host || Const.DEFAULT_HOST;
    var port = options.port || Const.DEFAULT_PORT;
    var manager = options.manager || false;
    var cnx = this.connection = new Connection(host, port, function(err) {

        if (err) {
            doError(err, callback);
            return;
        }

        cnx.connect(options, function(err) {
            if (err) {
                doError(err, callback);
            } else {
                if (manager)
                    cnx.svcattach(options, callback);
                else
                    cnx.attach(options, callback);
            }
        });

    }, options);
};

exports.drop = function(options, callback) {
	exports.attach(options, function(err, db) {
		if (err) {
			callback({ error: err, message: "Drop error" });
			return;
		}

		db.drop(callback);
	});
};

exports.create = function(options, callback) {
    var host = options.host || Const.DEFAULT_HOST;
    var port = options.port || Const.DEFAULT_PORT;
    var cnx = this.connection = new Connection(host, port, function(err) {

        var self = cnx;

        if (err) {
            callback({ error: err, message: "Connect error" });
            return;
        }

        cnx.connect(options, function(err) {
            if (err) {
                self.db.emit('error', err);
                doError(err, callback);
                return;
            }

            cnx.createDatabase(options, callback);
        });
    }, options);
};

exports.attachOrCreate = function(options, callback) {

    var host = options.host || Const.DEFAULT_HOST;
    var port = options.port || Const.DEFAULT_PORT;

    var cnx = this.connection = new Connection(host, port, function(err) {

        var self = cnx;

        if (err) {
            callback({ error: err, message: "Connect error" });
            return;
        }

        cnx.connect(options, function(err) {

            if (err) {
                doError(err, callback);
                return;
            }

            cnx.attach(options, function(err, ret) {

                if (!err) {
                    if (self.db)
                        self.db.emit('connect', ret);
                    doCallback(ret, callback);
                    return;
                }

                cnx.createDatabase(options, callback);
            });
        });

    }, options);
};

// Pooling
exports.pool = function(max, options) {
	return new Pool(exports.attach, max, Object.assign({}, options, { isPool: true }));
};


/***/ }),

/***/ 8413:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const Events = __webpack_require__(24434);
const net = __webpack_require__(69278);
const os = __webpack_require__(70857);
const path = __webpack_require__(16928);
const BigInt = __webpack_require__(92096);

const {XdrWriter, BlrWriter, XdrReader, BitSet, BlrReader} = __webpack_require__(49035);
const {doCallback, doError} = __webpack_require__(30216);
const srp = __webpack_require__(51496);
const crypt = __webpack_require__(56908);
const Const = __webpack_require__(52750);
const Xsql = __webpack_require__(56240);
const ServiceManager = __webpack_require__(68910);
const Database = __webpack_require__(37688);
const Statement = __webpack_require__(21516);
const Transaction = __webpack_require__(74453);
const {lookupMessages, noop, parseDate} = __webpack_require__(70742);

/***************************************
 *
 *   Connection
 *
 ***************************************/

var Connection = function (host, port, callback, options, db, svc) {
    var self = this;
    this.db = db;
    this.svc = svc
    this._msg = new XdrWriter(32);
    this._blr = new BlrWriter(32);
    this._queue = [];
    this._detachTimeout;
    this._detachCallback;
    this._detachAuto;
    this._socket = net.createConnection(port, host);
    this._pending = [];
    this._isOpened = false;
    this._isClosed = false;
    this._isDetach = false;
    this._isUsed = false;
    this._pooled = options.isPool||false;
    this.options = options;
    this._bind_events(host, port, callback);
    this.error;
    this._retry_connection_id;
    this._retry_connection_interval = options.retryConnectionInterval || 1000;
    this._max_cached_query = options.maxCachedQuery || -1;
    this._cache_query = options.cacheQuery?{}:null;
    this._messageFile = options.messageFile || path.join(__dirname, 'firebird.msg');
};

Connection.prototype._setcachedquery = function (query, statement) {
    if (this._cache_query){
        if (this._max_cached_query === -1 || this._max_cached_query > Object.keys(this._cache_query).length){
            this._cache_query[query] = statement;
        }
    }


};

Connection.prototype.getCachedQuery = function (query) {
    return this._cache_query ? this._cache_query[query] : null;
};

Connection.prototype._bind_events = function(host, port, callback) {

    var self = this;

    self._socket.on('close', function() {

        if (!self._isOpened || self._isDetach) {
            return;
        }

        self._isOpened = false;

        if (!self.db) {
            if (callback)
                callback(self.error);
            return;
        }

        self._retry_connection_id = setTimeout(function() {
            self._socket.removeAllListeners();
            self._socket = null;

            var ctx = new Connection(host, port, function(err) {
                ctx.connect(self.options, function(err) {

                    if (err) {
                        self.db.emit('error', err);
                        return;
                    }

                    ctx.attach(self.options, function(err) {

                        if (err) {
                            self.db.emit('error', err);
                            return;
                        }

                        ctx._queue = ctx._queue.concat(self._queue);
                        ctx._pending = ctx._pending.concat(self._pending);
                        self.db.emit('reconnect');

                    }, self.db);
                });

                Object.assign(self, ctx);

            }, self.options, self.db);
        }, self._retry_connection_interval);

    });

    self._socket.on('error', function(e) {

        self.error = e;

        if (self.db)
            self.db.emit('error', e)

        if (callback)
            callback(e);

    });

    self._socket.on('connect', function() {
        self._isClosed = false;
        self._isOpened = true;
        if (callback)
            callback();
    });

    self._socket.on('data', function (data) {
        var xdr;

        if (!self._xdr) {
            xdr = new XdrReader(data);
        } else {
            xdr = new XdrReader(Buffer.concat([self._xdr.buffer, data], self._xdr.buffer.length + data.length));
            delete (self._xdr);
        }

        while (xdr.pos < xdr.buffer.length) {
            var cb = self._queue[0], pos = xdr.pos;

            decodeResponse(xdr, cb, self, self._lowercase_keys, function (err, obj) {

                if (err) {
                    xdr.buffer = xdr.buffer.slice(pos);
                    xdr.pos = 0;
                    self._xdr = xdr;

                    if (self.accept.protocolMinimumType === Const.ptype_lazy_send && self._queue.length > 0) {
                        self._queue[0].lazy_count = 2;
                    }
                    return;
                }

                // remove the op flag, needed for partial packet
                if (xdr.r) {
                    delete (xdr.r);
                }

                self._queue.shift();
                self._pending.shift();

                if (obj && obj.status) {
                    obj.message = lookupMessages(obj.status);
                    doCallback(obj, cb);
                } else {
                    doCallback(obj, cb);
                }

            });

            if (xdr.pos === 0) {
                break;
            }
        }

        if (!self._detachAuto || self._pending.length !== 0) {
            return;
        }

        clearTimeout(self._detachTimeout);
        self._detachTimeout = setTimeout(function () {
            self.db.detach(self._detachCallback);
            self._detachAuto = false;
        }, 100);

    });
}

Connection.prototype.disconnect = function() {
    this._socket.end();
};


function decodeResponse(data, callback, cnx, lowercase_keys, cb) {
    try {
        do {
            var r = data.r || data.readInt();
        } while (r === Const.op_dummy);

        var item, op, response;

        switch (r) {
            case Const.op_response:

                if (callback) {
                    response = callback.response || {};
                } else {
                    response = {};
                }

                let loop = function (err) {
                    if (err) {
                        return cb(err);
                    } else {
                        if (callback && callback.lazy_count) {
                            callback.lazy_count--;
                            if (callback.lazy_count > 0) {
                                r = data.readInt(); // Read new op
                                parseOpResponse(data, response, loop);
                            } else {
                                cb(null, response);
                            }
                        } else {
                            cb(null, response);
                        }
                    }
                };
                // Parse normal and lazy response
                return parseOpResponse(data, response, loop);
            case Const.op_fetch_response:
            case Const.op_sql_response:
                var statement = callback.statement;
                var output = statement.output;
                var custom = statement.custom || {};
                var isOpFetch = r === Const.op_fetch_response;
                var _xdrpos;
                statement.nbrowsfetched = statement.nbrowsfetched || 0;

                if (isOpFetch && data.fop) { // could be set when a packet is not complete
                    data.readBuffer(68); // ??
                    op = data.readInt(); // ??
                    data.fop = false;
                    if (op === Const.op_response) {
                        return parseOpResponse(data, {}, cb);
                    }
                }

                if (!isOpFetch) {
                    data.fstatus = 0;
                }

                data.fstatus = data.fstatus !== undefined ? data.fstatus : data.readInt();
                data.fcount = data.fcount !== undefined ? data.fcount : data.readInt();
                data.fcolumn = data.fcolumn || 0;
                data.frow = data.frow || (custom.asObject ? {} : new Array(output.length));
                data.frows = data.frows || [];

                if (custom.asObject && !data.fcols) {
                    if (lowercase_keys) {
                        data.fcols = output.map((column) => column.alias.toLowerCase());
                    } else {
                        data.fcols = output.map((column) => column.alias);
                    }
                }

                const arrBlob = [];
                const lowerV13 = statement.connection.accept.protocolVersion <  Const.PROTOCOL_VERSION13;

                while (data.fcount && (data.fstatus !== 100)) {
                    let nullBitSet;
                    if (!lowerV13) {
                        const nullBitsLen = Math.floor((output.length + 7) / 8);
                        nullBitSet = new BitSet(data.readBuffer(nullBitsLen, false));
                        data.readBuffer((4 - nullBitsLen) & 3, false); // Skip padding
                    }

                    for (let length = output.length; data.fcolumn < length; data.fcolumn++) {
                        item = output[data.fcolumn];

                        if (!lowerV13 && nullBitSet.get(data.fcolumn)) {
                            if (custom.asObject) {
                                data.frow[data.fcols[data.fcolumn]] = null;
                            } else {
                                data.frow[data.fcolumn] = null;
                            }

                            continue;
                        }

                        try {
                            _xdrpos = data.pos;
                            const key = custom.asObject ? data.fcols[data.fcolumn] : data.fcolumn;
                            const row = data.frows.length;
                            let value = item.decode(data, lowerV13);

                            if (item.type === Const.SQL_BLOB && value !== null) {
                                if (item.subType === Const.isc_blob_text && cnx.options.blobAsText) {
                                    value = fetch_blob_async_transaction(statement, value, key, row);
                                    arrBlob.push(value);
                                } else {
                                    value = fetch_blob_async(statement, value, key, row);
                                }
                            }

                            data.frow[key] = value;
                        } catch (e) {
                            // uncomplete packet read
                            data.pos = _xdrpos;
                            data.r = r;
                            return cb(new Error('Packet is not complete'));
                        }

                    }

                    data.fcolumn = 0;
                    // ToDo: emit "row" with blob subtype string decoded
                    // use: data.frow['fieldBlob'](transaction?).then(({ value }) => console.log(value))
                    // arg "transaction" is optional
                    statement.connection.db.emit('row', data.frow, statement.nbrowsfetched, custom.asObject);
                    data.frows.push(data.frow);
                    data.frow = custom.asObject ? {} : new Array(output.length);

                    try {
                        _xdrpos = data.pos;
                        if (isOpFetch) {
                            delete data.fstatus;
                            delete data.fcount;
                            op = data.readInt(); // ??
                            if (op === Const.op_response) {
                                return parseOpResponse(data, {}, cb);
                            }
                            data.fstatus = data.readInt();
                            data.fcount = data.readInt();
                        } else {
                            data.fcount--;
                            if (r === Const.op_sql_response) {
                                op = data.readInt();
                                if (op === Const.op_response) {
                                    parseOpResponse(data, {});
                                }
                            }
                        }
                    } catch (e) {
                        if (_xdrpos === data.pos) {
                            data.fop = true;
                        }
                        data.r = r;
                        return cb(new Error("Packet is not complete"));
                    }
                    statement.nbrowsfetched++;
                }

                // ToDo: emit "result" with blob subtype string decoded
                statement.connection.db.emit('result', data.frows, arrBlob);
                return cb(null, {data: data.frows, fetched: Boolean(!isOpFetch || data.fstatus === 100), arrBlob});
            case Const.op_accept:
            case Const.op_cond_accept:
            case Const.op_accept_data:
                let accept = {
                    protocolVersion: data.readInt(),
                    protocolArchitecture: data.readInt(),
                    protocolMinimumType: data.readInt(),
                    pluginName: '',
                    authData: '',
                    sessionKey: ''
                };

                accept.protocolMinimumType = accept.protocolMinimumType & 0xFF;
                //accept.compress = (accept.acceptType & pflag_compress) !== 0; // TODO Handle zlib compression
                if (accept.protocolVersion < 0) {
                    accept.protocolVersion = (accept.protocolVersion & Const.FB_PROTOCOL_MASK) | Const.FB_PROTOCOL_FLAG;
                }

                if (r === Const.op_cond_accept || r === Const.op_accept_data) {
                    var d = new BlrReader(data.readArray());
                    accept.pluginName = data.readString(Const.DEFAULT_ENCODING);
                    var is_authenticated = data.readInt();
                    var keys = data.readString(Const.DEFAULT_ENCODING); // keys

                    if (is_authenticated === 0) {
                        if (cnx.options.pluginName && cnx.options.pluginName !== accept.pluginName) {
                            doError(new Error('Server don\'t accept plugin : ' + cnx.options.pluginName + ', but support : ' + accept.pluginName), callback);
                        }

                        if (Const.AUTH_PLUGIN_SRP_LIST.indexOf(accept.pluginName) !== -1) {
                            var crypto = {
                                Srp: 'sha1',
                                Srp256: 'sha256'
                            };
                            accept.srpAlgo = crypto[accept.pluginName];

                            // TODO : Fallback Srp256 to Srp ?
                            /*if (!d.buffer) {
                                cnx.sendOpContAuth(
                                    cnx.clientKeys.public.toString(16),
                                    DEFAULT_ENCODING,
                                    accept.pluginName
                                );

                                return cb(new Error('login'));
                            }*/

                            // Check buffer contains salt
                            var saltLen = d.buffer.readUInt16LE(0);
                            if (saltLen > 32 * 2) {
                                console.log('salt to long'); // TODO : Throw error
                            }

                            // Check buffer contains key
                            var keyLen = d.buffer.readUInt16LE(saltLen + 2);
                            var keyStart = saltLen + 4;
                            if (d.buffer.length - keyStart !== keyLen) {
                                console.log('key error'); // TODO : Throw error
                            }

                            // Server keys
                            cnx.serverKeys = {
                                salt: d.buffer.slice(2, saltLen + 2).toString('utf8'),
                                public: BigInt(d.buffer.slice(keyStart, d.buffer.length).toString('utf8'), 16)
                            };

                            var proof = srp.clientProof(
                                cnx.options.user.toUpperCase(),
                                cnx.options.password,
                                cnx.serverKeys.salt,
                                cnx.clientKeys.public,
                                cnx.serverKeys.public,
                                cnx.clientKeys.private,
                                accept.srpAlgo
                            );

                            accept.authData = proof.authData.toString(16);
                            accept.sessionKey = proof.clientSessionKey;
                        } else if (accept.pluginName === Const.AUTH_PLUGIN_LEGACY) {
                            accept.authData = crypt.crypt(cnx.options.password, Const.LEGACY_AUTH_SALT).substring(2);
                        } else {
                            return cb(new Error('Unknow auth plugin : ' + accept.pluginName));
                        }
                    } else {
                        accept.authData = '';
                        accept.sessionKey = '';
                    }
                }

                return cb(undefined, accept);
            case Const.op_cont_auth:
                var d = new BlrReader(data.readArray());
                var pluginName = data.readString(Const.DEFAULT_ENCODING);
                data.readString(Const.DEFAULT_ENCODING); // plist
                data.readString(Const.DEFAULT_ENCODING); // pkey

                if (!cnx.options.pluginName) {
                    if (cnx.accept.pluginName === pluginName) {
                        // Erreur plugin not able to connect
                        return cb(new Error("Unable to connect with plugin " + cnx.accept.pluginName));
                    }

                    if (pluginName === Const.AUTH_PLUGIN_LEGACY) { // Fallback to LegacyAuth
                        cnx.accept.pluginName = pluginName;
                        cnx.accept.authData = crypt.crypt(cnx.options.password, Const.LEGACY_AUTH_SALT).substring(2);

                        cnx.sendOpContAuth(
                            cnx.accept.authData,
                            Const.DEFAULT_ENCODING,
                            pluginName
                        );

                        return {error: new Error('login')};
                    }
                }

                return data.accept;
            default:
                return cb(new Error('Unexpected:' + r));
        }
    } catch (err) {
        if (err instanceof RangeError) {
            return cb(err);
        }
        throw err;
    }
}

function parseOpResponse(data, response, cb) {
    var handle = data.readInt();

    if (!response.handle) {
        response.handle = handle;
    }

    var oid = data.readQuad();
    if (oid.low || oid.high) {
        response.oid = oid;
    }

    var buf = data.readArray();
    if (buf) {
        response.buffer = buf;
    }

    var num, op, item = {};
    while (true) {
        op = data.readInt();

        switch (op) {
            case Const.isc_arg_end:
                return cb ? cb(undefined, response) : response;
            case Const.isc_arg_gds:
                num = data.readInt();
                if (!num) {
                    break;
                }

                item = {gdscode: num};

                if (response.status) {
                    response.status.push(item);
                } else {
                    response.status = [item];
                }

                break;
            case Const.isc_arg_string:
            case Const.isc_arg_interpreted:
            case Const.isc_arg_sql_state:
                if (item.params) {
                    var str = data.readString(Const.DEFAULT_ENCODING);
                    item.params.push(str);
                } else {
                    item.params = [data.readString(Const.DEFAULT_ENCODING)];
                }

                break;
            case Const.isc_arg_number:
                num = data.readInt();

                if (item.params) {
                    item.params.push(num);
                } else {
                    item.params = [num];
                }

                if (item.gdscode === Const.isc_sqlerr) {
                    response.sqlcode = num;
                }

                break;
            default:
                if (cb) {
                    cb(new Error('Unexpected: ' + op))
                } else {
                    throw new Error('Unexpected: ' + op);
                }
        }
    }
}

Connection.prototype.sendOpContAuth = function(authData, authDataEnc, pluginName) {
    var msg = this._msg;
    msg.pos = 0;

    msg.addInt(Const.op_cont_auth);
    msg.addString(authData, authDataEnc);
    msg.addString(pluginName, Const.DEFAULT_ENCODING)
    msg.addString(Const.AUTH_PLUGIN_LIST.join(','), Const.DEFAULT_ENCODING);
    // msg.addInt(0); // p_list
    msg.addInt(0); // keys

    this._socket.write(msg.getData());
}

Connection.prototype._queueEvent = function(callback){
    var self = this;

    if (self._isClosed) {
        if (callback)
            callback(new Error('Connection is closed.'));
        return;
    }

    self._queue.push(callback);
    self._socket.write(self._msg.getData());
};

Connection.prototype.connect = function (options, callback) {
    var pluginName = options.manager ? Const.AUTH_PLUGIN_LEGACY : options.pluginName || Const.AUTH_PLUGIN_LIST[0]; // TODO Srp for service
    var msg = this._msg;
    var blr = this._blr;

    this._pending.push('connect');

    msg.pos = 0;
    blr.pos = 0;

    blr.addString(Const.CNCT_login, options.user, Const.DEFAULT_ENCODING);
    blr.addString(Const.CNCT_plugin_name, pluginName, Const.DEFAULT_ENCODING);
    blr.addString(Const.CNCT_plugin_list, Const.AUTH_PLUGIN_LIST.join(','), Const.DEFAULT_ENCODING);

    var specificData = '';
    if (Const.AUTH_PLUGIN_SRP_LIST.indexOf(pluginName) > -1) {
        this.clientKeys = srp.clientSeed();
        specificData = this.clientKeys.public.toString(16);
        blr.addMultiblockPart(Const.CNCT_specific_data, specificData, Const.DEFAULT_ENCODING);
    } else if (pluginName === Const.AUTH_PLUGIN_LEGACY) {
        specificData = crypt.crypt(options.password, Const.LEGACY_AUTH_SALT).substring(2);
        blr.addMultiblockPart(Const.CNCT_specific_data, specificData, Const.DEFAULT_ENCODING);
    } else {
        doError(new Error('Invalide auth plugin \'' + pluginName + '\''), callback);
        return;
    }
    blr.addBytes([Const.CNCT_client_crypt, 4, Const.WIRE_CRYPT_DISABLE, 0, 0, 0]); // WireCrypt = Disabled
    blr.addString(Const.CNCT_user, os.userInfo().username || 'Unknown', Const.DEFAULT_ENCODING);
    blr.addString(Const.CNCT_host, os.hostname(), Const.DEFAULT_ENCODING);
    blr.addBytes([Const.CNCT_user_verification, 0]);

    msg.addInt(Const.op_connect);
    msg.addInt(Const.op_attach);
    msg.addInt(Const.CONNECT_VERSION3);
    msg.addInt(Const.ARCHITECTURE_GENERIC);
    msg.addString(options.database || options.filename, Const.DEFAULT_ENCODING);
    msg.addInt(Const.SUPPORTED_PROTOCOL.length);  // Count of Protocol version understood count.
    msg.addBlr(this._blr);

    for (var protocol of Const.SUPPORTED_PROTOCOL) {
        msg.addInt(protocol[0]); // Version
        msg.addInt(protocol[1]); // Architecture
        msg.addInt(protocol[2]); // Min type
        msg.addInt(protocol[3]); // Max type
        msg.addInt(protocol[4]); // Preference weight
    }

    var self = this;
    function cb(err, ret) {
        if (err) {
            doError(err, callback);
            return;
        }

        self.accept = ret;
        if (callback)
            callback(undefined, ret);
    }

    this._queueEvent(cb);
};

Connection.prototype.attach = function (options, callback, db) {
    this._lowercase_keys = options.lowercase_keys || Const.DEFAULT_LOWERCASE_KEYS;

    var database = options.database || options.filename;
    if (database == null || database.length === 0) {
        doError(new Error('No database specified'), callback);
        return;
    }

    var user = options.user || Const.DEFAULT_USER;
    var password = options.password || Const.DEFAULT_PASSWORD;
    var role = options.role;
    var self = this;
    var msg = this._msg;
    var blr = this._blr;
    msg.pos = 0;
    blr.pos = 0;

    blr.addByte(Const.isc_dpb_version1);
    blr.addString(Const.isc_dpb_lc_ctype, options.encoding || 'UTF8', Const.DEFAULT_ENCODING);
    blr.addString(Const.isc_dpb_user_name, user, Const.DEFAULT_ENCODING);
    if (options.password && !this.accept.authData) {
        if (this.accept.protocolVersion < Const.PROTOCOL_VERSION13) {
            if (this.accept.protocolVersion === Const.PROTOCOL_VERSION10) {
                blr.addString(Const.isc_dpb_password, password, Const.DEFAULT_ENCODING);
            } else {
                blr.addString(Const.isc_dpb_password_enc, crypt.crypt(password, Const.LEGACY_AUTH_SALT).substring(2), Const.DEFAULT_ENCODING);
            }
        }
    }

    if (role)
        blr.addString(Const.isc_dpb_sql_role_name, role, Const.DEFAULT_ENCODING);

    blr.addBytes([Const.isc_dpb_process_id, 4]);
    blr.addInt32(process.pid);

    let processName  = process.title || "";
    blr.addString(Const.isc_dpb_process_name, processName.length > 255 ? processName.substring(processName.length - 255,  processName.length) : processName, Const.DEFAULT_ENCODING);

    if (this.accept.authData) {
        blr.addString(Const.isc_dpb_specific_auth_data, this.accept.authData, Const.DEFAULT_ENCODING);
    }

    msg.addInt(Const.op_attach);
    msg.addInt(0);  // Database Object ID
    msg.addString(database, Const.DEFAULT_ENCODING);
    msg.addBlr(this._blr);

    function cb(err, ret) {
        if (err) {
            doError(err, callback);
            return;
        }

        self.dbhandle = ret.handle;
        if (callback)
            callback(undefined, ret);
    }

    // For reconnect
    if (db) {
        db.connection = this;
        cb.response = db;
    } else {
        cb.response = new Database(this);
        cb.response.removeAllListeners('error');
        cb.response.on('error', noop);
    }

    this._queueEvent(cb);
};

Connection.prototype.detach = function (callback) {

    var self = this;

    if (self._isClosed)
        return;

    self._isUsed = false;
    self._isDetach = true;

    var msg = self._msg;

    msg.pos = 0;
    msg.addInt(Const.op_detach);
    msg.addInt(0); // Database Object ID

    self._queueEvent(function(err, ret) {
        clearTimeout(self._retry_connection_id);
        delete(self.dbhandle);
        if (callback)
            callback(err, ret);
    });
};

Connection.prototype.createDatabase = function (options, callback) {
    var database = options.database || options.filename;
    if (database == null || database.length === 0) {
        doError(new Error('No database specified'), callback);
        return;
    }

    var user = options.user || Const.DEFAULT_USER;
    var password = options.password || Const.DEFAULT_PASSWORD;
    var pageSize = options.pageSize || Const.DEFAULT_PAGE_SIZE;
    var role = options.role;
    var blr = this._blr;

    blr.pos = 0;
    blr.addByte(Const.isc_dpb_version1);
    blr.addString(Const.isc_dpb_set_db_charset, 'UTF8', Const.DEFAULT_ENCODING);
    blr.addString(Const.isc_dpb_lc_ctype, 'UTF8', Const.DEFAULT_ENCODING);
    blr.addString(Const.isc_dpb_user_name, user, Const.DEFAULT_ENCODING);
    if (this.accept.protocolVersion < Const.PROTOCOL_VERSION13) {
        if (this.accept.protocolVersion === Const.PROTOCOL_VERSION10) {
            blr.addString(Const.isc_dpb_password, password, Const.DEFAULT_ENCODING);
        } else {
            blr.addString(Const.isc_dpb_password_enc, crypt.crypt(password, Const.LEGACY_AUTH_SALT).substring(2), Const.DEFAULT_ENCODING);
        }
    }
    if (role)
        blr.addString(Const.isc_dpb_sql_role_name, role, Const.DEFAULT_ENCODING);

    blr.addBytes([Const.isc_dpb_process_id, 4]);
    blr.addInt32(process.pid);

    let processName  = process.title || "";
    blr.addString(Const.isc_dpb_process_name, processName.length > 255 ? processName.substring(processName.length - 255,  processName.length) : processName, Const.DEFAULT_ENCODING);

    if (this.accept.authData) {
        blr.addString(Const.isc_dpb_specific_auth_data, this.accept.authData, Const.DEFAULT_ENCODING);
    }

    blr.addNumeric(Const.isc_dpb_sql_dialect, 3);
    blr.addNumeric(Const.isc_dpb_force_write, 1);
    blr.addNumeric(Const.isc_dpb_overwrite, 1);
    blr.addNumeric(Const.isc_dpb_page_size, pageSize);

    var msg = this._msg;
    msg.pos = 0;
    msg.addInt(Const.op_create);  // op_create
    msg.addInt(0);          // Database Object ID
    msg.addString(database, Const.DEFAULT_ENCODING);
    msg.addBlr(blr);

    var self = this;

    function cb(err, ret) {

        if (ret)
            self.dbhandle = ret.handle;

        setImmediate(function() {
            if (self.db)
                self.db.emit('attach', ret);
        });

        if (callback)
            callback(err, ret);
    }

    cb.response = new Database(this);
    this._queueEvent(cb);
};

Connection.prototype.dropDatabase = function (callback) {
    var msg = this._msg;
    msg.pos = 0;

    msg.addInt(Const.op_drop_database);
    msg.addInt(this.dbhandle);

    var self = this;
    this._queueEvent(function(err) {
        self.detach(function() {
            self.disconnect();

            if (callback)
                callback(err);
        });
    });
};

Connection.prototype.throwClosed = function(callback) {
    var err = new Error('Connection is closed.');
    this.db.emit('error', err);
    if (callback)
        callback(err);
    return this;
};

Connection.prototype.startTransaction = function(isolation, callback) {

    if (typeof(isolation) === 'function') {
        var tmp = isolation;
        isolation = callback;
        callback = tmp;
    }

    if (this._isClosed)
        return this.throwClosed(callback);

    // for auto detach
    this._pending.push('startTransaction');

    var blr = this._blr;
    var msg = this._msg;

    blr.pos = 0;
    msg.pos = 0;

    blr.addBytes(isolation || Const.ISOLATION_REPEATABLE_READ);
    msg.addInt(Const.op_transaction);
    msg.addInt(this.dbhandle);
    msg.addBlr(blr);
    callback.response = new Transaction(this);

    this.db.emit('transaction', isolation);
    this._queueEvent(callback);
};

Connection.prototype.commit = function (transaction, callback) {

    if (this._isClosed)
        return this.throwClosed(callback);

    // for auto detach
    this._pending.push('commit');

    var msg = this._msg;
    msg.pos = 0;
    msg.addInt(Const.op_commit);
    msg.addInt(transaction.handle);
    this.db.emit('commit');
    this._queueEvent(callback);
};

Connection.prototype.rollback = function (transaction, callback) {

    if (this._isClosed)
        return this.throwClosed(callback);

    // for auto detach
    this._pending.push('rollback');

    var msg = this._msg;
    msg.pos = 0;
    msg.addInt(Const.op_rollback);
    msg.addInt(transaction.handle);
    this.db.emit('rollback');
    this._queueEvent(callback);
};

Connection.prototype.commitRetaining = function (transaction, callback) {

    if (this._isClosed)
        throw new Error('Connection is closed.');

    // for auto detach
    this._pending.push('commitRetaining');

    var msg = this._msg;
    msg.pos = 0;
    msg.addInt(Const.op_commit_retaining);
    msg.addInt(transaction.handle);
    this._queueEvent(callback);
};

Connection.prototype.rollbackRetaining = function (transaction, callback) {

    if (this._isClosed)
        return this.throwClosed(callback);

    // for auto detach
    this._pending.push('rollbackRetaining');

    var msg = this._msg;
    msg.pos = 0;
    msg.addInt(Const.op_rollback_retaining);
    msg.addInt(transaction.handle);
    this._queueEvent(callback);
};

Connection.prototype.allocateStatement = function (callback) {

    if (this._isClosed)
        return this.throwClosed(callback);

    // for auto detach
    this._pending.push('allocateStatement');

    var msg = this._msg;
    msg.pos = 0;
    msg.addInt(Const.op_allocate_statement);
    msg.addInt(this.dbhandle);
    callback.response = new Statement(this);
    this._queueEvent(callback);
};

Connection.prototype.dropStatement = function (statement, callback) {

    if (this._isClosed)
        return this.throwClosed(callback);

    // for auto detach
    this._pending.push('dropStatement');

    var msg = this._msg;
    msg.pos = 0;
    msg.addInt(Const.op_free_statement);
    msg.addInt(statement.handle);
    msg.addInt(Const.DSQL_drop);
    this._queueEvent(callback);
};

Connection.prototype.closeStatement = function (statement, callback) {

    if (this._isClosed)
        return this.throwClosed(callback);

    // for auto detach
    this._pending.push('closeStatement');

    var msg = this._msg;
    msg.pos = 0;
    msg.addInt(Const.op_free_statement);
    msg.addInt(statement.handle);
    msg.addInt(Const.DSQL_close);

    this._queueEvent(callback);
};

Connection.prototype.allocateAndPrepareStatement = function (transaction, query, plan, callback) {
    var self = this;
    var mainCallback = function(err, ret) {
        if (!err) {
            mainCallback.response.handle = ret.handle;
            describe(ret.buffer, mainCallback.response);
            mainCallback.response.query = query;
            self.db.emit('query', query);
            ret = mainCallback.response;
            self._setcachedquery(query, ret);
        }

        if (callback)
            callback(err, ret);
    };

    // for auto detach
    this._pending.push('allocateAndPrepareStatement');

    var msg = this._msg;
    var blr = this._blr;

    msg.pos = 0;
    blr.pos = 0;

    msg.addInt(Const.op_allocate_statement);
    msg.addInt(this.dbhandle);
    mainCallback.lazy_count = 1;

    blr.addBytes(Const.DESCRIBE);
    if (plan)
        blr.addByte(Const.isc_info_sql_get_plan);

    msg.addInt(Const.op_prepare_statement);
    msg.addInt(transaction.handle);
    msg.addInt(0xFFFF);
    msg.addInt(3); // dialect = 3
    msg.addString(query, Const.DEFAULT_ENCODING);
    msg.addBlr(blr);
    msg.addInt(65535); // buffer_length
    mainCallback.lazy_count += 1;

    mainCallback.response = new Statement(this);
    this._queueEvent(mainCallback);
};

Connection.prototype.prepare = function (transaction, query, plan, callback) {
    var self = this;

    if (this.accept.protocolMinimumType === Const.ptype_lazy_send) { // V11 Statement or higher
        self.allocateAndPrepareStatement(transaction, query, plan, callback);
    } else { // V10 Statement
        self.allocateStatement(function (err, statement) {
            if (err) {
                doError(err, callback);
                return;
            }

            self.prepareStatement(transaction, statement, query, plan, callback);
        });
    }
};

function describe(buff, statement) {
    var br = new BlrReader(buff);
    var parameters = null;
    var type, param;

    while (br.pos < br.buffer.length) {
        switch (br.readByteCode()) {
            case Const.isc_info_sql_stmt_type:
                statement.type = br.readInt();
                break;
            case Const.isc_info_sql_get_plan:
                statement.plan = br.readString(Const.DEFAULT_ENCODING);
                break;
            case Const.isc_info_sql_select:
                statement.output = parameters = [];
                break;
            case Const.isc_info_sql_bind:
                statement.input = parameters = [];
                break;
            case Const.isc_info_sql_num_variables:
                br.readInt(); // eat int
                break;
            case Const.isc_info_sql_describe_vars:
                if (!parameters) {return}
                br.readInt(); // eat int ?
                var finishDescribe = false;
                param = null;
                while (!finishDescribe){
                    switch (br.readByteCode()) {
                        case Const.isc_info_sql_describe_end:
                            break;
                        case Const.isc_info_sql_sqlda_seq:
                            var num = br.readInt();
                            break;
                        case Const.isc_info_sql_type:
                            type = br.readInt();
                            switch (type&~1) {
                                case Const.SQL_VARYING:   param = new Xsql.SQLVarString(); break;
                                case Const.SQL_NULL:      param = new Xsql.SQLVarNull(); break;
                                case Const.SQL_TEXT:      param = new Xsql.SQLVarText(); break;
                                case Const.SQL_DOUBLE:    param = new Xsql.SQLVarDouble(); break;
                                case Const.SQL_FLOAT:
                                case Const.SQL_D_FLOAT:   param = new Xsql.SQLVarFloat(); break;
                                case Const.SQL_TYPE_DATE: param = new Xsql.SQLVarDate(); break;
                                case Const.SQL_TYPE_TIME: param = new Xsql.SQLVarTime(); break;
                                case Const.SQL_TIMESTAMP: param = new Xsql.SQLVarTimeStamp(); break;
                                case Const.SQL_BLOB:      param = new Xsql.SQLVarBlob(); break;
                                case Const.SQL_ARRAY:     param = new Xsql.SQLVarArray(); break;
                                case Const.SQL_QUAD:      param = new Xsql.SQLVarQuad(); break;
                                case Const.SQL_LONG:      param = new Xsql.SQLVarInt(); break;
                                case Const.SQL_SHORT:     param = new Xsql.SQLVarShort(); break;
                                case Const.SQL_INT64:     param = new Xsql.SQLVarInt64(); break;
                                case Const.SQL_INT128:     param = new Xsql.SQLVarInt128(); break;
                                case Const.SQL_BOOLEAN:   param = new Xsql.SQLVarBoolean(); break;
                                default:
                                    throw new Error('Unexpected');
                            }
                            parameters[num-1] = param;
                            param.type = type;
                            param.nullable = Boolean(param.type & 1);
                            param.type &= ~1;
                            break;
                        case Const.isc_info_sql_sub_type:
                            param.subType = br.readInt();
                            break;
                        case Const.isc_info_sql_scale:
                            param.scale = br.readInt();
                            break;
                        case Const.isc_info_sql_length:
                            param.length = br.readInt();
                            break;
                        case Const.isc_info_sql_null_ind:
                            param.nullable = Boolean(br.readInt());
                            break;
                        case Const.isc_info_sql_field:
                            param.field = br.readString(Const.DEFAULT_ENCODING);
                            break;
                        case Const.isc_info_sql_relation:
                            param.relation = br.readString(Const.DEFAULT_ENCODING);
                            break;
                        case Const.isc_info_sql_owner:
                            param.owner = br.readString(Const.DEFAULT_ENCODING);
                            break;
                        case Const.isc_info_sql_alias:
                            param.alias = br.readString(Const.DEFAULT_ENCODING);
                            break;
                        case Const.isc_info_sql_relation_alias:
                            param.relationAlias = br.readString(Const.DEFAULT_ENCODING);
                            break;
                        case Const.isc_info_truncated:
                            throw new Error('Truncated');
                        default:
                            finishDescribe = true;
                            br.pos--;
                    }
                }
        }
    }
}

Connection.prototype.prepareStatement = function (transaction, statement, query, plan, callback) {

    if (this._isClosed)
        return this.throwClosed(callback);

    var msg = this._msg;
    var blr = this._blr;

    msg.pos = 0;
    blr.pos = 0;

    if (plan instanceof Function) {
        callback = plan;
        plan = false;
    }

    blr.addBytes(Const.DESCRIBE);

    if (plan)
        blr.addByte(Const.isc_info_sql_get_plan);

    msg.addInt(Const.op_prepare_statement);
    msg.addInt(transaction.handle);
    msg.addInt(statement.handle);
    msg.addInt(3); // dialect = 3
    msg.addString(query, Const.DEFAULT_ENCODING);
    msg.addBlr(blr);
    msg.addInt(65535); // buffer_length

    var self = this;
    this._queueEvent(function(err, ret) {

        if (!err) {
            describe(ret.buffer, statement);
            statement.query = query;
            self.db.emit('query', query);
            ret = statement;
            self._setcachedquery(query, ret);
        }

        if (callback)
            callback(err, ret);
    });

};

function CalcBlr(blr, xsqlda) {
    blr.addBytes([Const.blr_version5, Const.blr_begin, Const.blr_message, 0]); // + message number
    blr.addWord(xsqlda.length * 2);

    for (var i = 0, length = xsqlda.length; i < length; i++) {
        xsqlda[i].calcBlr(blr);
        blr.addByte(Const.blr_short);
        blr.addByte(0);
    }

    blr.addByte(Const.blr_end);
    blr.addByte(Const.blr_eoc);
}

Connection.prototype.executeStatement = function(transaction, statement, params, callback, custom) {

    if (this._isClosed)
        return this.throwClosed(callback);

    // for auto detach
    this._pending.push('executeStatement');

    if (params instanceof Function) {
        callback = params;
        params = undefined;
    }

    var self = this;

    var op = Const.op_execute;
    if (
        this.accept.protocolVersion >= Const.PROTOCOL_VERSION13 &&
        statement.type === Const.isc_info_sql_stmt_exec_procedure &&
        statement.output.length
    ) {
        op = Const.op_execute2;
    }

    function PrepareParams(params, input, callback) {

        var value, meta;
        var ret = new Array(params.length);
        var wait = params.length;

        function done() {
            wait--;
            if (wait === 0)
                callback(ret);
        }

        function putBlobData(index, value, callback) {

            self.createBlob2(transaction, function(err, blob) {

                var b;
                var isStream = value.readable;

                if (Buffer.isBuffer(value))
                    b = value;
                else if (typeof(value) === 'string')
                    b = Buffer.from(value, Const.DEFAULT_ENCODING);
                else if (!isStream)
                    b = Buffer.from(JSON.stringify(value), Const.DEFAULT_ENCODING);

                if (Buffer.isBuffer(b)) {
                    bufferReader(b, 1024, function(b, next) {
                        self.batchSegments(blob, b, next);
                    }, function() {
                        ret[index] = new Xsql.SQLParamQuad(blob.oid);
                        self.closeBlob(blob, callback);
                    });
                    return;
                }

                var isReading = false;
                var isEnd = false;

                value.on('data', function(chunk) {
                    value.pause();
                    isReading = true;
                    bufferReader(chunk, 1024, function(b, next) {
                        self.batchSegments(blob, b, next);
                    }, function() {
                        isReading = false;

                        if (isEnd) {
                            ret[index] = new Xsql.SQLParamQuad(blob.oid);
                            self.closeBlob(blob, callback);
                        } else
                            value.resume();
                    });
                });

                value.on('end', function() {
                    isEnd = true;
                    if (isReading)
                        return;
                    ret[index] = new Xsql.SQLParamQuad(blob.oid);
                    self.closeBlob(blob, callback);
                });
            });
        }

        for (var i = 0, length = params.length; i < length; i++) {
            value = params[i];
            meta = input[i];

            if (value === null || value === undefined) {
                switch (meta.type) {
                    case Const.SQL_VARYING:
                    case Const.SQL_NULL:
                    case Const.SQL_TEXT:
                        ret[i] = new Xsql.SQLParamString(null);
                        break;
                    case Const.SQL_DOUBLE:
                    case Const.SQL_FLOAT:
                    case Const.SQL_D_FLOAT:
                        ret[i] = new Xsql.SQLParamDouble(null);
                        break;
                    case Const.SQL_TYPE_DATE:
                    case Const.SQL_TYPE_TIME:
                    case Const.SQL_TIMESTAMP:
                        ret[i] = new Xsql.SQLParamDate(null);
                        break;
                    case Const.SQL_BLOB:
                    case Const.SQL_ARRAY:
                    case Const.SQL_QUAD:
                        ret[i] = new Xsql.SQLParamQuad(null);
                        break;
                    case Const.SQL_LONG:
                    case Const.SQL_SHORT:
                    case Const.SQL_INT64:
                    case Const.SQL_BOOLEAN:
                        ret[i] = new Xsql.SQLParamInt(null);
                        break;
                    default:
                        ret[i] = null;
                }
                done();
            } else {
                switch (meta.type) {
                    case Const.SQL_BLOB:
                        putBlobData(i, value, done);
                        break;

                    case Const.SQL_TIMESTAMP:
                    case Const.SQL_TYPE_DATE:
                    case Const.SQL_TYPE_TIME:

                        if (value instanceof Date)
                            ret[i] = new Xsql.SQLParamDate(value);
                        else if (typeof(value) === 'string')
                            ret[i] = new Xsql.SQLParamDate(parseDate(value));
                        else
                            ret[i] = new Xsql.SQLParamDate(new Date(value));

                        done();
                        break;

                    default:
                        switch (typeof value) {
                            case 'bigint':
                                ret[i] = new Xsql.SQLParamInt128(value);
                                break;
                            case 'number':
                                if (value % 1 === 0) {
                                    if (value >= Const.MIN_INT && value <= Const.MAX_INT)
                                        ret[i] = new Xsql.SQLParamInt(value);
                                    else
                                        ret[i] = new Xsql.SQLParamInt64(value);
                                } else
                                    ret[i] = new Xsql.SQLParamDouble(value);
                                break;
                            case 'string':
                                ret[i] = new Xsql.SQLParamString(value);
                                break;
                            case 'boolean':
                                ret[i] = new Xsql.SQLParamBool(value);
                                break;
                            default:
                                //throw new Error('Unexpected parametter: ' + JSON.stringify(params) + ' - ' + JSON.stringify(input));
                                ret[i] = new Xsql.SQLParamString(value.toString());
                                break;
                        }
                        done();
                }
            }
        }
    }

    var input = statement.input;

    if (input.length) {

        if (!(params instanceof Array)) {
            if (params !== undefined)
                params = [params];
            else
                params = [];
        }

        if (params.length !== input.length) {
            self._pending.pop();
            callback(new Error('Expected parameters: (params=' + params.length + ' vs. expected=' + input.length + ') - ' + statement.query));
            return;
        }

        PrepareParams(params, input, function(prms) {
            self.sendExecute(op, statement, transaction, callback, prms);
        });

        return;
    }

    this.sendExecute(op, statement, transaction, callback);
};

Connection.prototype.sendExecute = function (op, statement, transaction, callback, parameters) {
    var msg = this._msg;
    var blr = this._blr;
    msg.pos = 0;
    blr.pos = 0;

    msg.addInt(op);
    msg.addInt(statement.handle);
    msg.addInt(transaction.handle);

    if (parameters && parameters.length) {
        CalcBlr(blr, parameters);
        msg.addBlr(blr);    // params blr
        msg.addInt(0); // message number
        msg.addInt(1); // param count

        if (this.accept.protocolVersion >= Const.PROTOCOL_VERSION13) {
            // start with null indicator bitmap
            var nullBits = new BitSet();

            for (var i = 0; i < parameters.length; i++) {
                nullBits.set(i, (parameters[i].value === null) & 1);
            }

            var nullBuffer = nullBits.toBuffer();
            var requireBytes = Math.floor((parameters.length + 7) / 8);
            var remainingBytes = requireBytes - nullBuffer.length;

            if (nullBuffer.length) {
                msg.addBuffer(nullBuffer);
            }
            if (remainingBytes > 0) {
                msg.addBuffer(Buffer.alloc(remainingBytes));
            }
            msg.addAlignment(requireBytes);

            for(var i = 0; i < parameters.length; i++) {
                if (parameters[i].value !== null) {
                    parameters[i].encode(msg);
                }
            }
        } else {
            for(var i = 0; i < parameters.length; i++) {
                parameters[i].encode(msg);
                if (parameters[i].value !== null) {
                    msg.addInt(0);
                }
            }
        }
    } else {
        msg.addBlr(blr);    // empty
        msg.addInt(0); // message number
        msg.addInt(0); // param count
    }

    if (op === Const.op_execute2) {
        var outputBlr = new BlrWriter(32);

        if (statement.output && statement.output.length) {
            CalcBlr(outputBlr, statement.output);
            msg.addBlr(outputBlr);
        } else {
            msg.addBlr(outputBlr); // empty
        }
        msg.addInt(0); // out_message_number = out_message_type
    }

    callback.statement = statement;
    this._queueEvent(callback);
}

function fetch_blob_async_transaction(statement, id, column, row) {
    const infoValue = { row, column, value: '' };

    return (transactionArg) => {
        const singleTransaction = transactionArg === undefined;

        let promiseTransaction;
        if (singleTransaction) {
            promiseTransaction = new Promise((resolve, reject) => {
                statement.connection.startTransaction(Const.ISOLATION_READ_UNCOMMITTED, (err, transaction) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve(transaction);
                });
            });
        } else {
            promiseTransaction = Promise.resolve(transactionArg);
        }

        return promiseTransaction.then((transaction) => {
            return new Promise((resolve, reject) => {
                statement.connection._pending.push('openBlob');
                statement.connection.openBlob(id, transaction, (err, blob) => {

                    if (err) {
                        reject(err);
                        return;
                    }

                    const read = () => {
                        statement.connection.getSegment(blob, (err, ret) => {

                            if (err) {
                                if (singleTransaction) {
                                    transaction.rollback(() => reject(err));
                                } else {
                                    reject(err);
                                }
                                return;
                            }

                            if (ret.buffer) {
                                const blr = new BlrReader(ret.buffer);
                                const data = blr.readSegment();
                                infoValue.value += data.toString(Const.DEFAULT_ENCODING);
                            }

                            if (ret.handle !== 2) {
                                read();
                                return;
                            }

                            statement.connection.closeBlob(blob);
                            if (singleTransaction) {
                                transaction.commit((err) => {
                                    if (err) {
                                        reject(err);
                                    } else {
                                        resolve(infoValue);
                                    }
                                });
                            } else {
                                resolve(infoValue);
                            }
                        });
                    };

                    read();
                });
            });
        });
    };
}

function fetch_blob_async(statement, id, name, row) {
    const cbTransaction = (transaction, close, callback) => {
        statement.connection._pending.push('openBlob');
        statement.connection.openBlob(id, transaction, (err, blob) => {
            let e = new Events.EventEmitter();

            e.pipe = (stream) => {
                e.on('data', (chunk) => {
                    stream.write(chunk);
                });
                e.on('end', () => {
                    stream.end();
                });
            };

            if (err) {
                return callback(err, name, e, row);
            }

            const read = () => {
                statement.connection.getSegment(blob, (err, ret) => {

                    if (err) {
                        transaction.rollback(() => {
                            e.emit('error', err);
                        });
                        return;
                    }

                    if (ret.buffer) {
                        const blr = new BlrReader(ret.buffer);
                        const data = blr.readSegment();

                        e.emit('data', data);
                    }

                    if (ret.handle !== 2) {
                        read();
                        return;
                    }

                    statement.connection.closeBlob(blob);
                    if (close) {
                        transaction.commit((err) => {
                            if (err) {
                                e.emit('error', err);
                            } else {
                                e.emit('end');
                            }
                            e = null;
                        });
                    } else {
                        e.emit('end');
                        e = null;
                    }
                });
            };

            callback(err, name, e, row);
            read();
        });
    };

    return (transaction, callback) => {
        // callback(error, nameField, eventEmitter, row)
        const singleTransaction = callback === undefined;
        if (singleTransaction) {
            callback = transaction;
            statement.connection.startTransaction(Const.ISOLATION_READ_UNCOMMITTED, (err, transaction) => {
                if (err) {
                    callback(err);
                    return;
                }
                cbTransaction(transaction, singleTransaction, callback);
            });
        } else {
            cbTransaction(transaction, singleTransaction, callback);
        }
    };
}

Connection.prototype.fetch = function(statement, transaction, count, callback) {

    var msg = this._msg;
    var blr = this._blr;

    msg.pos = 0;
    blr.pos = 0;

    if (count instanceof Function) {
        callback = count;
        count = Const.DEFAULT_FETCHSIZE;
    }

    msg.addInt(Const.op_fetch);
    msg.addInt(statement.handle);
    CalcBlr(blr, statement.output);
    msg.addBlr(blr);
    msg.addInt(0); // message number
    msg.addInt(count || Const.DEFAULT_FETCHSIZE); // fetch count

    callback.statement = statement;
    this._queueEvent(callback);
};

Connection.prototype.fetchAll = function (statement, transaction, callback) {
    const self = this, data = [];
    const loop = (err, ret) => {
        if (err) {
            return callback(err);
        } else if (ret && ret.data && ret.data.length) {
            const arrPromise = (ret.arrBlob || []).map(value => value(transaction));

            Promise.all(arrPromise).then((arrBlob) => {
                for (let i = 0; i < arrBlob.length; i++) {
                    const blob = arrBlob[i];
                    ret.data[blob.row][blob.column] = blob.value;
                }

                const lastIndex = ret.data.length - 1;
                for (let i = 0; i < ret.data.length; i++) {
                    const pos = data.push(ret.data[i]);
                    if (statement.custom && statement.custom.asStream && statement.custom.on) {
                        statement.custom.on(ret.data[i], pos - 1);
                    }
                    if (i === lastIndex) {
                        if (ret.fetched) {
                            return callback(undefined, data);
                        } else {
                            self.fetch(statement, transaction, Const.DEFAULT_FETCHSIZE, loop);
                        }
                    }
                }
            }).catch(callback);
        } else if (ret.fetched) {
            callback(undefined, data);
        } else {
            self.fetch(statement, transaction, Const.DEFAULT_FETCHSIZE, loop);
        }
    }

    this.fetch(statement, transaction, Const.DEFAULT_FETCHSIZE, loop);
};


Connection.prototype.openBlob = function(blob, transaction, callback) {
    var msg = this._msg;
    msg.pos = 0;
    msg.addInt(Const.op_open_blob);
    msg.addInt(transaction.handle);
    msg.addQuad(blob);
    this._queueEvent(callback);
};

Connection.prototype.closeBlob = function(blob, callback) {
    var msg = this._msg;
    msg.pos = 0;
    msg.addInt(Const.op_close_blob);
    msg.addInt(blob.handle);
    this._queueEvent(callback);
};

Connection.prototype.getSegment = function(blob, callback) {
    var msg = this._msg;
    msg.pos = 0;
    msg.addInt(Const.op_get_segment);
    msg.addInt(blob.handle);
    msg.addInt(1024); // buffer length
    msg.addInt(0); // ???
    this._queueEvent(callback);
};

Connection.prototype.createBlob2 = function (transaction, callback) {
    var msg = this._msg;
    msg.pos = 0;
    msg.addInt(Const.op_create_blob2);
    msg.addInt(0);
    msg.addInt(transaction.handle);
    msg.addInt(0);
    msg.addInt(0);
    this._queueEvent(callback);
};

Connection.prototype.batchSegments = function(blob, buffer, callback){
    var msg = this._msg;
    var blr = this._blr;
    msg.pos = 0;
    blr.pos = 0;
    msg.addInt(Const.op_batch_segments);
    msg.addInt(blob.handle);
    msg.addInt(buffer.length + 2);
    blr.addBuffer(buffer);
    msg.addBlr(blr);
    this._queueEvent(callback);
};

Connection.prototype.svcattach = function (options, callback, svc) {
    this._lowercase_keys = options.lowercase_keys || Const.DEFAULT_LOWERCASE_KEYS;
    var database = options.database || options.filename;
    var user = options.user || Const.DEFAULT_USER;
    var password = options.password || Const.DEFAULT_PASSWORD;
    var role = options.role;
    var msg = this._msg;
    var blr = this._blr;
    msg.pos = 0;
    blr.pos = 0;

    blr.addBytes([Const.isc_dpb_version2, Const.isc_dpb_version2]);
    blr.addString(Const.isc_dpb_lc_ctype, 'UTF8', Const.DEFAULT_ENCODING);
    blr.addString(Const.isc_dpb_user_name, user, Const.DEFAULT_ENCODING);
    blr.addString(Const.isc_dpb_password, password, Const.DEFAULT_ENCODING);
    blr.addByte(Const.isc_dpb_dummy_packet_interval);
    blr.addByte(4);
    blr.addBytes([120, 10, 0, 0]); // FROM DOT NET PROVIDER
    if (role)
        blr.addString(Const.isc_dpb_sql_role_name, role, Const.DEFAULT_ENCODING);

    msg.addInt(Const.op_service_attach);
    msg.addInt(0);
    msg.addString(Const.DEFAULT_SVC_NAME, Const.DEFAULT_ENCODING); // only local for moment
    msg.addBlr(this._blr);

    var self = this;

    function cb(err, ret) {

        if (err) {
            doError(err, callback);
            return;
        }

        self.svchandle = ret.handle;
        if (callback)
            callback(undefined, ret);
    }

    // For reconnect
    if (svc) {
        svc.connection = this;
        cb.response = svc;
    } else {
        cb.response = new ServiceManager(this);
        cb.response.removeAllListeners('error');
        cb.response.on('error', noop);
    }

    this._queueEvent(cb);
}

Connection.prototype.svcstart = function (spbaction, callback) {
    var msg = this._msg;
    var blr = this._blr;
    msg.pos = 0;
    msg.addInt(Const.op_service_start);
    msg.addInt(this.svchandle);
    msg.addInt(0)
    msg.addBlr(spbaction);
    this._queueEvent(callback);
}

Connection.prototype.svcquery = function (spbquery, resultbuffersize, timeout,callback) {
    if (resultbuffersize > Const.MAX_BUFFER_SIZE) {
        doError(new Error('Buffer is too big'), callback);
        return;
    }

    var msg = this._msg;
    var blr = this._blr;
    msg.pos = 0;
    blr.pos = 0;
    blr.addByte(Const.isc_spb_current_version);
    //blr.addByteInt32(Const.isc_info_svc_timeout, timeout);
    msg.addInt(Const.op_service_info);
    msg.addInt(this.svchandle);
    msg.addInt(0);
    msg.addBlr(blr);
    blr.pos = 0
    blr.addBytes(spbquery);
    msg.addBlr(blr);
    msg.addInt(resultbuffersize);
    this._queueEvent(callback);
}

Connection.prototype.svcdetach = function (callback) {
    var self = this;

    if (self._isClosed)
        return;

    self._isUsed = false;
    self._isDetach = true;

    var msg = self._msg;

    msg.pos = 0;
    msg.addInt(Const.op_service_detach);
    msg.addInt(this.svchandle); // Database Object ID

    self._queueEvent(function (err, ret) {
        delete (self.svchandle);
        if (callback)
            callback(err, ret);
    });
}

function bufferReader(buffer, max, writer, cb, beg, end) {

    if (!beg)
        beg = 0;

    if (!end)
        end = max;

    if (end >= buffer.length)
        end = undefined;

    var b = buffer.slice(beg, end);

    writer(b, function() {

        if (end === undefined) {
            cb();
            return;
        }

        bufferReader(buffer, max, writer, cb, beg + max, end + max);
    });
}

Connection.prototype.auxConnection = function (callback) {
    var self = this;
    if (self._isClosed)
        return this.throwClosed(callback);
    var msg = self._msg;
    msg.pos = 0;
    msg.addInt(Const.op_connect_request);
    msg.addInt(1); // async
    msg.addInt(self.dbhandle);
    msg.addInt(0);
    function cb(err, ret) {

        if (err) {
            doError(err, callback);
            return;
        }

        var socket_info = {
            family: ret.buffer.readInt16BE(0),
            port: ret.buffer.readUInt16BE(2),
            host: ret.buffer.readUInt8(4) + '.' + ret.buffer.readUInt8(5) + '.' + ret.buffer.readUInt8(6) + '.' + ret.buffer.readUInt8(7)
        }

        callback(undefined, socket_info);
    }
    this._queueEvent(cb);
}

Connection.prototype.queEvents = function (events, eventid, callback) {
    var self = this;
    if (this._isClosed)
        return this.throwClosed(callback);
    var msg = this._msg;
    var blr = this._blr;
    blr.pos = 0;
    msg.pos = 0;
    msg.addInt(Const.op_que_events);
    msg.addInt(this.dbhandle);
    // prepare EPB
    blr.addByte(1) // epb_version
    for (var event in events) {
        var event_buffer = new Buffer(event, 'UTF8');
        blr.addByte(event_buffer.length);
        blr.addBytes(event_buffer);
        blr.addInt32(events[event]);
    }
    msg.addBlr(blr);    // epb    
    msg.addInt(0);    // ast
    msg.addInt(0);   // args
    msg.addInt(eventid);
    this._queueEvent(callback);
}

Connection.prototype.closeEvents = function (eventid, callback) {
    var self = this;
    if (this._isClosed)
        return this.throwClosed(callback);
    var msg = self._msg;
    msg.pos = 0;
    msg.addInt(Const.op_cancel_events);
    msg.addInt(self.dbhandle);
    msg.addInt(eventid);

    function cb(err, ret) {
        if (err) {
            doError(err, callback);
            return;
        }

        callback(err);
    }

    this._queueEvent(cb);
}

module.exports = Connection;


/***/ }),

/***/ 9957:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var call = Function.prototype.call;
var $hasOwn = Object.prototype.hasOwnProperty;
var bind = __webpack_require__(66743);

/** @type {import('.')} */
module.exports = bind.call(call, $hasOwn);


/***/ }),

/***/ 10076:
/***/ ((module) => {

"use strict";


/** @type {import('./functionCall')} */
module.exports = Function.prototype.call;


/***/ }),

/***/ 11002:
/***/ ((module) => {

"use strict";


/** @type {import('./functionApply')} */
module.exports = Function.prototype.apply;


/***/ }),

/***/ 12089:
/***/ ((module) => {

/***************************************
 *
 *   Simple Pooling
 *
 ***************************************/

function Pool(attach, max, options) {
    this.attach = attach;
    this.internaldb = []; // connection created by the pool (for destroy)
    this.pooldb = []; // available connection in the pool
    this.dbinuse = 0; // connection currently in use into the pool
    this.max = max || 4;
    this.pending = [];
    this.options = options;
}

Pool.prototype.get = function(callback) {
    var self = this;
    self.pending.push(callback);
    self.check();
    return self;
};

Pool.prototype.check = function() {

    var self = this;
    if (self.dbinuse >= self.max)
        return self;

    var cb = self.pending.shift();
    if (!cb)
        return self;
    self.dbinuse++;
    if (self.pooldb.length) {
        cb(null, self.pooldb.shift());
    } else {
        this.attach(self.options, function (err, db) {
            if (!err) {
                self.internaldb.push(db);
                db.on('detach', function () {
                    // also in pool (could be a twice call to detach)
                    if (self.pooldb.indexOf(db) !== -1 || self.internaldb.indexOf(db) === -1)
                        return;
                    // if not usable don't put in again in the pool and remove reference on it
                    if (db.connection._isClosed || db.connection._isDetach || db.connection._pooled === false)
                        self.internaldb.splice(self.internaldb.indexOf(db), 1);
                    else
                        self.pooldb.push(db);

                    if (db.connection._pooled)
                        self.dbinuse--;
                    self.check();
                });
            } else {
                // attach fail so not in the pool
                self.dbinuse--;
            }

            cb(err, db);
        });
    }
    setImmediate(function() {
        self.check();
    });

    return self;
};

Pool.prototype.destroy = function(callback) {
    var self = this;

    var connectionCount = this.internaldb.length;

    if (connectionCount === 0 && callback) {
        callback();
    }

    function detachCallback(err) {
        if (err) {
            if (callback) {
                callback(err);
            }
            return;
        }

        connectionCount--;
        if (connectionCount === 0 && callback) {
            callback();
        }
    }

    this.internaldb.forEach(function(db) {
        if (db.connection._pooled === false) {
            detachCallback();
            return;
        }
        // check if the db is not free into the pool otherwise user should manual detach it
        var _db_in_pool = self.pooldb.indexOf(db);
        if (_db_in_pool !== -1) {
            self.pooldb.splice(_db_in_pool, 1);
            db.connection._pooled = false;
            db.detach(detachCallback);
        }
    });
};

module.exports = Pool;


/***/ }),

/***/ 12194:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/**
 * @fileoverview Módulo para la conexión y consulta a la base de datos Magister Firebird.
 * Utiliza la librería 'node-firebird' para interactuar con la base de datos.
 */

const Firebird = __webpack_require__(7691);

/**
 * Construye las opciones de conexión a Firebird a partir de las variables de entorno.
 * @returns {object} Objeto con las opciones de conexión.
 */
const buildOptions = () => {
    // Para conexión directa, usa la IP pública del router (181.63.224.174)
    // que debe tener port forwarding configurado al servidor secundario (192.168.10.61:3050)
    const host = process.env.MAGISTER_DB_HOST || '181.63.224.174';
    // Puerto externo expuesto por el router (debe mapear a 3050 del servidor secundario)
    const port = parseInt(process.env.MAGISTER_DB_PORT || '3050', 10);
    const database = process.env.MAGISTER_DB_NAME || 'C:\\MaGister\\Datos\\MaGisterZ.Mgt';
    const user = process.env.MAGISTER_DB_USER || 'SYSDBA';
    const password = process.env.MAGISTER_DB_PASSWORD || 'masterqey';

    return {
        host,
        port,
        database,
        user,
        password,
        lowercase_keys: true,
        role: null,
        pageSize: 4096,
    };
};

/**
 * Valida que las opciones de conexión esenciales estén presentes.
 * @param {object} options - Opciones de conexión a validar.
 * @throws {Error} Si falta alguna opción de configuración crítica.
 */
const validateOptions = (options) => {
    const missing = [];
    if (!options.database) missing.push('MAGISTER_DB_NAME');
    if (!options.user) missing.push('MAGISTER_DB_USER');
    if (!options.password) missing.push('MAGISTER_DB_PASSWORD');
    if (missing.length) {
        throw new Error(`Falta configuración de la base de datos Magister: ${missing.join(', ')}`);
    }
};

/**
 * Intenta establecer una conexión a la base de datos Firebird usando es-node-firebird.
 * @returns {Promise<object>} Objeto `db` de la librería.
 * @throws {Error} Si ocurre un error durante la conexión.
 */
const attach = async () => {
    const options = buildOptions();
    validateOptions(options);

    console.log('🔌 [MagisterDB] ==================== INICIO DE CONEXIÓN DIRECTA ====================');
    console.log('🔌 [MagisterDB] Host:', options.host);
    console.log('🔌 [MagisterDB] Port:', options.port);
    console.log('🔌 [MagisterDB] Database:', options.database);
    console.log('🔌 [MagisterDB] User:', options.user);
    console.log('⚠️  [MagisterDB] NOTA: Conexión directa requiere port forwarding en el router');

    return new Promise((resolve, reject) => {
        const startTime = Date.now();

        Firebird.attach(options, (err, db) => {
            const elapsed = Date.now() - startTime;
            console.log(`🔌 [MagisterDB] Tiempo transcurrido: ${elapsed}ms`);

            if (err) {
                console.error('❌ [MagisterDB] ==================== ERROR DE CONEXIÓN ====================');
                console.error('❌ [MagisterDB] Contexto de conexión:', {
                    host: options.host,
                    port: options.port,
                    database: options.database,
                    user: options.user,
                });
                console.error('❌ [MagisterDB] Error message:', err.message);
                console.error('❌ [MagisterDB] Error name:', err.name);
                console.error('❌ [MagisterDB] Error code:', err.code);
                console.error('❌ [MagisterDB] Error errno:', err.errno);
                console.error('❌ [MagisterDB] Error syscall:', err.syscall);
                console.error('❌ [MagisterDB] Error gdscode:', err.gdscode);
                console.error('❌ [MagisterDB] Stack:', err.stack);
                console.error('❌ [MagisterDB] Objeto de error completo:', JSON.stringify(err, Object.getOwnPropertyNames(err), 2));
                console.error('❌ [MagisterDB] ==================== FIN ERROR ====================');
                return reject(err);
            }

            console.log('✅ [MagisterDB] ==================== CONEXIÓN EXITOSA ====================');
            console.log('✅ [MagisterDB] Conexión establecida correctamente');
            console.log('✅ [MagisterDB] Tiempo de conexión:', elapsed, 'ms');
            return resolve(db);
        });
    });
};

/**
 * Ejecuta una consulta SQL en la base de datos Magister.
 * @param {string} sql - La consulta SQL a ejecutar.
 * @param {Array<any>} [params=[]] - Parámetros para la consulta.
 * @returns {Promise<Array<object>>} Una promesa que resuelve con los resultados de la consulta.
 * @throws {Error} Si ocurre un error durante la conexión o la consulta.
 */
const queryMagister = async (sql, params = []) => {
    console.log('🧪 [MagisterDB] Ejecutando query (firebirdsql):', sql);
    const db = await attach();
    try {
        return await new Promise((resolve, reject) => {
            db.query(sql, params, (err, result) => {
                if (err) {
                    console.error('❌ [MagisterDB] Error en query:', err.message);
                    console.error('❌ [MagisterDB] Error completo:', JSON.stringify(err, null, 2));
                    if (err.code) {
                        console.error('❌ [MagisterDB] Code:', err.code);
                    }
                    if (err.errno) {
                        console.error('❌ [MagisterDB] Errno:', err.errno);
                    }
                    if (err.syscall) {
                        console.error('❌ [MagisterDB] Syscall:', err.syscall);
                    }
                    if (err.gdscode) {
                        console.error('❌ [MagisterDB] GDScode:', err.gdscode);
                    }
                    return reject(err);
                }
                console.log(`✅ [MagisterDB] Query ejecutada: ${result ? result.length : 0} filas`);
                return resolve(result || []);
            });
        });
    } finally {
        db.detach();
        console.log('🔌 [MagisterDB] Conexión cerrada');
    }
};

const testConnection = async () => {
    console.log('🧪 [MagisterDB] Probando conexión básica (sin ejecutar SQL)...');
    const db = await attach();
    try {
        console.log('✅ [MagisterDB] Conexión básica establecida, cerrando...');
        return { ok: true };
    } finally {
        db.detach();
        console.log('🔌 [MagisterDB] Conexión cerrada (testConnection)');
    }
};

module.exports = {
    queryMagister,
    testConnection,
};



/***/ }),

/***/ 13144:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var bind = __webpack_require__(66743);

var $apply = __webpack_require__(11002);
var $call = __webpack_require__(10076);
var $reflectApply = __webpack_require__(47119);

/** @type {import('./actualApply')} */
module.exports = $reflectApply || bind.call($call, $apply);


/***/ }),

/***/ 16928:
/***/ ((module) => {

"use strict";
module.exports = require("path");

/***/ }),

/***/ 17833:
/***/ ((module, exports, __webpack_require__) => {

/* eslint-env browser */

/**
 * This is the web browser implementation of `debug()`.
 */

exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;
exports.storage = localstorage();
exports.destroy = (() => {
	let warned = false;

	return () => {
		if (!warned) {
			warned = true;
			console.warn('Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.');
		}
	};
})();

/**
 * Colors.
 */

exports.colors = [
	'#0000CC',
	'#0000FF',
	'#0033CC',
	'#0033FF',
	'#0066CC',
	'#0066FF',
	'#0099CC',
	'#0099FF',
	'#00CC00',
	'#00CC33',
	'#00CC66',
	'#00CC99',
	'#00CCCC',
	'#00CCFF',
	'#3300CC',
	'#3300FF',
	'#3333CC',
	'#3333FF',
	'#3366CC',
	'#3366FF',
	'#3399CC',
	'#3399FF',
	'#33CC00',
	'#33CC33',
	'#33CC66',
	'#33CC99',
	'#33CCCC',
	'#33CCFF',
	'#6600CC',
	'#6600FF',
	'#6633CC',
	'#6633FF',
	'#66CC00',
	'#66CC33',
	'#9900CC',
	'#9900FF',
	'#9933CC',
	'#9933FF',
	'#99CC00',
	'#99CC33',
	'#CC0000',
	'#CC0033',
	'#CC0066',
	'#CC0099',
	'#CC00CC',
	'#CC00FF',
	'#CC3300',
	'#CC3333',
	'#CC3366',
	'#CC3399',
	'#CC33CC',
	'#CC33FF',
	'#CC6600',
	'#CC6633',
	'#CC9900',
	'#CC9933',
	'#CCCC00',
	'#CCCC33',
	'#FF0000',
	'#FF0033',
	'#FF0066',
	'#FF0099',
	'#FF00CC',
	'#FF00FF',
	'#FF3300',
	'#FF3333',
	'#FF3366',
	'#FF3399',
	'#FF33CC',
	'#FF33FF',
	'#FF6600',
	'#FF6633',
	'#FF9900',
	'#FF9933',
	'#FFCC00',
	'#FFCC33'
];

/**
 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
 * and the Firebug extension (any Firefox version) are known
 * to support "%c" CSS customizations.
 *
 * TODO: add a `localStorage` variable to explicitly enable/disable colors
 */

// eslint-disable-next-line complexity
function useColors() {
	// NB: In an Electron preload script, document will be defined but not fully
	// initialized. Since we know we're in Chrome, we'll just detect this case
	// explicitly
	if (typeof window !== 'undefined' && window.process && (window.process.type === 'renderer' || window.process.__nwjs)) {
		return true;
	}

	// Internet Explorer and Edge do not support colors.
	if (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) {
		return false;
	}

	let m;

	// Is webkit? http://stackoverflow.com/a/16459606/376773
	// document is undefined in react-native: https://github.com/facebook/react-native/pull/1632
	// eslint-disable-next-line no-return-assign
	return (typeof document !== 'undefined' && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance) ||
		// Is firebug? http://stackoverflow.com/a/398120/376773
		(typeof window !== 'undefined' && window.console && (window.console.firebug || (window.console.exception && window.console.table))) ||
		// Is firefox >= v31?
		// https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
		(typeof navigator !== 'undefined' && navigator.userAgent && (m = navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/)) && parseInt(m[1], 10) >= 31) ||
		// Double check webkit in userAgent just in case we are in a worker
		(typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/));
}

/**
 * Colorize log arguments if enabled.
 *
 * @api public
 */

function formatArgs(args) {
	args[0] = (this.useColors ? '%c' : '') +
		this.namespace +
		(this.useColors ? ' %c' : ' ') +
		args[0] +
		(this.useColors ? '%c ' : ' ') +
		'+' + module.exports.humanize(this.diff);

	if (!this.useColors) {
		return;
	}

	const c = 'color: ' + this.color;
	args.splice(1, 0, c, 'color: inherit');

	// The final "%c" is somewhat tricky, because there could be other
	// arguments passed either before or after the %c, so we need to
	// figure out the correct index to insert the CSS into
	let index = 0;
	let lastC = 0;
	args[0].replace(/%[a-zA-Z%]/g, match => {
		if (match === '%%') {
			return;
		}
		index++;
		if (match === '%c') {
			// We only are interested in the *last* %c
			// (the user may have provided their own)
			lastC = index;
		}
	});

	args.splice(lastC, 0, c);
}

/**
 * Invokes `console.debug()` when available.
 * No-op when `console.debug` is not a "function".
 * If `console.debug` is not available, falls back
 * to `console.log`.
 *
 * @api public
 */
exports.log = console.debug || console.log || (() => {});

/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */
function save(namespaces) {
	try {
		if (namespaces) {
			exports.storage.setItem('debug', namespaces);
		} else {
			exports.storage.removeItem('debug');
		}
	} catch (error) {
		// Swallow
		// XXX (@Qix-) should we be logging these?
	}
}

/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */
function load() {
	let r;
	try {
		r = exports.storage.getItem('debug') || exports.storage.getItem('DEBUG') ;
	} catch (error) {
		// Swallow
		// XXX (@Qix-) should we be logging these?
	}

	// If debug isn't set in LS, and we're in Electron, try to load $DEBUG
	if (!r && typeof process !== 'undefined' && 'env' in process) {
		r = process.env.DEBUG;
	}

	return r;
}

/**
 * Localstorage attempts to return the localstorage.
 *
 * This is necessary because safari throws
 * when a user disables cookies/localstorage
 * and you attempt to access it.
 *
 * @return {LocalStorage}
 * @api private
 */

function localstorage() {
	try {
		// TVMLKit (Apple TV JS Runtime) does not have a window object, just localStorage in the global context
		// The Browser also has localStorage in the global context.
		return localStorage;
	} catch (error) {
		// Swallow
		// XXX (@Qix-) should we be logging these?
	}
}

module.exports = __webpack_require__(40736)(exports);

const {formatters} = module.exports;

/**
 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
 */

formatters.j = function (v) {
	try {
		return JSON.stringify(v);
	} catch (error) {
		return '[UnexpectedJSONParseError]: ' + error.message;
	}
};


/***/ }),

/***/ 18798:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var iterate    = __webpack_require__(78051)
  , initState  = __webpack_require__(19500)
  , terminator = __webpack_require__(26276)
  ;

// Public API
module.exports = parallel;

/**
 * Runs iterator over provided array elements in parallel
 *
 * @param   {array|object} list - array or object (named list) to iterate over
 * @param   {function} iterator - iterator to run
 * @param   {function} callback - invoked when all elements processed
 * @returns {function} - jobs terminator
 */
function parallel(list, iterator, callback)
{
  var state = initState(list);

  while (state.index < (state['keyedList'] || list).length)
  {
    iterate(list, iterator, state, function(error, result)
    {
      if (error)
      {
        callback(error, result);
        return;
      }

      // looks like it's the last one
      if (Object.keys(state.jobs).length === 0)
      {
        callback(null, state.results);
        return;
      }
    });

    state.index++;
  }

  return terminator.bind(state, callback);
}


/***/ }),

/***/ 19500:
/***/ ((module) => {

// API
module.exports = state;

/**
 * Creates initial state object
 * for iteration over list
 *
 * @param   {array|object} list - list to iterate over
 * @param   {function|null} sortMethod - function to use for keys sort,
 *                                     or `null` to keep them as is
 * @returns {object} - initial state object
 */
function state(list, sortMethod)
{
  var isNamedList = !Array.isArray(list)
    , initState =
    {
      index    : 0,
      keyedList: isNamedList || sortMethod ? Object.keys(list) : null,
      jobs     : {},
      results  : isNamedList ? {} : [],
      size     : isNamedList ? Object.keys(list).length : list.length
    }
    ;

  if (sortMethod)
  {
    // sort array keys based on it's values
    // sort object's keys just on own merit
    initState.keyedList.sort(isNamedList ? sortMethod : function(a, b)
    {
      return sortMethod(list[a], list[b]);
    });
  }

  return initState;
}


/***/ }),

/***/ 21516:
/***/ ((module) => {

/***************************************
 *
 *   Statement
 *
 ***************************************/

function Statement(connection) {
    this.connection = connection;
}

Statement.prototype.close = function(callback) {
    this.connection.closeStatement(this, callback);
};

Statement.prototype.drop = function(callback) {
    this.connection.dropStatement(this, callback);
};

Statement.prototype.release = function(callback) {
    var cache_query = this.connection.getCachedQuery(this.query);
    if (cache_query)
        this.connection.closeStatement(this, callback);
    else
        this.connection.dropStatement(this, callback);
};

Statement.prototype.execute = function(transaction, params, callback, custom) {

    if (params instanceof Function) {
        custom = callback;
        callback = params;
        params = undefined;
    }

    this.custom = custom;
    this.connection.executeStatement(transaction, this, params, callback, custom);
};

Statement.prototype.fetch = function(transaction, count, callback) {
    this.connection.fetch(this, transaction, count, callback);
};

Statement.prototype.fetchAll = function(transaction, callback) {
    this.connection.fetchAll(this, transaction, callback);
};

module.exports = Statement;


/***/ }),

/***/ 21873:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports =
{
  parallel      : __webpack_require__(18798),
  serial        : __webpack_require__(52081),
  serialOrdered : __webpack_require__(90028)
};


/***/ }),

/***/ 23652:
/***/ ((module) => {

"use strict";
module.exports = /*#__PURE__*/JSON.parse('{"335544321":"Arithmetic exception, numeric overflow, or string truncation","335544322":"Invalid database key","335544323":"File @1 is not a valid database","335544324":"Invalid database handle (no active connection)","335544325":"Bad parameters on attach or create database","335544326":"Unrecognized database parameter block","335544327":"Invalid request handle","335544328":"Invalid BLOB handle","335544329":"Invalid BLOB ID","335544330":"Invalid parameter in transaction parameter block","335544331":"Invalid format for transaction parameter block","335544332":"Invalid transaction handle (expecting explicit transaction start)","335544333":"Internal gds software consistency check (@1)","335544334":"Conversion error from string \\"@1\\"","335544335":"Database file appears corrupt (@1)","335544336":"Deadlock","335544337":"Attempt to start more than @1 transactions","335544338":"No match for first value expression","335544339":"Information type inappropriate for object specified","335544340":"No information of this type available for object specified","335544341":"Unknown information item","335544342":"Action cancelled by trigger (@1) to preserve data integrity","335544343":"Invalid request BLR at offset @1","335544344":"I/O error for file \\"@2\\"","335544345":"Lock conflict on no wait transaction","335544346":"Corrupt system table","335544347":"Validation error for column @1, value \\"@2\\"","335544348":"No current record for fetch operation","335544349":"Attempt to store duplicate value ( visible to active transactions ) in unique index \\"@1\\"","335544350":"Program attempted to exit without finishing database","335544351":"Unsuccessful metadata update","335544352":"No permission for @1 access to @2 @3","335544353":"Transaction is not in limbo","335544354":"Invalid database key","335544355":"BLOB was not closed","335544356":"Metadata is obsolete","335544357":"Cannot disconnect database with open transactions (@1 active)","335544358":"Message length error ( encountered @1, expected @2)","335544359":"Attempted update of read - only column","335544360":"Attempted update of read-only table","335544361":"Attempted update during read - only transaction","335544362":"Cannot update read-only view @1","335544363":"No transaction for request","335544364":"Request synchronization error","335544365":"Request referenced an unavailable database","335544366":"Segment buffer length shorter than expected","335544367":"Attempted retrieval of more segments than exist","335544368":"Attempted invalid operation on a BLOB","335544369":"Attempted read of a new, open BLOB","335544370":"Attempted action on blob outside transaction","335544371":"Attempted write to read-only BLOB","335544372":"Attempted reference to BLOB in unavailable database","335544373":"Operating system directive @1 failed","335544374":"Attempt to fetch past the last record in a record stream","335544375":"Unavailable database","335544376":"Table @1 was omitted from the transaction reserving list","335544377":"Request includes a DSRI extension not supported in this implementation","335544378":"Feature is not supported","335544379":"Unsupported on - disk structure for file @1; found @2.@3, support @4.@5","335544380":"Wrong number of arguments on call","335544381":"Implementation limit exceeded","335544382":"@1","335544383":"Unrecoverable conflict with limbo transaction @1","335544384":"Internal error","335544385":"Internal error","335544386":"Too many requests","335544387":"Internal error","335544388":"Block size exceeds implementation restriction","335544389":"Buffer exhausted","335544390":"BLR syntax error: expected @1 at offset @2, encountered @3","335544391":"Buffer in use","335544392":"Internal error","335544393":"Request in use","335544394":"Incompatible version of on-disk structure","335544395":"Table @1 is not defined","335544396":"Column @1 is not defined in table @2","335544397":"Internal error","335544398":"Internal error","335544399":"Internal error","335544400":"Internal error","335544401":"Internal error","335544402":"Internal error","335544403":"Page @1 is of wrong type (expected @2, found @3)","335544404":"Database corrupted","335544405":"Checksum error on database page @1","335544406":"Index is broken","335544407":"Database handle not zero","335544408":"Transaction handle not zero","335544409":"Transaction - request mismatch ( synchronization error )","335544410":"Bad handle count","335544411":"Wrong version of transaction parameter block","335544412":"Unsupported BLR version (expected @1, encountered @2)","335544413":"Wrong version of database parameter block","335544414":"BLOB and array data types are not supported for @1 operation","335544415":"Database corrupted","335544416":"Internal error","335544417":"Internal error","335544418":"Transaction in limbo","335544419":"Transaction not in limbo","335544420":"Transaction outstanding","335544421":"Connection rejected by remote interface","335544422":"Internal error","335544423":"Internal error","335544424":"No lock manager available","335544425":"Context already in use (BLR error)","335544426":"Context not defined (BLR error)","335544427":"Data operation not supported","335544428":"Undefined message number","335544429":"Bad parameter number","335544430":"Unable to allocate memory from operating system","335544431":"Blocking signal has been received","335544432":"Lock manager error","335544433":"communication error with journal \\"@1\\"","335544434":"Key size exceeds implementation restriction for index \\"@1\\"","335544435":"Null segment of UNIQUE KEY","335544436":"SQL error code = @1","335544437":"Wrong DYN version","335544438":"Function @1 is not defined","335544439":"Function @1 could not be matched","335544440":"-","335544441":"Database detach completed with errors","335544442":"Database system cannot read argument @1","335544443":"Database system cannot write argument @1","335544444":"Operation not supported","335544445":"@1 extension error","335544446":"Not updatable","335544447":"No rollback performed","335544448":"[no associated message]","335544449":"[no associated message]","335544450":"@1","335544451":"Update conflicts with concurrent update","335544452":"product @1 is not licensed","335544453":"Object @1 is in use","335544454":"Filter not found to convert type @1 to type @2","335544455":"Cannot attach active shadow file","335544456":"Invalid slice description language at offset @1","335544457":"Subscript out of bounds","335544458":"Column not array or invalid dimensions (expected @1, encountered @2)","335544459":"Record from transaction @1 is stuck in limbo","335544460":"A file in manual shadow @1 is unavailable","335544461":"Secondary server attachments cannot validate databases","335544462":"secondary server attachments cannot start journaling","335544463":"Generator @1 is not defined","335544464":"Secondary server attachments cannot start logging","335544465":"Invalid BLOB type for operation","335544466":"Violation of FOREIGN KEY constraint \\"@1\\" on table \\"@2\\"","335544467":"Minor version too high found @1 expected @2","335544468":"Transaction @1 is @2","335544469":"Transaction marked invalid by I/O error","335544470":"Cache buffer for page @1 invalid","335544471":"There is no index in table @1 with id @2","335544472":"Your user name and password are not defined. Ask your database\\nadministrator to set up a Firebird login\\n","335544473":"Invalid bookmark handle","335544474":"Invalid lock level @1","335544475":"Lock on table @1 conflicts with existing lock","335544476":"Requested record lock conflicts with existing lock","335544477":"Maximum indexes per table (@1) exceeded","335544478":"enable journal for database before starting online dump","335544479":"online dump failure. Retry dump","335544480":"an online dump is already in progress","335544481":"no more disk/tape space.  Cannot continue online dump","335544482":"journaling allowed only if database has Write-ahead Log","335544483":"maximum number of online dump files that can be specified is 16","335544484":"error in opening Write-ahead Log file during recovery","335544485":"Invalid statement handle","335544486":"Write-ahead log subsystem failure","335544487":"WAL Writer error","335544488":"Log file header of @1 too small","335544489":"Invalid version of log file @1","335544490":"Log file @1 not latest in the chain but open flag still set","335544491":"Log file @1 not closed properly; database recovery may be required","335544492":"Database name in the log file @1 is different","335544493":"Unexpected end of log file @1 at offset @2","335544494":"Incomplete log record at offset @1 in log file @2","335544495":"Log record header too small at offset @1 in log file @","335544496":"Log block too small at offset @1 in log file @2","335544497":"Illegal attempt to attach to an uninitialized WAL segment for @1","335544498":"Invalid WAL parameter block option @1","335544499":"Cannot roll over to the next log file @1","335544500":"Database does not use Write-ahead Log","335544501":"cannot drop log file when journaling is enabled","335544502":"Reference to invalid stream number","335544503":"WAL subsystem encountered error","335544504":"WAL subsystem corrupted","335544505":"must specify archive file when enabling long term journal for databases with round-robin log files","335544506":"Database @1 shutdown in progress","335544507":"Refresh range number @1 already in use","335544508":"Refresh range number @1 not found","335544509":"CHARACTER SET @1 is not defined","335544510":"Lock time-out on wait transaction","335544511":"Procedure @1 is not defined","335544512":"Input parameter mismatch for procedure @1","335544513":"Database @1: WAL subsystem bug for pid @2\\n@3","335544514":"Could not expand the WAL segment for database @1","335544515":"Status code @1 unknown","335544516":"Exception @1 not defined","335544517":"Exception @1","335544518":"Restart shared cache manager","335544519":"Invalid lock handle","335544520":"long-term journaling already enabled","335544521":"Unable to roll over please see Firebird log.","335544522":"WAL I/O error.  Please see Firebird log.","335544523":"WAL writer - Journal server communication error.  Please see Firebird log.","335544524":"WAL buffers cannot be increased.  Please see Firebird log.","335544525":"WAL setup error.  Please see Firebird log.","335544526":"obsolete","335544527":"Cannot start WAL writer for the database @1","335544528":"Database @1 shutdown","335544529":"Cannot modify an existing user privilege","335544530":"Cannot delete PRIMARY KEY being used in FOREIGN KEY definition","335544531":"Column used in a PRIMARY constraint must be NOT NULL","335544532":"Name of Referential Constraint not defined in constraints table","335544533":"Non-existent PRIMARY or UNIQUE KEY specified for FOREIGN KEY","335544534":"Cannot update constraints (RDB$REF_CONSTRAINTS)","335544535":"Cannot update constraints (RDB$CHECK_CONSTRAINTS)","335544536":"Cannot delete CHECK constraint entry (RDB$CHECK_CONSTRAINTS)","335544537":"Cannot delete index segment used by an Integrity Constraint","335544538":"Cannot update index segment used by an Integrity Constraint","335544539":"Cannot delete index used by an Integrity Constraint","335544540":"Cannot modify index used by an Integrity Constraint","335544541":"Cannot delete trigger used by a CHECK Constraint","335544542":"Cannot update trigger used by a CHECK Constraint","335544543":"Cannot delete column being used in an Integrity Constraint","335544544":"Cannot rename column being used in an Integrity Constraint","335544545":"Cannot update constraints (RDB$RELATION_CONSTRAINTS)","335544546":"Cannot define constraints on views","335544547":"Internal gds software consistency check (invalid RDB$CONSTRAINT_TYPE)","335544548":"Attempt to define a second PRIMARY KEY for the same table","335544549":"Cannot modify or erase a system trigger","335544550":"Only the owner of a table may reassign ownership","335544551":"Could not find table/procedure for GRANT","335544552":"Could not find column for GRANT","335544553":"User does not have GRANT privileges for operation","335544554":"Table/procedure has non-SQL security class defined","335544555":"Column has non-SQL security class defined","335544556":"Write-ahead Log without shared cache configuration not allowed","335544557":"Database shutdown unsuccessful","335544558":"Operation violates check constraint @1 on view or table @2","335544559":"Invalid service handle","335544560":"Database @1 shutdown in @2 seconds","335544561":"Wrong version of service parameter block","335544562":"Unrecognized service parameter block","335544563":"Service @1 is not defined","335544564":"long-term journaling not enabled","335544565":"Cannot transliterate character between character sets","335544566":"WAL defined; Cache Manager must be started first","335544567":"Overflow log specification required for round-robin log","335544568":"Implementation of text subtype @1 not located","335544569":"Dynamic SQL Error","335544570":"Invalid command","335544571":"Data type for constant unknown","335544572":"Invalid cursor reference","335544573":"Data type unknown","335544574":"Invalid cursor declaration","335544575":"Cursor @1 is not updatable","335544576":"Attempt to reopen an open cursor","335544577":"Attempt to reclose a closed cursor","335544578":"Column unknown","335544579":"Internal error","335544580":"Table unknown","335544581":"Procedure unknown","335544582":"Request unknown","335544583":"SQLDA missing or incorrect version, or incorrect number/type of variables","335544584":"Count of read - write columns does not equal count of values","335544585":"Invalid statement handle","335544586":"Function unknown","335544587":"Column is not a BLOB","335544588":"COLLATION @1 for CHARACTER SET @2 is not defined","335544589":"COLLATION @1 is not valid for specified CHARACTER SET","335544590":"Option specified more than once","335544591":"Unknown transaction option","335544592":"Invalid array reference","335544593":"Array declared with too many dimensions","335544594":"Illegal array dimension range","335544595":"Trigger unknown","335544596":"Subselect illegal in this context","335544597":"Cannot prepare a CREATE DATABASE/SCHEMA statement","335544598":"Must specify column name for view select expression","335544599":"Number of columns does not match select list","335544600":"Only simple column names permitted for VIEW WITH CHECK OPTION","335544601":"No WHERE clause for VIEW WITH CHECK OPTION","335544602":"Only one table allowed for VIEW WITH CHECK OPTION","335544603":"DISTINCT, GROUP or HAVING not permitted for VIEW WITH CHECK OPTION","335544604":"FOREIGN KEY column count does not match PRIMARY KEY","335544605":"No subqueries permitted for VIEW WITH CHECK OPTION","335544606":"Expression evaluation not supported","335544607":"Gen.c: node not supported","335544608":"Unexpected end of command","335544609":"INDEX @1","335544610":"EXCEPTION @1","335544611":"COLUMN @1","335544612":"Token unknown","335544613":"Union not supported","335544614":"Unsupported DSQL construct","335544615":"Column used with aggregate","335544616":"Invalid column reference","335544617":"Invalid ORDER BY clause","335544618":"Return mode by value not allowed for this data type","335544619":"External functions cannot have morethan 10 parametrs","335544620":"Alias @1 conflicts with an alias in the same statement","335544621":"Alias @1 conflicts with a procedure in the same statement","335544622":"Alias @1 conflicts with a table in the same statement","335544623":"Illegal use of keyword VALUE","335544624":"Segment count of 0 defined for index @1","335544625":"A node name is not permitted in a secondary, shadow, cache or log file name","335544626":"TABLE @1","335544627":"PROCEDURE @1","335544628":"Cannot create index @1","335544629":"Write-ahead Log with shadowing configuration not allowed","335544630":"There are @1 dependencies","335544631":"Too many keys defined for index @1","335544632":"Preceding file did not specify length, so @1 must include starting page number","335544633":"Shadow number must be a positive integer","335544634":"Token unknown - line @1, column @2","335544635":"There is no alias or table named @1 at this scope level","335544636":"There is no index @1 for table @2","335544637":"Table @1 is not referenced in plan","335544638":"Table @1 is referenced more than once in plan; use aliases to distinguish","335544639":"Table @1 is referenced in the plan but not the from list","335544640":"Invalid use of CHARACTER SET or COLLATE","335544641":"Specified domain or source column @1 does not exist","335544642":"Index @1 cannot be used in the specified plan","335544643":"The table @1 is referenced twice; use aliases to differentiate","335544644":"Illegal operation when at beginning of stream","335544645":"The current position is on a crack","335544646":"Database or file exists","335544647":"Invalid comparison operator for find operation","335544648":"Connection lost to pipe server","335544649":"Bad checksum","335544650":"Wrong page type","335544651":"Cannot insert because the file is readonly or is on a read only medium","335544652":"Multiple rows in singleton select","335544653":"Cannot attach to password database","335544654":"Cannot start transaction for password database","335544655":"Invalid direction for find operation","335544656":"Variable @1 conflicts with parameter in same procedure","335544657":"Array/BLOB/DATE data types not allowed in arithmetic","335544658":"@1 is not a valid base table of the specified view","335544659":"Table @1 is referenced twice in view; use an alias to distinguish","335544660":"View @1 has more than one base table; use aliases to distinguish","335544661":"Cannot add index, index root page is full","335544662":"BLOB SUB_TYPE @1 is not defined","335544663":"Too many concurrent executions of the same request","335544664":"Duplicate specification of @1- not supported","335544665":"Violation of PRIMARY or UNIQUE KEY constraint \\"@1\\" on table \\"@2\\"","335544666":"Server version too old to support all CREATE DATABASE options","335544667":"Drop database completed with errors","335544668":"Procedure @1 does not return any values","335544669":"Count of column list and variable list do not match","335544670":"Attempt to index BLOB column in index @1","335544671":"Attempt to index array column in index @1","335544672":"Too few key columns found for index @1 (incorrect column name?)","335544673":"Cannot delete","335544674":"Last column in a table cannot be deleted","335544675":"Sort error","335544676":"Sort error: not enough memory","335544677":"Too many versions","335544678":"Invalid key position","335544679":"Segments not allowed in expression index @1","335544680":"Sort error: corruption in data structure","335544681":"New record size of @1 bytes is too big","335544682":"Inappropriate self-reference of column","335544683":"Request depth exceeded. (Recursive definition?)","335544684":"Cannot access column @1 in view @2","335544685":"Dbkey not available for multi - table views","335544686":"journal file wrong format","335544687":"intermediate journal file full","335544688":"The prepare statement identifies a prepare statement with an open cursor","335544689":"Firebird error","335544690":"Cache redefined","335544691":"Insufficient memory to allocate page buffer cache","335544692":"Log redefined","335544693":"Log size too small","335544694":"Log partition size too small","335544695":"Partitions not supported in series of log file specification","335544696":"Total length of a partitioned log must be specified","335544697":"Precision must be from 1 to 18","335544698":"Scale must be between zero and precision","335544699":"Short integer expected","335544700":"Long integer expected","335544701":"Unsigned short integer expected","335544702":"Invalid ESCAPE sequence","335544703":"Service @1 does not have an associated executable","335544704":"Failed to locate host machine","335544705":"Undefined service @1/@2","335544706":"The specified name was not found in the hosts file or Domain Name Services","335544707":"User does not have GRANT privileges on base table/view for operation","335544708":"Ambiguous column reference","335544709":"Invalid aggregate reference","335544710":"Navigational stream @1 references a view with more than one base table","335544711":"Attempt to execute an unprepared dynamic SQL statement","335544712":"Positive value expected","335544713":"Incorrect values within SQLDA structure","335544714":"Invalid blob id","335544715":"Operation not supported for EXTERNAL FILE table @1","335544716":"Service is currently busy: @1","335544717":"Stack size insufficent to execute current request","335544718":"Invalid key for find operation","335544719":"Error initializing the network software.","335544720":"Unable to load required library @1.","335544721":"Unable to complete network request to host \\"@1\\"","335544722":"Failed to establish a connection","335544723":"Error while listening for an incoming connection","335544724":"Failed to establish a secondary connection for event processing","335544725":"Error while listening for an incoming event connection request","335544726":"Error reading data from the connection","335544727":"Error writing data to the connection","335544728":"Cannot deactivate index used by an integrity constraint","335544729":"Cannot deactivate index used by a PRIMARY/UNIQUE constraint","335544730":"Client/Server Express not supported in this release","335544731":"[no associated message]","335544732":"Access to databases on file servers is not supported","335544733":"Error while trying to create file","335544734":"Error while trying to open file","335544735":"Error while trying to close file","335544736":"Error while trying to read from file","335544737":"Error while trying to write to file","335544738":"Error while trying to delete file","335544739":"Error while trying to access file","335544740":"A fatal exception occurred during the execution of a user defined function","335544741":"Connection lost to database","335544742":"User cannot write to RDB$USER_PRIVILEGES","335544743":"Token size exceeds limit","335544744":"Maximum user count exceeded.Contact your database administrator","335544745":"Your login @1 is same as one of the SQL role name. Ask your\\ndatabase administrator to set up a valid Firebird login.\\n","335544746":"\\"REFERENCES table\\" without \\"(column)\\" requires PRIMARY KEY on referenced table","335544747":"The username entered is too long. Maximum length is 31 bytes","335544748":"The password specified is too long. Maximum length is @1 bytes","335544749":"A username is required for this operation","335544750":"A password is required for this operation","335544751":"The network protocol specified is invalid","335544752":"A duplicate user name was found in the security database","335544753":"The user name specified was not found in the security database","335544754":"An error occurred while attempting to add the user","335544755":"An error occurred while attempting to modify the user record","335544756":"An error occurred while attempting to delete the user record","335544757":"An error occurred while updating the security database","335544758":"Sort record size of @1 bytes is too big ????","335544759":"Can not define a not null column with NULL as default value","335544760":"Invalid clause - \'@1\'","335544761":"Too many open handles to database","335544762":"size of optimizer block exceeded","335544763":"A string constant is delimited by double quotes","335544764":"DATE must be changed to TIMESTAMP","335544765":"Attempted update on read - only database","335544766":"SQL dialect @1 is not supported in this database","335544767":"A fatal exception occurred during the execution of a blob filter","335544768":"Access violation.The code attempted to access a virtual address without privilege to do so","335544769":"Datatype misalignment.The attempted to read or write a value that was not\\nstored on a memory boundary\\n","335544770":"Array bounds exceeded. The code attempted to access an array element that is\\nout of bounds.\\n","335544771":"Float denormal operand.One of the floating-point operands is too small to\\nrepresent a standard float value.\\n","335544772":"Floating-point divide by zero.The code attempted to divide a floating-point\\nvalue by zero.\\n","335544773":"Floating-point inexact result.The result of a floating-point operation cannot\\nbe represented as a decimal fraction\\n","335544774":"Floating-point invalid operand.An indeterminant error occurred during a\\nfloating-point operation\\n","335544775":"Floating-point overflow.The exponent of a floating-point operation is\\ngreater than the magnitude allowed\\n","335544776":"Floating-point stack check.The stack overflowed or underflowed as the\\nresult of a floating-point operation\\n","335544777":"Floating-point underflow.The exponent of a floating-point operation is\\nless than the magnitude allowed\\n","335544778":"Integer divide by zero.The code attempted to divide an integer value by\\nan integer divisor of zero\\n","335544779":"Integer overflow.The result of an integer operation caused the most\\nsignificant bit of the result to carry\\n","335544780":"An exception occurred that does not have a description.Exception number @1","335544781":"Stack overflow.The resource requirements of the runtime stack have exceeded\\nthe memory available to it\\n","335544782":"Segmentation Fault. The code attempted to access memory without privileges","335544783":"Illegal Instruction. The Code attempted to perfrom an illegal operation","335544784":"Bus Error. The Code caused a system bus error","335544785":"Floating Point Error. The Code caused an Arithmetic Exception\\nor a floating point exception\\n","335544786":"Cannot delete rows from external files","335544787":"Cannot update rows in external files","335544788":"Unable to perform operation.You must be either SYSDBA or\\nowner of the database\\n","335544789":"Specified EXTRACT part does not exist in input datatype","335544790":"Service @1 requires SYSDBA permissions. Reattach to the Service Manager using the SYSDBA account","335544791":"The file @1 is currently in use by another process.Try again later","335544792":"Cannot attach to services manager","335544793":"Metadata update statement is not allowed by the current database SQL dialect @1","335544794":"Operation was cancelled","335544795":"Unexpected item in service parameter block, expected @1","335544796":"Client SQL dialect @1 does not support reference to @2 datatype","335544797":"User name and password are required while attaching to\\nthe services manager\\n","335544798":"You created an indirect dependency on uncommitted metadata. You must\\nroll back the current transaction\\n","335544799":"The service name was not specified","335544800":"Too many Contexts of Relation/Procedure/Views. Maximum allowed is 255","335544801":"Data type not supported for arithmetic","335544802":"Database dialect being changed from 3 to 1","335544803":"Database dialect not changed","335544804":"Unable to create database @1","335544805":"Database dialect @1 is not a valid dialect","335544806":"Valid database dialects are @1","335544807":"SQL warning code = @1","335544808":"DATE data type is now called TIMESTAMP","335544809":"Function @1 is in @2, which is not in a permitted directory for\\nexternal functions\\n","335544810":"Value exceeds the range for valid dates","335544811":"Passed client dialect @1 is not a valid dialect","335544812":"Valid client dialects are @1","335544813":"Unsupported field type specified in BETWEEN predicate","335544814":"Services functionality will be supported in a later version\\nof the product\\n","335544815":"GENERATOR @1","335544816":"UDF @1","335544817":"Invalid parameter to FIRST.Only integers >= 0 are allowed","335544818":"Invalid parameter to SKIP. Only integers >= 0 are allowed","335544819":"File exceeded maximum size of 2GB. Add another database file or use\\na 64 bit I/O version of Firebird\\n","335544820":"Unable to find savepoint with name @1 in transaction context","335544821":"Invalid column position used in the @1 clause","335544822":"Cannot use an aggregate function in a WHERE clause, use HAVING instead","335544823":"Cannot use an aggregate function in a GROUP BY clause","335544824":"Invalid expression in the @1 (not contained in either an aggregate function or the GROUP BY clause)","335544825":"Invalid expression in the @1 (neither an aggregate function nor a part of the GROUP BY clause)","335544826":"Nested aggregate functions are not allowed","335544827":"Invalid argument in EXECUTE STATEMENT-cannot convert to string","335544828":"Wrong request type in EXECUTE STATEMENT \'@1\'","335544829":"Variable type (position @1) in EXECUTE STATEMENT \'@2\' INTO does not\\nmatch returned column type\\n","335544830":"Too many recursion levels of EXECUTE STATEMENT","335544831":"Access to @1 \\"@2\\" is denied by server administrator","335544832":"Cannot change difference file name while database is in backup mode","335544833":"Physical backup is not allowed while Write-Ahead Log is in use","335544834":"Cursor is not open","335544835":"Target shutdown mode is invalid for database \\"@1\\"","335544836":"Concatenation overflow. Resulting string cannot exceed 32K in length","335544837":"Invalid offset parameter @1 to SUBSTRING. Only positive integers are allowed","335544838":"Foreign key reference target does not exist","335544839":"Foreign key references are present for the record","335544840":"Cannot update","335544841":"Cursor is already open","335544842":"@1","335544843":"Context variable @1 is not found in namespace @2","335544844":"Invalid namespace name @1 passed to @2","335544845":"Too many context variables","335544846":"Invalid argument passed to @1","335544847":"BLR syntax error. Identifier @1... is too long","335544848":"Exception @1","335544849":"Malformed string","335544850":"Output parameter mismatch for procedure @1","335544851":"Unexpected end of command- line @1, column @2","335544852":"Partner index segment no @1 has incompatible data type","335544853":"Invalid length parameter @1 to SUBSTRING. Negative integers are not allowed","335544854":"CHARACTER SET @1 is not installed","335544855":"COLLATION @1 for CHARACTER SET @2 is not installed","335544856":"Connection shutdown","335544857":"Maximum BLOB size exceeded","335544858":"Can\'t have relation with only computed fields or constraints","335544859":"Time precision exceeds allowed range (0-@1)","335544860":"Unsupported conversion to target type BLOB (subtype @1)","335544861":"Unsupported conversion to target type ARRAY","335544862":"Stream does not support record locking","335544863":"Cannot create foreign key constraint @1. Partner index does not\\nexist or is inactive\\n","335544864":"Transactions count exceeded. Perform backup and restore to make\\ndatabase operable again\\n","335544865":"Column has been unexpectedly deleted","335544866":"@1 cannot depend on @2","335544867":"Blob sub_types bigger than 1 (text) are for internal use only","335544868":"Procedure @1 is not selectable (it does not contain a SUSPEND\\nstatement)\\n","335544869":"Datatype @1 is not supported for sorting operation","335544870":"COLLATION @1","335544871":"DOMAIN @1","335544872":"Domain @1 is not defined","335544873":"Array data type can use up to @1 dimensions","335544874":"A multi database transaction cannot span more than @1 databases","335544875":"Bad debug info format","335544876":"Error while parsing procedure @1\' s BLR","335544877":"Index key too big","335544878":"Concurrent transaction number is @1","335544879":"Validation error for variable @1, value \\"@2\\"","335544880":"Validation error for @1, value \\"@2\\"","335544881":"Difference file name should be set explicitly for database on raw device","335544882":"Login name too long (@1 characters, maximum allowed @2)","335544883":"Column @1 is not defined in procedure @2","335544884":"Invalid SIMILAR TO pattern","335544885":"Invalid TEB format","335544886":"Found more than one transaction isolation in TPB","335544887":"Table reservation lock type @1 requires table name before in TPB","335544888":"Found more than one @1 specification in TPB","335544889":"Option @1 requires READ COMMITTED isolation in TPB","335544890":"Option @1 is not valid if @2 was used previously in TPB","335544891":"Table name length missing after table reservation @1 in TPB","335544892":"Table name length @1 is too long after table reservation @2 in TPB","335544893":"Table name length @1 without table name after table reservation @2 in TPB","335544894":"Table name length @1 goes beyond the remaining TPB size after table reservation @2","335544895":"Table name length is zero after table reservation @1 in TPB","335544896":"Table or view @1 not defined in system tables after table reservation @2 in TPB","335544897":"Base table or view @1 for view @2 not defined in system tables after table reservation @3 in TPB","335544898":"Option length missing after option @1 in TPB","335544899":"Option length @1 without value after option @2 in TPB","335544900":"Option length @1 goes beyond the remaining TPB size after option @2","335544901":"Option length is zero after table reservation @1 in TPB","335544902":"Option length @1 exceeds the range for option @2 in TPB","335544903":"Option value @1 is invalid for the option @2 in TPB","335544904":"Preserving previous table reservation @1 for table @2, stronger than new @3 in TPB","335544905":"Table reservation @1 for table @2 already specified and is stronger than new @3 in TPB","335544906":"Table reservation reached maximum recursion of @1 when expanding views in TPB","335544907":"Table reservation in TPB cannot be applied to @1 because it’s a virtual table","335544908":"Table reservation in TPB cannot be applied to @1 because it’s a system table","335544909":"Table reservation @1 or @2 in TPB cannot be applied to @3 because it’s a temporary table","335544910":"Cannot set the transaction in read only mode after a table reservation isc_tpb_lock_write in TPB","335544911":"Cannot take a table reservation isc_tpb_lock_write in TPB because the transaction is in read only mode","335544912":"value exceeds the range for a valid time","335544913":"value exceeds the range for valid timestamps","335544914":"string right truncation","335544915":"blob truncation when converting to a string: length limit exceeded","335544916":"numeric value is out of range","335544917":"Firebird shutdown is still in progress after the specified timeout","335544918":"Attachment handle is busy","335544919":"Bad written UDF detected: pointer returned in FREE_IT function was not allocated by ib_util_malloc","335544920":"External Data Source provider \'@1\' not found","335544921":"Execute statement error at @1 :\\n@2Data source : @3","335544922":"Execute statement preprocess SQL error","335544923":"Statement expected","335544924":"Parameter name expected","335544925":"Unclosed comment found near \'@1\'","335544926":"Execute statement error at @1 :\\n@2Statement : @3\\nData source : @4","335544927":"Input parameters mismatch","335544928":"Output parameters mismatch","335544929":"Input parameter \'@1\' have no value set","335544930":"BLR stream length @1 exceeds implementation limit @2","335544931":"Monitoring table space exhausted","335544932":"module name or entrypoint could not be found","335544933":"nothing to cancel","335544934":"ib_util library has not been loaded to deallocate memory returned by FREE_IT function","335544935":"Cannot have circular dependencies with computed fields","335544936":"Security database error","335544937":"Invalid data type in DATE/TIME/TIMESTAMP addition or subtraction in add_datettime()","335544938":"Only a TIME value can be added to a DATE value","335544939":"Only a DATE value can be added to a TIME value","335544940":"TIMESTAMP values can be subtracted only from another TIMESTAMP value","335544941":"Only one operand can be of type TIMESTAMP","335544942":"Only HOUR, MINUTE, SECOND and MILLISECOND can be extracted from TIME values","335544943":"HOUR, MINUTE, SECOND and MILLISECOND cannot be extracted from DATE values","335544944":"Invalid argument for EXTRACT() not being of DATE/TIME/TIMESTAMP type","335544945":"Arguments for @1 must be integral types or NUMERIC/DECIMAL without scale","335544946":"First argument for @1 must be integral type or floating point type","335544947":"Human readable UUID argument for @1 must be of string type","335544948":"Human readable UUID argument for @2 must be of exact length @1","335544949":"Human readable UUID argument for @3 must have \\"-\\" at position @2 instead of \\"@1\\"","335544950":"Human readable UUID argument for @3 must have hex digit at position @2 instead of \\"@1\\"","335544951":"Only HOUR, MINUTE, SECOND and MILLISECOND can be added to TIME values in @1","335544952":"Invalid data type in addition of part to DATE/TIME/TIMESTAMP in @1","335544953":"Invalid part @1 to be added to a DATE/TIME/TIMESTAMP value in @2","335544954":"Expected DATE/TIME/TIMESTAMP type in evlDateAdd() result","335544955":"Expected DATE/TIME/TIMESTAMP type as first and second argument to @1","335544956":"The result of TIME-<value> in @1 cannot be expressed in YEAR, MONTH, DAY or WEEK","335544957":"The result of TIME-TIMESTAMP or TIMESTAMP-TIME in @1 cannot be expressed in HOUR, MINUTE, SECOND or MILLISECOND","335544958":"The result of DATE-TIME or TIME-DATE in @1 cannot be expressed in HOUR, MINUTE, SECOND and MILLISECOND","335544959":"Invalid part @1 to express the difference between two DATE/TIME/TIMESTAMP values in @2","335544960":"Argument for @1 must be positive","335544961":"Base for @1 must be positive","335544962":"Argument #@1 for @2 must be zero or positive","335544963":"Argument #@1 for @2 must be positive","335544964":"Base for @1 cannot be zero if exponent is negative","335544965":"Base for @1 cannot be negative if exponent is not an integral value","335544966":"The numeric scale must be between -128 and 127 in @1","335544967":"Argument for @1 must be zero or positive","335544968":"Binary UUID argument for @1 must be of string type","335544969":"Binary UUID argument for @2 must use @1 bytes","335544970":"Missing required item @1 in service parameter block","335544971":"@1 server is shutdown","335544972":"Invalid connection string","335544973":"Unrecognized events block","335544974":"Could not start first worker thread - shutdown server","335544975":"Timeout occurred while waiting for a secondary connection for event processing","335544976":"Argument for @1 must be different than zero","335544977":"Argument for @1 must be in the range [-1, 1]","335544978":"Argument for @1 must be greater or equal than one","335544979":"Argument for @1 must be in the range ]-1, 1[","335544980":"Incorrect parameters provided to internal function @1","335544981":"Floating point overflow in built-in function @1","335544982":"Floating point overflow in result from UDF @1","335544983":"Invalid floating point value returned by UDF @1","335544984":"Database is probably already opened by another engine instance in another Windows session","335544985":"No free space found in temporary directories","335544986":"Explicit transaction control is not allowed","335544987":"Use of TRUSTED switches in spb_command_line is prohibited","335544988":"PACKAGE @1","335544989":"Cannot make field @1 of table @2 NOT NULL because there are NULLs present","335544990":"Feature @1 is not supported anymore","335544991":"VIEW @1","335544992":"Can not access lock files directory @1","335544993":"Fetch option @1 is invalid for a non-scrollable cursor","335544994":"Error while parsing function @1’s BLR","335544995":"Cannot execute function @1 of the unimplemented package @2","335544996":"Cannot execute procedure @1 of the unimplemented package @2","335544997":"External function @1 not returned by the external engine plugin @2","335544998":"External procedure @1 not returned by the external engine plugin @2","335544999":"External trigger @1 not returned by the external engine plugin @2","335545000":"Incompatible plugin version @1 for external engine @2","335545001":"External engine @1 not found","335545002":"Attachment is in use","335545003":"Transaction is in use","335545004":"Error loading plugin @1","335545005":"Loadable module @1 not found","335545006":"Standard plugin entrypoint does not exist in module @1","335545007":"Module @1 exists but can not be loaded","335545008":"Module @1 does not contain plugin @2 type @3","335545009":"Invalid usage of context namespace DDL_TRIGGER","335545010":"Value is NULL but isNull parameter was not informed","335545011":"Type @1 is incompatible with BLOB","335545012":"Invalid date","335545013":"Invalid time","335545014":"Invalid timestamp","335545015":"Invalid index @1 in function @2","335545016":"@1","335545017":"Asynchronous call is already running for this attachment","335545018":"Function @1 is private to package @2","335545019":"Procedure @1 is private to package @2","335545020":"Request can’t access new records in relation @1 and should be recompiled","335545021":"invalid events id (handle)","335545022":"Cannot copy statement @1","335545023":"Invalid usage of boolean expression","335545024":"Arguments for @1 cannot both be zero","335545025":"missing service ID in spb","335545026":"External BLR message mismatch: invalid null descriptor at field @1","335545027":"External BLR message mismatch: length = @1, expected @2","335545028":"Subscript @1 out of bounds [@2, @3]","335545029":"Install incomplete. To complete security database initialization please CREATE USER. For details read doc/README.security_database.txt.","335545030":"@1 operation is not allowed for system table @2","335545031":"Libtommath error code @1 in function @2","335545032":"unsupported BLR version (expected between @1 and @2, encountered @3)","335545033":"expected length @1, actual @2","335545034":"Wrong info requested in isc_svc_query() for anonymous service","335545035":"No isc_info_svc_stdin in user request, but service thread requested stdin data","335545036":"Start request for anonymous service is impossible","335545037":"All services except for getting server log require switches","335545038":"Size of stdin data is more than was requested from client","335545039":"Crypt plugin @1 failed to load","335545040":"Length of crypt plugin name should not exceed @1 bytes","335545041":"Crypt failed - already crypting database","335545042":"Crypt failed - database is already in requested state","335545043":"Missing crypt plugin, but page appears encrypted","335545044":"No providers loaded","335545045":"NULL data with non-zero SPB length","335545046":"Maximum (@1) number of arguments exceeded for function @2","335545047":"External BLR message mismatch: names count = @1, blr count = @2","335545048":"External BLR message mismatch: name @1 not found","335545049":"Invalid resultset interface","335545050":"Message length passed from user application does not match set of columns","335545051":"Resultset is missing output format information","335545052":"Message metadata not ready - item @1 is not finished","335545053":"Missing configuration file: @1","335545054":"@1: illegal line <@2>","335545055":"Invalid include operator in @1 for <@2>","335545056":"Include depth too big","335545057":"File to include not found","335545058":"Only the owner can change the ownership","335545059":"undefined variable number","335545060":"Missing security context for @1","335545061":"Missing segment @1 in multisegment connect block parameter","335545062":"Different logins in connect and attach packets - client library error","335545063":"Exceeded exchange limit during authentication handshake","335545064":"Incompatible wire encryption levels requested on client and server","335545065":"Client attempted to attach unencrypted but wire encryption is required","335545066":"Client attempted to start wire encryption using unknown key @1","335545067":"Client attempted to start wire encryption using unsupported plugin @1","335545068":"Error getting security database name from configuration file","335545069":"Client authentication plugin is missing required data from server","335545070":"Client authentication plugin expected @2 bytes of @3 from server, got @1","335545071":"Attempt to get information about an unprepared dynamic SQL statement.","335545072":"Problematic key value is @1","335545073":"Cannot select virtual table @1 for update WITH LOCK","335545074":"Cannot select system table @1 for update WITH LOCK","335545075":"Cannot select temporary table @1 for update WITH LOCK","335545076":"System @1 @2 cannot be modified","335545077":"Server misconfigured - contact administrator please","335545078":"Deprecated backward compatibility ALTER ROLE …​ SET/DROP AUTO ADMIN mapping may be used only for RDB$ADMIN role","335545079":"Mapping @1 already exists","335545080":"Mapping @1 does not exist","335545081":"@1 failed when loading mapping cache","335545082":"Invalid name <*> in authentication block","335545083":"Multiple maps found for @1","335545084":"Undefined mapping result - more than one different results found","335545085":"Incompatible mode of attachment to damaged database","335545086":"Attempt to set in database number of buffers which is out of acceptable range [@1:@2]","335545087":"Attempt to temporarily set number of buffers less than @1","335545088":"Global mapping is not available when database @1 is not present","335545089":"Global mapping is not available when table RDB$MAP is not present in database @1","335545090":"Your attachment has no trusted role","335545091":"Role @1 is invalid or unavailable","335545092":"Cursor @1 is not positioned in a valid record","335545093":"Duplicated user attribute @1","335545094":"There is no privilege for this operation","335545095":"Using GRANT OPTION on @1 not allowed","335545096":"read conflicts with concurrent update","335545097":"@1 failed when working with CREATE DATABASE grants","335545098":"CREATE DATABASE grants check is not possible when database @1 is not present","335545099":"CREATE DATABASE grants check is not possible when table RDB$DB_CREATORS is not present in database @1","335545100":"Interface @3 version too old: expected @1, found @2","335545101":"Input parameter mismatch for function @1","335545102":"Error during savepoint backout - transaction invalidated","335545103":"Domain used in the PRIMARY KEY constraint of table @1 must be NOT NULL","335545104":"CHARACTER SET @1 cannot be used as a attachment character set","335545105":"Some database(s) were shutdown when trying to read mapping data","335545106":"Error occurred during login, please check server firebird.log for details","335545107":"Database already opened with engine instance, incompatible with current","335545108":"Invalid crypt key @1","335545109":"Page requires encryption but crypt plugin is missing","335545110":"Maximum index depth (@1 levels) is reached","335545111":"System privilege @1 does not exist","335545112":"System privilege @1 is missing","335545113":"Invalid or missing checksum of encrypted database","335545114":"You must have SYSDBA rights at this server","335545115":"Cannot open cursor for non-SELECT statement","335545116":"If <window frame bound 1> specifies @1, then <window frame bound 2> shall not specify @2","335545117":"RANGE based window with <expr> {PRECEDING | FOLLOWING} cannot have ORDER BY with more than one value","335545118":"RANGE based window must have an ORDER BY key of numerical, date, time or timestamp types","335545119":"Window RANGE/ROWS PRECEDING/FOLLOWING value must be of a numerical type","335545120":"Invalid PRECEDING or FOLLOWING offset in window function: cannot be negative","335545121":"Window @1 not found","335545122":"Cannot use PARTITION BY clause while overriding the window @1","335545123":"Cannot use ORDER BY clause while overriding the window @1 which already has an ORDER BY clause","335545124":"Cannot override the window @1 because it has a frame clause. Tip: it can be used without parenthesis in OVER","335545125":"Duplicate window definition for @1","335545126":"SQL statement is too long. Maximum size is @1 bytes.","335545127":"Config level timeout expired.","335545128":"Attachment level timeout expired.","335545129":"Statement level timeout expired.","335545130":"Killed by database administrator.","335545131":"Idle timeout expired.","335545132":"Database is shutdown.","335545133":"Engine is shutdown.","335545134":"OVERRIDING clause can be used only when an identity column is present in the INSERT’s field list for table/view @1","335545135":"OVERRIDING SYSTEM VALUE can be used only for identity column defined as \'GENERATED ALWAYS\' in INSERT for table/view @1","335545136":"OVERRIDING USER VALUE can be used only for identity column defined as \'GENERATED BY DEFAULT\' in INSERT for table/view @1","335545137":"OVERRIDING SYSTEM VALUE should be used to override the value of an identity column defined as \'GENERATED ALWAYS\' in table/view @1","335545138":"DecFloat precision must be 16 or 34","335545139":"Decimal float divide by zero.  The code attempted to divide a DECFLOAT value by zero.","335545140":"Decimal float inexact result.  The result of an operation cannot be represented as a decimal fraction.","335545141":"Decimal float invalid operation.  An indeterminant error occurred during an operation.","335545142":"Decimal float overflow.  The exponent of a result is greater than the magnitude allowed.","335545143":"Decimal float underflow.  The exponent of a result is less than the magnitude allowed.","335545144":"Sub-function @1 has not been defined","335545145":"Sub-procedure @1 has not been defined","335545146":"Sub-function @1 has a signature mismatch with its forward declaration","335545147":"Sub-procedure @1 has a signature mismatch with its forward declaration","335545148":"Default values for parameters are not allowed in definition of the previously declared sub-function @1","335545149":"Default values for parameters are not allowed in definition of the previously declared sub-procedure @1","335545150":"Sub-function @1 was declared but not implemented","335545151":"Sub-procedure @1 was declared but not implemented","335545152":"Invalid HASH algorithm @1","335545153":"Expression evaluation error for index \\"@1\\" on table \\"@2\\"","335545154":"Invalid decfloat trap state @1","335545155":"Invalid decfloat rounding mode @1","335545156":"Invalid part @1 to calculate the @1 of a DATE/TIMESTAMP","335545157":"Expected DATE/TIMESTAMP value in @1","335545158":"Precision must be from @1 to @2","335545159":"invalid batch handle","335545160":"Bad international character in tag @1","335545161":"Null data in parameters block with non-zero length","335545162":"Items working with running service and getting generic server information should not be mixed in single info block","335545163":"Unknown information item, code @1","335545164":"Wrong version of blob parameters block @1, should be @2","335545165":"User management plugin is missing or failed to load","335545166":"Missing entrypoint @1 in ICU library","335545167":"Could not find acceptable ICU library","335545168":"Name @1 not found in system MetadataBuilder","335545169":"Parse to tokens error","335545170":"Error opening international conversion descriptor from @1 to @2","335545171":"Message @1 is out of range, only @2 messages in batch","335545172":"Detailed error info for message @1 is missing in batch","335545173":"Compression stream init error @1","335545174":"Decompression stream init error @1","335545175":"Segment size (@1) should not exceed 65535 (64K - 1) when using segmented blob","335545176":"Invalid blob policy in the batch for @1() call","335545177":"Can’t change default BPB after adding any data to batch","335545178":"Unexpected info buffer structure querying for default blob alignment","335545179":"Duplicated segment @1 in multisegment connect block parameter","335545180":"Plugin not supported by network protocol","335545181":"Error parsing message format","335545182":"Wrong version of batch parameters block @1, should be @2","335545183":"Message size (@1) in batch exceeds internal buffer size (@2)","335545184":"Batch already opened for this statement","335545185":"Invalid type of statement used in batch","335545186":"Statement used in batch must have parameters","335545187":"There are no blobs in associated with batch statement","335545188":"appendBlobData() is used to append data to last blob but no such blob was added to the batch","335545189":"Portions of data, passed as blob stream, should have size multiple to the alignment required for blobs","335545190":"Repeated blob id @1 in registerBlob()","335545191":"Blob buffer format error","335545192":"Unusable (too small) data remained in @1 buffer","335545193":"Blob continuation should not contain BPB","335545194":"Size of BPB (@1) greater than remaining data (@2)","335545195":"Size of segment (@1) greater than current BLOB data (@2)","335545196":"Size of segment (@1) greater than available data (@2)","335545197":"Unknown blob ID @1 in the batch message","335545198":"Internal buffer overflow - batch too big","335545199":"Numeric literal too long","335545200":"Error using events in mapping shared memory: @1","335545201":"Global mapping memory overflow","335545202":"Header page overflow - too many clumplets on it","335545203":"No matching client/server authentication plugins configured for execute statement in embedded datasource","335545204":"Missing database encryption key for your attachment","335545205":"Key holder plugin @1 failed to load","335545206":"Cannot reset user session","335545207":"There are open transactions (@1 active)","335545208":"Session was reset with warning(s)","335545209":"Transaction is rolled back due to session reset, all changes are lost","335545210":"Plugin @1:","335545211":"PARAMETER @1","335545212":"Starting page number for file @1 must be @2 or greater","335545213":"Invalid time zone offset: @1 - must use format +/-hours:minutes and be between -14:00 and +14:00","335545214":"Invalid time zone region: @1","335545215":"Invalid time zone ID: @1","335545216":"Wrong base64 text length @1, should be multiple of 4","335545217":"Invalid first parameter datatype - need string or blob","335545218":"Error registering @1 - probably bad tomcrypt library","335545219":"Unknown crypt algorithm @1 in USING clause","335545220":"Should specify mode parameter for symmetric cipher","335545221":"Unknown symmetric crypt mode specified","335545222":"Mode parameter makes no sense for chosen cipher","335545223":"Should specify initialization vector (IV) for chosen cipher and/or mode","335545224":"Initialization vector (IV) makes no sense for chosen cipher and/or mode","335545225":"Invalid counter endianess @1","335545226":"Counter endianess parameter is not used in mode @1","335545227":"Too big counter value @1, maximum @2 can be used","335545228":"Counter length/value parameter is not used with @1 @2","335545229":"Invalid initialization vector (IV) length @1, need @2","335545230":"TomCrypt library error: @1","335545231":"Starting PRNG yarrow","335545232":"Setting up PRNG yarrow","335545233":"Initializing @1 mode","335545234":"Encrypting in @1 mode","335545235":"Decrypting in @1 mode","335545236":"Initializing cipher @1","335545237":"Encrypting using cipher @1","335545238":"Decrypting using cipher @1","335545239":"Setting initialization vector (IV) for @1","335545240":"Invalid initialization vector (IV) length @1, need  8 or 12","335545241":"Encoding @1","335545242":"Decoding @1","335545243":"Importing RSA key","335545244":"Invalid OAEP packet","335545245":"Unknown hash algorithm @1","335545246":"Making RSA key","335545247":"Exporting @1 RSA key","335545248":"RSA-signing data","335545249":"Verifying RSA-signed data","335545250":"Invalid key length @1, need 16 or 32","335545251":"invalid replicator handle","335545252":"Transaction’s base snapshot number does not exist","335545253":"Input parameter \'@1\' is not used in SQL query text","335545254":"Effective user is @1","335545255":"Invalid time zone bind mode @1","335545256":"Invalid decfloat bind mode @1","335545257":"Invalid hex text length @1, should be multiple of 2","335545258":"Invalid hex digit @1 at position @2","335545259":"Error processing isc_dpb_set_bind clumplet \\"@1\\"","335545260":"The following statement failed: @1","335545261":"Can not convert @1 to @2","335545262":"cannot update old BLOB","335545263":"cannot read from new BLOB","335545264":"No permission for CREATE @1 operation","335545265":"SUSPEND could not be used without RETURNS clause in PROCEDURE or EXECUTE BLOCK","335545266":"String truncated warning due to the following reason","335545267":"Monitoring data does not fit into the field","335545268":"Engine data does not fit into return value of system function","335545269":"Multiple source records cannot match the same target during MERGE","335545270":"RDB$PAGES written by non-system transaction, DB appears to be damaged","335545271":"Replication error","335545272":"Reset of user session failed. Connection is shut down.","335545273":"File size is less than expected","335545274":"Invalid key length @1, need >@2","335740929":"Database file name (@1) already given","335740930":"Invalid switch @1","335740932":"Incompatible switch combination","335740933":"Replay log pathname required","335740934":"Number of page buffers for cache required","335740935":"Numeric value required","335740936":"Positive numeric value required","335740937":"Number of transactions per sweep required","335740940":"\\"full\\" or \\"reserve\\" required","335740941":"User name required","335740942":"Password required","335740943":"Subsystem name","335740945":"Number of seconds required","335740946":"Numeric value between 0 and 32767 inclusive required","335740947":"Must specify type of shutdown","335740948":"Please retry, specifying an option","335740951":"Please retry, giving a database name","335740991":"Internal block exceeds maximum size","335740992":"Corrupt pool","335740993":"Virtual memory exhausted","335740994":"Bad pool id.","335740995":"Transaction state @1 not in valid range","335741012":"Unexpected end of input","335741018":"Failed to reconnect to a transaction in database @1","335741036":"Transaction description item unknown","335741038":"\\"read_only\\" or \\"read_write\\" required","335741039":"-sql_dialect | set database dialect n","335741042":"Positive or zero numeric value required","336003074":"Cannot SELECT RDB$DB_KEY from a stored procedure","336003075":"Precision 10 to 18 changed from DOUBLE PRECISION in SQL\\ndialect 1 to 64-bit scaled integer in SQL dialect 3\\n","336003076":"Use of @1 expression that returns different results in dialect 1 and dialect 3","336003077":"Database SQL dialect @1 does not support reference to @2 datatype","336003079":"DB dialect @1 and client dialect @2 conflict with respect to numeric precision @3","336003080":"WARNING: Numeric literal @1 is interpreted as a floating-point","336003081":"value in SQL dialect 1, but as an exact numeric value in SQL dialect 3.","336003082":"WARNING: NUMERIC and DECIMAL fields with precision 10 or greater are stored","336003083":"as approximate floating-point values in SQL dialect 1, but as 64-bit","336003084":"integers in SQL dialect 3.","336003085":"Ambiguous field name between @1 and @2","336003086":"External function should have return position between 1 and @1","336003087":"Label @1 @2 in the current scope","336003088":"Datatypes @1are not comparable in expression @2","336003089":"Empty cursor name is not allowed","336003090":"Statement already has a cursor @1 assigned","336003091":"Cursor @1 is not found in the current context","336003092":"Cursor @1 already exists in the current context","336003093":"Relation @1 is ambiguous in cursor @2","336003094":"Relation @1 is not found in cursor @2","336003095":"Cursor is not open","336003096":"Data type @1 is not supported for EXTERNAL TABLES. Relation \'@2\', field \'@3\'","336003097":"Feature not supported on ODS version older than @1.@2","336003098":"Primary key required on table @1","336003099":"UPDATE OR INSERT field list does not match primary key of table @1","336003100":"UPDATE OR INSERT field list does not match MATCHING clause","336003101":"UPDATE OR INSERT without MATCHING could not be used with views based on more than one table","336003102":"Incompatible trigger type","336003103":"Database trigger type can\'t be changed","336003104":"To be used with RDB$RECORD_VERSION, @1 must be a table or a view of single table","336003105":"SQLDA version expected between @1 and @2, found @3","336003106":"at SQLVAR index @1","336003107":"empty pointer to NULL indicator variable","336003108":"empty pointer to data","336003109":"No SQLDA for input values provided","336003110":"No SQLDA for output values provided","336003111":"Wrong number of parameters (expected @1, got @2)","336003112":"Invalid DROP SQL SECURITY clause","336003113":"UPDATE OR INSERT value for field @1, part of the implicit or explicit MATCHING clause, cannot be DEFAULT","336068645":"BLOB Filter @1 not found","336068649":"Function @1 not found","336068656":"Index not found","336068662":"View @1 not found","336068697":"Domain not found","336068717":"Triggers created automatically cannot be modified","336068740":"Table @1 already exists","336068748":"Procedure @1 not found","336068752":"Exception not found","336068754":"Parameter @1 in procedure @2 not found","336068755":"Trigger @1 not found","336068759":"Character set @1 not found","336068760":"Collation @1 not found","336068763":"Role @1 not found","336068767":"Name longer than database column size","336068784":"column @1 does not exist in table/view @2","336068796":"SQL role @1 does not exist","336068797":"User @1 has no grant admin option on SQL role @2","336068798":"User @1 is not a member of SQL role @2","336068799":"@1 is not the owner of SQL role @2","336068800":"@1 is a SQL role and not a user","336068801":"User name @1 could not be used for SQL role","336068802":"SQL role @1 already exists","336068803":"Keyword @1 can not be used as a SQL role name","336068804":"SQL roles are not supported in on older versions of the database. A backup and restore of the database is required","336068812":"Cannot rename domain @1 to @2. A domain with that name already exists","336068813":"Cannot rename column @1 to @2.A column with that name already exists in table @3","336068814":"Column @1 from table @2 is referenced in @3","336068815":"Cannot change datatype for column @1.Changing datatype is not supported for BLOB or ARRAY columns","336068816":"New size specified for column @1 must be at least @2 characters","336068817":"Cannot change datatype for @1.Conversion from base type @2 to @3 is not supported","336068818":"Cannot change datatype for column @1 from a character type to a non-character type","336068820":"Zero length identifiers are not allowed","336068822":"Sequence @1 not found","336068829":"Maximum number of collations per character set exceeded","336068830":"Invalid collation attributes","336068840":"@1 cannot reference @2","336068843":"Collation @1 is used in table @2 (field name @3) and cannot be dropped","336068844":"Collation @1 is used in domain @2 and cannot be dropped","336068845":"Cannot delete system collation","336068846":"Cannot delete default collation of CHARACTER SET @1","336068849":"Table @1 not found","336068851":"Collation @1 is used in procedure @2 (parameter name @3) and cannot be dropped","336068852":"New scale specified for column @1 must be at most @2","336068853":"New precision specified for column @1 must be at least @2","336068855":"Warning: @1 on @2 is not granted to @3.","336068856":"Feature \'@1\' is not supported in ODS @2.@3","336068857":"Cannot add or remove COMPUTED from column @1","336068858":"Password should not be empty string","336068859":"Index @1 already exists","336068864":"Package @1 not found","336068865":"Schema @1 not found","336068866":"Cannot ALTER or DROP system procedure @1","336068867":"Cannot ALTER or DROP system trigger @1","336068868":"Cannot ALTER or DROP system function @1","336068869":"Invalid DDL statement for procedure @1","336068870":"Invalid DDL statement for trigger @1","336068871":"Function @1 has not been defined on the package body @2","336068872":"Procedure @1 has not been defined on the package body @2","336068873":"Function @1 has a signature mismatch on package body @2","336068874":"Procedure @1 has a signature mismatch on package body @2","336068875":"Default values for parameters are not allowed in the definition of a previously declared packaged procedure @1.@2","336068877":"Package body @1 already exists","336068878":"Invalid DDL statement for function @1","336068879":"Cannot alter new style function @1 with ALTER EXTERNAL FUNCTION. Use ALTER FUNCTION instead.","336068886":"Parameter @1 in function @2 not found","336068887":"Parameter @1 of routine @2 not found","336068888":"Parameter @1 of routine @2 is ambiguous (found in both procedures and functions). Use a specifier keyword.","336068889":"Collation @1 is used in function @2 (parameter name @3) and cannot be dropped","336068890":"Domain @1 is used in function @2 (parameter name @3) and cannot be dropped","336068891":"ALTER USER requires at least one clause to be specified","336068894":"Duplicate @1 @2","336068895":"System @1 @2 cannot be modified","336068896":"INCREMENT BY 0 is an illegal option for sequence @1","336068897":"Can’t use @1 in FOREIGN KEY constraint","336068898":"Default values for parameters are not allowed in the definition of a previously declared packaged function @1.@2","336068900":"role @1 can not be granted to role @2","336068904":"INCREMENT BY 0 is an illegal option for identity column @1 of table @2","336068907":"no @1 privilege with grant option on DDL @2","336068908":"no @1 privilege with grant option on object @2","336068909":"Function @1 does not exist","336068910":"Procedure @1 does not exist","336068911":"Package @1 does not exist","336068912":"Trigger @1 does not exist","336068913":"View @1 does not exist","336068914":"Table @1 does not exist","336068915":"Exception @1 does not exist","336068916":"Generator/Sequence @1 does not exist","336068917":"Field @1 of table @2 does not exist","336330753":"Found unknown switch","336330754":"Page size parameter missing","336330755":"Page size specified (@1) greater than limit (16384 bytes)","336330756":"Redirect location for output is not specified","336330757":"Conflicting switches for backup/restore","336330758":"Device type @1 not known","336330759":"Protection is not there yet","336330760":"Page size is allowed only on restore or create","336330761":"Multiple sources or destinations specified","336330762":"Requires both input and output filenames","336330763":"Input and output have the same name. Disallowed","336330764":"Expected page size, encountered \\"@1\\"","336330765":"REPLACE specified, but the first file @1 is a database","336330766":"Database @1 already exists.To replace it, use the -REP switch","336330767":"Device type not specified","336330772":"Gds_$blob_info failed","336330773":"Do not understand BLOB INFO item @1","336330774":"Gds_$get_segment failed","336330775":"Gds_$close_blob failed","336330776":"Gds_$open_blob failed","336330777":"Failed in put_blr_gen_id","336330778":"Data type @1 not understood","336330779":"Gds_$compile_request failed","336330780":"Gds_$start_request failed","336330781":"gds_$receive failed","336330782":"Gds_$release_request failed","336330783":"gds_$database_info failed","336330784":"Expected database description record","336330785":"Failed to create database @1","336330786":"RESTORE: decompression length error","336330787":"Cannot find table @1","336330788":"Cannot find column for BLOB","336330789":"Gds_$create_blob failed","336330790":"Gds_$put_segment failed","336330791":"Expected record length","336330792":"Wrong length record, expected @1 encountered @2","336330793":"Expected data attribute","336330794":"Failed in store_blr_gen_id","336330795":"Do not recognize record type @1","336330796":"Expected backup version 1..8. Found @1","336330797":"Expected backup description record","336330798":"String truncated","336330799":"warning -- record could not be restored","336330800":"Gds_$send failed","336330801":"No table name for data","336330802":"Unexpected end of file on backup file","336330803":"Database format @1 is too old to restore to","336330804":"Array dimension for column @1 is invalid","336330807":"Expected XDR record length","336330817":"Cannot open backup file @1","336330818":"Cannot open status and error output file @1","336330934":"Blocking factor parameter missing","336330935":"Expected blocking factor, encountered \\"@1\\"","336330936":"A blocking factor may not be used in conjunction with device CT","336330940":"User name parameter missing","336330941":"Password parameter missing","336330952":"missing parameter for the number of bytes to be skipped","336330953":"Expected number of bytes to be skipped, encountered \\"@1\\"","336330965":"Character set","336330967":"Collation","336330972":"Unexpected I/O error while reading from backup file","336330973":"Unexpected I/O error while writing to backup file","336330985":"Could not drop database @1 (database might be in use)","336330990":"System memory exhausted","336331002":"SQL role","336331005":"SQL role parameter missing","336331010":"Page buffers parameter missing","336331011":"Expected page buffers, encountered \\"@1\\"","336331012":"Page buffers is allowed only on restore or create","336331014":"Size specification either missing or incorrect for file @1","336331015":"File @1 out of sequence","336331016":"Can\'t join - one of the files missing","336331017":"standard input is not supported when using join operation","336331018":"Standard output is not supported when using split operation","336331019":"Backup file @1 might be corrupt","336331020":"Database file specification missing","336331021":"Can\'t write a header record to file @1","336331022":"Free disk space exhausted","336331023":"File size given (@1) is less than minimum allowed (@2)","336331025":"Service name parameter missing","336331026":"Cannot restore over current database, must be SYSDBA or owner of the existing database","336331031":"\\"read_only\\" or \\"read_write\\" required","336331033":"Just data ignore all constraints etc.","336331034":"Restoring data only ignoring foreign key, unique, not null & other constraints","336397205":"ODS versions before ODS@1 are not supported","336397206":"Table @1 does not exist","336397207":"View @1 does not exist","336397208":"At line @1, column @2","336397209":"At unknown line and column","336397210":"Column @1 cannot be repeated in @2 statement","336397211":"Too many values ( more than @1) in member list to match against","336397212":"Array and BLOB data types not allowed in computed field","336397213":"Implicit domain name @1 not allowed in user created domain","336397214":"Scalar operator used on field @1 which is not an array","336397215":"Cannot sort on more than 255 items","336397216":"Cannot group on more than 255 items","336397217":"Cannot include the same field (@1.@2) twice in the ORDER BY clause with conflicting sorting options","336397218":"Column list from derived table @1 has more columns than the number of items in its SELECT statement","336397219":"Column list from derived table @1 has less columns than the number of items in its SELECT statement","336397220":"No column name specified for column number @1 in derived table @2","336397221":"Column @1 was specified multiple times for derived table @2","336397222":"Internal dsql error: alias type expected by pass1_expand_select_node","336397223":"Internal dsql error: alias type expected by pass1_field","336397224":"Internal dsql error: column position out of range in pass1_union_auto_cast","336397225":"Recursive CTE member (@1) can refer itself only in FROM clause","336397226":"CTE \'@1\' has cyclic dependencies","336397227":"Recursive member of CTE can\'t be member of an outer join","336397228":"Recursive member of CTE can\'t reference itself more than once","336397229":"Recursive CTE (@1) must be an UNION","336397230":"CTE \'@1\' defined non-recursive member after recursive","336397231":"Recursive member of CTE \'@1\' has @2 clause","336397232":"Recursive members of CTE (@1) must be linked with another members via UNION ALL","336397233":"Non-recursive member is missing in CTE \'@1\'","336397234":"WITH clause can\'t be nested","336397235":"Column @1 appears more than once in USING clause","336397236":"Feature is not supported in dialect @1","336397237":"CTE \\"@1\\" is not used in query","336397238":"column @1 appears more than once in ALTER VIEW","336397239":"@1 is not supported inside IN AUTONOMOUS TRANSACTION block","336397240":"Unknown node type @1 in dsql/GEN_expr","336397241":"Argument for @1 in dialect 1 must be string or numeric","336397242":"Argument for @1 in dialect 3 must be numeric","336397243":"Strings cannot be added to or subtracted from DATE or TIME types","336397244":"Invalid data type for subtraction involving DATE, TIME or TIMESTAMP types","336397245":"Adding two DATE values or two TIME values is not allowed","336397246":"DATE value cannot be subtracted from the provided data type","336397247":"Strings cannot be added or subtracted in dialect 3","336397248":"Invalid data type for addition or subtraction in dialect 3","336397249":"Invalid data type for multiplication in dialect 1","336397250":"Strings cannot be multiplied in dialect 3","336397251":"Invalid data type for multiplication in dialect 3","336397252":"Division in dialect 1 must be between numeric data types","336397253":"Strings cannot be divided in dialect 3","336397254":"Invalid data type for division in dialect 3","336397255":"Strings cannot be negated (applied the minus operator) in dialect 3","336397256":"Invalid data type for negation (minus operator)","336397257":"Cannot have more than 255 items in DISTINCT / UNION DISTINCT list","336397258":"ALTER CHARACTER SET @1 failed","336397259":"COMMENT ON @1 failed","336397260":"CREATE FUNCTION @1 failed","336397261":"ALTER FUNCTION @1 failed","336397262":"CREATE OR ALTER FUNCTION @1 failed","336397263":"DROP FUNCTION @1 failed","336397264":"RECREATE FUNCTION @1 failed","336397265":"CREATE PROCEDURE @1 failed","336397266":"ALTER PROCEDURE @1 failed","336397267":"CREATE OR ALTER PROCEDURE @1 failed","336397268":"DROP PROCEDURE @1 failed","336397269":"RECREATE PROCEDURE @1 failed","336397270":"CREATE TRIGGER @1 failed","336397271":"ALTER TRIGGER @1 failed","336397272":"CREATE OR ALTER TRIGGER @1 failed","336397273":"DROP TRIGGER @1 failed","336397274":"RECREATE TRIGGER @1 failed","336397275":"CREATE COLLATION @1 failed","336397276":"DROP COLLATION @1 failed","336397277":"CREATE DOMAIN @1 failed","336397278":"ALTER DOMAIN @1 failed","336397279":"DROP DOMAIN @1 failed","336397280":"CREATE EXCEPTION @1 failed","336397281":"ALTER EXCEPTION @1 failed","336397282":"CREATE OR ALTER EXCEPTION @1 failed","336397283":"RECREATE EXCEPTION @1 failed","336397284":"DROP EXCEPTION @1 failed","336397285":"CREATE SEQUENCE @1 failed","336397286":"CREATE TABLE @1 failed","336397287":"ALTER TABLE @1 failed","336397288":"DROP TABLE @1 failed","336397289":"RECREATE TABLE @1 failed","336397290":"CREATE PACKAGE @1 failed","336397291":"ALTER PACKAGE @1 failed","336397292":"CREATE OR ALTER PACKAGE @1 failed","336397293":"DROP PACKAGE @1 failed","336397294":"RECREATE PACKAGE @1 failed","336397295":"CREATE PACKAGE BODY @1 failed","336397296":"DROP PACKAGE BODY @1 failed","336397297":"RECREATE PACKAGE BODY @1 failed","336397298":"CREATE VIEW @1 failed","336397299":"ALTER VIEW @1 failed","336397300":"CREATE OR ALTER VIEW @1 failed","336397301":"RECREATE VIEW @1 failed","336397302":"DROP VIEW @1 failed","336397303":"DROP SEQUENCE @1 failed","336397304":"RECREATE SEQUENCE @1 failed","336397305":"DROP INDEX @1 failed","336397306":"DROP FILTER @1 failed","336397307":"DROP SHADOW @1 failed","336397308":"DROP ROLE @1 failed","336397309":"DROP USER @1 failed","336397310":"CREATE ROLE @1 failed","336397311":"ALTER ROLE @1 failed","336397312":"ALTER INDEX @1 failed","336397313":"ALTER DATABASE failed","336397314":"CREATE SHADOW @1 failed","336397315":"DECLARE FILTER @1 failed","336397316":"CREATE INDEX @1 failed","336397317":"CREATE USER @1 failed","336397318":"ALTER USER @1 failed","336397319":"GRANT failed","336397320":"REVOKE failed","336397321":"Recursive member of CTE cannot use aggregate or window function","336397322":"@2 MAPPING @1 failed","336397323":"ALTER SEQUENCE @1 failed","336397324":"CREATE GENERATOR @1 failed","336397325":"SET GENERATOR @1 failed","336397326":"WITH LOCK can be used only with a single physical table","336397327":"FIRST/SKIP cannot be used with OFFSET/FETCH or ROWS","336397328":"WITH LOCK cannot be used with aggregates","336397329":"WITH LOCK cannot be used with @1","336397330":"Number of arguments (@1) exceeds the maximum (@2) number of EXCEPTION USING arguments","336397331":"String literal with @1 bytes exceeds the maximum length of @2 bytes","336397332":"String literal with @1 characters exceeds the maximum length of @2 characters for the @3 character set","336397333":"Too many BEGIN…​END nesting. Maximum level is @1","336397334":"RECREATE USER @1 failed","336723983":"Unable to open database","336723984":"Error in switch specifications","336723985":"No operation specified","336723986":"No user name specified","336723987":"Add record error","336723988":"Modify record error","336723989":"Find / modify record error","336723990":"Record not found for user: @1","336723991":"Delete record error","336723992":"Find / delete record error","336723996":"Find / display record error","336723997":"Invalid parameter, no switch defined","336723998":"Operation already specified","336723999":"Password already specified","336724000":"Uid already specified","336724001":"Gid already specified","336724002":"Project already specified","336724003":"Organization already specified","336724004":"First name already specified","336724005":"Middle name already specified","336724006":"Last name already specified","336724008":"Invalid switch specified","336724009":"Ambiguous switch specified","336724010":"No operation specified for parameters","336724011":"No parameters allowed for this operation","336724012":"Incompatible switches specified","336724044":"Invalid user name (maximum 31 bytes allowed)","336724045":"Warning - maximum 8 significant bytes of password used","336724046":"Database already specified","336724047":"Database administrator name already specified","336724048":"Database administrator password already specified","336724049":"SQL role name already specified","336920577":"Found unknown switch","336920578":"Please retry, giving a database name","336920579":"Wrong ODS version, expected @1, encountered @2","336920580":"Unexpected end of database file","336920605":"Can\'t open database file @1","336920606":"Can\'t read a database page","336920607":"System memory exhausted","336986113":"Wrong value for access mode","336986114":"Wrong value for write mode","336986115":"Wrong value for reserve space","336986116":"Unknown tag (@1) in info_svr_db_info block after isc_svc_query()","336986117":"Unknown tag (@1) in isc_svc_query() results","336986118":"Unknown switch \\"@1\\""}');

/***/ }),

/***/ 24434:
/***/ ((module) => {

"use strict";
module.exports = require("events");

/***/ }),

/***/ 25884:
/***/ ((module) => {

"use strict";


module.exports = (flag, argv = process.argv) => {
	const prefix = flag.startsWith('-') ? '' : (flag.length === 1 ? '-' : '--');
	const position = argv.indexOf(prefix + flag);
	const terminatorPosition = argv.indexOf('--');
	return position !== -1 && (terminatorPosition === -1 || position < terminatorPosition);
};


/***/ }),

/***/ 26276:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var abort = __webpack_require__(74555)
  , async = __webpack_require__(72313)
  ;

// API
module.exports = terminator;

/**
 * Terminates jobs in the attached state context
 *
 * @this  AsyncKitState#
 * @param {function} callback - final callback to invoke after termination
 */
function terminator(callback)
{
  if (!Object.keys(this.jobs).length)
  {
    return;
  }

  // fast forward iteration index
  this.index = this.size;

  // abort jobs
  abort(this);

  // send back results we have so far
  async(callback)(null, this.results);
}


/***/ }),

/***/ 27687:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

const os = __webpack_require__(70857);
const tty = __webpack_require__(52018);
const hasFlag = __webpack_require__(25884);

const {env} = process;

let forceColor;
if (hasFlag('no-color') ||
	hasFlag('no-colors') ||
	hasFlag('color=false') ||
	hasFlag('color=never')) {
	forceColor = 0;
} else if (hasFlag('color') ||
	hasFlag('colors') ||
	hasFlag('color=true') ||
	hasFlag('color=always')) {
	forceColor = 1;
}

if ('FORCE_COLOR' in env) {
	if (env.FORCE_COLOR === 'true') {
		forceColor = 1;
	} else if (env.FORCE_COLOR === 'false') {
		forceColor = 0;
	} else {
		forceColor = env.FORCE_COLOR.length === 0 ? 1 : Math.min(parseInt(env.FORCE_COLOR, 10), 3);
	}
}

function translateLevel(level) {
	if (level === 0) {
		return false;
	}

	return {
		level,
		hasBasic: true,
		has256: level >= 2,
		has16m: level >= 3
	};
}

function supportsColor(haveStream, streamIsTTY) {
	if (forceColor === 0) {
		return 0;
	}

	if (hasFlag('color=16m') ||
		hasFlag('color=full') ||
		hasFlag('color=truecolor')) {
		return 3;
	}

	if (hasFlag('color=256')) {
		return 2;
	}

	if (haveStream && !streamIsTTY && forceColor === undefined) {
		return 0;
	}

	const min = forceColor || 0;

	if (env.TERM === 'dumb') {
		return min;
	}

	if (process.platform === 'win32') {
		// Windows 10 build 10586 is the first Windows release that supports 256 colors.
		// Windows 10 build 14931 is the first release that supports 16m/TrueColor.
		const osRelease = os.release().split('.');
		if (
			Number(osRelease[0]) >= 10 &&
			Number(osRelease[2]) >= 10586
		) {
			return Number(osRelease[2]) >= 14931 ? 3 : 2;
		}

		return 1;
	}

	if ('CI' in env) {
		if (['TRAVIS', 'CIRCLECI', 'APPVEYOR', 'GITLAB_CI', 'GITHUB_ACTIONS', 'BUILDKITE'].some(sign => sign in env) || env.CI_NAME === 'codeship') {
			return 1;
		}

		return min;
	}

	if ('TEAMCITY_VERSION' in env) {
		return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(env.TEAMCITY_VERSION) ? 1 : 0;
	}

	if (env.COLORTERM === 'truecolor') {
		return 3;
	}

	if ('TERM_PROGRAM' in env) {
		const version = parseInt((env.TERM_PROGRAM_VERSION || '').split('.')[0], 10);

		switch (env.TERM_PROGRAM) {
			case 'iTerm.app':
				return version >= 3 ? 3 : 2;
			case 'Apple_Terminal':
				return 2;
			// No default
		}
	}

	if (/-256(color)?$/i.test(env.TERM)) {
		return 2;
	}

	if (/^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(env.TERM)) {
		return 1;
	}

	if ('COLORTERM' in env) {
		return 1;
	}

	return min;
}

function getSupportLevel(stream) {
	const level = supportsColor(stream, stream && stream.isTTY);
	return translateLevel(level);
}

module.exports = {
	supportsColor: getSupportLevel,
	stdout: translateLevel(supportsColor(true, tty.isatty(1))),
	stderr: translateLevel(supportsColor(true, tty.isatty(2)))
};


/***/ }),

/***/ 30216:
/***/ ((module) => {

function doError(obj, callback) {
    if (callback)
        callback(obj)
}

function isError(obj) {
    return Boolean(
        obj != null && typeof obj === "object" && !Array.isArray(obj) && obj.status
    );
}

function doCallback(obj, callback) {

    if (!callback)
        return;

    if (obj instanceof Error) {
        callback(obj);
        return;
    }

    if (isError(obj)) {
        var error = new Error(obj.message);
        var status = obj.status && obj.status.length && obj.status[0] || {};
        error.gdscode = status.gdscode; // main error gds code
        error.gdsparams = status.params; // parameters (constraint name, table, etc.)
        callback(error);
        return;
    }

    callback(undefined, obj);

}

module.exports = {
    doError,
    doCallback
}


/***/ }),

/***/ 30655:
/***/ ((module) => {

"use strict";


/** @type {import('.')} */
var $defineProperty = Object.defineProperty || false;
if ($defineProperty) {
	try {
		$defineProperty({}, 'a', { value: 1 });
	} catch (e) {
		// IE 8 has a broken defineProperty
		$defineProperty = false;
	}
}

module.exports = $defineProperty;


/***/ }),

/***/ 30737:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var CombinedStream = __webpack_require__(80801);
var util = __webpack_require__(39023);
var path = __webpack_require__(16928);
var http = __webpack_require__(58611);
var https = __webpack_require__(65692);
var parseUrl = (__webpack_require__(87016).parse);
var fs = __webpack_require__(79896);
var Stream = (__webpack_require__(2203).Stream);
var crypto = __webpack_require__(76982);
var mime = __webpack_require__(86049);
var asynckit = __webpack_require__(21873);
var setToStringTag = __webpack_require__(49605);
var hasOwn = __webpack_require__(9957);
var populate = __webpack_require__(41362);

/**
 * Create readable "multipart/form-data" streams.
 * Can be used to submit forms
 * and file uploads to other web applications.
 *
 * @constructor
 * @param {object} options - Properties to be added/overriden for FormData and CombinedStream
 */
function FormData(options) {
  if (!(this instanceof FormData)) {
    return new FormData(options);
  }

  this._overheadLength = 0;
  this._valueLength = 0;
  this._valuesToMeasure = [];

  CombinedStream.call(this);

  options = options || {}; // eslint-disable-line no-param-reassign
  for (var option in options) { // eslint-disable-line no-restricted-syntax
    this[option] = options[option];
  }
}

// make it a Stream
util.inherits(FormData, CombinedStream);

FormData.LINE_BREAK = '\r\n';
FormData.DEFAULT_CONTENT_TYPE = 'application/octet-stream';

FormData.prototype.append = function (field, value, options) {
  options = options || {}; // eslint-disable-line no-param-reassign

  // allow filename as single option
  if (typeof options === 'string') {
    options = { filename: options }; // eslint-disable-line no-param-reassign
  }

  var append = CombinedStream.prototype.append.bind(this);

  // all that streamy business can't handle numbers
  if (typeof value === 'number' || value == null) {
    value = String(value); // eslint-disable-line no-param-reassign
  }

  // https://github.com/felixge/node-form-data/issues/38
  if (Array.isArray(value)) {
    /*
     * Please convert your array into string
     * the way web server expects it
     */
    this._error(new Error('Arrays are not supported.'));
    return;
  }

  var header = this._multiPartHeader(field, value, options);
  var footer = this._multiPartFooter();

  append(header);
  append(value);
  append(footer);

  // pass along options.knownLength
  this._trackLength(header, value, options);
};

FormData.prototype._trackLength = function (header, value, options) {
  var valueLength = 0;

  /*
   * used w/ getLengthSync(), when length is known.
   * e.g. for streaming directly from a remote server,
   * w/ a known file a size, and not wanting to wait for
   * incoming file to finish to get its size.
   */
  if (options.knownLength != null) {
    valueLength += Number(options.knownLength);
  } else if (Buffer.isBuffer(value)) {
    valueLength = value.length;
  } else if (typeof value === 'string') {
    valueLength = Buffer.byteLength(value);
  }

  this._valueLength += valueLength;

  // @check why add CRLF? does this account for custom/multiple CRLFs?
  this._overheadLength += Buffer.byteLength(header) + FormData.LINE_BREAK.length;

  // empty or either doesn't have path or not an http response or not a stream
  if (!value || (!value.path && !(value.readable && hasOwn(value, 'httpVersion')) && !(value instanceof Stream))) {
    return;
  }

  // no need to bother with the length
  if (!options.knownLength) {
    this._valuesToMeasure.push(value);
  }
};

FormData.prototype._lengthRetriever = function (value, callback) {
  if (hasOwn(value, 'fd')) {
    // take read range into a account
    // `end` = Infinity –> read file till the end
    //
    // TODO: Looks like there is bug in Node fs.createReadStream
    // it doesn't respect `end` options without `start` options
    // Fix it when node fixes it.
    // https://github.com/joyent/node/issues/7819
    if (value.end != undefined && value.end != Infinity && value.start != undefined) {
      // when end specified
      // no need to calculate range
      // inclusive, starts with 0
      callback(null, value.end + 1 - (value.start ? value.start : 0)); // eslint-disable-line callback-return

      // not that fast snoopy
    } else {
      // still need to fetch file size from fs
      fs.stat(value.path, function (err, stat) {
        if (err) {
          callback(err);
          return;
        }

        // update final size based on the range options
        var fileSize = stat.size - (value.start ? value.start : 0);
        callback(null, fileSize);
      });
    }

    // or http response
  } else if (hasOwn(value, 'httpVersion')) {
    callback(null, Number(value.headers['content-length'])); // eslint-disable-line callback-return

    // or request stream http://github.com/mikeal/request
  } else if (hasOwn(value, 'httpModule')) {
    // wait till response come back
    value.on('response', function (response) {
      value.pause();
      callback(null, Number(response.headers['content-length']));
    });
    value.resume();

    // something else
  } else {
    callback('Unknown stream'); // eslint-disable-line callback-return
  }
};

FormData.prototype._multiPartHeader = function (field, value, options) {
  /*
   * custom header specified (as string)?
   * it becomes responsible for boundary
   * (e.g. to handle extra CRLFs on .NET servers)
   */
  if (typeof options.header === 'string') {
    return options.header;
  }

  var contentDisposition = this._getContentDisposition(value, options);
  var contentType = this._getContentType(value, options);

  var contents = '';
  var headers = {
    // add custom disposition as third element or keep it two elements if not
    'Content-Disposition': ['form-data', 'name="' + field + '"'].concat(contentDisposition || []),
    // if no content type. allow it to be empty array
    'Content-Type': [].concat(contentType || [])
  };

  // allow custom headers.
  if (typeof options.header === 'object') {
    populate(headers, options.header);
  }

  var header;
  for (var prop in headers) { // eslint-disable-line no-restricted-syntax
    if (hasOwn(headers, prop)) {
      header = headers[prop];

      // skip nullish headers.
      if (header == null) {
        continue; // eslint-disable-line no-restricted-syntax, no-continue
      }

      // convert all headers to arrays.
      if (!Array.isArray(header)) {
        header = [header];
      }

      // add non-empty headers.
      if (header.length) {
        contents += prop + ': ' + header.join('; ') + FormData.LINE_BREAK;
      }
    }
  }

  return '--' + this.getBoundary() + FormData.LINE_BREAK + contents + FormData.LINE_BREAK;
};

FormData.prototype._getContentDisposition = function (value, options) { // eslint-disable-line consistent-return
  var filename;

  if (typeof options.filepath === 'string') {
    // custom filepath for relative paths
    filename = path.normalize(options.filepath).replace(/\\/g, '/');
  } else if (options.filename || (value && (value.name || value.path))) {
    /*
     * custom filename take precedence
     * formidable and the browser add a name property
     * fs- and request- streams have path property
     */
    filename = path.basename(options.filename || (value && (value.name || value.path)));
  } else if (value && value.readable && hasOwn(value, 'httpVersion')) {
    // or try http response
    filename = path.basename(value.client._httpMessage.path || '');
  }

  if (filename) {
    return 'filename="' + filename + '"';
  }
};

FormData.prototype._getContentType = function (value, options) {
  // use custom content-type above all
  var contentType = options.contentType;

  // or try `name` from formidable, browser
  if (!contentType && value && value.name) {
    contentType = mime.lookup(value.name);
  }

  // or try `path` from fs-, request- streams
  if (!contentType && value && value.path) {
    contentType = mime.lookup(value.path);
  }

  // or if it's http-reponse
  if (!contentType && value && value.readable && hasOwn(value, 'httpVersion')) {
    contentType = value.headers['content-type'];
  }

  // or guess it from the filepath or filename
  if (!contentType && (options.filepath || options.filename)) {
    contentType = mime.lookup(options.filepath || options.filename);
  }

  // fallback to the default content type if `value` is not simple value
  if (!contentType && value && typeof value === 'object') {
    contentType = FormData.DEFAULT_CONTENT_TYPE;
  }

  return contentType;
};

FormData.prototype._multiPartFooter = function () {
  return function (next) {
    var footer = FormData.LINE_BREAK;

    var lastPart = this._streams.length === 0;
    if (lastPart) {
      footer += this._lastBoundary();
    }

    next(footer);
  }.bind(this);
};

FormData.prototype._lastBoundary = function () {
  return '--' + this.getBoundary() + '--' + FormData.LINE_BREAK;
};

FormData.prototype.getHeaders = function (userHeaders) {
  var header;
  var formHeaders = {
    'content-type': 'multipart/form-data; boundary=' + this.getBoundary()
  };

  for (header in userHeaders) { // eslint-disable-line no-restricted-syntax
    if (hasOwn(userHeaders, header)) {
      formHeaders[header.toLowerCase()] = userHeaders[header];
    }
  }

  return formHeaders;
};

FormData.prototype.setBoundary = function (boundary) {
  if (typeof boundary !== 'string') {
    throw new TypeError('FormData boundary must be a string');
  }
  this._boundary = boundary;
};

FormData.prototype.getBoundary = function () {
  if (!this._boundary) {
    this._generateBoundary();
  }

  return this._boundary;
};

FormData.prototype.getBuffer = function () {
  var dataBuffer = new Buffer.alloc(0); // eslint-disable-line new-cap
  var boundary = this.getBoundary();

  // Create the form content. Add Line breaks to the end of data.
  for (var i = 0, len = this._streams.length; i < len; i++) {
    if (typeof this._streams[i] !== 'function') {
      // Add content to the buffer.
      if (Buffer.isBuffer(this._streams[i])) {
        dataBuffer = Buffer.concat([dataBuffer, this._streams[i]]);
      } else {
        dataBuffer = Buffer.concat([dataBuffer, Buffer.from(this._streams[i])]);
      }

      // Add break after content.
      if (typeof this._streams[i] !== 'string' || this._streams[i].substring(2, boundary.length + 2) !== boundary) {
        dataBuffer = Buffer.concat([dataBuffer, Buffer.from(FormData.LINE_BREAK)]);
      }
    }
  }

  // Add the footer and return the Buffer object.
  return Buffer.concat([dataBuffer, Buffer.from(this._lastBoundary())]);
};

FormData.prototype._generateBoundary = function () {
  // This generates a 50 character boundary similar to those used by Firefox.

  // They are optimized for boyer-moore parsing.
  this._boundary = '--------------------------' + crypto.randomBytes(12).toString('hex');
};

// Note: getLengthSync DOESN'T calculate streams length
// As workaround one can calculate file size manually and add it as knownLength option
FormData.prototype.getLengthSync = function () {
  var knownLength = this._overheadLength + this._valueLength;

  // Don't get confused, there are 3 "internal" streams for each keyval pair so it basically checks if there is any value added to the form
  if (this._streams.length) {
    knownLength += this._lastBoundary().length;
  }

  // https://github.com/form-data/form-data/issues/40
  if (!this.hasKnownLength()) {
    /*
     * Some async length retrievers are present
     * therefore synchronous length calculation is false.
     * Please use getLength(callback) to get proper length
     */
    this._error(new Error('Cannot calculate proper length in synchronous way.'));
  }

  return knownLength;
};

// Public API to check if length of added values is known
// https://github.com/form-data/form-data/issues/196
// https://github.com/form-data/form-data/issues/262
FormData.prototype.hasKnownLength = function () {
  var hasKnownLength = true;

  if (this._valuesToMeasure.length) {
    hasKnownLength = false;
  }

  return hasKnownLength;
};

FormData.prototype.getLength = function (cb) {
  var knownLength = this._overheadLength + this._valueLength;

  if (this._streams.length) {
    knownLength += this._lastBoundary().length;
  }

  if (!this._valuesToMeasure.length) {
    process.nextTick(cb.bind(this, null, knownLength));
    return;
  }

  asynckit.parallel(this._valuesToMeasure, this._lengthRetriever, function (err, values) {
    if (err) {
      cb(err);
      return;
    }

    values.forEach(function (length) {
      knownLength += length;
    });

    cb(null, knownLength);
  });
};

FormData.prototype.submit = function (params, cb) {
  var request;
  var options;
  var defaults = { method: 'post' };

  // parse provided url if it's string or treat it as options object
  if (typeof params === 'string') {
    params = parseUrl(params); // eslint-disable-line no-param-reassign
    /* eslint sort-keys: 0 */
    options = populate({
      port: params.port,
      path: params.pathname,
      host: params.hostname,
      protocol: params.protocol
    }, defaults);
  } else { // use custom params
    options = populate(params, defaults);
    // if no port provided use default one
    if (!options.port) {
      options.port = options.protocol === 'https:' ? 443 : 80;
    }
  }

  // put that good code in getHeaders to some use
  options.headers = this.getHeaders(params.headers);

  // https if specified, fallback to http in any other case
  if (options.protocol === 'https:') {
    request = https.request(options);
  } else {
    request = http.request(options);
  }

  // get content length and fire away
  this.getLength(function (err, length) {
    if (err && err !== 'Unknown stream') {
      this._error(err);
      return;
    }

    // add content length
    if (length) {
      request.setHeader('Content-Length', length);
    }

    this.pipe(request);
    if (cb) {
      var onResponse;

      var callback = function (error, responce) {
        request.removeListener('error', callback);
        request.removeListener('response', onResponse);

        return cb.call(this, error, responce); // eslint-disable-line no-invalid-this
      };

      onResponse = callback.bind(this, null);

      request.on('error', callback);
      request.on('response', onResponse);
    }
  }.bind(this));

  return request;
};

FormData.prototype._error = function (err) {
  if (!this.error) {
    this.error = err;
    this.pause();
    this.emit('error', err);
  }
};

FormData.prototype.toString = function () {
  return '[object FormData]';
};
setToStringTag(FormData, 'FormData');

// Public API
module.exports = FormData;


/***/ }),

/***/ 35017:
/***/ (function(module, exports) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;// GENERATED FILE. DO NOT EDIT.
(function (global, factory) {
  function preferDefault(exports) {
    return exports.default || exports;
  }
  if (true) {
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = (function () {
      var exports = {};
      factory(exports);
      return preferDefault(exports);
    }).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else // removed by dead control flow
{}
})(
  typeof globalThis !== "undefined"
    ? globalThis
    : typeof self !== "undefined"
      ? self
      : this,
  function (_exports) {
    "use strict";

    Object.defineProperty(_exports, "__esModule", {
      value: true,
    });
    _exports.default = void 0;
    /**
     * @license
     * Copyright 2009 The Closure Library Authors
     * Copyright 2020 Daniel Wirtz / The long.js Authors.
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *     http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     *
     * SPDX-License-Identifier: Apache-2.0
     */

    // WebAssembly optimizations to do native i64 multiplication and divide
    var wasm = null;
    try {
      wasm = new WebAssembly.Instance(
        new WebAssembly.Module(
          new Uint8Array([
            // \0asm
            0, 97, 115, 109,
            // version 1
            1, 0, 0, 0,
            // section "type"
            1, 13, 2,
            // 0, () => i32
            96, 0, 1, 127,
            // 1, (i32, i32, i32, i32) => i32
            96, 4, 127, 127, 127, 127, 1, 127,
            // section "function"
            3, 7, 6,
            // 0, type 0
            0,
            // 1, type 1
            1,
            // 2, type 1
            1,
            // 3, type 1
            1,
            // 4, type 1
            1,
            // 5, type 1
            1,
            // section "global"
            6, 6, 1,
            // 0, "high", mutable i32
            127, 1, 65, 0, 11,
            // section "export"
            7, 50, 6,
            // 0, "mul"
            3, 109, 117, 108, 0, 1,
            // 1, "div_s"
            5, 100, 105, 118, 95, 115, 0, 2,
            // 2, "div_u"
            5, 100, 105, 118, 95, 117, 0, 3,
            // 3, "rem_s"
            5, 114, 101, 109, 95, 115, 0, 4,
            // 4, "rem_u"
            5, 114, 101, 109, 95, 117, 0, 5,
            // 5, "get_high"
            8, 103, 101, 116, 95, 104, 105, 103, 104, 0, 0,
            // section "code"
            10, 191, 1, 6,
            // 0, "get_high"
            4, 0, 35, 0, 11,
            // 1, "mul"
            36, 1, 1, 126, 32, 0, 173, 32, 1, 173, 66, 32, 134, 132, 32, 2, 173,
            32, 3, 173, 66, 32, 134, 132, 126, 34, 4, 66, 32, 135, 167, 36, 0,
            32, 4, 167, 11,
            // 2, "div_s"
            36, 1, 1, 126, 32, 0, 173, 32, 1, 173, 66, 32, 134, 132, 32, 2, 173,
            32, 3, 173, 66, 32, 134, 132, 127, 34, 4, 66, 32, 135, 167, 36, 0,
            32, 4, 167, 11,
            // 3, "div_u"
            36, 1, 1, 126, 32, 0, 173, 32, 1, 173, 66, 32, 134, 132, 32, 2, 173,
            32, 3, 173, 66, 32, 134, 132, 128, 34, 4, 66, 32, 135, 167, 36, 0,
            32, 4, 167, 11,
            // 4, "rem_s"
            36, 1, 1, 126, 32, 0, 173, 32, 1, 173, 66, 32, 134, 132, 32, 2, 173,
            32, 3, 173, 66, 32, 134, 132, 129, 34, 4, 66, 32, 135, 167, 36, 0,
            32, 4, 167, 11,
            // 5, "rem_u"
            36, 1, 1, 126, 32, 0, 173, 32, 1, 173, 66, 32, 134, 132, 32, 2, 173,
            32, 3, 173, 66, 32, 134, 132, 130, 34, 4, 66, 32, 135, 167, 36, 0,
            32, 4, 167, 11,
          ]),
        ),
        {},
      ).exports;
    } catch {
      // no wasm support :(
    }

    /**
     * Constructs a 64 bit two's-complement integer, given its low and high 32 bit values as *signed* integers.
     *  See the from* functions below for more convenient ways of constructing Longs.
     * @exports Long
     * @class A Long class for representing a 64 bit two's-complement integer value.
     * @param {number} low The low (signed) 32 bits of the long
     * @param {number} high The high (signed) 32 bits of the long
     * @param {boolean=} unsigned Whether unsigned or not, defaults to signed
     * @constructor
     */
    function Long(low, high, unsigned) {
      /**
       * The low 32 bits as a signed value.
       * @type {number}
       */
      this.low = low | 0;

      /**
       * The high 32 bits as a signed value.
       * @type {number}
       */
      this.high = high | 0;

      /**
       * Whether unsigned or not.
       * @type {boolean}
       */
      this.unsigned = !!unsigned;
    }

    // The internal representation of a long is the two given signed, 32-bit values.
    // We use 32-bit pieces because these are the size of integers on which
    // Javascript performs bit-operations.  For operations like addition and
    // multiplication, we split each number into 16 bit pieces, which can easily be
    // multiplied within Javascript's floating-point representation without overflow
    // or change in sign.
    //
    // In the algorithms below, we frequently reduce the negative case to the
    // positive case by negating the input(s) and then post-processing the result.
    // Note that we must ALWAYS check specially whether those values are MIN_VALUE
    // (-2^63) because -MIN_VALUE == MIN_VALUE (since 2^63 cannot be represented as
    // a positive number, it overflows back into a negative).  Not handling this
    // case would often result in infinite recursion.
    //
    // Common constant values ZERO, ONE, NEG_ONE, etc. are defined below the from*
    // methods on which they depend.

    /**
     * An indicator used to reliably determine if an object is a Long or not.
     * @type {boolean}
     * @const
     * @private
     */
    Long.prototype.__isLong__;
    Object.defineProperty(Long.prototype, "__isLong__", {
      value: true,
    });

    /**
     * @function
     * @param {*} obj Object
     * @returns {boolean}
     * @inner
     */
    function isLong(obj) {
      return (obj && obj["__isLong__"]) === true;
    }

    /**
     * @function
     * @param {*} value number
     * @returns {number}
     * @inner
     */
    function ctz32(value) {
      var c = Math.clz32(value & -value);
      return value ? 31 - c : c;
    }

    /**
     * Tests if the specified object is a Long.
     * @function
     * @param {*} obj Object
     * @returns {boolean}
     */
    Long.isLong = isLong;

    /**
     * A cache of the Long representations of small integer values.
     * @type {!Object}
     * @inner
     */
    var INT_CACHE = {};

    /**
     * A cache of the Long representations of small unsigned integer values.
     * @type {!Object}
     * @inner
     */
    var UINT_CACHE = {};

    /**
     * @param {number} value
     * @param {boolean=} unsigned
     * @returns {!Long}
     * @inner
     */
    function fromInt(value, unsigned) {
      var obj, cachedObj, cache;
      if (unsigned) {
        value >>>= 0;
        if ((cache = 0 <= value && value < 256)) {
          cachedObj = UINT_CACHE[value];
          if (cachedObj) return cachedObj;
        }
        obj = fromBits(value, 0, true);
        if (cache) UINT_CACHE[value] = obj;
        return obj;
      } else {
        value |= 0;
        if ((cache = -128 <= value && value < 128)) {
          cachedObj = INT_CACHE[value];
          if (cachedObj) return cachedObj;
        }
        obj = fromBits(value, value < 0 ? -1 : 0, false);
        if (cache) INT_CACHE[value] = obj;
        return obj;
      }
    }

    /**
     * Returns a Long representing the given 32 bit integer value.
     * @function
     * @param {number} value The 32 bit integer in question
     * @param {boolean=} unsigned Whether unsigned or not, defaults to signed
     * @returns {!Long} The corresponding Long value
     */
    Long.fromInt = fromInt;

    /**
     * @param {number} value
     * @param {boolean=} unsigned
     * @returns {!Long}
     * @inner
     */
    function fromNumber(value, unsigned) {
      if (isNaN(value)) return unsigned ? UZERO : ZERO;
      if (unsigned) {
        if (value < 0) return UZERO;
        if (value >= TWO_PWR_64_DBL) return MAX_UNSIGNED_VALUE;
      } else {
        if (value <= -TWO_PWR_63_DBL) return MIN_VALUE;
        if (value + 1 >= TWO_PWR_63_DBL) return MAX_VALUE;
      }
      if (value < 0) return fromNumber(-value, unsigned).neg();
      return fromBits(
        value % TWO_PWR_32_DBL | 0,
        (value / TWO_PWR_32_DBL) | 0,
        unsigned,
      );
    }

    /**
     * Returns a Long representing the given value, provided that it is a finite number. Otherwise, zero is returned.
     * @function
     * @param {number} value The number in question
     * @param {boolean=} unsigned Whether unsigned or not, defaults to signed
     * @returns {!Long} The corresponding Long value
     */
    Long.fromNumber = fromNumber;

    /**
     * @param {number} lowBits
     * @param {number} highBits
     * @param {boolean=} unsigned
     * @returns {!Long}
     * @inner
     */
    function fromBits(lowBits, highBits, unsigned) {
      return new Long(lowBits, highBits, unsigned);
    }

    /**
     * Returns a Long representing the 64 bit integer that comes by concatenating the given low and high bits. Each is
     *  assumed to use 32 bits.
     * @function
     * @param {number} lowBits The low 32 bits
     * @param {number} highBits The high 32 bits
     * @param {boolean=} unsigned Whether unsigned or not, defaults to signed
     * @returns {!Long} The corresponding Long value
     */
    Long.fromBits = fromBits;

    /**
     * @function
     * @param {number} base
     * @param {number} exponent
     * @returns {number}
     * @inner
     */
    var pow_dbl = Math.pow; // Used 4 times (4*8 to 15+4)

    /**
     * @param {string} str
     * @param {(boolean|number)=} unsigned
     * @param {number=} radix
     * @returns {!Long}
     * @inner
     */
    function fromString(str, unsigned, radix) {
      if (str.length === 0) throw Error("empty string");
      if (typeof unsigned === "number") {
        // For goog.math.long compatibility
        radix = unsigned;
        unsigned = false;
      } else {
        unsigned = !!unsigned;
      }
      if (
        str === "NaN" ||
        str === "Infinity" ||
        str === "+Infinity" ||
        str === "-Infinity"
      )
        return unsigned ? UZERO : ZERO;
      radix = radix || 10;
      if (radix < 2 || 36 < radix) throw RangeError("radix");
      var p;
      if ((p = str.indexOf("-")) > 0) throw Error("interior hyphen");
      else if (p === 0) {
        return fromString(str.substring(1), unsigned, radix).neg();
      }

      // Do several (8) digits each time through the loop, so as to
      // minimize the calls to the very expensive emulated div.
      var radixToPower = fromNumber(pow_dbl(radix, 8));
      var result = ZERO;
      for (var i = 0; i < str.length; i += 8) {
        var size = Math.min(8, str.length - i),
          value = parseInt(str.substring(i, i + size), radix);
        if (size < 8) {
          var power = fromNumber(pow_dbl(radix, size));
          result = result.mul(power).add(fromNumber(value));
        } else {
          result = result.mul(radixToPower);
          result = result.add(fromNumber(value));
        }
      }
      result.unsigned = unsigned;
      return result;
    }

    /**
     * Returns a Long representation of the given string, written using the specified radix.
     * @function
     * @param {string} str The textual representation of the Long
     * @param {(boolean|number)=} unsigned Whether unsigned or not, defaults to signed
     * @param {number=} radix The radix in which the text is written (2-36), defaults to 10
     * @returns {!Long} The corresponding Long value
     */
    Long.fromString = fromString;

    /**
     * @function
     * @param {!Long|number|string|!{low: number, high: number, unsigned: boolean}} val
     * @param {boolean=} unsigned
     * @returns {!Long}
     * @inner
     */
    function fromValue(val, unsigned) {
      if (typeof val === "number") return fromNumber(val, unsigned);
      if (typeof val === "string") return fromString(val, unsigned);
      // Throws for non-objects, converts non-instanceof Long:
      return fromBits(
        val.low,
        val.high,
        typeof unsigned === "boolean" ? unsigned : val.unsigned,
      );
    }

    /**
     * Converts the specified value to a Long using the appropriate from* function for its type.
     * @function
     * @param {!Long|number|bigint|string|!{low: number, high: number, unsigned: boolean}} val Value
     * @param {boolean=} unsigned Whether unsigned or not, defaults to signed
     * @returns {!Long}
     */
    Long.fromValue = fromValue;

    // NOTE: the compiler should inline these constant values below and then remove these variables, so there should be
    // no runtime penalty for these.

    /**
     * @type {number}
     * @const
     * @inner
     */
    var TWO_PWR_16_DBL = 1 << 16;

    /**
     * @type {number}
     * @const
     * @inner
     */
    var TWO_PWR_24_DBL = 1 << 24;

    /**
     * @type {number}
     * @const
     * @inner
     */
    var TWO_PWR_32_DBL = TWO_PWR_16_DBL * TWO_PWR_16_DBL;

    /**
     * @type {number}
     * @const
     * @inner
     */
    var TWO_PWR_64_DBL = TWO_PWR_32_DBL * TWO_PWR_32_DBL;

    /**
     * @type {number}
     * @const
     * @inner
     */
    var TWO_PWR_63_DBL = TWO_PWR_64_DBL / 2;

    /**
     * @type {!Long}
     * @const
     * @inner
     */
    var TWO_PWR_24 = fromInt(TWO_PWR_24_DBL);

    /**
     * @type {!Long}
     * @inner
     */
    var ZERO = fromInt(0);

    /**
     * Signed zero.
     * @type {!Long}
     */
    Long.ZERO = ZERO;

    /**
     * @type {!Long}
     * @inner
     */
    var UZERO = fromInt(0, true);

    /**
     * Unsigned zero.
     * @type {!Long}
     */
    Long.UZERO = UZERO;

    /**
     * @type {!Long}
     * @inner
     */
    var ONE = fromInt(1);

    /**
     * Signed one.
     * @type {!Long}
     */
    Long.ONE = ONE;

    /**
     * @type {!Long}
     * @inner
     */
    var UONE = fromInt(1, true);

    /**
     * Unsigned one.
     * @type {!Long}
     */
    Long.UONE = UONE;

    /**
     * @type {!Long}
     * @inner
     */
    var NEG_ONE = fromInt(-1);

    /**
     * Signed negative one.
     * @type {!Long}
     */
    Long.NEG_ONE = NEG_ONE;

    /**
     * @type {!Long}
     * @inner
     */
    var MAX_VALUE = fromBits(0xffffffff | 0, 0x7fffffff | 0, false);

    /**
     * Maximum signed value.
     * @type {!Long}
     */
    Long.MAX_VALUE = MAX_VALUE;

    /**
     * @type {!Long}
     * @inner
     */
    var MAX_UNSIGNED_VALUE = fromBits(0xffffffff | 0, 0xffffffff | 0, true);

    /**
     * Maximum unsigned value.
     * @type {!Long}
     */
    Long.MAX_UNSIGNED_VALUE = MAX_UNSIGNED_VALUE;

    /**
     * @type {!Long}
     * @inner
     */
    var MIN_VALUE = fromBits(0, 0x80000000 | 0, false);

    /**
     * Minimum signed value.
     * @type {!Long}
     */
    Long.MIN_VALUE = MIN_VALUE;

    /**
     * @alias Long.prototype
     * @inner
     */
    var LongPrototype = Long.prototype;

    /**
     * Converts the Long to a 32 bit integer, assuming it is a 32 bit integer.
     * @this {!Long}
     * @returns {number}
     */
    LongPrototype.toInt = function toInt() {
      return this.unsigned ? this.low >>> 0 : this.low;
    };

    /**
     * Converts the Long to a the nearest floating-point representation of this value (double, 53 bit mantissa).
     * @this {!Long}
     * @returns {number}
     */
    LongPrototype.toNumber = function toNumber() {
      if (this.unsigned)
        return (this.high >>> 0) * TWO_PWR_32_DBL + (this.low >>> 0);
      return this.high * TWO_PWR_32_DBL + (this.low >>> 0);
    };

    /**
     * Converts the Long to a string written in the specified radix.
     * @this {!Long}
     * @param {number=} radix Radix (2-36), defaults to 10
     * @returns {string}
     * @override
     * @throws {RangeError} If `radix` is out of range
     */
    LongPrototype.toString = function toString(radix) {
      radix = radix || 10;
      if (radix < 2 || 36 < radix) throw RangeError("radix");
      if (this.isZero()) return "0";
      if (this.isNegative()) {
        // Unsigned Longs are never negative
        if (this.eq(MIN_VALUE)) {
          // We need to change the Long value before it can be negated, so we remove
          // the bottom-most digit in this base and then recurse to do the rest.
          var radixLong = fromNumber(radix),
            div = this.div(radixLong),
            rem1 = div.mul(radixLong).sub(this);
          return div.toString(radix) + rem1.toInt().toString(radix);
        } else return "-" + this.neg().toString(radix);
      }

      // Do several (6) digits each time through the loop, so as to
      // minimize the calls to the very expensive emulated div.
      var radixToPower = fromNumber(pow_dbl(radix, 6), this.unsigned),
        rem = this;
      var result = "";
      while (true) {
        var remDiv = rem.div(radixToPower),
          intval = rem.sub(remDiv.mul(radixToPower)).toInt() >>> 0,
          digits = intval.toString(radix);
        rem = remDiv;
        if (rem.isZero()) return digits + result;
        else {
          while (digits.length < 6) digits = "0" + digits;
          result = "" + digits + result;
        }
      }
    };

    /**
     * Gets the high 32 bits as a signed integer.
     * @this {!Long}
     * @returns {number} Signed high bits
     */
    LongPrototype.getHighBits = function getHighBits() {
      return this.high;
    };

    /**
     * Gets the high 32 bits as an unsigned integer.
     * @this {!Long}
     * @returns {number} Unsigned high bits
     */
    LongPrototype.getHighBitsUnsigned = function getHighBitsUnsigned() {
      return this.high >>> 0;
    };

    /**
     * Gets the low 32 bits as a signed integer.
     * @this {!Long}
     * @returns {number} Signed low bits
     */
    LongPrototype.getLowBits = function getLowBits() {
      return this.low;
    };

    /**
     * Gets the low 32 bits as an unsigned integer.
     * @this {!Long}
     * @returns {number} Unsigned low bits
     */
    LongPrototype.getLowBitsUnsigned = function getLowBitsUnsigned() {
      return this.low >>> 0;
    };

    /**
     * Gets the number of bits needed to represent the absolute value of this Long.
     * @this {!Long}
     * @returns {number}
     */
    LongPrototype.getNumBitsAbs = function getNumBitsAbs() {
      if (this.isNegative())
        // Unsigned Longs are never negative
        return this.eq(MIN_VALUE) ? 64 : this.neg().getNumBitsAbs();
      var val = this.high != 0 ? this.high : this.low;
      for (var bit = 31; bit > 0; bit--) if ((val & (1 << bit)) != 0) break;
      return this.high != 0 ? bit + 33 : bit + 1;
    };

    /**
     * Tests if this Long can be safely represented as a JavaScript number.
     * @this {!Long}
     * @returns {boolean}
     */
    LongPrototype.isSafeInteger = function isSafeInteger() {
      // 2^53-1 is the maximum safe value
      var top11Bits = this.high >> 21;
      // [0, 2^53-1]
      if (!top11Bits) return true;
      // > 2^53-1
      if (this.unsigned) return false;
      // [-2^53, -1] except -2^53
      return top11Bits === -1 && !(this.low === 0 && this.high === -0x200000);
    };

    /**
     * Tests if this Long's value equals zero.
     * @this {!Long}
     * @returns {boolean}
     */
    LongPrototype.isZero = function isZero() {
      return this.high === 0 && this.low === 0;
    };

    /**
     * Tests if this Long's value equals zero. This is an alias of {@link Long#isZero}.
     * @returns {boolean}
     */
    LongPrototype.eqz = LongPrototype.isZero;

    /**
     * Tests if this Long's value is negative.
     * @this {!Long}
     * @returns {boolean}
     */
    LongPrototype.isNegative = function isNegative() {
      return !this.unsigned && this.high < 0;
    };

    /**
     * Tests if this Long's value is positive or zero.
     * @this {!Long}
     * @returns {boolean}
     */
    LongPrototype.isPositive = function isPositive() {
      return this.unsigned || this.high >= 0;
    };

    /**
     * Tests if this Long's value is odd.
     * @this {!Long}
     * @returns {boolean}
     */
    LongPrototype.isOdd = function isOdd() {
      return (this.low & 1) === 1;
    };

    /**
     * Tests if this Long's value is even.
     * @this {!Long}
     * @returns {boolean}
     */
    LongPrototype.isEven = function isEven() {
      return (this.low & 1) === 0;
    };

    /**
     * Tests if this Long's value equals the specified's.
     * @this {!Long}
     * @param {!Long|number|bigint|string} other Other value
     * @returns {boolean}
     */
    LongPrototype.equals = function equals(other) {
      if (!isLong(other)) other = fromValue(other);
      if (
        this.unsigned !== other.unsigned &&
        this.high >>> 31 === 1 &&
        other.high >>> 31 === 1
      )
        return false;
      return this.high === other.high && this.low === other.low;
    };

    /**
     * Tests if this Long's value equals the specified's. This is an alias of {@link Long#equals}.
     * @function
     * @param {!Long|number|bigint|string} other Other value
     * @returns {boolean}
     */
    LongPrototype.eq = LongPrototype.equals;

    /**
     * Tests if this Long's value differs from the specified's.
     * @this {!Long}
     * @param {!Long|number|bigint|string} other Other value
     * @returns {boolean}
     */
    LongPrototype.notEquals = function notEquals(other) {
      return !this.eq(/* validates */ other);
    };

    /**
     * Tests if this Long's value differs from the specified's. This is an alias of {@link Long#notEquals}.
     * @function
     * @param {!Long|number|bigint|string} other Other value
     * @returns {boolean}
     */
    LongPrototype.neq = LongPrototype.notEquals;

    /**
     * Tests if this Long's value differs from the specified's. This is an alias of {@link Long#notEquals}.
     * @function
     * @param {!Long|number|bigint|string} other Other value
     * @returns {boolean}
     */
    LongPrototype.ne = LongPrototype.notEquals;

    /**
     * Tests if this Long's value is less than the specified's.
     * @this {!Long}
     * @param {!Long|number|bigint|string} other Other value
     * @returns {boolean}
     */
    LongPrototype.lessThan = function lessThan(other) {
      return this.comp(/* validates */ other) < 0;
    };

    /**
     * Tests if this Long's value is less than the specified's. This is an alias of {@link Long#lessThan}.
     * @function
     * @param {!Long|number|bigint|string} other Other value
     * @returns {boolean}
     */
    LongPrototype.lt = LongPrototype.lessThan;

    /**
     * Tests if this Long's value is less than or equal the specified's.
     * @this {!Long}
     * @param {!Long|number|bigint|string} other Other value
     * @returns {boolean}
     */
    LongPrototype.lessThanOrEqual = function lessThanOrEqual(other) {
      return this.comp(/* validates */ other) <= 0;
    };

    /**
     * Tests if this Long's value is less than or equal the specified's. This is an alias of {@link Long#lessThanOrEqual}.
     * @function
     * @param {!Long|number|bigint|string} other Other value
     * @returns {boolean}
     */
    LongPrototype.lte = LongPrototype.lessThanOrEqual;

    /**
     * Tests if this Long's value is less than or equal the specified's. This is an alias of {@link Long#lessThanOrEqual}.
     * @function
     * @param {!Long|number|bigint|string} other Other value
     * @returns {boolean}
     */
    LongPrototype.le = LongPrototype.lessThanOrEqual;

    /**
     * Tests if this Long's value is greater than the specified's.
     * @this {!Long}
     * @param {!Long|number|bigint|string} other Other value
     * @returns {boolean}
     */
    LongPrototype.greaterThan = function greaterThan(other) {
      return this.comp(/* validates */ other) > 0;
    };

    /**
     * Tests if this Long's value is greater than the specified's. This is an alias of {@link Long#greaterThan}.
     * @function
     * @param {!Long|number|bigint|string} other Other value
     * @returns {boolean}
     */
    LongPrototype.gt = LongPrototype.greaterThan;

    /**
     * Tests if this Long's value is greater than or equal the specified's.
     * @this {!Long}
     * @param {!Long|number|bigint|string} other Other value
     * @returns {boolean}
     */
    LongPrototype.greaterThanOrEqual = function greaterThanOrEqual(other) {
      return this.comp(/* validates */ other) >= 0;
    };

    /**
     * Tests if this Long's value is greater than or equal the specified's. This is an alias of {@link Long#greaterThanOrEqual}.
     * @function
     * @param {!Long|number|bigint|string} other Other value
     * @returns {boolean}
     */
    LongPrototype.gte = LongPrototype.greaterThanOrEqual;

    /**
     * Tests if this Long's value is greater than or equal the specified's. This is an alias of {@link Long#greaterThanOrEqual}.
     * @function
     * @param {!Long|number|bigint|string} other Other value
     * @returns {boolean}
     */
    LongPrototype.ge = LongPrototype.greaterThanOrEqual;

    /**
     * Compares this Long's value with the specified's.
     * @this {!Long}
     * @param {!Long|number|bigint|string} other Other value
     * @returns {number} 0 if they are the same, 1 if the this is greater and -1
     *  if the given one is greater
     */
    LongPrototype.compare = function compare(other) {
      if (!isLong(other)) other = fromValue(other);
      if (this.eq(other)) return 0;
      var thisNeg = this.isNegative(),
        otherNeg = other.isNegative();
      if (thisNeg && !otherNeg) return -1;
      if (!thisNeg && otherNeg) return 1;
      // At this point the sign bits are the same
      if (!this.unsigned) return this.sub(other).isNegative() ? -1 : 1;
      // Both are positive if at least one is unsigned
      return other.high >>> 0 > this.high >>> 0 ||
        (other.high === this.high && other.low >>> 0 > this.low >>> 0)
        ? -1
        : 1;
    };

    /**
     * Compares this Long's value with the specified's. This is an alias of {@link Long#compare}.
     * @function
     * @param {!Long|number|bigint|string} other Other value
     * @returns {number} 0 if they are the same, 1 if the this is greater and -1
     *  if the given one is greater
     */
    LongPrototype.comp = LongPrototype.compare;

    /**
     * Negates this Long's value.
     * @this {!Long}
     * @returns {!Long} Negated Long
     */
    LongPrototype.negate = function negate() {
      if (!this.unsigned && this.eq(MIN_VALUE)) return MIN_VALUE;
      return this.not().add(ONE);
    };

    /**
     * Negates this Long's value. This is an alias of {@link Long#negate}.
     * @function
     * @returns {!Long} Negated Long
     */
    LongPrototype.neg = LongPrototype.negate;

    /**
     * Returns the sum of this and the specified Long.
     * @this {!Long}
     * @param {!Long|number|bigint|string} addend Addend
     * @returns {!Long} Sum
     */
    LongPrototype.add = function add(addend) {
      if (!isLong(addend)) addend = fromValue(addend);

      // Divide each number into 4 chunks of 16 bits, and then sum the chunks.

      var a48 = this.high >>> 16;
      var a32 = this.high & 0xffff;
      var a16 = this.low >>> 16;
      var a00 = this.low & 0xffff;
      var b48 = addend.high >>> 16;
      var b32 = addend.high & 0xffff;
      var b16 = addend.low >>> 16;
      var b00 = addend.low & 0xffff;
      var c48 = 0,
        c32 = 0,
        c16 = 0,
        c00 = 0;
      c00 += a00 + b00;
      c16 += c00 >>> 16;
      c00 &= 0xffff;
      c16 += a16 + b16;
      c32 += c16 >>> 16;
      c16 &= 0xffff;
      c32 += a32 + b32;
      c48 += c32 >>> 16;
      c32 &= 0xffff;
      c48 += a48 + b48;
      c48 &= 0xffff;
      return fromBits((c16 << 16) | c00, (c48 << 16) | c32, this.unsigned);
    };

    /**
     * Returns the difference of this and the specified Long.
     * @this {!Long}
     * @param {!Long|number|bigint|string} subtrahend Subtrahend
     * @returns {!Long} Difference
     */
    LongPrototype.subtract = function subtract(subtrahend) {
      if (!isLong(subtrahend)) subtrahend = fromValue(subtrahend);
      return this.add(subtrahend.neg());
    };

    /**
     * Returns the difference of this and the specified Long. This is an alias of {@link Long#subtract}.
     * @function
     * @param {!Long|number|bigint|string} subtrahend Subtrahend
     * @returns {!Long} Difference
     */
    LongPrototype.sub = LongPrototype.subtract;

    /**
     * Returns the product of this and the specified Long.
     * @this {!Long}
     * @param {!Long|number|bigint|string} multiplier Multiplier
     * @returns {!Long} Product
     */
    LongPrototype.multiply = function multiply(multiplier) {
      if (this.isZero()) return this;
      if (!isLong(multiplier)) multiplier = fromValue(multiplier);

      // use wasm support if present
      if (wasm) {
        var low = wasm["mul"](
          this.low,
          this.high,
          multiplier.low,
          multiplier.high,
        );
        return fromBits(low, wasm["get_high"](), this.unsigned);
      }
      if (multiplier.isZero()) return this.unsigned ? UZERO : ZERO;
      if (this.eq(MIN_VALUE)) return multiplier.isOdd() ? MIN_VALUE : ZERO;
      if (multiplier.eq(MIN_VALUE)) return this.isOdd() ? MIN_VALUE : ZERO;
      if (this.isNegative()) {
        if (multiplier.isNegative()) return this.neg().mul(multiplier.neg());
        else return this.neg().mul(multiplier).neg();
      } else if (multiplier.isNegative())
        return this.mul(multiplier.neg()).neg();

      // If both longs are small, use float multiplication
      if (this.lt(TWO_PWR_24) && multiplier.lt(TWO_PWR_24))
        return fromNumber(
          this.toNumber() * multiplier.toNumber(),
          this.unsigned,
        );

      // Divide each long into 4 chunks of 16 bits, and then add up 4x4 products.
      // We can skip products that would overflow.

      var a48 = this.high >>> 16;
      var a32 = this.high & 0xffff;
      var a16 = this.low >>> 16;
      var a00 = this.low & 0xffff;
      var b48 = multiplier.high >>> 16;
      var b32 = multiplier.high & 0xffff;
      var b16 = multiplier.low >>> 16;
      var b00 = multiplier.low & 0xffff;
      var c48 = 0,
        c32 = 0,
        c16 = 0,
        c00 = 0;
      c00 += a00 * b00;
      c16 += c00 >>> 16;
      c00 &= 0xffff;
      c16 += a16 * b00;
      c32 += c16 >>> 16;
      c16 &= 0xffff;
      c16 += a00 * b16;
      c32 += c16 >>> 16;
      c16 &= 0xffff;
      c32 += a32 * b00;
      c48 += c32 >>> 16;
      c32 &= 0xffff;
      c32 += a16 * b16;
      c48 += c32 >>> 16;
      c32 &= 0xffff;
      c32 += a00 * b32;
      c48 += c32 >>> 16;
      c32 &= 0xffff;
      c48 += a48 * b00 + a32 * b16 + a16 * b32 + a00 * b48;
      c48 &= 0xffff;
      return fromBits((c16 << 16) | c00, (c48 << 16) | c32, this.unsigned);
    };

    /**
     * Returns the product of this and the specified Long. This is an alias of {@link Long#multiply}.
     * @function
     * @param {!Long|number|bigint|string} multiplier Multiplier
     * @returns {!Long} Product
     */
    LongPrototype.mul = LongPrototype.multiply;

    /**
     * Returns this Long divided by the specified. The result is signed if this Long is signed or
     *  unsigned if this Long is unsigned.
     * @this {!Long}
     * @param {!Long|number|bigint|string} divisor Divisor
     * @returns {!Long} Quotient
     */
    LongPrototype.divide = function divide(divisor) {
      if (!isLong(divisor)) divisor = fromValue(divisor);
      if (divisor.isZero()) throw Error("division by zero");

      // use wasm support if present
      if (wasm) {
        // guard against signed division overflow: the largest
        // negative number / -1 would be 1 larger than the largest
        // positive number, due to two's complement.
        if (
          !this.unsigned &&
          this.high === -0x80000000 &&
          divisor.low === -1 &&
          divisor.high === -1
        ) {
          // be consistent with non-wasm code path
          return this;
        }
        var low = (this.unsigned ? wasm["div_u"] : wasm["div_s"])(
          this.low,
          this.high,
          divisor.low,
          divisor.high,
        );
        return fromBits(low, wasm["get_high"](), this.unsigned);
      }
      if (this.isZero()) return this.unsigned ? UZERO : ZERO;
      var approx, rem, res;
      if (!this.unsigned) {
        // This section is only relevant for signed longs and is derived from the
        // closure library as a whole.
        if (this.eq(MIN_VALUE)) {
          if (divisor.eq(ONE) || divisor.eq(NEG_ONE))
            return MIN_VALUE; // recall that -MIN_VALUE == MIN_VALUE
          else if (divisor.eq(MIN_VALUE)) return ONE;
          else {
            // At this point, we have |other| >= 2, so |this/other| < |MIN_VALUE|.
            var halfThis = this.shr(1);
            approx = halfThis.div(divisor).shl(1);
            if (approx.eq(ZERO)) {
              return divisor.isNegative() ? ONE : NEG_ONE;
            } else {
              rem = this.sub(divisor.mul(approx));
              res = approx.add(rem.div(divisor));
              return res;
            }
          }
        } else if (divisor.eq(MIN_VALUE)) return this.unsigned ? UZERO : ZERO;
        if (this.isNegative()) {
          if (divisor.isNegative()) return this.neg().div(divisor.neg());
          return this.neg().div(divisor).neg();
        } else if (divisor.isNegative()) return this.div(divisor.neg()).neg();
        res = ZERO;
      } else {
        // The algorithm below has not been made for unsigned longs. It's therefore
        // required to take special care of the MSB prior to running it.
        if (!divisor.unsigned) divisor = divisor.toUnsigned();
        if (divisor.gt(this)) return UZERO;
        if (divisor.gt(this.shru(1)))
          // 15 >>> 1 = 7 ; with divisor = 8 ; true
          return UONE;
        res = UZERO;
      }

      // Repeat the following until the remainder is less than other:  find a
      // floating-point that approximates remainder / other *from below*, add this
      // into the result, and subtract it from the remainder.  It is critical that
      // the approximate value is less than or equal to the real value so that the
      // remainder never becomes negative.
      rem = this;
      while (rem.gte(divisor)) {
        // Approximate the result of division. This may be a little greater or
        // smaller than the actual value.
        approx = Math.max(1, Math.floor(rem.toNumber() / divisor.toNumber()));

        // We will tweak the approximate result by changing it in the 48-th digit or
        // the smallest non-fractional digit, whichever is larger.
        var log2 = Math.ceil(Math.log(approx) / Math.LN2),
          delta = log2 <= 48 ? 1 : pow_dbl(2, log2 - 48),
          // Decrease the approximation until it is smaller than the remainder.  Note
          // that if it is too large, the product overflows and is negative.
          approxRes = fromNumber(approx),
          approxRem = approxRes.mul(divisor);
        while (approxRem.isNegative() || approxRem.gt(rem)) {
          approx -= delta;
          approxRes = fromNumber(approx, this.unsigned);
          approxRem = approxRes.mul(divisor);
        }

        // We know the answer can't be zero... and actually, zero would cause
        // infinite recursion since we would make no progress.
        if (approxRes.isZero()) approxRes = ONE;
        res = res.add(approxRes);
        rem = rem.sub(approxRem);
      }
      return res;
    };

    /**
     * Returns this Long divided by the specified. This is an alias of {@link Long#divide}.
     * @function
     * @param {!Long|number|bigint|string} divisor Divisor
     * @returns {!Long} Quotient
     */
    LongPrototype.div = LongPrototype.divide;

    /**
     * Returns this Long modulo the specified.
     * @this {!Long}
     * @param {!Long|number|bigint|string} divisor Divisor
     * @returns {!Long} Remainder
     */
    LongPrototype.modulo = function modulo(divisor) {
      if (!isLong(divisor)) divisor = fromValue(divisor);

      // use wasm support if present
      if (wasm) {
        var low = (this.unsigned ? wasm["rem_u"] : wasm["rem_s"])(
          this.low,
          this.high,
          divisor.low,
          divisor.high,
        );
        return fromBits(low, wasm["get_high"](), this.unsigned);
      }
      return this.sub(this.div(divisor).mul(divisor));
    };

    /**
     * Returns this Long modulo the specified. This is an alias of {@link Long#modulo}.
     * @function
     * @param {!Long|number|bigint|string} divisor Divisor
     * @returns {!Long} Remainder
     */
    LongPrototype.mod = LongPrototype.modulo;

    /**
     * Returns this Long modulo the specified. This is an alias of {@link Long#modulo}.
     * @function
     * @param {!Long|number|bigint|string} divisor Divisor
     * @returns {!Long} Remainder
     */
    LongPrototype.rem = LongPrototype.modulo;

    /**
     * Returns the bitwise NOT of this Long.
     * @this {!Long}
     * @returns {!Long}
     */
    LongPrototype.not = function not() {
      return fromBits(~this.low, ~this.high, this.unsigned);
    };

    /**
     * Returns count leading zeros of this Long.
     * @this {!Long}
     * @returns {!number}
     */
    LongPrototype.countLeadingZeros = function countLeadingZeros() {
      return this.high ? Math.clz32(this.high) : Math.clz32(this.low) + 32;
    };

    /**
     * Returns count leading zeros. This is an alias of {@link Long#countLeadingZeros}.
     * @function
     * @param {!Long}
     * @returns {!number}
     */
    LongPrototype.clz = LongPrototype.countLeadingZeros;

    /**
     * Returns count trailing zeros of this Long.
     * @this {!Long}
     * @returns {!number}
     */
    LongPrototype.countTrailingZeros = function countTrailingZeros() {
      return this.low ? ctz32(this.low) : ctz32(this.high) + 32;
    };

    /**
     * Returns count trailing zeros. This is an alias of {@link Long#countTrailingZeros}.
     * @function
     * @param {!Long}
     * @returns {!number}
     */
    LongPrototype.ctz = LongPrototype.countTrailingZeros;

    /**
     * Returns the bitwise AND of this Long and the specified.
     * @this {!Long}
     * @param {!Long|number|bigint|string} other Other Long
     * @returns {!Long}
     */
    LongPrototype.and = function and(other) {
      if (!isLong(other)) other = fromValue(other);
      return fromBits(
        this.low & other.low,
        this.high & other.high,
        this.unsigned,
      );
    };

    /**
     * Returns the bitwise OR of this Long and the specified.
     * @this {!Long}
     * @param {!Long|number|bigint|string} other Other Long
     * @returns {!Long}
     */
    LongPrototype.or = function or(other) {
      if (!isLong(other)) other = fromValue(other);
      return fromBits(
        this.low | other.low,
        this.high | other.high,
        this.unsigned,
      );
    };

    /**
     * Returns the bitwise XOR of this Long and the given one.
     * @this {!Long}
     * @param {!Long|number|bigint|string} other Other Long
     * @returns {!Long}
     */
    LongPrototype.xor = function xor(other) {
      if (!isLong(other)) other = fromValue(other);
      return fromBits(
        this.low ^ other.low,
        this.high ^ other.high,
        this.unsigned,
      );
    };

    /**
     * Returns this Long with bits shifted to the left by the given amount.
     * @this {!Long}
     * @param {number|!Long} numBits Number of bits
     * @returns {!Long} Shifted Long
     */
    LongPrototype.shiftLeft = function shiftLeft(numBits) {
      if (isLong(numBits)) numBits = numBits.toInt();
      if ((numBits &= 63) === 0) return this;
      else if (numBits < 32)
        return fromBits(
          this.low << numBits,
          (this.high << numBits) | (this.low >>> (32 - numBits)),
          this.unsigned,
        );
      else return fromBits(0, this.low << (numBits - 32), this.unsigned);
    };

    /**
     * Returns this Long with bits shifted to the left by the given amount. This is an alias of {@link Long#shiftLeft}.
     * @function
     * @param {number|!Long} numBits Number of bits
     * @returns {!Long} Shifted Long
     */
    LongPrototype.shl = LongPrototype.shiftLeft;

    /**
     * Returns this Long with bits arithmetically shifted to the right by the given amount.
     * @this {!Long}
     * @param {number|!Long} numBits Number of bits
     * @returns {!Long} Shifted Long
     */
    LongPrototype.shiftRight = function shiftRight(numBits) {
      if (isLong(numBits)) numBits = numBits.toInt();
      if ((numBits &= 63) === 0) return this;
      else if (numBits < 32)
        return fromBits(
          (this.low >>> numBits) | (this.high << (32 - numBits)),
          this.high >> numBits,
          this.unsigned,
        );
      else
        return fromBits(
          this.high >> (numBits - 32),
          this.high >= 0 ? 0 : -1,
          this.unsigned,
        );
    };

    /**
     * Returns this Long with bits arithmetically shifted to the right by the given amount. This is an alias of {@link Long#shiftRight}.
     * @function
     * @param {number|!Long} numBits Number of bits
     * @returns {!Long} Shifted Long
     */
    LongPrototype.shr = LongPrototype.shiftRight;

    /**
     * Returns this Long with bits logically shifted to the right by the given amount.
     * @this {!Long}
     * @param {number|!Long} numBits Number of bits
     * @returns {!Long} Shifted Long
     */
    LongPrototype.shiftRightUnsigned = function shiftRightUnsigned(numBits) {
      if (isLong(numBits)) numBits = numBits.toInt();
      if ((numBits &= 63) === 0) return this;
      if (numBits < 32)
        return fromBits(
          (this.low >>> numBits) | (this.high << (32 - numBits)),
          this.high >>> numBits,
          this.unsigned,
        );
      if (numBits === 32) return fromBits(this.high, 0, this.unsigned);
      return fromBits(this.high >>> (numBits - 32), 0, this.unsigned);
    };

    /**
     * Returns this Long with bits logically shifted to the right by the given amount. This is an alias of {@link Long#shiftRightUnsigned}.
     * @function
     * @param {number|!Long} numBits Number of bits
     * @returns {!Long} Shifted Long
     */
    LongPrototype.shru = LongPrototype.shiftRightUnsigned;

    /**
     * Returns this Long with bits logically shifted to the right by the given amount. This is an alias of {@link Long#shiftRightUnsigned}.
     * @function
     * @param {number|!Long} numBits Number of bits
     * @returns {!Long} Shifted Long
     */
    LongPrototype.shr_u = LongPrototype.shiftRightUnsigned;

    /**
     * Returns this Long with bits rotated to the left by the given amount.
     * @this {!Long}
     * @param {number|!Long} numBits Number of bits
     * @returns {!Long} Rotated Long
     */
    LongPrototype.rotateLeft = function rotateLeft(numBits) {
      var b;
      if (isLong(numBits)) numBits = numBits.toInt();
      if ((numBits &= 63) === 0) return this;
      if (numBits === 32) return fromBits(this.high, this.low, this.unsigned);
      if (numBits < 32) {
        b = 32 - numBits;
        return fromBits(
          (this.low << numBits) | (this.high >>> b),
          (this.high << numBits) | (this.low >>> b),
          this.unsigned,
        );
      }
      numBits -= 32;
      b = 32 - numBits;
      return fromBits(
        (this.high << numBits) | (this.low >>> b),
        (this.low << numBits) | (this.high >>> b),
        this.unsigned,
      );
    };
    /**
     * Returns this Long with bits rotated to the left by the given amount. This is an alias of {@link Long#rotateLeft}.
     * @function
     * @param {number|!Long} numBits Number of bits
     * @returns {!Long} Rotated Long
     */
    LongPrototype.rotl = LongPrototype.rotateLeft;

    /**
     * Returns this Long with bits rotated to the right by the given amount.
     * @this {!Long}
     * @param {number|!Long} numBits Number of bits
     * @returns {!Long} Rotated Long
     */
    LongPrototype.rotateRight = function rotateRight(numBits) {
      var b;
      if (isLong(numBits)) numBits = numBits.toInt();
      if ((numBits &= 63) === 0) return this;
      if (numBits === 32) return fromBits(this.high, this.low, this.unsigned);
      if (numBits < 32) {
        b = 32 - numBits;
        return fromBits(
          (this.high << b) | (this.low >>> numBits),
          (this.low << b) | (this.high >>> numBits),
          this.unsigned,
        );
      }
      numBits -= 32;
      b = 32 - numBits;
      return fromBits(
        (this.low << b) | (this.high >>> numBits),
        (this.high << b) | (this.low >>> numBits),
        this.unsigned,
      );
    };
    /**
     * Returns this Long with bits rotated to the right by the given amount. This is an alias of {@link Long#rotateRight}.
     * @function
     * @param {number|!Long} numBits Number of bits
     * @returns {!Long} Rotated Long
     */
    LongPrototype.rotr = LongPrototype.rotateRight;

    /**
     * Converts this Long to signed.
     * @this {!Long}
     * @returns {!Long} Signed long
     */
    LongPrototype.toSigned = function toSigned() {
      if (!this.unsigned) return this;
      return fromBits(this.low, this.high, false);
    };

    /**
     * Converts this Long to unsigned.
     * @this {!Long}
     * @returns {!Long} Unsigned long
     */
    LongPrototype.toUnsigned = function toUnsigned() {
      if (this.unsigned) return this;
      return fromBits(this.low, this.high, true);
    };

    /**
     * Converts this Long to its byte representation.
     * @param {boolean=} le Whether little or big endian, defaults to big endian
     * @this {!Long}
     * @returns {!Array.<number>} Byte representation
     */
    LongPrototype.toBytes = function toBytes(le) {
      return le ? this.toBytesLE() : this.toBytesBE();
    };

    /**
     * Converts this Long to its little endian byte representation.
     * @this {!Long}
     * @returns {!Array.<number>} Little endian byte representation
     */
    LongPrototype.toBytesLE = function toBytesLE() {
      var hi = this.high,
        lo = this.low;
      return [
        lo & 0xff,
        (lo >>> 8) & 0xff,
        (lo >>> 16) & 0xff,
        lo >>> 24,
        hi & 0xff,
        (hi >>> 8) & 0xff,
        (hi >>> 16) & 0xff,
        hi >>> 24,
      ];
    };

    /**
     * Converts this Long to its big endian byte representation.
     * @this {!Long}
     * @returns {!Array.<number>} Big endian byte representation
     */
    LongPrototype.toBytesBE = function toBytesBE() {
      var hi = this.high,
        lo = this.low;
      return [
        hi >>> 24,
        (hi >>> 16) & 0xff,
        (hi >>> 8) & 0xff,
        hi & 0xff,
        lo >>> 24,
        (lo >>> 16) & 0xff,
        (lo >>> 8) & 0xff,
        lo & 0xff,
      ];
    };

    /**
     * Creates a Long from its byte representation.
     * @param {!Array.<number>} bytes Byte representation
     * @param {boolean=} unsigned Whether unsigned or not, defaults to signed
     * @param {boolean=} le Whether little or big endian, defaults to big endian
     * @returns {Long} The corresponding Long value
     */
    Long.fromBytes = function fromBytes(bytes, unsigned, le) {
      return le
        ? Long.fromBytesLE(bytes, unsigned)
        : Long.fromBytesBE(bytes, unsigned);
    };

    /**
     * Creates a Long from its little endian byte representation.
     * @param {!Array.<number>} bytes Little endian byte representation
     * @param {boolean=} unsigned Whether unsigned or not, defaults to signed
     * @returns {Long} The corresponding Long value
     */
    Long.fromBytesLE = function fromBytesLE(bytes, unsigned) {
      return new Long(
        bytes[0] | (bytes[1] << 8) | (bytes[2] << 16) | (bytes[3] << 24),
        bytes[4] | (bytes[5] << 8) | (bytes[6] << 16) | (bytes[7] << 24),
        unsigned,
      );
    };

    /**
     * Creates a Long from its big endian byte representation.
     * @param {!Array.<number>} bytes Big endian byte representation
     * @param {boolean=} unsigned Whether unsigned or not, defaults to signed
     * @returns {Long} The corresponding Long value
     */
    Long.fromBytesBE = function fromBytesBE(bytes, unsigned) {
      return new Long(
        (bytes[4] << 24) | (bytes[5] << 16) | (bytes[6] << 8) | bytes[7],
        (bytes[0] << 24) | (bytes[1] << 16) | (bytes[2] << 8) | bytes[3],
        unsigned,
      );
    };

    // Support conversion to/from BigInt where available
    if (typeof BigInt === "function") {
      /**
       * Returns a Long representing the given big integer.
       * @function
       * @param {number} value The big integer value
       * @param {boolean=} unsigned Whether unsigned or not, defaults to signed
       * @returns {!Long} The corresponding Long value
       */
      Long.fromBigInt = function fromBigInt(value, unsigned) {
        var lowBits = Number(BigInt.asIntN(32, value));
        var highBits = Number(BigInt.asIntN(32, value >> BigInt(32)));
        return fromBits(lowBits, highBits, unsigned);
      };

      // Override
      Long.fromValue = function fromValueWithBigInt(value, unsigned) {
        if (typeof value === "bigint") return Long.fromBigInt(value, unsigned);
        return fromValue(value, unsigned);
      };

      /**
       * Converts the Long to its big integer representation.
       * @this {!Long}
       * @returns {bigint}
       */
      LongPrototype.toBigInt = function toBigInt() {
        var lowBigInt = BigInt(this.low >>> 0);
        var highBigInt = BigInt(this.unsigned ? this.high >>> 0 : this.high);
        return (highBigInt << BigInt(32)) | lowBigInt;
      };
    }
    var _default = (_exports.default = Long);
  },
);


/***/ }),

/***/ 35345:
/***/ ((module) => {

"use strict";


/** @type {import('./uri')} */
module.exports = URIError;


/***/ }),

/***/ 37688:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const Events = __webpack_require__(24434);
const { doError } = __webpack_require__(30216);
const { escape } = __webpack_require__(70742);
const EventConnection = __webpack_require__(80585);
const FbEventManager = __webpack_require__(38866);

/***************************************
 *
 *   Database
 *
 ***************************************/

function Database(connection) {
    this.connection = connection;
    connection.db = this;
    this.eventid = 1;
}

Database.prototype.__proto__ = Object.create(Events.EventEmitter.prototype, {
    constructor: {
        value: Database,
        enumberable: false
    }
});

Database.prototype.escape = function(value) {
    return escape(value, this.connection.accept.protocolVersion);
};

Database.prototype.detach = function(callback, force) {

    var self = this;

    if (!force && self.connection._pending.length > 0) {
        self.connection._detachAuto = true;
        self.connection._detachCallback = callback;
        return self;
    }

    if (self.connection._pooled === false) {
        self.connection.detach(function (err, obj) {

            self.connection.disconnect();
            self.emit('detach', false);

            if (callback)
                callback(err, obj);

        }, force);
    } else {
        self.emit('detach', false);
        if (callback)
            callback();
    }

    return self;
};

Database.prototype.transaction = function(isolation, callback) {
    return this.startTransaction(isolation, callback);
};

Database.prototype.startTransaction = function(isolation, callback) {
    this.connection.startTransaction(isolation, callback);
    return this;
};

Database.prototype.newStatement = function (query, callback) {

    this.startTransaction(function(err, transaction) {

        if (err) {
            callback(err);
            return;
        }

        transaction.newStatement(query, function(err, statement) {

            if (err) {
                callback(err);
                return;
            }

            transaction.commit(function(err) {
                callback(err, statement);
            });
        });
    });

    return this;
};

Database.prototype.execute = function(query, params, callback, custom) {

    if (params instanceof Function) {
        custom = callback;
        callback = params;
        params = undefined;
    }

    var self = this;

    self.connection.startTransaction(function(err, transaction) {

        if (err) {
            doError(err, callback);
            return;
        }

        transaction.execute(query, params, function(err, result, meta, isSelect) {

            if (err) {
                transaction.rollback(function() {
                    doError(err, callback);
                });
                return;
            }

            transaction.commit(function(err) {
                if (callback)
                    callback(err, result, meta, isSelect);
            });

        }, custom);
    });

    return self;
};

Database.prototype.sequentially = function(query, params, on, callback, asArray) {

    if (params instanceof Function) {
        asArray = callback;
        callback = on;
        on = params;
        params = undefined;
    }

    if (on === undefined){
        throw new Error('Expected "on" delegate.');
    }

    if (callback instanceof Boolean) {
        asArray = callback;
        callback = undefined;
    }

    var self = this;
    self.execute(query, params, callback, { asObject: !asArray, asStream: true, on: on });
    return self;
};

Database.prototype.query = function(query, params, callback) {

    if (params instanceof Function) {
        callback = params;
        params = undefined;
    }

    var self = this;
    self.execute(query, params, callback, { asObject: true, asStream: callback === undefined || callback === null });
    return self;
};

Database.prototype.drop = function(callback) {
    return this.connection.dropDatabase(callback);
};

Database.prototype.attachEvent = function (callback) {
    var self = this;
    this.connection.auxConnection(function (err, socket_info) {

        if (err) {
            doError(err, callback);
            return;
        }

        const eventConnection = new EventConnection(self.connection.host, socket_info.port, function (err) {
            if (err) {
                doError(err, callback);
                return;
            }

            const evt = new FbEventManager(self, eventConnection, self.eventid++, function (err) {
                if (err) {
                    doError(err, callback);
                    return;
                }

                callback(err, evt);
            });
        }, self);
    });

    return this;
}

module.exports = Database;


/***/ }),

/***/ 38866:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const Events = __webpack_require__(24434);
const { doError } = __webpack_require__(30216);


function FbEventManager(db, eventconnection, eventid, callback) {
    this.db = db;
    this.eventconnection = eventconnection;
    this.events = {};
    this.eventid = eventid;
    this._createEventLoop(callback);
}

FbEventManager.prototype.__proto__ = Object.create(Events.EventEmitter.prototype, {
    constructor: {
        value: FbEventManager,
        enumberable: false
    }
});

FbEventManager.prototype._createEventLoop = function (callback) {
    var self = this;
    var cnx = this.db.connection;
    this.eventconnection.emgr = this;
    // create the loop
    function loop(first) {
        cnx.queEvents(self.events, self.eventid, function (err, ret) {
            if (err) {
                doError(err, callback);
                return;
            }
            if (first)
                callback();
        })
    }

    this.eventconnection.eventcallback = function (err, ret) {
        if (err || (self.eventid !== ret.eventid)) {
            doError(err || new Error('Bad eventid'), callback);
            return;
        }

        ret.events.forEach(function (event) {
            self.emit('post_event', event.name, event.count)
        })

        loop(false);
    }

    loop(true);
}

FbEventManager.prototype._changeEvent = function (callback) {
    var self = this;

    self.db.connection.closeEvents(this.eventid, function (err) {
        if (err) {
            doError(err, callback);
            return;
        }
        
        self.db.connection.queEvents(self.events, self.eventid, callback);
    })
}

FbEventManager.prototype.registerEvent = function (events, callback) {
    var self = this;

    if (self.db.connection._isClosed || self.eventconnection._isClosed)
        return self.eventconnection.throwClosed(callback);

    events.forEach((event) => self.events[event] = self.events[event] || 0);
    self._changeEvent(callback);
}

FbEventManager.prototype.unregisterEvent = function (events, callback) {
    var self = this;

    if (self.db.connection._isClosed || self.eventconnection._isClosed)
        return self.eventconnection.throwClosed(callback);

    events.forEach(function (event) { delete self.events[event] });
    self._changeEvent(callback);
}

FbEventManager.prototype.close = function (callback) {
    var self = this;

    self.db.connection.closeEvents(this.eventid, function (err) {
        if (err) {
            doError(err, callback);
            return;
        }

        self.eventconnection._socket.end();
    });
}

module.exports = FbEventManager;

/***/ }),

/***/ 39023:
/***/ ((module) => {

"use strict";
module.exports = require("util");

/***/ }),

/***/ 40736:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


/**
 * This is the common logic for both the Node.js and web browser
 * implementations of `debug()`.
 */

function setup(env) {
	createDebug.debug = createDebug;
	createDebug.default = createDebug;
	createDebug.coerce = coerce;
	createDebug.disable = disable;
	createDebug.enable = enable;
	createDebug.enabled = enabled;
	createDebug.humanize = __webpack_require__(6585);
	createDebug.destroy = destroy;

	Object.keys(env).forEach(key => {
		createDebug[key] = env[key];
	});

	/**
	* The currently active debug mode names, and names to skip.
	*/

	createDebug.names = [];
	createDebug.skips = [];

	/**
	* Map of special "%n" handling functions, for the debug "format" argument.
	*
	* Valid key names are a single, lower or upper-case letter, i.e. "n" and "N".
	*/
	createDebug.formatters = {};

	/**
	* Selects a color for a debug namespace
	* @param {String} namespace The namespace string for the debug instance to be colored
	* @return {Number|String} An ANSI color code for the given namespace
	* @api private
	*/
	function selectColor(namespace) {
		let hash = 0;

		for (let i = 0; i < namespace.length; i++) {
			hash = ((hash << 5) - hash) + namespace.charCodeAt(i);
			hash |= 0; // Convert to 32bit integer
		}

		return createDebug.colors[Math.abs(hash) % createDebug.colors.length];
	}
	createDebug.selectColor = selectColor;

	/**
	* Create a debugger with the given `namespace`.
	*
	* @param {String} namespace
	* @return {Function}
	* @api public
	*/
	function createDebug(namespace) {
		let prevTime;
		let enableOverride = null;
		let namespacesCache;
		let enabledCache;

		function debug(...args) {
			// Disabled?
			if (!debug.enabled) {
				return;
			}

			const self = debug;

			// Set `diff` timestamp
			const curr = Number(new Date());
			const ms = curr - (prevTime || curr);
			self.diff = ms;
			self.prev = prevTime;
			self.curr = curr;
			prevTime = curr;

			args[0] = createDebug.coerce(args[0]);

			if (typeof args[0] !== 'string') {
				// Anything else let's inspect with %O
				args.unshift('%O');
			}

			// Apply any `formatters` transformations
			let index = 0;
			args[0] = args[0].replace(/%([a-zA-Z%])/g, (match, format) => {
				// If we encounter an escaped % then don't increase the array index
				if (match === '%%') {
					return '%';
				}
				index++;
				const formatter = createDebug.formatters[format];
				if (typeof formatter === 'function') {
					const val = args[index];
					match = formatter.call(self, val);

					// Now we need to remove `args[index]` since it's inlined in the `format`
					args.splice(index, 1);
					index--;
				}
				return match;
			});

			// Apply env-specific formatting (colors, etc.)
			createDebug.formatArgs.call(self, args);

			const logFn = self.log || createDebug.log;
			logFn.apply(self, args);
		}

		debug.namespace = namespace;
		debug.useColors = createDebug.useColors();
		debug.color = createDebug.selectColor(namespace);
		debug.extend = extend;
		debug.destroy = createDebug.destroy; // XXX Temporary. Will be removed in the next major release.

		Object.defineProperty(debug, 'enabled', {
			enumerable: true,
			configurable: false,
			get: () => {
				if (enableOverride !== null) {
					return enableOverride;
				}
				if (namespacesCache !== createDebug.namespaces) {
					namespacesCache = createDebug.namespaces;
					enabledCache = createDebug.enabled(namespace);
				}

				return enabledCache;
			},
			set: v => {
				enableOverride = v;
			}
		});

		// Env-specific initialization logic for debug instances
		if (typeof createDebug.init === 'function') {
			createDebug.init(debug);
		}

		return debug;
	}

	function extend(namespace, delimiter) {
		const newDebug = createDebug(this.namespace + (typeof delimiter === 'undefined' ? ':' : delimiter) + namespace);
		newDebug.log = this.log;
		return newDebug;
	}

	/**
	* Enables a debug mode by namespaces. This can include modes
	* separated by a colon and wildcards.
	*
	* @param {String} namespaces
	* @api public
	*/
	function enable(namespaces) {
		createDebug.save(namespaces);
		createDebug.namespaces = namespaces;

		createDebug.names = [];
		createDebug.skips = [];

		const split = (typeof namespaces === 'string' ? namespaces : '')
			.trim()
			.replace(/\s+/g, ',')
			.split(',')
			.filter(Boolean);

		for (const ns of split) {
			if (ns[0] === '-') {
				createDebug.skips.push(ns.slice(1));
			} else {
				createDebug.names.push(ns);
			}
		}
	}

	/**
	 * Checks if the given string matches a namespace template, honoring
	 * asterisks as wildcards.
	 *
	 * @param {String} search
	 * @param {String} template
	 * @return {Boolean}
	 */
	function matchesTemplate(search, template) {
		let searchIndex = 0;
		let templateIndex = 0;
		let starIndex = -1;
		let matchIndex = 0;

		while (searchIndex < search.length) {
			if (templateIndex < template.length && (template[templateIndex] === search[searchIndex] || template[templateIndex] === '*')) {
				// Match character or proceed with wildcard
				if (template[templateIndex] === '*') {
					starIndex = templateIndex;
					matchIndex = searchIndex;
					templateIndex++; // Skip the '*'
				} else {
					searchIndex++;
					templateIndex++;
				}
			} else if (starIndex !== -1) { // eslint-disable-line no-negated-condition
				// Backtrack to the last '*' and try to match more characters
				templateIndex = starIndex + 1;
				matchIndex++;
				searchIndex = matchIndex;
			} else {
				return false; // No match
			}
		}

		// Handle trailing '*' in template
		while (templateIndex < template.length && template[templateIndex] === '*') {
			templateIndex++;
		}

		return templateIndex === template.length;
	}

	/**
	* Disable debug output.
	*
	* @return {String} namespaces
	* @api public
	*/
	function disable() {
		const namespaces = [
			...createDebug.names,
			...createDebug.skips.map(namespace => '-' + namespace)
		].join(',');
		createDebug.enable('');
		return namespaces;
	}

	/**
	* Returns true if the given mode name is enabled, false otherwise.
	*
	* @param {String} name
	* @return {Boolean}
	* @api public
	*/
	function enabled(name) {
		for (const skip of createDebug.skips) {
			if (matchesTemplate(name, skip)) {
				return false;
			}
		}

		for (const ns of createDebug.names) {
			if (matchesTemplate(name, ns)) {
				return true;
			}
		}

		return false;
	}

	/**
	* Coerce `val`.
	*
	* @param {Mixed} val
	* @return {Mixed}
	* @api private
	*/
	function coerce(val) {
		if (val instanceof Error) {
			return val.stack || val.message;
		}
		return val;
	}

	/**
	* XXX DO NOT USE. This is a temporary stub function.
	* XXX It WILL be removed in the next major release.
	*/
	function destroy() {
		console.warn('Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.');
	}

	createDebug.enable(createDebug.load());

	return createDebug;
}

module.exports = setup;


/***/ }),

/***/ 41237:
/***/ ((module) => {

"use strict";


/** @type {import('./eval')} */
module.exports = EvalError;


/***/ }),

/***/ 41333:
/***/ ((module) => {

"use strict";


/** @type {import('./shams')} */
/* eslint complexity: [2, 18], max-statements: [2, 33] */
module.exports = function hasSymbols() {
	if (typeof Symbol !== 'function' || typeof Object.getOwnPropertySymbols !== 'function') { return false; }
	if (typeof Symbol.iterator === 'symbol') { return true; }

	/** @type {{ [k in symbol]?: unknown }} */
	var obj = {};
	var sym = Symbol('test');
	var symObj = Object(sym);
	if (typeof sym === 'string') { return false; }

	if (Object.prototype.toString.call(sym) !== '[object Symbol]') { return false; }
	if (Object.prototype.toString.call(symObj) !== '[object Symbol]') { return false; }

	// temp disabled per https://github.com/ljharb/object.assign/issues/17
	// if (sym instanceof Symbol) { return false; }
	// temp disabled per https://github.com/WebReflection/get-own-property-symbols/issues/4
	// if (!(symObj instanceof Symbol)) { return false; }

	// if (typeof Symbol.prototype.toString !== 'function') { return false; }
	// if (String(sym) !== Symbol.prototype.toString.call(sym)) { return false; }

	var symVal = 42;
	obj[sym] = symVal;
	for (var _ in obj) { return false; } // eslint-disable-line no-restricted-syntax, no-unreachable-loop
	if (typeof Object.keys === 'function' && Object.keys(obj).length !== 0) { return false; }

	if (typeof Object.getOwnPropertyNames === 'function' && Object.getOwnPropertyNames(obj).length !== 0) { return false; }

	var syms = Object.getOwnPropertySymbols(obj);
	if (syms.length !== 1 || syms[0] !== sym) { return false; }

	if (!Object.prototype.propertyIsEnumerable.call(obj, sym)) { return false; }

	if (typeof Object.getOwnPropertyDescriptor === 'function') {
		// eslint-disable-next-line no-extra-parens
		var descriptor = /** @type {PropertyDescriptor} */ (Object.getOwnPropertyDescriptor(obj, sym));
		if (descriptor.value !== symVal || descriptor.enumerable !== true) { return false; }
	}

	return true;
};


/***/ }),

/***/ 41362:
/***/ ((module) => {

"use strict";


// populates missing values
module.exports = function (dst, src) {
  Object.keys(src).forEach(function (prop) {
    dst[prop] = dst[prop] || src[prop]; // eslint-disable-line no-param-reassign
  });

  return dst;
};


/***/ }),

/***/ 42613:
/***/ ((module) => {

"use strict";
module.exports = require("assert");

/***/ }),

/***/ 43106:
/***/ ((module) => {

"use strict";
module.exports = require("zlib");

/***/ }),

/***/ 43164:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var url = __webpack_require__(87016);
var URL = url.URL;
var http = __webpack_require__(58611);
var https = __webpack_require__(65692);
var Writable = (__webpack_require__(2203).Writable);
var assert = __webpack_require__(42613);
var debug = __webpack_require__(77507);

// Preventive platform detection
// istanbul ignore next
(function detectUnsupportedEnvironment() {
  var looksLikeNode = typeof process !== "undefined";
  var looksLikeBrowser = typeof window !== "undefined" && typeof document !== "undefined";
  var looksLikeV8 = isFunction(Error.captureStackTrace);
  if (!looksLikeNode && (looksLikeBrowser || !looksLikeV8)) {
    console.warn("The follow-redirects package should be excluded from browser builds.");
  }
}());

// Whether to use the native URL object or the legacy url module
var useNativeURL = false;
try {
  assert(new URL(""));
}
catch (error) {
  useNativeURL = error.code === "ERR_INVALID_URL";
}

// URL fields to preserve in copy operations
var preservedUrlFields = [
  "auth",
  "host",
  "hostname",
  "href",
  "path",
  "pathname",
  "port",
  "protocol",
  "query",
  "search",
  "hash",
];

// Create handlers that pass events from native requests
var events = ["abort", "aborted", "connect", "error", "socket", "timeout"];
var eventHandlers = Object.create(null);
events.forEach(function (event) {
  eventHandlers[event] = function (arg1, arg2, arg3) {
    this._redirectable.emit(event, arg1, arg2, arg3);
  };
});

// Error types with codes
var InvalidUrlError = createErrorType(
  "ERR_INVALID_URL",
  "Invalid URL",
  TypeError
);
var RedirectionError = createErrorType(
  "ERR_FR_REDIRECTION_FAILURE",
  "Redirected request failed"
);
var TooManyRedirectsError = createErrorType(
  "ERR_FR_TOO_MANY_REDIRECTS",
  "Maximum number of redirects exceeded",
  RedirectionError
);
var MaxBodyLengthExceededError = createErrorType(
  "ERR_FR_MAX_BODY_LENGTH_EXCEEDED",
  "Request body larger than maxBodyLength limit"
);
var WriteAfterEndError = createErrorType(
  "ERR_STREAM_WRITE_AFTER_END",
  "write after end"
);

// istanbul ignore next
var destroy = Writable.prototype.destroy || noop;

// An HTTP(S) request that can be redirected
function RedirectableRequest(options, responseCallback) {
  // Initialize the request
  Writable.call(this);
  this._sanitizeOptions(options);
  this._options = options;
  this._ended = false;
  this._ending = false;
  this._redirectCount = 0;
  this._redirects = [];
  this._requestBodyLength = 0;
  this._requestBodyBuffers = [];

  // Attach a callback if passed
  if (responseCallback) {
    this.on("response", responseCallback);
  }

  // React to responses of native requests
  var self = this;
  this._onNativeResponse = function (response) {
    try {
      self._processResponse(response);
    }
    catch (cause) {
      self.emit("error", cause instanceof RedirectionError ?
        cause : new RedirectionError({ cause: cause }));
    }
  };

  // Perform the first request
  this._performRequest();
}
RedirectableRequest.prototype = Object.create(Writable.prototype);

RedirectableRequest.prototype.abort = function () {
  destroyRequest(this._currentRequest);
  this._currentRequest.abort();
  this.emit("abort");
};

RedirectableRequest.prototype.destroy = function (error) {
  destroyRequest(this._currentRequest, error);
  destroy.call(this, error);
  return this;
};

// Writes buffered data to the current native request
RedirectableRequest.prototype.write = function (data, encoding, callback) {
  // Writing is not allowed if end has been called
  if (this._ending) {
    throw new WriteAfterEndError();
  }

  // Validate input and shift parameters if necessary
  if (!isString(data) && !isBuffer(data)) {
    throw new TypeError("data should be a string, Buffer or Uint8Array");
  }
  if (isFunction(encoding)) {
    callback = encoding;
    encoding = null;
  }

  // Ignore empty buffers, since writing them doesn't invoke the callback
  // https://github.com/nodejs/node/issues/22066
  if (data.length === 0) {
    if (callback) {
      callback();
    }
    return;
  }
  // Only write when we don't exceed the maximum body length
  if (this._requestBodyLength + data.length <= this._options.maxBodyLength) {
    this._requestBodyLength += data.length;
    this._requestBodyBuffers.push({ data: data, encoding: encoding });
    this._currentRequest.write(data, encoding, callback);
  }
  // Error when we exceed the maximum body length
  else {
    this.emit("error", new MaxBodyLengthExceededError());
    this.abort();
  }
};

// Ends the current native request
RedirectableRequest.prototype.end = function (data, encoding, callback) {
  // Shift parameters if necessary
  if (isFunction(data)) {
    callback = data;
    data = encoding = null;
  }
  else if (isFunction(encoding)) {
    callback = encoding;
    encoding = null;
  }

  // Write data if needed and end
  if (!data) {
    this._ended = this._ending = true;
    this._currentRequest.end(null, null, callback);
  }
  else {
    var self = this;
    var currentRequest = this._currentRequest;
    this.write(data, encoding, function () {
      self._ended = true;
      currentRequest.end(null, null, callback);
    });
    this._ending = true;
  }
};

// Sets a header value on the current native request
RedirectableRequest.prototype.setHeader = function (name, value) {
  this._options.headers[name] = value;
  this._currentRequest.setHeader(name, value);
};

// Clears a header value on the current native request
RedirectableRequest.prototype.removeHeader = function (name) {
  delete this._options.headers[name];
  this._currentRequest.removeHeader(name);
};

// Global timeout for all underlying requests
RedirectableRequest.prototype.setTimeout = function (msecs, callback) {
  var self = this;

  // Destroys the socket on timeout
  function destroyOnTimeout(socket) {
    socket.setTimeout(msecs);
    socket.removeListener("timeout", socket.destroy);
    socket.addListener("timeout", socket.destroy);
  }

  // Sets up a timer to trigger a timeout event
  function startTimer(socket) {
    if (self._timeout) {
      clearTimeout(self._timeout);
    }
    self._timeout = setTimeout(function () {
      self.emit("timeout");
      clearTimer();
    }, msecs);
    destroyOnTimeout(socket);
  }

  // Stops a timeout from triggering
  function clearTimer() {
    // Clear the timeout
    if (self._timeout) {
      clearTimeout(self._timeout);
      self._timeout = null;
    }

    // Clean up all attached listeners
    self.removeListener("abort", clearTimer);
    self.removeListener("error", clearTimer);
    self.removeListener("response", clearTimer);
    self.removeListener("close", clearTimer);
    if (callback) {
      self.removeListener("timeout", callback);
    }
    if (!self.socket) {
      self._currentRequest.removeListener("socket", startTimer);
    }
  }

  // Attach callback if passed
  if (callback) {
    this.on("timeout", callback);
  }

  // Start the timer if or when the socket is opened
  if (this.socket) {
    startTimer(this.socket);
  }
  else {
    this._currentRequest.once("socket", startTimer);
  }

  // Clean up on events
  this.on("socket", destroyOnTimeout);
  this.on("abort", clearTimer);
  this.on("error", clearTimer);
  this.on("response", clearTimer);
  this.on("close", clearTimer);

  return this;
};

// Proxy all other public ClientRequest methods
[
  "flushHeaders", "getHeader",
  "setNoDelay", "setSocketKeepAlive",
].forEach(function (method) {
  RedirectableRequest.prototype[method] = function (a, b) {
    return this._currentRequest[method](a, b);
  };
});

// Proxy all public ClientRequest properties
["aborted", "connection", "socket"].forEach(function (property) {
  Object.defineProperty(RedirectableRequest.prototype, property, {
    get: function () { return this._currentRequest[property]; },
  });
});

RedirectableRequest.prototype._sanitizeOptions = function (options) {
  // Ensure headers are always present
  if (!options.headers) {
    options.headers = {};
  }

  // Since http.request treats host as an alias of hostname,
  // but the url module interprets host as hostname plus port,
  // eliminate the host property to avoid confusion.
  if (options.host) {
    // Use hostname if set, because it has precedence
    if (!options.hostname) {
      options.hostname = options.host;
    }
    delete options.host;
  }

  // Complete the URL object when necessary
  if (!options.pathname && options.path) {
    var searchPos = options.path.indexOf("?");
    if (searchPos < 0) {
      options.pathname = options.path;
    }
    else {
      options.pathname = options.path.substring(0, searchPos);
      options.search = options.path.substring(searchPos);
    }
  }
};


// Executes the next native request (initial or redirect)
RedirectableRequest.prototype._performRequest = function () {
  // Load the native protocol
  var protocol = this._options.protocol;
  var nativeProtocol = this._options.nativeProtocols[protocol];
  if (!nativeProtocol) {
    throw new TypeError("Unsupported protocol " + protocol);
  }

  // If specified, use the agent corresponding to the protocol
  // (HTTP and HTTPS use different types of agents)
  if (this._options.agents) {
    var scheme = protocol.slice(0, -1);
    this._options.agent = this._options.agents[scheme];
  }

  // Create the native request and set up its event handlers
  var request = this._currentRequest =
        nativeProtocol.request(this._options, this._onNativeResponse);
  request._redirectable = this;
  for (var event of events) {
    request.on(event, eventHandlers[event]);
  }

  // RFC7230§5.3.1: When making a request directly to an origin server, […]
  // a client MUST send only the absolute path […] as the request-target.
  this._currentUrl = /^\//.test(this._options.path) ?
    url.format(this._options) :
    // When making a request to a proxy, […]
    // a client MUST send the target URI in absolute-form […].
    this._options.path;

  // End a redirected request
  // (The first request must be ended explicitly with RedirectableRequest#end)
  if (this._isRedirect) {
    // Write the request entity and end
    var i = 0;
    var self = this;
    var buffers = this._requestBodyBuffers;
    (function writeNext(error) {
      // Only write if this request has not been redirected yet
      // istanbul ignore else
      if (request === self._currentRequest) {
        // Report any write errors
        // istanbul ignore if
        if (error) {
          self.emit("error", error);
        }
        // Write the next buffer if there are still left
        else if (i < buffers.length) {
          var buffer = buffers[i++];
          // istanbul ignore else
          if (!request.finished) {
            request.write(buffer.data, buffer.encoding, writeNext);
          }
        }
        // End the request if `end` has been called on us
        else if (self._ended) {
          request.end();
        }
      }
    }());
  }
};

// Processes a response from the current native request
RedirectableRequest.prototype._processResponse = function (response) {
  // Store the redirected response
  var statusCode = response.statusCode;
  if (this._options.trackRedirects) {
    this._redirects.push({
      url: this._currentUrl,
      headers: response.headers,
      statusCode: statusCode,
    });
  }

  // RFC7231§6.4: The 3xx (Redirection) class of status code indicates
  // that further action needs to be taken by the user agent in order to
  // fulfill the request. If a Location header field is provided,
  // the user agent MAY automatically redirect its request to the URI
  // referenced by the Location field value,
  // even if the specific status code is not understood.

  // If the response is not a redirect; return it as-is
  var location = response.headers.location;
  if (!location || this._options.followRedirects === false ||
      statusCode < 300 || statusCode >= 400) {
    response.responseUrl = this._currentUrl;
    response.redirects = this._redirects;
    this.emit("response", response);

    // Clean up
    this._requestBodyBuffers = [];
    return;
  }

  // The response is a redirect, so abort the current request
  destroyRequest(this._currentRequest);
  // Discard the remainder of the response to avoid waiting for data
  response.destroy();

  // RFC7231§6.4: A client SHOULD detect and intervene
  // in cyclical redirections (i.e., "infinite" redirection loops).
  if (++this._redirectCount > this._options.maxRedirects) {
    throw new TooManyRedirectsError();
  }

  // Store the request headers if applicable
  var requestHeaders;
  var beforeRedirect = this._options.beforeRedirect;
  if (beforeRedirect) {
    requestHeaders = Object.assign({
      // The Host header was set by nativeProtocol.request
      Host: response.req.getHeader("host"),
    }, this._options.headers);
  }

  // RFC7231§6.4: Automatic redirection needs to done with
  // care for methods not known to be safe, […]
  // RFC7231§6.4.2–3: For historical reasons, a user agent MAY change
  // the request method from POST to GET for the subsequent request.
  var method = this._options.method;
  if ((statusCode === 301 || statusCode === 302) && this._options.method === "POST" ||
      // RFC7231§6.4.4: The 303 (See Other) status code indicates that
      // the server is redirecting the user agent to a different resource […]
      // A user agent can perform a retrieval request targeting that URI
      // (a GET or HEAD request if using HTTP) […]
      (statusCode === 303) && !/^(?:GET|HEAD)$/.test(this._options.method)) {
    this._options.method = "GET";
    // Drop a possible entity and headers related to it
    this._requestBodyBuffers = [];
    removeMatchingHeaders(/^content-/i, this._options.headers);
  }

  // Drop the Host header, as the redirect might lead to a different host
  var currentHostHeader = removeMatchingHeaders(/^host$/i, this._options.headers);

  // If the redirect is relative, carry over the host of the last request
  var currentUrlParts = parseUrl(this._currentUrl);
  var currentHost = currentHostHeader || currentUrlParts.host;
  var currentUrl = /^\w+:/.test(location) ? this._currentUrl :
    url.format(Object.assign(currentUrlParts, { host: currentHost }));

  // Create the redirected request
  var redirectUrl = resolveUrl(location, currentUrl);
  debug("redirecting to", redirectUrl.href);
  this._isRedirect = true;
  spreadUrlObject(redirectUrl, this._options);

  // Drop confidential headers when redirecting to a less secure protocol
  // or to a different domain that is not a superdomain
  if (redirectUrl.protocol !== currentUrlParts.protocol &&
     redirectUrl.protocol !== "https:" ||
     redirectUrl.host !== currentHost &&
     !isSubdomain(redirectUrl.host, currentHost)) {
    removeMatchingHeaders(/^(?:(?:proxy-)?authorization|cookie)$/i, this._options.headers);
  }

  // Evaluate the beforeRedirect callback
  if (isFunction(beforeRedirect)) {
    var responseDetails = {
      headers: response.headers,
      statusCode: statusCode,
    };
    var requestDetails = {
      url: currentUrl,
      method: method,
      headers: requestHeaders,
    };
    beforeRedirect(this._options, responseDetails, requestDetails);
    this._sanitizeOptions(this._options);
  }

  // Perform the redirected request
  this._performRequest();
};

// Wraps the key/value object of protocols with redirect functionality
function wrap(protocols) {
  // Default settings
  var exports = {
    maxRedirects: 21,
    maxBodyLength: 10 * 1024 * 1024,
  };

  // Wrap each protocol
  var nativeProtocols = {};
  Object.keys(protocols).forEach(function (scheme) {
    var protocol = scheme + ":";
    var nativeProtocol = nativeProtocols[protocol] = protocols[scheme];
    var wrappedProtocol = exports[scheme] = Object.create(nativeProtocol);

    // Executes a request, following redirects
    function request(input, options, callback) {
      // Parse parameters, ensuring that input is an object
      if (isURL(input)) {
        input = spreadUrlObject(input);
      }
      else if (isString(input)) {
        input = spreadUrlObject(parseUrl(input));
      }
      else {
        callback = options;
        options = validateUrl(input);
        input = { protocol: protocol };
      }
      if (isFunction(options)) {
        callback = options;
        options = null;
      }

      // Set defaults
      options = Object.assign({
        maxRedirects: exports.maxRedirects,
        maxBodyLength: exports.maxBodyLength,
      }, input, options);
      options.nativeProtocols = nativeProtocols;
      if (!isString(options.host) && !isString(options.hostname)) {
        options.hostname = "::1";
      }

      assert.equal(options.protocol, protocol, "protocol mismatch");
      debug("options", options);
      return new RedirectableRequest(options, callback);
    }

    // Executes a GET request, following redirects
    function get(input, options, callback) {
      var wrappedRequest = wrappedProtocol.request(input, options, callback);
      wrappedRequest.end();
      return wrappedRequest;
    }

    // Expose the properties on the wrapped protocol
    Object.defineProperties(wrappedProtocol, {
      request: { value: request, configurable: true, enumerable: true, writable: true },
      get: { value: get, configurable: true, enumerable: true, writable: true },
    });
  });
  return exports;
}

function noop() { /* empty */ }

function parseUrl(input) {
  var parsed;
  // istanbul ignore else
  if (useNativeURL) {
    parsed = new URL(input);
  }
  else {
    // Ensure the URL is valid and absolute
    parsed = validateUrl(url.parse(input));
    if (!isString(parsed.protocol)) {
      throw new InvalidUrlError({ input });
    }
  }
  return parsed;
}

function resolveUrl(relative, base) {
  // istanbul ignore next
  return useNativeURL ? new URL(relative, base) : parseUrl(url.resolve(base, relative));
}

function validateUrl(input) {
  if (/^\[/.test(input.hostname) && !/^\[[:0-9a-f]+\]$/i.test(input.hostname)) {
    throw new InvalidUrlError({ input: input.href || input });
  }
  if (/^\[/.test(input.host) && !/^\[[:0-9a-f]+\](:\d+)?$/i.test(input.host)) {
    throw new InvalidUrlError({ input: input.href || input });
  }
  return input;
}

function spreadUrlObject(urlObject, target) {
  var spread = target || {};
  for (var key of preservedUrlFields) {
    spread[key] = urlObject[key];
  }

  // Fix IPv6 hostname
  if (spread.hostname.startsWith("[")) {
    spread.hostname = spread.hostname.slice(1, -1);
  }
  // Ensure port is a number
  if (spread.port !== "") {
    spread.port = Number(spread.port);
  }
  // Concatenate path
  spread.path = spread.search ? spread.pathname + spread.search : spread.pathname;

  return spread;
}

function removeMatchingHeaders(regex, headers) {
  var lastValue;
  for (var header in headers) {
    if (regex.test(header)) {
      lastValue = headers[header];
      delete headers[header];
    }
  }
  return (lastValue === null || typeof lastValue === "undefined") ?
    undefined : String(lastValue).trim();
}

function createErrorType(code, message, baseClass) {
  // Create constructor
  function CustomError(properties) {
    // istanbul ignore else
    if (isFunction(Error.captureStackTrace)) {
      Error.captureStackTrace(this, this.constructor);
    }
    Object.assign(this, properties || {});
    this.code = code;
    this.message = this.cause ? message + ": " + this.cause.message : message;
  }

  // Attach constructor and set default properties
  CustomError.prototype = new (baseClass || Error)();
  Object.defineProperties(CustomError.prototype, {
    constructor: {
      value: CustomError,
      enumerable: false,
    },
    name: {
      value: "Error [" + code + "]",
      enumerable: false,
    },
  });
  return CustomError;
}

function destroyRequest(request, error) {
  for (var event of events) {
    request.removeListener(event, eventHandlers[event]);
  }
  request.on("error", noop);
  request.destroy(error);
}

function isSubdomain(subdomain, domain) {
  assert(isString(subdomain) && isString(domain));
  var dot = subdomain.length - domain.length - 1;
  return dot > 0 && subdomain[dot] === "." && subdomain.endsWith(domain);
}

function isString(value) {
  return typeof value === "string" || value instanceof String;
}

function isFunction(value) {
  return typeof value === "function";
}

function isBuffer(value) {
  return typeof value === "object" && ("length" in value);
}

function isURL(value) {
  return URL && value instanceof URL;
}

// Exports
module.exports = wrap({ http: http, https: https });
module.exports.wrap = wrap;


/***/ }),

/***/ 45753:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/**
 * Detect Electron renderer / nwjs process, which is node, but we should
 * treat as a browser.
 */

if (typeof process === 'undefined' || process.type === 'renderer' || process.browser === true || process.__nwjs) {
	module.exports = __webpack_require__(17833);
} else {
	module.exports = __webpack_require__(76033);
}


/***/ }),

/***/ 46504:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var parseUrl = (__webpack_require__(87016).parse);

var DEFAULT_PORTS = {
  ftp: 21,
  gopher: 70,
  http: 80,
  https: 443,
  ws: 80,
  wss: 443,
};

var stringEndsWith = String.prototype.endsWith || function(s) {
  return s.length <= this.length &&
    this.indexOf(s, this.length - s.length) !== -1;
};

/**
 * @param {string|object} url - The URL, or the result from url.parse.
 * @return {string} The URL of the proxy that should handle the request to the
 *  given URL. If no proxy is set, this will be an empty string.
 */
function getProxyForUrl(url) {
  var parsedUrl = typeof url === 'string' ? parseUrl(url) : url || {};
  var proto = parsedUrl.protocol;
  var hostname = parsedUrl.host;
  var port = parsedUrl.port;
  if (typeof hostname !== 'string' || !hostname || typeof proto !== 'string') {
    return '';  // Don't proxy URLs without a valid scheme or host.
  }

  proto = proto.split(':', 1)[0];
  // Stripping ports in this way instead of using parsedUrl.hostname to make
  // sure that the brackets around IPv6 addresses are kept.
  hostname = hostname.replace(/:\d*$/, '');
  port = parseInt(port) || DEFAULT_PORTS[proto] || 0;
  if (!shouldProxy(hostname, port)) {
    return '';  // Don't proxy URLs that match NO_PROXY.
  }

  var proxy =
    getEnv('npm_config_' + proto + '_proxy') ||
    getEnv(proto + '_proxy') ||
    getEnv('npm_config_proxy') ||
    getEnv('all_proxy');
  if (proxy && proxy.indexOf('://') === -1) {
    // Missing scheme in proxy, default to the requested URL's scheme.
    proxy = proto + '://' + proxy;
  }
  return proxy;
}

/**
 * Determines whether a given URL should be proxied.
 *
 * @param {string} hostname - The host name of the URL.
 * @param {number} port - The effective port of the URL.
 * @returns {boolean} Whether the given URL should be proxied.
 * @private
 */
function shouldProxy(hostname, port) {
  var NO_PROXY =
    (getEnv('npm_config_no_proxy') || getEnv('no_proxy')).toLowerCase();
  if (!NO_PROXY) {
    return true;  // Always proxy if NO_PROXY is not set.
  }
  if (NO_PROXY === '*') {
    return false;  // Never proxy if wildcard is set.
  }

  return NO_PROXY.split(/[,\s]/).every(function(proxy) {
    if (!proxy) {
      return true;  // Skip zero-length hosts.
    }
    var parsedProxy = proxy.match(/^(.+):(\d+)$/);
    var parsedProxyHostname = parsedProxy ? parsedProxy[1] : proxy;
    var parsedProxyPort = parsedProxy ? parseInt(parsedProxy[2]) : 0;
    if (parsedProxyPort && parsedProxyPort !== port) {
      return true;  // Skip if ports don't match.
    }

    if (!/^[.*]/.test(parsedProxyHostname)) {
      // No wildcards, so stop proxying if there is an exact match.
      return hostname !== parsedProxyHostname;
    }

    if (parsedProxyHostname.charAt(0) === '*') {
      // Remove leading wildcard.
      parsedProxyHostname = parsedProxyHostname.slice(1);
    }
    // Stop proxying if the hostname ends with the no_proxy host.
    return !stringEndsWith.call(hostname, parsedProxyHostname);
  });
}

/**
 * Get the value for an environment variable.
 *
 * @param {string} key - The name of the environment variable.
 * @return {string} The value of the environment variable.
 * @private
 */
function getEnv(key) {
  return process.env[key.toLowerCase()] || process.env[key.toUpperCase()] || '';
}

exports.getProxyForUrl = getProxyForUrl;


/***/ }),

/***/ 47119:
/***/ ((module) => {

"use strict";


/** @type {import('./reflectApply')} */
module.exports = typeof Reflect !== 'undefined' && Reflect && Reflect.apply;


/***/ }),

/***/ 48648:
/***/ ((module) => {

"use strict";


/** @type {import('./Reflect.getPrototypeOf')} */
module.exports = (typeof Reflect !== 'undefined' && Reflect.getPrototypeOf) || null;


/***/ }),

/***/ 49035:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

var Long = __webpack_require__(35017);

function align(n) {
    return (n + 3) & ~3;
}

/***************************************
 *
 *   BLR Writer
 *
 ***************************************/

const
    MAX_STRING_SIZE = 255;

var BlrWriter = exports.BlrWriter = function(size){
    this.buffer = Buffer.alloc(size || 32);
    this.pos = 0;
};

BlrWriter.prototype.addByte = function (b) {
    this.ensure(1);
    this.buffer.writeUInt8(b, this.pos);
    this.pos++;
};

BlrWriter.prototype.addShort = function (b) {
    this.ensure(1);
    this.buffer.writeInt8(b, this.pos);
    this.pos++;
};

BlrWriter.prototype.addSmall = function (b) {
    this.ensure(2);
    this.buffer.writeInt16LE(b, this.pos);
    this.pos += 2;
};

BlrWriter.prototype.addWord = function (b) {
    this.ensure(2);
    this.buffer.writeUInt16LE(b, this.pos);
    this.pos += 2;
};

BlrWriter.prototype.addInt32 = function (b) {
    this.ensure(4);
    this.buffer.writeUInt32LE(b, this.pos);
    this.pos += 4;
};

BlrWriter.prototype.addByteInt32 = function (c, b) {
    this.addByte(c);
    this.ensure(4);
    this.buffer.writeUInt32LE(b, this.pos);
    this.pos += 4;
};

BlrWriter.prototype.addNumeric = function (c, v) {

    if (v < 256){
        this.ensure(3);
        this.buffer.writeUInt8(c, this.pos);
        this.pos++;
        this.buffer.writeUInt8(1, this.pos);
        this.pos++;
        this.buffer.writeUInt8(v, this.pos);
        this.pos++;
        return;
    }

    this.ensure(6);
    this.buffer.writeUInt8(c, this.pos);
    this.pos++;
    this.buffer.writeUInt8(4, this.pos);
    this.pos++;
    this.buffer.writeInt32BE(v, this.pos);
    this.pos += 4;

};

BlrWriter.prototype.addBytes = function (b) {

    this.ensure(b.length);
    for (var i = 0, length = b.length; i < length; i++) {
        this.buffer.writeUInt8(b[i], this.pos);
        this.pos++;
    }
};

BlrWriter.prototype.addString = function (c, s, encoding) {
    this.addByte(c);

    var len = Buffer.byteLength(s, encoding);
    if (len > MAX_STRING_SIZE)
        throw new Error('blr string is too big');

    this.ensure(len + 1);
    this.buffer.writeUInt8(len, this.pos);
    this.pos++;
    this.buffer.write(s, this.pos, len, encoding);
    this.pos += len;
};

BlrWriter.prototype.addBuffer = function (b) {
    this.addSmall(b.length);
    this.ensure(b.length);
    b.copy(this.buffer, this.pos);
    this.pos += b.length;
};

BlrWriter.prototype.addString2 = function (c, s, encoding) {
    this.addByte(c);

    var len = Buffer.byteLength(s, encoding);
    if (len > MAX_STRING_SIZE* MAX_STRING_SIZE)
        throw new Error('blr string is too big');

    this.ensure(len + 2);
    this.buffer.writeUInt16LE(len, this.pos);
    this.pos += 2;
    this.buffer.write(s, this.pos, len, encoding);
    this.pos += len;
};

BlrWriter.prototype.addMultiblockPart = function (c, s, encoding) {
    var buff = Buffer.from(s, encoding);
    var remaining = buff.length;
    var step = 0;

    while (remaining > 0) {
        var toWrite = Math.min(remaining, 254);

        this.addByte(c);
        this.addByte(toWrite + 1);
        this.addByte(step);

        this.ensure(toWrite);
        buff.copy(this.buffer, this.pos, step * 254, (step * 254) + toWrite);

        step++;
        remaining -= toWrite;
        this.pos += toWrite;
    }
};

/***************************************
 *
 *   BLR Reader
 *
 ***************************************/

var BlrReader = exports.BlrReader = function(buffer) {
    this.buffer = buffer;
    this.pos = 0;
};

BlrReader.prototype.readByteCode = function(){
    return this.buffer.readUInt8(this.pos++);
};

BlrReader.prototype.readInt32 = function () {
    var value = this.buffer.readUInt32LE(this.pos);
    this.pos += 4;
    return value;
}

BlrReader.prototype.readInt = function(){
    var len = this.buffer.readUInt16LE(this.pos);
    this.pos += 2;
    var value;
    switch (len) {
        case 1:
            value = this.buffer.readInt8(this.pos);
            break;
        case 2:
            value = this.buffer.readInt16LE(this.pos);
            break;
        case 4:
            value = this.buffer.readInt32LE(this.pos)
    }
    this.pos += len;
    return value;
};

BlrReader.prototype.readString = function(encoding){

    var len = this.buffer.readUInt16LE(this.pos);
    var str;

    this.pos += 2;
    if (len <= 0)
        return '';

    str = this.buffer.toString(encoding, this.pos, this.pos + len);
    this.pos += len;
    return str;
};

BlrReader.prototype.readSegment = function() {

    var ret, tmp;
    var len = this.buffer.readUInt16LE(this.pos);

    this.pos += 2;

    while (len > 0) {

        if (ret) {
            tmp = ret;
            ret = Buffer.alloc(tmp.length + len);
            tmp.copy(ret);
            this.buffer.copy(ret, tmp.length, this.pos, this.pos + len);
        } else {
            ret = Buffer.alloc(len);
            this.buffer.copy(ret, 0, this.pos, this.pos + len);
        }

        this.pos += len;

        if (this.pos === this.buffer.length)
            break;

        len = this.buffer.readUInt16LE(this.pos);
        this.pos += 2;
    }

    return ret ? ret : Buffer.alloc(0);
};

/***************************************
 *
 *   XDR Writer
 *
 ***************************************/

var XdrWriter = exports.XdrWriter = function(size){
    this.buffer = Buffer.alloc(size || 32);
    this.pos = 0;
};

XdrWriter.prototype.ensure = BlrWriter.prototype.ensure = function (len) {
    var newlen = this.buffer.length;

    while (newlen < this.pos + len)
        newlen *= 2

    if (this.buffer.length >= newlen)
        return;

    var b = Buffer.alloc(newlen);
    this.buffer.copy(b);
    delete(this.buffer);
    this.buffer = b;
};

XdrWriter.prototype.addInt = function (value) {
    this.ensure(4);
    this.buffer.writeInt32BE(value, this.pos);
    this.pos += 4;
};

XdrWriter.prototype.addInt64 = function (value) {
    this.ensure(8);
    var l = Long.fromNumber(value);
    this.buffer.writeInt32BE(l.high, this.pos);
    this.pos += 4;
    this.buffer.writeInt32BE(l.low, this.pos);
    this.pos += 4;
};

XdrWriter.prototype.addInt128 = function (value) {
    this.ensure(16);

    const bigValue = BigInt(value);

    const high = bigValue >> BigInt(64);
    const low = bigValue & BigInt("0xFFFFFFFFFFFFFFFF");

    this.buffer.writeBigUInt64BE(high, this.pos);
    this.pos += 8;
    this.buffer.writeBigUInt64BE(low, this.pos);
    this.pos += 8;
};

XdrWriter.prototype.addUInt = function (value) {
    this.ensure(4);
    this.buffer.writeUInt32BE(value, this.pos);
    this.pos += 4;
};

XdrWriter.prototype.addString = function(s, encoding) {
    var len = Buffer.byteLength(s, encoding);
    var alen = align(len);
    this.ensure(alen + 4);
    this.buffer.writeInt32BE(len, this.pos);
    this.pos += 4;
    this.buffer.write(s, this.pos, len, encoding);
    this.pos += alen;
};

XdrWriter.prototype.addText = function(s, encoding) {
    var len = Buffer.byteLength(s, encoding);
    var alen = align(len);
    this.ensure(alen);
    this.buffer.write(s, this.pos, len, encoding);
    this.pos += alen;
};

XdrWriter.prototype.addBlr = function(blr) {
    var alen = align(blr.pos);
    this.ensure(alen + 4);
    this.buffer.writeInt32BE(blr.pos, this.pos);
    this.pos += 4;
    blr.buffer.copy(this.buffer, this.pos);
    this.pos += alen;
};

XdrWriter.prototype.getData = function() {
    return this.buffer.slice(0, this.pos);
};

XdrWriter.prototype.addDouble = function(value) {
    this.ensure(8);
    this.buffer.writeDoubleBE(value, this.pos);
    this.pos += 8;
};

XdrWriter.prototype.addQuad = function(quad) {
    this.ensure(8);
    var b = this.buffer;
    b.writeInt32BE(quad.high, this.pos);
    this.pos += 4;
    b.writeInt32BE(quad.low, this.pos);
    this.pos += 4;
};

XdrWriter.prototype.addBuffer = function(buffer) {
    this.ensure(buffer.length);
    buffer.copy(this.buffer, this.pos, 0, buffer.length);
    this.pos += buffer.length;
}

XdrWriter.prototype.addAlignment = function(len) {
    var alen = (4 - len) & 3;

    this.ensure(alen);
    this.buffer.write('ffffff', this.pos, alen, 'hex');
    this.pos += alen;
}

/***************************************
 *
 *   XDR Reader
 *
 ***************************************/

var XdrReader = exports.XdrReader = function(buffer){
    this.buffer = buffer;
    this.pos = 0;
};

XdrReader.prototype.readInt = function () {
    var r = this.buffer.readInt32BE(this.pos);
    this.pos += 4;
    return r;
};

XdrReader.prototype.readUInt = function () {
    var r = this.buffer.readUInt32BE(this.pos);
    this.pos += 4;
    return r;
};

XdrReader.prototype.readInt64 = function () {
    var high = this.buffer.readInt32BE(this.pos);
    this.pos += 4;
    var low = this.buffer.readInt32BE(this.pos);
    this.pos += 4;
    return new Long(low, high).toNumber();
};

XdrReader.prototype.readInt128 = function () {
    var high = this.buffer.readBigUInt64BE(this.pos)
    this.pos += 8

    var low = this.buffer.readBigUInt64BE(this.pos)
    this.pos += 8

    return (BigInt(high) << BigInt(64)) + BigInt(low)
};

XdrReader.prototype.readShort = function () {
    var r = this.buffer.readInt16BE(this.pos);
    this.pos += 2;
    return r;
};

XdrReader.prototype.readQuad = function () {
    var b = this.buffer;
    var high = b.readInt32BE(this.pos);
    this.pos += 4;
    var low = b.readInt32BE(this.pos);
    this.pos += 4;
    return {low: low, high: high}
};

XdrReader.prototype.readFloat = function () {
    var r = this.buffer.readFloatBE(this.pos);
    this.pos += 4;
    return r;
};

XdrReader.prototype.readDouble = function () {
    var r = this.buffer.readDoubleBE(this.pos);
    this.pos += 8;
    return r;
};

XdrReader.prototype.readArray = function () {
    var len = this.readInt();
    if (!len)
        return;
    var r = this.buffer.slice(this.pos, this.pos + len);
    this.pos += align(len);
    return r;
};

XdrReader.prototype.readBuffer = function (len, toAlign = true) {
    if (!arguments.length) {
        len = this.readInt();
    }

    if (len !== null && len !== undefined) {

        if (len <= 0){
            return Buffer.alloc(0);
        }

        var r = this.buffer.slice(this.pos, this.pos + len);
        this.pos += toAlign ? align(len) : len;
        return r;
    }
};

XdrReader.prototype.readString = function(encoding) {
    var len = this.readInt();
    return this.readText(len, encoding);
};

XdrReader.prototype.readText = function(len, encoding) {
    if (len <= 0)
        return '';

    var r = this.buffer.toString(encoding, this.pos, this.pos + len);
    this.pos += align(len);
    return r;
};

/***************************************
 *
 *   BitSet
 *
 ***************************************/
var WORD_LOG = 5;
var BUFFER_BITS = 8;
var BIT_ON = 1;
var BIT_OFF = 0;

var BitSet = exports.BitSet = function(buffer) {
    this.data = [];

    if (buffer) {
        this.scale(buffer.length * BUFFER_BITS);

        for (var i = 0; i < buffer.length; i++) {
            var n = buffer[i];

            for (var j = 0; j < BUFFER_BITS; j++) {
                var k = i * BUFFER_BITS + j;
                this.data[k >>> WORD_LOG] |= (n >> j & BIT_ON) << k;
            }
        }
    }
};

BitSet.prototype.scale = function(index) {
    var l = index >>> WORD_LOG;

    for (var i = this.data.length; l >= i; l--) {
        this.data.push(BIT_OFF);
    }
};

BitSet.prototype.set = function(index, value) {
    let pos = index >>> 3;

    for (let i = this.data.length; pos >= i; pos--) {
        this.data.push(BIT_OFF);
    }

    pos = index >>> 3;

    if (value === undefined || value) {
        this.data[pos] |= (1 << (index % BUFFER_BITS));
    } else {
        this.data[pos] &= ~(1 << (index % BUFFER_BITS));
    }
};

BitSet.prototype.get = function(index) {
    var n = index >>> WORD_LOG;

    if (n >= this.data.length) {
        return BIT_OFF;
    }

    return (this.data[n] >>> index) & BIT_ON;
};

BitSet.prototype.toBuffer = function() {
    return Buffer.from(this.data);
};


/***/ }),

/***/ 49092:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var hasSymbols = __webpack_require__(41333);

/** @type {import('.')} */
module.exports = function hasToStringTagShams() {
	return hasSymbols() && !!Symbol.toStringTag;
};


/***/ }),

/***/ 49605:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var GetIntrinsic = __webpack_require__(70453);

var $defineProperty = GetIntrinsic('%Object.defineProperty%', true);

var hasToStringTag = __webpack_require__(49092)();
var hasOwn = __webpack_require__(9957);
var $TypeError = __webpack_require__(69675);

var toStringTag = hasToStringTag ? Symbol.toStringTag : null;

/** @type {import('.')} */
module.exports = function setToStringTag(object, value) {
	var overrideIfSet = arguments.length > 2 && !!arguments[2] && arguments[2].force;
	var nonConfigurable = arguments.length > 2 && !!arguments[2] && arguments[2].nonConfigurable;
	if (
		(typeof overrideIfSet !== 'undefined' && typeof overrideIfSet !== 'boolean')
		|| (typeof nonConfigurable !== 'undefined' && typeof nonConfigurable !== 'boolean')
	) {
		throw new $TypeError('if provided, the `overrideIfSet` and `nonConfigurable` options must be booleans');
	}
	if (toStringTag && (overrideIfSet || !hasOwn(object, toStringTag))) {
		if ($defineProperty) {
			$defineProperty(object, toStringTag, {
				configurable: !nonConfigurable,
				enumerable: false,
				value: value,
				writable: false
			});
		} else {
			object[toStringTag] = value; // eslint-disable-line no-param-reassign
		}
	}
};


/***/ }),

/***/ 51496:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

var BigInt = __webpack_require__(92096),
    crypto = __webpack_require__(76982);

const SRP_KEY_SIZE = 128,
  SRP_KEY_MAX = BigInt('340282366920938463463374607431768211456'), // 1 << SRP_KEY_SIZE
  SRP_SALT_SIZE = 32;

const DEBUG = false;
const DEBUG_PRIVATE_KEY = BigInt('84316857F47914F838918D5C12CE3A3E7A9B2D7C9486346809E9EEFCE8DE7CD4259D8BE4FD0BCC2D259553769E078FA61EE2977025E4DA42F7FD97914D8A33723DFAFBC00770B7DA0C2E3778A05790F0C0F33C32A19ED88A12928567749021B3FD45DCD1CE259C45325067E3DDC972F87867349BA82C303CCCAA9B207218007B', 16);

/**
 * Prime values.
 *
 * @type {{g: (bigInt.BigInteger), k: (bigInt.BigInteger), N: (bigInt.BigInteger)}}
 */
const PRIME = {
    N: BigInt('E67D2E994B2F900C3F41F08F5BB2627ED0D49EE1FE767A52EFCD565CD6E768812C3E1E9CE8F0A8BEA6CB13CD29DDEBF7A96D4A93B55D488DF099A15C89DCB0640738EB2CBDD9A8F7BAB561AB1B0DC1C6CDABF303264A08D1BCA932D1F1EE428B619D970F342ABA9A65793B8B2F041AE5364350C16F735F56ECBCA87BD57B29E7', 16),
    g: BigInt(2),
    k: BigInt('1277432915985975349439481660349303019122249719989')
};

/**
 * Generate a client key pair.
 *
 * @param a bigInt.BigInteger Client private key.
 * @returns {{private: bigInt.BigInteger, public: bigInt.BigInteger}}
 */
exports.clientSeed = function(a = toBigInt(crypto.randomBytes(SRP_KEY_SIZE))) {
    var A = PRIME.g.modPow(a, PRIME.N);

    dump('a', a);
    dump('A', A);

    return {
        public: A,
        private: a
    };
}

/**
 * Generate a server key pair.
 *
 * @param user string Connection username.
 * @param password string Connection password.
 * @param salt bigInt.BigInteger Connection salt.
 * @param b bigInt.BigInteger Server private key.
 * @returns {{private: bigInt.BigInteger, public: bigInt.BigInteger}}
 */
exports.serverSeed = function(user, password, salt, b = toBigInt(crypto.randomBytes(SRP_KEY_SIZE))) {
    var v = getVerifier(user, password, salt);
    var gb = PRIME.g.modPow(b, PRIME.N);
    var kv = PRIME.k.multiply(v).mod(PRIME.N);
    var B = kv.add(gb).mod(PRIME.N);

    dump('v', v);
    dump('b', b);
    dump('gb', b);
    dump('kv', v);
    dump('B', B);

    return {
        public: B,
        private: b
    };
}

/**
 * Server session secret.
 *
 * @param user string Connection username.
 * @param password string Connection password.
 * @param salt bigInt.BigInteger Connection salt.
 * @param A bigInt.BigInteger Client public key.
 * @param B bigInt.BigInteger Server public key.
 * @param b bigInt.BigInteger Server private key.
 * @returns {bigInt.BigInteger}
 */
exports.serverSession = function(user, password, salt, A, B, b) {
    var u = getScramble(A, B);
    var v = getVerifier(user, password, salt);
    var vu = v.modPow(u, PRIME.N);
    var Avu = A.multiply(vu).mod(PRIME.N);
    var sessionSecret = Avu.modPow(b, PRIME.N);
    var K = getHash('sha1', toBuffer(sessionSecret));

    dump('server sessionSecret', sessionSecret);
    dump('server K', K);

    return BigInt(K, 16);
};

/**
 * M = H(H(N) xor H(g), H(I), s, A, B, K)
 */
exports.clientProof = function(user, password, salt, A, B, a, hashAlgo) {
    var K = clientSession(user, password, salt, A, B, a);
    var n1, n2;

    n1 = toBigInt(getHash('sha1', toBuffer(PRIME.N)));
    n2 = toBigInt(getHash('sha1', toBuffer(PRIME.g)));

    dump('n1', n1);
    dump('n2', n2);

    n1 = n1.modPow(n2, PRIME.N);
    n2 = toBigInt(getHash('sha1', user));
    var M = toBigInt(getHash(hashAlgo, toBuffer(n1), toBuffer(n2), salt, toBuffer(A), toBuffer(B), toBuffer(K)));

    dump('n1-2', n1);
    dump('n2-2', n2);
    dump('proof:M', M);

    return {
        clientSessionKey: K,
        authData: M,
    };
}

/**
 *  Pad hex string.
 */
function hexPad(hex) {
    if (hex.length % 2 !== 0) {
        hex = '0' + hex;
    }

    return hex;
}
exports.hexPad = hexPad;

/**
 * Pad key with SRP_KEY_SIZE.
 *
 * @param n BigInt Key to pad.
 * @returns Buffer
 */
function pad(n) {
    var buff = Buffer.from(hexPad(n.toString(16)), 'hex');

    if (buff.length > SRP_KEY_SIZE) {
        buff = buff.slice(buff.length - SRP_KEY_SIZE, buff.length);
    }

    return buff;
}

/**
 * Scramble keys.
 *
 * @param A bigInt.BigInteger Client public key.
 * @param B bigInt.BigInteger Server public key.
 * @returns {bigInt.BigInteger}
 */
function getScramble(A, B) {
    return BigInt(getHash('sha1', pad(A), pad(B)), 16);
}

/**
 * Client session secret.
 *
 * Both: u = H(A, B)
 * User: x = H(s, p)                 (user enters password)
 * User: S = (B - kg^x) ^ (a + ux)   (computes session key)
 * User: K = H(S)
 *
 * @param user string Connection username.
 * @param password string Connection password.
 * @param salt bigInt.BigInteger Connection salt.
 * @param A bigInt.BigInteger Client public key.
 * @param B bigInt.BigInteger Server public key.
 * @param a bigInt.BigInteger Client private key.
 */
function clientSession(user, password, salt, A, B, a) {
    var u = getScramble(A, B);
    var x = getUserHash(user, salt, password);
    var gx = PRIME.g.modPow(x, PRIME.N);
    var kgx = PRIME.k.multiply(gx).mod(PRIME.N);
    var diff = B.subtract(kgx).mod(PRIME.N);

    if (diff.lesser(0)) {
        diff = diff.add(PRIME.N);
    }

    var ux = u.multiply(x).mod(PRIME.N);
    var aux = a.add(ux).mod(PRIME.N);
    var sessionSecret = diff.modPow(aux, PRIME.N);
    var K = toBigInt(getHash('sha1', toBuffer(sessionSecret)));

    dump('B', B);
    dump('u', u);
    dump('x', x);
    dump('gx', gx);
    dump('kgx', kgx);
    dump('diff', diff);
    dump('ux', ux);
    dump('aux', aux);
    dump('sessionSecret', sessionSecret);
    dump('sessionKey(K)', K);

    return K;
}

/**
 * Compute user hash.
 *
 * @param user string Connection username.
 * @param salt bigInt.BigInteger Connection salt.
 * @param password string Connection password.
 * @returns {bigInt.BigInteger}
 */
function getUserHash(user, salt, password) {
    var hash1 = getHash('sha1', user.toUpperCase(), ':', password);
    var hash2 = getHash('sha1', salt, toBuffer(hash1));

    return toBigInt(hash2);
}

/**
 * Verifier of user hash.
 *
 * @param user string Connection username.
 * @param password string Connection password.
 * @param salt  bigInt.BigInteger Connection salt.
 * @returns {bigInt.BigInteger}
 */
function getVerifier(user, password, salt) {
    return PRIME.g.modPow(getUserHash(user, salt, password), PRIME.N);
}

/**
 * Hash data and return hex string.
 *
 * @param algo string Algorithm to use.
 * @param data any[] Data to hash.
 * @returns {string}
 */
function getHash(algo, ...data) {
    var hash = crypto.createHash(algo);

    for (var d of data) {
        hash.update(d);
    }

    return hash.digest('hex');
}

/**
 * Convert BigInt to buffer.
 *
 * @param bigInt
 * @returns {*}
 */
function toBuffer(bigInt) {
    return Buffer.from(BigInt.isInstance(bigInt) ? hexPad(bigInt.toString(16)) : bigInt, 'hex');
}

/**
 * Convert hex buffer or string to BigInt.
 *
 * @param hex
 * @returns {bigInt.BigInteger}
 */
function toBigInt(hex) {
    return BigInt(Buffer.isBuffer(hex) ? hex.toString('hex') : hex, 16);
}

/**
 * Dump value in debug mode.
 *
 * @param key
 * @param value
 */
function dump(key, value) {
    if (DEBUG) {
        if (BigInt.isInstance(value)) {
            value = value.toString(16);
        }

        console.log(key + '=' + value);
    }
}

/***/ }),

/***/ 52018:
/***/ ((module) => {

"use strict";
module.exports = require("tty");

/***/ }),

/***/ 52081:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var serialOrdered = __webpack_require__(90028);

// Public API
module.exports = serial;

/**
 * Runs iterator over provided array elements in series
 *
 * @param   {array|object} list - array or object (named list) to iterate over
 * @param   {function} iterator - iterator to run
 * @param   {function} callback - invoked when all elements processed
 * @returns {function} - jobs terminator
 */
function serial(list, iterator, callback)
{
  return serialOrdered(list, iterator, null, callback);
}


/***/ }),

/***/ 52750:
/***/ ((module) => {

/***************************************
 *
 *   Constantes
 *
 ***************************************/

const defaultOptions = {
    DEFAULT_HOST : '127.0.0.1',
    DEFAULT_PORT : 3050,
    DEFAULT_USER : 'SYSDBA',
    DEFAULT_PASSWORD : 'masterkey',
    DEFAULT_LOWERCASE_KEYS : false,
    DEFAULT_PAGE_SIZE : 4096,
    DEFAULT_SVC_NAME : 'service_mgr',
    DEFAULT_ENCODING : 'UTF8',
    DEFAULT_FETCHSIZE : 200,
};

const buffer= {
    MAX_BUFFER_SIZE : 8192,
};

const int = {
    MAX_INT : Math.pow(2, 31) - 1,
    MIN_INT : -Math.pow(2, 31),
};

const op = {
    op_void                   : 0,  // Packet has been voided
    op_connect                : 1,  // Connect to remote server
    op_exit                   : 2,  // Remote end has exitted
    op_accept                 : 3,  // Server accepts connection
    op_reject                 : 4,  // Server rejects connection
    op_disconnect             : 6,  // Connect is going away
    op_response               : 9,  // Generic response block

    // Full context server operations

    op_attach                 : 19, // Attach database
    op_create                 : 20, // Create database
    op_detach                 : 21, // Detach database
    op_compile                : 22, // Request based operations
    op_start                  : 23,
    op_start_and_send         : 24,
    op_send                   : 25,
    op_receive                : 26,
    op_unwind                 : 27, // apparently unused, see protocol.cpp's case op_unwind
    op_release                : 28,

    op_transaction            : 29, // Transaction operations
    op_commit                 : 30,
    op_rollback               : 31,
    op_prepare                : 32,
    op_reconnect              : 33,

    op_create_blob            : 34, // Blob operations
    op_open_blob              : 35,
    op_get_segment            : 36,
    op_put_segment            : 37,
    op_cancel_blob            : 38,
    op_close_blob             : 39,

    op_info_database          : 40, // Information services
    op_info_request           : 41,
    op_info_transaction       : 42,
    op_info_blob              : 43,

    op_batch_segments         : 44, // Put a bunch of blob segments

    op_que_events             : 48, // Que event notification request
    op_cancel_events          : 49, // Cancel event notification request
    op_commit_retaining       : 50, // Commit retaining (what else)
    op_prepare2               : 51, // Message form of prepare
    op_event                  : 52, // Completed event request (asynchronous)
    op_connect_request        : 53, // Request to establish connection
    op_aux_connect            : 54, // Establish auxiliary connection
    op_ddl                    : 55, // DDL call
    op_open_blob2             : 56,
    op_create_blob2           : 57,
    op_get_slice              : 58,
    op_put_slice              : 59,
    op_slice                  : 60, // Successful response to op_get_slice
    op_seek_blob              : 61, // Blob seek operation

// DSQL operations

    op_allocate_statement     : 62, // allocate a statment handle
    op_execute                : 63, // execute a prepared statement
    op_exec_immediate         : 64, // execute a statement
    op_fetch                  : 65, // fetch a record
    op_fetch_response         : 66, // response for record fetch
    op_free_statement         : 67, // free a statement
    op_prepare_statement      : 68, // prepare a statement
    op_set_cursor             : 69, // set a cursor name
    op_info_sql               : 70,

    op_dummy                  : 71, // dummy packet to detect loss of client
    op_response_piggyback     : 72, // response block for piggybacked messages
    op_start_and_receive      : 73,
    op_start_send_and_receive : 74,
    op_exec_immediate2        : 75, // execute an immediate statement with msgs
    op_execute2               : 76, // execute a statement with msgs
    op_insert                 : 77,
    op_sql_response           : 78, // response from execute, exec immed, insert
    op_transact               : 79,
    op_transact_response      : 80,
    op_drop_database          : 81,
    op_service_attach         : 82,
    op_service_detach         : 83,
    op_service_info           : 84,
    op_service_start          : 85,
    op_rollback_retaining     : 86,
    op_partial                : 89, // packet is not complete - delay processing
    op_trusted_auth           : 90,
    op_cancel                 : 91,
    op_cont_auth              : 92,
    op_ping                   : 93,
    op_accept_data            : 94, // Server accepts connection and returns some data to client
    op_abort_aux_connection   : 95, // Async operation - stop waiting for async connection to arrive
    op_crypt                  : 96,
    op_crypt_key_callback     : 97,
    op_cond_accept            : 98, // Server accepts connection, returns some data to client
                                    // and asks client to continue authentication before attach call
};

const dsql = {
    DSQL_close : 1,
    DSQL_drop : 2,
    DSQL_unprepare : 4, // >: 2.5
};

/***********************/
/*   ISC Error Codes   */
/***********************/
const iscError = {
    isc_sqlerr: 335544436,
    isc_arg_end : 0,  // end of argument list
    isc_arg_gds : 1,  // generic DSRI status value
    isc_arg_string : 2,  // string argument
    isc_arg_cstring : 3,  // count & string argument
    isc_arg_number : 4,  // numeric argument (long)
    isc_arg_interpreted : 5,  // interpreted status code (string)
    isc_arg_unix : 7,  // UNIX error code
    isc_arg_next_mach : 15, // NeXT/Mach error code
    isc_arg_win32 : 17, // Win32 error code
    isc_arg_warning : 18, // warning argument
    isc_arg_sql_state : 19, // SQLSTATE
};

const connect = {
    CONNECT_VERSION2 : 2,
    CONNECT_VERSION3 : 3,
    ARCHITECTURE_GENERIC : 1,
};

/*******************/
/*    Protocols    */
/*******************/
const FB_PROTOCOL_FLAG = 0x8000;
const protocol = {
    // Protocol 10 includes support for warnings and removes the requirement for
    // encoding and decoding status codes
    PROTOCOL_VERSION10  : 10,

    // Since protocol 11 we must be separated from Borland Interbase.
    // Therefore always set highmost bit in protocol version to 1.
    // For unsigned protocol version this does not break version's compare.
    FB_PROTOCOL_FLAG    : FB_PROTOCOL_FLAG,
    FB_PROTOCOL_MASK    : ~FB_PROTOCOL_FLAG & 0xFFFF,

    // Protocol 11 has support for user authentication related
    // operations (op_update_account_info, op_authenticate_user and
    // op_trusted_auth). When specific operation is not supported,
    // we say "sorry".
    PROTOCOL_VERSION11  : (FB_PROTOCOL_FLAG | 11),

    // Protocol 12 has support for asynchronous call op_cancel.
    // Currently implemented asynchronously only for TCP/IP.
    PROTOCOL_VERSION12  : (FB_PROTOCOL_FLAG | 12),

    // Protocol 13 has support for authentication plugins (op_cont_auth).
    PROTOCOL_VERSION13  : (FB_PROTOCOL_FLAG | 13),
};

// Protocols types (accept_type)
const acceptType = {
    ptype_rpc : 2, 			 // Simple remote procedure call
    ptype_batch_send : 3,    // Batch sends, no asynchrony
    ptype_out_of_band : 4,   // Batch sends w/ out of band notification
    ptype_lazy_send : 5,     // Deferred packets delivery;
    ptype_mask : 0xFF,       // Mask - up to 255 types of protocol
    pflag_compress : 0x100  // Turn on compression if possible
};

const SUPPORTED_PROTOCOL = [
    [protocol.PROTOCOL_VERSION10, connect.ARCHITECTURE_GENERIC, acceptType.ptype_rpc, acceptType.ptype_batch_send, 1],
    [protocol.PROTOCOL_VERSION11, connect.ARCHITECTURE_GENERIC, acceptType.ptype_lazy_send, acceptType.ptype_lazy_send, 2],
    [protocol.PROTOCOL_VERSION12, connect.ARCHITECTURE_GENERIC, acceptType.ptype_lazy_send, acceptType.ptype_lazy_send, 3],
    [protocol.PROTOCOL_VERSION13, connect.ARCHITECTURE_GENERIC, acceptType.ptype_lazy_send, acceptType.ptype_lazy_send, 4],
];

const authPlugin = {
    AUTH_PLUGIN_LEGACY : 'Legacy_Auth',
    AUTH_PLUGIN_SRP : 'Srp',
    // AUTH_PLUGIN_SRP256 : 'Srp256',
};

const authOptions = {
    // AUTH_PLUGIN_LIST : [authPlugin.AUTH_PLUGIN_SRP256, authPlugin.AUTH_PLUGIN_SRP, authPlugin.AUTH_PLUGIN_LEGACY],
    AUTH_PLUGIN_LIST : [authPlugin.AUTH_PLUGIN_SRP, authPlugin.AUTH_PLUGIN_LEGACY],
    // AUTH_PLUGIN_SRP_LIST : [authPlugin.AUTH_PLUGIN_SRP256, authPlugin.AUTH_PLUGIN_SRP],
    AUTH_PLUGIN_SRP_LIST : [authPlugin.AUTH_PLUGIN_SRP],
    LEGACY_AUTH_SALT : '9z',
    WIRE_CRYPT_DISABLE : 0,
    WIRE_CRYPT_ENABLE : 1,
};

/*******************/
/*    SQL Type     */
/*******************/
const sqlType = {
    SQL_TEXT : 452, // Array of char
    SQL_VARYING : 448,
    SQL_SHORT : 500,
    SQL_LONG : 496,
    SQL_FLOAT : 482,
    SQL_DOUBLE : 480,
    SQL_D_FLOAT : 530,
    SQL_TIMESTAMP : 510,
    SQL_BLOB : 520,
    SQL_ARRAY : 540,
    SQL_QUAD : 550,
    SQL_TYPE_TIME : 560,
    SQL_TYPE_DATE : 570,
    SQL_INT64 : 580,
    SQL_INT128: 32752, // >= 4.0
    SQL_BOOLEAN : 32764, // >: 3.0
    SQL_NULL : 32766, // >= 2.5
};

const blobType = {
    isc_blob_text : 1,
};

/*******************/
/* Blr definitions */
/*******************/
const blr = {
    blr_text : 14,
    blr_text2 : 15,
    blr_short : 7,
    blr_long : 8,
    blr_quad : 9,
    blr_float : 10,
    blr_double : 27,
    blr_d_float : 11,
    blr_timestamp : 35,
    blr_varying : 37,
    blr_varying2 : 38,
    blr_blob : 261,
    blr_cstring : 40,
    blr_cstring2 : 41,
    blr_blob_id : 45,
    blr_sql_date : 12,
    blr_sql_time : 13,
    blr_int64 : 16,
    blr_int128 : 26, // >: 4.0
    blr_blob2 : 17, // >: 2.0
    blr_domain_name : 18, // >: 2.1
    blr_domain_name2 : 19, // >: 2.1
    blr_not_nullable : 20, // >: 2.1
    blr_column_name : 21, // >: 2.5
    blr_column_name2 : 22, // >: 2.5
    blr_bool : 23, // >: 3.0

    blr_version4 : 4,
    blr_version5 : 5, // dialect 3
    blr_eoc : 76,
    blr_end : 255,

    blr_assignment : 1,
    blr_begin : 2,
    blr_dcl_variable : 3,
    blr_message : 4,
};

/**********************************/
/* Database parameter block stuff */
/**********************************/
const dpb = {
    isc_dpb_version1                : 1,
    isc_dpb_version2                : 2, // >: FB30
    isc_dpb_cdd_pathname            : 1,
    isc_dpb_allocation              : 2,
    isc_dpb_journal                 : 3,
    isc_dpb_page_size               : 4,
    isc_dpb_num_buffers             : 5,
    isc_dpb_buffer_length           : 6,
    isc_dpb_debug                   : 7,
    isc_dpb_garbage_collect         : 8,
    isc_dpb_verify                  : 9,
    isc_dpb_sweep                   : 10,
    isc_dpb_enable_journal          : 11,
    isc_dpb_disable_journal         : 12,
    isc_dpb_dbkey_scope             : 13,
    isc_dpb_number_of_users         : 14,
    isc_dpb_trace                   : 15,
    isc_dpb_no_garbage_collect      : 16,
    isc_dpb_damaged                 : 17,
    isc_dpb_license                 : 18,
    isc_dpb_sys_user_name           : 19,
    isc_dpb_encrypt_key             : 20,
    isc_dpb_activate_shadow         : 21,
    isc_dpb_sweep_interval          : 22,
    isc_dpb_delete_shadow           : 23,
    isc_dpb_force_write             : 24,
    isc_dpb_begin_log               : 25,
    isc_dpb_quit_log                : 26,
    isc_dpb_no_reserve              : 27,
    isc_dpb_user_name               : 28,
    isc_dpb_password                : 29,
    isc_dpb_password_enc            : 30,
    isc_dpb_sys_user_name_enc       : 31,
    isc_dpb_interp                  : 32,
    isc_dpb_online_dump             : 33,
    isc_dpb_old_file_size           : 34,
    isc_dpb_old_num_files           : 35,
    isc_dpb_old_file                : 36,
    isc_dpb_old_start_page          : 37,
    isc_dpb_old_start_seqno         : 38,
    isc_dpb_old_start_file          : 39,
    isc_dpb_old_dump_id             : 41,
    isc_dpb_lc_messages             : 47,
    isc_dpb_lc_ctype                : 48,
    isc_dpb_cache_manager           : 49,
    isc_dpb_shutdown                : 50,
    isc_dpb_online                  : 51,
    isc_dpb_shutdown_delay          : 52,
    isc_dpb_reserved                : 53,
    isc_dpb_overwrite               : 54,
    isc_dpb_sec_attach              : 55,
    isc_dpb_connect_timeout         : 57,
    isc_dpb_dummy_packet_interval   : 58,
    isc_dpb_gbak_attach             : 59,
    isc_dpb_sql_role_name           : 60,
    isc_dpb_set_page_buffers        : 61,
    isc_dpb_working_directory       : 62,
    isc_dpb_sql_dialect             : 63,
    isc_dpb_set_db_readonly         : 64,
    isc_dpb_set_db_sql_dialect      : 65,
    isc_dpb_gfix_attach             : 66,
    isc_dpb_gstat_attach            : 67,
    isc_dpb_set_db_charset          : 68,
    isc_dpb_gsec_attach             : 69,
    isc_dpb_address_path            : 70,
    isc_dpb_process_id              : 71,
    isc_dpb_no_db_triggers          : 72,
    isc_dpb_trusted_auth            : 73,
    isc_dpb_process_name            : 74,
    isc_dpb_trusted_role            : 75,
    isc_dpb_org_filename            : 76,
    isc_dpb_utf8_filename           : 77,
    isc_dpb_ext_call_depth          : 78,
    isc_dpb_auth_block 				: 79,
    isc_dpb_client_version 			: 80,
    isc_dpb_remote_protocol 		: 81,
    isc_dpb_host_name 				: 82,
    isc_dpb_os_user 				: 83,
    isc_dpb_specific_auth_data 		: 84,
    isc_dpb_auth_plugin_list 		: 85,
    isc_dpb_auth_plugin_name 		: 86,
    isc_dpb_config 					: 87,
    isc_dpb_nolinger 				: 88,
    isc_dpb_reset_icu 				: 89,
    isc_dpb_map_attach 				: 90,
    isc_dpb_session_time_zone 		: 91,
};

const cnct = {
    CNCT_user : 1, // User name
    CNCT_passwd : 2,
    // CNCT_ppo : 3, // Apollo person, project, organization. OBSOLETE.
    CNCT_host : 4,
    CNCT_group : 5, // Effective Unix group id
    CNCT_user_verification : 6, // Attach/create using this connection will use user verification
    CNCT_specific_data : 7, // Some data, needed for user verification on server
    CNCT_plugin_name : 8, // Name of plugin, which generated that data
    CNCT_login : 9, // Same data as isc_dpb_user_name
    CNCT_plugin_list : 10, // List of plugins, available on client
    CNCT_client_crypt : 11, // Client encyption level (DISABLED/ENABLED/REQUIRED)
    WIRE_CRYPT_DISABLED : 0,
    WIRE_CRYPT_ENABLED : 1,
    WIRE_CRYPT_REQUIRED : 2,
};

/****************************/
/* Common, structural codes */
/****************************/
const common = {
    isc_info_end                    : 1,
    isc_info_truncated              : 2,
    isc_info_error                  : 3,
    isc_info_data_not_ready         : 4,
    isc_info_length                 : 126,
    isc_info_flag_end               : 127,
};

/*************************************/
/* Transaction parameter block stuff */
/*************************************/
const tpb = {
    isc_tpb_version1 : 1,
    isc_tpb_version3 : 3,
    isc_tpb_consistency : 1,
    isc_tpb_concurrency : 2,
    isc_tpb_shared : 3, // < FB21
    isc_tpb_protected : 4, // < FB21
    isc_tpb_exclusive : 5, // < FB21
    isc_tpb_wait : 6,
    isc_tpb_nowait : 7,
    isc_tpb_read : 8,
    isc_tpb_write : 9,
    isc_tpb_lock_read : 10,
    isc_tpb_lock_write : 11,
    isc_tpb_verb_time : 12,
    isc_tpb_commit_time : 13,
    isc_tpb_ignore_limbo : 14,
    isc_tpb_read_committed : 15,
    isc_tpb_autocommit : 16,
    isc_tpb_rec_version : 17,
    isc_tpb_no_rec_version : 18,
    isc_tpb_restart_requests : 19,
    isc_tpb_no_auto_undo : 20,
    isc_tpb_lock_timeout : 21, // >= FB20
};

const transactionIsolation = {
    ISOLATION_READ_UNCOMMITTED         : [tpb.isc_tpb_version3, tpb.isc_tpb_write, tpb.isc_tpb_wait, tpb.isc_tpb_read_committed, tpb.isc_tpb_rec_version],
    ISOLATION_READ_COMMITTED           : [tpb.isc_tpb_version3, tpb.isc_tpb_write, tpb.isc_tpb_wait, tpb.isc_tpb_read_committed, tpb.isc_tpb_no_rec_version],
    ISOLATION_REPEATABLE_READ          : [tpb.isc_tpb_version3, tpb.isc_tpb_write, tpb.isc_tpb_wait, tpb.isc_tpb_concurrency],
    ISOLATION_SERIALIZABLE             : [tpb.isc_tpb_version3, tpb.isc_tpb_write, tpb.isc_tpb_wait, tpb.isc_tpb_consistency],
    ISOLATION_READ_COMMITTED_READ_ONLY : [tpb.isc_tpb_version3, tpb.isc_tpb_read, tpb.isc_tpb_wait, tpb.isc_tpb_read_committed, tpb.isc_tpb_no_rec_version],
};

/*************************/
/* SQL information items */
/*************************/
const sqlInfo = {
    isc_info_sql_select : 4,
    isc_info_sql_bind : 5,
    isc_info_sql_num_variables : 6,
    isc_info_sql_describe_vars : 7,
    isc_info_sql_describe_end : 8,
    isc_info_sql_sqlda_seq : 9,
    isc_info_sql_message_seq : 10,
    isc_info_sql_type : 11,
    isc_info_sql_sub_type : 12,
    isc_info_sql_scale : 13,
    isc_info_sql_length : 14,
    isc_info_sql_null_ind : 15,
    isc_info_sql_field : 16,
    isc_info_sql_relation : 17,
    isc_info_sql_owner : 18,
    isc_info_sql_alias : 19,
    isc_info_sql_sqlda_start : 20,
    isc_info_sql_stmt_type : 21,
    isc_info_sql_get_plan : 22,
    isc_info_sql_records : 23,
    isc_info_sql_batch_fetch : 24,
    isc_info_sql_relation_alias : 25, // >: 2.0
    isc_info_sql_explain_plan : 26, // >= 3.0
};

const statementInfo = {
    isc_info_sql_stmt_select : 1,
    isc_info_sql_stmt_insert : 2,
    isc_info_sql_stmt_update : 3,
    isc_info_sql_stmt_delete : 4,
    isc_info_sql_stmt_ddl : 5,
    isc_info_sql_stmt_get_segment : 6,
    isc_info_sql_stmt_put_segment : 7,
    isc_info_sql_stmt_exec_procedure : 8,
    isc_info_sql_stmt_start_trans : 9,
    isc_info_sql_stmt_commit : 10,
    isc_info_sql_stmt_rollback : 11,
    isc_info_sql_stmt_select_for_upd : 12,
    isc_info_sql_stmt_set_generator : 13,
    isc_info_sql_stmt_savepoint : 14,
};

const DESCRIBE = [
    sqlInfo.isc_info_sql_stmt_type,
    sqlInfo.isc_info_sql_select,
    sqlInfo.isc_info_sql_describe_vars,
    sqlInfo.isc_info_sql_sqlda_seq,
    sqlInfo.isc_info_sql_type,
    sqlInfo.isc_info_sql_sub_type,
    sqlInfo.isc_info_sql_scale,
    sqlInfo.isc_info_sql_length,
    sqlInfo.isc_info_sql_field,
    sqlInfo.isc_info_sql_relation,
    //isc_info_sql_owner,
    sqlInfo.isc_info_sql_alias,
    sqlInfo.isc_info_sql_describe_end,
    sqlInfo.isc_info_sql_bind,
    sqlInfo.isc_info_sql_describe_vars,
    sqlInfo.isc_info_sql_sqlda_seq,
    sqlInfo.isc_info_sql_type,
    sqlInfo.isc_info_sql_sub_type,
    sqlInfo.isc_info_sql_scale,
    sqlInfo.isc_info_sql_length,
    sqlInfo.isc_info_sql_describe_end
];

/***********************/
/*   ISC Services      */
/***********************/
const iscAction = {
    isc_action_svc_backup : 1, /* Starts database backup process on the server	*/
    isc_action_svc_restore : 2, /* Starts database restore process on the server */
    isc_action_svc_repair : 3, /* Starts database repair process on the server	*/
    isc_action_svc_add_user : 4, /* Adds	a new user to the security database	*/
    isc_action_svc_delete_user : 5, /* Deletes a user record from the security database	*/
    isc_action_svc_modify_user : 6, /* Modifies	a user record in the security database */
    isc_action_svc_display_user : 7, /* Displays	a user record from the security	database */
    isc_action_svc_properties : 8, /* Sets	database properties	*/
    isc_action_svc_add_license : 9, /* Adds	a license to the license file */
    isc_action_svc_remove_license : 10, /* Removes a license from the license file */
    isc_action_svc_db_stats : 11, /* Retrieves database statistics */
    isc_action_svc_get_ib_log : 12, /* Retrieves the InterBase log file	from the server	*/
    isc_action_svc_get_fb_log : 12, // isc_action_svc_get_ib_log, /* Retrieves the Firebird log file	from the server	*/
    isc_action_svc_nbak : 20, /* start nbackup */
    isc_action_svc_nrest : 21,  /* start nrestore */
    isc_action_svc_trace_start : 22,
    isc_action_svc_trace_stop : 23,
    isc_action_svc_trace_suspend : 24,
    isc_action_svc_trace_resume : 25,
    isc_action_svc_trace_list : 26,
};

/* Services Properties */
const service = {
    isc_spb_prp_page_buffers : 5,
    isc_spb_prp_sweep_interval : 6,
    isc_spb_prp_shutdown_db : 7,
    isc_spb_prp_deny_new_attachments : 9,
    isc_spb_prp_deny_new_transactions : 10,
    isc_spb_prp_reserve_space : 11,
    isc_spb_prp_write_mode : 12,
    isc_spb_prp_access_mode : 13,
    isc_spb_prp_set_sql_dialect : 14,
    isc_spb_num_att : 5,
    isc_spb_num_db : 6,
    // SHUTDOWN OPTION FOR 2.0
    isc_spb_prp_force_shutdown : 41,
    isc_spb_prp_attachments_shutdown : 42,
    isc_spb_prp_transactions_shutdown : 43,
    isc_spb_prp_shutdown_mode : 44,
    isc_spb_prp_online_mode : 45,

    isc_spb_prp_sm_normal : 0,
    isc_spb_prp_sm_multi : 1,
    isc_spb_prp_sm_single : 2,
    isc_spb_prp_sm_full : 3,

    // WRITE_MODE_PARAMETERS
    isc_spb_prp_wm_async : 37,
    isc_spb_prp_wm_sync : 38,

    // ACCESS_MODE_PARAMETERS
    isc_spb_prp_am_readonly : 39,
    isc_spb_prp_am_readwrite : 40,

    // RESERVE_SPACE_PARAMETERS
    isc_spb_prp_res_use_full : 35,
    isc_spb_prp_res : 36,

    // Option Flags
    isc_spb_prp_activate : 0x0100,
    isc_spb_prp_db_online : 0x0200,
};

/****************************/
/*       Service info       */
/****************************/
const serviceInfo = {
    isc_info_svc_svr_db_info: 50, /* Retrieves the number	of attachments and databases */
    isc_info_svc_get_license: 51, /* Retrieves all license keys and IDs from the license file	*/
    isc_info_svc_get_license_mask: 52, /* Retrieves a bitmask representing	licensed options on	the	server */
    isc_info_svc_get_config: 53, /* Retrieves the parameters	and	values for IB_CONFIG */
    isc_info_svc_version: 54, /* Retrieves the version of	the	services manager */
    isc_info_svc_server_version: 55, /* Retrieves the version of	the	InterBase server */
    isc_info_svc_implementation: 56, /* Retrieves the implementation	of the InterBase server	*/
    isc_info_svc_capabilities: 57, /* Retrieves a bitmask representing	the	server's capabilities */
    isc_info_svc_user_dbpath: 58, /* Retrieves the path to the security database in use by the server	*/
    isc_info_svc_get_env: 59, /* Retrieves the setting of	$INTERBASE */
    isc_info_svc_get_env_lock: 60, /* Retrieves the setting of	$INTERBASE_LCK */
    isc_info_svc_get_env_msg: 61, /* Retrieves the setting of	$INTERBASE_MSG */
    isc_info_svc_line: 62, /* Retrieves 1 line	of service output per call */
    isc_info_svc_to_eof: 63, /* Retrieves as much of	the	server output as will fit in the supplied buffer */
    isc_info_svc_timeout: 64, /* Sets	/ signifies	a timeout value	for	reading	service	information	*/
    isc_info_svc_get_licensed_users: 65, /* Retrieves the number	of users licensed for accessing	the	server */
    isc_info_svc_limbo_trans: 66, /* Retrieve	the	limbo transactions */
    isc_info_svc_running: 67, /* Checks to see if	a service is running on	an attachment */
    isc_info_svc_get_users: 68, /* Returns the user	information	from isc_action_svc_display_users */
    isc_info_svc_stdin: 78,
};

/*************************************/
/* Services parameter block stuff    */
/*************************************/
const spb = {
    isc_spb_version1 : 1,
    isc_spb_current_version : 2,
    isc_spb_version : 2, // isc_spb_current_version,
    isc_spb_user_name : dpb.isc_dpb_user_name,
    isc_spb_sys_user_name : dpb.isc_dpb_sys_user_name,
    isc_spb_sys_user_name_enc : dpb.isc_dpb_sys_user_name_enc,
    isc_spb_password : dpb.isc_dpb_password,
    isc_spb_password_enc : dpb.isc_dpb_password_enc,
    isc_spb_command_line : 105,
    isc_spb_dbname : 106,
    isc_spb_verbose : 107,
    isc_spb_options : 108,
};

/* · Backup Service ·*/
const serviceBackup = {
    isc_spb_bkp_file : 5,
    isc_spb_bkp_factor : 6,
    isc_spb_bkp_length : 7,
    isc_spb_bkp_ignore_checksums : 0x01,
    isc_spb_bkp_ignore_limbo : 0x02,
    isc_spb_bkp_metadata_only : 0x04,
    isc_spb_bkp_no_garbage_collect : 0x08,
    isc_spb_bkp_old_descriptions : 0x10,
    isc_spb_bkp_non_transportable : 0x20,
    isc_spb_bkp_convert : 0x40,
    isc_spb_bkp_expand : 0x80,
    isc_spb_bkp_no_triggers : 0x8000,
    // nbackup
    isc_spb_nbk_level : 5,
    isc_spb_nbk_file : 6,
    isc_spb_nbk_direct : 7,
    isc_spb_nbk_no_triggers : 0x01,
};

/*	Restore Service ·*/
const serviceRestore = {
    isc_spb_res_buffers : 9,
    isc_spb_res_page_size : 10,
    isc_spb_res_length : 11,
    isc_spb_res_access_mode : 12,
    isc_spb_res_fix_fss_data : 13,
    isc_spb_res_fix_fss_metadata : 14,
    isc_spb_res_am_readonly : service.isc_spb_prp_am_readonly,
    isc_spb_res_am_readwrite : service.isc_spb_prp_am_readwrite,
    isc_spb_res_deactivate_idx : 0x0100,
    isc_spb_res_no_shadow : 0x0200,
    isc_spb_res_no_validity : 0x0400,
    isc_spb_res_one_at_a_time : 0x0800,
    isc_spb_res_replace : 0x1000,
    isc_spb_res_create : 0x2000,
    isc_spb_res_use_all_space : 0x4000,
};

/* · Repair Service ·*/
const serviceRepair = {
    isc_spb_rpr_commit_trans : 15,
    isc_spb_rpr_rollback_trans : 34,
    isc_spb_rpr_recover_two_phase : 17,
    isc_spb_tra_id : 18,
    isc_spb_single_tra_id : 19,
    isc_spb_multi_tra_id : 20,
    isc_spb_tra_state : 21,
    isc_spb_tra_state_limbo : 22,
    isc_spb_tra_state_commit : 23,
    isc_spb_tra_state_rollback : 24,
    isc_spb_tra_state_unknown : 25,
    isc_spb_tra_host_site : 26,
    isc_spb_tra_remote_site : 27,
    isc_spb_tra_db_path : 28,
    isc_spb_tra_advise : 29,
    isc_spb_tra_advise_commit : 30,
    isc_spb_tra_advise_rollback : 31,
    isc_spb_tra_advise_unknown : 33,
    isc_spb_rpr_validate_db : 0x01,
    isc_spb_rpr_sweep_db : 0x02,
    isc_spb_rpr_mend_db : 0x04,
    isc_spb_rpr_list_limbo_trans : 0x08,
    isc_spb_rpr_check_db : 0x10,
    isc_spb_rpr_ignore_checksum : 0x20,
    isc_spb_rpr_kill_shadows : 0x40,
    isc_spb_rpr_full : 0x80,
    isc_spb_rpr_icu : 0x0800,
};

/* · Security Service ·*/
const serviceSecurity = {
    isc_spb_sec_userid : 5,
    isc_spb_sec_groupid : 6,
    isc_spb_sec_username : 7,
    isc_spb_sec_password : 8,
    isc_spb_sec_groupname : 9,
    isc_spb_sec_firstname : 10,
    isc_spb_sec_middlename : 11,
    isc_spb_sec_lastname : 12,
    isc_spb_sec_admin : 13,
};

/* License Service */
const serviceLicence = {
    isc_spb_lic_key : 5,
    isc_spb_lic_id : 6,
    isc_spb_lic_desc : 7,
};

/* Statistics Service */
const serviceStatistics = {
    isc_spb_sts_data_pages : 0x01,
    isc_spb_sts_db_log : 0x02,
    isc_spb_sts_hdr_pages : 0x04,
    isc_spb_sts_idx_pages : 0x08,
    isc_spb_sts_sys_relations : 0x10,
    isc_spb_sts_record_versions : 0x20,
    isc_spb_sts_table : 0x40,
    isc_spb_sts_nocreation : 0x80,
};

/* Trace Service */
const serviceTrace = {
    isc_spb_trc_id : 1,
    isc_spb_trc_name : 2,
    isc_spb_trc_cfg : 3,
};

module.exports = Object.freeze({
    ...acceptType,
    ...authPlugin,
    ...authOptions,
    ...blr,
    ...blobType,
    ...buffer,
    ...cnct,
    ...common,
    ...connect,
    ...defaultOptions,
    DESCRIBE,
    ...dpb,
    ...dsql,
    ...int,
    ...iscAction,
    ...iscError,
    ...op,
    ...protocol,
    ...service,
    ...serviceBackup,
    ...serviceInfo,
    ...serviceLicence,
    ...serviceRestore,
    ...serviceRepair,
    ...serviceSecurity,
    ...serviceStatistics,
    ...serviceTrace,
    ...sqlInfo,
    ...sqlType,
    ...spb,
    ...statementInfo,
    SUPPORTED_PROTOCOL,
    ...tpb,
    ...transactionIsolation,
});


/***/ }),

/***/ 56240:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const Const= __webpack_require__(52750);

/***************************************
 *
 *   SQLVar
 *
 ***************************************/

const
    ScaleDivisor = [1,10,100,1000,10000,100000,1000000,10000000,100000000,1000000000,10000000000, 100000000000,1000000000000,10000000000000,100000000000000,1000000000000000];
const
    DateOffset = 40587,
    TimeCoeff = 86400000,
    MsPerMinute = 60000;

//------------------------------------------------------

function SQLVarText() {}

SQLVarText.prototype.decode = function(data, lowerV13) {
    let ret;
    if (this.subType > 1) {
        // ToDo: with column charset
        ret = data.readText(this.length, Const.DEFAULT_ENCODING);
    } else if (this.subType === 0) {
        // without charset definition
        ret = data.readText(this.length, Const.DEFAULT_ENCODING);
    } else {
        ret = data.readBuffer(this.length);
    }

    if (!lowerV13 || !data.readInt()) {
        return ret;
    }

    return null;
};

SQLVarText.prototype.calcBlr = function(blr) {
    blr.addByte(Const.blr_text);
    blr.addWord(this.length);
};

//------------------------------------------------------

function SQLVarNull() {}
SQLVarNull.prototype = new SQLVarText();
SQLVarNull.prototype.constructor = SQLVarNull;

//------------------------------------------------------

function SQLVarString() {}

SQLVarString.prototype.decode = function(data, lowerV13) {
    let ret;
    if (this.subType > 1) {
        // ToDo: with column charset
        ret = data.readString(Const.DEFAULT_ENCODING);
    } else if (this.subType === 0) {
        // without charset definition
        ret = data.readString(Const.DEFAULT_ENCODING);
    } else {
        ret = data.readBuffer();
    }

    if (!lowerV13 || !data.readInt()) {
        return ret;
    }

    return null;
};

SQLVarString.prototype.calcBlr = function(blr) {
    blr.addByte(Const.blr_varying);
    blr.addWord(this.length);
};

//------------------------------------------------------

function SQLVarQuad() {}

SQLVarQuad.prototype.decode = function(data, lowerV13) {
    var ret = data.readQuad();

    if (!lowerV13 || !data.readInt()) {
        return ret;
    }
    return null;
};

SQLVarQuad.prototype.calcBlr = function(blr) {
    blr.addByte(Const.blr_quad);
    blr.addShort(this.scale);
};

//------------------------------------------------------

function SQLVarBlob() {}
SQLVarBlob.prototype = new SQLVarQuad();
SQLVarBlob.prototype.constructor = SQLVarBlob;

SQLVarBlob.prototype.calcBlr = function(blr) {
    blr.addByte(Const.blr_quad);
    blr.addShort(0);
};

//------------------------------------------------------

function SQLVarArray() {}
SQLVarArray.prototype = new SQLVarQuad();
SQLVarArray.prototype.constructor = SQLVarArray;

SQLVarArray.prototype.calcBlr = function(blr) {
    blr.addByte(Const.blr_quad);
    blr.addShort(0);
};

//------------------------------------------------------

function SQLVarInt() {}

SQLVarInt.prototype.decode = function(data, lowerV13) {
    var ret = data.readInt();

    if (this.scale) {
        ret = ret / ScaleDivisor[Math.abs(this.scale)];
    }

    if (!lowerV13 || !data.readInt()) {
        return ret;
    }

    return null;
};

SQLVarInt.prototype.calcBlr = function(blr) {
    blr.addByte(Const.blr_long);
    blr.addShort(this.scale);
};

//------------------------------------------------------

function SQLVarShort() {}
SQLVarShort.prototype = new SQLVarInt();
SQLVarShort.prototype.constructor = SQLVarShort;

SQLVarShort.prototype.calcBlr = function(blr) {
    blr.addByte(Const.blr_short);
    blr.addShort(this.scale);
};

//------------------------------------------------------

function SQLVarInt64() {}

SQLVarInt64.prototype.decode = function(data, lowerV13) {
    var ret = data.readInt64();

    if (this.scale) {
        ret = ret / ScaleDivisor[Math.abs(this.scale)];
    }

    if (!lowerV13 || !data.readInt()) {
        return ret;
    }
    return null;
};

SQLVarInt64.prototype.calcBlr = function(blr) {
    blr.addByte(Const.blr_int64);
    blr.addShort(this.scale);
};

//------------------------------------------------------

function SQLVarInt128() {}

SQLVarInt128.prototype.decode = function (data, lowerV13) {
    var retBigInt = BigInt(data.readInt128())

    if (retBigInt > BigInt(Number.MAX_SAFE_INTEGER)) {
        var ret = retBigInt.toString();

        var integerPart = ret.slice(0, Math.abs(this.scale) * -1)
        var decimalPart = ret.slice(Math.abs(this.scale) * -1)

        if (integerPart === '') integerPart = '0'

        ret = `${integerPart}.${decimalPart}`
    } else {
        var ret = Number(retBigInt);
        ret = ret / ScaleDivisor[Math.abs(this.scale)];
    }

    if (!lowerV13 || !data.readInt()) {
        return ret;
    }

    return null;
};

SQLVarInt128.prototype.calcBlr = function (blr) {
    blr.addByte(Const.blr_int128);
    blr.addShort(this.scale);
};

//------------------------------------------------------

function SQLVarFloat() { }

SQLVarFloat.prototype.decode = function(data, lowerV13) {
    var ret = data.readFloat();

    if (!lowerV13 || !data.readInt()) {
        return ret;
    }

    return null;
};

SQLVarFloat.prototype.calcBlr = function(blr) {
    blr.addByte(Const.blr_float);
};

//------------------------------------------------------

function SQLVarDouble() {}

SQLVarDouble.prototype.decode = function(data, lowerV13) {
    var ret = data.readDouble();

    if (!lowerV13 || !data.readInt()) {
        return ret;
    }

    return null;
};

SQLVarDouble.prototype.calcBlr = function(blr) {
    blr.addByte(Const.blr_double);
};

//------------------------------------------------------

function SQLVarDate() {}

SQLVarDate.prototype.decode = function(data, lowerV13) {
    var ret = data.readInt();

    if (!lowerV13 || !data.readInt()) {
        var d = new Date(0);
        d.setMilliseconds((ret - DateOffset) * TimeCoeff + d.getTimezoneOffset() * MsPerMinute);
        return d;
    }

    return null;
};

SQLVarDate.prototype.calcBlr = function(blr) {
    blr.addByte(Const.blr_sql_date);
};

//------------------------------------------------------

function SQLVarTime() {}

SQLVarTime.prototype.decode = function(data, lowerV13) {
    var ret = data.readUInt();

    if (!lowerV13 || !data.readInt()) {
        var d = new Date(0);
        d.setMilliseconds(Math.floor(ret / 10) + d.getTimezoneOffset() * MsPerMinute);
        return d;
    }
    return null;
};

SQLVarTime.prototype.calcBlr = function(blr) {
    blr.addByte(Const.blr_sql_time);
};

//------------------------------------------------------

function SQLVarTimeStamp() {}

SQLVarTimeStamp.prototype.decode = function(data, lowerV13) {
    var date = data.readInt();
    var time = data.readUInt();

    if (!lowerV13 || !data.readInt()) {
        var d = new Date(0);
        d.setMilliseconds((date - DateOffset) * TimeCoeff + Math.floor(time / 10) + d.getTimezoneOffset() * MsPerMinute);
        return d;
    }

    return null;
};

SQLVarTimeStamp.prototype.calcBlr = function(blr) {
    blr.addByte(Const.blr_timestamp);
};

//------------------------------------------------------

function SQLVarBoolean() {}

SQLVarBoolean.prototype.decode = function(data, lowerV13) {
    var ret = data.readInt();

    if (!lowerV13 || !data.readInt()) {
        return Boolean(ret);
    }
    return null;
};

SQLVarBoolean.prototype.calcBlr = function(blr) {
    blr.addByte(Const.blr_bool);
};

//------------------------------------------------------

function SQLParamInt(value){
    this.value = value;
}

SQLParamInt.prototype.calcBlr = function(blr) {
    blr.addByte(Const.blr_long);
    blr.addShort(0);
};

SQLParamInt.prototype.encode = function(data) {
    if (this.value != null) {
        data.addInt(this.value);
    } else {
        data.addInt(0);
        data.addInt(1);
    }
};

//------------------------------------------------------

function SQLParamInt64(value){
    this.value = value;
}

SQLParamInt64.prototype.calcBlr = function(blr) {
    blr.addByte(Const.blr_int64);
    blr.addShort(0);
};

SQLParamInt64.prototype.encode = function(data) {
    if (this.value != null) {
        data.addInt64(this.value);
    } else {
        data.addInt64(0);
        data.addInt(1);
    }
};

//------------------------------------------------------

function SQLParamInt128(value) {
    this.value = value;
}

SQLParamInt128.prototype.calcBlr = function (blr) {
    blr.addByte(Const.blr_int128);
    blr.addShort(0);
};

SQLParamInt128.prototype.encode = function (data) {
    if (this.value != null) {
        data.addInt128(this.value);
    } else {
        data.addInt128(0);
        data.addInt(1);
    }
};

//------------------------------------------------------

function SQLParamDouble(value) {
    this.value = value;
}

SQLParamDouble.prototype.encode = function(data) {
    if (this.value != null) {
        data.addDouble(this.value);
    } else {
        data.addDouble(0);
        data.addInt(1);
    }
};

SQLParamDouble.prototype.calcBlr = function(blr) {
    blr.addByte(Const.blr_double);
};

//------------------------------------------------------

function SQLParamString(value) {
    this.value = value;
}

SQLParamString.prototype.encode = function(data) {
    if (this.value != null) {
        data.addText(this.value, Const.DEFAULT_ENCODING);
    } else {
        data.addInt(1);
    }
};

SQLParamString.prototype.calcBlr = function(blr) {
    blr.addByte(Const.blr_text);
    var len = this.value ? Buffer.byteLength(this.value, Const.DEFAULT_ENCODING) : 0;
    blr.addWord(len);
};

//------------------------------------------------------

function SQLParamQuad(value) {
    this.value = value;
}

SQLParamQuad.prototype.encode = function(data) {
    if (this.value != null) {
        data.addInt(this.value.high);
        data.addInt(this.value.low);
    } else {
        data.addInt(0);
        data.addInt(0);
        data.addInt(1);
    }
};

SQLParamQuad.prototype.calcBlr = function(blr) {
    blr.addByte(Const.blr_quad);
    blr.addShort(0);
};

//------------------------------------------------------

function SQLParamDate(value) {
    this.value = value;
}

SQLParamDate.prototype.encode = function(data) {
    if (this.value != null) {

        var value = this.value.getTime() - this.value.getTimezoneOffset() * MsPerMinute;
        var time = value % TimeCoeff;
        var date = (value - time) / TimeCoeff + DateOffset;
        time *= 10;

        // check overflow
        if (time < 0) {
            date--;
            time = TimeCoeff*10 + time;
        }

        data.addInt(date);
        data.addUInt(time);
    } else {
        data.addInt(0);
        data.addUInt(0);
        data.addInt(1);
    }
};

SQLParamDate.prototype.calcBlr = function(blr) {
    blr.addByte(Const.blr_timestamp);
};

//------------------------------------------------------

function SQLParamBool(value) {
    this.value = value;
}

SQLParamBool.prototype.encode = function(data) {
    if (this.value != null) {
        data.addInt(this.value ? 1 : 0);
    } else {
        data.addInt(0);
        data.addInt(1);
    }
};

SQLParamBool.prototype.calcBlr = function(blr) {
    blr.addByte(Const.blr_short);
    blr.addShort(0);
};

module.exports = {
    SQLVarArray,
    SQLVarDate,
    SQLVarBlob,
    SQLVarBoolean,
    SQLVarDouble,
    SQLVarInt,
    SQLVarInt64,
    SQLVarInt128,
    SQLVarFloat,
    SQLVarNull,
    SQLVarShort,
    SQLVarString,
    SQLVarText,
    SQLVarTime,
    SQLVarTimeStamp,
    SQLParamBool,
    SQLParamDate,
    SQLParamDouble,
    SQLParamInt,
    SQLParamInt64,
    SQLParamInt128,
    SQLParamQuad,
    SQLParamString,
};


/***/ }),

/***/ 56908:
/***/ ((module) => {

/*
Licensed to the Apache Software Foundation (ASF) under one or more
contributor license agreements.  See the NOTICE file distributed with
this work for additional information regarding copyright ownership.
The ASF licenses this file to You under the Apache License, Version 2.0
(the "License"); you may not use this file except in compliance with
the License.  You may obtain a copy of the License at

     http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

This code was originally made available in the Apache Codec API.

    http://commons.apache.org/proper/commons-codec/

*/

var CON_SALT = [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 5, 6,
    7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33,
    34, 35, 36, 37, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53,
    54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 0, 0, 0, 0, 0
];

var COV2CHAR = [ 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 65, 66, 67, 68, 69, 70,
    71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 97, 98, 99, 100, 101, 102,
    103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122
];

var SHIFT2 = [ false, false, true, true, true, true, true, true, false, true, true, true, true, true, true, false ];

var SKB = [
        [ 0, 16, 0x20000000, 0x20000010, 0x10000, 0x10010, 0x20010000, 0x20010010, 2048, 2064, 0x20000800,
                0x20000810, 0x10800, 0x10810, 0x20010800, 0x20010810, 32, 48, 0x20000020, 0x20000030, 0x10020,
                0x10030, 0x20010020, 0x20010030, 2080, 2096, 0x20000820, 0x20000830, 0x10820, 0x10830, 0x20010820,
                0x20010830, 0x80000, 0x80010, 0x20080000, 0x20080010, 0x90000, 0x90010, 0x20090000, 0x20090010,
                0x80800, 0x80810, 0x20080800, 0x20080810, 0x90800, 0x90810, 0x20090800, 0x20090810, 0x80020,
                0x80030, 0x20080020, 0x20080030, 0x90020, 0x90030, 0x20090020, 0x20090030, 0x80820, 0x80830,
                0x20080820, 0x20080830, 0x90820, 0x90830, 0x20090820, 0x20090830 ],
        [ 0, 0x2000000, 8192, 0x2002000, 0x200000, 0x2200000, 0x202000, 0x2202000, 4, 0x2000004, 8196, 0x2002004,
            0x200004, 0x2200004, 0x202004, 0x2202004, 1024, 0x2000400, 9216, 0x2002400, 0x200400, 0x2200400,
            0x202400, 0x2202400, 1028, 0x2000404, 9220, 0x2002404, 0x200404, 0x2200404, 0x202404, 0x2202404,
            0x10000000, 0x12000000, 0x10002000, 0x12002000, 0x10200000, 0x12200000, 0x10202000, 0x12202000,
            0x10000004, 0x12000004, 0x10002004, 0x12002004, 0x10200004, 0x12200004, 0x10202004, 0x12202004,
            0x10000400, 0x12000400, 0x10002400, 0x12002400, 0x10200400, 0x12200400, 0x10202400, 0x12202400,
            0x10000404, 0x12000404, 0x10002404, 0x12002404, 0x10200404, 0x12200404, 0x10202404, 0x12202404 ],
        [ 0, 1, 0x40000, 0x40001, 0x1000000, 0x1000001, 0x1040000, 0x1040001, 2, 3, 0x40002, 0x40003, 0x1000002,
                0x1000003, 0x1040002, 0x1040003, 512, 513, 0x40200, 0x40201, 0x1000200, 0x1000201, 0x1040200,
                0x1040201, 514, 515, 0x40202, 0x40203, 0x1000202, 0x1000203, 0x1040202, 0x1040203, 0x8000000,
                0x8000001, 0x8040000, 0x8040001, 0x9000000, 0x9000001, 0x9040000, 0x9040001, 0x8000002, 0x8000003,
                0x8040002, 0x8040003, 0x9000002, 0x9000003, 0x9040002, 0x9040003, 0x8000200, 0x8000201, 0x8040200,
                0x8040201, 0x9000200, 0x9000201, 0x9040200, 0x9040201, 0x8000202, 0x8000203, 0x8040202, 0x8040203,
                0x9000202, 0x9000203, 0x9040202, 0x9040203 ],
        [ 0, 0x100000, 256, 0x100100, 8, 0x100008, 264, 0x100108, 4096, 0x101000, 4352, 0x101100, 4104, 0x101008,
            4360, 0x101108, 0x4000000, 0x4100000, 0x4000100, 0x4100100, 0x4000008, 0x4100008, 0x4000108,
            0x4100108, 0x4001000, 0x4101000, 0x4001100, 0x4101100, 0x4001008, 0x4101008, 0x4001108, 0x4101108,
            0x20000, 0x120000, 0x20100, 0x120100, 0x20008, 0x120008, 0x20108, 0x120108, 0x21000, 0x121000,
            0x21100, 0x121100, 0x21008, 0x121008, 0x21108, 0x121108, 0x4020000, 0x4120000, 0x4020100,
            0x4120100, 0x4020008, 0x4120008, 0x4020108, 0x4120108, 0x4021000, 0x4121000, 0x4021100, 0x4121100,
            0x4021008, 0x4121008, 0x4021108, 0x4121108 ],
        [ 0, 0x10000000, 0x10000, 0x10010000, 4, 0x10000004, 0x10004, 0x10010004, 0x20000000, 0x30000000,
                0x20010000, 0x30010000, 0x20000004, 0x30000004, 0x20010004, 0x30010004, 0x100000, 0x10100000,
                0x110000, 0x10110000, 0x100004, 0x10100004, 0x110004, 0x10110004, 0x20100000, 0x30100000,
                0x20110000, 0x30110000, 0x20100004, 0x30100004, 0x20110004, 0x30110004, 4096, 0x10001000, 0x11000,
                0x10011000, 4100, 0x10001004, 0x11004, 0x10011004, 0x20001000, 0x30001000, 0x20011000, 0x30011000,
                0x20001004, 0x30001004, 0x20011004, 0x30011004, 0x101000, 0x10101000, 0x111000, 0x10111000,
                0x101004, 0x10101004, 0x111004, 0x10111004, 0x20101000, 0x30101000, 0x20111000, 0x30111000,
                0x20101004, 0x30101004, 0x20111004, 0x30111004 ],
        [ 0, 0x8000000, 8, 0x8000008, 1024, 0x8000400, 1032, 0x8000408, 0x20000, 0x8020000, 0x20008, 0x8020008,
            0x20400, 0x8020400, 0x20408, 0x8020408, 1, 0x8000001, 9, 0x8000009, 1025, 0x8000401, 1033,
            0x8000409, 0x20001, 0x8020001, 0x20009, 0x8020009, 0x20401, 0x8020401, 0x20409, 0x8020409,
            0x2000000, 0xa000000, 0x2000008, 0xa000008, 0x2000400, 0xa000400, 0x2000408, 0xa000408, 0x2020000,
            0xa020000, 0x2020008, 0xa020008, 0x2020400, 0xa020400, 0x2020408, 0xa020408, 0x2000001, 0xa000001,
            0x2000009, 0xa000009, 0x2000401, 0xa000401, 0x2000409, 0xa000409, 0x2020001, 0xa020001, 0x2020009,
            0xa020009, 0x2020401, 0xa020401, 0x2020409, 0xa020409 ],
        [ 0, 256, 0x80000, 0x80100, 0x1000000, 0x1000100, 0x1080000, 0x1080100, 16, 272, 0x80010, 0x80110,
                0x1000010, 0x1000110, 0x1080010, 0x1080110, 0x200000, 0x200100, 0x280000, 0x280100, 0x1200000,
                0x1200100, 0x1280000, 0x1280100, 0x200010, 0x200110, 0x280010, 0x280110, 0x1200010, 0x1200110,
                0x1280010, 0x1280110, 512, 768, 0x80200, 0x80300, 0x1000200, 0x1000300, 0x1080200, 0x1080300, 528,
                784, 0x80210, 0x80310, 0x1000210, 0x1000310, 0x1080210, 0x1080310, 0x200200, 0x200300, 0x280200,
                0x280300, 0x1200200, 0x1200300, 0x1280200, 0x1280300, 0x200210, 0x200310, 0x280210, 0x280310,
                0x1200210, 0x1200310, 0x1280210, 0x1280310 ],
        [ 0, 0x4000000, 0x40000, 0x4040000, 2, 0x4000002, 0x40002, 0x4040002, 8192, 0x4002000, 0x42000, 0x4042000,
            8194, 0x4002002, 0x42002, 0x4042002, 32, 0x4000020, 0x40020, 0x4040020, 34, 0x4000022, 0x40022,
            0x4040022, 8224, 0x4002020, 0x42020, 0x4042020, 8226, 0x4002022, 0x42022, 0x4042022, 2048,
            0x4000800, 0x40800, 0x4040800, 2050, 0x4000802, 0x40802, 0x4040802, 10240, 0x4002800, 0x42800,
            0x4042800, 10242, 0x4002802, 0x42802, 0x4042802, 2080, 0x4000820, 0x40820, 0x4040820, 2082,
            0x4000822, 0x40822, 0x4040822, 10272, 0x4002820, 0x42820, 0x4042820, 10274, 0x4002822, 0x42822,
            0x4042822 ]
];

var SPTRANS=
[
        [ 0x820200, 0x20000, 0x80800000, 0x80820200, 0x800000, 0x80020200, 0x80020000, 0x80800000, 0x80020200,
                0x820200, 0x820000, 0x80000200, 0x80800200, 0x800000, 0, 0x80020000, 0x20000, 0x80000000,
                0x800200, 0x20200, 0x80820200, 0x820000, 0x80000200, 0x800200, 0x80000000, 512, 0x20200,
                0x80820000, 512, 0x80800200, 0x80820000, 0, 0, 0x80820200, 0x800200, 0x80020000, 0x820200,
                0x20000, 0x80000200, 0x800200, 0x80820000, 512, 0x20200, 0x80800000, 0x80020200, 0x80000000,
                0x80800000, 0x820000, 0x80820200, 0x20200, 0x820000, 0x80800200, 0x800000, 0x80000200, 0x80020000,
                0, 0x20000, 0x800000, 0x80800200, 0x820200, 0x80000000, 0x80820000, 512, 0x80020200 ],
        [ 0x10042004, 0, 0x42000, 0x10040000, 0x10000004, 8196, 0x10002000, 0x42000, 8192, 0x10040004, 4,
            0x10002000, 0x40004, 0x10042000, 0x10040000, 4, 0x40000, 0x10002004, 0x10040004, 8192, 0x42004,
            0x10000000, 0, 0x40004, 0x10002004, 0x42004, 0x10042000, 0x10000004, 0x10000000, 0x40000, 8196,
            0x10042004, 0x40004, 0x10042000, 0x10002000, 0x42004, 0x10042004, 0x40004, 0x10000004, 0,
            0x10000000, 8196, 0x40000, 0x10040004, 8192, 0x10000000, 0x42004, 0x10002004, 0x10042000, 8192, 0,
            0x10000004, 4, 0x10042004, 0x42000, 0x10040000, 0x10040004, 0x40000, 8196, 0x10002000, 0x10002004,
            4, 0x10040000, 0x42000 ],
        [ 0x41000000, 0x1010040, 64, 0x41000040, 0x40010000, 0x1000000, 0x41000040, 0x10040, 0x1000040, 0x10000,
                0x1010000, 0x40000000, 0x41010040, 0x40000040, 0x40000000, 0x41010000, 0, 0x40010000, 0x1010040,
                64, 0x40000040, 0x41010040, 0x10000, 0x41000000, 0x41010000, 0x1000040, 0x40010040, 0x1010000,
                0x10040, 0, 0x1000000, 0x40010040, 0x1010040, 64, 0x40000000, 0x10000, 0x40000040, 0x40010000,
                0x1010000, 0x41000040, 0, 0x1010040, 0x10040, 0x41010000, 0x40010000, 0x1000000, 0x41010040,
                0x40000000, 0x40010040, 0x41000000, 0x1000000, 0x41010040, 0x10000, 0x1000040, 0x41000040,
                0x10040, 0x1000040, 0, 0x41010000, 0x40000040, 0x41000000, 0x40010040, 64, 0x1010000 ],
        [ 0x100402, 0x4000400, 2, 0x4100402, 0, 0x4100000, 0x4000402, 0x100002, 0x4100400, 0x4000002, 0x4000000,
            1026, 0x4000002, 0x100402, 0x100000, 0x4000000, 0x4100002, 0x100400, 1024, 2, 0x100400, 0x4000402,
            0x4100000, 1024, 1026, 0, 0x100002, 0x4100400, 0x4000400, 0x4100002, 0x4100402, 0x100000,
            0x4100002, 1026, 0x100000, 0x4000002, 0x100400, 0x4000400, 2, 0x4100000, 0x4000402, 0, 1024,
            0x100002, 0, 0x4100002, 0x4100400, 1024, 0x4000000, 0x4100402, 0x100402, 0x100000, 0x4100402, 2,
            0x4000400, 0x100402, 0x100002, 0x100400, 0x4100000, 0x4000402, 1026, 0x4000000, 0x4000002,
            0x4100400 ],
        [ 0x2000000, 16384, 256, 0x2004108, 0x2004008, 0x2000100, 16648, 0x2004000, 16384, 8, 0x2000008, 16640,
                0x2000108, 0x2004008, 0x2004100, 0, 16640, 0x2000000, 16392, 264, 0x2000100, 16648, 0, 0x2000008,
                8, 0x2000108, 0x2004108, 16392, 0x2004000, 256, 264, 0x2004100, 0x2004100, 0x2000108, 16392,
                0x2004000, 16384, 8, 0x2000008, 0x2000100, 0x2000000, 16640, 0x2004108, 0, 16648, 0x2000000, 256,
                16392, 0x2000108, 256, 0, 0x2004108, 0x2004008, 0x2004100, 264, 16384, 16640, 0x2004008,
                0x2000100, 264, 8, 16648, 0x2004000, 0x2000008 ],
        [ 0x20000010, 0x80010, 0, 0x20080800, 0x80010, 2048, 0x20000810, 0x80000, 2064, 0x20080810, 0x80800,
            0x20000000, 0x20000800, 0x20000010, 0x20080000, 0x80810, 0x80000, 0x20000810, 0x20080010, 0, 2048,
            16, 0x20080800, 0x20080010, 0x20080810, 0x20080000, 0x20000000, 2064, 16, 0x80800, 0x80810,
            0x20000800, 2064, 0x20000000, 0x20000800, 0x80810, 0x20080800, 0x80010, 0, 0x20000800, 0x20000000,
            2048, 0x20080010, 0x80000, 0x80010, 0x20080810, 0x80800, 16, 0x20080810, 0x80800, 0x80000,
            0x20000810, 0x20000010, 0x20080000, 0x80810, 0, 2048, 0x20000010, 0x20000810, 0x20080800,
            0x20080000, 2064, 16, 0x20080010 ],
        [ 4096, 128, 0x400080, 0x400001, 0x401081, 4097, 4224, 0, 0x400000, 0x400081, 129, 0x401000, 1, 0x401080,
                0x401000, 129, 0x400081, 4096, 4097, 0x401081, 0, 0x400080, 0x400001, 4224, 0x401001, 4225,
                0x401080, 1, 4225, 0x401001, 128, 0x400000, 4225, 0x401000, 0x401001, 129, 4096, 128, 0x400000,
                0x401001, 0x400081, 4225, 4224, 0, 128, 0x400001, 1, 0x400080, 0, 0x400081, 0x400080, 4224, 129,
                4096, 0x401081, 0x400000, 0x401080, 1, 4097, 0x401081, 0x400001, 0x401080, 0x401000, 4097 ],
        [ 0x8200020, 0x8208000, 32800, 0, 0x8008000, 0x200020, 0x8200000, 0x8208020, 32, 0x8000000, 0x208000,
            32800, 0x208020, 0x8008020, 0x8000020, 0x8200000, 32768, 0x208020, 0x200020, 0x8008000, 0x8208020,
            0x8000020, 0, 0x208000, 0x8000000, 0x200000, 0x8008020, 0x8200020, 0x200000, 32768, 0x8208000, 32,
            0x200000, 32768, 0x8000020, 0x8208020, 32800, 0x8000000, 0, 0x208000, 0x8200020, 0x8008020,
            0x8008000, 0x200020, 0x8208000, 32, 0x200020, 0x8008000, 0x8208020, 0x200000, 0x8200000,
            0x8000020, 0x208000, 32800, 0x8008020, 0x8200000, 32, 0x8208000, 0x208020, 0, 0x8000000,
            0x8200020, 32768, 0x208020 ]
];

function hPermOp(a, n, m) {
    var t = (a << 16 - n ^ a) & m;
    a = a ^ t ^ t >>> 16 - n;
    return a;
}

function intToFourBytes(iValue, b, offset) {
    b[offset++] = iValue & 0xff;
    b[offset++] = iValue >>> 8 & 0xff;
    b[offset++] = iValue >>> 16 & 0xff;
    b[offset++] = iValue >>> 24 & 0xff;
}

function byteToUnsigned(b) {
    var value = b;
    return value < 0 ? value + 256 : value;
}

function fourBytesToInt(b, offset) {
    var value = byteToUnsigned(b[offset++]);
    value |= byteToUnsigned(b[offset++]) << 8;
    value |= byteToUnsigned(b[offset++]) << 16;
    value |= byteToUnsigned(b[offset++]) << 24;
    return value;
}

function permOp(a, b, n, m, results) {
    var t = (a >>> n ^ b) & m;
    a ^= t << n;
    b ^= t;
    results[0] = a;
    results[1] = b;
}

function desSetKey(key) {
    var schedule = [];
    var c = fourBytesToInt(key, 0);
    var d = fourBytesToInt(key, 4);
    var results = [0, 0];
    permOp(d, c, 4, 0xf0f0f0f, results);
    d = results[0];
    c = results[1];
    c = hPermOp(c, -2, 0xcccc0000);
    d = hPermOp(d, -2, 0xcccc0000);
    permOp(d, c, 1, 0x55555555, results);
    d = results[0];
    c = results[1];
    permOp(c, d, 8, 0xff00ff, results);
    c = results[0];
    d = results[1];
    permOp(d, c, 1, 0x55555555, results);
    d = results[0];
    c = results[1];
    d = (d & 0xff) << 16 | d & 0xff00 | (d & 0xff0000) >>> 16 | (c & 0xf0000000) >>> 4;
    c &= 0xfffffff;
    var j = 0;
    for (var i = 0; i < 16; i++) {
        if (SHIFT2[i]) {
            c = c >>> 2 | c << 26;
            d = d >>> 2 | d << 26;
        } else {
            c = c >>> 1 | c << 27;
            d = d >>> 1 | d << 27;
        }
        c &= 0xfffffff;
        d &= 0xfffffff;
        var s = SKB[0][c & 0x3f] | SKB[1][c >>> 6 & 0x3 | c >>> 7 & 0x3c] |
            SKB[2][c >>> 13 & 0xf | c >>> 14 & 0x30] |
            SKB[3][c >>> 20 & 0x1 | c >>> 21 & 0x6 | c >>> 22 & 0x38];
        var t = SKB[4][d & 0x3f] | SKB[5][d >>> 7 & 0x3 | d >>> 8 & 0x3c] | SKB[6][d >>> 15 & 0x3f] |
            SKB[7][d >>> 21 & 0xf | d >>> 22 & 0x30];
        schedule[j++] = (t << 16 | s & 0xffff);
        s = s >>> 16 | t & 0xffff0000;
        s = s << 4 | s >>> 28;
        schedule[j++] = s;
    }

    return schedule;
}

function dEncrypt(el, r, s, e0, e1, sArr) {
    var v = r ^ r >>> 16;
    var u = v & e0;
    v &= e1;
    u = u ^ u << 16 ^ r ^ sArr[s];
    var t = v ^ v << 16 ^ r ^ sArr[s + 1];
    t = t >>> 4 | t << 28;
    el ^= SPTRANS[1][t & 0x3f] | SPTRANS[3][t >>> 8 & 0x3f] | SPTRANS[5][t >>> 16 & 0x3f] |
            SPTRANS[7][t >>> 24 & 0x3f] | SPTRANS[0][u & 0x3f] | SPTRANS[2][u >>> 8 & 0x3f] |
            SPTRANS[4][u >>> 16 & 0x3f] | SPTRANS[6][u >>> 24 & 0x3f];
    return el;
}

function body(schedule, eSwap0, eSwap1) {
    var left = 0;
    var right = 0;
    var t = 0;
    for (var j = 0; j < 25; j++) {
        for (var i = 0; i < 32; i += 4) {
            left = dEncrypt(left, right, i, eSwap0, eSwap1, schedule);
            right = dEncrypt(right, left, i + 2, eSwap0, eSwap1, schedule);
        }

        t = left;
        left = right;
        right = t;
    }

    t = right;
    right = left >>> 1 | left << 31;
    left = t >>> 1 | t << 31;
    var results = [0, 0];
    permOp(right, left, 1, 0x55555555, results);
    right = results[0];
    left = results[1];
    permOp(left, right, 8, 0xff00ff, results);
    left = results[0];
    right = results[1];
    permOp(right, left, 2, 0x33333333, results);
    right = results[0];
    left = results[1];
    permOp(left, right, 16, 65535, results);
    left = results[0];
    right = results[1];
    permOp(right, left, 4, 0xf0f0f0f, results);
    right = results[0];
    left = results[1];
    var out = [0, 0];
    out[0] = left;
    out[1] = right;
    return out;
}

function crypt(original, salt) {
    if (!(original instanceof Buffer)) {
        original = Buffer.from(original);
    }

    if (!salt) {
        throw new Error("Invalid salt value: " + salt);
    }

    var buffer = Buffer.alloc(13);
    var charZero = salt[0].charCodeAt();
    var charOne = salt[1].charCodeAt();
    buffer[0] = charZero;
    buffer[1] = charOne;
    var eSwap0 = CON_SALT[charZero];
    var eSwap1 = CON_SALT[charOne] << 4;

    var key = Buffer.alloc(8);
    for (var i = 0; i < key.length && i < original.length; i++) {
        var iChar = original[i];
        key[i] = iChar << 1;
    }

    var schedule = desSetKey(key);
    var out = body(schedule, eSwap0, eSwap1);
    var b = Buffer.alloc(9);
    intToFourBytes(out[0], b, 0);
    intToFourBytes(out[1], b, 4);

    b[8] = 0;
    var i = 2;
    var y = 0;
    var u = 128;
    for (; i < 13; i++) {
        var j = 0;
        var c = 0;
        for (; j < 6; j++) {
            c <<= 1;
            if ((b[y] & u) != 0) {
                c |= 0x1;
            }
            u >>>= 1;
            if (u == 0) {
                y++;
                u = 128;
            }
            buffer[i] = COV2CHAR[c];
        }
    }

    return buffer.toString('ascii');
}

module.exports = {
    crypt : crypt
}


/***/ }),

/***/ 58068:
/***/ ((module) => {

"use strict";


/** @type {import('./syntax')} */
module.exports = SyntaxError;


/***/ }),

/***/ 58611:
/***/ ((module) => {

"use strict";
module.exports = require("http");

/***/ }),

/***/ 58968:
/***/ ((module) => {

"use strict";


/** @type {import('./floor')} */
module.exports = Math.floor;


/***/ }),

/***/ 64039:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var origSymbol = typeof Symbol !== 'undefined' && Symbol;
var hasSymbolSham = __webpack_require__(41333);

/** @type {import('.')} */
module.exports = function hasNativeSymbols() {
	if (typeof origSymbol !== 'function') { return false; }
	if (typeof Symbol !== 'function') { return false; }
	if (typeof origSymbol('foo') !== 'symbol') { return false; }
	if (typeof Symbol('bar') !== 'symbol') { return false; }

	return hasSymbolSham();
};


/***/ }),

/***/ 65692:
/***/ ((module) => {

"use strict";
module.exports = require("https");

/***/ }),

/***/ 66743:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var implementation = __webpack_require__(89353);

module.exports = Function.prototype.bind || implementation;


/***/ }),

/***/ 68002:
/***/ ((module) => {

"use strict";


/** @type {import('./min')} */
module.exports = Math.min;


/***/ }),

/***/ 68910:
/***/ ((module, exports, __webpack_require__) => {

const Events = __webpack_require__(24434);
const stream = __webpack_require__(2203);
const Const = __webpack_require__(52750);
const {BlrReader} = __webpack_require__(49035);
const {doError} = __webpack_require__(30216);

/***************************************
 *
 *   Service Manager
 *
 ***************************************/

const ServiceManager = function(connection) {
    this.connection = connection;
    connection.svc = this;
}

ServiceManager.prototype.__proto__ = Object.create(Events.EventEmitter.prototype, {
    constructor: {
        value: ServiceManager,
        enumberable: false
    }
});

ServiceManager.prototype._createOutputStream = function (optread, buffersize, callback) {
    var self = this;
    optread = optread || 'byline';
    var t = new stream.Readable({ objectMode: optread === 'byline' }); // chunk by line
    t.__proto__._read = function () {
        var selfread = this;
        var fct = optread === 'byline' ? self.readline : self.readeof;
        fct.call(self, { buffersize: buffersize }, function (err, data) {
            if (err) {
                selfread.push(err.message, Const.DEFAULT_ENCODING);
                return;
            }
            if (data.line && data.line.length)
                selfread.push(data.line, Const.DEFAULT_ENCODING);
            else
                selfread.push(null);
        });
    }

    callback(null, t);
}


ServiceManager.prototype._infosmapping = {
    "50"/*isc_info_svc_svr_db_info*/ : "dbinfo",
    "51"/*isc_info_svc_get_license*/ : "licenses",
    "52"/*isc_info_svc_get_license_mask*/ : "licenseoptions",
    "53"/*isc_info_svc_get_config*/ : "fbconfig",
    "54"/*isc_info_svc_version*/ : "svcversion",
    "55"/*isc_info_svc_server_version*/ : "fbversion",
    "56"/*isc_info_svc_implementation*/ : "fbimplementation",
    "57"/*isc_info_svc_capabilities*/ : "fbcapatibilities",
    "58"/*isc_info_svc_user_dbpath*/ : "pathsecuritydb",
    "59"/*isc_info_svc_get_env*/ : "fbenv",
    "60"/*isc_info_svc_get_env_lock*/ : "fbenvlock",
    "61"/*isc_info_svc_get_env_msg*/ : "fbenvmsg",
    "62"/*isc_info_svc_line*/ : "",
    "63"/*isc_info_svc_to_eof*/ : "",
    "64"/*isc_info_svc_timeout*/ : "",
    "65"/*isc_info_svc_get_licensed_users*/ : "",
    "66"/*isc_info_svc_limbo_trans*/ : "limbotrans",
    "67"/*isc_info_svc_running*/ : "",
    "68"/*isc_info_svc_get_users*/ : "fbusers",
    "78"/*isc_info_svc_stdin*/ : ""
};

ServiceManager.prototype._processcapabilities = function (blr, res) {
    var capArray = [
        "WAL_SUPPORT",
        "MULTI_CLIENT_SUPPORT",
        "REMOTE_HOP_SUPPORT",
        "NO_SVR_STATS_SUPPORT",
        "NO_DB_STATS_SUPPORT",
        "LOCAL_ENGINE_SUPPORT",
        "NO_FORCED_WRITE_SUPPORT",
        "NO_SHUTDOWN_SUPPORT",
        "NO_SERVER_SHUTDOWN_SUPPORT",
        "SERVER_CONFIG_SUPPORT",
        "QUOTED_FILENAME_SUPPORT"
    ];
    var dbcapa = res[this._infosmapping[57]] = [];
    var caps = blr.readInt32();

    for (var i = 0; i < capArray.length; ++i)
        if (caps & (1 << i))
            dbcapa.push(capArray[i]);
}

ServiceManager.prototype._processdbinfo = function (blr, res) {
    var tinfo = blr.readByteCode();
    var dbinfo = res[this._infosmapping[50]] = {};

    dbinfo.database = [];
    for (; tinfo != Const.isc_info_flag_end; tinfo = blr.readByteCode()) {
        switch (tinfo) {
            case Const.isc_spb_dbname:
                dbinfo.database.push(blr.readString());
                break;
            case Const.isc_spb_num_att:
                dbinfo.nbattachment = blr.readInt32();
                break;
            case Const.isc_spb_num_db:
                dbinfo.nbdatabase = blr.readInt32();
                break;
        }
    }
}

ServiceManager.prototype._processquery = function (buffer, callback) {
    //console.log(buffer);
    var br = new BlrReader(buffer);
    var tinfo = br.readByteCode();
    var res = {};
    res.result = 0;
    for (; tinfo !== Const.isc_info_end; tinfo = br.readByteCode()) {
        switch (tinfo) {
            case Const.isc_info_svc_server_version:
            case Const.isc_info_svc_implementation:
            case Const.isc_info_svc_user_dbpath:
            case Const.isc_info_svc_get_env:
            case Const.isc_info_svc_get_env_lock:
            case Const.isc_info_svc_get_env_msg:
                res[this._infosmapping[tinfo]] = br.readString();
                break;
            case Const.isc_info_svc_version:
                res[this._infosmapping[tinfo]] = br.readInt32();
                break;
            case Const.isc_info_svc_svr_db_info:
                this._processdbinfo(br, res);
                break;
            case Const.isc_info_svc_limbo_trans:
                // not implemented
                for (; tinfo !== isc_info_flag_end; tinfo = br.readByteCode())
                    break;
            case Const.isc_info_svc_get_users:
                br.pos += 2
                res[this._infosmapping[tinfo]] = [];
                break;
            case Const.isc_spb_sec_username:
                var tuser = res[this._infosmapping[68]];
                tuser.push({});
                tuser[tuser.length - 1].username = br.readString();
                break;
            case Const.isc_spb_sec_firstname:
                var tuser = res[this._infosmapping[68]];
                var user = tuser[tuser.length-1];
                user.firstname = br.readString();
                break;
            case Const.isc_spb_sec_middlename:
                var tuser = res[this._infosmapping[68]];
                var user = tuser[tuser.length-1];
                user.middlename = br.readString();
                break;
            case Const.isc_spb_sec_lastname:
                var tuser = res[this._infosmapping[68]];
                var user = tuser[tuser.length-1];
                user.lastname = br.readString();
                break;
            case Const.isc_spb_sec_groupid:
                var tuser = res[this._infosmapping[68]];
                var user = tuser[tuser.length-1];
                user.groupid = br.readInt32();
                break;
            case Const.isc_spb_sec_userid:
                var tuser = res[this._infosmapping[68]];
                var user = tuser[tuser.length-1];
                user.userid = br.readInt32();

                break;
            case Const.isc_spb_sec_admin:
                var tuser = res[this._infosmapping[68]];
                var user = tuser[tuser.length-1];
                user.admin = br.readInt32();
                break;

            case Const.isc_info_svc_line:
                res.line = br.readString();
                break;

            case Const.isc_info_svc_to_eof:
                res.line = br.readString();
                break;

            case Const.isc_info_truncated:
                res.result = 1; // too much data for the result buffer increase size of it (buffersize parameter))
                break;

            case Const.isc_info_data_not_ready:
                res.result = 2;
                break;

            case Const.isc_info_svc_timeout:
                res.result = 3;
                break;

            case Const.isc_info_svc_stdin:

                break;

            case Const.isc_info_svc_capabilities:
                this._processcapabilities(br, res);
                break;
        }
    }
    callback(null, res);
}

ServiceManager.prototype.detach = function(callback, force) {
    var self = this;

    if (!force && self.connection._pending.length > 0) {
        self.connection._detachAuto = true;
        self.connection._detachCallback = callback;
        return self;
    }

    self.connection.svcdetach(function (err, obj) {

        self.connection.disconnect();
        self.emit('detach', false);

        if (callback)
            callback(err, obj);

    }, force);

    return self;
}

ServiceManager.prototype.backup = function (options, callback) {
    var dbpath = options.database || this.connection.options.filename || this.connection.options.database;
    var verbose = options.verbose || false;
    // format of bckfile {filename:'name', sizefile:''} sizefile is length of part in bytes
    var bckfiles = options.backupfiles || options.files || null;
    // for convenience
    if (bckfiles) bckfiles = bckfiles.constructor !== Array?[{ filename: bckfiles, sizefile: '0' }]:bckfiles;
    var factor = options.factor || 0; //If backing up to a physical tape device, this switch lets you specify the tape's blocking factor
    var ignorechecksums = options.ignorechecksums || false;
    var ignorelimbo = options.ignorelimbo || false;
    var metadataonly = options.metadataonly || false;
    var nogarbagecollect = options.nogarbasecollect || false;
    var olddescriptions = options.olddescriptions || false;
    var nontransportable = options.nontransportable || false;
    var convert = options.convert || false;
    var expand = options.expand || false;
    var notriggers = options.notriggers || false;

    if (dbpath == null || dbpath.length === 0) {
        doError(new Error('No database specified'), callback);
        return;
    }

    if (bckfiles == null || bckfiles.length === 0) {
        doError(new Error('No backup path specified'), callback);
        return;
    }

    var blr = this.connection._blr;
    blr.pos = 0;
    blr.addByte(Const.isc_action_svc_backup);
    blr.addString2(Const.isc_spb_dbname, dbpath, Const.DEFAULT_ENCODING);
    for (var i = 0; i < bckfiles.length; i++) {
        blr.addString2(Const.isc_spb_bkp_file, bckfiles[i].filename, Const.DEFAULT_ENCODING);
        if (i !== bckfiles.length - 1) // not the end, so we need to write the size of this part (gsplit)
            blr.addString2(Const.isc_spb_bkp_length, bckfiles[i].sizefile, Const.DEFAULT_ENCODING);
    }
    if (factor)
        blr.addByteInt32(Const.isc_spb_bkp_factor, factor);

    var opts = 0;
    if (ignorechecksums) opts = opts | Const.isc_spb_bkp_ignore_checksums;
    if (ignorelimbo) opts = opts | Const.isc_spb_bkp_ignore_limbo;
    if (metadataonly) opts = opts | Const.isc_spb_bkp_metadata_only;
    if (nogarbagecollect) opts = opts | Const.isc_spb_bkp_no_garbage_collect;
    if (olddescriptions) opts = opts | Const.isc_spb_bkp_old_descriptions;
    if (nontransportable) opts = opts | Const.isc_spb_bkp_non_transportable;
    if (convert) opts = opts | Const.isc_spb_bkp_convert;
    if (expand) opts = opts | Const.isc_spb_bkp_expand;
    if (notriggers) opts = opts | Const.isc_spb_bkp_no_triggers;
    if (opts)
        blr.addByteInt32(Const.isc_spb_options, opts);
    if (verbose)
        blr.addByte(Const.isc_spb_verbose);
    var self = this;
    this.connection.svcstart(blr, function (err, data) {
        if (err) {
            doError(new Error(err), callback);
            return;
        }
        self._createOutputStream(options.optread, options.buffersize, callback);
    });
}

ServiceManager.prototype.nbackup = function (options, callback) {
    var dbpath = options.database || this.connection.options.filename || this.connection.options.database;
    var bckfile = options.backupfile || options.file || null;
    var level = options.level || 0; // nb day for incremental
    var notriggers = options.notriggers || false;
    var direct = options.direct || 'on'; // on or off direct write I/O

    if (dbpath == null || dbpath.length === 0) {
        doError(new Error('No database specified'), callback);
        return;
    }

    if (bckfile == null || bckfile.length === 0) {
        doError(new Error('No backup path specified'), callback);
        return;
    }

    var blr = this.connection._blr;
    blr.pos = 0;
    blr.addByte(Const.isc_action_svc_nbak);
    blr.addString2(Const.isc_spb_dbname, dbpath, Const.DEFAULT_ENCODING);
    blr.addString2(Const.isc_spb_nbk_file, bckfile, Const.DEFAULT_ENCODING);
    blr.addByteInt32(Const.isc_spb_nbk_level, level);
    blr.addString2(Const.isc_spb_nbk_direct, direct, Const.DEFAULT_ENCODING);
    var opts = 0;
    if (notriggers) opts = opts | Const.isc_spb_nbk_no_triggers;
    blr.addByteInt32(Const.isc_spb_options, opts);
    var self = this;
    this.connection.svcstart(blr, function (err, data) {
        if (err) {
            doError(new Error(err), callback);
            return;
        }
        self._createOutputStream(options.optread, options.buffersize, callback);
    });
}

ServiceManager.prototype.restore = function(options, callback) {
    var bckfiles = options.backupfiles || options.files || null; // format bckfiles ['file1', 'file2', 'file3']
    // for convenience
    if (bckfiles) bckfiles = bckfiles.constructor !== Array?[bckfiles]:bckfiles;
    var dbfile = options.database || this.connection.options.filename || this.connection.options.database;;
    var verbose = options.verbose || false;
    var cachebuffers = options.cachebuffers || 2048; // gbak -buffers
    var pagesize = options.pagesize || 4096; // gbak -page_size
    var readonly = options.readonly || false; // gbak -mode
    var deactivateindexes = options.deactivateindexes || false;
    var	noshadow = options.noshadow || false;
    var	novalidity = options.novalidity || false;
    var	individualcommit = options.individualcommit || true; // otherwise no data
    var	replace = options.replace || false;
    var	create = options.create || true;
    var useallspace = options.useallspace || false;
    var metadataonly = options.metadataonly || false;
    var fixfssdata = options.fixfssdata || null;
    var fixfssmetadata = options.fixfssmetadata || null;

    if (bckfiles == null || bckfiles.length === 0) {
        doError(new Error('No backup file specified'), callback);
        return;
    }

    if (dbfile == null || dbfile.length === 0) {
        doError(new Error('No database path specified'), callback);
        return;
    }

    var blr = this.connection._blr;
    blr.pos = 0;
    blr.addByte(Const.isc_action_svc_restore);
    for (var i = 0; i < bckfiles.length; i++) {
        blr.addString2(Const.isc_spb_bkp_file, bckfiles[i], Const.DEFAULT_ENCODING);
    }
    blr.addString2(Const.isc_spb_dbname, dbfile, Const.DEFAULT_ENCODING);
    blr.addByte(Const.isc_spb_res_buffers);
    blr.addInt32(cachebuffers);
    blr.addByte(Const.isc_spb_res_page_size);
    blr.addInt32(pagesize);
    blr.addByte(Const.isc_spb_res_access_mode);
    if (readonly)
        blr.addByte(Const.isc_spb_prp_am_readonly);
    else
        blr.addByte(Const.isc_spb_prp_am_readwrite);
    if (fixfssdata) blr.addString2(Const.isc_spb_res_fix_fss_data, fixfssdata, Const.DEFAULT_ENCODING);
    if (fixfssmetadata) blr.addString2(Const.isc_spb_res_fix_fss_metadata, fixfssmetadata, Const.DEFAULT_ENCODING);
    var opts = 0;
    if (deactivateindexes) opts = opts | Const.isc_spb_res_deactivate_idx;
    if (noshadow) opts = opts | Const.isc_spb_res_no_shadow;
    if (novalidity) opts = opts | Const.isc_spb_res_no_validity;
    if (individualcommit) opts = opts | Const.isc_spb_res_one_at_a_time;
    if (replace) opts = opts | Const.isc_spb_res_replace;
    if (create) opts = opts | Const.isc_spb_res_create;
    if (useallspace) opts = opts | Const.isc_spb_res_use_all_space;
    if (metadataonly) opts = opts | Const.isc_spb_res_fix_fss_metadata;
    if (opts)
        blr.addByteInt32(Const.isc_spb_options, opts);
    if (verbose)
        blr.addByte(Const.isc_spb_verbose);
    var self = this;
    this.connection.svcstart(blr, function (err, data) {
        if (err) {
            doError(new Error(err), callback);
            return;
        }
        self._createOutputStream(options.optread, options.buffersize, callback);
    });
}

ServiceManager.prototype.nrestore = function (options, callback) {
    var bckfiles = options.backupfiles || options.files || null; // format bckfiles ['file1', 'file2', 'file3']
    // for convenience
    if (bckfiles) bckfiles = bckfiles.constructor !== Array?[bckfiles]:bckfiles;
    var dbpath = options.database || this.connection.options.filename || this.connection.options.database;

    if (bckfiles == null || bckfiles.length === 0) {
        doError(new Error('No backup file specified'), callback);
        return;
    }

    if (dbpath == null || bckfiles.length === 0) {
        doError(new Error('No database path specified'), callback);
        return;
    }
    var blr = this.connection._blr;
    blr.pos = 0;
    blr.addByte(Const.isc_action_svc_nrest);
    for (var i = 0; i < bckfiles.length; i++) {
        blr.addString2(Const.isc_spb_nbk_file, bckfiles[i], Const.DEFAULT_ENCODING);
    }
    blr.addString2(Const.isc_spb_dbname, dbpath, Const.DEFAULT_ENCODING);
    var self = this;
    this.connection.svcstart(blr, function (err, data) {
        if (err) {
            doError(new Error(err), callback);
            return;
        }
        self._createOutputStream(options.optread, options.buffersize, callback);
    });
}

// only one at time don't use this function directly
ServiceManager.prototype._fixpropertie = function (options, callback) {
    var dbpath = options.database || this.connection.options.filename || this.connection.options.database;
    var dialect = options.dialect || null;
    var sweep = options.sweepinterval || null;
    var pagebuffers = options.nbpagebuffers || null;
    var online = options.bringonline || false;
    var shutdown = options.shutdown != null ? options.shutdown : null; // 0 Forced, 1 deny transaction, 2 deny attachment
    var shutdowndelay = options.shutdowndelay || 0;
    var shutdownmode = options.shutdownmode; // 0 normal 1 multi 2 single 3 full
    var shadow = options.activateshadow || false;
    var forcewrite = options.forcewrite;
    var reservespace = options.reservespace;
    var accessmode = options.accessmode; // 0 readonly 1 readwrite

    if (dbpath == null || dbpath.length === 0) {
        doError(new Error('No database specified'), callback);
        return;
    }

    var blr = this.connection._blr;
    blr.pos = 0;
    blr.addByte(Const.isc_action_svc_properties);
    blr.addString2(Const.isc_spb_dbname, dbpath, Const.DEFAULT_ENCODING);
    if (dialect) blr.addByteInt32(Const.isc_spb_prp_set_sql_dialect, dialect);
    if (sweep) blr.addByteInt32(Const.isc_spb_prp_sweep_interval, sweep);
    if (pagebuffers) blr.addByteInt32(Const.isc_spb_prp_page_buffers, pagebuffers);
    if (shutdown != null) {
        if (shutdownmode != null) {
            if (SHUTDOWNEX_KIND[shutdown] === undefined) {
                doError(new Error('Invalid shutdown kind'), callback);
                return;
            }
            if (SHUTDOWNEX_MODE[shutdownmode] === undefined) {
                doError(new Error('Invalid shutdown mode'), callback);
                return;
            }

            // New shutdown with mode
            blr.addBytes([Const.isc_spb_prp_shutdown_mode, SHUTDOWNEX_MODE[shutdownmode]]);
            blr.addByteInt32(SHUTDOWNEX_KIND[shutdown], shutdowndelay);
        } else {
            // Old shutdown
            blr.addByteInt32(SHUTDOWN_KIND[shutdown], shutdowndelay);
        }
    }
    if (forcewrite) blr.addBytes([Const.isc_spb_prp_write_mode, Const.isc_spb_prp_wm_sync]);
    if (forcewrite === false) blr.addBytes([Const.isc_spb_prp_write_mode, Const.isc_spb_prp_wm_async]);
    if (accessmode === 1) blr.addBytes([Const.isc_spb_prp_access_mode, Const.isc_spb_prp_am_readwrite]);
    if (accessmode === 0) blr.addBytes([Const.isc_spb_prp_access_mode, Const.isc_spb_prp_am_readonly]);
    if (reservespace) blr.addBytes([Const.isc_spb_prp_reserve_space, Const.isc_spb_prp_res]);
    if (reservespace != null && !reservespace) blr.addBytes([Const.isc_spb_prp_reserve_space, Const.isc_spb_prp_res_use_full]);
    var opts = 0;
    if (shadow) opts = opts | Const.isc_spb_prp_activate;
    if (online) opts = opts | Const.isc_spb_prp_db_online;
    if (opts)
        blr.addByteInt32(Const.isc_spb_options, opts);
    var self = this;
    this.connection.svcstart(blr, function (err, data) {
        if (err) {
            doError(new Error(err), callback);
            return;
        }
        self._createOutputStream(options.optread, options.buffersize, callback);
    });
}

ServiceManager.prototype.setDialect = function (db, dialect, callback) {
    this._fixpropertie({ database: db, dialect: dialect }, callback);
}

ServiceManager.prototype.setSweepinterval = function (db, sweepinterval, callback) {
    this._fixpropertie({ database: db, sweepinterval: sweepinterval }, callback);
}

ServiceManager.prototype.setCachebuffer = function (db, nbpages, callback) {
    this._fixpropertie({ database: db, nbpagebuffers: nbpages }, callback);
}

ServiceManager.prototype.BringOnline = function (db, callback) {
    this._fixpropertie({ database: db, bringonline: true }, callback);
}

const SHUTDOWN_KIND = {
    0: Const.isc_spb_prp_shutdown_db,
    1: Const.isc_spb_prp_deny_new_transactions,
    2: Const.isc_spb_prp_deny_new_attachments
};
const SHUTDOWNEX_KIND = {
    0: Const.isc_spb_prp_force_shutdown,
    1: Const.isc_spb_prp_transactions_shutdown,
    2: Const.isc_spb_prp_attachments_shutdown
};
const SHUTDOWNEX_MODE = {
    //0: isc_spb_prp_sm_normal,
    1: Const.isc_spb_prp_sm_multi,
    2: Const.isc_spb_prp_sm_single,
    3: Const.isc_spb_prp_sm_full
};
const ShutdownMode = { NORMAL: 0, MULTI: 1, SINGLE: 2, FULL: 3 };
const ShutdownKind = { FORCED: 0, DENY_TRANSACTION: 1, DENY_ATTACHMENT: 2 };
exports.ShutdownMode = ShutdownMode;
exports.ShutdownKind = ShutdownKind;

ServiceManager.prototype.Shutdown = function (db, kind, delay, mode, callback) {
    // mode parameter is for server version >= 2.0
    if (mode instanceof Function) {
        callback = mode;
        mode = undefined;
    }

    this._fixpropertie({ database: db, shutdown: kind, shutdowndelay: delay, shutdownmode: mode }, callback);
}

ServiceManager.prototype.setShadow = function (db, val, callback) {
    this._fixpropertie({ database: db, activateshadow : val }, callback);
}

ServiceManager.prototype.setForcewrite = function (db, val, callback) {
    this._fixpropertie({ database: db, forcewrite : val }, callback);
}

ServiceManager.prototype.setReservespace = function (db, val, callback) {
    this._fixpropertie({ database: db, reservespace : val }, callback);
}

ServiceManager.prototype.setReadonlyMode = function (db, callback) {
    this._fixpropertie({ database: db, accessmode : 0 }, callback);
}

ServiceManager.prototype.setReadwriteMode = function (db, callback) {
    this._fixpropertie({ database: db, accessmode : 1 }, callback);
}

ServiceManager.prototype.validate = function (options, callback) {
    var dbpath = options.database || this.connection.options.filename || this.connection.options.database;
    var checkdb = options.checkdb || false;
    var ignorechecksums = options.ignorechecksums || false;
    var killshadows = options.killshadows || false;
    var mend = options.mend || false;
    var validate = options.validate || false;
    var full = options.full || false;
    var sweep = options.sweep || false;
    var listlimbo = options.listlimbo || false;
    var icu = options.icu || false;

    if (dbpath == null || dbpath.length === 0) {
        doError(new Error('No database specified'), callback);
        return;
    }

    var blr = this.connection._blr;
    blr.pos = 0;
    blr.addByte(Const.isc_action_svc_repair);
    blr.addString2(Const.isc_spb_dbname, dbpath, Const.DEFAULT_ENCODING);
    var opts = 0;
    if (checkdb) opts = opts | Const.isc_spb_rpr_check_db;
    if (ignorechecksums) opts = opts | Const.isc_spb_rpr_ignore_checksum;
    if (killshadows) opts = opts | Const.isc_spb_rpr_kill_shadows;
    if (mend) opts = opts | Const.isc_spb_rpr_mend_db;
    if (validate) opts = opts | Const.isc_spb_rpr_validate_db;
    if (full) opts = opts | Const.isc_spb_rpr_full;
    if (sweep) opts = opts | Const.isc_spb_rpr_sweep_db;
    if (listlimbo) opts = opts | Const.isc_spb_rpr_list_limbo_trans;
    if (icu) opts = opts | Const.isc_spb_rpr_icu;
    blr.addByteInt32(Const.isc_spb_options, opts);
    var self = this;
    this.connection.svcstart(blr, function (err, data) {
        if (err) {
            doError(new Error(err), callback);
            return;
        }
        self._createOutputStream(options.optread, options.buffersize, callback);
    });
}

ServiceManager.prototype.commit = function(db, transactid, callback) {
    var dbpath = db || this.connection.options.filename || this.connection.options.database;
    if (dbpath == null || dbpath.length === 0) {
        doError(new Error('No database specified'), callback);
        return;
    }

    var blr = this.connection._blr;
    blr.pos = 0;
    blr.addByte(Const.isc_action_svc_repair);
    blr.addString2(Const.isc_spb_dbname, dbpath, Const.DEFAULT_ENCODING);
    blr.addByteInt32(Const.isc_spb_rpr_commit_trans, transactid);
    var self = this;
    this.connection.svcstart(blr, function (err, data) {
        if (err) {
            doError(new Error(err), callback);
            return;
        }
        self._createOutputStream(null, null, callback);
    });
}

ServiceManager.prototype.rollback = function (db, transactid, callback) {
    var dbpath = db || this.connection.options.filename || this.connection.options.database;
    if (dbpath == null || dbpath.length === 0) {
        doError(new Error('No database specified'), callback);
        return;
    }

    var blr = this.connection._blr;
    blr.pos = 0;
    blr.addByte(Const.isc_action_svc_repair);
    blr.addString2(Const.isc_spb_dbname, dbpath, Const.DEFAULT_ENCODING);
    blr.addByteInt32(Const.isc_spb_rpr_rollback_trans, transactid);
    this.connection.svcstart(blr, function (err, data) {
        if (err) {
            doError(new Error(err), callback);
            return;
        }
        self._createOutputStream(null, null, callback);
    });
}

ServiceManager.prototype.recover = function (db, transactid, callback) {
    var dbpath = db || this.connection.options.filename || this.connection.options.database;
    if (dbpath == null || dbpath.length === 0) {
        doError(new Error('No database specified'), callback);
        return;
    }

    var blr = this.connection._blr;
    blr.pos = 0;
    blr.addByte(Const.isc_action_svc_repair);
    blr.addString2(Const.isc_spb_dbname, dbpath, Const.DEFAULT_ENCODING);
    blr.addByteInt32(Const.isc_spb_rpr_recover_two_phase, transactid);
    this.connection.svcstart(blr, function (err, data) {
        if (err) {
            doError(new Error(err), callback);
            return;
        }
        self._createOutputStream(null, null, callback);
    });
}

ServiceManager.prototype.getStats = function (options, callback) {
    var dbpath = options.database || this.connection.options.filename || this.connection.options.database;
    var record = options.record || false;
    var nocreation = options.nocreation || false;
    var tables = options.tables || false;
    var pages = options.pages || false;
    var header = options.header || false;
    var indexes = options.indexes || false;
    var tablesystem = options.tablesystem || false;
    var encryption = options.encryption || false;
    var objects = options.objects || null; // space-separated list of object index,table,systemtable
    if (dbpath == null || dbpath.length === 0) {
        doError(new Error('No database specified'), callback);
        return;
    }

    var blr = this.connection._blr;
    blr.pos = 0;
    blr.addByte(Const.isc_action_svc_db_stats);
    blr.addString2(Const.isc_spb_dbname, dbpath, Const.DEFAULT_ENCODING);
    var opts = 0;
    if (record) opts = opts | Const.isc_spb_sts_record_versions;
    if (nocreation) opts = opts | Const.isc_spb_sts_nocreation;
    if (tables) opts = opts | Const.isc_spb_sts_table;
    if (pages) opts = opts | Const.isc_spb_sts_data_pages;
    if (header) opts = opts | Const.isc_spb_sts_hdr_pages;
    if (indexes) opts = opts | Const.isc_spb_sts_idx_pages;
    if (tablesystem) opts = opts | Const.isc_spb_sts_sys_relations;
    if (encryption) opts = opts | Const.isc_spb_sts_encryption;
    if (opts)
        blr.addByteInt32(Const.isc_spb_options, opts);
    if (objects) blr.addString2(Const.isc_spb_command_line, objects, Const.DEFAULT_ENCODING);
    var self = this;
    this.connection.svcstart(blr, function (err, data) {
        if (err) {
            doError(new Error(err), callback);
            return;
        }
        self._createOutputStream(options.optread, options.buffersize, callback);
    });

}

ServiceManager.prototype.getLog = function (options, callback) {
    var self = this;
    var blr = this.connection._blr;
    var optread = options.optread || 'byline';
    blr.pos = 0;
    blr.addByte(Const.isc_action_svc_get_fb_log);
    this.connection.svcstart(blr, function (err, data) {
        if (err) {
            doError(new Error(err), callback);
            return;
        }
        self._createOutputStream(optread, options.buffersize, callback);
    });
}

ServiceManager.prototype.getUsers = function (username, callback) {
    var self = this;
    var blr = this.connection._blr;
    blr.pos = 0;
    blr.addByte(Const.isc_action_svc_display_user);
    if (username) blr.addString2(Const.isc_spb_sec_username, username, Const.DEFAULT_ENCODING);
    this.connection.svcstart(blr, function (err, data) {
        if (err) {
            doError(new Error(err), callback);
            return;
        }
        self.readusers({}, callback);
    });
}

ServiceManager.prototype.addUser = function (username, password, options, callback) {
    var rolename = options.rolename || null;
    var groupname = options.groupname || null;
    var firsname = options.firstname || null;
    var middlename = options.middlename || null;
    var lastname = options.lastname || null;
    var userid = options.userid || null;
    var groupid = options.groupid || null;
    var admin = options.admin || null;

    var blr = this.connection._blr;
    blr.pos = 0;
    blr.addByte(Const.isc_action_svc_add_user);
    blr.addString2(Const.isc_spb_sec_username, username, Const.DEFAULT_ENCODING);
    blr.addString2(Const.isc_spb_sec_password, password, Const.DEFAULT_ENCODING);
    if (rolename) blr.addString2(Const.isc_dpb_sql_role_name, rolename, Const.DEFAULT_ENCODING);
    if (groupname) blr.addString2(Const.isc_spb_sec_groupname, groupname, Const.DEFAULT_ENCODING);
    if (firsname) blr.addString2(Const.isc_spb_sec_firstname, firsname, Const.DEFAULT_ENCODING);
    if (middlename) blr.addString2(Const.isc_spb_sec_middlename, middlename, Const.DEFAULT_ENCODING);
    if (lastname) blr.addString2(Const.isc_spb_sec_lastname, lastname, Const.DEFAULT_ENCODING);
    if (userid != null) blr.addByteInt32(Const.isc_spb_sec_userid, userid);
    if (groupid != null) blr.addByteInt32(Const.isc_spb_sec_groupid, groupid);
    if (admin != null) blr.addByteInt32(Const.isc_spb_sec_admin, admin);

    var self = this;
    this.connection.svcstart(blr, function (err, data) {
        if (err) {
            doError(new Error(err), callback);
            return;
        }
        self._createOutputStream(options.optread, options.buffersize, callback);
    });
}

ServiceManager.prototype.editUser = function (username, options, callback) {
    var rolename = options.rolename || null;
    var groupname = options.groupname || null;
    var firsname = options.firstname || null;
    var middlename = options.middlename || null;
    var lastname = options.lastname || null;
    var userid = options.userid || null;
    var groupid = options.groupid || null;
    var admin = options.admin || null;
    var password = options.password || null;
    var blr = this.connection._blr;
    blr.pos = 0;
    blr.addByte(Const.isc_action_svc_modify_user);
    blr.addString2(Const.isc_spb_sec_username, username, Const.DEFAULT_ENCODING);
    if (password) blr.addString2(Const.isc_spb_sec_password, password, Const.DEFAULT_ENCODING);
    if (rolename) blr.addString2(Const.isc_dpb_sql_role_name, rolename, Const.DEFAULT_ENCODING);
    if (groupname) blr.addString2(Const.isc_spb_sec_groupname, groupname, Const.DEFAULT_ENCODING);
    if (firsname) blr.addString2(Const.isc_spb_sec_firstname, firsname, Const.DEFAULT_ENCODING);
    if (middlename) blr.addString2(Const.isc_spb_sec_middlename, middlename, Const.DEFAULT_ENCODING);
    if (lastname) blr.addString2(Const.isc_spb_sec_lastname, lastname, Const.DEFAULT_ENCODING);
    if (userid != null) blr.addByteInt32(Const.isc_spb_sec_userid, userid);
    if (groupid != null) blr.addByteInt32(Const.isc_spb_sec_groupid, groupid);
    if (admin != null) blr.addByteInt32(Const.isc_spb_sec_admin, admin);

    var self = this;
    this.connection.svcstart(blr, function (err, data) {
        if (err) {
            doError(new Error(err), callback);
            return;
        }
        self._createOutputStream(options.optread, options.buffersize, callback);
    });
}

ServiceManager.prototype.removeUser = function (username, rolename, callback) {
    var blr = this.connection._blr;
    blr.pos = 0;
    blr.addByte(Const.isc_action_svc_delete_user);
    blr.addString2(Const.isc_spb_sec_username, username, Const.DEFAULT_ENCODING);
    if (rolename) blr.addString2(Const.isc_dpb_sql_role_name, rolename, Const.DEFAULT_ENCODING);

    var self = this, options = {};
    this.connection.svcstart(blr, function (err, data) {
        if (err) {
            doError(new Error(err), callback);
            return;
        }
        self._createOutputStream(options.optread, options.buffersize, callback);
    });
}

ServiceManager.prototype.getFbserverInfos = function (infos, options, callback) {
    var buffersize = options.buffersize || 2048;
    var timeout = options.timeout || 1;
    var opts = {
        "dbinfo" : Const.isc_info_svc_svr_db_info,
        "fbconfig" : Const.isc_info_svc_get_config,
        "svcversion" : Const.isc_info_svc_version,
        "fbversion" : Const.isc_info_svc_server_version,
        "fbimplementation" : Const.isc_info_svc_implementation,
        "fbcapatibilities" : Const.isc_info_svc_capabilities,
        "pathsecuritydb" : Const.isc_info_svc_user_dbpath,
        "fbenv" : Const.isc_info_svc_get_env,
        "fbenvlock" : Const.isc_info_svc_get_env_lock,
        "fbenvmsg" : Const.isc_info_svc_get_env_msg
    };
    // if infos is empty all options are asked to the service

    var tops = [], empty = isEmpty(infos);
    for (let popts in opts)
        if (empty || infos[popts])
            tops.push(opts[popts]);

    var self = this;
    this.connection.svcquery(tops, buffersize, timeout, function (err, data) {
        if (err || !data.buffer) {
            doError(new Error(err||'Bad query return'), callback);
            return;
        }
        self._processquery(data.buffer, callback);
    });
}

function isEmpty(obj){
    for(var p in obj) return false;
    return true;
}

ServiceManager.prototype.startTrace = function (options, callback) {
    var self = this;
    var blr = this.connection._blr;
    var configfile = options.configfile || '';
    var tracename = options.tracename || '';

    if (configfile.length === 0) {
        doError(new Error('No config filename specified'), callback);
        return;
    }
    if (tracename.length === 0) {
        doError(new Error('No tracename specified'), callback);
        return;
    }

    blr.pos = 0;
    blr.addByte(Const.isc_action_svc_trace_start);
    blr.addString2(Const.isc_spb_trc_cfg, configfile, Const.DEFAULT_ENCODING);
    blr.addString2(Const.isc_spb_trc_name, tracename, Const.DEFAULT_ENCODING);
    this.connection.svcstart(blr, function (err, data) {
        if (err) {
            doError(new Error(err), callback);
            return;
        }
        self._createOutputStream(options.optread, options.buffersize, callback);
    });
}

ServiceManager.prototype.suspendTrace = function (options, callback) {
    var self = this;
    var blr = this.connection._blr;
    var traceid = options.traceid || null;

    if (traceid == null) {
        doError(new Error('No traceid specified'), callback);
        return;
    }

    blr.pos = 0;
    blr.addByte(Const.isc_action_svc_trace_suspend);
    blr.addByteInt32(Const.isc_spb_trc_id, traceid);
    this.connection.svcstart(blr, function (err, data) {
        if (err) {
            doError(new Error(err), callback);
            return;
        }
        self._createOutputStream(options.optread, options.buffersize, callback);
    });
}

ServiceManager.prototype.resumeTrace = function (options, callback) {
    var self = this;
    var blr = this.connection._blr;
    var traceid = options.traceid || null;

    if (traceid == null) {
        doError(new Error('No traceid specified'), callback);
        return;
    }

    blr.pos = 0;
    blr.addByte(Const.isc_action_svc_trace_resume);
    blr.addByteInt32(Const.isc_spb_trc_id, traceid);
    this.connection.svcstart(blr, function (err, data) {
        if (err) {
            doError(new Error(err), callback);
            return;
        }
        self._createOutputStream(options.optread, options.buffersize, callback);
    });
}

ServiceManager.prototype.stopTrace = function (options, callback) {
    var self = this;
    var blr = this.connection._blr;
    var traceid = options.traceid || null;

    if (traceid == null) {
        doError(new Error('No traceid specified'), callback);
        return;
    }

    blr.pos = 0;
    blr.addByte(Const.isc_action_svc_trace_stop);
    blr.addByteInt32(Const.isc_spb_trc_id, traceid);
    this.connection.svcstart(blr, function (err, data) {
        if (err) {
            doError(new Error(err), callback);
            return;
        }
        self._createOutputStream(options.optread, options.buffersize, callback);
    });
}

ServiceManager.prototype.getTraceList = function (options, callback) {
    var self = this;
    var blr = this.connection._blr;
    blr.pos = 0;
    blr.addByte(Const.isc_action_svc_trace_list);
    this.connection.svcstart(blr, function (err, data) {
        if (err) {
            doError(new Error(err), callback);
            return;
        }
        self._createOutputStream(options.optread, options.buffersize, callback);
    });
}

ServiceManager.prototype.readline = function (options, callback) {
    var buffersize = options.buffersize || 2048;
    var timeout = options.timeout || 60;
    var self = this;
    this.connection.svcquery([Const.isc_info_svc_line], buffersize, timeout, function (err, data) {
        if (err || !data.buffer) {
            doError(new Error(err||'Bad query return'), callback);
            return;
        }
        self._processquery(data.buffer, callback);
    });
}

ServiceManager.prototype.readeof = function (options, callback) {
    var buffersize = options.buffersize || (8 * 1024);
    var timeout = options.timeout || 60;
    var self = this;
    this.connection.svcquery([Const.isc_info_svc_to_eof], buffersize, timeout, function (err, data) {
        if (err || !data.buffer) {
            doError(new Error(err||'Bad query return'), callback);
            return;
        }
        self._processquery(data.buffer, callback);
    });
}

ServiceManager.prototype.hasRunningAction = function (options, callback) {
    var buffersize = options.buffersize || 2048;
    var timeout = options.timeout || 60;
    var self = this;
    this.connection.svcquery([Const.isc_info_svc_running], buffersize, timeout, function (err, data) {
        if (err || !data.buffer) {
            doError(new Error(err||'Bad query return'), callback);
            return;
        }
        self._processquery(data.buffer, callback);
    });
}

ServiceManager.prototype.readusers = function (options, callback) {
    var buffersize = options.buffersize || 2048;
    var timeout = options.timeout || 60;
    var self = this;
    this.connection.svcquery([Const.isc_info_svc_get_users], buffersize, timeout, function (err, data) {
        if (err || !data.buffer) {
            doError(new Error(err||'Bad query return'), callback);
            return;
        }
        self._processquery(data.buffer, callback);
    });
}

ServiceManager.prototype.readlimbo = function (options, callback) {
    var buffersize = options.buffersize || 2048;
    var timeout = options.timeout || 60;
    var self = this;
    this.connection.svcquery([Const.isc_info_svc_limbo_trans], buffersize, timeout, function (err, data) {
        if (err || !data.buffer) {
            doError(new Error(err||'Bad query return'), callback);
            return;
        }
        self._processquery(data.buffer, callback);
    });
}

module.exports = ServiceManager;


/***/ }),

/***/ 69278:
/***/ ((module) => {

"use strict";
module.exports = require("net");

/***/ }),

/***/ 69383:
/***/ ((module) => {

"use strict";


/** @type {import('.')} */
module.exports = Error;


/***/ }),

/***/ 69675:
/***/ ((module) => {

"use strict";


/** @type {import('./type')} */
module.exports = TypeError;


/***/ }),

/***/ 70405:
/***/ ((module) => {

module.exports = defer;

/**
 * Runs provided function on next iteration of the event loop
 *
 * @param {function} fn - function to run
 */
function defer(fn)
{
  var nextTick = typeof setImmediate == 'function'
    ? setImmediate
    : (
      typeof process == 'object' && typeof process.nextTick == 'function'
      ? process.nextTick
      : null
    );

  if (nextTick)
  {
    nextTick(fn);
  }
  else
  {
    setTimeout(fn, 0);
  }
}


/***/ }),

/***/ 70414:
/***/ ((module) => {

"use strict";


/** @type {import('./round')} */
module.exports = Math.round;


/***/ }),

/***/ 70453:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var undefined;

var $Object = __webpack_require__(79612);

var $Error = __webpack_require__(69383);
var $EvalError = __webpack_require__(41237);
var $RangeError = __webpack_require__(79290);
var $ReferenceError = __webpack_require__(79538);
var $SyntaxError = __webpack_require__(58068);
var $TypeError = __webpack_require__(69675);
var $URIError = __webpack_require__(35345);

var abs = __webpack_require__(71514);
var floor = __webpack_require__(58968);
var max = __webpack_require__(6188);
var min = __webpack_require__(68002);
var pow = __webpack_require__(75880);
var round = __webpack_require__(70414);
var sign = __webpack_require__(73093);

var $Function = Function;

// eslint-disable-next-line consistent-return
var getEvalledConstructor = function (expressionSyntax) {
	try {
		return $Function('"use strict"; return (' + expressionSyntax + ').constructor;')();
	} catch (e) {}
};

var $gOPD = __webpack_require__(75795);
var $defineProperty = __webpack_require__(30655);

var throwTypeError = function () {
	throw new $TypeError();
};
var ThrowTypeError = $gOPD
	? (function () {
		try {
			// eslint-disable-next-line no-unused-expressions, no-caller, no-restricted-properties
			arguments.callee; // IE 8 does not throw here
			return throwTypeError;
		} catch (calleeThrows) {
			try {
				// IE 8 throws on Object.getOwnPropertyDescriptor(arguments, '')
				return $gOPD(arguments, 'callee').get;
			} catch (gOPDthrows) {
				return throwTypeError;
			}
		}
	}())
	: throwTypeError;

var hasSymbols = __webpack_require__(64039)();

var getProto = __webpack_require__(93628);
var $ObjectGPO = __webpack_require__(71064);
var $ReflectGPO = __webpack_require__(48648);

var $apply = __webpack_require__(11002);
var $call = __webpack_require__(10076);

var needsEval = {};

var TypedArray = typeof Uint8Array === 'undefined' || !getProto ? undefined : getProto(Uint8Array);

var INTRINSICS = {
	__proto__: null,
	'%AggregateError%': typeof AggregateError === 'undefined' ? undefined : AggregateError,
	'%Array%': Array,
	'%ArrayBuffer%': typeof ArrayBuffer === 'undefined' ? undefined : ArrayBuffer,
	'%ArrayIteratorPrototype%': hasSymbols && getProto ? getProto([][Symbol.iterator]()) : undefined,
	'%AsyncFromSyncIteratorPrototype%': undefined,
	'%AsyncFunction%': needsEval,
	'%AsyncGenerator%': needsEval,
	'%AsyncGeneratorFunction%': needsEval,
	'%AsyncIteratorPrototype%': needsEval,
	'%Atomics%': typeof Atomics === 'undefined' ? undefined : Atomics,
	'%BigInt%': typeof BigInt === 'undefined' ? undefined : BigInt,
	'%BigInt64Array%': typeof BigInt64Array === 'undefined' ? undefined : BigInt64Array,
	'%BigUint64Array%': typeof BigUint64Array === 'undefined' ? undefined : BigUint64Array,
	'%Boolean%': Boolean,
	'%DataView%': typeof DataView === 'undefined' ? undefined : DataView,
	'%Date%': Date,
	'%decodeURI%': decodeURI,
	'%decodeURIComponent%': decodeURIComponent,
	'%encodeURI%': encodeURI,
	'%encodeURIComponent%': encodeURIComponent,
	'%Error%': $Error,
	'%eval%': eval, // eslint-disable-line no-eval
	'%EvalError%': $EvalError,
	'%Float16Array%': typeof Float16Array === 'undefined' ? undefined : Float16Array,
	'%Float32Array%': typeof Float32Array === 'undefined' ? undefined : Float32Array,
	'%Float64Array%': typeof Float64Array === 'undefined' ? undefined : Float64Array,
	'%FinalizationRegistry%': typeof FinalizationRegistry === 'undefined' ? undefined : FinalizationRegistry,
	'%Function%': $Function,
	'%GeneratorFunction%': needsEval,
	'%Int8Array%': typeof Int8Array === 'undefined' ? undefined : Int8Array,
	'%Int16Array%': typeof Int16Array === 'undefined' ? undefined : Int16Array,
	'%Int32Array%': typeof Int32Array === 'undefined' ? undefined : Int32Array,
	'%isFinite%': isFinite,
	'%isNaN%': isNaN,
	'%IteratorPrototype%': hasSymbols && getProto ? getProto(getProto([][Symbol.iterator]())) : undefined,
	'%JSON%': typeof JSON === 'object' ? JSON : undefined,
	'%Map%': typeof Map === 'undefined' ? undefined : Map,
	'%MapIteratorPrototype%': typeof Map === 'undefined' || !hasSymbols || !getProto ? undefined : getProto(new Map()[Symbol.iterator]()),
	'%Math%': Math,
	'%Number%': Number,
	'%Object%': $Object,
	'%Object.getOwnPropertyDescriptor%': $gOPD,
	'%parseFloat%': parseFloat,
	'%parseInt%': parseInt,
	'%Promise%': typeof Promise === 'undefined' ? undefined : Promise,
	'%Proxy%': typeof Proxy === 'undefined' ? undefined : Proxy,
	'%RangeError%': $RangeError,
	'%ReferenceError%': $ReferenceError,
	'%Reflect%': typeof Reflect === 'undefined' ? undefined : Reflect,
	'%RegExp%': RegExp,
	'%Set%': typeof Set === 'undefined' ? undefined : Set,
	'%SetIteratorPrototype%': typeof Set === 'undefined' || !hasSymbols || !getProto ? undefined : getProto(new Set()[Symbol.iterator]()),
	'%SharedArrayBuffer%': typeof SharedArrayBuffer === 'undefined' ? undefined : SharedArrayBuffer,
	'%String%': String,
	'%StringIteratorPrototype%': hasSymbols && getProto ? getProto(''[Symbol.iterator]()) : undefined,
	'%Symbol%': hasSymbols ? Symbol : undefined,
	'%SyntaxError%': $SyntaxError,
	'%ThrowTypeError%': ThrowTypeError,
	'%TypedArray%': TypedArray,
	'%TypeError%': $TypeError,
	'%Uint8Array%': typeof Uint8Array === 'undefined' ? undefined : Uint8Array,
	'%Uint8ClampedArray%': typeof Uint8ClampedArray === 'undefined' ? undefined : Uint8ClampedArray,
	'%Uint16Array%': typeof Uint16Array === 'undefined' ? undefined : Uint16Array,
	'%Uint32Array%': typeof Uint32Array === 'undefined' ? undefined : Uint32Array,
	'%URIError%': $URIError,
	'%WeakMap%': typeof WeakMap === 'undefined' ? undefined : WeakMap,
	'%WeakRef%': typeof WeakRef === 'undefined' ? undefined : WeakRef,
	'%WeakSet%': typeof WeakSet === 'undefined' ? undefined : WeakSet,

	'%Function.prototype.call%': $call,
	'%Function.prototype.apply%': $apply,
	'%Object.defineProperty%': $defineProperty,
	'%Object.getPrototypeOf%': $ObjectGPO,
	'%Math.abs%': abs,
	'%Math.floor%': floor,
	'%Math.max%': max,
	'%Math.min%': min,
	'%Math.pow%': pow,
	'%Math.round%': round,
	'%Math.sign%': sign,
	'%Reflect.getPrototypeOf%': $ReflectGPO
};

if (getProto) {
	try {
		null.error; // eslint-disable-line no-unused-expressions
	} catch (e) {
		// https://github.com/tc39/proposal-shadowrealm/pull/384#issuecomment-1364264229
		var errorProto = getProto(getProto(e));
		INTRINSICS['%Error.prototype%'] = errorProto;
	}
}

var doEval = function doEval(name) {
	var value;
	if (name === '%AsyncFunction%') {
		value = getEvalledConstructor('async function () {}');
	} else if (name === '%GeneratorFunction%') {
		value = getEvalledConstructor('function* () {}');
	} else if (name === '%AsyncGeneratorFunction%') {
		value = getEvalledConstructor('async function* () {}');
	} else if (name === '%AsyncGenerator%') {
		var fn = doEval('%AsyncGeneratorFunction%');
		if (fn) {
			value = fn.prototype;
		}
	} else if (name === '%AsyncIteratorPrototype%') {
		var gen = doEval('%AsyncGenerator%');
		if (gen && getProto) {
			value = getProto(gen.prototype);
		}
	}

	INTRINSICS[name] = value;

	return value;
};

var LEGACY_ALIASES = {
	__proto__: null,
	'%ArrayBufferPrototype%': ['ArrayBuffer', 'prototype'],
	'%ArrayPrototype%': ['Array', 'prototype'],
	'%ArrayProto_entries%': ['Array', 'prototype', 'entries'],
	'%ArrayProto_forEach%': ['Array', 'prototype', 'forEach'],
	'%ArrayProto_keys%': ['Array', 'prototype', 'keys'],
	'%ArrayProto_values%': ['Array', 'prototype', 'values'],
	'%AsyncFunctionPrototype%': ['AsyncFunction', 'prototype'],
	'%AsyncGenerator%': ['AsyncGeneratorFunction', 'prototype'],
	'%AsyncGeneratorPrototype%': ['AsyncGeneratorFunction', 'prototype', 'prototype'],
	'%BooleanPrototype%': ['Boolean', 'prototype'],
	'%DataViewPrototype%': ['DataView', 'prototype'],
	'%DatePrototype%': ['Date', 'prototype'],
	'%ErrorPrototype%': ['Error', 'prototype'],
	'%EvalErrorPrototype%': ['EvalError', 'prototype'],
	'%Float32ArrayPrototype%': ['Float32Array', 'prototype'],
	'%Float64ArrayPrototype%': ['Float64Array', 'prototype'],
	'%FunctionPrototype%': ['Function', 'prototype'],
	'%Generator%': ['GeneratorFunction', 'prototype'],
	'%GeneratorPrototype%': ['GeneratorFunction', 'prototype', 'prototype'],
	'%Int8ArrayPrototype%': ['Int8Array', 'prototype'],
	'%Int16ArrayPrototype%': ['Int16Array', 'prototype'],
	'%Int32ArrayPrototype%': ['Int32Array', 'prototype'],
	'%JSONParse%': ['JSON', 'parse'],
	'%JSONStringify%': ['JSON', 'stringify'],
	'%MapPrototype%': ['Map', 'prototype'],
	'%NumberPrototype%': ['Number', 'prototype'],
	'%ObjectPrototype%': ['Object', 'prototype'],
	'%ObjProto_toString%': ['Object', 'prototype', 'toString'],
	'%ObjProto_valueOf%': ['Object', 'prototype', 'valueOf'],
	'%PromisePrototype%': ['Promise', 'prototype'],
	'%PromiseProto_then%': ['Promise', 'prototype', 'then'],
	'%Promise_all%': ['Promise', 'all'],
	'%Promise_reject%': ['Promise', 'reject'],
	'%Promise_resolve%': ['Promise', 'resolve'],
	'%RangeErrorPrototype%': ['RangeError', 'prototype'],
	'%ReferenceErrorPrototype%': ['ReferenceError', 'prototype'],
	'%RegExpPrototype%': ['RegExp', 'prototype'],
	'%SetPrototype%': ['Set', 'prototype'],
	'%SharedArrayBufferPrototype%': ['SharedArrayBuffer', 'prototype'],
	'%StringPrototype%': ['String', 'prototype'],
	'%SymbolPrototype%': ['Symbol', 'prototype'],
	'%SyntaxErrorPrototype%': ['SyntaxError', 'prototype'],
	'%TypedArrayPrototype%': ['TypedArray', 'prototype'],
	'%TypeErrorPrototype%': ['TypeError', 'prototype'],
	'%Uint8ArrayPrototype%': ['Uint8Array', 'prototype'],
	'%Uint8ClampedArrayPrototype%': ['Uint8ClampedArray', 'prototype'],
	'%Uint16ArrayPrototype%': ['Uint16Array', 'prototype'],
	'%Uint32ArrayPrototype%': ['Uint32Array', 'prototype'],
	'%URIErrorPrototype%': ['URIError', 'prototype'],
	'%WeakMapPrototype%': ['WeakMap', 'prototype'],
	'%WeakSetPrototype%': ['WeakSet', 'prototype']
};

var bind = __webpack_require__(66743);
var hasOwn = __webpack_require__(9957);
var $concat = bind.call($call, Array.prototype.concat);
var $spliceApply = bind.call($apply, Array.prototype.splice);
var $replace = bind.call($call, String.prototype.replace);
var $strSlice = bind.call($call, String.prototype.slice);
var $exec = bind.call($call, RegExp.prototype.exec);

/* adapted from https://github.com/lodash/lodash/blob/4.17.15/dist/lodash.js#L6735-L6744 */
var rePropName = /[^%.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|%$))/g;
var reEscapeChar = /\\(\\)?/g; /** Used to match backslashes in property paths. */
var stringToPath = function stringToPath(string) {
	var first = $strSlice(string, 0, 1);
	var last = $strSlice(string, -1);
	if (first === '%' && last !== '%') {
		throw new $SyntaxError('invalid intrinsic syntax, expected closing `%`');
	} else if (last === '%' && first !== '%') {
		throw new $SyntaxError('invalid intrinsic syntax, expected opening `%`');
	}
	var result = [];
	$replace(string, rePropName, function (match, number, quote, subString) {
		result[result.length] = quote ? $replace(subString, reEscapeChar, '$1') : number || match;
	});
	return result;
};
/* end adaptation */

var getBaseIntrinsic = function getBaseIntrinsic(name, allowMissing) {
	var intrinsicName = name;
	var alias;
	if (hasOwn(LEGACY_ALIASES, intrinsicName)) {
		alias = LEGACY_ALIASES[intrinsicName];
		intrinsicName = '%' + alias[0] + '%';
	}

	if (hasOwn(INTRINSICS, intrinsicName)) {
		var value = INTRINSICS[intrinsicName];
		if (value === needsEval) {
			value = doEval(intrinsicName);
		}
		if (typeof value === 'undefined' && !allowMissing) {
			throw new $TypeError('intrinsic ' + name + ' exists, but is not available. Please file an issue!');
		}

		return {
			alias: alias,
			name: intrinsicName,
			value: value
		};
	}

	throw new $SyntaxError('intrinsic ' + name + ' does not exist!');
};

module.exports = function GetIntrinsic(name, allowMissing) {
	if (typeof name !== 'string' || name.length === 0) {
		throw new $TypeError('intrinsic name must be a non-empty string');
	}
	if (arguments.length > 1 && typeof allowMissing !== 'boolean') {
		throw new $TypeError('"allowMissing" argument must be a boolean');
	}

	if ($exec(/^%?[^%]*%?$/, name) === null) {
		throw new $SyntaxError('`%` may not be present anywhere but at the beginning and end of the intrinsic name');
	}
	var parts = stringToPath(name);
	var intrinsicBaseName = parts.length > 0 ? parts[0] : '';

	var intrinsic = getBaseIntrinsic('%' + intrinsicBaseName + '%', allowMissing);
	var intrinsicRealName = intrinsic.name;
	var value = intrinsic.value;
	var skipFurtherCaching = false;

	var alias = intrinsic.alias;
	if (alias) {
		intrinsicBaseName = alias[0];
		$spliceApply(parts, $concat([0, 1], alias));
	}

	for (var i = 1, isOwn = true; i < parts.length; i += 1) {
		var part = parts[i];
		var first = $strSlice(part, 0, 1);
		var last = $strSlice(part, -1);
		if (
			(
				(first === '"' || first === "'" || first === '`')
				|| (last === '"' || last === "'" || last === '`')
			)
			&& first !== last
		) {
			throw new $SyntaxError('property names with quotes must have matching quotes');
		}
		if (part === 'constructor' || !isOwn) {
			skipFurtherCaching = true;
		}

		intrinsicBaseName += '.' + part;
		intrinsicRealName = '%' + intrinsicBaseName + '%';

		if (hasOwn(INTRINSICS, intrinsicRealName)) {
			value = INTRINSICS[intrinsicRealName];
		} else if (value != null) {
			if (!(part in value)) {
				if (!allowMissing) {
					throw new $TypeError('base intrinsic for ' + name + ' exists, but the property is not available.');
				}
				return void undefined;
			}
			if ($gOPD && (i + 1) >= parts.length) {
				var desc = $gOPD(value, part);
				isOwn = !!desc;

				// By convention, when a data property is converted to an accessor
				// property to emulate a data property that does not suffer from
				// the override mistake, that accessor's getter is marked with
				// an `originalValue` property. Here, when we detect this, we
				// uphold the illusion by pretending to see that original data
				// property, i.e., returning the value rather than the getter
				// itself.
				if (isOwn && 'get' in desc && !('originalValue' in desc.get)) {
					value = desc.get;
				} else {
					value = value[part];
				}
			} else {
				isOwn = hasOwn(value, part);
				value = value[part];
			}

			if (isOwn && !skipFurtherCaching) {
				INTRINSICS[intrinsicRealName] = value;
			}
		}
	}
	return value;
};


/***/ }),

/***/ 70742:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const MessagesError = __webpack_require__(23652);
const Const = __webpack_require__(52750);

/**
 * Parse date from string
 * @param {String} str
 * @return {Date}
 */
const parseDate = (str) => {
    const self = str.trim();
    const arr = self.indexOf(' ') === -1 ? self.split('T') : self.split(' ');
    let index = arr[0].indexOf(':');
    const length = arr[0].length;

    if (index !== -1) {
        const tmp = arr[1];
        arr[1] = arr[0];
        arr[0] = tmp;
    }

    if (arr[0] === undefined) {
        arr[0] = '';
    }

    const noTime = arr[1] === undefined || arr[1].length === 0;

    for (let i = 0; i < length; i++) {
        const c = arr[0].charCodeAt(i);
        if (c > 47 && c < 58) {
            continue;
        }
        if (c === 45 || c === 46) {
            continue;
        }
        if (noTime) {
            return new Date(self);
        }
    }

    if (arr[1] === undefined) {
        arr[1] = '00:00:00';
    }

    const firstDay = arr[0].indexOf('-') === -1;

    const date = (arr[0] || '').split(firstDay ? '.' : '-');
    const time = (arr[1] || '').split(':');

    if (date.length < 4 && time.length < 2) {
        return new Date(self);
    }

    index = (time[2] || '').indexOf('.');

    // milliseconds
    if (index !== -1) {
        time[3] = time[2].substring(index + 1);
        time[2] = time[2].substring(0, index);
    } else {
        time[3] = '0';
    }

    const parsed = [
        parseInt(date[firstDay ? 2 : 0], 10), // year
        parseInt(date[1], 10), // month
        parseInt(date[firstDay ? 0 : 2], 10), // day
        parseInt(time[0], 10), // hours
        parseInt(time[1], 10), // minutes
        parseInt(time[2], 10), // seconds
        parseInt(time[3], 10) // miliseconds
    ];

    const def = new Date();

    for (let i = 0; i < parsed.length; i++) {
        if (isNaN(parsed[i])) {
            parsed[i] = 0;
        }

        const value = parsed[i];
        if (value !== 0) {
            continue;
        }

        switch (i) {
            case 0:
                if (value <= 0) {
                    parsed[i] = def.getFullYear();
                }
                break;
            case 1:
                if (value <= 0) {
                    parsed[i] = def.getMonth() + 1;
                }
                break;
            case 2:
                if (value <= 0) {
                    parsed[i] = def.getDate();
                }
                break;
        }
    }

    return new Date(parsed[0], parsed[1] - 1, parsed[2], parsed[3], parsed[4], parsed[5]);
}

/**
 * Get Error Message per gdscode
 * @param {{gdscode: Number, params: Any[]}[]} status
 * @returns {String} - Error message
 */
const lookupMessages = (status) => {
    const messages = status.map((item) => {
        let text = MessagesError[item.gdscode];
        if (text === undefined) {
            return 'Unknow error';
        }
        if (item.params !== undefined) {
            item.params.forEach((param, i) => {
                text = text.replace('@' + (i + 1), param);
            });
        }
        return text;
    });
    return messages.join(', ');
}

/**
 * Escape value
 * @param {Object} value
 * @param {Number} protocolVersion (optional, default: PROTOCOL_VERSION13)
 * @return {String}
 */
const escape = function(value, protocolVersion) {

    if (value === null || value === undefined)
        return 'NULL';

    switch (typeof(value)) {
        case 'boolean':
            if ((protocolVersion || Const.PROTOCOL_VERSION13) >= Const.PROTOCOL_VERSION13)
                return value ? 'true' : 'false';
            else
                return value ? '1' : '0';
        case 'number':
            return value.toString();
        case 'string':
            return "'" + value.replace(/'/g, "''").replace(/\\/g, '\\\\') + "'";
    }

    if (value instanceof Date)
        return "'" + value.getFullYear() + '-' + (value.getMonth()+1).toString().padLeft(2, '0') + '-' + value.getDate().toString().padLeft(2, '0') + ' ' + value.getHours().toString().padLeft(2, '0') + ':' + value.getMinutes().toString().padLeft(2, '0') + ':' + value.getSeconds().toString().padLeft(2, '0') + '.' + value.getMilliseconds().toString().padLeft(3, '0') + "'";

    throw new Error('Escape supports only primitive values.');
};

function noop() {}

module.exports = {
    escape,
    lookupMessages,
    noop,
    parseDate,
};


/***/ }),

/***/ 70857:
/***/ ((module) => {

"use strict";
module.exports = require("os");

/***/ }),

/***/ 71064:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var $Object = __webpack_require__(79612);

/** @type {import('./Object.getPrototypeOf')} */
module.exports = $Object.getPrototypeOf || null;


/***/ }),

/***/ 71514:
/***/ ((module) => {

"use strict";


/** @type {import('./abs')} */
module.exports = Math.abs;


/***/ }),

/***/ 72313:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var defer = __webpack_require__(70405);

// API
module.exports = async;

/**
 * Runs provided callback asynchronously
 * even if callback itself is not
 *
 * @param   {function} callback - callback to invoke
 * @returns {function} - augmented callback
 */
function async(callback)
{
  var isAsync = false;

  // check if async happened
  defer(function() { isAsync = true; });

  return function async_callback(err, result)
  {
    if (isAsync)
    {
      callback(err, result);
    }
    else
    {
      defer(function nextTick_callback()
      {
        callback(err, result);
      });
    }
  };
}


/***/ }),

/***/ 73093:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var $isNaN = __webpack_require__(94459);

/** @type {import('./sign')} */
module.exports = function sign(number) {
	if ($isNaN(number) || number === 0) {
		return number;
	}
	return number < 0 ? -1 : +1;
};


/***/ }),

/***/ 73126:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var bind = __webpack_require__(66743);
var $TypeError = __webpack_require__(69675);

var $call = __webpack_require__(10076);
var $actualApply = __webpack_require__(13144);

/** @type {(args: [Function, thisArg?: unknown, ...args: unknown[]]) => Function} TODO FIXME, find a way to use import('.') */
module.exports = function callBindBasic(args) {
	if (args.length < 1 || typeof args[0] !== 'function') {
		throw new $TypeError('a function is required');
	}
	return $actualApply(bind, $call, args);
};


/***/ }),

/***/ 74453:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const {doCallback, doError} = __webpack_require__(30216);
const Const = __webpack_require__(52750);

/***************************************
 *
 *   Transaction
 *
 ***************************************/

function Transaction(connection) {
    this.connection = connection;
    this.db = connection.db;
}

Transaction.prototype.newStatement = function(query, callback) {
    var cnx = this.connection;
    var self = this;
    var query_cache = cnx.getCachedQuery(query);

    if (query_cache) {
        callback(null, query_cache);
    } else {
        cnx.prepare(self, query, false, callback);
    }
};

Transaction.prototype.execute = function(query, params, callback, custom) {

    if (params instanceof Function) {
        custom = callback;
        callback = params;
        params = undefined;
    }

    var self = this;
    this.newStatement(query, function(err, statement) {

        if (err) {
            doError(err, callback);
            return;
        }

        function dropError(err) {
            statement.release();
            doCallback(err, callback);
        }

        statement.execute(self, params, function(err, ret) {
            if (err) {
                dropError(err);
                return;
            }

            switch (statement.type) {
                case Const.isc_info_sql_stmt_select:
                    statement.fetchAll(self, function(err, r) {
                        if (err) {
                            dropError(err);
                            return;
                        }

                        statement.release();

                        if (callback)
                            callback(undefined, r, statement.output, true);

                    });

                    break;

                case Const.isc_info_sql_stmt_exec_procedure:
                    if (ret && ret.data && ret.data.length > 0) {
                        statement.release();

                        if (callback)
                            callback(undefined, ret.data[0], statement.output, true);

                        break;
                    } else if (statement.output.length) {
                        statement.fetch(self, 1, function(err, ret) {
                            if (err) {
                                dropError(err);
                                return;
                            }

                            statement.release();

                            if (callback)
                                callback(undefined, ret.data[0], statement.output, false);
                        });

                        break;
                    }

                // Fall through is normal
                default:
                    statement.release();
                    if (callback)
                        callback()
                    break;
            }

        }, custom);
    });
};

Transaction.prototype.sequentially = function (query, params, on, callback, asArray) {

    if (params instanceof Function) {
        asArray = callback;
        callback = on;
        on = params;
        params = undefined;
    }

    if (on === undefined){
        throw new Error('Expected "on" delegate.');
    }

    if (callback instanceof Boolean) {
        asArray = callback;
        callback = undefined;
    }

    var self = this;
    self.execute(query, params, callback, { asObject: !asArray, asStream: true, on: on });
    return self;
};

Transaction.prototype.query = function(query, params, callback) {

    if (params instanceof Function) {
        callback = params;
        params = undefined;
    }

    if (callback === undefined)
        callback = noop;

    this.execute(query, params, callback, { asObject: true, asStream: callback === undefined || callback === null });

};

Transaction.prototype.commit = function(callback) {
    this.connection.commit(this, callback);
};

Transaction.prototype.rollback = function(callback) {
    this.connection.rollback(this, callback);
};

Transaction.prototype.commitRetaining = function(callback) {
    this.connection.commitRetaining(this, callback);
};

Transaction.prototype.rollbackRetaining = function(callback) {
    this.connection.rollbackRetaining(this, callback);
};

module.exports = Transaction;


/***/ }),

/***/ 74555:
/***/ ((module) => {

// API
module.exports = abort;

/**
 * Aborts leftover active jobs
 *
 * @param {object} state - current state object
 */
function abort(state)
{
  Object.keys(state.jobs).forEach(clean.bind(state));

  // reset leftover jobs
  state.jobs = {};
}

/**
 * Cleans up leftover job by invoking abort function for the provided job id
 *
 * @this  state
 * @param {string|number} key - job id to abort
 */
function clean(key)
{
  if (typeof this.jobs[key] == 'function')
  {
    this.jobs[key]();
  }
}


/***/ }),

/***/ 75795:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


/** @type {import('.')} */
var $gOPD = __webpack_require__(6549);

if ($gOPD) {
	try {
		$gOPD([], 'length');
	} catch (e) {
		// IE 8 has a broken gOPD
		$gOPD = null;
	}
}

module.exports = $gOPD;


/***/ }),

/***/ 75880:
/***/ ((module) => {

"use strict";


/** @type {import('./pow')} */
module.exports = Math.pow;


/***/ }),

/***/ 76033:
/***/ ((module, exports, __webpack_require__) => {

/**
 * Module dependencies.
 */

const tty = __webpack_require__(52018);
const util = __webpack_require__(39023);

/**
 * This is the Node.js implementation of `debug()`.
 */

exports.init = init;
exports.log = log;
exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;
exports.destroy = util.deprecate(
	() => {},
	'Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.'
);

/**
 * Colors.
 */

exports.colors = [6, 2, 3, 4, 5, 1];

try {
	// Optional dependency (as in, doesn't need to be installed, NOT like optionalDependencies in package.json)
	// eslint-disable-next-line import/no-extraneous-dependencies
	const supportsColor = __webpack_require__(27687);

	if (supportsColor && (supportsColor.stderr || supportsColor).level >= 2) {
		exports.colors = [
			20,
			21,
			26,
			27,
			32,
			33,
			38,
			39,
			40,
			41,
			42,
			43,
			44,
			45,
			56,
			57,
			62,
			63,
			68,
			69,
			74,
			75,
			76,
			77,
			78,
			79,
			80,
			81,
			92,
			93,
			98,
			99,
			112,
			113,
			128,
			129,
			134,
			135,
			148,
			149,
			160,
			161,
			162,
			163,
			164,
			165,
			166,
			167,
			168,
			169,
			170,
			171,
			172,
			173,
			178,
			179,
			184,
			185,
			196,
			197,
			198,
			199,
			200,
			201,
			202,
			203,
			204,
			205,
			206,
			207,
			208,
			209,
			214,
			215,
			220,
			221
		];
	}
} catch (error) {
	// Swallow - we only care if `supports-color` is available; it doesn't have to be.
}

/**
 * Build up the default `inspectOpts` object from the environment variables.
 *
 *   $ DEBUG_COLORS=no DEBUG_DEPTH=10 DEBUG_SHOW_HIDDEN=enabled node script.js
 */

exports.inspectOpts = Object.keys(process.env).filter(key => {
	return /^debug_/i.test(key);
}).reduce((obj, key) => {
	// Camel-case
	const prop = key
		.substring(6)
		.toLowerCase()
		.replace(/_([a-z])/g, (_, k) => {
			return k.toUpperCase();
		});

	// Coerce string value into JS value
	let val = process.env[key];
	if (/^(yes|on|true|enabled)$/i.test(val)) {
		val = true;
	} else if (/^(no|off|false|disabled)$/i.test(val)) {
		val = false;
	} else if (val === 'null') {
		val = null;
	} else {
		val = Number(val);
	}

	obj[prop] = val;
	return obj;
}, {});

/**
 * Is stdout a TTY? Colored output is enabled when `true`.
 */

function useColors() {
	return 'colors' in exports.inspectOpts ?
		Boolean(exports.inspectOpts.colors) :
		tty.isatty(process.stderr.fd);
}

/**
 * Adds ANSI color escape codes if enabled.
 *
 * @api public
 */

function formatArgs(args) {
	const {namespace: name, useColors} = this;

	if (useColors) {
		const c = this.color;
		const colorCode = '\u001B[3' + (c < 8 ? c : '8;5;' + c);
		const prefix = `  ${colorCode};1m${name} \u001B[0m`;

		args[0] = prefix + args[0].split('\n').join('\n' + prefix);
		args.push(colorCode + 'm+' + module.exports.humanize(this.diff) + '\u001B[0m');
	} else {
		args[0] = getDate() + name + ' ' + args[0];
	}
}

function getDate() {
	if (exports.inspectOpts.hideDate) {
		return '';
	}
	return new Date().toISOString() + ' ';
}

/**
 * Invokes `util.formatWithOptions()` with the specified arguments and writes to stderr.
 */

function log(...args) {
	return process.stderr.write(util.formatWithOptions(exports.inspectOpts, ...args) + '\n');
}

/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */
function save(namespaces) {
	if (namespaces) {
		process.env.DEBUG = namespaces;
	} else {
		// If you set a process.env field to null or undefined, it gets cast to the
		// string 'null' or 'undefined'. Just delete instead.
		delete process.env.DEBUG;
	}
}

/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */

function load() {
	return process.env.DEBUG;
}

/**
 * Init logic for `debug` instances.
 *
 * Create a new `inspectOpts` object in case `useColors` is set
 * differently for a particular `debug` instance.
 */

function init(debug) {
	debug.inspectOpts = {};

	const keys = Object.keys(exports.inspectOpts);
	for (let i = 0; i < keys.length; i++) {
		debug.inspectOpts[keys[i]] = exports.inspectOpts[keys[i]];
	}
}

module.exports = __webpack_require__(40736)(exports);

const {formatters} = module.exports;

/**
 * Map %o to `util.inspect()`, all on a single line.
 */

formatters.o = function (v) {
	this.inspectOpts.colors = this.useColors;
	return util.inspect(v, this.inspectOpts)
		.split('\n')
		.map(str => str.trim())
		.join(' ');
};

/**
 * Map %O to `util.inspect()`, allowing multiple lines if needed.
 */

formatters.O = function (v) {
	this.inspectOpts.colors = this.useColors;
	return util.inspect(v, this.inspectOpts);
};


/***/ }),

/***/ 76982:
/***/ ((module) => {

"use strict";
module.exports = require("crypto");

/***/ }),

/***/ 77507:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var debug;

module.exports = function () {
  if (!debug) {
    try {
      /* eslint global-require: off */
      debug = __webpack_require__(45753)("follow-redirects");
    }
    catch (error) { /* */ }
    if (typeof debug !== "function") {
      debug = function () { /* */ };
    }
  }
  debug.apply(null, arguments);
};


/***/ }),

/***/ 78051:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var async = __webpack_require__(72313)
  , abort = __webpack_require__(74555)
  ;

// API
module.exports = iterate;

/**
 * Iterates over each job object
 *
 * @param {array|object} list - array or object (named list) to iterate over
 * @param {function} iterator - iterator to run
 * @param {object} state - current job status
 * @param {function} callback - invoked when all elements processed
 */
function iterate(list, iterator, state, callback)
{
  // store current index
  var key = state['keyedList'] ? state['keyedList'][state.index] : state.index;

  state.jobs[key] = runJob(iterator, key, list[key], function(error, output)
  {
    // don't repeat yourself
    // skip secondary callbacks
    if (!(key in state.jobs))
    {
      return;
    }

    // clean up jobs
    delete state.jobs[key];

    if (error)
    {
      // don't process rest of the results
      // stop still active jobs
      // and reset the list
      abort(state);
    }
    else
    {
      state.results[key] = output;
    }

    // return salvaged results
    callback(error, state.results);
  });
}

/**
 * Runs iterator over provided job element
 *
 * @param   {function} iterator - iterator to invoke
 * @param   {string|number} key - key/index of the element in the list of jobs
 * @param   {mixed} item - job description
 * @param   {function} callback - invoked after iterator is done with the job
 * @returns {function|mixed} - job abort function or something else
 */
function runJob(iterator, key, item, callback)
{
  var aborter;

  // allow shortcut if iterator expects only two arguments
  if (iterator.length == 2)
  {
    aborter = iterator(item, async(callback));
  }
  // otherwise go with full three arguments
  else
  {
    aborter = iterator(item, key, async(callback));
  }

  return aborter;
}


/***/ }),

/***/ 78069:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var Stream = (__webpack_require__(2203).Stream);
var util = __webpack_require__(39023);

module.exports = DelayedStream;
function DelayedStream() {
  this.source = null;
  this.dataSize = 0;
  this.maxDataSize = 1024 * 1024;
  this.pauseStream = true;

  this._maxDataSizeExceeded = false;
  this._released = false;
  this._bufferedEvents = [];
}
util.inherits(DelayedStream, Stream);

DelayedStream.create = function(source, options) {
  var delayedStream = new this();

  options = options || {};
  for (var option in options) {
    delayedStream[option] = options[option];
  }

  delayedStream.source = source;

  var realEmit = source.emit;
  source.emit = function() {
    delayedStream._handleEmit(arguments);
    return realEmit.apply(source, arguments);
  };

  source.on('error', function() {});
  if (delayedStream.pauseStream) {
    source.pause();
  }

  return delayedStream;
};

Object.defineProperty(DelayedStream.prototype, 'readable', {
  configurable: true,
  enumerable: true,
  get: function() {
    return this.source.readable;
  }
});

DelayedStream.prototype.setEncoding = function() {
  return this.source.setEncoding.apply(this.source, arguments);
};

DelayedStream.prototype.resume = function() {
  if (!this._released) {
    this.release();
  }

  this.source.resume();
};

DelayedStream.prototype.pause = function() {
  this.source.pause();
};

DelayedStream.prototype.release = function() {
  this._released = true;

  this._bufferedEvents.forEach(function(args) {
    this.emit.apply(this, args);
  }.bind(this));
  this._bufferedEvents = [];
};

DelayedStream.prototype.pipe = function() {
  var r = Stream.prototype.pipe.apply(this, arguments);
  this.resume();
  return r;
};

DelayedStream.prototype._handleEmit = function(args) {
  if (this._released) {
    this.emit.apply(this, args);
    return;
  }

  if (args[0] === 'data') {
    this.dataSize += args[1].length;
    this._checkIfMaxDataSizeExceeded();
  }

  this._bufferedEvents.push(args);
};

DelayedStream.prototype._checkIfMaxDataSizeExceeded = function() {
  if (this._maxDataSizeExceeded) {
    return;
  }

  if (this.dataSize <= this.maxDataSize) {
    return;
  }

  this._maxDataSizeExceeded = true;
  var message =
    'DelayedStream#maxDataSize of ' + this.maxDataSize + ' bytes exceeded.'
  this.emit('error', new Error(message));
};


/***/ }),

/***/ 79290:
/***/ ((module) => {

"use strict";


/** @type {import('./range')} */
module.exports = RangeError;


/***/ }),

/***/ 79329:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/*! Axios v1.13.2 Copyright (c) 2025 Matt Zabriskie and contributors */


const FormData$1 = __webpack_require__(30737);
const crypto = __webpack_require__(76982);
const url = __webpack_require__(87016);
const proxyFromEnv = __webpack_require__(46504);
const http = __webpack_require__(58611);
const https = __webpack_require__(65692);
const http2 = __webpack_require__(85675);
const util = __webpack_require__(39023);
const followRedirects = __webpack_require__(43164);
const zlib = __webpack_require__(43106);
const stream = __webpack_require__(2203);
const events = __webpack_require__(24434);

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

const FormData__default = /*#__PURE__*/_interopDefaultLegacy(FormData$1);
const crypto__default = /*#__PURE__*/_interopDefaultLegacy(crypto);
const url__default = /*#__PURE__*/_interopDefaultLegacy(url);
const proxyFromEnv__default = /*#__PURE__*/_interopDefaultLegacy(proxyFromEnv);
const http__default = /*#__PURE__*/_interopDefaultLegacy(http);
const https__default = /*#__PURE__*/_interopDefaultLegacy(https);
const http2__default = /*#__PURE__*/_interopDefaultLegacy(http2);
const util__default = /*#__PURE__*/_interopDefaultLegacy(util);
const followRedirects__default = /*#__PURE__*/_interopDefaultLegacy(followRedirects);
const zlib__default = /*#__PURE__*/_interopDefaultLegacy(zlib);
const stream__default = /*#__PURE__*/_interopDefaultLegacy(stream);

/**
 * Create a bound version of a function with a specified `this` context
 *
 * @param {Function} fn - The function to bind
 * @param {*} thisArg - The value to be passed as the `this` parameter
 * @returns {Function} A new function that will call the original function with the specified `this` context
 */
function bind(fn, thisArg) {
  return function wrap() {
    return fn.apply(thisArg, arguments);
  };
}

// utils is a library of generic helper functions non-specific to axios

const {toString} = Object.prototype;
const {getPrototypeOf} = Object;
const {iterator, toStringTag} = Symbol;

const kindOf = (cache => thing => {
    const str = toString.call(thing);
    return cache[str] || (cache[str] = str.slice(8, -1).toLowerCase());
})(Object.create(null));

const kindOfTest = (type) => {
  type = type.toLowerCase();
  return (thing) => kindOf(thing) === type
};

const typeOfTest = type => thing => typeof thing === type;

/**
 * Determine if a value is an Array
 *
 * @param {Object} val The value to test
 *
 * @returns {boolean} True if value is an Array, otherwise false
 */
const {isArray} = Array;

/**
 * Determine if a value is undefined
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if the value is undefined, otherwise false
 */
const isUndefined = typeOfTest('undefined');

/**
 * Determine if a value is a Buffer
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a Buffer, otherwise false
 */
function isBuffer(val) {
  return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor)
    && isFunction$1(val.constructor.isBuffer) && val.constructor.isBuffer(val);
}

/**
 * Determine if a value is an ArrayBuffer
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is an ArrayBuffer, otherwise false
 */
const isArrayBuffer = kindOfTest('ArrayBuffer');


/**
 * Determine if a value is a view on an ArrayBuffer
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
 */
function isArrayBufferView(val) {
  let result;
  if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
    result = ArrayBuffer.isView(val);
  } else {
    result = (val) && (val.buffer) && (isArrayBuffer(val.buffer));
  }
  return result;
}

/**
 * Determine if a value is a String
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a String, otherwise false
 */
const isString = typeOfTest('string');

/**
 * Determine if a value is a Function
 *
 * @param {*} val The value to test
 * @returns {boolean} True if value is a Function, otherwise false
 */
const isFunction$1 = typeOfTest('function');

/**
 * Determine if a value is a Number
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a Number, otherwise false
 */
const isNumber = typeOfTest('number');

/**
 * Determine if a value is an Object
 *
 * @param {*} thing The value to test
 *
 * @returns {boolean} True if value is an Object, otherwise false
 */
const isObject = (thing) => thing !== null && typeof thing === 'object';

/**
 * Determine if a value is a Boolean
 *
 * @param {*} thing The value to test
 * @returns {boolean} True if value is a Boolean, otherwise false
 */
const isBoolean = thing => thing === true || thing === false;

/**
 * Determine if a value is a plain Object
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a plain Object, otherwise false
 */
const isPlainObject = (val) => {
  if (kindOf(val) !== 'object') {
    return false;
  }

  const prototype = getPrototypeOf(val);
  return (prototype === null || prototype === Object.prototype || Object.getPrototypeOf(prototype) === null) && !(toStringTag in val) && !(iterator in val);
};

/**
 * Determine if a value is an empty object (safely handles Buffers)
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is an empty object, otherwise false
 */
const isEmptyObject = (val) => {
  // Early return for non-objects or Buffers to prevent RangeError
  if (!isObject(val) || isBuffer(val)) {
    return false;
  }

  try {
    return Object.keys(val).length === 0 && Object.getPrototypeOf(val) === Object.prototype;
  } catch (e) {
    // Fallback for any other objects that might cause RangeError with Object.keys()
    return false;
  }
};

/**
 * Determine if a value is a Date
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a Date, otherwise false
 */
const isDate = kindOfTest('Date');

/**
 * Determine if a value is a File
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a File, otherwise false
 */
const isFile = kindOfTest('File');

/**
 * Determine if a value is a Blob
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a Blob, otherwise false
 */
const isBlob = kindOfTest('Blob');

/**
 * Determine if a value is a FileList
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a File, otherwise false
 */
const isFileList = kindOfTest('FileList');

/**
 * Determine if a value is a Stream
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a Stream, otherwise false
 */
const isStream = (val) => isObject(val) && isFunction$1(val.pipe);

/**
 * Determine if a value is a FormData
 *
 * @param {*} thing The value to test
 *
 * @returns {boolean} True if value is an FormData, otherwise false
 */
const isFormData = (thing) => {
  let kind;
  return thing && (
    (typeof FormData === 'function' && thing instanceof FormData) || (
      isFunction$1(thing.append) && (
        (kind = kindOf(thing)) === 'formdata' ||
        // detect form-data instance
        (kind === 'object' && isFunction$1(thing.toString) && thing.toString() === '[object FormData]')
      )
    )
  )
};

/**
 * Determine if a value is a URLSearchParams object
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a URLSearchParams object, otherwise false
 */
const isURLSearchParams = kindOfTest('URLSearchParams');

const [isReadableStream, isRequest, isResponse, isHeaders] = ['ReadableStream', 'Request', 'Response', 'Headers'].map(kindOfTest);

/**
 * Trim excess whitespace off the beginning and end of a string
 *
 * @param {String} str The String to trim
 *
 * @returns {String} The String freed of excess whitespace
 */
const trim = (str) => str.trim ?
  str.trim() : str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');

/**
 * Iterate over an Array or an Object invoking a function for each item.
 *
 * If `obj` is an Array callback will be called passing
 * the value, index, and complete array for each item.
 *
 * If 'obj' is an Object callback will be called passing
 * the value, key, and complete object for each property.
 *
 * @param {Object|Array} obj The object to iterate
 * @param {Function} fn The callback to invoke for each item
 *
 * @param {Boolean} [allOwnKeys = false]
 * @returns {any}
 */
function forEach(obj, fn, {allOwnKeys = false} = {}) {
  // Don't bother if no value provided
  if (obj === null || typeof obj === 'undefined') {
    return;
  }

  let i;
  let l;

  // Force an array if not already something iterable
  if (typeof obj !== 'object') {
    /*eslint no-param-reassign:0*/
    obj = [obj];
  }

  if (isArray(obj)) {
    // Iterate over array values
    for (i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else {
    // Buffer check
    if (isBuffer(obj)) {
      return;
    }

    // Iterate over object keys
    const keys = allOwnKeys ? Object.getOwnPropertyNames(obj) : Object.keys(obj);
    const len = keys.length;
    let key;

    for (i = 0; i < len; i++) {
      key = keys[i];
      fn.call(null, obj[key], key, obj);
    }
  }
}

function findKey(obj, key) {
  if (isBuffer(obj)){
    return null;
  }

  key = key.toLowerCase();
  const keys = Object.keys(obj);
  let i = keys.length;
  let _key;
  while (i-- > 0) {
    _key = keys[i];
    if (key === _key.toLowerCase()) {
      return _key;
    }
  }
  return null;
}

const _global = (() => {
  /*eslint no-undef:0*/
  if (typeof globalThis !== "undefined") return globalThis;
  return typeof self !== "undefined" ? self : (typeof window !== 'undefined' ? window : global)
})();

const isContextDefined = (context) => !isUndefined(context) && context !== _global;

/**
 * Accepts varargs expecting each argument to be an object, then
 * immutably merges the properties of each object and returns result.
 *
 * When multiple objects contain the same key the later object in
 * the arguments list will take precedence.
 *
 * Example:
 *
 * ```js
 * var result = merge({foo: 123}, {foo: 456});
 * console.log(result.foo); // outputs 456
 * ```
 *
 * @param {Object} obj1 Object to merge
 *
 * @returns {Object} Result of all merge properties
 */
function merge(/* obj1, obj2, obj3, ... */) {
  const {caseless, skipUndefined} = isContextDefined(this) && this || {};
  const result = {};
  const assignValue = (val, key) => {
    const targetKey = caseless && findKey(result, key) || key;
    if (isPlainObject(result[targetKey]) && isPlainObject(val)) {
      result[targetKey] = merge(result[targetKey], val);
    } else if (isPlainObject(val)) {
      result[targetKey] = merge({}, val);
    } else if (isArray(val)) {
      result[targetKey] = val.slice();
    } else if (!skipUndefined || !isUndefined(val)) {
      result[targetKey] = val;
    }
  };

  for (let i = 0, l = arguments.length; i < l; i++) {
    arguments[i] && forEach(arguments[i], assignValue);
  }
  return result;
}

/**
 * Extends object a by mutably adding to it the properties of object b.
 *
 * @param {Object} a The object to be extended
 * @param {Object} b The object to copy properties from
 * @param {Object} thisArg The object to bind function to
 *
 * @param {Boolean} [allOwnKeys]
 * @returns {Object} The resulting value of object a
 */
const extend = (a, b, thisArg, {allOwnKeys}= {}) => {
  forEach(b, (val, key) => {
    if (thisArg && isFunction$1(val)) {
      a[key] = bind(val, thisArg);
    } else {
      a[key] = val;
    }
  }, {allOwnKeys});
  return a;
};

/**
 * Remove byte order marker. This catches EF BB BF (the UTF-8 BOM)
 *
 * @param {string} content with BOM
 *
 * @returns {string} content value without BOM
 */
const stripBOM = (content) => {
  if (content.charCodeAt(0) === 0xFEFF) {
    content = content.slice(1);
  }
  return content;
};

/**
 * Inherit the prototype methods from one constructor into another
 * @param {function} constructor
 * @param {function} superConstructor
 * @param {object} [props]
 * @param {object} [descriptors]
 *
 * @returns {void}
 */
const inherits = (constructor, superConstructor, props, descriptors) => {
  constructor.prototype = Object.create(superConstructor.prototype, descriptors);
  constructor.prototype.constructor = constructor;
  Object.defineProperty(constructor, 'super', {
    value: superConstructor.prototype
  });
  props && Object.assign(constructor.prototype, props);
};

/**
 * Resolve object with deep prototype chain to a flat object
 * @param {Object} sourceObj source object
 * @param {Object} [destObj]
 * @param {Function|Boolean} [filter]
 * @param {Function} [propFilter]
 *
 * @returns {Object}
 */
const toFlatObject = (sourceObj, destObj, filter, propFilter) => {
  let props;
  let i;
  let prop;
  const merged = {};

  destObj = destObj || {};
  // eslint-disable-next-line no-eq-null,eqeqeq
  if (sourceObj == null) return destObj;

  do {
    props = Object.getOwnPropertyNames(sourceObj);
    i = props.length;
    while (i-- > 0) {
      prop = props[i];
      if ((!propFilter || propFilter(prop, sourceObj, destObj)) && !merged[prop]) {
        destObj[prop] = sourceObj[prop];
        merged[prop] = true;
      }
    }
    sourceObj = filter !== false && getPrototypeOf(sourceObj);
  } while (sourceObj && (!filter || filter(sourceObj, destObj)) && sourceObj !== Object.prototype);

  return destObj;
};

/**
 * Determines whether a string ends with the characters of a specified string
 *
 * @param {String} str
 * @param {String} searchString
 * @param {Number} [position= 0]
 *
 * @returns {boolean}
 */
const endsWith = (str, searchString, position) => {
  str = String(str);
  if (position === undefined || position > str.length) {
    position = str.length;
  }
  position -= searchString.length;
  const lastIndex = str.indexOf(searchString, position);
  return lastIndex !== -1 && lastIndex === position;
};


/**
 * Returns new array from array like object or null if failed
 *
 * @param {*} [thing]
 *
 * @returns {?Array}
 */
const toArray = (thing) => {
  if (!thing) return null;
  if (isArray(thing)) return thing;
  let i = thing.length;
  if (!isNumber(i)) return null;
  const arr = new Array(i);
  while (i-- > 0) {
    arr[i] = thing[i];
  }
  return arr;
};

/**
 * Checking if the Uint8Array exists and if it does, it returns a function that checks if the
 * thing passed in is an instance of Uint8Array
 *
 * @param {TypedArray}
 *
 * @returns {Array}
 */
// eslint-disable-next-line func-names
const isTypedArray = (TypedArray => {
  // eslint-disable-next-line func-names
  return thing => {
    return TypedArray && thing instanceof TypedArray;
  };
})(typeof Uint8Array !== 'undefined' && getPrototypeOf(Uint8Array));

/**
 * For each entry in the object, call the function with the key and value.
 *
 * @param {Object<any, any>} obj - The object to iterate over.
 * @param {Function} fn - The function to call for each entry.
 *
 * @returns {void}
 */
const forEachEntry = (obj, fn) => {
  const generator = obj && obj[iterator];

  const _iterator = generator.call(obj);

  let result;

  while ((result = _iterator.next()) && !result.done) {
    const pair = result.value;
    fn.call(obj, pair[0], pair[1]);
  }
};

/**
 * It takes a regular expression and a string, and returns an array of all the matches
 *
 * @param {string} regExp - The regular expression to match against.
 * @param {string} str - The string to search.
 *
 * @returns {Array<boolean>}
 */
const matchAll = (regExp, str) => {
  let matches;
  const arr = [];

  while ((matches = regExp.exec(str)) !== null) {
    arr.push(matches);
  }

  return arr;
};

/* Checking if the kindOfTest function returns true when passed an HTMLFormElement. */
const isHTMLForm = kindOfTest('HTMLFormElement');

const toCamelCase = str => {
  return str.toLowerCase().replace(/[-_\s]([a-z\d])(\w*)/g,
    function replacer(m, p1, p2) {
      return p1.toUpperCase() + p2;
    }
  );
};

/* Creating a function that will check if an object has a property. */
const hasOwnProperty = (({hasOwnProperty}) => (obj, prop) => hasOwnProperty.call(obj, prop))(Object.prototype);

/**
 * Determine if a value is a RegExp object
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a RegExp object, otherwise false
 */
const isRegExp = kindOfTest('RegExp');

const reduceDescriptors = (obj, reducer) => {
  const descriptors = Object.getOwnPropertyDescriptors(obj);
  const reducedDescriptors = {};

  forEach(descriptors, (descriptor, name) => {
    let ret;
    if ((ret = reducer(descriptor, name, obj)) !== false) {
      reducedDescriptors[name] = ret || descriptor;
    }
  });

  Object.defineProperties(obj, reducedDescriptors);
};

/**
 * Makes all methods read-only
 * @param {Object} obj
 */

const freezeMethods = (obj) => {
  reduceDescriptors(obj, (descriptor, name) => {
    // skip restricted props in strict mode
    if (isFunction$1(obj) && ['arguments', 'caller', 'callee'].indexOf(name) !== -1) {
      return false;
    }

    const value = obj[name];

    if (!isFunction$1(value)) return;

    descriptor.enumerable = false;

    if ('writable' in descriptor) {
      descriptor.writable = false;
      return;
    }

    if (!descriptor.set) {
      descriptor.set = () => {
        throw Error('Can not rewrite read-only method \'' + name + '\'');
      };
    }
  });
};

const toObjectSet = (arrayOrString, delimiter) => {
  const obj = {};

  const define = (arr) => {
    arr.forEach(value => {
      obj[value] = true;
    });
  };

  isArray(arrayOrString) ? define(arrayOrString) : define(String(arrayOrString).split(delimiter));

  return obj;
};

const noop = () => {};

const toFiniteNumber = (value, defaultValue) => {
  return value != null && Number.isFinite(value = +value) ? value : defaultValue;
};



/**
 * If the thing is a FormData object, return true, otherwise return false.
 *
 * @param {unknown} thing - The thing to check.
 *
 * @returns {boolean}
 */
function isSpecCompliantForm(thing) {
  return !!(thing && isFunction$1(thing.append) && thing[toStringTag] === 'FormData' && thing[iterator]);
}

const toJSONObject = (obj) => {
  const stack = new Array(10);

  const visit = (source, i) => {

    if (isObject(source)) {
      if (stack.indexOf(source) >= 0) {
        return;
      }

      //Buffer check
      if (isBuffer(source)) {
        return source;
      }

      if(!('toJSON' in source)) {
        stack[i] = source;
        const target = isArray(source) ? [] : {};

        forEach(source, (value, key) => {
          const reducedValue = visit(value, i + 1);
          !isUndefined(reducedValue) && (target[key] = reducedValue);
        });

        stack[i] = undefined;

        return target;
      }
    }

    return source;
  };

  return visit(obj, 0);
};

const isAsyncFn = kindOfTest('AsyncFunction');

const isThenable = (thing) =>
  thing && (isObject(thing) || isFunction$1(thing)) && isFunction$1(thing.then) && isFunction$1(thing.catch);

// original code
// https://github.com/DigitalBrainJS/AxiosPromise/blob/16deab13710ec09779922131f3fa5954320f83ab/lib/utils.js#L11-L34

const _setImmediate = ((setImmediateSupported, postMessageSupported) => {
  if (setImmediateSupported) {
    return setImmediate;
  }

  return postMessageSupported ? ((token, callbacks) => {
    _global.addEventListener("message", ({source, data}) => {
      if (source === _global && data === token) {
        callbacks.length && callbacks.shift()();
      }
    }, false);

    return (cb) => {
      callbacks.push(cb);
      _global.postMessage(token, "*");
    }
  })(`axios@${Math.random()}`, []) : (cb) => setTimeout(cb);
})(
  typeof setImmediate === 'function',
  isFunction$1(_global.postMessage)
);

const asap = typeof queueMicrotask !== 'undefined' ?
  queueMicrotask.bind(_global) : ( typeof process !== 'undefined' && process.nextTick || _setImmediate);

// *********************


const isIterable = (thing) => thing != null && isFunction$1(thing[iterator]);


const utils$1 = {
  isArray,
  isArrayBuffer,
  isBuffer,
  isFormData,
  isArrayBufferView,
  isString,
  isNumber,
  isBoolean,
  isObject,
  isPlainObject,
  isEmptyObject,
  isReadableStream,
  isRequest,
  isResponse,
  isHeaders,
  isUndefined,
  isDate,
  isFile,
  isBlob,
  isRegExp,
  isFunction: isFunction$1,
  isStream,
  isURLSearchParams,
  isTypedArray,
  isFileList,
  forEach,
  merge,
  extend,
  trim,
  stripBOM,
  inherits,
  toFlatObject,
  kindOf,
  kindOfTest,
  endsWith,
  toArray,
  forEachEntry,
  matchAll,
  isHTMLForm,
  hasOwnProperty,
  hasOwnProp: hasOwnProperty, // an alias to avoid ESLint no-prototype-builtins detection
  reduceDescriptors,
  freezeMethods,
  toObjectSet,
  toCamelCase,
  noop,
  toFiniteNumber,
  findKey,
  global: _global,
  isContextDefined,
  isSpecCompliantForm,
  toJSONObject,
  isAsyncFn,
  isThenable,
  setImmediate: _setImmediate,
  asap,
  isIterable
};

/**
 * Create an Error with the specified message, config, error code, request and response.
 *
 * @param {string} message The error message.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [config] The config.
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 *
 * @returns {Error} The created error.
 */
function AxiosError(message, code, config, request, response) {
  Error.call(this);

  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, this.constructor);
  } else {
    this.stack = (new Error()).stack;
  }

  this.message = message;
  this.name = 'AxiosError';
  code && (this.code = code);
  config && (this.config = config);
  request && (this.request = request);
  if (response) {
    this.response = response;
    this.status = response.status ? response.status : null;
  }
}

utils$1.inherits(AxiosError, Error, {
  toJSON: function toJSON() {
    return {
      // Standard
      message: this.message,
      name: this.name,
      // Microsoft
      description: this.description,
      number: this.number,
      // Mozilla
      fileName: this.fileName,
      lineNumber: this.lineNumber,
      columnNumber: this.columnNumber,
      stack: this.stack,
      // Axios
      config: utils$1.toJSONObject(this.config),
      code: this.code,
      status: this.status
    };
  }
});

const prototype$1 = AxiosError.prototype;
const descriptors = {};

[
  'ERR_BAD_OPTION_VALUE',
  'ERR_BAD_OPTION',
  'ECONNABORTED',
  'ETIMEDOUT',
  'ERR_NETWORK',
  'ERR_FR_TOO_MANY_REDIRECTS',
  'ERR_DEPRECATED',
  'ERR_BAD_RESPONSE',
  'ERR_BAD_REQUEST',
  'ERR_CANCELED',
  'ERR_NOT_SUPPORT',
  'ERR_INVALID_URL'
// eslint-disable-next-line func-names
].forEach(code => {
  descriptors[code] = {value: code};
});

Object.defineProperties(AxiosError, descriptors);
Object.defineProperty(prototype$1, 'isAxiosError', {value: true});

// eslint-disable-next-line func-names
AxiosError.from = (error, code, config, request, response, customProps) => {
  const axiosError = Object.create(prototype$1);

  utils$1.toFlatObject(error, axiosError, function filter(obj) {
    return obj !== Error.prototype;
  }, prop => {
    return prop !== 'isAxiosError';
  });

  const msg = error && error.message ? error.message : 'Error';

  // Prefer explicit code; otherwise copy the low-level error's code (e.g. ECONNREFUSED)
  const errCode = code == null && error ? error.code : code;
  AxiosError.call(axiosError, msg, errCode, config, request, response);

  // Chain the original error on the standard field; non-enumerable to avoid JSON noise
  if (error && axiosError.cause == null) {
    Object.defineProperty(axiosError, 'cause', { value: error, configurable: true });
  }

  axiosError.name = (error && error.name) || 'Error';

  customProps && Object.assign(axiosError, customProps);

  return axiosError;
};

/**
 * Determines if the given thing is a array or js object.
 *
 * @param {string} thing - The object or array to be visited.
 *
 * @returns {boolean}
 */
function isVisitable(thing) {
  return utils$1.isPlainObject(thing) || utils$1.isArray(thing);
}

/**
 * It removes the brackets from the end of a string
 *
 * @param {string} key - The key of the parameter.
 *
 * @returns {string} the key without the brackets.
 */
function removeBrackets(key) {
  return utils$1.endsWith(key, '[]') ? key.slice(0, -2) : key;
}

/**
 * It takes a path, a key, and a boolean, and returns a string
 *
 * @param {string} path - The path to the current key.
 * @param {string} key - The key of the current object being iterated over.
 * @param {string} dots - If true, the key will be rendered with dots instead of brackets.
 *
 * @returns {string} The path to the current key.
 */
function renderKey(path, key, dots) {
  if (!path) return key;
  return path.concat(key).map(function each(token, i) {
    // eslint-disable-next-line no-param-reassign
    token = removeBrackets(token);
    return !dots && i ? '[' + token + ']' : token;
  }).join(dots ? '.' : '');
}

/**
 * If the array is an array and none of its elements are visitable, then it's a flat array.
 *
 * @param {Array<any>} arr - The array to check
 *
 * @returns {boolean}
 */
function isFlatArray(arr) {
  return utils$1.isArray(arr) && !arr.some(isVisitable);
}

const predicates = utils$1.toFlatObject(utils$1, {}, null, function filter(prop) {
  return /^is[A-Z]/.test(prop);
});

/**
 * Convert a data object to FormData
 *
 * @param {Object} obj
 * @param {?Object} [formData]
 * @param {?Object} [options]
 * @param {Function} [options.visitor]
 * @param {Boolean} [options.metaTokens = true]
 * @param {Boolean} [options.dots = false]
 * @param {?Boolean} [options.indexes = false]
 *
 * @returns {Object}
 **/

/**
 * It converts an object into a FormData object
 *
 * @param {Object<any, any>} obj - The object to convert to form data.
 * @param {string} formData - The FormData object to append to.
 * @param {Object<string, any>} options
 *
 * @returns
 */
function toFormData(obj, formData, options) {
  if (!utils$1.isObject(obj)) {
    throw new TypeError('target must be an object');
  }

  // eslint-disable-next-line no-param-reassign
  formData = formData || new (FormData__default["default"] || FormData)();

  // eslint-disable-next-line no-param-reassign
  options = utils$1.toFlatObject(options, {
    metaTokens: true,
    dots: false,
    indexes: false
  }, false, function defined(option, source) {
    // eslint-disable-next-line no-eq-null,eqeqeq
    return !utils$1.isUndefined(source[option]);
  });

  const metaTokens = options.metaTokens;
  // eslint-disable-next-line no-use-before-define
  const visitor = options.visitor || defaultVisitor;
  const dots = options.dots;
  const indexes = options.indexes;
  const _Blob = options.Blob || typeof Blob !== 'undefined' && Blob;
  const useBlob = _Blob && utils$1.isSpecCompliantForm(formData);

  if (!utils$1.isFunction(visitor)) {
    throw new TypeError('visitor must be a function');
  }

  function convertValue(value) {
    if (value === null) return '';

    if (utils$1.isDate(value)) {
      return value.toISOString();
    }

    if (utils$1.isBoolean(value)) {
      return value.toString();
    }

    if (!useBlob && utils$1.isBlob(value)) {
      throw new AxiosError('Blob is not supported. Use a Buffer instead.');
    }

    if (utils$1.isArrayBuffer(value) || utils$1.isTypedArray(value)) {
      return useBlob && typeof Blob === 'function' ? new Blob([value]) : Buffer.from(value);
    }

    return value;
  }

  /**
   * Default visitor.
   *
   * @param {*} value
   * @param {String|Number} key
   * @param {Array<String|Number>} path
   * @this {FormData}
   *
   * @returns {boolean} return true to visit the each prop of the value recursively
   */
  function defaultVisitor(value, key, path) {
    let arr = value;

    if (value && !path && typeof value === 'object') {
      if (utils$1.endsWith(key, '{}')) {
        // eslint-disable-next-line no-param-reassign
        key = metaTokens ? key : key.slice(0, -2);
        // eslint-disable-next-line no-param-reassign
        value = JSON.stringify(value);
      } else if (
        (utils$1.isArray(value) && isFlatArray(value)) ||
        ((utils$1.isFileList(value) || utils$1.endsWith(key, '[]')) && (arr = utils$1.toArray(value))
        )) {
        // eslint-disable-next-line no-param-reassign
        key = removeBrackets(key);

        arr.forEach(function each(el, index) {
          !(utils$1.isUndefined(el) || el === null) && formData.append(
            // eslint-disable-next-line no-nested-ternary
            indexes === true ? renderKey([key], index, dots) : (indexes === null ? key : key + '[]'),
            convertValue(el)
          );
        });
        return false;
      }
    }

    if (isVisitable(value)) {
      return true;
    }

    formData.append(renderKey(path, key, dots), convertValue(value));

    return false;
  }

  const stack = [];

  const exposedHelpers = Object.assign(predicates, {
    defaultVisitor,
    convertValue,
    isVisitable
  });

  function build(value, path) {
    if (utils$1.isUndefined(value)) return;

    if (stack.indexOf(value) !== -1) {
      throw Error('Circular reference detected in ' + path.join('.'));
    }

    stack.push(value);

    utils$1.forEach(value, function each(el, key) {
      const result = !(utils$1.isUndefined(el) || el === null) && visitor.call(
        formData, el, utils$1.isString(key) ? key.trim() : key, path, exposedHelpers
      );

      if (result === true) {
        build(el, path ? path.concat(key) : [key]);
      }
    });

    stack.pop();
  }

  if (!utils$1.isObject(obj)) {
    throw new TypeError('data must be an object');
  }

  build(obj);

  return formData;
}

/**
 * It encodes a string by replacing all characters that are not in the unreserved set with
 * their percent-encoded equivalents
 *
 * @param {string} str - The string to encode.
 *
 * @returns {string} The encoded string.
 */
function encode$1(str) {
  const charMap = {
    '!': '%21',
    "'": '%27',
    '(': '%28',
    ')': '%29',
    '~': '%7E',
    '%20': '+',
    '%00': '\x00'
  };
  return encodeURIComponent(str).replace(/[!'()~]|%20|%00/g, function replacer(match) {
    return charMap[match];
  });
}

/**
 * It takes a params object and converts it to a FormData object
 *
 * @param {Object<string, any>} params - The parameters to be converted to a FormData object.
 * @param {Object<string, any>} options - The options object passed to the Axios constructor.
 *
 * @returns {void}
 */
function AxiosURLSearchParams(params, options) {
  this._pairs = [];

  params && toFormData(params, this, options);
}

const prototype = AxiosURLSearchParams.prototype;

prototype.append = function append(name, value) {
  this._pairs.push([name, value]);
};

prototype.toString = function toString(encoder) {
  const _encode = encoder ? function(value) {
    return encoder.call(this, value, encode$1);
  } : encode$1;

  return this._pairs.map(function each(pair) {
    return _encode(pair[0]) + '=' + _encode(pair[1]);
  }, '').join('&');
};

/**
 * It replaces all instances of the characters `:`, `$`, `,`, `+`, `[`, and `]` with their
 * URI encoded counterparts
 *
 * @param {string} val The value to be encoded.
 *
 * @returns {string} The encoded value.
 */
function encode(val) {
  return encodeURIComponent(val).
    replace(/%3A/gi, ':').
    replace(/%24/g, '$').
    replace(/%2C/gi, ',').
    replace(/%20/g, '+');
}

/**
 * Build a URL by appending params to the end
 *
 * @param {string} url The base of the url (e.g., http://www.google.com)
 * @param {object} [params] The params to be appended
 * @param {?(object|Function)} options
 *
 * @returns {string} The formatted url
 */
function buildURL(url, params, options) {
  /*eslint no-param-reassign:0*/
  if (!params) {
    return url;
  }
  
  const _encode = options && options.encode || encode;

  if (utils$1.isFunction(options)) {
    options = {
      serialize: options
    };
  } 

  const serializeFn = options && options.serialize;

  let serializedParams;

  if (serializeFn) {
    serializedParams = serializeFn(params, options);
  } else {
    serializedParams = utils$1.isURLSearchParams(params) ?
      params.toString() :
      new AxiosURLSearchParams(params, options).toString(_encode);
  }

  if (serializedParams) {
    const hashmarkIndex = url.indexOf("#");

    if (hashmarkIndex !== -1) {
      url = url.slice(0, hashmarkIndex);
    }
    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
  }

  return url;
}

class InterceptorManager {
  constructor() {
    this.handlers = [];
  }

  /**
   * Add a new interceptor to the stack
   *
   * @param {Function} fulfilled The function to handle `then` for a `Promise`
   * @param {Function} rejected The function to handle `reject` for a `Promise`
   *
   * @return {Number} An ID used to remove interceptor later
   */
  use(fulfilled, rejected, options) {
    this.handlers.push({
      fulfilled,
      rejected,
      synchronous: options ? options.synchronous : false,
      runWhen: options ? options.runWhen : null
    });
    return this.handlers.length - 1;
  }

  /**
   * Remove an interceptor from the stack
   *
   * @param {Number} id The ID that was returned by `use`
   *
   * @returns {void}
   */
  eject(id) {
    if (this.handlers[id]) {
      this.handlers[id] = null;
    }
  }

  /**
   * Clear all interceptors from the stack
   *
   * @returns {void}
   */
  clear() {
    if (this.handlers) {
      this.handlers = [];
    }
  }

  /**
   * Iterate over all the registered interceptors
   *
   * This method is particularly useful for skipping over any
   * interceptors that may have become `null` calling `eject`.
   *
   * @param {Function} fn The function to call for each interceptor
   *
   * @returns {void}
   */
  forEach(fn) {
    utils$1.forEach(this.handlers, function forEachHandler(h) {
      if (h !== null) {
        fn(h);
      }
    });
  }
}

const InterceptorManager$1 = InterceptorManager;

const transitionalDefaults = {
  silentJSONParsing: true,
  forcedJSONParsing: true,
  clarifyTimeoutError: false
};

const URLSearchParams = url__default["default"].URLSearchParams;

const ALPHA = 'abcdefghijklmnopqrstuvwxyz';

const DIGIT = '0123456789';

const ALPHABET = {
  DIGIT,
  ALPHA,
  ALPHA_DIGIT: ALPHA + ALPHA.toUpperCase() + DIGIT
};

const generateString = (size = 16, alphabet = ALPHABET.ALPHA_DIGIT) => {
  let str = '';
  const {length} = alphabet;
  const randomValues = new Uint32Array(size);
  crypto__default["default"].randomFillSync(randomValues);
  for (let i = 0; i < size; i++) {
    str += alphabet[randomValues[i] % length];
  }

  return str;
};


const platform$1 = {
  isNode: true,
  classes: {
    URLSearchParams,
    FormData: FormData__default["default"],
    Blob: typeof Blob !== 'undefined' && Blob || null
  },
  ALPHABET,
  generateString,
  protocols: [ 'http', 'https', 'file', 'data' ]
};

const hasBrowserEnv = typeof window !== 'undefined' && typeof document !== 'undefined';

const _navigator = typeof navigator === 'object' && navigator || undefined;

/**
 * Determine if we're running in a standard browser environment
 *
 * This allows axios to run in a web worker, and react-native.
 * Both environments support XMLHttpRequest, but not fully standard globals.
 *
 * web workers:
 *  typeof window -> undefined
 *  typeof document -> undefined
 *
 * react-native:
 *  navigator.product -> 'ReactNative'
 * nativescript
 *  navigator.product -> 'NativeScript' or 'NS'
 *
 * @returns {boolean}
 */
const hasStandardBrowserEnv = hasBrowserEnv &&
  (!_navigator || ['ReactNative', 'NativeScript', 'NS'].indexOf(_navigator.product) < 0);

/**
 * Determine if we're running in a standard browser webWorker environment
 *
 * Although the `isStandardBrowserEnv` method indicates that
 * `allows axios to run in a web worker`, the WebWorker will still be
 * filtered out due to its judgment standard
 * `typeof window !== 'undefined' && typeof document !== 'undefined'`.
 * This leads to a problem when axios post `FormData` in webWorker
 */
const hasStandardBrowserWebWorkerEnv = (() => {
  return (
    typeof WorkerGlobalScope !== 'undefined' &&
    // eslint-disable-next-line no-undef
    self instanceof WorkerGlobalScope &&
    typeof self.importScripts === 'function'
  );
})();

const origin = hasBrowserEnv && window.location.href || 'http://localhost';

const utils = /*#__PURE__*/Object.freeze({
  __proto__: null,
  hasBrowserEnv: hasBrowserEnv,
  hasStandardBrowserWebWorkerEnv: hasStandardBrowserWebWorkerEnv,
  hasStandardBrowserEnv: hasStandardBrowserEnv,
  navigator: _navigator,
  origin: origin
});

const platform = {
  ...utils,
  ...platform$1
};

function toURLEncodedForm(data, options) {
  return toFormData(data, new platform.classes.URLSearchParams(), {
    visitor: function(value, key, path, helpers) {
      if (platform.isNode && utils$1.isBuffer(value)) {
        this.append(key, value.toString('base64'));
        return false;
      }

      return helpers.defaultVisitor.apply(this, arguments);
    },
    ...options
  });
}

/**
 * It takes a string like `foo[x][y][z]` and returns an array like `['foo', 'x', 'y', 'z']
 *
 * @param {string} name - The name of the property to get.
 *
 * @returns An array of strings.
 */
function parsePropPath(name) {
  // foo[x][y][z]
  // foo.x.y.z
  // foo-x-y-z
  // foo x y z
  return utils$1.matchAll(/\w+|\[(\w*)]/g, name).map(match => {
    return match[0] === '[]' ? '' : match[1] || match[0];
  });
}

/**
 * Convert an array to an object.
 *
 * @param {Array<any>} arr - The array to convert to an object.
 *
 * @returns An object with the same keys and values as the array.
 */
function arrayToObject(arr) {
  const obj = {};
  const keys = Object.keys(arr);
  let i;
  const len = keys.length;
  let key;
  for (i = 0; i < len; i++) {
    key = keys[i];
    obj[key] = arr[key];
  }
  return obj;
}

/**
 * It takes a FormData object and returns a JavaScript object
 *
 * @param {string} formData The FormData object to convert to JSON.
 *
 * @returns {Object<string, any> | null} The converted object.
 */
function formDataToJSON(formData) {
  function buildPath(path, value, target, index) {
    let name = path[index++];

    if (name === '__proto__') return true;

    const isNumericKey = Number.isFinite(+name);
    const isLast = index >= path.length;
    name = !name && utils$1.isArray(target) ? target.length : name;

    if (isLast) {
      if (utils$1.hasOwnProp(target, name)) {
        target[name] = [target[name], value];
      } else {
        target[name] = value;
      }

      return !isNumericKey;
    }

    if (!target[name] || !utils$1.isObject(target[name])) {
      target[name] = [];
    }

    const result = buildPath(path, value, target[name], index);

    if (result && utils$1.isArray(target[name])) {
      target[name] = arrayToObject(target[name]);
    }

    return !isNumericKey;
  }

  if (utils$1.isFormData(formData) && utils$1.isFunction(formData.entries)) {
    const obj = {};

    utils$1.forEachEntry(formData, (name, value) => {
      buildPath(parsePropPath(name), value, obj, 0);
    });

    return obj;
  }

  return null;
}

/**
 * It takes a string, tries to parse it, and if it fails, it returns the stringified version
 * of the input
 *
 * @param {any} rawValue - The value to be stringified.
 * @param {Function} parser - A function that parses a string into a JavaScript object.
 * @param {Function} encoder - A function that takes a value and returns a string.
 *
 * @returns {string} A stringified version of the rawValue.
 */
function stringifySafely(rawValue, parser, encoder) {
  if (utils$1.isString(rawValue)) {
    try {
      (parser || JSON.parse)(rawValue);
      return utils$1.trim(rawValue);
    } catch (e) {
      if (e.name !== 'SyntaxError') {
        throw e;
      }
    }
  }

  return (encoder || JSON.stringify)(rawValue);
}

const defaults = {

  transitional: transitionalDefaults,

  adapter: ['xhr', 'http', 'fetch'],

  transformRequest: [function transformRequest(data, headers) {
    const contentType = headers.getContentType() || '';
    const hasJSONContentType = contentType.indexOf('application/json') > -1;
    const isObjectPayload = utils$1.isObject(data);

    if (isObjectPayload && utils$1.isHTMLForm(data)) {
      data = new FormData(data);
    }

    const isFormData = utils$1.isFormData(data);

    if (isFormData) {
      return hasJSONContentType ? JSON.stringify(formDataToJSON(data)) : data;
    }

    if (utils$1.isArrayBuffer(data) ||
      utils$1.isBuffer(data) ||
      utils$1.isStream(data) ||
      utils$1.isFile(data) ||
      utils$1.isBlob(data) ||
      utils$1.isReadableStream(data)
    ) {
      return data;
    }
    if (utils$1.isArrayBufferView(data)) {
      return data.buffer;
    }
    if (utils$1.isURLSearchParams(data)) {
      headers.setContentType('application/x-www-form-urlencoded;charset=utf-8', false);
      return data.toString();
    }

    let isFileList;

    if (isObjectPayload) {
      if (contentType.indexOf('application/x-www-form-urlencoded') > -1) {
        return toURLEncodedForm(data, this.formSerializer).toString();
      }

      if ((isFileList = utils$1.isFileList(data)) || contentType.indexOf('multipart/form-data') > -1) {
        const _FormData = this.env && this.env.FormData;

        return toFormData(
          isFileList ? {'files[]': data} : data,
          _FormData && new _FormData(),
          this.formSerializer
        );
      }
    }

    if (isObjectPayload || hasJSONContentType ) {
      headers.setContentType('application/json', false);
      return stringifySafely(data);
    }

    return data;
  }],

  transformResponse: [function transformResponse(data) {
    const transitional = this.transitional || defaults.transitional;
    const forcedJSONParsing = transitional && transitional.forcedJSONParsing;
    const JSONRequested = this.responseType === 'json';

    if (utils$1.isResponse(data) || utils$1.isReadableStream(data)) {
      return data;
    }

    if (data && utils$1.isString(data) && ((forcedJSONParsing && !this.responseType) || JSONRequested)) {
      const silentJSONParsing = transitional && transitional.silentJSONParsing;
      const strictJSONParsing = !silentJSONParsing && JSONRequested;

      try {
        return JSON.parse(data, this.parseReviver);
      } catch (e) {
        if (strictJSONParsing) {
          if (e.name === 'SyntaxError') {
            throw AxiosError.from(e, AxiosError.ERR_BAD_RESPONSE, this, null, this.response);
          }
          throw e;
        }
      }
    }

    return data;
  }],

  /**
   * A timeout in milliseconds to abort a request. If set to 0 (default) a
   * timeout is not created.
   */
  timeout: 0,

  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',

  maxContentLength: -1,
  maxBodyLength: -1,

  env: {
    FormData: platform.classes.FormData,
    Blob: platform.classes.Blob
  },

  validateStatus: function validateStatus(status) {
    return status >= 200 && status < 300;
  },

  headers: {
    common: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': undefined
    }
  }
};

utils$1.forEach(['delete', 'get', 'head', 'post', 'put', 'patch'], (method) => {
  defaults.headers[method] = {};
});

const defaults$1 = defaults;

// RawAxiosHeaders whose duplicates are ignored by node
// c.f. https://nodejs.org/api/http.html#http_message_headers
const ignoreDuplicateOf = utils$1.toObjectSet([
  'age', 'authorization', 'content-length', 'content-type', 'etag',
  'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since',
  'last-modified', 'location', 'max-forwards', 'proxy-authorization',
  'referer', 'retry-after', 'user-agent'
]);

/**
 * Parse headers into an object
 *
 * ```
 * Date: Wed, 27 Aug 2014 08:58:49 GMT
 * Content-Type: application/json
 * Connection: keep-alive
 * Transfer-Encoding: chunked
 * ```
 *
 * @param {String} rawHeaders Headers needing to be parsed
 *
 * @returns {Object} Headers parsed into an object
 */
const parseHeaders = rawHeaders => {
  const parsed = {};
  let key;
  let val;
  let i;

  rawHeaders && rawHeaders.split('\n').forEach(function parser(line) {
    i = line.indexOf(':');
    key = line.substring(0, i).trim().toLowerCase();
    val = line.substring(i + 1).trim();

    if (!key || (parsed[key] && ignoreDuplicateOf[key])) {
      return;
    }

    if (key === 'set-cookie') {
      if (parsed[key]) {
        parsed[key].push(val);
      } else {
        parsed[key] = [val];
      }
    } else {
      parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
    }
  });

  return parsed;
};

const $internals = Symbol('internals');

function normalizeHeader(header) {
  return header && String(header).trim().toLowerCase();
}

function normalizeValue(value) {
  if (value === false || value == null) {
    return value;
  }

  return utils$1.isArray(value) ? value.map(normalizeValue) : String(value);
}

function parseTokens(str) {
  const tokens = Object.create(null);
  const tokensRE = /([^\s,;=]+)\s*(?:=\s*([^,;]+))?/g;
  let match;

  while ((match = tokensRE.exec(str))) {
    tokens[match[1]] = match[2];
  }

  return tokens;
}

const isValidHeaderName = (str) => /^[-_a-zA-Z0-9^`|~,!#$%&'*+.]+$/.test(str.trim());

function matchHeaderValue(context, value, header, filter, isHeaderNameFilter) {
  if (utils$1.isFunction(filter)) {
    return filter.call(this, value, header);
  }

  if (isHeaderNameFilter) {
    value = header;
  }

  if (!utils$1.isString(value)) return;

  if (utils$1.isString(filter)) {
    return value.indexOf(filter) !== -1;
  }

  if (utils$1.isRegExp(filter)) {
    return filter.test(value);
  }
}

function formatHeader(header) {
  return header.trim()
    .toLowerCase().replace(/([a-z\d])(\w*)/g, (w, char, str) => {
      return char.toUpperCase() + str;
    });
}

function buildAccessors(obj, header) {
  const accessorName = utils$1.toCamelCase(' ' + header);

  ['get', 'set', 'has'].forEach(methodName => {
    Object.defineProperty(obj, methodName + accessorName, {
      value: function(arg1, arg2, arg3) {
        return this[methodName].call(this, header, arg1, arg2, arg3);
      },
      configurable: true
    });
  });
}

class AxiosHeaders {
  constructor(headers) {
    headers && this.set(headers);
  }

  set(header, valueOrRewrite, rewrite) {
    const self = this;

    function setHeader(_value, _header, _rewrite) {
      const lHeader = normalizeHeader(_header);

      if (!lHeader) {
        throw new Error('header name must be a non-empty string');
      }

      const key = utils$1.findKey(self, lHeader);

      if(!key || self[key] === undefined || _rewrite === true || (_rewrite === undefined && self[key] !== false)) {
        self[key || _header] = normalizeValue(_value);
      }
    }

    const setHeaders = (headers, _rewrite) =>
      utils$1.forEach(headers, (_value, _header) => setHeader(_value, _header, _rewrite));

    if (utils$1.isPlainObject(header) || header instanceof this.constructor) {
      setHeaders(header, valueOrRewrite);
    } else if(utils$1.isString(header) && (header = header.trim()) && !isValidHeaderName(header)) {
      setHeaders(parseHeaders(header), valueOrRewrite);
    } else if (utils$1.isObject(header) && utils$1.isIterable(header)) {
      let obj = {}, dest, key;
      for (const entry of header) {
        if (!utils$1.isArray(entry)) {
          throw TypeError('Object iterator must return a key-value pair');
        }

        obj[key = entry[0]] = (dest = obj[key]) ?
          (utils$1.isArray(dest) ? [...dest, entry[1]] : [dest, entry[1]]) : entry[1];
      }

      setHeaders(obj, valueOrRewrite);
    } else {
      header != null && setHeader(valueOrRewrite, header, rewrite);
    }

    return this;
  }

  get(header, parser) {
    header = normalizeHeader(header);

    if (header) {
      const key = utils$1.findKey(this, header);

      if (key) {
        const value = this[key];

        if (!parser) {
          return value;
        }

        if (parser === true) {
          return parseTokens(value);
        }

        if (utils$1.isFunction(parser)) {
          return parser.call(this, value, key);
        }

        if (utils$1.isRegExp(parser)) {
          return parser.exec(value);
        }

        throw new TypeError('parser must be boolean|regexp|function');
      }
    }
  }

  has(header, matcher) {
    header = normalizeHeader(header);

    if (header) {
      const key = utils$1.findKey(this, header);

      return !!(key && this[key] !== undefined && (!matcher || matchHeaderValue(this, this[key], key, matcher)));
    }

    return false;
  }

  delete(header, matcher) {
    const self = this;
    let deleted = false;

    function deleteHeader(_header) {
      _header = normalizeHeader(_header);

      if (_header) {
        const key = utils$1.findKey(self, _header);

        if (key && (!matcher || matchHeaderValue(self, self[key], key, matcher))) {
          delete self[key];

          deleted = true;
        }
      }
    }

    if (utils$1.isArray(header)) {
      header.forEach(deleteHeader);
    } else {
      deleteHeader(header);
    }

    return deleted;
  }

  clear(matcher) {
    const keys = Object.keys(this);
    let i = keys.length;
    let deleted = false;

    while (i--) {
      const key = keys[i];
      if(!matcher || matchHeaderValue(this, this[key], key, matcher, true)) {
        delete this[key];
        deleted = true;
      }
    }

    return deleted;
  }

  normalize(format) {
    const self = this;
    const headers = {};

    utils$1.forEach(this, (value, header) => {
      const key = utils$1.findKey(headers, header);

      if (key) {
        self[key] = normalizeValue(value);
        delete self[header];
        return;
      }

      const normalized = format ? formatHeader(header) : String(header).trim();

      if (normalized !== header) {
        delete self[header];
      }

      self[normalized] = normalizeValue(value);

      headers[normalized] = true;
    });

    return this;
  }

  concat(...targets) {
    return this.constructor.concat(this, ...targets);
  }

  toJSON(asStrings) {
    const obj = Object.create(null);

    utils$1.forEach(this, (value, header) => {
      value != null && value !== false && (obj[header] = asStrings && utils$1.isArray(value) ? value.join(', ') : value);
    });

    return obj;
  }

  [Symbol.iterator]() {
    return Object.entries(this.toJSON())[Symbol.iterator]();
  }

  toString() {
    return Object.entries(this.toJSON()).map(([header, value]) => header + ': ' + value).join('\n');
  }

  getSetCookie() {
    return this.get("set-cookie") || [];
  }

  get [Symbol.toStringTag]() {
    return 'AxiosHeaders';
  }

  static from(thing) {
    return thing instanceof this ? thing : new this(thing);
  }

  static concat(first, ...targets) {
    const computed = new this(first);

    targets.forEach((target) => computed.set(target));

    return computed;
  }

  static accessor(header) {
    const internals = this[$internals] = (this[$internals] = {
      accessors: {}
    });

    const accessors = internals.accessors;
    const prototype = this.prototype;

    function defineAccessor(_header) {
      const lHeader = normalizeHeader(_header);

      if (!accessors[lHeader]) {
        buildAccessors(prototype, _header);
        accessors[lHeader] = true;
      }
    }

    utils$1.isArray(header) ? header.forEach(defineAccessor) : defineAccessor(header);

    return this;
  }
}

AxiosHeaders.accessor(['Content-Type', 'Content-Length', 'Accept', 'Accept-Encoding', 'User-Agent', 'Authorization']);

// reserved names hotfix
utils$1.reduceDescriptors(AxiosHeaders.prototype, ({value}, key) => {
  let mapped = key[0].toUpperCase() + key.slice(1); // map `set` => `Set`
  return {
    get: () => value,
    set(headerValue) {
      this[mapped] = headerValue;
    }
  }
});

utils$1.freezeMethods(AxiosHeaders);

const AxiosHeaders$1 = AxiosHeaders;

/**
 * Transform the data for a request or a response
 *
 * @param {Array|Function} fns A single function or Array of functions
 * @param {?Object} response The response object
 *
 * @returns {*} The resulting transformed data
 */
function transformData(fns, response) {
  const config = this || defaults$1;
  const context = response || config;
  const headers = AxiosHeaders$1.from(context.headers);
  let data = context.data;

  utils$1.forEach(fns, function transform(fn) {
    data = fn.call(config, data, headers.normalize(), response ? response.status : undefined);
  });

  headers.normalize();

  return data;
}

function isCancel(value) {
  return !!(value && value.__CANCEL__);
}

/**
 * A `CanceledError` is an object that is thrown when an operation is canceled.
 *
 * @param {string=} message The message.
 * @param {Object=} config The config.
 * @param {Object=} request The request.
 *
 * @returns {CanceledError} The created error.
 */
function CanceledError(message, config, request) {
  // eslint-disable-next-line no-eq-null,eqeqeq
  AxiosError.call(this, message == null ? 'canceled' : message, AxiosError.ERR_CANCELED, config, request);
  this.name = 'CanceledError';
}

utils$1.inherits(CanceledError, AxiosError, {
  __CANCEL__: true
});

/**
 * Resolve or reject a Promise based on response status.
 *
 * @param {Function} resolve A function that resolves the promise.
 * @param {Function} reject A function that rejects the promise.
 * @param {object} response The response.
 *
 * @returns {object} The response.
 */
function settle(resolve, reject, response) {
  const validateStatus = response.config.validateStatus;
  if (!response.status || !validateStatus || validateStatus(response.status)) {
    resolve(response);
  } else {
    reject(new AxiosError(
      'Request failed with status code ' + response.status,
      [AxiosError.ERR_BAD_REQUEST, AxiosError.ERR_BAD_RESPONSE][Math.floor(response.status / 100) - 4],
      response.config,
      response.request,
      response
    ));
  }
}

/**
 * Determines whether the specified URL is absolute
 *
 * @param {string} url The URL to test
 *
 * @returns {boolean} True if the specified URL is absolute, otherwise false
 */
function isAbsoluteURL(url) {
  // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
  // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
  // by any combination of letters, digits, plus, period, or hyphen.
  return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(url);
}

/**
 * Creates a new URL by combining the specified URLs
 *
 * @param {string} baseURL The base URL
 * @param {string} relativeURL The relative URL
 *
 * @returns {string} The combined URL
 */
function combineURLs(baseURL, relativeURL) {
  return relativeURL
    ? baseURL.replace(/\/?\/$/, '') + '/' + relativeURL.replace(/^\/+/, '')
    : baseURL;
}

/**
 * Creates a new URL by combining the baseURL with the requestedURL,
 * only when the requestedURL is not already an absolute URL.
 * If the requestURL is absolute, this function returns the requestedURL untouched.
 *
 * @param {string} baseURL The base URL
 * @param {string} requestedURL Absolute or relative URL to combine
 *
 * @returns {string} The combined full path
 */
function buildFullPath(baseURL, requestedURL, allowAbsoluteUrls) {
  let isRelativeUrl = !isAbsoluteURL(requestedURL);
  if (baseURL && (isRelativeUrl || allowAbsoluteUrls == false)) {
    return combineURLs(baseURL, requestedURL);
  }
  return requestedURL;
}

const VERSION = "1.13.2";

function parseProtocol(url) {
  const match = /^([-+\w]{1,25})(:?\/\/|:)/.exec(url);
  return match && match[1] || '';
}

const DATA_URL_PATTERN = /^(?:([^;]+);)?(?:[^;]+;)?(base64|),([\s\S]*)$/;

/**
 * Parse data uri to a Buffer or Blob
 *
 * @param {String} uri
 * @param {?Boolean} asBlob
 * @param {?Object} options
 * @param {?Function} options.Blob
 *
 * @returns {Buffer|Blob}
 */
function fromDataURI(uri, asBlob, options) {
  const _Blob = options && options.Blob || platform.classes.Blob;
  const protocol = parseProtocol(uri);

  if (asBlob === undefined && _Blob) {
    asBlob = true;
  }

  if (protocol === 'data') {
    uri = protocol.length ? uri.slice(protocol.length + 1) : uri;

    const match = DATA_URL_PATTERN.exec(uri);

    if (!match) {
      throw new AxiosError('Invalid URL', AxiosError.ERR_INVALID_URL);
    }

    const mime = match[1];
    const isBase64 = match[2];
    const body = match[3];
    const buffer = Buffer.from(decodeURIComponent(body), isBase64 ? 'base64' : 'utf8');

    if (asBlob) {
      if (!_Blob) {
        throw new AxiosError('Blob is not supported', AxiosError.ERR_NOT_SUPPORT);
      }

      return new _Blob([buffer], {type: mime});
    }

    return buffer;
  }

  throw new AxiosError('Unsupported protocol ' + protocol, AxiosError.ERR_NOT_SUPPORT);
}

const kInternals = Symbol('internals');

class AxiosTransformStream extends stream__default["default"].Transform{
  constructor(options) {
    options = utils$1.toFlatObject(options, {
      maxRate: 0,
      chunkSize: 64 * 1024,
      minChunkSize: 100,
      timeWindow: 500,
      ticksRate: 2,
      samplesCount: 15
    }, null, (prop, source) => {
      return !utils$1.isUndefined(source[prop]);
    });

    super({
      readableHighWaterMark: options.chunkSize
    });

    const internals = this[kInternals] = {
      timeWindow: options.timeWindow,
      chunkSize: options.chunkSize,
      maxRate: options.maxRate,
      minChunkSize: options.minChunkSize,
      bytesSeen: 0,
      isCaptured: false,
      notifiedBytesLoaded: 0,
      ts: Date.now(),
      bytes: 0,
      onReadCallback: null
    };

    this.on('newListener', event => {
      if (event === 'progress') {
        if (!internals.isCaptured) {
          internals.isCaptured = true;
        }
      }
    });
  }

  _read(size) {
    const internals = this[kInternals];

    if (internals.onReadCallback) {
      internals.onReadCallback();
    }

    return super._read(size);
  }

  _transform(chunk, encoding, callback) {
    const internals = this[kInternals];
    const maxRate = internals.maxRate;

    const readableHighWaterMark = this.readableHighWaterMark;

    const timeWindow = internals.timeWindow;

    const divider = 1000 / timeWindow;
    const bytesThreshold = (maxRate / divider);
    const minChunkSize = internals.minChunkSize !== false ? Math.max(internals.minChunkSize, bytesThreshold * 0.01) : 0;

    const pushChunk = (_chunk, _callback) => {
      const bytes = Buffer.byteLength(_chunk);
      internals.bytesSeen += bytes;
      internals.bytes += bytes;

      internals.isCaptured && this.emit('progress', internals.bytesSeen);

      if (this.push(_chunk)) {
        process.nextTick(_callback);
      } else {
        internals.onReadCallback = () => {
          internals.onReadCallback = null;
          process.nextTick(_callback);
        };
      }
    };

    const transformChunk = (_chunk, _callback) => {
      const chunkSize = Buffer.byteLength(_chunk);
      let chunkRemainder = null;
      let maxChunkSize = readableHighWaterMark;
      let bytesLeft;
      let passed = 0;

      if (maxRate) {
        const now = Date.now();

        if (!internals.ts || (passed = (now - internals.ts)) >= timeWindow) {
          internals.ts = now;
          bytesLeft = bytesThreshold - internals.bytes;
          internals.bytes = bytesLeft < 0 ? -bytesLeft : 0;
          passed = 0;
        }

        bytesLeft = bytesThreshold - internals.bytes;
      }

      if (maxRate) {
        if (bytesLeft <= 0) {
          // next time window
          return setTimeout(() => {
            _callback(null, _chunk);
          }, timeWindow - passed);
        }

        if (bytesLeft < maxChunkSize) {
          maxChunkSize = bytesLeft;
        }
      }

      if (maxChunkSize && chunkSize > maxChunkSize && (chunkSize - maxChunkSize) > minChunkSize) {
        chunkRemainder = _chunk.subarray(maxChunkSize);
        _chunk = _chunk.subarray(0, maxChunkSize);
      }

      pushChunk(_chunk, chunkRemainder ? () => {
        process.nextTick(_callback, null, chunkRemainder);
      } : _callback);
    };

    transformChunk(chunk, function transformNextChunk(err, _chunk) {
      if (err) {
        return callback(err);
      }

      if (_chunk) {
        transformChunk(_chunk, transformNextChunk);
      } else {
        callback(null);
      }
    });
  }
}

const AxiosTransformStream$1 = AxiosTransformStream;

const {asyncIterator} = Symbol;

const readBlob = async function* (blob) {
  if (blob.stream) {
    yield* blob.stream();
  } else if (blob.arrayBuffer) {
    yield await blob.arrayBuffer();
  } else if (blob[asyncIterator]) {
    yield* blob[asyncIterator]();
  } else {
    yield blob;
  }
};

const readBlob$1 = readBlob;

const BOUNDARY_ALPHABET = platform.ALPHABET.ALPHA_DIGIT + '-_';

const textEncoder = typeof TextEncoder === 'function' ? new TextEncoder() : new util__default["default"].TextEncoder();

const CRLF = '\r\n';
const CRLF_BYTES = textEncoder.encode(CRLF);
const CRLF_BYTES_COUNT = 2;

class FormDataPart {
  constructor(name, value) {
    const {escapeName} = this.constructor;
    const isStringValue = utils$1.isString(value);

    let headers = `Content-Disposition: form-data; name="${escapeName(name)}"${
      !isStringValue && value.name ? `; filename="${escapeName(value.name)}"` : ''
    }${CRLF}`;

    if (isStringValue) {
      value = textEncoder.encode(String(value).replace(/\r?\n|\r\n?/g, CRLF));
    } else {
      headers += `Content-Type: ${value.type || "application/octet-stream"}${CRLF}`;
    }

    this.headers = textEncoder.encode(headers + CRLF);

    this.contentLength = isStringValue ? value.byteLength : value.size;

    this.size = this.headers.byteLength + this.contentLength + CRLF_BYTES_COUNT;

    this.name = name;
    this.value = value;
  }

  async *encode(){
    yield this.headers;

    const {value} = this;

    if(utils$1.isTypedArray(value)) {
      yield value;
    } else {
      yield* readBlob$1(value);
    }

    yield CRLF_BYTES;
  }

  static escapeName(name) {
      return String(name).replace(/[\r\n"]/g, (match) => ({
        '\r' : '%0D',
        '\n' : '%0A',
        '"' : '%22',
      }[match]));
  }
}

const formDataToStream = (form, headersHandler, options) => {
  const {
    tag = 'form-data-boundary',
    size = 25,
    boundary = tag + '-' + platform.generateString(size, BOUNDARY_ALPHABET)
  } = options || {};

  if(!utils$1.isFormData(form)) {
    throw TypeError('FormData instance required');
  }

  if (boundary.length < 1 || boundary.length > 70) {
    throw Error('boundary must be 10-70 characters long')
  }

  const boundaryBytes = textEncoder.encode('--' + boundary + CRLF);
  const footerBytes = textEncoder.encode('--' + boundary + '--' + CRLF);
  let contentLength = footerBytes.byteLength;

  const parts = Array.from(form.entries()).map(([name, value]) => {
    const part = new FormDataPart(name, value);
    contentLength += part.size;
    return part;
  });

  contentLength += boundaryBytes.byteLength * parts.length;

  contentLength = utils$1.toFiniteNumber(contentLength);

  const computedHeaders = {
    'Content-Type': `multipart/form-data; boundary=${boundary}`
  };

  if (Number.isFinite(contentLength)) {
    computedHeaders['Content-Length'] = contentLength;
  }

  headersHandler && headersHandler(computedHeaders);

  return stream.Readable.from((async function *() {
    for(const part of parts) {
      yield boundaryBytes;
      yield* part.encode();
    }

    yield footerBytes;
  })());
};

const formDataToStream$1 = formDataToStream;

class ZlibHeaderTransformStream extends stream__default["default"].Transform {
  __transform(chunk, encoding, callback) {
    this.push(chunk);
    callback();
  }

  _transform(chunk, encoding, callback) {
    if (chunk.length !== 0) {
      this._transform = this.__transform;

      // Add Default Compression headers if no zlib headers are present
      if (chunk[0] !== 120) { // Hex: 78
        const header = Buffer.alloc(2);
        header[0] = 120; // Hex: 78
        header[1] = 156; // Hex: 9C 
        this.push(header, encoding);
      }
    }

    this.__transform(chunk, encoding, callback);
  }
}

const ZlibHeaderTransformStream$1 = ZlibHeaderTransformStream;

const callbackify = (fn, reducer) => {
  return utils$1.isAsyncFn(fn) ? function (...args) {
    const cb = args.pop();
    fn.apply(this, args).then((value) => {
      try {
        reducer ? cb(null, ...reducer(value)) : cb(null, value);
      } catch (err) {
        cb(err);
      }
    }, cb);
  } : fn;
};

const callbackify$1 = callbackify;

/**
 * Calculate data maxRate
 * @param {Number} [samplesCount= 10]
 * @param {Number} [min= 1000]
 * @returns {Function}
 */
function speedometer(samplesCount, min) {
  samplesCount = samplesCount || 10;
  const bytes = new Array(samplesCount);
  const timestamps = new Array(samplesCount);
  let head = 0;
  let tail = 0;
  let firstSampleTS;

  min = min !== undefined ? min : 1000;

  return function push(chunkLength) {
    const now = Date.now();

    const startedAt = timestamps[tail];

    if (!firstSampleTS) {
      firstSampleTS = now;
    }

    bytes[head] = chunkLength;
    timestamps[head] = now;

    let i = tail;
    let bytesCount = 0;

    while (i !== head) {
      bytesCount += bytes[i++];
      i = i % samplesCount;
    }

    head = (head + 1) % samplesCount;

    if (head === tail) {
      tail = (tail + 1) % samplesCount;
    }

    if (now - firstSampleTS < min) {
      return;
    }

    const passed = startedAt && now - startedAt;

    return passed ? Math.round(bytesCount * 1000 / passed) : undefined;
  };
}

/**
 * Throttle decorator
 * @param {Function} fn
 * @param {Number} freq
 * @return {Function}
 */
function throttle(fn, freq) {
  let timestamp = 0;
  let threshold = 1000 / freq;
  let lastArgs;
  let timer;

  const invoke = (args, now = Date.now()) => {
    timestamp = now;
    lastArgs = null;
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    fn(...args);
  };

  const throttled = (...args) => {
    const now = Date.now();
    const passed = now - timestamp;
    if ( passed >= threshold) {
      invoke(args, now);
    } else {
      lastArgs = args;
      if (!timer) {
        timer = setTimeout(() => {
          timer = null;
          invoke(lastArgs);
        }, threshold - passed);
      }
    }
  };

  const flush = () => lastArgs && invoke(lastArgs);

  return [throttled, flush];
}

const progressEventReducer = (listener, isDownloadStream, freq = 3) => {
  let bytesNotified = 0;
  const _speedometer = speedometer(50, 250);

  return throttle(e => {
    const loaded = e.loaded;
    const total = e.lengthComputable ? e.total : undefined;
    const progressBytes = loaded - bytesNotified;
    const rate = _speedometer(progressBytes);
    const inRange = loaded <= total;

    bytesNotified = loaded;

    const data = {
      loaded,
      total,
      progress: total ? (loaded / total) : undefined,
      bytes: progressBytes,
      rate: rate ? rate : undefined,
      estimated: rate && total && inRange ? (total - loaded) / rate : undefined,
      event: e,
      lengthComputable: total != null,
      [isDownloadStream ? 'download' : 'upload']: true
    };

    listener(data);
  }, freq);
};

const progressEventDecorator = (total, throttled) => {
  const lengthComputable = total != null;

  return [(loaded) => throttled[0]({
    lengthComputable,
    total,
    loaded
  }), throttled[1]];
};

const asyncDecorator = (fn) => (...args) => utils$1.asap(() => fn(...args));

/**
 * Estimate decoded byte length of a data:// URL *without* allocating large buffers.
 * - For base64: compute exact decoded size using length and padding;
 *               handle %XX at the character-count level (no string allocation).
 * - For non-base64: use UTF-8 byteLength of the encoded body as a safe upper bound.
 *
 * @param {string} url
 * @returns {number}
 */
function estimateDataURLDecodedBytes(url) {
  if (!url || typeof url !== 'string') return 0;
  if (!url.startsWith('data:')) return 0;

  const comma = url.indexOf(',');
  if (comma < 0) return 0;

  const meta = url.slice(5, comma);
  const body = url.slice(comma + 1);
  const isBase64 = /;base64/i.test(meta);

  if (isBase64) {
    let effectiveLen = body.length;
    const len = body.length; // cache length

    for (let i = 0; i < len; i++) {
      if (body.charCodeAt(i) === 37 /* '%' */ && i + 2 < len) {
        const a = body.charCodeAt(i + 1);
        const b = body.charCodeAt(i + 2);
        const isHex =
          ((a >= 48 && a <= 57) || (a >= 65 && a <= 70) || (a >= 97 && a <= 102)) &&
          ((b >= 48 && b <= 57) || (b >= 65 && b <= 70) || (b >= 97 && b <= 102));

        if (isHex) {
          effectiveLen -= 2;
          i += 2;
        }
      }
    }

    let pad = 0;
    let idx = len - 1;

    const tailIsPct3D = (j) =>
      j >= 2 &&
      body.charCodeAt(j - 2) === 37 && // '%'
      body.charCodeAt(j - 1) === 51 && // '3'
      (body.charCodeAt(j) === 68 || body.charCodeAt(j) === 100); // 'D' or 'd'

    if (idx >= 0) {
      if (body.charCodeAt(idx) === 61 /* '=' */) {
        pad++;
        idx--;
      } else if (tailIsPct3D(idx)) {
        pad++;
        idx -= 3;
      }
    }

    if (pad === 1 && idx >= 0) {
      if (body.charCodeAt(idx) === 61 /* '=' */) {
        pad++;
      } else if (tailIsPct3D(idx)) {
        pad++;
      }
    }

    const groups = Math.floor(effectiveLen / 4);
    const bytes = groups * 3 - (pad || 0);
    return bytes > 0 ? bytes : 0;
  }

  return Buffer.byteLength(body, 'utf8');
}

const zlibOptions = {
  flush: zlib__default["default"].constants.Z_SYNC_FLUSH,
  finishFlush: zlib__default["default"].constants.Z_SYNC_FLUSH
};

const brotliOptions = {
  flush: zlib__default["default"].constants.BROTLI_OPERATION_FLUSH,
  finishFlush: zlib__default["default"].constants.BROTLI_OPERATION_FLUSH
};

const isBrotliSupported = utils$1.isFunction(zlib__default["default"].createBrotliDecompress);

const {http: httpFollow, https: httpsFollow} = followRedirects__default["default"];

const isHttps = /https:?/;

const supportedProtocols = platform.protocols.map(protocol => {
  return protocol + ':';
});


const flushOnFinish = (stream, [throttled, flush]) => {
  stream
    .on('end', flush)
    .on('error', flush);

  return throttled;
};

class Http2Sessions {
  constructor() {
    this.sessions = Object.create(null);
  }

  getSession(authority, options) {
    options = Object.assign({
      sessionTimeout: 1000
    }, options);

    let authoritySessions = this.sessions[authority];

    if (authoritySessions) {
      let len = authoritySessions.length;

      for (let i = 0; i < len; i++) {
        const [sessionHandle, sessionOptions] = authoritySessions[i];
        if (!sessionHandle.destroyed && !sessionHandle.closed && util__default["default"].isDeepStrictEqual(sessionOptions, options)) {
          return sessionHandle;
        }
      }
    }

    const session = http2__default["default"].connect(authority, options);

    let removed;

    const removeSession = () => {
      if (removed) {
        return;
      }

      removed = true;

      let entries = authoritySessions, len = entries.length, i = len;

      while (i--) {
        if (entries[i][0] === session) {
          if (len === 1) {
            delete this.sessions[authority];
          } else {
            entries.splice(i, 1);
          }
          return;
        }
      }
    };

    const originalRequestFn = session.request;

    const {sessionTimeout} = options;

    if(sessionTimeout != null) {

      let timer;
      let streamsCount = 0;

      session.request = function () {
        const stream = originalRequestFn.apply(this, arguments);

        streamsCount++;

        if (timer) {
          clearTimeout(timer);
          timer = null;
        }

        stream.once('close', () => {
          if (!--streamsCount) {
            timer = setTimeout(() => {
              timer = null;
              removeSession();
            }, sessionTimeout);
          }
        });

        return stream;
      };
    }

    session.once('close', removeSession);

    let entry = [
        session,
        options
      ];

    authoritySessions ? authoritySessions.push(entry) : authoritySessions =  this.sessions[authority] = [entry];

    return session;
  }
}

const http2Sessions = new Http2Sessions();


/**
 * If the proxy or config beforeRedirects functions are defined, call them with the options
 * object.
 *
 * @param {Object<string, any>} options - The options object that was passed to the request.
 *
 * @returns {Object<string, any>}
 */
function dispatchBeforeRedirect(options, responseDetails) {
  if (options.beforeRedirects.proxy) {
    options.beforeRedirects.proxy(options);
  }
  if (options.beforeRedirects.config) {
    options.beforeRedirects.config(options, responseDetails);
  }
}

/**
 * If the proxy or config afterRedirects functions are defined, call them with the options
 *
 * @param {http.ClientRequestArgs} options
 * @param {AxiosProxyConfig} configProxy configuration from Axios options object
 * @param {string} location
 *
 * @returns {http.ClientRequestArgs}
 */
function setProxy(options, configProxy, location) {
  let proxy = configProxy;
  if (!proxy && proxy !== false) {
    const proxyUrl = proxyFromEnv__default["default"].getProxyForUrl(location);
    if (proxyUrl) {
      proxy = new URL(proxyUrl);
    }
  }
  if (proxy) {
    // Basic proxy authorization
    if (proxy.username) {
      proxy.auth = (proxy.username || '') + ':' + (proxy.password || '');
    }

    if (proxy.auth) {
      // Support proxy auth object form
      if (proxy.auth.username || proxy.auth.password) {
        proxy.auth = (proxy.auth.username || '') + ':' + (proxy.auth.password || '');
      }
      const base64 = Buffer
        .from(proxy.auth, 'utf8')
        .toString('base64');
      options.headers['Proxy-Authorization'] = 'Basic ' + base64;
    }

    options.headers.host = options.hostname + (options.port ? ':' + options.port : '');
    const proxyHost = proxy.hostname || proxy.host;
    options.hostname = proxyHost;
    // Replace 'host' since options is not a URL object
    options.host = proxyHost;
    options.port = proxy.port;
    options.path = location;
    if (proxy.protocol) {
      options.protocol = proxy.protocol.includes(':') ? proxy.protocol : `${proxy.protocol}:`;
    }
  }

  options.beforeRedirects.proxy = function beforeRedirect(redirectOptions) {
    // Configure proxy for redirected request, passing the original config proxy to apply
    // the exact same logic as if the redirected request was performed by axios directly.
    setProxy(redirectOptions, configProxy, redirectOptions.href);
  };
}

const isHttpAdapterSupported = typeof process !== 'undefined' && utils$1.kindOf(process) === 'process';

// temporary hotfix

const wrapAsync = (asyncExecutor) => {
  return new Promise((resolve, reject) => {
    let onDone;
    let isDone;

    const done = (value, isRejected) => {
      if (isDone) return;
      isDone = true;
      onDone && onDone(value, isRejected);
    };

    const _resolve = (value) => {
      done(value);
      resolve(value);
    };

    const _reject = (reason) => {
      done(reason, true);
      reject(reason);
    };

    asyncExecutor(_resolve, _reject, (onDoneHandler) => (onDone = onDoneHandler)).catch(_reject);
  })
};

const resolveFamily = ({address, family}) => {
  if (!utils$1.isString(address)) {
    throw TypeError('address must be a string');
  }
  return ({
    address,
    family: family || (address.indexOf('.') < 0 ? 6 : 4)
  });
};

const buildAddressEntry = (address, family) => resolveFamily(utils$1.isObject(address) ? address : {address, family});

const http2Transport = {
  request(options, cb) {
      const authority = options.protocol + '//' + options.hostname + ':' + (options.port || 80);

      const {http2Options, headers} = options;

      const session = http2Sessions.getSession(authority, http2Options);

      const {
        HTTP2_HEADER_SCHEME,
        HTTP2_HEADER_METHOD,
        HTTP2_HEADER_PATH,
        HTTP2_HEADER_STATUS
      } = http2__default["default"].constants;

      const http2Headers = {
        [HTTP2_HEADER_SCHEME]: options.protocol.replace(':', ''),
        [HTTP2_HEADER_METHOD]: options.method,
        [HTTP2_HEADER_PATH]: options.path,
      };

      utils$1.forEach(headers, (header, name) => {
        name.charAt(0) !== ':' && (http2Headers[name] = header);
      });

      const req = session.request(http2Headers);

      req.once('response', (responseHeaders) => {
        const response = req; //duplex

        responseHeaders = Object.assign({}, responseHeaders);

        const status = responseHeaders[HTTP2_HEADER_STATUS];

        delete responseHeaders[HTTP2_HEADER_STATUS];

        response.headers = responseHeaders;

        response.statusCode = +status;

        cb(response);
      });

      return req;
  }
};

/*eslint consistent-return:0*/
const httpAdapter = isHttpAdapterSupported && function httpAdapter(config) {
  return wrapAsync(async function dispatchHttpRequest(resolve, reject, onDone) {
    let {data, lookup, family, httpVersion = 1, http2Options} = config;
    const {responseType, responseEncoding} = config;
    const method = config.method.toUpperCase();
    let isDone;
    let rejected = false;
    let req;

    httpVersion = +httpVersion;

    if (Number.isNaN(httpVersion)) {
      throw TypeError(`Invalid protocol version: '${config.httpVersion}' is not a number`);
    }

    if (httpVersion !== 1 && httpVersion !== 2) {
      throw TypeError(`Unsupported protocol version '${httpVersion}'`);
    }

    const isHttp2 = httpVersion === 2;

    if (lookup) {
      const _lookup = callbackify$1(lookup, (value) => utils$1.isArray(value) ? value : [value]);
      // hotfix to support opt.all option which is required for node 20.x
      lookup = (hostname, opt, cb) => {
        _lookup(hostname, opt, (err, arg0, arg1) => {
          if (err) {
            return cb(err);
          }

          const addresses = utils$1.isArray(arg0) ? arg0.map(addr => buildAddressEntry(addr)) : [buildAddressEntry(arg0, arg1)];

          opt.all ? cb(err, addresses) : cb(err, addresses[0].address, addresses[0].family);
        });
      };
    }

    const abortEmitter = new events.EventEmitter();

    function abort(reason) {
      try {
        abortEmitter.emit('abort', !reason || reason.type ? new CanceledError(null, config, req) : reason);
      } catch(err) {
        console.warn('emit error', err);
      }
    }

    abortEmitter.once('abort', reject);

    const onFinished = () => {
      if (config.cancelToken) {
        config.cancelToken.unsubscribe(abort);
      }

      if (config.signal) {
        config.signal.removeEventListener('abort', abort);
      }

      abortEmitter.removeAllListeners();
    };

    if (config.cancelToken || config.signal) {
      config.cancelToken && config.cancelToken.subscribe(abort);
      if (config.signal) {
        config.signal.aborted ? abort() : config.signal.addEventListener('abort', abort);
      }
    }

    onDone((response, isRejected) => {
      isDone = true;

      if (isRejected) {
        rejected = true;
        onFinished();
        return;
      }

      const {data} = response;

      if (data instanceof stream__default["default"].Readable || data instanceof stream__default["default"].Duplex) {
        const offListeners = stream__default["default"].finished(data, () => {
          offListeners();
          onFinished();
        });
      } else {
        onFinished();
      }
    });





    // Parse url
    const fullPath = buildFullPath(config.baseURL, config.url, config.allowAbsoluteUrls);
    const parsed = new URL(fullPath, platform.hasBrowserEnv ? platform.origin : undefined);
    const protocol = parsed.protocol || supportedProtocols[0];

    if (protocol === 'data:') {
      // Apply the same semantics as HTTP: only enforce if a finite, non-negative cap is set.
      if (config.maxContentLength > -1) {
        // Use the exact string passed to fromDataURI (config.url); fall back to fullPath if needed.
        const dataUrl = String(config.url || fullPath || '');
        const estimated = estimateDataURLDecodedBytes(dataUrl);

        if (estimated > config.maxContentLength) {
          return reject(new AxiosError(
            'maxContentLength size of ' + config.maxContentLength + ' exceeded',
            AxiosError.ERR_BAD_RESPONSE,
            config
          ));
        }
      }

      let convertedData;

      if (method !== 'GET') {
        return settle(resolve, reject, {
          status: 405,
          statusText: 'method not allowed',
          headers: {},
          config
        });
      }

      try {
        convertedData = fromDataURI(config.url, responseType === 'blob', {
          Blob: config.env && config.env.Blob
        });
      } catch (err) {
        throw AxiosError.from(err, AxiosError.ERR_BAD_REQUEST, config);
      }

      if (responseType === 'text') {
        convertedData = convertedData.toString(responseEncoding);

        if (!responseEncoding || responseEncoding === 'utf8') {
          convertedData = utils$1.stripBOM(convertedData);
        }
      } else if (responseType === 'stream') {
        convertedData = stream__default["default"].Readable.from(convertedData);
      }

      return settle(resolve, reject, {
        data: convertedData,
        status: 200,
        statusText: 'OK',
        headers: new AxiosHeaders$1(),
        config
      });
    }

    if (supportedProtocols.indexOf(protocol) === -1) {
      return reject(new AxiosError(
        'Unsupported protocol ' + protocol,
        AxiosError.ERR_BAD_REQUEST,
        config
      ));
    }

    const headers = AxiosHeaders$1.from(config.headers).normalize();

    // Set User-Agent (required by some servers)
    // See https://github.com/axios/axios/issues/69
    // User-Agent is specified; handle case where no UA header is desired
    // Only set header if it hasn't been set in config
    headers.set('User-Agent', 'axios/' + VERSION, false);

    const {onUploadProgress, onDownloadProgress} = config;
    const maxRate = config.maxRate;
    let maxUploadRate = undefined;
    let maxDownloadRate = undefined;

    // support for spec compliant FormData objects
    if (utils$1.isSpecCompliantForm(data)) {
      const userBoundary = headers.getContentType(/boundary=([-_\w\d]{10,70})/i);

      data = formDataToStream$1(data, (formHeaders) => {
        headers.set(formHeaders);
      }, {
        tag: `axios-${VERSION}-boundary`,
        boundary: userBoundary && userBoundary[1] || undefined
      });
      // support for https://www.npmjs.com/package/form-data api
    } else if (utils$1.isFormData(data) && utils$1.isFunction(data.getHeaders)) {
      headers.set(data.getHeaders());

      if (!headers.hasContentLength()) {
        try {
          const knownLength = await util__default["default"].promisify(data.getLength).call(data);
          Number.isFinite(knownLength) && knownLength >= 0 && headers.setContentLength(knownLength);
          /*eslint no-empty:0*/
        } catch (e) {
        }
      }
    } else if (utils$1.isBlob(data) || utils$1.isFile(data)) {
      data.size && headers.setContentType(data.type || 'application/octet-stream');
      headers.setContentLength(data.size || 0);
      data = stream__default["default"].Readable.from(readBlob$1(data));
    } else if (data && !utils$1.isStream(data)) {
      if (Buffer.isBuffer(data)) ; else if (utils$1.isArrayBuffer(data)) {
        data = Buffer.from(new Uint8Array(data));
      } else if (utils$1.isString(data)) {
        data = Buffer.from(data, 'utf-8');
      } else {
        return reject(new AxiosError(
          'Data after transformation must be a string, an ArrayBuffer, a Buffer, or a Stream',
          AxiosError.ERR_BAD_REQUEST,
          config
        ));
      }

      // Add Content-Length header if data exists
      headers.setContentLength(data.length, false);

      if (config.maxBodyLength > -1 && data.length > config.maxBodyLength) {
        return reject(new AxiosError(
          'Request body larger than maxBodyLength limit',
          AxiosError.ERR_BAD_REQUEST,
          config
        ));
      }
    }

    const contentLength = utils$1.toFiniteNumber(headers.getContentLength());

    if (utils$1.isArray(maxRate)) {
      maxUploadRate = maxRate[0];
      maxDownloadRate = maxRate[1];
    } else {
      maxUploadRate = maxDownloadRate = maxRate;
    }

    if (data && (onUploadProgress || maxUploadRate)) {
      if (!utils$1.isStream(data)) {
        data = stream__default["default"].Readable.from(data, {objectMode: false});
      }

      data = stream__default["default"].pipeline([data, new AxiosTransformStream$1({
        maxRate: utils$1.toFiniteNumber(maxUploadRate)
      })], utils$1.noop);

      onUploadProgress && data.on('progress', flushOnFinish(
        data,
        progressEventDecorator(
          contentLength,
          progressEventReducer(asyncDecorator(onUploadProgress), false, 3)
        )
      ));
    }

    // HTTP basic authentication
    let auth = undefined;
    if (config.auth) {
      const username = config.auth.username || '';
      const password = config.auth.password || '';
      auth = username + ':' + password;
    }

    if (!auth && parsed.username) {
      const urlUsername = parsed.username;
      const urlPassword = parsed.password;
      auth = urlUsername + ':' + urlPassword;
    }

    auth && headers.delete('authorization');

    let path;

    try {
      path = buildURL(
        parsed.pathname + parsed.search,
        config.params,
        config.paramsSerializer
      ).replace(/^\?/, '');
    } catch (err) {
      const customErr = new Error(err.message);
      customErr.config = config;
      customErr.url = config.url;
      customErr.exists = true;
      return reject(customErr);
    }

    headers.set(
      'Accept-Encoding',
      'gzip, compress, deflate' + (isBrotliSupported ? ', br' : ''), false
      );

    const options = {
      path,
      method: method,
      headers: headers.toJSON(),
      agents: { http: config.httpAgent, https: config.httpsAgent },
      auth,
      protocol,
      family,
      beforeRedirect: dispatchBeforeRedirect,
      beforeRedirects: {},
      http2Options
    };

    // cacheable-lookup integration hotfix
    !utils$1.isUndefined(lookup) && (options.lookup = lookup);

    if (config.socketPath) {
      options.socketPath = config.socketPath;
    } else {
      options.hostname = parsed.hostname.startsWith("[") ? parsed.hostname.slice(1, -1) : parsed.hostname;
      options.port = parsed.port;
      setProxy(options, config.proxy, protocol + '//' + parsed.hostname + (parsed.port ? ':' + parsed.port : '') + options.path);
    }

    let transport;
    const isHttpsRequest = isHttps.test(options.protocol);
    options.agent = isHttpsRequest ? config.httpsAgent : config.httpAgent;

    if (isHttp2) {
       transport = http2Transport;
    } else {
      if (config.transport) {
        transport = config.transport;
      } else if (config.maxRedirects === 0) {
        transport = isHttpsRequest ? https__default["default"] : http__default["default"];
      } else {
        if (config.maxRedirects) {
          options.maxRedirects = config.maxRedirects;
        }
        if (config.beforeRedirect) {
          options.beforeRedirects.config = config.beforeRedirect;
        }
        transport = isHttpsRequest ? httpsFollow : httpFollow;
      }
    }

    if (config.maxBodyLength > -1) {
      options.maxBodyLength = config.maxBodyLength;
    } else {
      // follow-redirects does not skip comparison, so it should always succeed for axios -1 unlimited
      options.maxBodyLength = Infinity;
    }

    if (config.insecureHTTPParser) {
      options.insecureHTTPParser = config.insecureHTTPParser;
    }

    // Create the request
    req = transport.request(options, function handleResponse(res) {
      if (req.destroyed) return;

      const streams = [res];

      const responseLength = utils$1.toFiniteNumber(res.headers['content-length']);

      if (onDownloadProgress || maxDownloadRate) {
        const transformStream = new AxiosTransformStream$1({
          maxRate: utils$1.toFiniteNumber(maxDownloadRate)
        });

        onDownloadProgress && transformStream.on('progress', flushOnFinish(
          transformStream,
          progressEventDecorator(
            responseLength,
            progressEventReducer(asyncDecorator(onDownloadProgress), true, 3)
          )
        ));

        streams.push(transformStream);
      }

      // decompress the response body transparently if required
      let responseStream = res;

      // return the last request in case of redirects
      const lastRequest = res.req || req;

      // if decompress disabled we should not decompress
      if (config.decompress !== false && res.headers['content-encoding']) {
        // if no content, but headers still say that it is encoded,
        // remove the header not confuse downstream operations
        if (method === 'HEAD' || res.statusCode === 204) {
          delete res.headers['content-encoding'];
        }

        switch ((res.headers['content-encoding'] || '').toLowerCase()) {
        /*eslint default-case:0*/
        case 'gzip':
        case 'x-gzip':
        case 'compress':
        case 'x-compress':
          // add the unzipper to the body stream processing pipeline
          streams.push(zlib__default["default"].createUnzip(zlibOptions));

          // remove the content-encoding in order to not confuse downstream operations
          delete res.headers['content-encoding'];
          break;
        case 'deflate':
          streams.push(new ZlibHeaderTransformStream$1());

          // add the unzipper to the body stream processing pipeline
          streams.push(zlib__default["default"].createUnzip(zlibOptions));

          // remove the content-encoding in order to not confuse downstream operations
          delete res.headers['content-encoding'];
          break;
        case 'br':
          if (isBrotliSupported) {
            streams.push(zlib__default["default"].createBrotliDecompress(brotliOptions));
            delete res.headers['content-encoding'];
          }
        }
      }

      responseStream = streams.length > 1 ? stream__default["default"].pipeline(streams, utils$1.noop) : streams[0];



      const response = {
        status: res.statusCode,
        statusText: res.statusMessage,
        headers: new AxiosHeaders$1(res.headers),
        config,
        request: lastRequest
      };

      if (responseType === 'stream') {
        response.data = responseStream;
        settle(resolve, reject, response);
      } else {
        const responseBuffer = [];
        let totalResponseBytes = 0;

        responseStream.on('data', function handleStreamData(chunk) {
          responseBuffer.push(chunk);
          totalResponseBytes += chunk.length;

          // make sure the content length is not over the maxContentLength if specified
          if (config.maxContentLength > -1 && totalResponseBytes > config.maxContentLength) {
            // stream.destroy() emit aborted event before calling reject() on Node.js v16
            rejected = true;
            responseStream.destroy();
            abort(new AxiosError('maxContentLength size of ' + config.maxContentLength + ' exceeded',
              AxiosError.ERR_BAD_RESPONSE, config, lastRequest));
          }
        });

        responseStream.on('aborted', function handlerStreamAborted() {
          if (rejected) {
            return;
          }

          const err = new AxiosError(
            'stream has been aborted',
            AxiosError.ERR_BAD_RESPONSE,
            config,
            lastRequest
          );
          responseStream.destroy(err);
          reject(err);
        });

        responseStream.on('error', function handleStreamError(err) {
          if (req.destroyed) return;
          reject(AxiosError.from(err, null, config, lastRequest));
        });

        responseStream.on('end', function handleStreamEnd() {
          try {
            let responseData = responseBuffer.length === 1 ? responseBuffer[0] : Buffer.concat(responseBuffer);
            if (responseType !== 'arraybuffer') {
              responseData = responseData.toString(responseEncoding);
              if (!responseEncoding || responseEncoding === 'utf8') {
                responseData = utils$1.stripBOM(responseData);
              }
            }
            response.data = responseData;
          } catch (err) {
            return reject(AxiosError.from(err, null, config, response.request, response));
          }
          settle(resolve, reject, response);
        });
      }

      abortEmitter.once('abort', err => {
        if (!responseStream.destroyed) {
          responseStream.emit('error', err);
          responseStream.destroy();
        }
      });
    });

    abortEmitter.once('abort', err => {
      if (req.close) {
        req.close();
      } else {
        req.destroy(err);
      }
    });

    // Handle errors
    req.on('error', function handleRequestError(err) {
      // @todo remove
      // if (req.aborted && err.code !== AxiosError.ERR_FR_TOO_MANY_REDIRECTS) return;
      reject(AxiosError.from(err, null, config, req));
    });

    // set tcp keep alive to prevent drop connection by peer
    req.on('socket', function handleRequestSocket(socket) {
      // default interval of sending ack packet is 1 minute
      socket.setKeepAlive(true, 1000 * 60);
    });

    // Handle request timeout
    if (config.timeout) {
      // This is forcing a int timeout to avoid problems if the `req` interface doesn't handle other types.
      const timeout = parseInt(config.timeout, 10);

      if (Number.isNaN(timeout)) {
        abort(new AxiosError(
          'error trying to parse `config.timeout` to int',
          AxiosError.ERR_BAD_OPTION_VALUE,
          config,
          req
        ));

        return;
      }

      // Sometime, the response will be very slow, and does not respond, the connect event will be block by event loop system.
      // And timer callback will be fired, and abort() will be invoked before connection, then get "socket hang up" and code ECONNRESET.
      // At this time, if we have a large number of request, nodejs will hang up some socket on background. and the number will up and up.
      // And then these socket which be hang up will devouring CPU little by little.
      // ClientRequest.setTimeout will be fired on the specify milliseconds, and can make sure that abort() will be fired after connect.
      req.setTimeout(timeout, function handleRequestTimeout() {
        if (isDone) return;
        let timeoutErrorMessage = config.timeout ? 'timeout of ' + config.timeout + 'ms exceeded' : 'timeout exceeded';
        const transitional = config.transitional || transitionalDefaults;
        if (config.timeoutErrorMessage) {
          timeoutErrorMessage = config.timeoutErrorMessage;
        }
        abort(new AxiosError(
          timeoutErrorMessage,
          transitional.clarifyTimeoutError ? AxiosError.ETIMEDOUT : AxiosError.ECONNABORTED,
          config,
          req
        ));
      });
    } else {
      // explicitly reset the socket timeout value for a possible `keep-alive` request
      req.setTimeout(0);
    }


    // Send the request
    if (utils$1.isStream(data)) {
      let ended = false;
      let errored = false;

      data.on('end', () => {
        ended = true;
      });

      data.once('error', err => {
        errored = true;
        req.destroy(err);
      });

      data.on('close', () => {
        if (!ended && !errored) {
          abort(new CanceledError('Request stream has been aborted', config, req));
        }
      });

      data.pipe(req);
    } else {
      data && req.write(data);
      req.end();
    }
  });
};

const isURLSameOrigin = platform.hasStandardBrowserEnv ? ((origin, isMSIE) => (url) => {
  url = new URL(url, platform.origin);

  return (
    origin.protocol === url.protocol &&
    origin.host === url.host &&
    (isMSIE || origin.port === url.port)
  );
})(
  new URL(platform.origin),
  platform.navigator && /(msie|trident)/i.test(platform.navigator.userAgent)
) : () => true;

const cookies = platform.hasStandardBrowserEnv ?

  // Standard browser envs support document.cookie
  {
    write(name, value, expires, path, domain, secure, sameSite) {
      if (typeof document === 'undefined') return;

      const cookie = [`${name}=${encodeURIComponent(value)}`];

      if (utils$1.isNumber(expires)) {
        cookie.push(`expires=${new Date(expires).toUTCString()}`);
      }
      if (utils$1.isString(path)) {
        cookie.push(`path=${path}`);
      }
      if (utils$1.isString(domain)) {
        cookie.push(`domain=${domain}`);
      }
      if (secure === true) {
        cookie.push('secure');
      }
      if (utils$1.isString(sameSite)) {
        cookie.push(`SameSite=${sameSite}`);
      }

      document.cookie = cookie.join('; ');
    },

    read(name) {
      if (typeof document === 'undefined') return null;
      const match = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
      return match ? decodeURIComponent(match[1]) : null;
    },

    remove(name) {
      this.write(name, '', Date.now() - 86400000, '/');
    }
  }

  :

  // Non-standard browser env (web workers, react-native) lack needed support.
  {
    write() {},
    read() {
      return null;
    },
    remove() {}
  };

const headersToObject = (thing) => thing instanceof AxiosHeaders$1 ? { ...thing } : thing;

/**
 * Config-specific merge-function which creates a new config-object
 * by merging two configuration objects together.
 *
 * @param {Object} config1
 * @param {Object} config2
 *
 * @returns {Object} New object resulting from merging config2 to config1
 */
function mergeConfig(config1, config2) {
  // eslint-disable-next-line no-param-reassign
  config2 = config2 || {};
  const config = {};

  function getMergedValue(target, source, prop, caseless) {
    if (utils$1.isPlainObject(target) && utils$1.isPlainObject(source)) {
      return utils$1.merge.call({caseless}, target, source);
    } else if (utils$1.isPlainObject(source)) {
      return utils$1.merge({}, source);
    } else if (utils$1.isArray(source)) {
      return source.slice();
    }
    return source;
  }

  // eslint-disable-next-line consistent-return
  function mergeDeepProperties(a, b, prop, caseless) {
    if (!utils$1.isUndefined(b)) {
      return getMergedValue(a, b, prop, caseless);
    } else if (!utils$1.isUndefined(a)) {
      return getMergedValue(undefined, a, prop, caseless);
    }
  }

  // eslint-disable-next-line consistent-return
  function valueFromConfig2(a, b) {
    if (!utils$1.isUndefined(b)) {
      return getMergedValue(undefined, b);
    }
  }

  // eslint-disable-next-line consistent-return
  function defaultToConfig2(a, b) {
    if (!utils$1.isUndefined(b)) {
      return getMergedValue(undefined, b);
    } else if (!utils$1.isUndefined(a)) {
      return getMergedValue(undefined, a);
    }
  }

  // eslint-disable-next-line consistent-return
  function mergeDirectKeys(a, b, prop) {
    if (prop in config2) {
      return getMergedValue(a, b);
    } else if (prop in config1) {
      return getMergedValue(undefined, a);
    }
  }

  const mergeMap = {
    url: valueFromConfig2,
    method: valueFromConfig2,
    data: valueFromConfig2,
    baseURL: defaultToConfig2,
    transformRequest: defaultToConfig2,
    transformResponse: defaultToConfig2,
    paramsSerializer: defaultToConfig2,
    timeout: defaultToConfig2,
    timeoutMessage: defaultToConfig2,
    withCredentials: defaultToConfig2,
    withXSRFToken: defaultToConfig2,
    adapter: defaultToConfig2,
    responseType: defaultToConfig2,
    xsrfCookieName: defaultToConfig2,
    xsrfHeaderName: defaultToConfig2,
    onUploadProgress: defaultToConfig2,
    onDownloadProgress: defaultToConfig2,
    decompress: defaultToConfig2,
    maxContentLength: defaultToConfig2,
    maxBodyLength: defaultToConfig2,
    beforeRedirect: defaultToConfig2,
    transport: defaultToConfig2,
    httpAgent: defaultToConfig2,
    httpsAgent: defaultToConfig2,
    cancelToken: defaultToConfig2,
    socketPath: defaultToConfig2,
    responseEncoding: defaultToConfig2,
    validateStatus: mergeDirectKeys,
    headers: (a, b, prop) => mergeDeepProperties(headersToObject(a), headersToObject(b), prop, true)
  };

  utils$1.forEach(Object.keys({...config1, ...config2}), function computeConfigValue(prop) {
    const merge = mergeMap[prop] || mergeDeepProperties;
    const configValue = merge(config1[prop], config2[prop], prop);
    (utils$1.isUndefined(configValue) && merge !== mergeDirectKeys) || (config[prop] = configValue);
  });

  return config;
}

const resolveConfig = (config) => {
  const newConfig = mergeConfig({}, config);

  let { data, withXSRFToken, xsrfHeaderName, xsrfCookieName, headers, auth } = newConfig;

  newConfig.headers = headers = AxiosHeaders$1.from(headers);

  newConfig.url = buildURL(buildFullPath(newConfig.baseURL, newConfig.url, newConfig.allowAbsoluteUrls), config.params, config.paramsSerializer);

  // HTTP basic authentication
  if (auth) {
    headers.set('Authorization', 'Basic ' +
      btoa((auth.username || '') + ':' + (auth.password ? unescape(encodeURIComponent(auth.password)) : ''))
    );
  }

  if (utils$1.isFormData(data)) {
    if (platform.hasStandardBrowserEnv || platform.hasStandardBrowserWebWorkerEnv) {
      headers.setContentType(undefined); // browser handles it
    } else if (utils$1.isFunction(data.getHeaders)) {
      // Node.js FormData (like form-data package)
      const formHeaders = data.getHeaders();
      // Only set safe headers to avoid overwriting security headers
      const allowedHeaders = ['content-type', 'content-length'];
      Object.entries(formHeaders).forEach(([key, val]) => {
        if (allowedHeaders.includes(key.toLowerCase())) {
          headers.set(key, val);
        }
      });
    }
  }  

  // Add xsrf header
  // This is only done if running in a standard browser environment.
  // Specifically not if we're in a web worker, or react-native.

  if (platform.hasStandardBrowserEnv) {
    withXSRFToken && utils$1.isFunction(withXSRFToken) && (withXSRFToken = withXSRFToken(newConfig));

    if (withXSRFToken || (withXSRFToken !== false && isURLSameOrigin(newConfig.url))) {
      // Add xsrf header
      const xsrfValue = xsrfHeaderName && xsrfCookieName && cookies.read(xsrfCookieName);

      if (xsrfValue) {
        headers.set(xsrfHeaderName, xsrfValue);
      }
    }
  }

  return newConfig;
};

const isXHRAdapterSupported = typeof XMLHttpRequest !== 'undefined';

const xhrAdapter = isXHRAdapterSupported && function (config) {
  return new Promise(function dispatchXhrRequest(resolve, reject) {
    const _config = resolveConfig(config);
    let requestData = _config.data;
    const requestHeaders = AxiosHeaders$1.from(_config.headers).normalize();
    let {responseType, onUploadProgress, onDownloadProgress} = _config;
    let onCanceled;
    let uploadThrottled, downloadThrottled;
    let flushUpload, flushDownload;

    function done() {
      flushUpload && flushUpload(); // flush events
      flushDownload && flushDownload(); // flush events

      _config.cancelToken && _config.cancelToken.unsubscribe(onCanceled);

      _config.signal && _config.signal.removeEventListener('abort', onCanceled);
    }

    let request = new XMLHttpRequest();

    request.open(_config.method.toUpperCase(), _config.url, true);

    // Set the request timeout in MS
    request.timeout = _config.timeout;

    function onloadend() {
      if (!request) {
        return;
      }
      // Prepare the response
      const responseHeaders = AxiosHeaders$1.from(
        'getAllResponseHeaders' in request && request.getAllResponseHeaders()
      );
      const responseData = !responseType || responseType === 'text' || responseType === 'json' ?
        request.responseText : request.response;
      const response = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        config,
        request
      };

      settle(function _resolve(value) {
        resolve(value);
        done();
      }, function _reject(err) {
        reject(err);
        done();
      }, response);

      // Clean up request
      request = null;
    }

    if ('onloadend' in request) {
      // Use onloadend if available
      request.onloadend = onloadend;
    } else {
      // Listen for ready state to emulate onloadend
      request.onreadystatechange = function handleLoad() {
        if (!request || request.readyState !== 4) {
          return;
        }

        // The request errored out and we didn't get a response, this will be
        // handled by onerror instead
        // With one exception: request that using file: protocol, most browsers
        // will return status as 0 even though it's a successful request
        if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
          return;
        }
        // readystate handler is calling before onerror or ontimeout handlers,
        // so we should call onloadend on the next 'tick'
        setTimeout(onloadend);
      };
    }

    // Handle browser request cancellation (as opposed to a manual cancellation)
    request.onabort = function handleAbort() {
      if (!request) {
        return;
      }

      reject(new AxiosError('Request aborted', AxiosError.ECONNABORTED, config, request));

      // Clean up request
      request = null;
    };

    // Handle low level network errors
  request.onerror = function handleError(event) {
       // Browsers deliver a ProgressEvent in XHR onerror
       // (message may be empty; when present, surface it)
       // See https://developer.mozilla.org/docs/Web/API/XMLHttpRequest/error_event
       const msg = event && event.message ? event.message : 'Network Error';
       const err = new AxiosError(msg, AxiosError.ERR_NETWORK, config, request);
       // attach the underlying event for consumers who want details
       err.event = event || null;
       reject(err);
       request = null;
    };
    
    // Handle timeout
    request.ontimeout = function handleTimeout() {
      let timeoutErrorMessage = _config.timeout ? 'timeout of ' + _config.timeout + 'ms exceeded' : 'timeout exceeded';
      const transitional = _config.transitional || transitionalDefaults;
      if (_config.timeoutErrorMessage) {
        timeoutErrorMessage = _config.timeoutErrorMessage;
      }
      reject(new AxiosError(
        timeoutErrorMessage,
        transitional.clarifyTimeoutError ? AxiosError.ETIMEDOUT : AxiosError.ECONNABORTED,
        config,
        request));

      // Clean up request
      request = null;
    };

    // Remove Content-Type if data is undefined
    requestData === undefined && requestHeaders.setContentType(null);

    // Add headers to the request
    if ('setRequestHeader' in request) {
      utils$1.forEach(requestHeaders.toJSON(), function setRequestHeader(val, key) {
        request.setRequestHeader(key, val);
      });
    }

    // Add withCredentials to request if needed
    if (!utils$1.isUndefined(_config.withCredentials)) {
      request.withCredentials = !!_config.withCredentials;
    }

    // Add responseType to request if needed
    if (responseType && responseType !== 'json') {
      request.responseType = _config.responseType;
    }

    // Handle progress if needed
    if (onDownloadProgress) {
      ([downloadThrottled, flushDownload] = progressEventReducer(onDownloadProgress, true));
      request.addEventListener('progress', downloadThrottled);
    }

    // Not all browsers support upload events
    if (onUploadProgress && request.upload) {
      ([uploadThrottled, flushUpload] = progressEventReducer(onUploadProgress));

      request.upload.addEventListener('progress', uploadThrottled);

      request.upload.addEventListener('loadend', flushUpload);
    }

    if (_config.cancelToken || _config.signal) {
      // Handle cancellation
      // eslint-disable-next-line func-names
      onCanceled = cancel => {
        if (!request) {
          return;
        }
        reject(!cancel || cancel.type ? new CanceledError(null, config, request) : cancel);
        request.abort();
        request = null;
      };

      _config.cancelToken && _config.cancelToken.subscribe(onCanceled);
      if (_config.signal) {
        _config.signal.aborted ? onCanceled() : _config.signal.addEventListener('abort', onCanceled);
      }
    }

    const protocol = parseProtocol(_config.url);

    if (protocol && platform.protocols.indexOf(protocol) === -1) {
      reject(new AxiosError('Unsupported protocol ' + protocol + ':', AxiosError.ERR_BAD_REQUEST, config));
      return;
    }


    // Send the request
    request.send(requestData || null);
  });
};

const composeSignals = (signals, timeout) => {
  const {length} = (signals = signals ? signals.filter(Boolean) : []);

  if (timeout || length) {
    let controller = new AbortController();

    let aborted;

    const onabort = function (reason) {
      if (!aborted) {
        aborted = true;
        unsubscribe();
        const err = reason instanceof Error ? reason : this.reason;
        controller.abort(err instanceof AxiosError ? err : new CanceledError(err instanceof Error ? err.message : err));
      }
    };

    let timer = timeout && setTimeout(() => {
      timer = null;
      onabort(new AxiosError(`timeout ${timeout} of ms exceeded`, AxiosError.ETIMEDOUT));
    }, timeout);

    const unsubscribe = () => {
      if (signals) {
        timer && clearTimeout(timer);
        timer = null;
        signals.forEach(signal => {
          signal.unsubscribe ? signal.unsubscribe(onabort) : signal.removeEventListener('abort', onabort);
        });
        signals = null;
      }
    };

    signals.forEach((signal) => signal.addEventListener('abort', onabort));

    const {signal} = controller;

    signal.unsubscribe = () => utils$1.asap(unsubscribe);

    return signal;
  }
};

const composeSignals$1 = composeSignals;

const streamChunk = function* (chunk, chunkSize) {
  let len = chunk.byteLength;

  if (!chunkSize || len < chunkSize) {
    yield chunk;
    return;
  }

  let pos = 0;
  let end;

  while (pos < len) {
    end = pos + chunkSize;
    yield chunk.slice(pos, end);
    pos = end;
  }
};

const readBytes = async function* (iterable, chunkSize) {
  for await (const chunk of readStream(iterable)) {
    yield* streamChunk(chunk, chunkSize);
  }
};

const readStream = async function* (stream) {
  if (stream[Symbol.asyncIterator]) {
    yield* stream;
    return;
  }

  const reader = stream.getReader();
  try {
    for (;;) {
      const {done, value} = await reader.read();
      if (done) {
        break;
      }
      yield value;
    }
  } finally {
    await reader.cancel();
  }
};

const trackStream = (stream, chunkSize, onProgress, onFinish) => {
  const iterator = readBytes(stream, chunkSize);

  let bytes = 0;
  let done;
  let _onFinish = (e) => {
    if (!done) {
      done = true;
      onFinish && onFinish(e);
    }
  };

  return new ReadableStream({
    async pull(controller) {
      try {
        const {done, value} = await iterator.next();

        if (done) {
         _onFinish();
          controller.close();
          return;
        }

        let len = value.byteLength;
        if (onProgress) {
          let loadedBytes = bytes += len;
          onProgress(loadedBytes);
        }
        controller.enqueue(new Uint8Array(value));
      } catch (err) {
        _onFinish(err);
        throw err;
      }
    },
    cancel(reason) {
      _onFinish(reason);
      return iterator.return();
    }
  }, {
    highWaterMark: 2
  })
};

const DEFAULT_CHUNK_SIZE = 64 * 1024;

const {isFunction} = utils$1;

const globalFetchAPI = (({Request, Response}) => ({
  Request, Response
}))(utils$1.global);

const {
  ReadableStream: ReadableStream$1, TextEncoder: TextEncoder$1
} = utils$1.global;


const test = (fn, ...args) => {
  try {
    return !!fn(...args);
  } catch (e) {
    return false
  }
};

const factory = (env) => {
  env = utils$1.merge.call({
    skipUndefined: true
  }, globalFetchAPI, env);

  const {fetch: envFetch, Request, Response} = env;
  const isFetchSupported = envFetch ? isFunction(envFetch) : typeof fetch === 'function';
  const isRequestSupported = isFunction(Request);
  const isResponseSupported = isFunction(Response);

  if (!isFetchSupported) {
    return false;
  }

  const isReadableStreamSupported = isFetchSupported && isFunction(ReadableStream$1);

  const encodeText = isFetchSupported && (typeof TextEncoder$1 === 'function' ?
      ((encoder) => (str) => encoder.encode(str))(new TextEncoder$1()) :
      async (str) => new Uint8Array(await new Request(str).arrayBuffer())
  );

  const supportsRequestStream = isRequestSupported && isReadableStreamSupported && test(() => {
    let duplexAccessed = false;

    const hasContentType = new Request(platform.origin, {
      body: new ReadableStream$1(),
      method: 'POST',
      get duplex() {
        duplexAccessed = true;
        return 'half';
      },
    }).headers.has('Content-Type');

    return duplexAccessed && !hasContentType;
  });

  const supportsResponseStream = isResponseSupported && isReadableStreamSupported &&
    test(() => utils$1.isReadableStream(new Response('').body));

  const resolvers = {
    stream: supportsResponseStream && ((res) => res.body)
  };

  isFetchSupported && ((() => {
    ['text', 'arrayBuffer', 'blob', 'formData', 'stream'].forEach(type => {
      !resolvers[type] && (resolvers[type] = (res, config) => {
        let method = res && res[type];

        if (method) {
          return method.call(res);
        }

        throw new AxiosError(`Response type '${type}' is not supported`, AxiosError.ERR_NOT_SUPPORT, config);
      });
    });
  })());

  const getBodyLength = async (body) => {
    if (body == null) {
      return 0;
    }

    if (utils$1.isBlob(body)) {
      return body.size;
    }

    if (utils$1.isSpecCompliantForm(body)) {
      const _request = new Request(platform.origin, {
        method: 'POST',
        body,
      });
      return (await _request.arrayBuffer()).byteLength;
    }

    if (utils$1.isArrayBufferView(body) || utils$1.isArrayBuffer(body)) {
      return body.byteLength;
    }

    if (utils$1.isURLSearchParams(body)) {
      body = body + '';
    }

    if (utils$1.isString(body)) {
      return (await encodeText(body)).byteLength;
    }
  };

  const resolveBodyLength = async (headers, body) => {
    const length = utils$1.toFiniteNumber(headers.getContentLength());

    return length == null ? getBodyLength(body) : length;
  };

  return async (config) => {
    let {
      url,
      method,
      data,
      signal,
      cancelToken,
      timeout,
      onDownloadProgress,
      onUploadProgress,
      responseType,
      headers,
      withCredentials = 'same-origin',
      fetchOptions
    } = resolveConfig(config);

    let _fetch = envFetch || fetch;

    responseType = responseType ? (responseType + '').toLowerCase() : 'text';

    let composedSignal = composeSignals$1([signal, cancelToken && cancelToken.toAbortSignal()], timeout);

    let request = null;

    const unsubscribe = composedSignal && composedSignal.unsubscribe && (() => {
      composedSignal.unsubscribe();
    });

    let requestContentLength;

    try {
      if (
        onUploadProgress && supportsRequestStream && method !== 'get' && method !== 'head' &&
        (requestContentLength = await resolveBodyLength(headers, data)) !== 0
      ) {
        let _request = new Request(url, {
          method: 'POST',
          body: data,
          duplex: "half"
        });

        let contentTypeHeader;

        if (utils$1.isFormData(data) && (contentTypeHeader = _request.headers.get('content-type'))) {
          headers.setContentType(contentTypeHeader);
        }

        if (_request.body) {
          const [onProgress, flush] = progressEventDecorator(
            requestContentLength,
            progressEventReducer(asyncDecorator(onUploadProgress))
          );

          data = trackStream(_request.body, DEFAULT_CHUNK_SIZE, onProgress, flush);
        }
      }

      if (!utils$1.isString(withCredentials)) {
        withCredentials = withCredentials ? 'include' : 'omit';
      }

      // Cloudflare Workers throws when credentials are defined
      // see https://github.com/cloudflare/workerd/issues/902
      const isCredentialsSupported = isRequestSupported && "credentials" in Request.prototype;

      const resolvedOptions = {
        ...fetchOptions,
        signal: composedSignal,
        method: method.toUpperCase(),
        headers: headers.normalize().toJSON(),
        body: data,
        duplex: "half",
        credentials: isCredentialsSupported ? withCredentials : undefined
      };

      request = isRequestSupported && new Request(url, resolvedOptions);

      let response = await (isRequestSupported ? _fetch(request, fetchOptions) : _fetch(url, resolvedOptions));

      const isStreamResponse = supportsResponseStream && (responseType === 'stream' || responseType === 'response');

      if (supportsResponseStream && (onDownloadProgress || (isStreamResponse && unsubscribe))) {
        const options = {};

        ['status', 'statusText', 'headers'].forEach(prop => {
          options[prop] = response[prop];
        });

        const responseContentLength = utils$1.toFiniteNumber(response.headers.get('content-length'));

        const [onProgress, flush] = onDownloadProgress && progressEventDecorator(
          responseContentLength,
          progressEventReducer(asyncDecorator(onDownloadProgress), true)
        ) || [];

        response = new Response(
          trackStream(response.body, DEFAULT_CHUNK_SIZE, onProgress, () => {
            flush && flush();
            unsubscribe && unsubscribe();
          }),
          options
        );
      }

      responseType = responseType || 'text';

      let responseData = await resolvers[utils$1.findKey(resolvers, responseType) || 'text'](response, config);

      !isStreamResponse && unsubscribe && unsubscribe();

      return await new Promise((resolve, reject) => {
        settle(resolve, reject, {
          data: responseData,
          headers: AxiosHeaders$1.from(response.headers),
          status: response.status,
          statusText: response.statusText,
          config,
          request
        });
      })
    } catch (err) {
      unsubscribe && unsubscribe();

      if (err && err.name === 'TypeError' && /Load failed|fetch/i.test(err.message)) {
        throw Object.assign(
          new AxiosError('Network Error', AxiosError.ERR_NETWORK, config, request),
          {
            cause: err.cause || err
          }
        )
      }

      throw AxiosError.from(err, err && err.code, config, request);
    }
  }
};

const seedCache = new Map();

const getFetch = (config) => {
  let env = (config && config.env) || {};
  const {fetch, Request, Response} = env;
  const seeds = [
    Request, Response, fetch
  ];

  let len = seeds.length, i = len,
    seed, target, map = seedCache;

  while (i--) {
    seed = seeds[i];
    target = map.get(seed);

    target === undefined && map.set(seed, target = (i ? new Map() : factory(env)));

    map = target;
  }

  return target;
};

getFetch();

/**
 * Known adapters mapping.
 * Provides environment-specific adapters for Axios:
 * - `http` for Node.js
 * - `xhr` for browsers
 * - `fetch` for fetch API-based requests
 * 
 * @type {Object<string, Function|Object>}
 */
const knownAdapters = {
  http: httpAdapter,
  xhr: xhrAdapter,
  fetch: {
    get: getFetch,
  }
};

// Assign adapter names for easier debugging and identification
utils$1.forEach(knownAdapters, (fn, value) => {
  if (fn) {
    try {
      Object.defineProperty(fn, 'name', { value });
    } catch (e) {
      // eslint-disable-next-line no-empty
    }
    Object.defineProperty(fn, 'adapterName', { value });
  }
});

/**
 * Render a rejection reason string for unknown or unsupported adapters
 * 
 * @param {string} reason
 * @returns {string}
 */
const renderReason = (reason) => `- ${reason}`;

/**
 * Check if the adapter is resolved (function, null, or false)
 * 
 * @param {Function|null|false} adapter
 * @returns {boolean}
 */
const isResolvedHandle = (adapter) => utils$1.isFunction(adapter) || adapter === null || adapter === false;

/**
 * Get the first suitable adapter from the provided list.
 * Tries each adapter in order until a supported one is found.
 * Throws an AxiosError if no adapter is suitable.
 * 
 * @param {Array<string|Function>|string|Function} adapters - Adapter(s) by name or function.
 * @param {Object} config - Axios request configuration
 * @throws {AxiosError} If no suitable adapter is available
 * @returns {Function} The resolved adapter function
 */
function getAdapter(adapters, config) {
  adapters = utils$1.isArray(adapters) ? adapters : [adapters];

  const { length } = adapters;
  let nameOrAdapter;
  let adapter;

  const rejectedReasons = {};

  for (let i = 0; i < length; i++) {
    nameOrAdapter = adapters[i];
    let id;

    adapter = nameOrAdapter;

    if (!isResolvedHandle(nameOrAdapter)) {
      adapter = knownAdapters[(id = String(nameOrAdapter)).toLowerCase()];

      if (adapter === undefined) {
        throw new AxiosError(`Unknown adapter '${id}'`);
      }
    }

    if (adapter && (utils$1.isFunction(adapter) || (adapter = adapter.get(config)))) {
      break;
    }

    rejectedReasons[id || '#' + i] = adapter;
  }

  if (!adapter) {
    const reasons = Object.entries(rejectedReasons)
      .map(([id, state]) => `adapter ${id} ` +
        (state === false ? 'is not supported by the environment' : 'is not available in the build')
      );

    let s = length ?
      (reasons.length > 1 ? 'since :\n' + reasons.map(renderReason).join('\n') : ' ' + renderReason(reasons[0])) :
      'as no adapter specified';

    throw new AxiosError(
      `There is no suitable adapter to dispatch the request ` + s,
      'ERR_NOT_SUPPORT'
    );
  }

  return adapter;
}

/**
 * Exports Axios adapters and utility to resolve an adapter
 */
const adapters = {
  /**
   * Resolve an adapter from a list of adapter names or functions.
   * @type {Function}
   */
  getAdapter,

  /**
   * Exposes all known adapters
   * @type {Object<string, Function|Object>}
   */
  adapters: knownAdapters
};

/**
 * Throws a `CanceledError` if cancellation has been requested.
 *
 * @param {Object} config The config that is to be used for the request
 *
 * @returns {void}
 */
function throwIfCancellationRequested(config) {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested();
  }

  if (config.signal && config.signal.aborted) {
    throw new CanceledError(null, config);
  }
}

/**
 * Dispatch a request to the server using the configured adapter.
 *
 * @param {object} config The config that is to be used for the request
 *
 * @returns {Promise} The Promise to be fulfilled
 */
function dispatchRequest(config) {
  throwIfCancellationRequested(config);

  config.headers = AxiosHeaders$1.from(config.headers);

  // Transform request data
  config.data = transformData.call(
    config,
    config.transformRequest
  );

  if (['post', 'put', 'patch'].indexOf(config.method) !== -1) {
    config.headers.setContentType('application/x-www-form-urlencoded', false);
  }

  const adapter = adapters.getAdapter(config.adapter || defaults$1.adapter, config);

  return adapter(config).then(function onAdapterResolution(response) {
    throwIfCancellationRequested(config);

    // Transform response data
    response.data = transformData.call(
      config,
      config.transformResponse,
      response
    );

    response.headers = AxiosHeaders$1.from(response.headers);

    return response;
  }, function onAdapterRejection(reason) {
    if (!isCancel(reason)) {
      throwIfCancellationRequested(config);

      // Transform response data
      if (reason && reason.response) {
        reason.response.data = transformData.call(
          config,
          config.transformResponse,
          reason.response
        );
        reason.response.headers = AxiosHeaders$1.from(reason.response.headers);
      }
    }

    return Promise.reject(reason);
  });
}

const validators$1 = {};

// eslint-disable-next-line func-names
['object', 'boolean', 'number', 'function', 'string', 'symbol'].forEach((type, i) => {
  validators$1[type] = function validator(thing) {
    return typeof thing === type || 'a' + (i < 1 ? 'n ' : ' ') + type;
  };
});

const deprecatedWarnings = {};

/**
 * Transitional option validator
 *
 * @param {function|boolean?} validator - set to false if the transitional option has been removed
 * @param {string?} version - deprecated version / removed since version
 * @param {string?} message - some message with additional info
 *
 * @returns {function}
 */
validators$1.transitional = function transitional(validator, version, message) {
  function formatMessage(opt, desc) {
    return '[Axios v' + VERSION + '] Transitional option \'' + opt + '\'' + desc + (message ? '. ' + message : '');
  }

  // eslint-disable-next-line func-names
  return (value, opt, opts) => {
    if (validator === false) {
      throw new AxiosError(
        formatMessage(opt, ' has been removed' + (version ? ' in ' + version : '')),
        AxiosError.ERR_DEPRECATED
      );
    }

    if (version && !deprecatedWarnings[opt]) {
      deprecatedWarnings[opt] = true;
      // eslint-disable-next-line no-console
      console.warn(
        formatMessage(
          opt,
          ' has been deprecated since v' + version + ' and will be removed in the near future'
        )
      );
    }

    return validator ? validator(value, opt, opts) : true;
  };
};

validators$1.spelling = function spelling(correctSpelling) {
  return (value, opt) => {
    // eslint-disable-next-line no-console
    console.warn(`${opt} is likely a misspelling of ${correctSpelling}`);
    return true;
  }
};

/**
 * Assert object's properties type
 *
 * @param {object} options
 * @param {object} schema
 * @param {boolean?} allowUnknown
 *
 * @returns {object}
 */

function assertOptions(options, schema, allowUnknown) {
  if (typeof options !== 'object') {
    throw new AxiosError('options must be an object', AxiosError.ERR_BAD_OPTION_VALUE);
  }
  const keys = Object.keys(options);
  let i = keys.length;
  while (i-- > 0) {
    const opt = keys[i];
    const validator = schema[opt];
    if (validator) {
      const value = options[opt];
      const result = value === undefined || validator(value, opt, options);
      if (result !== true) {
        throw new AxiosError('option ' + opt + ' must be ' + result, AxiosError.ERR_BAD_OPTION_VALUE);
      }
      continue;
    }
    if (allowUnknown !== true) {
      throw new AxiosError('Unknown option ' + opt, AxiosError.ERR_BAD_OPTION);
    }
  }
}

const validator = {
  assertOptions,
  validators: validators$1
};

const validators = validator.validators;

/**
 * Create a new instance of Axios
 *
 * @param {Object} instanceConfig The default config for the instance
 *
 * @return {Axios} A new instance of Axios
 */
class Axios {
  constructor(instanceConfig) {
    this.defaults = instanceConfig || {};
    this.interceptors = {
      request: new InterceptorManager$1(),
      response: new InterceptorManager$1()
    };
  }

  /**
   * Dispatch a request
   *
   * @param {String|Object} configOrUrl The config specific for this request (merged with this.defaults)
   * @param {?Object} config
   *
   * @returns {Promise} The Promise to be fulfilled
   */
  async request(configOrUrl, config) {
    try {
      return await this._request(configOrUrl, config);
    } catch (err) {
      if (err instanceof Error) {
        let dummy = {};

        Error.captureStackTrace ? Error.captureStackTrace(dummy) : (dummy = new Error());

        // slice off the Error: ... line
        const stack = dummy.stack ? dummy.stack.replace(/^.+\n/, '') : '';
        try {
          if (!err.stack) {
            err.stack = stack;
            // match without the 2 top stack lines
          } else if (stack && !String(err.stack).endsWith(stack.replace(/^.+\n.+\n/, ''))) {
            err.stack += '\n' + stack;
          }
        } catch (e) {
          // ignore the case where "stack" is an un-writable property
        }
      }

      throw err;
    }
  }

  _request(configOrUrl, config) {
    /*eslint no-param-reassign:0*/
    // Allow for axios('example/url'[, config]) a la fetch API
    if (typeof configOrUrl === 'string') {
      config = config || {};
      config.url = configOrUrl;
    } else {
      config = configOrUrl || {};
    }

    config = mergeConfig(this.defaults, config);

    const {transitional, paramsSerializer, headers} = config;

    if (transitional !== undefined) {
      validator.assertOptions(transitional, {
        silentJSONParsing: validators.transitional(validators.boolean),
        forcedJSONParsing: validators.transitional(validators.boolean),
        clarifyTimeoutError: validators.transitional(validators.boolean)
      }, false);
    }

    if (paramsSerializer != null) {
      if (utils$1.isFunction(paramsSerializer)) {
        config.paramsSerializer = {
          serialize: paramsSerializer
        };
      } else {
        validator.assertOptions(paramsSerializer, {
          encode: validators.function,
          serialize: validators.function
        }, true);
      }
    }

    // Set config.allowAbsoluteUrls
    if (config.allowAbsoluteUrls !== undefined) ; else if (this.defaults.allowAbsoluteUrls !== undefined) {
      config.allowAbsoluteUrls = this.defaults.allowAbsoluteUrls;
    } else {
      config.allowAbsoluteUrls = true;
    }

    validator.assertOptions(config, {
      baseUrl: validators.spelling('baseURL'),
      withXsrfToken: validators.spelling('withXSRFToken')
    }, true);

    // Set config.method
    config.method = (config.method || this.defaults.method || 'get').toLowerCase();

    // Flatten headers
    let contextHeaders = headers && utils$1.merge(
      headers.common,
      headers[config.method]
    );

    headers && utils$1.forEach(
      ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
      (method) => {
        delete headers[method];
      }
    );

    config.headers = AxiosHeaders$1.concat(contextHeaders, headers);

    // filter out skipped interceptors
    const requestInterceptorChain = [];
    let synchronousRequestInterceptors = true;
    this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
      if (typeof interceptor.runWhen === 'function' && interceptor.runWhen(config) === false) {
        return;
      }

      synchronousRequestInterceptors = synchronousRequestInterceptors && interceptor.synchronous;

      requestInterceptorChain.unshift(interceptor.fulfilled, interceptor.rejected);
    });

    const responseInterceptorChain = [];
    this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
      responseInterceptorChain.push(interceptor.fulfilled, interceptor.rejected);
    });

    let promise;
    let i = 0;
    let len;

    if (!synchronousRequestInterceptors) {
      const chain = [dispatchRequest.bind(this), undefined];
      chain.unshift(...requestInterceptorChain);
      chain.push(...responseInterceptorChain);
      len = chain.length;

      promise = Promise.resolve(config);

      while (i < len) {
        promise = promise.then(chain[i++], chain[i++]);
      }

      return promise;
    }

    len = requestInterceptorChain.length;

    let newConfig = config;

    while (i < len) {
      const onFulfilled = requestInterceptorChain[i++];
      const onRejected = requestInterceptorChain[i++];
      try {
        newConfig = onFulfilled(newConfig);
      } catch (error) {
        onRejected.call(this, error);
        break;
      }
    }

    try {
      promise = dispatchRequest.call(this, newConfig);
    } catch (error) {
      return Promise.reject(error);
    }

    i = 0;
    len = responseInterceptorChain.length;

    while (i < len) {
      promise = promise.then(responseInterceptorChain[i++], responseInterceptorChain[i++]);
    }

    return promise;
  }

  getUri(config) {
    config = mergeConfig(this.defaults, config);
    const fullPath = buildFullPath(config.baseURL, config.url, config.allowAbsoluteUrls);
    return buildURL(fullPath, config.params, config.paramsSerializer);
  }
}

// Provide aliases for supported request methods
utils$1.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, config) {
    return this.request(mergeConfig(config || {}, {
      method,
      url,
      data: (config || {}).data
    }));
  };
});

utils$1.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  /*eslint func-names:0*/

  function generateHTTPMethod(isForm) {
    return function httpMethod(url, data, config) {
      return this.request(mergeConfig(config || {}, {
        method,
        headers: isForm ? {
          'Content-Type': 'multipart/form-data'
        } : {},
        url,
        data
      }));
    };
  }

  Axios.prototype[method] = generateHTTPMethod();

  Axios.prototype[method + 'Form'] = generateHTTPMethod(true);
});

const Axios$1 = Axios;

/**
 * A `CancelToken` is an object that can be used to request cancellation of an operation.
 *
 * @param {Function} executor The executor function.
 *
 * @returns {CancelToken}
 */
class CancelToken {
  constructor(executor) {
    if (typeof executor !== 'function') {
      throw new TypeError('executor must be a function.');
    }

    let resolvePromise;

    this.promise = new Promise(function promiseExecutor(resolve) {
      resolvePromise = resolve;
    });

    const token = this;

    // eslint-disable-next-line func-names
    this.promise.then(cancel => {
      if (!token._listeners) return;

      let i = token._listeners.length;

      while (i-- > 0) {
        token._listeners[i](cancel);
      }
      token._listeners = null;
    });

    // eslint-disable-next-line func-names
    this.promise.then = onfulfilled => {
      let _resolve;
      // eslint-disable-next-line func-names
      const promise = new Promise(resolve => {
        token.subscribe(resolve);
        _resolve = resolve;
      }).then(onfulfilled);

      promise.cancel = function reject() {
        token.unsubscribe(_resolve);
      };

      return promise;
    };

    executor(function cancel(message, config, request) {
      if (token.reason) {
        // Cancellation has already been requested
        return;
      }

      token.reason = new CanceledError(message, config, request);
      resolvePromise(token.reason);
    });
  }

  /**
   * Throws a `CanceledError` if cancellation has been requested.
   */
  throwIfRequested() {
    if (this.reason) {
      throw this.reason;
    }
  }

  /**
   * Subscribe to the cancel signal
   */

  subscribe(listener) {
    if (this.reason) {
      listener(this.reason);
      return;
    }

    if (this._listeners) {
      this._listeners.push(listener);
    } else {
      this._listeners = [listener];
    }
  }

  /**
   * Unsubscribe from the cancel signal
   */

  unsubscribe(listener) {
    if (!this._listeners) {
      return;
    }
    const index = this._listeners.indexOf(listener);
    if (index !== -1) {
      this._listeners.splice(index, 1);
    }
  }

  toAbortSignal() {
    const controller = new AbortController();

    const abort = (err) => {
      controller.abort(err);
    };

    this.subscribe(abort);

    controller.signal.unsubscribe = () => this.unsubscribe(abort);

    return controller.signal;
  }

  /**
   * Returns an object that contains a new `CancelToken` and a function that, when called,
   * cancels the `CancelToken`.
   */
  static source() {
    let cancel;
    const token = new CancelToken(function executor(c) {
      cancel = c;
    });
    return {
      token,
      cancel
    };
  }
}

const CancelToken$1 = CancelToken;

/**
 * Syntactic sugar for invoking a function and expanding an array for arguments.
 *
 * Common use case would be to use `Function.prototype.apply`.
 *
 *  ```js
 *  function f(x, y, z) {}
 *  var args = [1, 2, 3];
 *  f.apply(null, args);
 *  ```
 *
 * With `spread` this example can be re-written.
 *
 *  ```js
 *  spread(function(x, y, z) {})([1, 2, 3]);
 *  ```
 *
 * @param {Function} callback
 *
 * @returns {Function}
 */
function spread(callback) {
  return function wrap(arr) {
    return callback.apply(null, arr);
  };
}

/**
 * Determines whether the payload is an error thrown by Axios
 *
 * @param {*} payload The value to test
 *
 * @returns {boolean} True if the payload is an error thrown by Axios, otherwise false
 */
function isAxiosError(payload) {
  return utils$1.isObject(payload) && (payload.isAxiosError === true);
}

const HttpStatusCode = {
  Continue: 100,
  SwitchingProtocols: 101,
  Processing: 102,
  EarlyHints: 103,
  Ok: 200,
  Created: 201,
  Accepted: 202,
  NonAuthoritativeInformation: 203,
  NoContent: 204,
  ResetContent: 205,
  PartialContent: 206,
  MultiStatus: 207,
  AlreadyReported: 208,
  ImUsed: 226,
  MultipleChoices: 300,
  MovedPermanently: 301,
  Found: 302,
  SeeOther: 303,
  NotModified: 304,
  UseProxy: 305,
  Unused: 306,
  TemporaryRedirect: 307,
  PermanentRedirect: 308,
  BadRequest: 400,
  Unauthorized: 401,
  PaymentRequired: 402,
  Forbidden: 403,
  NotFound: 404,
  MethodNotAllowed: 405,
  NotAcceptable: 406,
  ProxyAuthenticationRequired: 407,
  RequestTimeout: 408,
  Conflict: 409,
  Gone: 410,
  LengthRequired: 411,
  PreconditionFailed: 412,
  PayloadTooLarge: 413,
  UriTooLong: 414,
  UnsupportedMediaType: 415,
  RangeNotSatisfiable: 416,
  ExpectationFailed: 417,
  ImATeapot: 418,
  MisdirectedRequest: 421,
  UnprocessableEntity: 422,
  Locked: 423,
  FailedDependency: 424,
  TooEarly: 425,
  UpgradeRequired: 426,
  PreconditionRequired: 428,
  TooManyRequests: 429,
  RequestHeaderFieldsTooLarge: 431,
  UnavailableForLegalReasons: 451,
  InternalServerError: 500,
  NotImplemented: 501,
  BadGateway: 502,
  ServiceUnavailable: 503,
  GatewayTimeout: 504,
  HttpVersionNotSupported: 505,
  VariantAlsoNegotiates: 506,
  InsufficientStorage: 507,
  LoopDetected: 508,
  NotExtended: 510,
  NetworkAuthenticationRequired: 511,
  WebServerIsDown: 521,
  ConnectionTimedOut: 522,
  OriginIsUnreachable: 523,
  TimeoutOccurred: 524,
  SslHandshakeFailed: 525,
  InvalidSslCertificate: 526,
};

Object.entries(HttpStatusCode).forEach(([key, value]) => {
  HttpStatusCode[value] = key;
});

const HttpStatusCode$1 = HttpStatusCode;

/**
 * Create an instance of Axios
 *
 * @param {Object} defaultConfig The default config for the instance
 *
 * @returns {Axios} A new instance of Axios
 */
function createInstance(defaultConfig) {
  const context = new Axios$1(defaultConfig);
  const instance = bind(Axios$1.prototype.request, context);

  // Copy axios.prototype to instance
  utils$1.extend(instance, Axios$1.prototype, context, {allOwnKeys: true});

  // Copy context to instance
  utils$1.extend(instance, context, null, {allOwnKeys: true});

  // Factory for creating new instances
  instance.create = function create(instanceConfig) {
    return createInstance(mergeConfig(defaultConfig, instanceConfig));
  };

  return instance;
}

// Create the default instance to be exported
const axios = createInstance(defaults$1);

// Expose Axios class to allow class inheritance
axios.Axios = Axios$1;

// Expose Cancel & CancelToken
axios.CanceledError = CanceledError;
axios.CancelToken = CancelToken$1;
axios.isCancel = isCancel;
axios.VERSION = VERSION;
axios.toFormData = toFormData;

// Expose AxiosError class
axios.AxiosError = AxiosError;

// alias for CanceledError for backward compatibility
axios.Cancel = axios.CanceledError;

// Expose all/spread
axios.all = function all(promises) {
  return Promise.all(promises);
};

axios.spread = spread;

// Expose isAxiosError
axios.isAxiosError = isAxiosError;

// Expose mergeConfig
axios.mergeConfig = mergeConfig;

axios.AxiosHeaders = AxiosHeaders$1;

axios.formToJSON = thing => formDataToJSON(utils$1.isHTMLForm(thing) ? new FormData(thing) : thing);

axios.getAdapter = adapters.getAdapter;

axios.HttpStatusCode = HttpStatusCode$1;

axios.default = axios;

module.exports = axios;
//# sourceMappingURL=axios.cjs.map


/***/ }),

/***/ 79538:
/***/ ((module) => {

"use strict";


/** @type {import('./ref')} */
module.exports = ReferenceError;


/***/ }),

/***/ 79612:
/***/ ((module) => {

"use strict";


/** @type {import('.')} */
module.exports = Object;


/***/ }),

/***/ 79896:
/***/ ((module) => {

"use strict";
module.exports = require("fs");

/***/ }),

/***/ 80585:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const net = __webpack_require__(69278);
const { XdrReader } = __webpack_require__(49035);
const DEFAULT_ENCODING = 'utf8';
const Const = __webpack_require__(52750);

var EventConnection = function (host, port, callback, db) {
    var self = this;
    this.db = db;
    this.emgr = null;
    this._isClosed = false;
    this._isOpened = false;
    this._socket = net.createConnection(port, host);
    this._bind_events(host, port, callback);
    this.error;
    this.eventcallback;
};

EventConnection.prototype._bind_events = function (host, port, callback) {
    var self = this;

    self._socket.on('close', function () {

        self._isClosed = true;
    })

    self._socket.on('error', function (e) {

        self.error = e;
    })

    self._socket.on('connect', function () {
        self._isClosed = false;
        self._isOpened = true;
        if (callback)
            callback();
    });

    self._socket.on('data', function (data) {
        var xdr, buf;

        if (!self._xdr) {
            xdr = new XdrReader(data);
        } else {
            xdr = self._xdr;
            delete (self._xdr);
            buf = Buffer.from(data.length + xdr.buffer.length);
            xdr.buffer.copy(buf);
            data.copy(buf, xdr.buffer.length);
            xdr.buffer = buf;
        }

        try {
            var item, op;
            var op_pos = xdr.pos;
            var tmp_event;
            while (xdr.pos < xdr.buffer.length) {
                do {
                    var r = xdr.readInt();
                } while (r === Const.op_dummy);

                switch (r) {
                    case Const.op_event:
                        xdr.readInt(); // db handle
                        var buf = xdr.readArray();
                        // first byte is always set to 1
                        tmp_event = {};
                        var lst_event = [];
                        var eventname = '';
                        var eventcount = 0;
                        var pos = 1;
                        while (pos < buf.length) {
                            var len = buf.readInt8(pos++);
                            eventname = buf.toString(DEFAULT_ENCODING, pos, pos + len);
                            var prevcount = self.emgr.events[eventname] || 0;
                            pos += len;
                            eventcount = buf.readInt32LE(pos);
                            tmp_event[eventname] = eventcount;
                            pos += 4;
                            if (prevcount !== eventcount)
                                lst_event.push({ name: eventname, count: eventcount });
                        }
                        xdr.readInt64(); // ignore AST INFO
                        var event_id = xdr.readInt();
                        // set the new count in global event hash
                        for (var evt in tmp_event) {
                            self.emgr.events[evt] = tmp_event[evt];
                        }
                        if (self.eventcallback)
                            return self.eventcallback(null, { eventid: event_id, events: lst_event });

                    default:
                        return cb(new Error('Unexpected:' + r));
                }
            }
        } catch (err) {
            if (err instanceof RangeError) { // incomplete packet case
                xdr.buffer = xdr.buffer = xdr.buffer.slice(op_pos);
                xdr.pos = 0;
                self._xdr = xdr;
            }
        }
    })
}

EventConnection.prototype.throwClosed = function (callback) {
    var err = new Error('Event Connection is closed.');
    this.db.emit('error', err);
    if (callback)
        callback(err);
    return this;
};

module.exports = EventConnection;

/***/ }),

/***/ 80801:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var util = __webpack_require__(39023);
var Stream = (__webpack_require__(2203).Stream);
var DelayedStream = __webpack_require__(78069);

module.exports = CombinedStream;
function CombinedStream() {
  this.writable = false;
  this.readable = true;
  this.dataSize = 0;
  this.maxDataSize = 2 * 1024 * 1024;
  this.pauseStreams = true;

  this._released = false;
  this._streams = [];
  this._currentStream = null;
  this._insideLoop = false;
  this._pendingNext = false;
}
util.inherits(CombinedStream, Stream);

CombinedStream.create = function(options) {
  var combinedStream = new this();

  options = options || {};
  for (var option in options) {
    combinedStream[option] = options[option];
  }

  return combinedStream;
};

CombinedStream.isStreamLike = function(stream) {
  return (typeof stream !== 'function')
    && (typeof stream !== 'string')
    && (typeof stream !== 'boolean')
    && (typeof stream !== 'number')
    && (!Buffer.isBuffer(stream));
};

CombinedStream.prototype.append = function(stream) {
  var isStreamLike = CombinedStream.isStreamLike(stream);

  if (isStreamLike) {
    if (!(stream instanceof DelayedStream)) {
      var newStream = DelayedStream.create(stream, {
        maxDataSize: Infinity,
        pauseStream: this.pauseStreams,
      });
      stream.on('data', this._checkDataSize.bind(this));
      stream = newStream;
    }

    this._handleErrors(stream);

    if (this.pauseStreams) {
      stream.pause();
    }
  }

  this._streams.push(stream);
  return this;
};

CombinedStream.prototype.pipe = function(dest, options) {
  Stream.prototype.pipe.call(this, dest, options);
  this.resume();
  return dest;
};

CombinedStream.prototype._getNext = function() {
  this._currentStream = null;

  if (this._insideLoop) {
    this._pendingNext = true;
    return; // defer call
  }

  this._insideLoop = true;
  try {
    do {
      this._pendingNext = false;
      this._realGetNext();
    } while (this._pendingNext);
  } finally {
    this._insideLoop = false;
  }
};

CombinedStream.prototype._realGetNext = function() {
  var stream = this._streams.shift();


  if (typeof stream == 'undefined') {
    this.end();
    return;
  }

  if (typeof stream !== 'function') {
    this._pipeNext(stream);
    return;
  }

  var getStream = stream;
  getStream(function(stream) {
    var isStreamLike = CombinedStream.isStreamLike(stream);
    if (isStreamLike) {
      stream.on('data', this._checkDataSize.bind(this));
      this._handleErrors(stream);
    }

    this._pipeNext(stream);
  }.bind(this));
};

CombinedStream.prototype._pipeNext = function(stream) {
  this._currentStream = stream;

  var isStreamLike = CombinedStream.isStreamLike(stream);
  if (isStreamLike) {
    stream.on('end', this._getNext.bind(this));
    stream.pipe(this, {end: false});
    return;
  }

  var value = stream;
  this.write(value);
  this._getNext();
};

CombinedStream.prototype._handleErrors = function(stream) {
  var self = this;
  stream.on('error', function(err) {
    self._emitError(err);
  });
};

CombinedStream.prototype.write = function(data) {
  this.emit('data', data);
};

CombinedStream.prototype.pause = function() {
  if (!this.pauseStreams) {
    return;
  }

  if(this.pauseStreams && this._currentStream && typeof(this._currentStream.pause) == 'function') this._currentStream.pause();
  this.emit('pause');
};

CombinedStream.prototype.resume = function() {
  if (!this._released) {
    this._released = true;
    this.writable = true;
    this._getNext();
  }

  if(this.pauseStreams && this._currentStream && typeof(this._currentStream.resume) == 'function') this._currentStream.resume();
  this.emit('resume');
};

CombinedStream.prototype.end = function() {
  this._reset();
  this.emit('end');
};

CombinedStream.prototype.destroy = function() {
  this._reset();
  this.emit('close');
};

CombinedStream.prototype._reset = function() {
  this.writable = false;
  this._streams = [];
  this._currentStream = null;
};

CombinedStream.prototype._checkDataSize = function() {
  this._updateDataSize();
  if (this.dataSize <= this.maxDataSize) {
    return;
  }

  var message =
    'DelayedStream#maxDataSize of ' + this.maxDataSize + ' bytes exceeded.';
  this._emitError(new Error(message));
};

CombinedStream.prototype._updateDataSize = function() {
  this.dataSize = 0;

  var self = this;
  this._streams.forEach(function(stream) {
    if (!stream.dataSize) {
      return;
    }

    self.dataSize += stream.dataSize;
  });

  if (this._currentStream && this._currentStream.dataSize) {
    this.dataSize += this._currentStream.dataSize;
  }
};

CombinedStream.prototype._emitError = function(err) {
  this._reset();
  this.emit('error', err);
};


/***/ }),

/***/ 81813:
/***/ ((module) => {

"use strict";
module.exports = /*#__PURE__*/JSON.parse('{"application/1d-interleaved-parityfec":{"source":"iana"},"application/3gpdash-qoe-report+xml":{"source":"iana","charset":"UTF-8","compressible":true},"application/3gpp-ims+xml":{"source":"iana","compressible":true},"application/3gpphal+json":{"source":"iana","compressible":true},"application/3gpphalforms+json":{"source":"iana","compressible":true},"application/a2l":{"source":"iana"},"application/ace+cbor":{"source":"iana"},"application/activemessage":{"source":"iana"},"application/activity+json":{"source":"iana","compressible":true},"application/alto-costmap+json":{"source":"iana","compressible":true},"application/alto-costmapfilter+json":{"source":"iana","compressible":true},"application/alto-directory+json":{"source":"iana","compressible":true},"application/alto-endpointcost+json":{"source":"iana","compressible":true},"application/alto-endpointcostparams+json":{"source":"iana","compressible":true},"application/alto-endpointprop+json":{"source":"iana","compressible":true},"application/alto-endpointpropparams+json":{"source":"iana","compressible":true},"application/alto-error+json":{"source":"iana","compressible":true},"application/alto-networkmap+json":{"source":"iana","compressible":true},"application/alto-networkmapfilter+json":{"source":"iana","compressible":true},"application/alto-updatestreamcontrol+json":{"source":"iana","compressible":true},"application/alto-updatestreamparams+json":{"source":"iana","compressible":true},"application/aml":{"source":"iana"},"application/andrew-inset":{"source":"iana","extensions":["ez"]},"application/applefile":{"source":"iana"},"application/applixware":{"source":"apache","extensions":["aw"]},"application/at+jwt":{"source":"iana"},"application/atf":{"source":"iana"},"application/atfx":{"source":"iana"},"application/atom+xml":{"source":"iana","compressible":true,"extensions":["atom"]},"application/atomcat+xml":{"source":"iana","compressible":true,"extensions":["atomcat"]},"application/atomdeleted+xml":{"source":"iana","compressible":true,"extensions":["atomdeleted"]},"application/atomicmail":{"source":"iana"},"application/atomsvc+xml":{"source":"iana","compressible":true,"extensions":["atomsvc"]},"application/atsc-dwd+xml":{"source":"iana","compressible":true,"extensions":["dwd"]},"application/atsc-dynamic-event-message":{"source":"iana"},"application/atsc-held+xml":{"source":"iana","compressible":true,"extensions":["held"]},"application/atsc-rdt+json":{"source":"iana","compressible":true},"application/atsc-rsat+xml":{"source":"iana","compressible":true,"extensions":["rsat"]},"application/atxml":{"source":"iana"},"application/auth-policy+xml":{"source":"iana","compressible":true},"application/bacnet-xdd+zip":{"source":"iana","compressible":false},"application/batch-smtp":{"source":"iana"},"application/bdoc":{"compressible":false,"extensions":["bdoc"]},"application/beep+xml":{"source":"iana","charset":"UTF-8","compressible":true},"application/calendar+json":{"source":"iana","compressible":true},"application/calendar+xml":{"source":"iana","compressible":true,"extensions":["xcs"]},"application/call-completion":{"source":"iana"},"application/cals-1840":{"source":"iana"},"application/captive+json":{"source":"iana","compressible":true},"application/cbor":{"source":"iana"},"application/cbor-seq":{"source":"iana"},"application/cccex":{"source":"iana"},"application/ccmp+xml":{"source":"iana","compressible":true},"application/ccxml+xml":{"source":"iana","compressible":true,"extensions":["ccxml"]},"application/cdfx+xml":{"source":"iana","compressible":true,"extensions":["cdfx"]},"application/cdmi-capability":{"source":"iana","extensions":["cdmia"]},"application/cdmi-container":{"source":"iana","extensions":["cdmic"]},"application/cdmi-domain":{"source":"iana","extensions":["cdmid"]},"application/cdmi-object":{"source":"iana","extensions":["cdmio"]},"application/cdmi-queue":{"source":"iana","extensions":["cdmiq"]},"application/cdni":{"source":"iana"},"application/cea":{"source":"iana"},"application/cea-2018+xml":{"source":"iana","compressible":true},"application/cellml+xml":{"source":"iana","compressible":true},"application/cfw":{"source":"iana"},"application/city+json":{"source":"iana","compressible":true},"application/clr":{"source":"iana"},"application/clue+xml":{"source":"iana","compressible":true},"application/clue_info+xml":{"source":"iana","compressible":true},"application/cms":{"source":"iana"},"application/cnrp+xml":{"source":"iana","compressible":true},"application/coap-group+json":{"source":"iana","compressible":true},"application/coap-payload":{"source":"iana"},"application/commonground":{"source":"iana"},"application/conference-info+xml":{"source":"iana","compressible":true},"application/cose":{"source":"iana"},"application/cose-key":{"source":"iana"},"application/cose-key-set":{"source":"iana"},"application/cpl+xml":{"source":"iana","compressible":true,"extensions":["cpl"]},"application/csrattrs":{"source":"iana"},"application/csta+xml":{"source":"iana","compressible":true},"application/cstadata+xml":{"source":"iana","compressible":true},"application/csvm+json":{"source":"iana","compressible":true},"application/cu-seeme":{"source":"apache","extensions":["cu"]},"application/cwt":{"source":"iana"},"application/cybercash":{"source":"iana"},"application/dart":{"compressible":true},"application/dash+xml":{"source":"iana","compressible":true,"extensions":["mpd"]},"application/dash-patch+xml":{"source":"iana","compressible":true,"extensions":["mpp"]},"application/dashdelta":{"source":"iana"},"application/davmount+xml":{"source":"iana","compressible":true,"extensions":["davmount"]},"application/dca-rft":{"source":"iana"},"application/dcd":{"source":"iana"},"application/dec-dx":{"source":"iana"},"application/dialog-info+xml":{"source":"iana","compressible":true},"application/dicom":{"source":"iana"},"application/dicom+json":{"source":"iana","compressible":true},"application/dicom+xml":{"source":"iana","compressible":true},"application/dii":{"source":"iana"},"application/dit":{"source":"iana"},"application/dns":{"source":"iana"},"application/dns+json":{"source":"iana","compressible":true},"application/dns-message":{"source":"iana"},"application/docbook+xml":{"source":"apache","compressible":true,"extensions":["dbk"]},"application/dots+cbor":{"source":"iana"},"application/dskpp+xml":{"source":"iana","compressible":true},"application/dssc+der":{"source":"iana","extensions":["dssc"]},"application/dssc+xml":{"source":"iana","compressible":true,"extensions":["xdssc"]},"application/dvcs":{"source":"iana"},"application/ecmascript":{"source":"iana","compressible":true,"extensions":["es","ecma"]},"application/edi-consent":{"source":"iana"},"application/edi-x12":{"source":"iana","compressible":false},"application/edifact":{"source":"iana","compressible":false},"application/efi":{"source":"iana"},"application/elm+json":{"source":"iana","charset":"UTF-8","compressible":true},"application/elm+xml":{"source":"iana","compressible":true},"application/emergencycalldata.cap+xml":{"source":"iana","charset":"UTF-8","compressible":true},"application/emergencycalldata.comment+xml":{"source":"iana","compressible":true},"application/emergencycalldata.control+xml":{"source":"iana","compressible":true},"application/emergencycalldata.deviceinfo+xml":{"source":"iana","compressible":true},"application/emergencycalldata.ecall.msd":{"source":"iana"},"application/emergencycalldata.providerinfo+xml":{"source":"iana","compressible":true},"application/emergencycalldata.serviceinfo+xml":{"source":"iana","compressible":true},"application/emergencycalldata.subscriberinfo+xml":{"source":"iana","compressible":true},"application/emergencycalldata.veds+xml":{"source":"iana","compressible":true},"application/emma+xml":{"source":"iana","compressible":true,"extensions":["emma"]},"application/emotionml+xml":{"source":"iana","compressible":true,"extensions":["emotionml"]},"application/encaprtp":{"source":"iana"},"application/epp+xml":{"source":"iana","compressible":true},"application/epub+zip":{"source":"iana","compressible":false,"extensions":["epub"]},"application/eshop":{"source":"iana"},"application/exi":{"source":"iana","extensions":["exi"]},"application/expect-ct-report+json":{"source":"iana","compressible":true},"application/express":{"source":"iana","extensions":["exp"]},"application/fastinfoset":{"source":"iana"},"application/fastsoap":{"source":"iana"},"application/fdt+xml":{"source":"iana","compressible":true,"extensions":["fdt"]},"application/fhir+json":{"source":"iana","charset":"UTF-8","compressible":true},"application/fhir+xml":{"source":"iana","charset":"UTF-8","compressible":true},"application/fido.trusted-apps+json":{"compressible":true},"application/fits":{"source":"iana"},"application/flexfec":{"source":"iana"},"application/font-sfnt":{"source":"iana"},"application/font-tdpfr":{"source":"iana","extensions":["pfr"]},"application/font-woff":{"source":"iana","compressible":false},"application/framework-attributes+xml":{"source":"iana","compressible":true},"application/geo+json":{"source":"iana","compressible":true,"extensions":["geojson"]},"application/geo+json-seq":{"source":"iana"},"application/geopackage+sqlite3":{"source":"iana"},"application/geoxacml+xml":{"source":"iana","compressible":true},"application/gltf-buffer":{"source":"iana"},"application/gml+xml":{"source":"iana","compressible":true,"extensions":["gml"]},"application/gpx+xml":{"source":"apache","compressible":true,"extensions":["gpx"]},"application/gxf":{"source":"apache","extensions":["gxf"]},"application/gzip":{"source":"iana","compressible":false,"extensions":["gz"]},"application/h224":{"source":"iana"},"application/held+xml":{"source":"iana","compressible":true},"application/hjson":{"extensions":["hjson"]},"application/http":{"source":"iana"},"application/hyperstudio":{"source":"iana","extensions":["stk"]},"application/ibe-key-request+xml":{"source":"iana","compressible":true},"application/ibe-pkg-reply+xml":{"source":"iana","compressible":true},"application/ibe-pp-data":{"source":"iana"},"application/iges":{"source":"iana"},"application/im-iscomposing+xml":{"source":"iana","charset":"UTF-8","compressible":true},"application/index":{"source":"iana"},"application/index.cmd":{"source":"iana"},"application/index.obj":{"source":"iana"},"application/index.response":{"source":"iana"},"application/index.vnd":{"source":"iana"},"application/inkml+xml":{"source":"iana","compressible":true,"extensions":["ink","inkml"]},"application/iotp":{"source":"iana"},"application/ipfix":{"source":"iana","extensions":["ipfix"]},"application/ipp":{"source":"iana"},"application/isup":{"source":"iana"},"application/its+xml":{"source":"iana","compressible":true,"extensions":["its"]},"application/java-archive":{"source":"apache","compressible":false,"extensions":["jar","war","ear"]},"application/java-serialized-object":{"source":"apache","compressible":false,"extensions":["ser"]},"application/java-vm":{"source":"apache","compressible":false,"extensions":["class"]},"application/javascript":{"source":"iana","charset":"UTF-8","compressible":true,"extensions":["js","mjs"]},"application/jf2feed+json":{"source":"iana","compressible":true},"application/jose":{"source":"iana"},"application/jose+json":{"source":"iana","compressible":true},"application/jrd+json":{"source":"iana","compressible":true},"application/jscalendar+json":{"source":"iana","compressible":true},"application/json":{"source":"iana","charset":"UTF-8","compressible":true,"extensions":["json","map"]},"application/json-patch+json":{"source":"iana","compressible":true},"application/json-seq":{"source":"iana"},"application/json5":{"extensions":["json5"]},"application/jsonml+json":{"source":"apache","compressible":true,"extensions":["jsonml"]},"application/jwk+json":{"source":"iana","compressible":true},"application/jwk-set+json":{"source":"iana","compressible":true},"application/jwt":{"source":"iana"},"application/kpml-request+xml":{"source":"iana","compressible":true},"application/kpml-response+xml":{"source":"iana","compressible":true},"application/ld+json":{"source":"iana","compressible":true,"extensions":["jsonld"]},"application/lgr+xml":{"source":"iana","compressible":true,"extensions":["lgr"]},"application/link-format":{"source":"iana"},"application/load-control+xml":{"source":"iana","compressible":true},"application/lost+xml":{"source":"iana","compressible":true,"extensions":["lostxml"]},"application/lostsync+xml":{"source":"iana","compressible":true},"application/lpf+zip":{"source":"iana","compressible":false},"application/lxf":{"source":"iana"},"application/mac-binhex40":{"source":"iana","extensions":["hqx"]},"application/mac-compactpro":{"source":"apache","extensions":["cpt"]},"application/macwriteii":{"source":"iana"},"application/mads+xml":{"source":"iana","compressible":true,"extensions":["mads"]},"application/manifest+json":{"source":"iana","charset":"UTF-8","compressible":true,"extensions":["webmanifest"]},"application/marc":{"source":"iana","extensions":["mrc"]},"application/marcxml+xml":{"source":"iana","compressible":true,"extensions":["mrcx"]},"application/mathematica":{"source":"iana","extensions":["ma","nb","mb"]},"application/mathml+xml":{"source":"iana","compressible":true,"extensions":["mathml"]},"application/mathml-content+xml":{"source":"iana","compressible":true},"application/mathml-presentation+xml":{"source":"iana","compressible":true},"application/mbms-associated-procedure-description+xml":{"source":"iana","compressible":true},"application/mbms-deregister+xml":{"source":"iana","compressible":true},"application/mbms-envelope+xml":{"source":"iana","compressible":true},"application/mbms-msk+xml":{"source":"iana","compressible":true},"application/mbms-msk-response+xml":{"source":"iana","compressible":true},"application/mbms-protection-description+xml":{"source":"iana","compressible":true},"application/mbms-reception-report+xml":{"source":"iana","compressible":true},"application/mbms-register+xml":{"source":"iana","compressible":true},"application/mbms-register-response+xml":{"source":"iana","compressible":true},"application/mbms-schedule+xml":{"source":"iana","compressible":true},"application/mbms-user-service-description+xml":{"source":"iana","compressible":true},"application/mbox":{"source":"iana","extensions":["mbox"]},"application/media-policy-dataset+xml":{"source":"iana","compressible":true,"extensions":["mpf"]},"application/media_control+xml":{"source":"iana","compressible":true},"application/mediaservercontrol+xml":{"source":"iana","compressible":true,"extensions":["mscml"]},"application/merge-patch+json":{"source":"iana","compressible":true},"application/metalink+xml":{"source":"apache","compressible":true,"extensions":["metalink"]},"application/metalink4+xml":{"source":"iana","compressible":true,"extensions":["meta4"]},"application/mets+xml":{"source":"iana","compressible":true,"extensions":["mets"]},"application/mf4":{"source":"iana"},"application/mikey":{"source":"iana"},"application/mipc":{"source":"iana"},"application/missing-blocks+cbor-seq":{"source":"iana"},"application/mmt-aei+xml":{"source":"iana","compressible":true,"extensions":["maei"]},"application/mmt-usd+xml":{"source":"iana","compressible":true,"extensions":["musd"]},"application/mods+xml":{"source":"iana","compressible":true,"extensions":["mods"]},"application/moss-keys":{"source":"iana"},"application/moss-signature":{"source":"iana"},"application/mosskey-data":{"source":"iana"},"application/mosskey-request":{"source":"iana"},"application/mp21":{"source":"iana","extensions":["m21","mp21"]},"application/mp4":{"source":"iana","extensions":["mp4s","m4p"]},"application/mpeg4-generic":{"source":"iana"},"application/mpeg4-iod":{"source":"iana"},"application/mpeg4-iod-xmt":{"source":"iana"},"application/mrb-consumer+xml":{"source":"iana","compressible":true},"application/mrb-publish+xml":{"source":"iana","compressible":true},"application/msc-ivr+xml":{"source":"iana","charset":"UTF-8","compressible":true},"application/msc-mixer+xml":{"source":"iana","charset":"UTF-8","compressible":true},"application/msword":{"source":"iana","compressible":false,"extensions":["doc","dot"]},"application/mud+json":{"source":"iana","compressible":true},"application/multipart-core":{"source":"iana"},"application/mxf":{"source":"iana","extensions":["mxf"]},"application/n-quads":{"source":"iana","extensions":["nq"]},"application/n-triples":{"source":"iana","extensions":["nt"]},"application/nasdata":{"source":"iana"},"application/news-checkgroups":{"source":"iana","charset":"US-ASCII"},"application/news-groupinfo":{"source":"iana","charset":"US-ASCII"},"application/news-transmission":{"source":"iana"},"application/nlsml+xml":{"source":"iana","compressible":true},"application/node":{"source":"iana","extensions":["cjs"]},"application/nss":{"source":"iana"},"application/oauth-authz-req+jwt":{"source":"iana"},"application/oblivious-dns-message":{"source":"iana"},"application/ocsp-request":{"source":"iana"},"application/ocsp-response":{"source":"iana"},"application/octet-stream":{"source":"iana","compressible":false,"extensions":["bin","dms","lrf","mar","so","dist","distz","pkg","bpk","dump","elc","deploy","exe","dll","deb","dmg","iso","img","msi","msp","msm","buffer"]},"application/oda":{"source":"iana","extensions":["oda"]},"application/odm+xml":{"source":"iana","compressible":true},"application/odx":{"source":"iana"},"application/oebps-package+xml":{"source":"iana","compressible":true,"extensions":["opf"]},"application/ogg":{"source":"iana","compressible":false,"extensions":["ogx"]},"application/omdoc+xml":{"source":"apache","compressible":true,"extensions":["omdoc"]},"application/onenote":{"source":"apache","extensions":["onetoc","onetoc2","onetmp","onepkg"]},"application/opc-nodeset+xml":{"source":"iana","compressible":true},"application/oscore":{"source":"iana"},"application/oxps":{"source":"iana","extensions":["oxps"]},"application/p21":{"source":"iana"},"application/p21+zip":{"source":"iana","compressible":false},"application/p2p-overlay+xml":{"source":"iana","compressible":true,"extensions":["relo"]},"application/parityfec":{"source":"iana"},"application/passport":{"source":"iana"},"application/patch-ops-error+xml":{"source":"iana","compressible":true,"extensions":["xer"]},"application/pdf":{"source":"iana","compressible":false,"extensions":["pdf"]},"application/pdx":{"source":"iana"},"application/pem-certificate-chain":{"source":"iana"},"application/pgp-encrypted":{"source":"iana","compressible":false,"extensions":["pgp"]},"application/pgp-keys":{"source":"iana","extensions":["asc"]},"application/pgp-signature":{"source":"iana","extensions":["asc","sig"]},"application/pics-rules":{"source":"apache","extensions":["prf"]},"application/pidf+xml":{"source":"iana","charset":"UTF-8","compressible":true},"application/pidf-diff+xml":{"source":"iana","charset":"UTF-8","compressible":true},"application/pkcs10":{"source":"iana","extensions":["p10"]},"application/pkcs12":{"source":"iana"},"application/pkcs7-mime":{"source":"iana","extensions":["p7m","p7c"]},"application/pkcs7-signature":{"source":"iana","extensions":["p7s"]},"application/pkcs8":{"source":"iana","extensions":["p8"]},"application/pkcs8-encrypted":{"source":"iana"},"application/pkix-attr-cert":{"source":"iana","extensions":["ac"]},"application/pkix-cert":{"source":"iana","extensions":["cer"]},"application/pkix-crl":{"source":"iana","extensions":["crl"]},"application/pkix-pkipath":{"source":"iana","extensions":["pkipath"]},"application/pkixcmp":{"source":"iana","extensions":["pki"]},"application/pls+xml":{"source":"iana","compressible":true,"extensions":["pls"]},"application/poc-settings+xml":{"source":"iana","charset":"UTF-8","compressible":true},"application/postscript":{"source":"iana","compressible":true,"extensions":["ai","eps","ps"]},"application/ppsp-tracker+json":{"source":"iana","compressible":true},"application/problem+json":{"source":"iana","compressible":true},"application/problem+xml":{"source":"iana","compressible":true},"application/provenance+xml":{"source":"iana","compressible":true,"extensions":["provx"]},"application/prs.alvestrand.titrax-sheet":{"source":"iana"},"application/prs.cww":{"source":"iana","extensions":["cww"]},"application/prs.cyn":{"source":"iana","charset":"7-BIT"},"application/prs.hpub+zip":{"source":"iana","compressible":false},"application/prs.nprend":{"source":"iana"},"application/prs.plucker":{"source":"iana"},"application/prs.rdf-xml-crypt":{"source":"iana"},"application/prs.xsf+xml":{"source":"iana","compressible":true},"application/pskc+xml":{"source":"iana","compressible":true,"extensions":["pskcxml"]},"application/pvd+json":{"source":"iana","compressible":true},"application/qsig":{"source":"iana"},"application/raml+yaml":{"compressible":true,"extensions":["raml"]},"application/raptorfec":{"source":"iana"},"application/rdap+json":{"source":"iana","compressible":true},"application/rdf+xml":{"source":"iana","compressible":true,"extensions":["rdf","owl"]},"application/reginfo+xml":{"source":"iana","compressible":true,"extensions":["rif"]},"application/relax-ng-compact-syntax":{"source":"iana","extensions":["rnc"]},"application/remote-printing":{"source":"iana"},"application/reputon+json":{"source":"iana","compressible":true},"application/resource-lists+xml":{"source":"iana","compressible":true,"extensions":["rl"]},"application/resource-lists-diff+xml":{"source":"iana","compressible":true,"extensions":["rld"]},"application/rfc+xml":{"source":"iana","compressible":true},"application/riscos":{"source":"iana"},"application/rlmi+xml":{"source":"iana","compressible":true},"application/rls-services+xml":{"source":"iana","compressible":true,"extensions":["rs"]},"application/route-apd+xml":{"source":"iana","compressible":true,"extensions":["rapd"]},"application/route-s-tsid+xml":{"source":"iana","compressible":true,"extensions":["sls"]},"application/route-usd+xml":{"source":"iana","compressible":true,"extensions":["rusd"]},"application/rpki-ghostbusters":{"source":"iana","extensions":["gbr"]},"application/rpki-manifest":{"source":"iana","extensions":["mft"]},"application/rpki-publication":{"source":"iana"},"application/rpki-roa":{"source":"iana","extensions":["roa"]},"application/rpki-updown":{"source":"iana"},"application/rsd+xml":{"source":"apache","compressible":true,"extensions":["rsd"]},"application/rss+xml":{"source":"apache","compressible":true,"extensions":["rss"]},"application/rtf":{"source":"iana","compressible":true,"extensions":["rtf"]},"application/rtploopback":{"source":"iana"},"application/rtx":{"source":"iana"},"application/samlassertion+xml":{"source":"iana","compressible":true},"application/samlmetadata+xml":{"source":"iana","compressible":true},"application/sarif+json":{"source":"iana","compressible":true},"application/sarif-external-properties+json":{"source":"iana","compressible":true},"application/sbe":{"source":"iana"},"application/sbml+xml":{"source":"iana","compressible":true,"extensions":["sbml"]},"application/scaip+xml":{"source":"iana","compressible":true},"application/scim+json":{"source":"iana","compressible":true},"application/scvp-cv-request":{"source":"iana","extensions":["scq"]},"application/scvp-cv-response":{"source":"iana","extensions":["scs"]},"application/scvp-vp-request":{"source":"iana","extensions":["spq"]},"application/scvp-vp-response":{"source":"iana","extensions":["spp"]},"application/sdp":{"source":"iana","extensions":["sdp"]},"application/secevent+jwt":{"source":"iana"},"application/senml+cbor":{"source":"iana"},"application/senml+json":{"source":"iana","compressible":true},"application/senml+xml":{"source":"iana","compressible":true,"extensions":["senmlx"]},"application/senml-etch+cbor":{"source":"iana"},"application/senml-etch+json":{"source":"iana","compressible":true},"application/senml-exi":{"source":"iana"},"application/sensml+cbor":{"source":"iana"},"application/sensml+json":{"source":"iana","compressible":true},"application/sensml+xml":{"source":"iana","compressible":true,"extensions":["sensmlx"]},"application/sensml-exi":{"source":"iana"},"application/sep+xml":{"source":"iana","compressible":true},"application/sep-exi":{"source":"iana"},"application/session-info":{"source":"iana"},"application/set-payment":{"source":"iana"},"application/set-payment-initiation":{"source":"iana","extensions":["setpay"]},"application/set-registration":{"source":"iana"},"application/set-registration-initiation":{"source":"iana","extensions":["setreg"]},"application/sgml":{"source":"iana"},"application/sgml-open-catalog":{"source":"iana"},"application/shf+xml":{"source":"iana","compressible":true,"extensions":["shf"]},"application/sieve":{"source":"iana","extensions":["siv","sieve"]},"application/simple-filter+xml":{"source":"iana","compressible":true},"application/simple-message-summary":{"source":"iana"},"application/simplesymbolcontainer":{"source":"iana"},"application/sipc":{"source":"iana"},"application/slate":{"source":"iana"},"application/smil":{"source":"iana"},"application/smil+xml":{"source":"iana","compressible":true,"extensions":["smi","smil"]},"application/smpte336m":{"source":"iana"},"application/soap+fastinfoset":{"source":"iana"},"application/soap+xml":{"source":"iana","compressible":true},"application/sparql-query":{"source":"iana","extensions":["rq"]},"application/sparql-results+xml":{"source":"iana","compressible":true,"extensions":["srx"]},"application/spdx+json":{"source":"iana","compressible":true},"application/spirits-event+xml":{"source":"iana","compressible":true},"application/sql":{"source":"iana"},"application/srgs":{"source":"iana","extensions":["gram"]},"application/srgs+xml":{"source":"iana","compressible":true,"extensions":["grxml"]},"application/sru+xml":{"source":"iana","compressible":true,"extensions":["sru"]},"application/ssdl+xml":{"source":"apache","compressible":true,"extensions":["ssdl"]},"application/ssml+xml":{"source":"iana","compressible":true,"extensions":["ssml"]},"application/stix+json":{"source":"iana","compressible":true},"application/swid+xml":{"source":"iana","compressible":true,"extensions":["swidtag"]},"application/tamp-apex-update":{"source":"iana"},"application/tamp-apex-update-confirm":{"source":"iana"},"application/tamp-community-update":{"source":"iana"},"application/tamp-community-update-confirm":{"source":"iana"},"application/tamp-error":{"source":"iana"},"application/tamp-sequence-adjust":{"source":"iana"},"application/tamp-sequence-adjust-confirm":{"source":"iana"},"application/tamp-status-query":{"source":"iana"},"application/tamp-status-response":{"source":"iana"},"application/tamp-update":{"source":"iana"},"application/tamp-update-confirm":{"source":"iana"},"application/tar":{"compressible":true},"application/taxii+json":{"source":"iana","compressible":true},"application/td+json":{"source":"iana","compressible":true},"application/tei+xml":{"source":"iana","compressible":true,"extensions":["tei","teicorpus"]},"application/tetra_isi":{"source":"iana"},"application/thraud+xml":{"source":"iana","compressible":true,"extensions":["tfi"]},"application/timestamp-query":{"source":"iana"},"application/timestamp-reply":{"source":"iana"},"application/timestamped-data":{"source":"iana","extensions":["tsd"]},"application/tlsrpt+gzip":{"source":"iana"},"application/tlsrpt+json":{"source":"iana","compressible":true},"application/tnauthlist":{"source":"iana"},"application/token-introspection+jwt":{"source":"iana"},"application/toml":{"compressible":true,"extensions":["toml"]},"application/trickle-ice-sdpfrag":{"source":"iana"},"application/trig":{"source":"iana","extensions":["trig"]},"application/ttml+xml":{"source":"iana","compressible":true,"extensions":["ttml"]},"application/tve-trigger":{"source":"iana"},"application/tzif":{"source":"iana"},"application/tzif-leap":{"source":"iana"},"application/ubjson":{"compressible":false,"extensions":["ubj"]},"application/ulpfec":{"source":"iana"},"application/urc-grpsheet+xml":{"source":"iana","compressible":true},"application/urc-ressheet+xml":{"source":"iana","compressible":true,"extensions":["rsheet"]},"application/urc-targetdesc+xml":{"source":"iana","compressible":true,"extensions":["td"]},"application/urc-uisocketdesc+xml":{"source":"iana","compressible":true},"application/vcard+json":{"source":"iana","compressible":true},"application/vcard+xml":{"source":"iana","compressible":true},"application/vemmi":{"source":"iana"},"application/vividence.scriptfile":{"source":"apache"},"application/vnd.1000minds.decision-model+xml":{"source":"iana","compressible":true,"extensions":["1km"]},"application/vnd.3gpp-prose+xml":{"source":"iana","compressible":true},"application/vnd.3gpp-prose-pc3ch+xml":{"source":"iana","compressible":true},"application/vnd.3gpp-v2x-local-service-information":{"source":"iana"},"application/vnd.3gpp.5gnas":{"source":"iana"},"application/vnd.3gpp.access-transfer-events+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.bsf+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.gmop+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.gtpc":{"source":"iana"},"application/vnd.3gpp.interworking-data":{"source":"iana"},"application/vnd.3gpp.lpp":{"source":"iana"},"application/vnd.3gpp.mc-signalling-ear":{"source":"iana"},"application/vnd.3gpp.mcdata-affiliation-command+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcdata-info+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcdata-payload":{"source":"iana"},"application/vnd.3gpp.mcdata-service-config+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcdata-signalling":{"source":"iana"},"application/vnd.3gpp.mcdata-ue-config+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcdata-user-profile+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcptt-affiliation-command+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcptt-floor-request+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcptt-info+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcptt-location-info+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcptt-mbms-usage-info+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcptt-service-config+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcptt-signed+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcptt-ue-config+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcptt-ue-init-config+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcptt-user-profile+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcvideo-affiliation-command+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcvideo-affiliation-info+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcvideo-info+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcvideo-location-info+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcvideo-mbms-usage-info+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcvideo-service-config+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcvideo-transmission-request+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcvideo-ue-config+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcvideo-user-profile+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mid-call+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.ngap":{"source":"iana"},"application/vnd.3gpp.pfcp":{"source":"iana"},"application/vnd.3gpp.pic-bw-large":{"source":"iana","extensions":["plb"]},"application/vnd.3gpp.pic-bw-small":{"source":"iana","extensions":["psb"]},"application/vnd.3gpp.pic-bw-var":{"source":"iana","extensions":["pvb"]},"application/vnd.3gpp.s1ap":{"source":"iana"},"application/vnd.3gpp.sms":{"source":"iana"},"application/vnd.3gpp.sms+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.srvcc-ext+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.srvcc-info+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.state-and-event-info+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.ussd+xml":{"source":"iana","compressible":true},"application/vnd.3gpp2.bcmcsinfo+xml":{"source":"iana","compressible":true},"application/vnd.3gpp2.sms":{"source":"iana"},"application/vnd.3gpp2.tcap":{"source":"iana","extensions":["tcap"]},"application/vnd.3lightssoftware.imagescal":{"source":"iana"},"application/vnd.3m.post-it-notes":{"source":"iana","extensions":["pwn"]},"application/vnd.accpac.simply.aso":{"source":"iana","extensions":["aso"]},"application/vnd.accpac.simply.imp":{"source":"iana","extensions":["imp"]},"application/vnd.acucobol":{"source":"iana","extensions":["acu"]},"application/vnd.acucorp":{"source":"iana","extensions":["atc","acutc"]},"application/vnd.adobe.air-application-installer-package+zip":{"source":"apache","compressible":false,"extensions":["air"]},"application/vnd.adobe.flash.movie":{"source":"iana"},"application/vnd.adobe.formscentral.fcdt":{"source":"iana","extensions":["fcdt"]},"application/vnd.adobe.fxp":{"source":"iana","extensions":["fxp","fxpl"]},"application/vnd.adobe.partial-upload":{"source":"iana"},"application/vnd.adobe.xdp+xml":{"source":"iana","compressible":true,"extensions":["xdp"]},"application/vnd.adobe.xfdf":{"source":"iana","extensions":["xfdf"]},"application/vnd.aether.imp":{"source":"iana"},"application/vnd.afpc.afplinedata":{"source":"iana"},"application/vnd.afpc.afplinedata-pagedef":{"source":"iana"},"application/vnd.afpc.cmoca-cmresource":{"source":"iana"},"application/vnd.afpc.foca-charset":{"source":"iana"},"application/vnd.afpc.foca-codedfont":{"source":"iana"},"application/vnd.afpc.foca-codepage":{"source":"iana"},"application/vnd.afpc.modca":{"source":"iana"},"application/vnd.afpc.modca-cmtable":{"source":"iana"},"application/vnd.afpc.modca-formdef":{"source":"iana"},"application/vnd.afpc.modca-mediummap":{"source":"iana"},"application/vnd.afpc.modca-objectcontainer":{"source":"iana"},"application/vnd.afpc.modca-overlay":{"source":"iana"},"application/vnd.afpc.modca-pagesegment":{"source":"iana"},"application/vnd.age":{"source":"iana","extensions":["age"]},"application/vnd.ah-barcode":{"source":"iana"},"application/vnd.ahead.space":{"source":"iana","extensions":["ahead"]},"application/vnd.airzip.filesecure.azf":{"source":"iana","extensions":["azf"]},"application/vnd.airzip.filesecure.azs":{"source":"iana","extensions":["azs"]},"application/vnd.amadeus+json":{"source":"iana","compressible":true},"application/vnd.amazon.ebook":{"source":"apache","extensions":["azw"]},"application/vnd.amazon.mobi8-ebook":{"source":"iana"},"application/vnd.americandynamics.acc":{"source":"iana","extensions":["acc"]},"application/vnd.amiga.ami":{"source":"iana","extensions":["ami"]},"application/vnd.amundsen.maze+xml":{"source":"iana","compressible":true},"application/vnd.android.ota":{"source":"iana"},"application/vnd.android.package-archive":{"source":"apache","compressible":false,"extensions":["apk"]},"application/vnd.anki":{"source":"iana"},"application/vnd.anser-web-certificate-issue-initiation":{"source":"iana","extensions":["cii"]},"application/vnd.anser-web-funds-transfer-initiation":{"source":"apache","extensions":["fti"]},"application/vnd.antix.game-component":{"source":"iana","extensions":["atx"]},"application/vnd.apache.arrow.file":{"source":"iana"},"application/vnd.apache.arrow.stream":{"source":"iana"},"application/vnd.apache.thrift.binary":{"source":"iana"},"application/vnd.apache.thrift.compact":{"source":"iana"},"application/vnd.apache.thrift.json":{"source":"iana"},"application/vnd.api+json":{"source":"iana","compressible":true},"application/vnd.aplextor.warrp+json":{"source":"iana","compressible":true},"application/vnd.apothekende.reservation+json":{"source":"iana","compressible":true},"application/vnd.apple.installer+xml":{"source":"iana","compressible":true,"extensions":["mpkg"]},"application/vnd.apple.keynote":{"source":"iana","extensions":["key"]},"application/vnd.apple.mpegurl":{"source":"iana","extensions":["m3u8"]},"application/vnd.apple.numbers":{"source":"iana","extensions":["numbers"]},"application/vnd.apple.pages":{"source":"iana","extensions":["pages"]},"application/vnd.apple.pkpass":{"compressible":false,"extensions":["pkpass"]},"application/vnd.arastra.swi":{"source":"iana"},"application/vnd.aristanetworks.swi":{"source":"iana","extensions":["swi"]},"application/vnd.artisan+json":{"source":"iana","compressible":true},"application/vnd.artsquare":{"source":"iana"},"application/vnd.astraea-software.iota":{"source":"iana","extensions":["iota"]},"application/vnd.audiograph":{"source":"iana","extensions":["aep"]},"application/vnd.autopackage":{"source":"iana"},"application/vnd.avalon+json":{"source":"iana","compressible":true},"application/vnd.avistar+xml":{"source":"iana","compressible":true},"application/vnd.balsamiq.bmml+xml":{"source":"iana","compressible":true,"extensions":["bmml"]},"application/vnd.balsamiq.bmpr":{"source":"iana"},"application/vnd.banana-accounting":{"source":"iana"},"application/vnd.bbf.usp.error":{"source":"iana"},"application/vnd.bbf.usp.msg":{"source":"iana"},"application/vnd.bbf.usp.msg+json":{"source":"iana","compressible":true},"application/vnd.bekitzur-stech+json":{"source":"iana","compressible":true},"application/vnd.bint.med-content":{"source":"iana"},"application/vnd.biopax.rdf+xml":{"source":"iana","compressible":true},"application/vnd.blink-idb-value-wrapper":{"source":"iana"},"application/vnd.blueice.multipass":{"source":"iana","extensions":["mpm"]},"application/vnd.bluetooth.ep.oob":{"source":"iana"},"application/vnd.bluetooth.le.oob":{"source":"iana"},"application/vnd.bmi":{"source":"iana","extensions":["bmi"]},"application/vnd.bpf":{"source":"iana"},"application/vnd.bpf3":{"source":"iana"},"application/vnd.businessobjects":{"source":"iana","extensions":["rep"]},"application/vnd.byu.uapi+json":{"source":"iana","compressible":true},"application/vnd.cab-jscript":{"source":"iana"},"application/vnd.canon-cpdl":{"source":"iana"},"application/vnd.canon-lips":{"source":"iana"},"application/vnd.capasystems-pg+json":{"source":"iana","compressible":true},"application/vnd.cendio.thinlinc.clientconf":{"source":"iana"},"application/vnd.century-systems.tcp_stream":{"source":"iana"},"application/vnd.chemdraw+xml":{"source":"iana","compressible":true,"extensions":["cdxml"]},"application/vnd.chess-pgn":{"source":"iana"},"application/vnd.chipnuts.karaoke-mmd":{"source":"iana","extensions":["mmd"]},"application/vnd.ciedi":{"source":"iana"},"application/vnd.cinderella":{"source":"iana","extensions":["cdy"]},"application/vnd.cirpack.isdn-ext":{"source":"iana"},"application/vnd.citationstyles.style+xml":{"source":"iana","compressible":true,"extensions":["csl"]},"application/vnd.claymore":{"source":"iana","extensions":["cla"]},"application/vnd.cloanto.rp9":{"source":"iana","extensions":["rp9"]},"application/vnd.clonk.c4group":{"source":"iana","extensions":["c4g","c4d","c4f","c4p","c4u"]},"application/vnd.cluetrust.cartomobile-config":{"source":"iana","extensions":["c11amc"]},"application/vnd.cluetrust.cartomobile-config-pkg":{"source":"iana","extensions":["c11amz"]},"application/vnd.coffeescript":{"source":"iana"},"application/vnd.collabio.xodocuments.document":{"source":"iana"},"application/vnd.collabio.xodocuments.document-template":{"source":"iana"},"application/vnd.collabio.xodocuments.presentation":{"source":"iana"},"application/vnd.collabio.xodocuments.presentation-template":{"source":"iana"},"application/vnd.collabio.xodocuments.spreadsheet":{"source":"iana"},"application/vnd.collabio.xodocuments.spreadsheet-template":{"source":"iana"},"application/vnd.collection+json":{"source":"iana","compressible":true},"application/vnd.collection.doc+json":{"source":"iana","compressible":true},"application/vnd.collection.next+json":{"source":"iana","compressible":true},"application/vnd.comicbook+zip":{"source":"iana","compressible":false},"application/vnd.comicbook-rar":{"source":"iana"},"application/vnd.commerce-battelle":{"source":"iana"},"application/vnd.commonspace":{"source":"iana","extensions":["csp"]},"application/vnd.contact.cmsg":{"source":"iana","extensions":["cdbcmsg"]},"application/vnd.coreos.ignition+json":{"source":"iana","compressible":true},"application/vnd.cosmocaller":{"source":"iana","extensions":["cmc"]},"application/vnd.crick.clicker":{"source":"iana","extensions":["clkx"]},"application/vnd.crick.clicker.keyboard":{"source":"iana","extensions":["clkk"]},"application/vnd.crick.clicker.palette":{"source":"iana","extensions":["clkp"]},"application/vnd.crick.clicker.template":{"source":"iana","extensions":["clkt"]},"application/vnd.crick.clicker.wordbank":{"source":"iana","extensions":["clkw"]},"application/vnd.criticaltools.wbs+xml":{"source":"iana","compressible":true,"extensions":["wbs"]},"application/vnd.cryptii.pipe+json":{"source":"iana","compressible":true},"application/vnd.crypto-shade-file":{"source":"iana"},"application/vnd.cryptomator.encrypted":{"source":"iana"},"application/vnd.cryptomator.vault":{"source":"iana"},"application/vnd.ctc-posml":{"source":"iana","extensions":["pml"]},"application/vnd.ctct.ws+xml":{"source":"iana","compressible":true},"application/vnd.cups-pdf":{"source":"iana"},"application/vnd.cups-postscript":{"source":"iana"},"application/vnd.cups-ppd":{"source":"iana","extensions":["ppd"]},"application/vnd.cups-raster":{"source":"iana"},"application/vnd.cups-raw":{"source":"iana"},"application/vnd.curl":{"source":"iana"},"application/vnd.curl.car":{"source":"apache","extensions":["car"]},"application/vnd.curl.pcurl":{"source":"apache","extensions":["pcurl"]},"application/vnd.cyan.dean.root+xml":{"source":"iana","compressible":true},"application/vnd.cybank":{"source":"iana"},"application/vnd.cyclonedx+json":{"source":"iana","compressible":true},"application/vnd.cyclonedx+xml":{"source":"iana","compressible":true},"application/vnd.d2l.coursepackage1p0+zip":{"source":"iana","compressible":false},"application/vnd.d3m-dataset":{"source":"iana"},"application/vnd.d3m-problem":{"source":"iana"},"application/vnd.dart":{"source":"iana","compressible":true,"extensions":["dart"]},"application/vnd.data-vision.rdz":{"source":"iana","extensions":["rdz"]},"application/vnd.datapackage+json":{"source":"iana","compressible":true},"application/vnd.dataresource+json":{"source":"iana","compressible":true},"application/vnd.dbf":{"source":"iana","extensions":["dbf"]},"application/vnd.debian.binary-package":{"source":"iana"},"application/vnd.dece.data":{"source":"iana","extensions":["uvf","uvvf","uvd","uvvd"]},"application/vnd.dece.ttml+xml":{"source":"iana","compressible":true,"extensions":["uvt","uvvt"]},"application/vnd.dece.unspecified":{"source":"iana","extensions":["uvx","uvvx"]},"application/vnd.dece.zip":{"source":"iana","extensions":["uvz","uvvz"]},"application/vnd.denovo.fcselayout-link":{"source":"iana","extensions":["fe_launch"]},"application/vnd.desmume.movie":{"source":"iana"},"application/vnd.dir-bi.plate-dl-nosuffix":{"source":"iana"},"application/vnd.dm.delegation+xml":{"source":"iana","compressible":true},"application/vnd.dna":{"source":"iana","extensions":["dna"]},"application/vnd.document+json":{"source":"iana","compressible":true},"application/vnd.dolby.mlp":{"source":"apache","extensions":["mlp"]},"application/vnd.dolby.mobile.1":{"source":"iana"},"application/vnd.dolby.mobile.2":{"source":"iana"},"application/vnd.doremir.scorecloud-binary-document":{"source":"iana"},"application/vnd.dpgraph":{"source":"iana","extensions":["dpg"]},"application/vnd.dreamfactory":{"source":"iana","extensions":["dfac"]},"application/vnd.drive+json":{"source":"iana","compressible":true},"application/vnd.ds-keypoint":{"source":"apache","extensions":["kpxx"]},"application/vnd.dtg.local":{"source":"iana"},"application/vnd.dtg.local.flash":{"source":"iana"},"application/vnd.dtg.local.html":{"source":"iana"},"application/vnd.dvb.ait":{"source":"iana","extensions":["ait"]},"application/vnd.dvb.dvbisl+xml":{"source":"iana","compressible":true},"application/vnd.dvb.dvbj":{"source":"iana"},"application/vnd.dvb.esgcontainer":{"source":"iana"},"application/vnd.dvb.ipdcdftnotifaccess":{"source":"iana"},"application/vnd.dvb.ipdcesgaccess":{"source":"iana"},"application/vnd.dvb.ipdcesgaccess2":{"source":"iana"},"application/vnd.dvb.ipdcesgpdd":{"source":"iana"},"application/vnd.dvb.ipdcroaming":{"source":"iana"},"application/vnd.dvb.iptv.alfec-base":{"source":"iana"},"application/vnd.dvb.iptv.alfec-enhancement":{"source":"iana"},"application/vnd.dvb.notif-aggregate-root+xml":{"source":"iana","compressible":true},"application/vnd.dvb.notif-container+xml":{"source":"iana","compressible":true},"application/vnd.dvb.notif-generic+xml":{"source":"iana","compressible":true},"application/vnd.dvb.notif-ia-msglist+xml":{"source":"iana","compressible":true},"application/vnd.dvb.notif-ia-registration-request+xml":{"source":"iana","compressible":true},"application/vnd.dvb.notif-ia-registration-response+xml":{"source":"iana","compressible":true},"application/vnd.dvb.notif-init+xml":{"source":"iana","compressible":true},"application/vnd.dvb.pfr":{"source":"iana"},"application/vnd.dvb.service":{"source":"iana","extensions":["svc"]},"application/vnd.dxr":{"source":"iana"},"application/vnd.dynageo":{"source":"iana","extensions":["geo"]},"application/vnd.dzr":{"source":"iana"},"application/vnd.easykaraoke.cdgdownload":{"source":"iana"},"application/vnd.ecdis-update":{"source":"iana"},"application/vnd.ecip.rlp":{"source":"iana"},"application/vnd.eclipse.ditto+json":{"source":"iana","compressible":true},"application/vnd.ecowin.chart":{"source":"iana","extensions":["mag"]},"application/vnd.ecowin.filerequest":{"source":"iana"},"application/vnd.ecowin.fileupdate":{"source":"iana"},"application/vnd.ecowin.series":{"source":"iana"},"application/vnd.ecowin.seriesrequest":{"source":"iana"},"application/vnd.ecowin.seriesupdate":{"source":"iana"},"application/vnd.efi.img":{"source":"iana"},"application/vnd.efi.iso":{"source":"iana"},"application/vnd.emclient.accessrequest+xml":{"source":"iana","compressible":true},"application/vnd.enliven":{"source":"iana","extensions":["nml"]},"application/vnd.enphase.envoy":{"source":"iana"},"application/vnd.eprints.data+xml":{"source":"iana","compressible":true},"application/vnd.epson.esf":{"source":"iana","extensions":["esf"]},"application/vnd.epson.msf":{"source":"iana","extensions":["msf"]},"application/vnd.epson.quickanime":{"source":"iana","extensions":["qam"]},"application/vnd.epson.salt":{"source":"iana","extensions":["slt"]},"application/vnd.epson.ssf":{"source":"iana","extensions":["ssf"]},"application/vnd.ericsson.quickcall":{"source":"iana"},"application/vnd.espass-espass+zip":{"source":"iana","compressible":false},"application/vnd.eszigno3+xml":{"source":"iana","compressible":true,"extensions":["es3","et3"]},"application/vnd.etsi.aoc+xml":{"source":"iana","compressible":true},"application/vnd.etsi.asic-e+zip":{"source":"iana","compressible":false},"application/vnd.etsi.asic-s+zip":{"source":"iana","compressible":false},"application/vnd.etsi.cug+xml":{"source":"iana","compressible":true},"application/vnd.etsi.iptvcommand+xml":{"source":"iana","compressible":true},"application/vnd.etsi.iptvdiscovery+xml":{"source":"iana","compressible":true},"application/vnd.etsi.iptvprofile+xml":{"source":"iana","compressible":true},"application/vnd.etsi.iptvsad-bc+xml":{"source":"iana","compressible":true},"application/vnd.etsi.iptvsad-cod+xml":{"source":"iana","compressible":true},"application/vnd.etsi.iptvsad-npvr+xml":{"source":"iana","compressible":true},"application/vnd.etsi.iptvservice+xml":{"source":"iana","compressible":true},"application/vnd.etsi.iptvsync+xml":{"source":"iana","compressible":true},"application/vnd.etsi.iptvueprofile+xml":{"source":"iana","compressible":true},"application/vnd.etsi.mcid+xml":{"source":"iana","compressible":true},"application/vnd.etsi.mheg5":{"source":"iana"},"application/vnd.etsi.overload-control-policy-dataset+xml":{"source":"iana","compressible":true},"application/vnd.etsi.pstn+xml":{"source":"iana","compressible":true},"application/vnd.etsi.sci+xml":{"source":"iana","compressible":true},"application/vnd.etsi.simservs+xml":{"source":"iana","compressible":true},"application/vnd.etsi.timestamp-token":{"source":"iana"},"application/vnd.etsi.tsl+xml":{"source":"iana","compressible":true},"application/vnd.etsi.tsl.der":{"source":"iana"},"application/vnd.eu.kasparian.car+json":{"source":"iana","compressible":true},"application/vnd.eudora.data":{"source":"iana"},"application/vnd.evolv.ecig.profile":{"source":"iana"},"application/vnd.evolv.ecig.settings":{"source":"iana"},"application/vnd.evolv.ecig.theme":{"source":"iana"},"application/vnd.exstream-empower+zip":{"source":"iana","compressible":false},"application/vnd.exstream-package":{"source":"iana"},"application/vnd.ezpix-album":{"source":"iana","extensions":["ez2"]},"application/vnd.ezpix-package":{"source":"iana","extensions":["ez3"]},"application/vnd.f-secure.mobile":{"source":"iana"},"application/vnd.familysearch.gedcom+zip":{"source":"iana","compressible":false},"application/vnd.fastcopy-disk-image":{"source":"iana"},"application/vnd.fdf":{"source":"iana","extensions":["fdf"]},"application/vnd.fdsn.mseed":{"source":"iana","extensions":["mseed"]},"application/vnd.fdsn.seed":{"source":"iana","extensions":["seed","dataless"]},"application/vnd.ffsns":{"source":"iana"},"application/vnd.ficlab.flb+zip":{"source":"iana","compressible":false},"application/vnd.filmit.zfc":{"source":"iana"},"application/vnd.fints":{"source":"iana"},"application/vnd.firemonkeys.cloudcell":{"source":"iana"},"application/vnd.flographit":{"source":"iana","extensions":["gph"]},"application/vnd.fluxtime.clip":{"source":"iana","extensions":["ftc"]},"application/vnd.font-fontforge-sfd":{"source":"iana"},"application/vnd.framemaker":{"source":"iana","extensions":["fm","frame","maker","book"]},"application/vnd.frogans.fnc":{"source":"iana","extensions":["fnc"]},"application/vnd.frogans.ltf":{"source":"iana","extensions":["ltf"]},"application/vnd.fsc.weblaunch":{"source":"iana","extensions":["fsc"]},"application/vnd.fujifilm.fb.docuworks":{"source":"iana"},"application/vnd.fujifilm.fb.docuworks.binder":{"source":"iana"},"application/vnd.fujifilm.fb.docuworks.container":{"source":"iana"},"application/vnd.fujifilm.fb.jfi+xml":{"source":"iana","compressible":true},"application/vnd.fujitsu.oasys":{"source":"iana","extensions":["oas"]},"application/vnd.fujitsu.oasys2":{"source":"iana","extensions":["oa2"]},"application/vnd.fujitsu.oasys3":{"source":"iana","extensions":["oa3"]},"application/vnd.fujitsu.oasysgp":{"source":"iana","extensions":["fg5"]},"application/vnd.fujitsu.oasysprs":{"source":"iana","extensions":["bh2"]},"application/vnd.fujixerox.art-ex":{"source":"iana"},"application/vnd.fujixerox.art4":{"source":"iana"},"application/vnd.fujixerox.ddd":{"source":"iana","extensions":["ddd"]},"application/vnd.fujixerox.docuworks":{"source":"iana","extensions":["xdw"]},"application/vnd.fujixerox.docuworks.binder":{"source":"iana","extensions":["xbd"]},"application/vnd.fujixerox.docuworks.container":{"source":"iana"},"application/vnd.fujixerox.hbpl":{"source":"iana"},"application/vnd.fut-misnet":{"source":"iana"},"application/vnd.futoin+cbor":{"source":"iana"},"application/vnd.futoin+json":{"source":"iana","compressible":true},"application/vnd.fuzzysheet":{"source":"iana","extensions":["fzs"]},"application/vnd.genomatix.tuxedo":{"source":"iana","extensions":["txd"]},"application/vnd.gentics.grd+json":{"source":"iana","compressible":true},"application/vnd.geo+json":{"source":"iana","compressible":true},"application/vnd.geocube+xml":{"source":"iana","compressible":true},"application/vnd.geogebra.file":{"source":"iana","extensions":["ggb"]},"application/vnd.geogebra.slides":{"source":"iana"},"application/vnd.geogebra.tool":{"source":"iana","extensions":["ggt"]},"application/vnd.geometry-explorer":{"source":"iana","extensions":["gex","gre"]},"application/vnd.geonext":{"source":"iana","extensions":["gxt"]},"application/vnd.geoplan":{"source":"iana","extensions":["g2w"]},"application/vnd.geospace":{"source":"iana","extensions":["g3w"]},"application/vnd.gerber":{"source":"iana"},"application/vnd.globalplatform.card-content-mgt":{"source":"iana"},"application/vnd.globalplatform.card-content-mgt-response":{"source":"iana"},"application/vnd.gmx":{"source":"iana","extensions":["gmx"]},"application/vnd.google-apps.document":{"compressible":false,"extensions":["gdoc"]},"application/vnd.google-apps.presentation":{"compressible":false,"extensions":["gslides"]},"application/vnd.google-apps.spreadsheet":{"compressible":false,"extensions":["gsheet"]},"application/vnd.google-earth.kml+xml":{"source":"iana","compressible":true,"extensions":["kml"]},"application/vnd.google-earth.kmz":{"source":"iana","compressible":false,"extensions":["kmz"]},"application/vnd.gov.sk.e-form+xml":{"source":"iana","compressible":true},"application/vnd.gov.sk.e-form+zip":{"source":"iana","compressible":false},"application/vnd.gov.sk.xmldatacontainer+xml":{"source":"iana","compressible":true},"application/vnd.grafeq":{"source":"iana","extensions":["gqf","gqs"]},"application/vnd.gridmp":{"source":"iana"},"application/vnd.groove-account":{"source":"iana","extensions":["gac"]},"application/vnd.groove-help":{"source":"iana","extensions":["ghf"]},"application/vnd.groove-identity-message":{"source":"iana","extensions":["gim"]},"application/vnd.groove-injector":{"source":"iana","extensions":["grv"]},"application/vnd.groove-tool-message":{"source":"iana","extensions":["gtm"]},"application/vnd.groove-tool-template":{"source":"iana","extensions":["tpl"]},"application/vnd.groove-vcard":{"source":"iana","extensions":["vcg"]},"application/vnd.hal+json":{"source":"iana","compressible":true},"application/vnd.hal+xml":{"source":"iana","compressible":true,"extensions":["hal"]},"application/vnd.handheld-entertainment+xml":{"source":"iana","compressible":true,"extensions":["zmm"]},"application/vnd.hbci":{"source":"iana","extensions":["hbci"]},"application/vnd.hc+json":{"source":"iana","compressible":true},"application/vnd.hcl-bireports":{"source":"iana"},"application/vnd.hdt":{"source":"iana"},"application/vnd.heroku+json":{"source":"iana","compressible":true},"application/vnd.hhe.lesson-player":{"source":"iana","extensions":["les"]},"application/vnd.hl7cda+xml":{"source":"iana","charset":"UTF-8","compressible":true},"application/vnd.hl7v2+xml":{"source":"iana","charset":"UTF-8","compressible":true},"application/vnd.hp-hpgl":{"source":"iana","extensions":["hpgl"]},"application/vnd.hp-hpid":{"source":"iana","extensions":["hpid"]},"application/vnd.hp-hps":{"source":"iana","extensions":["hps"]},"application/vnd.hp-jlyt":{"source":"iana","extensions":["jlt"]},"application/vnd.hp-pcl":{"source":"iana","extensions":["pcl"]},"application/vnd.hp-pclxl":{"source":"iana","extensions":["pclxl"]},"application/vnd.httphone":{"source":"iana"},"application/vnd.hydrostatix.sof-data":{"source":"iana","extensions":["sfd-hdstx"]},"application/vnd.hyper+json":{"source":"iana","compressible":true},"application/vnd.hyper-item+json":{"source":"iana","compressible":true},"application/vnd.hyperdrive+json":{"source":"iana","compressible":true},"application/vnd.hzn-3d-crossword":{"source":"iana"},"application/vnd.ibm.afplinedata":{"source":"iana"},"application/vnd.ibm.electronic-media":{"source":"iana"},"application/vnd.ibm.minipay":{"source":"iana","extensions":["mpy"]},"application/vnd.ibm.modcap":{"source":"iana","extensions":["afp","listafp","list3820"]},"application/vnd.ibm.rights-management":{"source":"iana","extensions":["irm"]},"application/vnd.ibm.secure-container":{"source":"iana","extensions":["sc"]},"application/vnd.iccprofile":{"source":"iana","extensions":["icc","icm"]},"application/vnd.ieee.1905":{"source":"iana"},"application/vnd.igloader":{"source":"iana","extensions":["igl"]},"application/vnd.imagemeter.folder+zip":{"source":"iana","compressible":false},"application/vnd.imagemeter.image+zip":{"source":"iana","compressible":false},"application/vnd.immervision-ivp":{"source":"iana","extensions":["ivp"]},"application/vnd.immervision-ivu":{"source":"iana","extensions":["ivu"]},"application/vnd.ims.imsccv1p1":{"source":"iana"},"application/vnd.ims.imsccv1p2":{"source":"iana"},"application/vnd.ims.imsccv1p3":{"source":"iana"},"application/vnd.ims.lis.v2.result+json":{"source":"iana","compressible":true},"application/vnd.ims.lti.v2.toolconsumerprofile+json":{"source":"iana","compressible":true},"application/vnd.ims.lti.v2.toolproxy+json":{"source":"iana","compressible":true},"application/vnd.ims.lti.v2.toolproxy.id+json":{"source":"iana","compressible":true},"application/vnd.ims.lti.v2.toolsettings+json":{"source":"iana","compressible":true},"application/vnd.ims.lti.v2.toolsettings.simple+json":{"source":"iana","compressible":true},"application/vnd.informedcontrol.rms+xml":{"source":"iana","compressible":true},"application/vnd.informix-visionary":{"source":"iana"},"application/vnd.infotech.project":{"source":"iana"},"application/vnd.infotech.project+xml":{"source":"iana","compressible":true},"application/vnd.innopath.wamp.notification":{"source":"iana"},"application/vnd.insors.igm":{"source":"iana","extensions":["igm"]},"application/vnd.intercon.formnet":{"source":"iana","extensions":["xpw","xpx"]},"application/vnd.intergeo":{"source":"iana","extensions":["i2g"]},"application/vnd.intertrust.digibox":{"source":"iana"},"application/vnd.intertrust.nncp":{"source":"iana"},"application/vnd.intu.qbo":{"source":"iana","extensions":["qbo"]},"application/vnd.intu.qfx":{"source":"iana","extensions":["qfx"]},"application/vnd.iptc.g2.catalogitem+xml":{"source":"iana","compressible":true},"application/vnd.iptc.g2.conceptitem+xml":{"source":"iana","compressible":true},"application/vnd.iptc.g2.knowledgeitem+xml":{"source":"iana","compressible":true},"application/vnd.iptc.g2.newsitem+xml":{"source":"iana","compressible":true},"application/vnd.iptc.g2.newsmessage+xml":{"source":"iana","compressible":true},"application/vnd.iptc.g2.packageitem+xml":{"source":"iana","compressible":true},"application/vnd.iptc.g2.planningitem+xml":{"source":"iana","compressible":true},"application/vnd.ipunplugged.rcprofile":{"source":"iana","extensions":["rcprofile"]},"application/vnd.irepository.package+xml":{"source":"iana","compressible":true,"extensions":["irp"]},"application/vnd.is-xpr":{"source":"iana","extensions":["xpr"]},"application/vnd.isac.fcs":{"source":"iana","extensions":["fcs"]},"application/vnd.iso11783-10+zip":{"source":"iana","compressible":false},"application/vnd.jam":{"source":"iana","extensions":["jam"]},"application/vnd.japannet-directory-service":{"source":"iana"},"application/vnd.japannet-jpnstore-wakeup":{"source":"iana"},"application/vnd.japannet-payment-wakeup":{"source":"iana"},"application/vnd.japannet-registration":{"source":"iana"},"application/vnd.japannet-registration-wakeup":{"source":"iana"},"application/vnd.japannet-setstore-wakeup":{"source":"iana"},"application/vnd.japannet-verification":{"source":"iana"},"application/vnd.japannet-verification-wakeup":{"source":"iana"},"application/vnd.jcp.javame.midlet-rms":{"source":"iana","extensions":["rms"]},"application/vnd.jisp":{"source":"iana","extensions":["jisp"]},"application/vnd.joost.joda-archive":{"source":"iana","extensions":["joda"]},"application/vnd.jsk.isdn-ngn":{"source":"iana"},"application/vnd.kahootz":{"source":"iana","extensions":["ktz","ktr"]},"application/vnd.kde.karbon":{"source":"iana","extensions":["karbon"]},"application/vnd.kde.kchart":{"source":"iana","extensions":["chrt"]},"application/vnd.kde.kformula":{"source":"iana","extensions":["kfo"]},"application/vnd.kde.kivio":{"source":"iana","extensions":["flw"]},"application/vnd.kde.kontour":{"source":"iana","extensions":["kon"]},"application/vnd.kde.kpresenter":{"source":"iana","extensions":["kpr","kpt"]},"application/vnd.kde.kspread":{"source":"iana","extensions":["ksp"]},"application/vnd.kde.kword":{"source":"iana","extensions":["kwd","kwt"]},"application/vnd.kenameaapp":{"source":"iana","extensions":["htke"]},"application/vnd.kidspiration":{"source":"iana","extensions":["kia"]},"application/vnd.kinar":{"source":"iana","extensions":["kne","knp"]},"application/vnd.koan":{"source":"iana","extensions":["skp","skd","skt","skm"]},"application/vnd.kodak-descriptor":{"source":"iana","extensions":["sse"]},"application/vnd.las":{"source":"iana"},"application/vnd.las.las+json":{"source":"iana","compressible":true},"application/vnd.las.las+xml":{"source":"iana","compressible":true,"extensions":["lasxml"]},"application/vnd.laszip":{"source":"iana"},"application/vnd.leap+json":{"source":"iana","compressible":true},"application/vnd.liberty-request+xml":{"source":"iana","compressible":true},"application/vnd.llamagraphics.life-balance.desktop":{"source":"iana","extensions":["lbd"]},"application/vnd.llamagraphics.life-balance.exchange+xml":{"source":"iana","compressible":true,"extensions":["lbe"]},"application/vnd.logipipe.circuit+zip":{"source":"iana","compressible":false},"application/vnd.loom":{"source":"iana"},"application/vnd.lotus-1-2-3":{"source":"iana","extensions":["123"]},"application/vnd.lotus-approach":{"source":"iana","extensions":["apr"]},"application/vnd.lotus-freelance":{"source":"iana","extensions":["pre"]},"application/vnd.lotus-notes":{"source":"iana","extensions":["nsf"]},"application/vnd.lotus-organizer":{"source":"iana","extensions":["org"]},"application/vnd.lotus-screencam":{"source":"iana","extensions":["scm"]},"application/vnd.lotus-wordpro":{"source":"iana","extensions":["lwp"]},"application/vnd.macports.portpkg":{"source":"iana","extensions":["portpkg"]},"application/vnd.mapbox-vector-tile":{"source":"iana","extensions":["mvt"]},"application/vnd.marlin.drm.actiontoken+xml":{"source":"iana","compressible":true},"application/vnd.marlin.drm.conftoken+xml":{"source":"iana","compressible":true},"application/vnd.marlin.drm.license+xml":{"source":"iana","compressible":true},"application/vnd.marlin.drm.mdcf":{"source":"iana"},"application/vnd.mason+json":{"source":"iana","compressible":true},"application/vnd.maxar.archive.3tz+zip":{"source":"iana","compressible":false},"application/vnd.maxmind.maxmind-db":{"source":"iana"},"application/vnd.mcd":{"source":"iana","extensions":["mcd"]},"application/vnd.medcalcdata":{"source":"iana","extensions":["mc1"]},"application/vnd.mediastation.cdkey":{"source":"iana","extensions":["cdkey"]},"application/vnd.meridian-slingshot":{"source":"iana"},"application/vnd.mfer":{"source":"iana","extensions":["mwf"]},"application/vnd.mfmp":{"source":"iana","extensions":["mfm"]},"application/vnd.micro+json":{"source":"iana","compressible":true},"application/vnd.micrografx.flo":{"source":"iana","extensions":["flo"]},"application/vnd.micrografx.igx":{"source":"iana","extensions":["igx"]},"application/vnd.microsoft.portable-executable":{"source":"iana"},"application/vnd.microsoft.windows.thumbnail-cache":{"source":"iana"},"application/vnd.miele+json":{"source":"iana","compressible":true},"application/vnd.mif":{"source":"iana","extensions":["mif"]},"application/vnd.minisoft-hp3000-save":{"source":"iana"},"application/vnd.mitsubishi.misty-guard.trustweb":{"source":"iana"},"application/vnd.mobius.daf":{"source":"iana","extensions":["daf"]},"application/vnd.mobius.dis":{"source":"iana","extensions":["dis"]},"application/vnd.mobius.mbk":{"source":"iana","extensions":["mbk"]},"application/vnd.mobius.mqy":{"source":"iana","extensions":["mqy"]},"application/vnd.mobius.msl":{"source":"iana","extensions":["msl"]},"application/vnd.mobius.plc":{"source":"iana","extensions":["plc"]},"application/vnd.mobius.txf":{"source":"iana","extensions":["txf"]},"application/vnd.mophun.application":{"source":"iana","extensions":["mpn"]},"application/vnd.mophun.certificate":{"source":"iana","extensions":["mpc"]},"application/vnd.motorola.flexsuite":{"source":"iana"},"application/vnd.motorola.flexsuite.adsi":{"source":"iana"},"application/vnd.motorola.flexsuite.fis":{"source":"iana"},"application/vnd.motorola.flexsuite.gotap":{"source":"iana"},"application/vnd.motorola.flexsuite.kmr":{"source":"iana"},"application/vnd.motorola.flexsuite.ttc":{"source":"iana"},"application/vnd.motorola.flexsuite.wem":{"source":"iana"},"application/vnd.motorola.iprm":{"source":"iana"},"application/vnd.mozilla.xul+xml":{"source":"iana","compressible":true,"extensions":["xul"]},"application/vnd.ms-3mfdocument":{"source":"iana"},"application/vnd.ms-artgalry":{"source":"iana","extensions":["cil"]},"application/vnd.ms-asf":{"source":"iana"},"application/vnd.ms-cab-compressed":{"source":"iana","extensions":["cab"]},"application/vnd.ms-color.iccprofile":{"source":"apache"},"application/vnd.ms-excel":{"source":"iana","compressible":false,"extensions":["xls","xlm","xla","xlc","xlt","xlw"]},"application/vnd.ms-excel.addin.macroenabled.12":{"source":"iana","extensions":["xlam"]},"application/vnd.ms-excel.sheet.binary.macroenabled.12":{"source":"iana","extensions":["xlsb"]},"application/vnd.ms-excel.sheet.macroenabled.12":{"source":"iana","extensions":["xlsm"]},"application/vnd.ms-excel.template.macroenabled.12":{"source":"iana","extensions":["xltm"]},"application/vnd.ms-fontobject":{"source":"iana","compressible":true,"extensions":["eot"]},"application/vnd.ms-htmlhelp":{"source":"iana","extensions":["chm"]},"application/vnd.ms-ims":{"source":"iana","extensions":["ims"]},"application/vnd.ms-lrm":{"source":"iana","extensions":["lrm"]},"application/vnd.ms-office.activex+xml":{"source":"iana","compressible":true},"application/vnd.ms-officetheme":{"source":"iana","extensions":["thmx"]},"application/vnd.ms-opentype":{"source":"apache","compressible":true},"application/vnd.ms-outlook":{"compressible":false,"extensions":["msg"]},"application/vnd.ms-package.obfuscated-opentype":{"source":"apache"},"application/vnd.ms-pki.seccat":{"source":"apache","extensions":["cat"]},"application/vnd.ms-pki.stl":{"source":"apache","extensions":["stl"]},"application/vnd.ms-playready.initiator+xml":{"source":"iana","compressible":true},"application/vnd.ms-powerpoint":{"source":"iana","compressible":false,"extensions":["ppt","pps","pot"]},"application/vnd.ms-powerpoint.addin.macroenabled.12":{"source":"iana","extensions":["ppam"]},"application/vnd.ms-powerpoint.presentation.macroenabled.12":{"source":"iana","extensions":["pptm"]},"application/vnd.ms-powerpoint.slide.macroenabled.12":{"source":"iana","extensions":["sldm"]},"application/vnd.ms-powerpoint.slideshow.macroenabled.12":{"source":"iana","extensions":["ppsm"]},"application/vnd.ms-powerpoint.template.macroenabled.12":{"source":"iana","extensions":["potm"]},"application/vnd.ms-printdevicecapabilities+xml":{"source":"iana","compressible":true},"application/vnd.ms-printing.printticket+xml":{"source":"apache","compressible":true},"application/vnd.ms-printschematicket+xml":{"source":"iana","compressible":true},"application/vnd.ms-project":{"source":"iana","extensions":["mpp","mpt"]},"application/vnd.ms-tnef":{"source":"iana"},"application/vnd.ms-windows.devicepairing":{"source":"iana"},"application/vnd.ms-windows.nwprinting.oob":{"source":"iana"},"application/vnd.ms-windows.printerpairing":{"source":"iana"},"application/vnd.ms-windows.wsd.oob":{"source":"iana"},"application/vnd.ms-wmdrm.lic-chlg-req":{"source":"iana"},"application/vnd.ms-wmdrm.lic-resp":{"source":"iana"},"application/vnd.ms-wmdrm.meter-chlg-req":{"source":"iana"},"application/vnd.ms-wmdrm.meter-resp":{"source":"iana"},"application/vnd.ms-word.document.macroenabled.12":{"source":"iana","extensions":["docm"]},"application/vnd.ms-word.template.macroenabled.12":{"source":"iana","extensions":["dotm"]},"application/vnd.ms-works":{"source":"iana","extensions":["wps","wks","wcm","wdb"]},"application/vnd.ms-wpl":{"source":"iana","extensions":["wpl"]},"application/vnd.ms-xpsdocument":{"source":"iana","compressible":false,"extensions":["xps"]},"application/vnd.msa-disk-image":{"source":"iana"},"application/vnd.mseq":{"source":"iana","extensions":["mseq"]},"application/vnd.msign":{"source":"iana"},"application/vnd.multiad.creator":{"source":"iana"},"application/vnd.multiad.creator.cif":{"source":"iana"},"application/vnd.music-niff":{"source":"iana"},"application/vnd.musician":{"source":"iana","extensions":["mus"]},"application/vnd.muvee.style":{"source":"iana","extensions":["msty"]},"application/vnd.mynfc":{"source":"iana","extensions":["taglet"]},"application/vnd.nacamar.ybrid+json":{"source":"iana","compressible":true},"application/vnd.ncd.control":{"source":"iana"},"application/vnd.ncd.reference":{"source":"iana"},"application/vnd.nearst.inv+json":{"source":"iana","compressible":true},"application/vnd.nebumind.line":{"source":"iana"},"application/vnd.nervana":{"source":"iana"},"application/vnd.netfpx":{"source":"iana"},"application/vnd.neurolanguage.nlu":{"source":"iana","extensions":["nlu"]},"application/vnd.nimn":{"source":"iana"},"application/vnd.nintendo.nitro.rom":{"source":"iana"},"application/vnd.nintendo.snes.rom":{"source":"iana"},"application/vnd.nitf":{"source":"iana","extensions":["ntf","nitf"]},"application/vnd.noblenet-directory":{"source":"iana","extensions":["nnd"]},"application/vnd.noblenet-sealer":{"source":"iana","extensions":["nns"]},"application/vnd.noblenet-web":{"source":"iana","extensions":["nnw"]},"application/vnd.nokia.catalogs":{"source":"iana"},"application/vnd.nokia.conml+wbxml":{"source":"iana"},"application/vnd.nokia.conml+xml":{"source":"iana","compressible":true},"application/vnd.nokia.iptv.config+xml":{"source":"iana","compressible":true},"application/vnd.nokia.isds-radio-presets":{"source":"iana"},"application/vnd.nokia.landmark+wbxml":{"source":"iana"},"application/vnd.nokia.landmark+xml":{"source":"iana","compressible":true},"application/vnd.nokia.landmarkcollection+xml":{"source":"iana","compressible":true},"application/vnd.nokia.n-gage.ac+xml":{"source":"iana","compressible":true,"extensions":["ac"]},"application/vnd.nokia.n-gage.data":{"source":"iana","extensions":["ngdat"]},"application/vnd.nokia.n-gage.symbian.install":{"source":"iana","extensions":["n-gage"]},"application/vnd.nokia.ncd":{"source":"iana"},"application/vnd.nokia.pcd+wbxml":{"source":"iana"},"application/vnd.nokia.pcd+xml":{"source":"iana","compressible":true},"application/vnd.nokia.radio-preset":{"source":"iana","extensions":["rpst"]},"application/vnd.nokia.radio-presets":{"source":"iana","extensions":["rpss"]},"application/vnd.novadigm.edm":{"source":"iana","extensions":["edm"]},"application/vnd.novadigm.edx":{"source":"iana","extensions":["edx"]},"application/vnd.novadigm.ext":{"source":"iana","extensions":["ext"]},"application/vnd.ntt-local.content-share":{"source":"iana"},"application/vnd.ntt-local.file-transfer":{"source":"iana"},"application/vnd.ntt-local.ogw_remote-access":{"source":"iana"},"application/vnd.ntt-local.sip-ta_remote":{"source":"iana"},"application/vnd.ntt-local.sip-ta_tcp_stream":{"source":"iana"},"application/vnd.oasis.opendocument.chart":{"source":"iana","extensions":["odc"]},"application/vnd.oasis.opendocument.chart-template":{"source":"iana","extensions":["otc"]},"application/vnd.oasis.opendocument.database":{"source":"iana","extensions":["odb"]},"application/vnd.oasis.opendocument.formula":{"source":"iana","extensions":["odf"]},"application/vnd.oasis.opendocument.formula-template":{"source":"iana","extensions":["odft"]},"application/vnd.oasis.opendocument.graphics":{"source":"iana","compressible":false,"extensions":["odg"]},"application/vnd.oasis.opendocument.graphics-template":{"source":"iana","extensions":["otg"]},"application/vnd.oasis.opendocument.image":{"source":"iana","extensions":["odi"]},"application/vnd.oasis.opendocument.image-template":{"source":"iana","extensions":["oti"]},"application/vnd.oasis.opendocument.presentation":{"source":"iana","compressible":false,"extensions":["odp"]},"application/vnd.oasis.opendocument.presentation-template":{"source":"iana","extensions":["otp"]},"application/vnd.oasis.opendocument.spreadsheet":{"source":"iana","compressible":false,"extensions":["ods"]},"application/vnd.oasis.opendocument.spreadsheet-template":{"source":"iana","extensions":["ots"]},"application/vnd.oasis.opendocument.text":{"source":"iana","compressible":false,"extensions":["odt"]},"application/vnd.oasis.opendocument.text-master":{"source":"iana","extensions":["odm"]},"application/vnd.oasis.opendocument.text-template":{"source":"iana","extensions":["ott"]},"application/vnd.oasis.opendocument.text-web":{"source":"iana","extensions":["oth"]},"application/vnd.obn":{"source":"iana"},"application/vnd.ocf+cbor":{"source":"iana"},"application/vnd.oci.image.manifest.v1+json":{"source":"iana","compressible":true},"application/vnd.oftn.l10n+json":{"source":"iana","compressible":true},"application/vnd.oipf.contentaccessdownload+xml":{"source":"iana","compressible":true},"application/vnd.oipf.contentaccessstreaming+xml":{"source":"iana","compressible":true},"application/vnd.oipf.cspg-hexbinary":{"source":"iana"},"application/vnd.oipf.dae.svg+xml":{"source":"iana","compressible":true},"application/vnd.oipf.dae.xhtml+xml":{"source":"iana","compressible":true},"application/vnd.oipf.mippvcontrolmessage+xml":{"source":"iana","compressible":true},"application/vnd.oipf.pae.gem":{"source":"iana"},"application/vnd.oipf.spdiscovery+xml":{"source":"iana","compressible":true},"application/vnd.oipf.spdlist+xml":{"source":"iana","compressible":true},"application/vnd.oipf.ueprofile+xml":{"source":"iana","compressible":true},"application/vnd.oipf.userprofile+xml":{"source":"iana","compressible":true},"application/vnd.olpc-sugar":{"source":"iana","extensions":["xo"]},"application/vnd.oma-scws-config":{"source":"iana"},"application/vnd.oma-scws-http-request":{"source":"iana"},"application/vnd.oma-scws-http-response":{"source":"iana"},"application/vnd.oma.bcast.associated-procedure-parameter+xml":{"source":"iana","compressible":true},"application/vnd.oma.bcast.drm-trigger+xml":{"source":"iana","compressible":true},"application/vnd.oma.bcast.imd+xml":{"source":"iana","compressible":true},"application/vnd.oma.bcast.ltkm":{"source":"iana"},"application/vnd.oma.bcast.notification+xml":{"source":"iana","compressible":true},"application/vnd.oma.bcast.provisioningtrigger":{"source":"iana"},"application/vnd.oma.bcast.sgboot":{"source":"iana"},"application/vnd.oma.bcast.sgdd+xml":{"source":"iana","compressible":true},"application/vnd.oma.bcast.sgdu":{"source":"iana"},"application/vnd.oma.bcast.simple-symbol-container":{"source":"iana"},"application/vnd.oma.bcast.smartcard-trigger+xml":{"source":"iana","compressible":true},"application/vnd.oma.bcast.sprov+xml":{"source":"iana","compressible":true},"application/vnd.oma.bcast.stkm":{"source":"iana"},"application/vnd.oma.cab-address-book+xml":{"source":"iana","compressible":true},"application/vnd.oma.cab-feature-handler+xml":{"source":"iana","compressible":true},"application/vnd.oma.cab-pcc+xml":{"source":"iana","compressible":true},"application/vnd.oma.cab-subs-invite+xml":{"source":"iana","compressible":true},"application/vnd.oma.cab-user-prefs+xml":{"source":"iana","compressible":true},"application/vnd.oma.dcd":{"source":"iana"},"application/vnd.oma.dcdc":{"source":"iana"},"application/vnd.oma.dd2+xml":{"source":"iana","compressible":true,"extensions":["dd2"]},"application/vnd.oma.drm.risd+xml":{"source":"iana","compressible":true},"application/vnd.oma.group-usage-list+xml":{"source":"iana","compressible":true},"application/vnd.oma.lwm2m+cbor":{"source":"iana"},"application/vnd.oma.lwm2m+json":{"source":"iana","compressible":true},"application/vnd.oma.lwm2m+tlv":{"source":"iana"},"application/vnd.oma.pal+xml":{"source":"iana","compressible":true},"application/vnd.oma.poc.detailed-progress-report+xml":{"source":"iana","compressible":true},"application/vnd.oma.poc.final-report+xml":{"source":"iana","compressible":true},"application/vnd.oma.poc.groups+xml":{"source":"iana","compressible":true},"application/vnd.oma.poc.invocation-descriptor+xml":{"source":"iana","compressible":true},"application/vnd.oma.poc.optimized-progress-report+xml":{"source":"iana","compressible":true},"application/vnd.oma.push":{"source":"iana"},"application/vnd.oma.scidm.messages+xml":{"source":"iana","compressible":true},"application/vnd.oma.xcap-directory+xml":{"source":"iana","compressible":true},"application/vnd.omads-email+xml":{"source":"iana","charset":"UTF-8","compressible":true},"application/vnd.omads-file+xml":{"source":"iana","charset":"UTF-8","compressible":true},"application/vnd.omads-folder+xml":{"source":"iana","charset":"UTF-8","compressible":true},"application/vnd.omaloc-supl-init":{"source":"iana"},"application/vnd.onepager":{"source":"iana"},"application/vnd.onepagertamp":{"source":"iana"},"application/vnd.onepagertamx":{"source":"iana"},"application/vnd.onepagertat":{"source":"iana"},"application/vnd.onepagertatp":{"source":"iana"},"application/vnd.onepagertatx":{"source":"iana"},"application/vnd.openblox.game+xml":{"source":"iana","compressible":true,"extensions":["obgx"]},"application/vnd.openblox.game-binary":{"source":"iana"},"application/vnd.openeye.oeb":{"source":"iana"},"application/vnd.openofficeorg.extension":{"source":"apache","extensions":["oxt"]},"application/vnd.openstreetmap.data+xml":{"source":"iana","compressible":true,"extensions":["osm"]},"application/vnd.opentimestamps.ots":{"source":"iana"},"application/vnd.openxmlformats-officedocument.custom-properties+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.customxmlproperties+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.drawing+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.drawingml.chart+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.drawingml.chartshapes+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.drawingml.diagramcolors+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.drawingml.diagramdata+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.drawingml.diagramlayout+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.drawingml.diagramstyle+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.extended-properties+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.presentationml.commentauthors+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.presentationml.comments+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.presentationml.handoutmaster+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.presentationml.notesmaster+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.presentationml.notesslide+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.presentationml.presentation":{"source":"iana","compressible":false,"extensions":["pptx"]},"application/vnd.openxmlformats-officedocument.presentationml.presentation.main+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.presentationml.presprops+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.presentationml.slide":{"source":"iana","extensions":["sldx"]},"application/vnd.openxmlformats-officedocument.presentationml.slide+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.presentationml.slidelayout+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.presentationml.slidemaster+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.presentationml.slideshow":{"source":"iana","extensions":["ppsx"]},"application/vnd.openxmlformats-officedocument.presentationml.slideshow.main+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.presentationml.slideupdateinfo+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.presentationml.tablestyles+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.presentationml.tags+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.presentationml.template":{"source":"iana","extensions":["potx"]},"application/vnd.openxmlformats-officedocument.presentationml.template.main+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.presentationml.viewprops+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.calcchain+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.chartsheet+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.comments+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.connections+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.dialogsheet+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.externallink+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.pivotcachedefinition+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.pivotcacherecords+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.pivottable+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.querytable+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.revisionheaders+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.revisionlog+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.sharedstrings+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":{"source":"iana","compressible":false,"extensions":["xlsx"]},"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.sheetmetadata+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.table+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.tablesinglecells+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.template":{"source":"iana","extensions":["xltx"]},"application/vnd.openxmlformats-officedocument.spreadsheetml.template.main+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.usernames+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.volatiledependencies+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.theme+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.themeoverride+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.vmldrawing":{"source":"iana"},"application/vnd.openxmlformats-officedocument.wordprocessingml.comments+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.wordprocessingml.document":{"source":"iana","compressible":false,"extensions":["docx"]},"application/vnd.openxmlformats-officedocument.wordprocessingml.document.glossary+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.wordprocessingml.endnotes+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.wordprocessingml.fonttable+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.wordprocessingml.footer+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.wordprocessingml.footnotes+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.wordprocessingml.numbering+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.wordprocessingml.settings+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.wordprocessingml.template":{"source":"iana","extensions":["dotx"]},"application/vnd.openxmlformats-officedocument.wordprocessingml.template.main+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.wordprocessingml.websettings+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-package.core-properties+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-package.digital-signature-xmlsignature+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-package.relationships+xml":{"source":"iana","compressible":true},"application/vnd.oracle.resource+json":{"source":"iana","compressible":true},"application/vnd.orange.indata":{"source":"iana"},"application/vnd.osa.netdeploy":{"source":"iana"},"application/vnd.osgeo.mapguide.package":{"source":"iana","extensions":["mgp"]},"application/vnd.osgi.bundle":{"source":"iana"},"application/vnd.osgi.dp":{"source":"iana","extensions":["dp"]},"application/vnd.osgi.subsystem":{"source":"iana","extensions":["esa"]},"application/vnd.otps.ct-kip+xml":{"source":"iana","compressible":true},"application/vnd.oxli.countgraph":{"source":"iana"},"application/vnd.pagerduty+json":{"source":"iana","compressible":true},"application/vnd.palm":{"source":"iana","extensions":["pdb","pqa","oprc"]},"application/vnd.panoply":{"source":"iana"},"application/vnd.paos.xml":{"source":"iana"},"application/vnd.patentdive":{"source":"iana"},"application/vnd.patientecommsdoc":{"source":"iana"},"application/vnd.pawaafile":{"source":"iana","extensions":["paw"]},"application/vnd.pcos":{"source":"iana"},"application/vnd.pg.format":{"source":"iana","extensions":["str"]},"application/vnd.pg.osasli":{"source":"iana","extensions":["ei6"]},"application/vnd.piaccess.application-licence":{"source":"iana"},"application/vnd.picsel":{"source":"iana","extensions":["efif"]},"application/vnd.pmi.widget":{"source":"iana","extensions":["wg"]},"application/vnd.poc.group-advertisement+xml":{"source":"iana","compressible":true},"application/vnd.pocketlearn":{"source":"iana","extensions":["plf"]},"application/vnd.powerbuilder6":{"source":"iana","extensions":["pbd"]},"application/vnd.powerbuilder6-s":{"source":"iana"},"application/vnd.powerbuilder7":{"source":"iana"},"application/vnd.powerbuilder7-s":{"source":"iana"},"application/vnd.powerbuilder75":{"source":"iana"},"application/vnd.powerbuilder75-s":{"source":"iana"},"application/vnd.preminet":{"source":"iana"},"application/vnd.previewsystems.box":{"source":"iana","extensions":["box"]},"application/vnd.proteus.magazine":{"source":"iana","extensions":["mgz"]},"application/vnd.psfs":{"source":"iana"},"application/vnd.publishare-delta-tree":{"source":"iana","extensions":["qps"]},"application/vnd.pvi.ptid1":{"source":"iana","extensions":["ptid"]},"application/vnd.pwg-multiplexed":{"source":"iana"},"application/vnd.pwg-xhtml-print+xml":{"source":"iana","compressible":true},"application/vnd.qualcomm.brew-app-res":{"source":"iana"},"application/vnd.quarantainenet":{"source":"iana"},"application/vnd.quark.quarkxpress":{"source":"iana","extensions":["qxd","qxt","qwd","qwt","qxl","qxb"]},"application/vnd.quobject-quoxdocument":{"source":"iana"},"application/vnd.radisys.moml+xml":{"source":"iana","compressible":true},"application/vnd.radisys.msml+xml":{"source":"iana","compressible":true},"application/vnd.radisys.msml-audit+xml":{"source":"iana","compressible":true},"application/vnd.radisys.msml-audit-conf+xml":{"source":"iana","compressible":true},"application/vnd.radisys.msml-audit-conn+xml":{"source":"iana","compressible":true},"application/vnd.radisys.msml-audit-dialog+xml":{"source":"iana","compressible":true},"application/vnd.radisys.msml-audit-stream+xml":{"source":"iana","compressible":true},"application/vnd.radisys.msml-conf+xml":{"source":"iana","compressible":true},"application/vnd.radisys.msml-dialog+xml":{"source":"iana","compressible":true},"application/vnd.radisys.msml-dialog-base+xml":{"source":"iana","compressible":true},"application/vnd.radisys.msml-dialog-fax-detect+xml":{"source":"iana","compressible":true},"application/vnd.radisys.msml-dialog-fax-sendrecv+xml":{"source":"iana","compressible":true},"application/vnd.radisys.msml-dialog-group+xml":{"source":"iana","compressible":true},"application/vnd.radisys.msml-dialog-speech+xml":{"source":"iana","compressible":true},"application/vnd.radisys.msml-dialog-transform+xml":{"source":"iana","compressible":true},"application/vnd.rainstor.data":{"source":"iana"},"application/vnd.rapid":{"source":"iana"},"application/vnd.rar":{"source":"iana","extensions":["rar"]},"application/vnd.realvnc.bed":{"source":"iana","extensions":["bed"]},"application/vnd.recordare.musicxml":{"source":"iana","extensions":["mxl"]},"application/vnd.recordare.musicxml+xml":{"source":"iana","compressible":true,"extensions":["musicxml"]},"application/vnd.renlearn.rlprint":{"source":"iana"},"application/vnd.resilient.logic":{"source":"iana"},"application/vnd.restful+json":{"source":"iana","compressible":true},"application/vnd.rig.cryptonote":{"source":"iana","extensions":["cryptonote"]},"application/vnd.rim.cod":{"source":"apache","extensions":["cod"]},"application/vnd.rn-realmedia":{"source":"apache","extensions":["rm"]},"application/vnd.rn-realmedia-vbr":{"source":"apache","extensions":["rmvb"]},"application/vnd.route66.link66+xml":{"source":"iana","compressible":true,"extensions":["link66"]},"application/vnd.rs-274x":{"source":"iana"},"application/vnd.ruckus.download":{"source":"iana"},"application/vnd.s3sms":{"source":"iana"},"application/vnd.sailingtracker.track":{"source":"iana","extensions":["st"]},"application/vnd.sar":{"source":"iana"},"application/vnd.sbm.cid":{"source":"iana"},"application/vnd.sbm.mid2":{"source":"iana"},"application/vnd.scribus":{"source":"iana"},"application/vnd.sealed.3df":{"source":"iana"},"application/vnd.sealed.csf":{"source":"iana"},"application/vnd.sealed.doc":{"source":"iana"},"application/vnd.sealed.eml":{"source":"iana"},"application/vnd.sealed.mht":{"source":"iana"},"application/vnd.sealed.net":{"source":"iana"},"application/vnd.sealed.ppt":{"source":"iana"},"application/vnd.sealed.tiff":{"source":"iana"},"application/vnd.sealed.xls":{"source":"iana"},"application/vnd.sealedmedia.softseal.html":{"source":"iana"},"application/vnd.sealedmedia.softseal.pdf":{"source":"iana"},"application/vnd.seemail":{"source":"iana","extensions":["see"]},"application/vnd.seis+json":{"source":"iana","compressible":true},"application/vnd.sema":{"source":"iana","extensions":["sema"]},"application/vnd.semd":{"source":"iana","extensions":["semd"]},"application/vnd.semf":{"source":"iana","extensions":["semf"]},"application/vnd.shade-save-file":{"source":"iana"},"application/vnd.shana.informed.formdata":{"source":"iana","extensions":["ifm"]},"application/vnd.shana.informed.formtemplate":{"source":"iana","extensions":["itp"]},"application/vnd.shana.informed.interchange":{"source":"iana","extensions":["iif"]},"application/vnd.shana.informed.package":{"source":"iana","extensions":["ipk"]},"application/vnd.shootproof+json":{"source":"iana","compressible":true},"application/vnd.shopkick+json":{"source":"iana","compressible":true},"application/vnd.shp":{"source":"iana"},"application/vnd.shx":{"source":"iana"},"application/vnd.sigrok.session":{"source":"iana"},"application/vnd.simtech-mindmapper":{"source":"iana","extensions":["twd","twds"]},"application/vnd.siren+json":{"source":"iana","compressible":true},"application/vnd.smaf":{"source":"iana","extensions":["mmf"]},"application/vnd.smart.notebook":{"source":"iana"},"application/vnd.smart.teacher":{"source":"iana","extensions":["teacher"]},"application/vnd.snesdev-page-table":{"source":"iana"},"application/vnd.software602.filler.form+xml":{"source":"iana","compressible":true,"extensions":["fo"]},"application/vnd.software602.filler.form-xml-zip":{"source":"iana"},"application/vnd.solent.sdkm+xml":{"source":"iana","compressible":true,"extensions":["sdkm","sdkd"]},"application/vnd.spotfire.dxp":{"source":"iana","extensions":["dxp"]},"application/vnd.spotfire.sfs":{"source":"iana","extensions":["sfs"]},"application/vnd.sqlite3":{"source":"iana"},"application/vnd.sss-cod":{"source":"iana"},"application/vnd.sss-dtf":{"source":"iana"},"application/vnd.sss-ntf":{"source":"iana"},"application/vnd.stardivision.calc":{"source":"apache","extensions":["sdc"]},"application/vnd.stardivision.draw":{"source":"apache","extensions":["sda"]},"application/vnd.stardivision.impress":{"source":"apache","extensions":["sdd"]},"application/vnd.stardivision.math":{"source":"apache","extensions":["smf"]},"application/vnd.stardivision.writer":{"source":"apache","extensions":["sdw","vor"]},"application/vnd.stardivision.writer-global":{"source":"apache","extensions":["sgl"]},"application/vnd.stepmania.package":{"source":"iana","extensions":["smzip"]},"application/vnd.stepmania.stepchart":{"source":"iana","extensions":["sm"]},"application/vnd.street-stream":{"source":"iana"},"application/vnd.sun.wadl+xml":{"source":"iana","compressible":true,"extensions":["wadl"]},"application/vnd.sun.xml.calc":{"source":"apache","extensions":["sxc"]},"application/vnd.sun.xml.calc.template":{"source":"apache","extensions":["stc"]},"application/vnd.sun.xml.draw":{"source":"apache","extensions":["sxd"]},"application/vnd.sun.xml.draw.template":{"source":"apache","extensions":["std"]},"application/vnd.sun.xml.impress":{"source":"apache","extensions":["sxi"]},"application/vnd.sun.xml.impress.template":{"source":"apache","extensions":["sti"]},"application/vnd.sun.xml.math":{"source":"apache","extensions":["sxm"]},"application/vnd.sun.xml.writer":{"source":"apache","extensions":["sxw"]},"application/vnd.sun.xml.writer.global":{"source":"apache","extensions":["sxg"]},"application/vnd.sun.xml.writer.template":{"source":"apache","extensions":["stw"]},"application/vnd.sus-calendar":{"source":"iana","extensions":["sus","susp"]},"application/vnd.svd":{"source":"iana","extensions":["svd"]},"application/vnd.swiftview-ics":{"source":"iana"},"application/vnd.sycle+xml":{"source":"iana","compressible":true},"application/vnd.syft+json":{"source":"iana","compressible":true},"application/vnd.symbian.install":{"source":"apache","extensions":["sis","sisx"]},"application/vnd.syncml+xml":{"source":"iana","charset":"UTF-8","compressible":true,"extensions":["xsm"]},"application/vnd.syncml.dm+wbxml":{"source":"iana","charset":"UTF-8","extensions":["bdm"]},"application/vnd.syncml.dm+xml":{"source":"iana","charset":"UTF-8","compressible":true,"extensions":["xdm"]},"application/vnd.syncml.dm.notification":{"source":"iana"},"application/vnd.syncml.dmddf+wbxml":{"source":"iana"},"application/vnd.syncml.dmddf+xml":{"source":"iana","charset":"UTF-8","compressible":true,"extensions":["ddf"]},"application/vnd.syncml.dmtnds+wbxml":{"source":"iana"},"application/vnd.syncml.dmtnds+xml":{"source":"iana","charset":"UTF-8","compressible":true},"application/vnd.syncml.ds.notification":{"source":"iana"},"application/vnd.tableschema+json":{"source":"iana","compressible":true},"application/vnd.tao.intent-module-archive":{"source":"iana","extensions":["tao"]},"application/vnd.tcpdump.pcap":{"source":"iana","extensions":["pcap","cap","dmp"]},"application/vnd.think-cell.ppttc+json":{"source":"iana","compressible":true},"application/vnd.tmd.mediaflex.api+xml":{"source":"iana","compressible":true},"application/vnd.tml":{"source":"iana"},"application/vnd.tmobile-livetv":{"source":"iana","extensions":["tmo"]},"application/vnd.tri.onesource":{"source":"iana"},"application/vnd.trid.tpt":{"source":"iana","extensions":["tpt"]},"application/vnd.triscape.mxs":{"source":"iana","extensions":["mxs"]},"application/vnd.trueapp":{"source":"iana","extensions":["tra"]},"application/vnd.truedoc":{"source":"iana"},"application/vnd.ubisoft.webplayer":{"source":"iana"},"application/vnd.ufdl":{"source":"iana","extensions":["ufd","ufdl"]},"application/vnd.uiq.theme":{"source":"iana","extensions":["utz"]},"application/vnd.umajin":{"source":"iana","extensions":["umj"]},"application/vnd.unity":{"source":"iana","extensions":["unityweb"]},"application/vnd.uoml+xml":{"source":"iana","compressible":true,"extensions":["uoml"]},"application/vnd.uplanet.alert":{"source":"iana"},"application/vnd.uplanet.alert-wbxml":{"source":"iana"},"application/vnd.uplanet.bearer-choice":{"source":"iana"},"application/vnd.uplanet.bearer-choice-wbxml":{"source":"iana"},"application/vnd.uplanet.cacheop":{"source":"iana"},"application/vnd.uplanet.cacheop-wbxml":{"source":"iana"},"application/vnd.uplanet.channel":{"source":"iana"},"application/vnd.uplanet.channel-wbxml":{"source":"iana"},"application/vnd.uplanet.list":{"source":"iana"},"application/vnd.uplanet.list-wbxml":{"source":"iana"},"application/vnd.uplanet.listcmd":{"source":"iana"},"application/vnd.uplanet.listcmd-wbxml":{"source":"iana"},"application/vnd.uplanet.signal":{"source":"iana"},"application/vnd.uri-map":{"source":"iana"},"application/vnd.valve.source.material":{"source":"iana"},"application/vnd.vcx":{"source":"iana","extensions":["vcx"]},"application/vnd.vd-study":{"source":"iana"},"application/vnd.vectorworks":{"source":"iana"},"application/vnd.vel+json":{"source":"iana","compressible":true},"application/vnd.verimatrix.vcas":{"source":"iana"},"application/vnd.veritone.aion+json":{"source":"iana","compressible":true},"application/vnd.veryant.thin":{"source":"iana"},"application/vnd.ves.encrypted":{"source":"iana"},"application/vnd.vidsoft.vidconference":{"source":"iana"},"application/vnd.visio":{"source":"iana","extensions":["vsd","vst","vss","vsw"]},"application/vnd.visionary":{"source":"iana","extensions":["vis"]},"application/vnd.vividence.scriptfile":{"source":"iana"},"application/vnd.vsf":{"source":"iana","extensions":["vsf"]},"application/vnd.wap.sic":{"source":"iana"},"application/vnd.wap.slc":{"source":"iana"},"application/vnd.wap.wbxml":{"source":"iana","charset":"UTF-8","extensions":["wbxml"]},"application/vnd.wap.wmlc":{"source":"iana","extensions":["wmlc"]},"application/vnd.wap.wmlscriptc":{"source":"iana","extensions":["wmlsc"]},"application/vnd.webturbo":{"source":"iana","extensions":["wtb"]},"application/vnd.wfa.dpp":{"source":"iana"},"application/vnd.wfa.p2p":{"source":"iana"},"application/vnd.wfa.wsc":{"source":"iana"},"application/vnd.windows.devicepairing":{"source":"iana"},"application/vnd.wmc":{"source":"iana"},"application/vnd.wmf.bootstrap":{"source":"iana"},"application/vnd.wolfram.mathematica":{"source":"iana"},"application/vnd.wolfram.mathematica.package":{"source":"iana"},"application/vnd.wolfram.player":{"source":"iana","extensions":["nbp"]},"application/vnd.wordperfect":{"source":"iana","extensions":["wpd"]},"application/vnd.wqd":{"source":"iana","extensions":["wqd"]},"application/vnd.wrq-hp3000-labelled":{"source":"iana"},"application/vnd.wt.stf":{"source":"iana","extensions":["stf"]},"application/vnd.wv.csp+wbxml":{"source":"iana"},"application/vnd.wv.csp+xml":{"source":"iana","compressible":true},"application/vnd.wv.ssp+xml":{"source":"iana","compressible":true},"application/vnd.xacml+json":{"source":"iana","compressible":true},"application/vnd.xara":{"source":"iana","extensions":["xar"]},"application/vnd.xfdl":{"source":"iana","extensions":["xfdl"]},"application/vnd.xfdl.webform":{"source":"iana"},"application/vnd.xmi+xml":{"source":"iana","compressible":true},"application/vnd.xmpie.cpkg":{"source":"iana"},"application/vnd.xmpie.dpkg":{"source":"iana"},"application/vnd.xmpie.plan":{"source":"iana"},"application/vnd.xmpie.ppkg":{"source":"iana"},"application/vnd.xmpie.xlim":{"source":"iana"},"application/vnd.yamaha.hv-dic":{"source":"iana","extensions":["hvd"]},"application/vnd.yamaha.hv-script":{"source":"iana","extensions":["hvs"]},"application/vnd.yamaha.hv-voice":{"source":"iana","extensions":["hvp"]},"application/vnd.yamaha.openscoreformat":{"source":"iana","extensions":["osf"]},"application/vnd.yamaha.openscoreformat.osfpvg+xml":{"source":"iana","compressible":true,"extensions":["osfpvg"]},"application/vnd.yamaha.remote-setup":{"source":"iana"},"application/vnd.yamaha.smaf-audio":{"source":"iana","extensions":["saf"]},"application/vnd.yamaha.smaf-phrase":{"source":"iana","extensions":["spf"]},"application/vnd.yamaha.through-ngn":{"source":"iana"},"application/vnd.yamaha.tunnel-udpencap":{"source":"iana"},"application/vnd.yaoweme":{"source":"iana"},"application/vnd.yellowriver-custom-menu":{"source":"iana","extensions":["cmp"]},"application/vnd.youtube.yt":{"source":"iana"},"application/vnd.zul":{"source":"iana","extensions":["zir","zirz"]},"application/vnd.zzazz.deck+xml":{"source":"iana","compressible":true,"extensions":["zaz"]},"application/voicexml+xml":{"source":"iana","compressible":true,"extensions":["vxml"]},"application/voucher-cms+json":{"source":"iana","compressible":true},"application/vq-rtcpxr":{"source":"iana"},"application/wasm":{"source":"iana","compressible":true,"extensions":["wasm"]},"application/watcherinfo+xml":{"source":"iana","compressible":true,"extensions":["wif"]},"application/webpush-options+json":{"source":"iana","compressible":true},"application/whoispp-query":{"source":"iana"},"application/whoispp-response":{"source":"iana"},"application/widget":{"source":"iana","extensions":["wgt"]},"application/winhlp":{"source":"apache","extensions":["hlp"]},"application/wita":{"source":"iana"},"application/wordperfect5.1":{"source":"iana"},"application/wsdl+xml":{"source":"iana","compressible":true,"extensions":["wsdl"]},"application/wspolicy+xml":{"source":"iana","compressible":true,"extensions":["wspolicy"]},"application/x-7z-compressed":{"source":"apache","compressible":false,"extensions":["7z"]},"application/x-abiword":{"source":"apache","extensions":["abw"]},"application/x-ace-compressed":{"source":"apache","extensions":["ace"]},"application/x-amf":{"source":"apache"},"application/x-apple-diskimage":{"source":"apache","extensions":["dmg"]},"application/x-arj":{"compressible":false,"extensions":["arj"]},"application/x-authorware-bin":{"source":"apache","extensions":["aab","x32","u32","vox"]},"application/x-authorware-map":{"source":"apache","extensions":["aam"]},"application/x-authorware-seg":{"source":"apache","extensions":["aas"]},"application/x-bcpio":{"source":"apache","extensions":["bcpio"]},"application/x-bdoc":{"compressible":false,"extensions":["bdoc"]},"application/x-bittorrent":{"source":"apache","extensions":["torrent"]},"application/x-blorb":{"source":"apache","extensions":["blb","blorb"]},"application/x-bzip":{"source":"apache","compressible":false,"extensions":["bz"]},"application/x-bzip2":{"source":"apache","compressible":false,"extensions":["bz2","boz"]},"application/x-cbr":{"source":"apache","extensions":["cbr","cba","cbt","cbz","cb7"]},"application/x-cdlink":{"source":"apache","extensions":["vcd"]},"application/x-cfs-compressed":{"source":"apache","extensions":["cfs"]},"application/x-chat":{"source":"apache","extensions":["chat"]},"application/x-chess-pgn":{"source":"apache","extensions":["pgn"]},"application/x-chrome-extension":{"extensions":["crx"]},"application/x-cocoa":{"source":"nginx","extensions":["cco"]},"application/x-compress":{"source":"apache"},"application/x-conference":{"source":"apache","extensions":["nsc"]},"application/x-cpio":{"source":"apache","extensions":["cpio"]},"application/x-csh":{"source":"apache","extensions":["csh"]},"application/x-deb":{"compressible":false},"application/x-debian-package":{"source":"apache","extensions":["deb","udeb"]},"application/x-dgc-compressed":{"source":"apache","extensions":["dgc"]},"application/x-director":{"source":"apache","extensions":["dir","dcr","dxr","cst","cct","cxt","w3d","fgd","swa"]},"application/x-doom":{"source":"apache","extensions":["wad"]},"application/x-dtbncx+xml":{"source":"apache","compressible":true,"extensions":["ncx"]},"application/x-dtbook+xml":{"source":"apache","compressible":true,"extensions":["dtb"]},"application/x-dtbresource+xml":{"source":"apache","compressible":true,"extensions":["res"]},"application/x-dvi":{"source":"apache","compressible":false,"extensions":["dvi"]},"application/x-envoy":{"source":"apache","extensions":["evy"]},"application/x-eva":{"source":"apache","extensions":["eva"]},"application/x-font-bdf":{"source":"apache","extensions":["bdf"]},"application/x-font-dos":{"source":"apache"},"application/x-font-framemaker":{"source":"apache"},"application/x-font-ghostscript":{"source":"apache","extensions":["gsf"]},"application/x-font-libgrx":{"source":"apache"},"application/x-font-linux-psf":{"source":"apache","extensions":["psf"]},"application/x-font-pcf":{"source":"apache","extensions":["pcf"]},"application/x-font-snf":{"source":"apache","extensions":["snf"]},"application/x-font-speedo":{"source":"apache"},"application/x-font-sunos-news":{"source":"apache"},"application/x-font-type1":{"source":"apache","extensions":["pfa","pfb","pfm","afm"]},"application/x-font-vfont":{"source":"apache"},"application/x-freearc":{"source":"apache","extensions":["arc"]},"application/x-futuresplash":{"source":"apache","extensions":["spl"]},"application/x-gca-compressed":{"source":"apache","extensions":["gca"]},"application/x-glulx":{"source":"apache","extensions":["ulx"]},"application/x-gnumeric":{"source":"apache","extensions":["gnumeric"]},"application/x-gramps-xml":{"source":"apache","extensions":["gramps"]},"application/x-gtar":{"source":"apache","extensions":["gtar"]},"application/x-gzip":{"source":"apache"},"application/x-hdf":{"source":"apache","extensions":["hdf"]},"application/x-httpd-php":{"compressible":true,"extensions":["php"]},"application/x-install-instructions":{"source":"apache","extensions":["install"]},"application/x-iso9660-image":{"source":"apache","extensions":["iso"]},"application/x-iwork-keynote-sffkey":{"extensions":["key"]},"application/x-iwork-numbers-sffnumbers":{"extensions":["numbers"]},"application/x-iwork-pages-sffpages":{"extensions":["pages"]},"application/x-java-archive-diff":{"source":"nginx","extensions":["jardiff"]},"application/x-java-jnlp-file":{"source":"apache","compressible":false,"extensions":["jnlp"]},"application/x-javascript":{"compressible":true},"application/x-keepass2":{"extensions":["kdbx"]},"application/x-latex":{"source":"apache","compressible":false,"extensions":["latex"]},"application/x-lua-bytecode":{"extensions":["luac"]},"application/x-lzh-compressed":{"source":"apache","extensions":["lzh","lha"]},"application/x-makeself":{"source":"nginx","extensions":["run"]},"application/x-mie":{"source":"apache","extensions":["mie"]},"application/x-mobipocket-ebook":{"source":"apache","extensions":["prc","mobi"]},"application/x-mpegurl":{"compressible":false},"application/x-ms-application":{"source":"apache","extensions":["application"]},"application/x-ms-shortcut":{"source":"apache","extensions":["lnk"]},"application/x-ms-wmd":{"source":"apache","extensions":["wmd"]},"application/x-ms-wmz":{"source":"apache","extensions":["wmz"]},"application/x-ms-xbap":{"source":"apache","extensions":["xbap"]},"application/x-msaccess":{"source":"apache","extensions":["mdb"]},"application/x-msbinder":{"source":"apache","extensions":["obd"]},"application/x-mscardfile":{"source":"apache","extensions":["crd"]},"application/x-msclip":{"source":"apache","extensions":["clp"]},"application/x-msdos-program":{"extensions":["exe"]},"application/x-msdownload":{"source":"apache","extensions":["exe","dll","com","bat","msi"]},"application/x-msmediaview":{"source":"apache","extensions":["mvb","m13","m14"]},"application/x-msmetafile":{"source":"apache","extensions":["wmf","wmz","emf","emz"]},"application/x-msmoney":{"source":"apache","extensions":["mny"]},"application/x-mspublisher":{"source":"apache","extensions":["pub"]},"application/x-msschedule":{"source":"apache","extensions":["scd"]},"application/x-msterminal":{"source":"apache","extensions":["trm"]},"application/x-mswrite":{"source":"apache","extensions":["wri"]},"application/x-netcdf":{"source":"apache","extensions":["nc","cdf"]},"application/x-ns-proxy-autoconfig":{"compressible":true,"extensions":["pac"]},"application/x-nzb":{"source":"apache","extensions":["nzb"]},"application/x-perl":{"source":"nginx","extensions":["pl","pm"]},"application/x-pilot":{"source":"nginx","extensions":["prc","pdb"]},"application/x-pkcs12":{"source":"apache","compressible":false,"extensions":["p12","pfx"]},"application/x-pkcs7-certificates":{"source":"apache","extensions":["p7b","spc"]},"application/x-pkcs7-certreqresp":{"source":"apache","extensions":["p7r"]},"application/x-pki-message":{"source":"iana"},"application/x-rar-compressed":{"source":"apache","compressible":false,"extensions":["rar"]},"application/x-redhat-package-manager":{"source":"nginx","extensions":["rpm"]},"application/x-research-info-systems":{"source":"apache","extensions":["ris"]},"application/x-sea":{"source":"nginx","extensions":["sea"]},"application/x-sh":{"source":"apache","compressible":true,"extensions":["sh"]},"application/x-shar":{"source":"apache","extensions":["shar"]},"application/x-shockwave-flash":{"source":"apache","compressible":false,"extensions":["swf"]},"application/x-silverlight-app":{"source":"apache","extensions":["xap"]},"application/x-sql":{"source":"apache","extensions":["sql"]},"application/x-stuffit":{"source":"apache","compressible":false,"extensions":["sit"]},"application/x-stuffitx":{"source":"apache","extensions":["sitx"]},"application/x-subrip":{"source":"apache","extensions":["srt"]},"application/x-sv4cpio":{"source":"apache","extensions":["sv4cpio"]},"application/x-sv4crc":{"source":"apache","extensions":["sv4crc"]},"application/x-t3vm-image":{"source":"apache","extensions":["t3"]},"application/x-tads":{"source":"apache","extensions":["gam"]},"application/x-tar":{"source":"apache","compressible":true,"extensions":["tar"]},"application/x-tcl":{"source":"apache","extensions":["tcl","tk"]},"application/x-tex":{"source":"apache","extensions":["tex"]},"application/x-tex-tfm":{"source":"apache","extensions":["tfm"]},"application/x-texinfo":{"source":"apache","extensions":["texinfo","texi"]},"application/x-tgif":{"source":"apache","extensions":["obj"]},"application/x-ustar":{"source":"apache","extensions":["ustar"]},"application/x-virtualbox-hdd":{"compressible":true,"extensions":["hdd"]},"application/x-virtualbox-ova":{"compressible":true,"extensions":["ova"]},"application/x-virtualbox-ovf":{"compressible":true,"extensions":["ovf"]},"application/x-virtualbox-vbox":{"compressible":true,"extensions":["vbox"]},"application/x-virtualbox-vbox-extpack":{"compressible":false,"extensions":["vbox-extpack"]},"application/x-virtualbox-vdi":{"compressible":true,"extensions":["vdi"]},"application/x-virtualbox-vhd":{"compressible":true,"extensions":["vhd"]},"application/x-virtualbox-vmdk":{"compressible":true,"extensions":["vmdk"]},"application/x-wais-source":{"source":"apache","extensions":["src"]},"application/x-web-app-manifest+json":{"compressible":true,"extensions":["webapp"]},"application/x-www-form-urlencoded":{"source":"iana","compressible":true},"application/x-x509-ca-cert":{"source":"iana","extensions":["der","crt","pem"]},"application/x-x509-ca-ra-cert":{"source":"iana"},"application/x-x509-next-ca-cert":{"source":"iana"},"application/x-xfig":{"source":"apache","extensions":["fig"]},"application/x-xliff+xml":{"source":"apache","compressible":true,"extensions":["xlf"]},"application/x-xpinstall":{"source":"apache","compressible":false,"extensions":["xpi"]},"application/x-xz":{"source":"apache","extensions":["xz"]},"application/x-zmachine":{"source":"apache","extensions":["z1","z2","z3","z4","z5","z6","z7","z8"]},"application/x400-bp":{"source":"iana"},"application/xacml+xml":{"source":"iana","compressible":true},"application/xaml+xml":{"source":"apache","compressible":true,"extensions":["xaml"]},"application/xcap-att+xml":{"source":"iana","compressible":true,"extensions":["xav"]},"application/xcap-caps+xml":{"source":"iana","compressible":true,"extensions":["xca"]},"application/xcap-diff+xml":{"source":"iana","compressible":true,"extensions":["xdf"]},"application/xcap-el+xml":{"source":"iana","compressible":true,"extensions":["xel"]},"application/xcap-error+xml":{"source":"iana","compressible":true},"application/xcap-ns+xml":{"source":"iana","compressible":true,"extensions":["xns"]},"application/xcon-conference-info+xml":{"source":"iana","compressible":true},"application/xcon-conference-info-diff+xml":{"source":"iana","compressible":true},"application/xenc+xml":{"source":"iana","compressible":true,"extensions":["xenc"]},"application/xhtml+xml":{"source":"iana","compressible":true,"extensions":["xhtml","xht"]},"application/xhtml-voice+xml":{"source":"apache","compressible":true},"application/xliff+xml":{"source":"iana","compressible":true,"extensions":["xlf"]},"application/xml":{"source":"iana","compressible":true,"extensions":["xml","xsl","xsd","rng"]},"application/xml-dtd":{"source":"iana","compressible":true,"extensions":["dtd"]},"application/xml-external-parsed-entity":{"source":"iana"},"application/xml-patch+xml":{"source":"iana","compressible":true},"application/xmpp+xml":{"source":"iana","compressible":true},"application/xop+xml":{"source":"iana","compressible":true,"extensions":["xop"]},"application/xproc+xml":{"source":"apache","compressible":true,"extensions":["xpl"]},"application/xslt+xml":{"source":"iana","compressible":true,"extensions":["xsl","xslt"]},"application/xspf+xml":{"source":"apache","compressible":true,"extensions":["xspf"]},"application/xv+xml":{"source":"iana","compressible":true,"extensions":["mxml","xhvml","xvml","xvm"]},"application/yang":{"source":"iana","extensions":["yang"]},"application/yang-data+json":{"source":"iana","compressible":true},"application/yang-data+xml":{"source":"iana","compressible":true},"application/yang-patch+json":{"source":"iana","compressible":true},"application/yang-patch+xml":{"source":"iana","compressible":true},"application/yin+xml":{"source":"iana","compressible":true,"extensions":["yin"]},"application/zip":{"source":"iana","compressible":false,"extensions":["zip"]},"application/zlib":{"source":"iana"},"application/zstd":{"source":"iana"},"audio/1d-interleaved-parityfec":{"source":"iana"},"audio/32kadpcm":{"source":"iana"},"audio/3gpp":{"source":"iana","compressible":false,"extensions":["3gpp"]},"audio/3gpp2":{"source":"iana"},"audio/aac":{"source":"iana"},"audio/ac3":{"source":"iana"},"audio/adpcm":{"source":"apache","extensions":["adp"]},"audio/amr":{"source":"iana","extensions":["amr"]},"audio/amr-wb":{"source":"iana"},"audio/amr-wb+":{"source":"iana"},"audio/aptx":{"source":"iana"},"audio/asc":{"source":"iana"},"audio/atrac-advanced-lossless":{"source":"iana"},"audio/atrac-x":{"source":"iana"},"audio/atrac3":{"source":"iana"},"audio/basic":{"source":"iana","compressible":false,"extensions":["au","snd"]},"audio/bv16":{"source":"iana"},"audio/bv32":{"source":"iana"},"audio/clearmode":{"source":"iana"},"audio/cn":{"source":"iana"},"audio/dat12":{"source":"iana"},"audio/dls":{"source":"iana"},"audio/dsr-es201108":{"source":"iana"},"audio/dsr-es202050":{"source":"iana"},"audio/dsr-es202211":{"source":"iana"},"audio/dsr-es202212":{"source":"iana"},"audio/dv":{"source":"iana"},"audio/dvi4":{"source":"iana"},"audio/eac3":{"source":"iana"},"audio/encaprtp":{"source":"iana"},"audio/evrc":{"source":"iana"},"audio/evrc-qcp":{"source":"iana"},"audio/evrc0":{"source":"iana"},"audio/evrc1":{"source":"iana"},"audio/evrcb":{"source":"iana"},"audio/evrcb0":{"source":"iana"},"audio/evrcb1":{"source":"iana"},"audio/evrcnw":{"source":"iana"},"audio/evrcnw0":{"source":"iana"},"audio/evrcnw1":{"source":"iana"},"audio/evrcwb":{"source":"iana"},"audio/evrcwb0":{"source":"iana"},"audio/evrcwb1":{"source":"iana"},"audio/evs":{"source":"iana"},"audio/flexfec":{"source":"iana"},"audio/fwdred":{"source":"iana"},"audio/g711-0":{"source":"iana"},"audio/g719":{"source":"iana"},"audio/g722":{"source":"iana"},"audio/g7221":{"source":"iana"},"audio/g723":{"source":"iana"},"audio/g726-16":{"source":"iana"},"audio/g726-24":{"source":"iana"},"audio/g726-32":{"source":"iana"},"audio/g726-40":{"source":"iana"},"audio/g728":{"source":"iana"},"audio/g729":{"source":"iana"},"audio/g7291":{"source":"iana"},"audio/g729d":{"source":"iana"},"audio/g729e":{"source":"iana"},"audio/gsm":{"source":"iana"},"audio/gsm-efr":{"source":"iana"},"audio/gsm-hr-08":{"source":"iana"},"audio/ilbc":{"source":"iana"},"audio/ip-mr_v2.5":{"source":"iana"},"audio/isac":{"source":"apache"},"audio/l16":{"source":"iana"},"audio/l20":{"source":"iana"},"audio/l24":{"source":"iana","compressible":false},"audio/l8":{"source":"iana"},"audio/lpc":{"source":"iana"},"audio/melp":{"source":"iana"},"audio/melp1200":{"source":"iana"},"audio/melp2400":{"source":"iana"},"audio/melp600":{"source":"iana"},"audio/mhas":{"source":"iana"},"audio/midi":{"source":"apache","extensions":["mid","midi","kar","rmi"]},"audio/mobile-xmf":{"source":"iana","extensions":["mxmf"]},"audio/mp3":{"compressible":false,"extensions":["mp3"]},"audio/mp4":{"source":"iana","compressible":false,"extensions":["m4a","mp4a"]},"audio/mp4a-latm":{"source":"iana"},"audio/mpa":{"source":"iana"},"audio/mpa-robust":{"source":"iana"},"audio/mpeg":{"source":"iana","compressible":false,"extensions":["mpga","mp2","mp2a","mp3","m2a","m3a"]},"audio/mpeg4-generic":{"source":"iana"},"audio/musepack":{"source":"apache"},"audio/ogg":{"source":"iana","compressible":false,"extensions":["oga","ogg","spx","opus"]},"audio/opus":{"source":"iana"},"audio/parityfec":{"source":"iana"},"audio/pcma":{"source":"iana"},"audio/pcma-wb":{"source":"iana"},"audio/pcmu":{"source":"iana"},"audio/pcmu-wb":{"source":"iana"},"audio/prs.sid":{"source":"iana"},"audio/qcelp":{"source":"iana"},"audio/raptorfec":{"source":"iana"},"audio/red":{"source":"iana"},"audio/rtp-enc-aescm128":{"source":"iana"},"audio/rtp-midi":{"source":"iana"},"audio/rtploopback":{"source":"iana"},"audio/rtx":{"source":"iana"},"audio/s3m":{"source":"apache","extensions":["s3m"]},"audio/scip":{"source":"iana"},"audio/silk":{"source":"apache","extensions":["sil"]},"audio/smv":{"source":"iana"},"audio/smv-qcp":{"source":"iana"},"audio/smv0":{"source":"iana"},"audio/sofa":{"source":"iana"},"audio/sp-midi":{"source":"iana"},"audio/speex":{"source":"iana"},"audio/t140c":{"source":"iana"},"audio/t38":{"source":"iana"},"audio/telephone-event":{"source":"iana"},"audio/tetra_acelp":{"source":"iana"},"audio/tetra_acelp_bb":{"source":"iana"},"audio/tone":{"source":"iana"},"audio/tsvcis":{"source":"iana"},"audio/uemclip":{"source":"iana"},"audio/ulpfec":{"source":"iana"},"audio/usac":{"source":"iana"},"audio/vdvi":{"source":"iana"},"audio/vmr-wb":{"source":"iana"},"audio/vnd.3gpp.iufp":{"source":"iana"},"audio/vnd.4sb":{"source":"iana"},"audio/vnd.audiokoz":{"source":"iana"},"audio/vnd.celp":{"source":"iana"},"audio/vnd.cisco.nse":{"source":"iana"},"audio/vnd.cmles.radio-events":{"source":"iana"},"audio/vnd.cns.anp1":{"source":"iana"},"audio/vnd.cns.inf1":{"source":"iana"},"audio/vnd.dece.audio":{"source":"iana","extensions":["uva","uvva"]},"audio/vnd.digital-winds":{"source":"iana","extensions":["eol"]},"audio/vnd.dlna.adts":{"source":"iana"},"audio/vnd.dolby.heaac.1":{"source":"iana"},"audio/vnd.dolby.heaac.2":{"source":"iana"},"audio/vnd.dolby.mlp":{"source":"iana"},"audio/vnd.dolby.mps":{"source":"iana"},"audio/vnd.dolby.pl2":{"source":"iana"},"audio/vnd.dolby.pl2x":{"source":"iana"},"audio/vnd.dolby.pl2z":{"source":"iana"},"audio/vnd.dolby.pulse.1":{"source":"iana"},"audio/vnd.dra":{"source":"iana","extensions":["dra"]},"audio/vnd.dts":{"source":"iana","extensions":["dts"]},"audio/vnd.dts.hd":{"source":"iana","extensions":["dtshd"]},"audio/vnd.dts.uhd":{"source":"iana"},"audio/vnd.dvb.file":{"source":"iana"},"audio/vnd.everad.plj":{"source":"iana"},"audio/vnd.hns.audio":{"source":"iana"},"audio/vnd.lucent.voice":{"source":"iana","extensions":["lvp"]},"audio/vnd.ms-playready.media.pya":{"source":"iana","extensions":["pya"]},"audio/vnd.nokia.mobile-xmf":{"source":"iana"},"audio/vnd.nortel.vbk":{"source":"iana"},"audio/vnd.nuera.ecelp4800":{"source":"iana","extensions":["ecelp4800"]},"audio/vnd.nuera.ecelp7470":{"source":"iana","extensions":["ecelp7470"]},"audio/vnd.nuera.ecelp9600":{"source":"iana","extensions":["ecelp9600"]},"audio/vnd.octel.sbc":{"source":"iana"},"audio/vnd.presonus.multitrack":{"source":"iana"},"audio/vnd.qcelp":{"source":"iana"},"audio/vnd.rhetorex.32kadpcm":{"source":"iana"},"audio/vnd.rip":{"source":"iana","extensions":["rip"]},"audio/vnd.rn-realaudio":{"compressible":false},"audio/vnd.sealedmedia.softseal.mpeg":{"source":"iana"},"audio/vnd.vmx.cvsd":{"source":"iana"},"audio/vnd.wave":{"compressible":false},"audio/vorbis":{"source":"iana","compressible":false},"audio/vorbis-config":{"source":"iana"},"audio/wav":{"compressible":false,"extensions":["wav"]},"audio/wave":{"compressible":false,"extensions":["wav"]},"audio/webm":{"source":"apache","compressible":false,"extensions":["weba"]},"audio/x-aac":{"source":"apache","compressible":false,"extensions":["aac"]},"audio/x-aiff":{"source":"apache","extensions":["aif","aiff","aifc"]},"audio/x-caf":{"source":"apache","compressible":false,"extensions":["caf"]},"audio/x-flac":{"source":"apache","extensions":["flac"]},"audio/x-m4a":{"source":"nginx","extensions":["m4a"]},"audio/x-matroska":{"source":"apache","extensions":["mka"]},"audio/x-mpegurl":{"source":"apache","extensions":["m3u"]},"audio/x-ms-wax":{"source":"apache","extensions":["wax"]},"audio/x-ms-wma":{"source":"apache","extensions":["wma"]},"audio/x-pn-realaudio":{"source":"apache","extensions":["ram","ra"]},"audio/x-pn-realaudio-plugin":{"source":"apache","extensions":["rmp"]},"audio/x-realaudio":{"source":"nginx","extensions":["ra"]},"audio/x-tta":{"source":"apache"},"audio/x-wav":{"source":"apache","extensions":["wav"]},"audio/xm":{"source":"apache","extensions":["xm"]},"chemical/x-cdx":{"source":"apache","extensions":["cdx"]},"chemical/x-cif":{"source":"apache","extensions":["cif"]},"chemical/x-cmdf":{"source":"apache","extensions":["cmdf"]},"chemical/x-cml":{"source":"apache","extensions":["cml"]},"chemical/x-csml":{"source":"apache","extensions":["csml"]},"chemical/x-pdb":{"source":"apache"},"chemical/x-xyz":{"source":"apache","extensions":["xyz"]},"font/collection":{"source":"iana","extensions":["ttc"]},"font/otf":{"source":"iana","compressible":true,"extensions":["otf"]},"font/sfnt":{"source":"iana"},"font/ttf":{"source":"iana","compressible":true,"extensions":["ttf"]},"font/woff":{"source":"iana","extensions":["woff"]},"font/woff2":{"source":"iana","extensions":["woff2"]},"image/aces":{"source":"iana","extensions":["exr"]},"image/apng":{"compressible":false,"extensions":["apng"]},"image/avci":{"source":"iana","extensions":["avci"]},"image/avcs":{"source":"iana","extensions":["avcs"]},"image/avif":{"source":"iana","compressible":false,"extensions":["avif"]},"image/bmp":{"source":"iana","compressible":true,"extensions":["bmp"]},"image/cgm":{"source":"iana","extensions":["cgm"]},"image/dicom-rle":{"source":"iana","extensions":["drle"]},"image/emf":{"source":"iana","extensions":["emf"]},"image/fits":{"source":"iana","extensions":["fits"]},"image/g3fax":{"source":"iana","extensions":["g3"]},"image/gif":{"source":"iana","compressible":false,"extensions":["gif"]},"image/heic":{"source":"iana","extensions":["heic"]},"image/heic-sequence":{"source":"iana","extensions":["heics"]},"image/heif":{"source":"iana","extensions":["heif"]},"image/heif-sequence":{"source":"iana","extensions":["heifs"]},"image/hej2k":{"source":"iana","extensions":["hej2"]},"image/hsj2":{"source":"iana","extensions":["hsj2"]},"image/ief":{"source":"iana","extensions":["ief"]},"image/jls":{"source":"iana","extensions":["jls"]},"image/jp2":{"source":"iana","compressible":false,"extensions":["jp2","jpg2"]},"image/jpeg":{"source":"iana","compressible":false,"extensions":["jpeg","jpg","jpe"]},"image/jph":{"source":"iana","extensions":["jph"]},"image/jphc":{"source":"iana","extensions":["jhc"]},"image/jpm":{"source":"iana","compressible":false,"extensions":["jpm"]},"image/jpx":{"source":"iana","compressible":false,"extensions":["jpx","jpf"]},"image/jxr":{"source":"iana","extensions":["jxr"]},"image/jxra":{"source":"iana","extensions":["jxra"]},"image/jxrs":{"source":"iana","extensions":["jxrs"]},"image/jxs":{"source":"iana","extensions":["jxs"]},"image/jxsc":{"source":"iana","extensions":["jxsc"]},"image/jxsi":{"source":"iana","extensions":["jxsi"]},"image/jxss":{"source":"iana","extensions":["jxss"]},"image/ktx":{"source":"iana","extensions":["ktx"]},"image/ktx2":{"source":"iana","extensions":["ktx2"]},"image/naplps":{"source":"iana"},"image/pjpeg":{"compressible":false},"image/png":{"source":"iana","compressible":false,"extensions":["png"]},"image/prs.btif":{"source":"iana","extensions":["btif"]},"image/prs.pti":{"source":"iana","extensions":["pti"]},"image/pwg-raster":{"source":"iana"},"image/sgi":{"source":"apache","extensions":["sgi"]},"image/svg+xml":{"source":"iana","compressible":true,"extensions":["svg","svgz"]},"image/t38":{"source":"iana","extensions":["t38"]},"image/tiff":{"source":"iana","compressible":false,"extensions":["tif","tiff"]},"image/tiff-fx":{"source":"iana","extensions":["tfx"]},"image/vnd.adobe.photoshop":{"source":"iana","compressible":true,"extensions":["psd"]},"image/vnd.airzip.accelerator.azv":{"source":"iana","extensions":["azv"]},"image/vnd.cns.inf2":{"source":"iana"},"image/vnd.dece.graphic":{"source":"iana","extensions":["uvi","uvvi","uvg","uvvg"]},"image/vnd.djvu":{"source":"iana","extensions":["djvu","djv"]},"image/vnd.dvb.subtitle":{"source":"iana","extensions":["sub"]},"image/vnd.dwg":{"source":"iana","extensions":["dwg"]},"image/vnd.dxf":{"source":"iana","extensions":["dxf"]},"image/vnd.fastbidsheet":{"source":"iana","extensions":["fbs"]},"image/vnd.fpx":{"source":"iana","extensions":["fpx"]},"image/vnd.fst":{"source":"iana","extensions":["fst"]},"image/vnd.fujixerox.edmics-mmr":{"source":"iana","extensions":["mmr"]},"image/vnd.fujixerox.edmics-rlc":{"source":"iana","extensions":["rlc"]},"image/vnd.globalgraphics.pgb":{"source":"iana"},"image/vnd.microsoft.icon":{"source":"iana","compressible":true,"extensions":["ico"]},"image/vnd.mix":{"source":"iana"},"image/vnd.mozilla.apng":{"source":"iana"},"image/vnd.ms-dds":{"compressible":true,"extensions":["dds"]},"image/vnd.ms-modi":{"source":"iana","extensions":["mdi"]},"image/vnd.ms-photo":{"source":"apache","extensions":["wdp"]},"image/vnd.net-fpx":{"source":"iana","extensions":["npx"]},"image/vnd.pco.b16":{"source":"iana","extensions":["b16"]},"image/vnd.radiance":{"source":"iana"},"image/vnd.sealed.png":{"source":"iana"},"image/vnd.sealedmedia.softseal.gif":{"source":"iana"},"image/vnd.sealedmedia.softseal.jpg":{"source":"iana"},"image/vnd.svf":{"source":"iana"},"image/vnd.tencent.tap":{"source":"iana","extensions":["tap"]},"image/vnd.valve.source.texture":{"source":"iana","extensions":["vtf"]},"image/vnd.wap.wbmp":{"source":"iana","extensions":["wbmp"]},"image/vnd.xiff":{"source":"iana","extensions":["xif"]},"image/vnd.zbrush.pcx":{"source":"iana","extensions":["pcx"]},"image/webp":{"source":"apache","extensions":["webp"]},"image/wmf":{"source":"iana","extensions":["wmf"]},"image/x-3ds":{"source":"apache","extensions":["3ds"]},"image/x-cmu-raster":{"source":"apache","extensions":["ras"]},"image/x-cmx":{"source":"apache","extensions":["cmx"]},"image/x-freehand":{"source":"apache","extensions":["fh","fhc","fh4","fh5","fh7"]},"image/x-icon":{"source":"apache","compressible":true,"extensions":["ico"]},"image/x-jng":{"source":"nginx","extensions":["jng"]},"image/x-mrsid-image":{"source":"apache","extensions":["sid"]},"image/x-ms-bmp":{"source":"nginx","compressible":true,"extensions":["bmp"]},"image/x-pcx":{"source":"apache","extensions":["pcx"]},"image/x-pict":{"source":"apache","extensions":["pic","pct"]},"image/x-portable-anymap":{"source":"apache","extensions":["pnm"]},"image/x-portable-bitmap":{"source":"apache","extensions":["pbm"]},"image/x-portable-graymap":{"source":"apache","extensions":["pgm"]},"image/x-portable-pixmap":{"source":"apache","extensions":["ppm"]},"image/x-rgb":{"source":"apache","extensions":["rgb"]},"image/x-tga":{"source":"apache","extensions":["tga"]},"image/x-xbitmap":{"source":"apache","extensions":["xbm"]},"image/x-xcf":{"compressible":false},"image/x-xpixmap":{"source":"apache","extensions":["xpm"]},"image/x-xwindowdump":{"source":"apache","extensions":["xwd"]},"message/cpim":{"source":"iana"},"message/delivery-status":{"source":"iana"},"message/disposition-notification":{"source":"iana","extensions":["disposition-notification"]},"message/external-body":{"source":"iana"},"message/feedback-report":{"source":"iana"},"message/global":{"source":"iana","extensions":["u8msg"]},"message/global-delivery-status":{"source":"iana","extensions":["u8dsn"]},"message/global-disposition-notification":{"source":"iana","extensions":["u8mdn"]},"message/global-headers":{"source":"iana","extensions":["u8hdr"]},"message/http":{"source":"iana","compressible":false},"message/imdn+xml":{"source":"iana","compressible":true},"message/news":{"source":"iana"},"message/partial":{"source":"iana","compressible":false},"message/rfc822":{"source":"iana","compressible":true,"extensions":["eml","mime"]},"message/s-http":{"source":"iana"},"message/sip":{"source":"iana"},"message/sipfrag":{"source":"iana"},"message/tracking-status":{"source":"iana"},"message/vnd.si.simp":{"source":"iana"},"message/vnd.wfa.wsc":{"source":"iana","extensions":["wsc"]},"model/3mf":{"source":"iana","extensions":["3mf"]},"model/e57":{"source":"iana"},"model/gltf+json":{"source":"iana","compressible":true,"extensions":["gltf"]},"model/gltf-binary":{"source":"iana","compressible":true,"extensions":["glb"]},"model/iges":{"source":"iana","compressible":false,"extensions":["igs","iges"]},"model/mesh":{"source":"iana","compressible":false,"extensions":["msh","mesh","silo"]},"model/mtl":{"source":"iana","extensions":["mtl"]},"model/obj":{"source":"iana","extensions":["obj"]},"model/step":{"source":"iana"},"model/step+xml":{"source":"iana","compressible":true,"extensions":["stpx"]},"model/step+zip":{"source":"iana","compressible":false,"extensions":["stpz"]},"model/step-xml+zip":{"source":"iana","compressible":false,"extensions":["stpxz"]},"model/stl":{"source":"iana","extensions":["stl"]},"model/vnd.collada+xml":{"source":"iana","compressible":true,"extensions":["dae"]},"model/vnd.dwf":{"source":"iana","extensions":["dwf"]},"model/vnd.flatland.3dml":{"source":"iana"},"model/vnd.gdl":{"source":"iana","extensions":["gdl"]},"model/vnd.gs-gdl":{"source":"apache"},"model/vnd.gs.gdl":{"source":"iana"},"model/vnd.gtw":{"source":"iana","extensions":["gtw"]},"model/vnd.moml+xml":{"source":"iana","compressible":true},"model/vnd.mts":{"source":"iana","extensions":["mts"]},"model/vnd.opengex":{"source":"iana","extensions":["ogex"]},"model/vnd.parasolid.transmit.binary":{"source":"iana","extensions":["x_b"]},"model/vnd.parasolid.transmit.text":{"source":"iana","extensions":["x_t"]},"model/vnd.pytha.pyox":{"source":"iana"},"model/vnd.rosette.annotated-data-model":{"source":"iana"},"model/vnd.sap.vds":{"source":"iana","extensions":["vds"]},"model/vnd.usdz+zip":{"source":"iana","compressible":false,"extensions":["usdz"]},"model/vnd.valve.source.compiled-map":{"source":"iana","extensions":["bsp"]},"model/vnd.vtu":{"source":"iana","extensions":["vtu"]},"model/vrml":{"source":"iana","compressible":false,"extensions":["wrl","vrml"]},"model/x3d+binary":{"source":"apache","compressible":false,"extensions":["x3db","x3dbz"]},"model/x3d+fastinfoset":{"source":"iana","extensions":["x3db"]},"model/x3d+vrml":{"source":"apache","compressible":false,"extensions":["x3dv","x3dvz"]},"model/x3d+xml":{"source":"iana","compressible":true,"extensions":["x3d","x3dz"]},"model/x3d-vrml":{"source":"iana","extensions":["x3dv"]},"multipart/alternative":{"source":"iana","compressible":false},"multipart/appledouble":{"source":"iana"},"multipart/byteranges":{"source":"iana"},"multipart/digest":{"source":"iana"},"multipart/encrypted":{"source":"iana","compressible":false},"multipart/form-data":{"source":"iana","compressible":false},"multipart/header-set":{"source":"iana"},"multipart/mixed":{"source":"iana"},"multipart/multilingual":{"source":"iana"},"multipart/parallel":{"source":"iana"},"multipart/related":{"source":"iana","compressible":false},"multipart/report":{"source":"iana"},"multipart/signed":{"source":"iana","compressible":false},"multipart/vnd.bint.med-plus":{"source":"iana"},"multipart/voice-message":{"source":"iana"},"multipart/x-mixed-replace":{"source":"iana"},"text/1d-interleaved-parityfec":{"source":"iana"},"text/cache-manifest":{"source":"iana","compressible":true,"extensions":["appcache","manifest"]},"text/calendar":{"source":"iana","extensions":["ics","ifb"]},"text/calender":{"compressible":true},"text/cmd":{"compressible":true},"text/coffeescript":{"extensions":["coffee","litcoffee"]},"text/cql":{"source":"iana"},"text/cql-expression":{"source":"iana"},"text/cql-identifier":{"source":"iana"},"text/css":{"source":"iana","charset":"UTF-8","compressible":true,"extensions":["css"]},"text/csv":{"source":"iana","compressible":true,"extensions":["csv"]},"text/csv-schema":{"source":"iana"},"text/directory":{"source":"iana"},"text/dns":{"source":"iana"},"text/ecmascript":{"source":"iana"},"text/encaprtp":{"source":"iana"},"text/enriched":{"source":"iana"},"text/fhirpath":{"source":"iana"},"text/flexfec":{"source":"iana"},"text/fwdred":{"source":"iana"},"text/gff3":{"source":"iana"},"text/grammar-ref-list":{"source":"iana"},"text/html":{"source":"iana","compressible":true,"extensions":["html","htm","shtml"]},"text/jade":{"extensions":["jade"]},"text/javascript":{"source":"iana","compressible":true},"text/jcr-cnd":{"source":"iana"},"text/jsx":{"compressible":true,"extensions":["jsx"]},"text/less":{"compressible":true,"extensions":["less"]},"text/markdown":{"source":"iana","compressible":true,"extensions":["markdown","md"]},"text/mathml":{"source":"nginx","extensions":["mml"]},"text/mdx":{"compressible":true,"extensions":["mdx"]},"text/mizar":{"source":"iana"},"text/n3":{"source":"iana","charset":"UTF-8","compressible":true,"extensions":["n3"]},"text/parameters":{"source":"iana","charset":"UTF-8"},"text/parityfec":{"source":"iana"},"text/plain":{"source":"iana","compressible":true,"extensions":["txt","text","conf","def","list","log","in","ini"]},"text/provenance-notation":{"source":"iana","charset":"UTF-8"},"text/prs.fallenstein.rst":{"source":"iana"},"text/prs.lines.tag":{"source":"iana","extensions":["dsc"]},"text/prs.prop.logic":{"source":"iana"},"text/raptorfec":{"source":"iana"},"text/red":{"source":"iana"},"text/rfc822-headers":{"source":"iana"},"text/richtext":{"source":"iana","compressible":true,"extensions":["rtx"]},"text/rtf":{"source":"iana","compressible":true,"extensions":["rtf"]},"text/rtp-enc-aescm128":{"source":"iana"},"text/rtploopback":{"source":"iana"},"text/rtx":{"source":"iana"},"text/sgml":{"source":"iana","extensions":["sgml","sgm"]},"text/shaclc":{"source":"iana"},"text/shex":{"source":"iana","extensions":["shex"]},"text/slim":{"extensions":["slim","slm"]},"text/spdx":{"source":"iana","extensions":["spdx"]},"text/strings":{"source":"iana"},"text/stylus":{"extensions":["stylus","styl"]},"text/t140":{"source":"iana"},"text/tab-separated-values":{"source":"iana","compressible":true,"extensions":["tsv"]},"text/troff":{"source":"iana","extensions":["t","tr","roff","man","me","ms"]},"text/turtle":{"source":"iana","charset":"UTF-8","extensions":["ttl"]},"text/ulpfec":{"source":"iana"},"text/uri-list":{"source":"iana","compressible":true,"extensions":["uri","uris","urls"]},"text/vcard":{"source":"iana","compressible":true,"extensions":["vcard"]},"text/vnd.a":{"source":"iana"},"text/vnd.abc":{"source":"iana"},"text/vnd.ascii-art":{"source":"iana"},"text/vnd.curl":{"source":"iana","extensions":["curl"]},"text/vnd.curl.dcurl":{"source":"apache","extensions":["dcurl"]},"text/vnd.curl.mcurl":{"source":"apache","extensions":["mcurl"]},"text/vnd.curl.scurl":{"source":"apache","extensions":["scurl"]},"text/vnd.debian.copyright":{"source":"iana","charset":"UTF-8"},"text/vnd.dmclientscript":{"source":"iana"},"text/vnd.dvb.subtitle":{"source":"iana","extensions":["sub"]},"text/vnd.esmertec.theme-descriptor":{"source":"iana","charset":"UTF-8"},"text/vnd.familysearch.gedcom":{"source":"iana","extensions":["ged"]},"text/vnd.ficlab.flt":{"source":"iana"},"text/vnd.fly":{"source":"iana","extensions":["fly"]},"text/vnd.fmi.flexstor":{"source":"iana","extensions":["flx"]},"text/vnd.gml":{"source":"iana"},"text/vnd.graphviz":{"source":"iana","extensions":["gv"]},"text/vnd.hans":{"source":"iana"},"text/vnd.hgl":{"source":"iana"},"text/vnd.in3d.3dml":{"source":"iana","extensions":["3dml"]},"text/vnd.in3d.spot":{"source":"iana","extensions":["spot"]},"text/vnd.iptc.newsml":{"source":"iana"},"text/vnd.iptc.nitf":{"source":"iana"},"text/vnd.latex-z":{"source":"iana"},"text/vnd.motorola.reflex":{"source":"iana"},"text/vnd.ms-mediapackage":{"source":"iana"},"text/vnd.net2phone.commcenter.command":{"source":"iana"},"text/vnd.radisys.msml-basic-layout":{"source":"iana"},"text/vnd.senx.warpscript":{"source":"iana"},"text/vnd.si.uricatalogue":{"source":"iana"},"text/vnd.sosi":{"source":"iana"},"text/vnd.sun.j2me.app-descriptor":{"source":"iana","charset":"UTF-8","extensions":["jad"]},"text/vnd.trolltech.linguist":{"source":"iana","charset":"UTF-8"},"text/vnd.wap.si":{"source":"iana"},"text/vnd.wap.sl":{"source":"iana"},"text/vnd.wap.wml":{"source":"iana","extensions":["wml"]},"text/vnd.wap.wmlscript":{"source":"iana","extensions":["wmls"]},"text/vtt":{"source":"iana","charset":"UTF-8","compressible":true,"extensions":["vtt"]},"text/x-asm":{"source":"apache","extensions":["s","asm"]},"text/x-c":{"source":"apache","extensions":["c","cc","cxx","cpp","h","hh","dic"]},"text/x-component":{"source":"nginx","extensions":["htc"]},"text/x-fortran":{"source":"apache","extensions":["f","for","f77","f90"]},"text/x-gwt-rpc":{"compressible":true},"text/x-handlebars-template":{"extensions":["hbs"]},"text/x-java-source":{"source":"apache","extensions":["java"]},"text/x-jquery-tmpl":{"compressible":true},"text/x-lua":{"extensions":["lua"]},"text/x-markdown":{"compressible":true,"extensions":["mkd"]},"text/x-nfo":{"source":"apache","extensions":["nfo"]},"text/x-opml":{"source":"apache","extensions":["opml"]},"text/x-org":{"compressible":true,"extensions":["org"]},"text/x-pascal":{"source":"apache","extensions":["p","pas"]},"text/x-processing":{"compressible":true,"extensions":["pde"]},"text/x-sass":{"extensions":["sass"]},"text/x-scss":{"extensions":["scss"]},"text/x-setext":{"source":"apache","extensions":["etx"]},"text/x-sfv":{"source":"apache","extensions":["sfv"]},"text/x-suse-ymp":{"compressible":true,"extensions":["ymp"]},"text/x-uuencode":{"source":"apache","extensions":["uu"]},"text/x-vcalendar":{"source":"apache","extensions":["vcs"]},"text/x-vcard":{"source":"apache","extensions":["vcf"]},"text/xml":{"source":"iana","compressible":true,"extensions":["xml"]},"text/xml-external-parsed-entity":{"source":"iana"},"text/yaml":{"compressible":true,"extensions":["yaml","yml"]},"video/1d-interleaved-parityfec":{"source":"iana"},"video/3gpp":{"source":"iana","extensions":["3gp","3gpp"]},"video/3gpp-tt":{"source":"iana"},"video/3gpp2":{"source":"iana","extensions":["3g2"]},"video/av1":{"source":"iana"},"video/bmpeg":{"source":"iana"},"video/bt656":{"source":"iana"},"video/celb":{"source":"iana"},"video/dv":{"source":"iana"},"video/encaprtp":{"source":"iana"},"video/ffv1":{"source":"iana"},"video/flexfec":{"source":"iana"},"video/h261":{"source":"iana","extensions":["h261"]},"video/h263":{"source":"iana","extensions":["h263"]},"video/h263-1998":{"source":"iana"},"video/h263-2000":{"source":"iana"},"video/h264":{"source":"iana","extensions":["h264"]},"video/h264-rcdo":{"source":"iana"},"video/h264-svc":{"source":"iana"},"video/h265":{"source":"iana"},"video/iso.segment":{"source":"iana","extensions":["m4s"]},"video/jpeg":{"source":"iana","extensions":["jpgv"]},"video/jpeg2000":{"source":"iana"},"video/jpm":{"source":"apache","extensions":["jpm","jpgm"]},"video/jxsv":{"source":"iana"},"video/mj2":{"source":"iana","extensions":["mj2","mjp2"]},"video/mp1s":{"source":"iana"},"video/mp2p":{"source":"iana"},"video/mp2t":{"source":"iana","extensions":["ts"]},"video/mp4":{"source":"iana","compressible":false,"extensions":["mp4","mp4v","mpg4"]},"video/mp4v-es":{"source":"iana"},"video/mpeg":{"source":"iana","compressible":false,"extensions":["mpeg","mpg","mpe","m1v","m2v"]},"video/mpeg4-generic":{"source":"iana"},"video/mpv":{"source":"iana"},"video/nv":{"source":"iana"},"video/ogg":{"source":"iana","compressible":false,"extensions":["ogv"]},"video/parityfec":{"source":"iana"},"video/pointer":{"source":"iana"},"video/quicktime":{"source":"iana","compressible":false,"extensions":["qt","mov"]},"video/raptorfec":{"source":"iana"},"video/raw":{"source":"iana"},"video/rtp-enc-aescm128":{"source":"iana"},"video/rtploopback":{"source":"iana"},"video/rtx":{"source":"iana"},"video/scip":{"source":"iana"},"video/smpte291":{"source":"iana"},"video/smpte292m":{"source":"iana"},"video/ulpfec":{"source":"iana"},"video/vc1":{"source":"iana"},"video/vc2":{"source":"iana"},"video/vnd.cctv":{"source":"iana"},"video/vnd.dece.hd":{"source":"iana","extensions":["uvh","uvvh"]},"video/vnd.dece.mobile":{"source":"iana","extensions":["uvm","uvvm"]},"video/vnd.dece.mp4":{"source":"iana"},"video/vnd.dece.pd":{"source":"iana","extensions":["uvp","uvvp"]},"video/vnd.dece.sd":{"source":"iana","extensions":["uvs","uvvs"]},"video/vnd.dece.video":{"source":"iana","extensions":["uvv","uvvv"]},"video/vnd.directv.mpeg":{"source":"iana"},"video/vnd.directv.mpeg-tts":{"source":"iana"},"video/vnd.dlna.mpeg-tts":{"source":"iana"},"video/vnd.dvb.file":{"source":"iana","extensions":["dvb"]},"video/vnd.fvt":{"source":"iana","extensions":["fvt"]},"video/vnd.hns.video":{"source":"iana"},"video/vnd.iptvforum.1dparityfec-1010":{"source":"iana"},"video/vnd.iptvforum.1dparityfec-2005":{"source":"iana"},"video/vnd.iptvforum.2dparityfec-1010":{"source":"iana"},"video/vnd.iptvforum.2dparityfec-2005":{"source":"iana"},"video/vnd.iptvforum.ttsavc":{"source":"iana"},"video/vnd.iptvforum.ttsmpeg2":{"source":"iana"},"video/vnd.motorola.video":{"source":"iana"},"video/vnd.motorola.videop":{"source":"iana"},"video/vnd.mpegurl":{"source":"iana","extensions":["mxu","m4u"]},"video/vnd.ms-playready.media.pyv":{"source":"iana","extensions":["pyv"]},"video/vnd.nokia.interleaved-multimedia":{"source":"iana"},"video/vnd.nokia.mp4vr":{"source":"iana"},"video/vnd.nokia.videovoip":{"source":"iana"},"video/vnd.objectvideo":{"source":"iana"},"video/vnd.radgamettools.bink":{"source":"iana"},"video/vnd.radgamettools.smacker":{"source":"iana"},"video/vnd.sealed.mpeg1":{"source":"iana"},"video/vnd.sealed.mpeg4":{"source":"iana"},"video/vnd.sealed.swf":{"source":"iana"},"video/vnd.sealedmedia.softseal.mov":{"source":"iana"},"video/vnd.uvvu.mp4":{"source":"iana","extensions":["uvu","uvvu"]},"video/vnd.vivo":{"source":"iana","extensions":["viv"]},"video/vnd.youtube.yt":{"source":"iana"},"video/vp8":{"source":"iana"},"video/vp9":{"source":"iana"},"video/webm":{"source":"apache","compressible":false,"extensions":["webm"]},"video/x-f4v":{"source":"apache","extensions":["f4v"]},"video/x-fli":{"source":"apache","extensions":["fli"]},"video/x-flv":{"source":"apache","compressible":false,"extensions":["flv"]},"video/x-m4v":{"source":"apache","extensions":["m4v"]},"video/x-matroska":{"source":"apache","compressible":false,"extensions":["mkv","mk3d","mks"]},"video/x-mng":{"source":"apache","extensions":["mng"]},"video/x-ms-asf":{"source":"apache","extensions":["asf","asx"]},"video/x-ms-vob":{"source":"apache","extensions":["vob"]},"video/x-ms-wm":{"source":"apache","extensions":["wm"]},"video/x-ms-wmv":{"source":"apache","compressible":false,"extensions":["wmv"]},"video/x-ms-wmx":{"source":"apache","extensions":["wmx"]},"video/x-ms-wvx":{"source":"apache","extensions":["wvx"]},"video/x-msvideo":{"source":"apache","extensions":["avi"]},"video/x-sgi-movie":{"source":"apache","extensions":["movie"]},"video/x-smv":{"source":"apache","extensions":["smv"]},"x-conference/x-cooltalk":{"source":"apache","extensions":["ice"]},"x-shader/x-fragment":{"compressible":true},"x-shader/x-vertex":{"compressible":true}}');

/***/ }),

/***/ 85675:
/***/ ((module) => {

"use strict";
module.exports = require("http2");

/***/ }),

/***/ 86049:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
/*!
 * mime-types
 * Copyright(c) 2014 Jonathan Ong
 * Copyright(c) 2015 Douglas Christopher Wilson
 * MIT Licensed
 */



/**
 * Module dependencies.
 * @private
 */

var db = __webpack_require__(7598)
var extname = (__webpack_require__(16928).extname)

/**
 * Module variables.
 * @private
 */

var EXTRACT_TYPE_REGEXP = /^\s*([^;\s]*)(?:;|\s|$)/
var TEXT_TYPE_REGEXP = /^text\//i

/**
 * Module exports.
 * @public
 */

exports.charset = charset
exports.charsets = { lookup: charset }
exports.contentType = contentType
exports.extension = extension
exports.extensions = Object.create(null)
exports.lookup = lookup
exports.types = Object.create(null)

// Populate the extensions/types maps
populateMaps(exports.extensions, exports.types)

/**
 * Get the default charset for a MIME type.
 *
 * @param {string} type
 * @return {boolean|string}
 */

function charset (type) {
  if (!type || typeof type !== 'string') {
    return false
  }

  // TODO: use media-typer
  var match = EXTRACT_TYPE_REGEXP.exec(type)
  var mime = match && db[match[1].toLowerCase()]

  if (mime && mime.charset) {
    return mime.charset
  }

  // default text/* to utf-8
  if (match && TEXT_TYPE_REGEXP.test(match[1])) {
    return 'UTF-8'
  }

  return false
}

/**
 * Create a full Content-Type header given a MIME type or extension.
 *
 * @param {string} str
 * @return {boolean|string}
 */

function contentType (str) {
  // TODO: should this even be in this module?
  if (!str || typeof str !== 'string') {
    return false
  }

  var mime = str.indexOf('/') === -1
    ? exports.lookup(str)
    : str

  if (!mime) {
    return false
  }

  // TODO: use content-type or other module
  if (mime.indexOf('charset') === -1) {
    var charset = exports.charset(mime)
    if (charset) mime += '; charset=' + charset.toLowerCase()
  }

  return mime
}

/**
 * Get the default extension for a MIME type.
 *
 * @param {string} type
 * @return {boolean|string}
 */

function extension (type) {
  if (!type || typeof type !== 'string') {
    return false
  }

  // TODO: use media-typer
  var match = EXTRACT_TYPE_REGEXP.exec(type)

  // get extensions
  var exts = match && exports.extensions[match[1].toLowerCase()]

  if (!exts || !exts.length) {
    return false
  }

  return exts[0]
}

/**
 * Lookup the MIME type for a file path/extension.
 *
 * @param {string} path
 * @return {boolean|string}
 */

function lookup (path) {
  if (!path || typeof path !== 'string') {
    return false
  }

  // get the extension ("ext" or ".ext" or full path)
  var extension = extname('x.' + path)
    .toLowerCase()
    .substr(1)

  if (!extension) {
    return false
  }

  return exports.types[extension] || false
}

/**
 * Populate the extensions and types maps.
 * @private
 */

function populateMaps (extensions, types) {
  // source preference (least -> most)
  var preference = ['nginx', 'apache', undefined, 'iana']

  Object.keys(db).forEach(function forEachMimeType (type) {
    var mime = db[type]
    var exts = mime.extensions

    if (!exts || !exts.length) {
      return
    }

    // mime -> extensions
    extensions[type] = exts

    // extension -> mime
    for (var i = 0; i < exts.length; i++) {
      var extension = exts[i]

      if (types[extension]) {
        var from = preference.indexOf(db[types[extension]].source)
        var to = preference.indexOf(mime.source)

        if (types[extension] !== 'application/octet-stream' &&
          (from > to || (from === to && types[extension].substr(0, 12) === 'application/'))) {
          // skip the remapping
          continue
        }
      }

      // set the extension -> mime
      types[extension] = type
    }
  })
}


/***/ }),

/***/ 87016:
/***/ ((module) => {

"use strict";
module.exports = require("url");

/***/ }),

/***/ 89353:
/***/ ((module) => {

"use strict";


/* eslint no-invalid-this: 1 */

var ERROR_MESSAGE = 'Function.prototype.bind called on incompatible ';
var toStr = Object.prototype.toString;
var max = Math.max;
var funcType = '[object Function]';

var concatty = function concatty(a, b) {
    var arr = [];

    for (var i = 0; i < a.length; i += 1) {
        arr[i] = a[i];
    }
    for (var j = 0; j < b.length; j += 1) {
        arr[j + a.length] = b[j];
    }

    return arr;
};

var slicy = function slicy(arrLike, offset) {
    var arr = [];
    for (var i = offset || 0, j = 0; i < arrLike.length; i += 1, j += 1) {
        arr[j] = arrLike[i];
    }
    return arr;
};

var joiny = function (arr, joiner) {
    var str = '';
    for (var i = 0; i < arr.length; i += 1) {
        str += arr[i];
        if (i + 1 < arr.length) {
            str += joiner;
        }
    }
    return str;
};

module.exports = function bind(that) {
    var target = this;
    if (typeof target !== 'function' || toStr.apply(target) !== funcType) {
        throw new TypeError(ERROR_MESSAGE + target);
    }
    var args = slicy(arguments, 1);

    var bound;
    var binder = function () {
        if (this instanceof bound) {
            var result = target.apply(
                this,
                concatty(args, arguments)
            );
            if (Object(result) === result) {
                return result;
            }
            return this;
        }
        return target.apply(
            that,
            concatty(args, arguments)
        );

    };

    var boundLength = max(0, target.length - args.length);
    var boundArgs = [];
    for (var i = 0; i < boundLength; i++) {
        boundArgs[i] = '$' + i;
    }

    bound = Function('binder', 'return function (' + joiny(boundArgs, ',') + '){ return binder.apply(this,arguments); }')(binder);

    if (target.prototype) {
        var Empty = function Empty() {};
        Empty.prototype = target.prototype;
        bound.prototype = new Empty();
        Empty.prototype = null;
    }

    return bound;
};


/***/ }),

/***/ 90028:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var iterate    = __webpack_require__(78051)
  , initState  = __webpack_require__(19500)
  , terminator = __webpack_require__(26276)
  ;

// Public API
module.exports = serialOrdered;
// sorting helpers
module.exports.ascending  = ascending;
module.exports.descending = descending;

/**
 * Runs iterator over provided sorted array elements in series
 *
 * @param   {array|object} list - array or object (named list) to iterate over
 * @param   {function} iterator - iterator to run
 * @param   {function} sortMethod - custom sort function
 * @param   {function} callback - invoked when all elements processed
 * @returns {function} - jobs terminator
 */
function serialOrdered(list, iterator, sortMethod, callback)
{
  var state = initState(list, sortMethod);

  iterate(list, iterator, state, function iteratorHandler(error, result)
  {
    if (error)
    {
      callback(error, result);
      return;
    }

    state.index++;

    // are we there yet?
    if (state.index < (state['keyedList'] || list).length)
    {
      iterate(list, iterator, state, iteratorHandler);
      return;
    }

    // done here
    callback(null, state.results);
  });

  return terminator.bind(state, callback);
}

/*
 * -- Sort methods
 */

/**
 * sort helper to sort array elements in ascending order
 *
 * @param   {mixed} a - an item to compare
 * @param   {mixed} b - an item to compare
 * @returns {number} - comparison result
 */
function ascending(a, b)
{
  return a < b ? -1 : a > b ? 1 : 0;
}

/**
 * sort helper to sort array elements in descending order
 *
 * @param   {mixed} a - an item to compare
 * @param   {mixed} b - an item to compare
 * @returns {number} - comparison result
 */
function descending(a, b)
{
  return -1 * ascending(a, b);
}


/***/ }),

/***/ 92096:
/***/ ((module, exports, __webpack_require__) => {

/* module decorator */ module = __webpack_require__.nmd(module);
var __WEBPACK_AMD_DEFINE_RESULT__;var bigInt = (function (undefined) {
    "use strict";

    var BASE = 1e7,
        LOG_BASE = 7,
        MAX_INT = 9007199254740992,
        MAX_INT_ARR = smallToArray(MAX_INT),
        DEFAULT_ALPHABET = "0123456789abcdefghijklmnopqrstuvwxyz";

    var supportsNativeBigInt = typeof BigInt === "function";

    function Integer(v, radix, alphabet, caseSensitive) {
        if (typeof v === "undefined") return Integer[0];
        if (typeof radix !== "undefined") return +radix === 10 && !alphabet ? parseValue(v) : parseBase(v, radix, alphabet, caseSensitive);
        return parseValue(v);
    }

    function BigInteger(value, sign) {
        this.value = value;
        this.sign = sign;
        this.isSmall = false;
    }
    BigInteger.prototype = Object.create(Integer.prototype);

    function SmallInteger(value) {
        this.value = value;
        this.sign = value < 0;
        this.isSmall = true;
    }
    SmallInteger.prototype = Object.create(Integer.prototype);

    function NativeBigInt(value) {
        this.value = value;
    }
    NativeBigInt.prototype = Object.create(Integer.prototype);

    function isPrecise(n) {
        return -MAX_INT < n && n < MAX_INT;
    }

    function smallToArray(n) { // For performance reasons doesn't reference BASE, need to change this function if BASE changes
        if (n < 1e7)
            return [n];
        if (n < 1e14)
            return [n % 1e7, Math.floor(n / 1e7)];
        return [n % 1e7, Math.floor(n / 1e7) % 1e7, Math.floor(n / 1e14)];
    }

    function arrayToSmall(arr) { // If BASE changes this function may need to change
        trim(arr);
        var length = arr.length;
        if (length < 4 && compareAbs(arr, MAX_INT_ARR) < 0) {
            switch (length) {
                case 0: return 0;
                case 1: return arr[0];
                case 2: return arr[0] + arr[1] * BASE;
                default: return arr[0] + (arr[1] + arr[2] * BASE) * BASE;
            }
        }
        return arr;
    }

    function trim(v) {
        var i = v.length;
        while (v[--i] === 0);
        v.length = i + 1;
    }

    function createArray(length) { // function shamelessly stolen from Yaffle's library https://github.com/Yaffle/BigInteger
        var x = new Array(length);
        var i = -1;
        while (++i < length) {
            x[i] = 0;
        }
        return x;
    }

    function truncate(n) {
        if (n > 0) return Math.floor(n);
        return Math.ceil(n);
    }

    function add(a, b) { // assumes a and b are arrays with a.length >= b.length
        var l_a = a.length,
            l_b = b.length,
            r = new Array(l_a),
            carry = 0,
            base = BASE,
            sum, i;
        for (i = 0; i < l_b; i++) {
            sum = a[i] + b[i] + carry;
            carry = sum >= base ? 1 : 0;
            r[i] = sum - carry * base;
        }
        while (i < l_a) {
            sum = a[i] + carry;
            carry = sum === base ? 1 : 0;
            r[i++] = sum - carry * base;
        }
        if (carry > 0) r.push(carry);
        return r;
    }

    function addAny(a, b) {
        if (a.length >= b.length) return add(a, b);
        return add(b, a);
    }

    function addSmall(a, carry) { // assumes a is array, carry is number with 0 <= carry < MAX_INT
        var l = a.length,
            r = new Array(l),
            base = BASE,
            sum, i;
        for (i = 0; i < l; i++) {
            sum = a[i] - base + carry;
            carry = Math.floor(sum / base);
            r[i] = sum - carry * base;
            carry += 1;
        }
        while (carry > 0) {
            r[i++] = carry % base;
            carry = Math.floor(carry / base);
        }
        return r;
    }

    BigInteger.prototype.add = function (v) {
        var n = parseValue(v);
        if (this.sign !== n.sign) {
            return this.subtract(n.negate());
        }
        var a = this.value, b = n.value;
        if (n.isSmall) {
            return new BigInteger(addSmall(a, Math.abs(b)), this.sign);
        }
        return new BigInteger(addAny(a, b), this.sign);
    };
    BigInteger.prototype.plus = BigInteger.prototype.add;

    SmallInteger.prototype.add = function (v) {
        var n = parseValue(v);
        var a = this.value;
        if (a < 0 !== n.sign) {
            return this.subtract(n.negate());
        }
        var b = n.value;
        if (n.isSmall) {
            if (isPrecise(a + b)) return new SmallInteger(a + b);
            b = smallToArray(Math.abs(b));
        }
        return new BigInteger(addSmall(b, Math.abs(a)), a < 0);
    };
    SmallInteger.prototype.plus = SmallInteger.prototype.add;

    NativeBigInt.prototype.add = function (v) {
        return new NativeBigInt(this.value + parseValue(v).value);
    }
    NativeBigInt.prototype.plus = NativeBigInt.prototype.add;

    function subtract(a, b) { // assumes a and b are arrays with a >= b
        var a_l = a.length,
            b_l = b.length,
            r = new Array(a_l),
            borrow = 0,
            base = BASE,
            i, difference;
        for (i = 0; i < b_l; i++) {
            difference = a[i] - borrow - b[i];
            if (difference < 0) {
                difference += base;
                borrow = 1;
            } else borrow = 0;
            r[i] = difference;
        }
        for (i = b_l; i < a_l; i++) {
            difference = a[i] - borrow;
            if (difference < 0) difference += base;
            else {
                r[i++] = difference;
                break;
            }
            r[i] = difference;
        }
        for (; i < a_l; i++) {
            r[i] = a[i];
        }
        trim(r);
        return r;
    }

    function subtractAny(a, b, sign) {
        var value;
        if (compareAbs(a, b) >= 0) {
            value = subtract(a, b);
        } else {
            value = subtract(b, a);
            sign = !sign;
        }
        value = arrayToSmall(value);
        if (typeof value === "number") {
            if (sign) value = -value;
            return new SmallInteger(value);
        }
        return new BigInteger(value, sign);
    }

    function subtractSmall(a, b, sign) { // assumes a is array, b is number with 0 <= b < MAX_INT
        var l = a.length,
            r = new Array(l),
            carry = -b,
            base = BASE,
            i, difference;
        for (i = 0; i < l; i++) {
            difference = a[i] + carry;
            carry = Math.floor(difference / base);
            difference %= base;
            r[i] = difference < 0 ? difference + base : difference;
        }
        r = arrayToSmall(r);
        if (typeof r === "number") {
            if (sign) r = -r;
            return new SmallInteger(r);
        } return new BigInteger(r, sign);
    }

    BigInteger.prototype.subtract = function (v) {
        var n = parseValue(v);
        if (this.sign !== n.sign) {
            return this.add(n.negate());
        }
        var a = this.value, b = n.value;
        if (n.isSmall)
            return subtractSmall(a, Math.abs(b), this.sign);
        return subtractAny(a, b, this.sign);
    };
    BigInteger.prototype.minus = BigInteger.prototype.subtract;

    SmallInteger.prototype.subtract = function (v) {
        var n = parseValue(v);
        var a = this.value;
        if (a < 0 !== n.sign) {
            return this.add(n.negate());
        }
        var b = n.value;
        if (n.isSmall) {
            return new SmallInteger(a - b);
        }
        return subtractSmall(b, Math.abs(a), a >= 0);
    };
    SmallInteger.prototype.minus = SmallInteger.prototype.subtract;

    NativeBigInt.prototype.subtract = function (v) {
        return new NativeBigInt(this.value - parseValue(v).value);
    }
    NativeBigInt.prototype.minus = NativeBigInt.prototype.subtract;

    BigInteger.prototype.negate = function () {
        return new BigInteger(this.value, !this.sign);
    };
    SmallInteger.prototype.negate = function () {
        var sign = this.sign;
        var small = new SmallInteger(-this.value);
        small.sign = !sign;
        return small;
    };
    NativeBigInt.prototype.negate = function () {
        return new NativeBigInt(-this.value);
    }

    BigInteger.prototype.abs = function () {
        return new BigInteger(this.value, false);
    };
    SmallInteger.prototype.abs = function () {
        return new SmallInteger(Math.abs(this.value));
    };
    NativeBigInt.prototype.abs = function () {
        return new NativeBigInt(this.value >= 0 ? this.value : -this.value);
    }


    function multiplyLong(a, b) {
        var a_l = a.length,
            b_l = b.length,
            l = a_l + b_l,
            r = createArray(l),
            base = BASE,
            product, carry, i, a_i, b_j;
        for (i = 0; i < a_l; ++i) {
            a_i = a[i];
            for (var j = 0; j < b_l; ++j) {
                b_j = b[j];
                product = a_i * b_j + r[i + j];
                carry = Math.floor(product / base);
                r[i + j] = product - carry * base;
                r[i + j + 1] += carry;
            }
        }
        trim(r);
        return r;
    }

    function multiplySmall(a, b) { // assumes a is array, b is number with |b| < BASE
        var l = a.length,
            r = new Array(l),
            base = BASE,
            carry = 0,
            product, i;
        for (i = 0; i < l; i++) {
            product = a[i] * b + carry;
            carry = Math.floor(product / base);
            r[i] = product - carry * base;
        }
        while (carry > 0) {
            r[i++] = carry % base;
            carry = Math.floor(carry / base);
        }
        return r;
    }

    function shiftLeft(x, n) {
        var r = [];
        while (n-- > 0) r.push(0);
        return r.concat(x);
    }

    function multiplyKaratsuba(x, y) {
        var n = Math.max(x.length, y.length);

        if (n <= 30) return multiplyLong(x, y);
        n = Math.ceil(n / 2);

        var b = x.slice(n),
            a = x.slice(0, n),
            d = y.slice(n),
            c = y.slice(0, n);

        var ac = multiplyKaratsuba(a, c),
            bd = multiplyKaratsuba(b, d),
            abcd = multiplyKaratsuba(addAny(a, b), addAny(c, d));

        var product = addAny(addAny(ac, shiftLeft(subtract(subtract(abcd, ac), bd), n)), shiftLeft(bd, 2 * n));
        trim(product);
        return product;
    }

    // The following function is derived from a surface fit of a graph plotting the performance difference
    // between long multiplication and karatsuba multiplication versus the lengths of the two arrays.
    function useKaratsuba(l1, l2) {
        return -0.012 * l1 - 0.012 * l2 + 0.000015 * l1 * l2 > 0;
    }

    BigInteger.prototype.multiply = function (v) {
        var n = parseValue(v),
            a = this.value, b = n.value,
            sign = this.sign !== n.sign,
            abs;
        if (n.isSmall) {
            if (b === 0) return Integer[0];
            if (b === 1) return this;
            if (b === -1) return this.negate();
            abs = Math.abs(b);
            if (abs < BASE) {
                return new BigInteger(multiplySmall(a, abs), sign);
            }
            b = smallToArray(abs);
        }
        if (useKaratsuba(a.length, b.length)) // Karatsuba is only faster for certain array sizes
            return new BigInteger(multiplyKaratsuba(a, b), sign);
        return new BigInteger(multiplyLong(a, b), sign);
    };

    BigInteger.prototype.times = BigInteger.prototype.multiply;

    function multiplySmallAndArray(a, b, sign) { // a >= 0
        if (a < BASE) {
            return new BigInteger(multiplySmall(b, a), sign);
        }
        return new BigInteger(multiplyLong(b, smallToArray(a)), sign);
    }
    SmallInteger.prototype._multiplyBySmall = function (a) {
        if (isPrecise(a.value * this.value)) {
            return new SmallInteger(a.value * this.value);
        }
        return multiplySmallAndArray(Math.abs(a.value), smallToArray(Math.abs(this.value)), this.sign !== a.sign);
    };
    BigInteger.prototype._multiplyBySmall = function (a) {
        if (a.value === 0) return Integer[0];
        if (a.value === 1) return this;
        if (a.value === -1) return this.negate();
        return multiplySmallAndArray(Math.abs(a.value), this.value, this.sign !== a.sign);
    };
    SmallInteger.prototype.multiply = function (v) {
        return parseValue(v)._multiplyBySmall(this);
    };
    SmallInteger.prototype.times = SmallInteger.prototype.multiply;

    NativeBigInt.prototype.multiply = function (v) {
        return new NativeBigInt(this.value * parseValue(v).value);
    }
    NativeBigInt.prototype.times = NativeBigInt.prototype.multiply;

    function square(a) {
        //console.assert(2 * BASE * BASE < MAX_INT);
        var l = a.length,
            r = createArray(l + l),
            base = BASE,
            product, carry, i, a_i, a_j;
        for (i = 0; i < l; i++) {
            a_i = a[i];
            carry = 0 - a_i * a_i;
            for (var j = i; j < l; j++) {
                a_j = a[j];
                product = 2 * (a_i * a_j) + r[i + j] + carry;
                carry = Math.floor(product / base);
                r[i + j] = product - carry * base;
            }
            r[i + l] = carry;
        }
        trim(r);
        return r;
    }

    BigInteger.prototype.square = function () {
        return new BigInteger(square(this.value), false);
    };

    SmallInteger.prototype.square = function () {
        var value = this.value * this.value;
        if (isPrecise(value)) return new SmallInteger(value);
        return new BigInteger(square(smallToArray(Math.abs(this.value))), false);
    };

    NativeBigInt.prototype.square = function (v) {
        return new NativeBigInt(this.value * this.value);
    }

    function divMod1(a, b) { // Left over from previous version. Performs faster than divMod2 on smaller input sizes.
        var a_l = a.length,
            b_l = b.length,
            base = BASE,
            result = createArray(b.length),
            divisorMostSignificantDigit = b[b_l - 1],
            // normalization
            lambda = Math.ceil(base / (2 * divisorMostSignificantDigit)),
            remainder = multiplySmall(a, lambda),
            divisor = multiplySmall(b, lambda),
            quotientDigit, shift, carry, borrow, i, l, q;
        if (remainder.length <= a_l) remainder.push(0);
        divisor.push(0);
        divisorMostSignificantDigit = divisor[b_l - 1];
        for (shift = a_l - b_l; shift >= 0; shift--) {
            quotientDigit = base - 1;
            if (remainder[shift + b_l] !== divisorMostSignificantDigit) {
                quotientDigit = Math.floor((remainder[shift + b_l] * base + remainder[shift + b_l - 1]) / divisorMostSignificantDigit);
            }
            // quotientDigit <= base - 1
            carry = 0;
            borrow = 0;
            l = divisor.length;
            for (i = 0; i < l; i++) {
                carry += quotientDigit * divisor[i];
                q = Math.floor(carry / base);
                borrow += remainder[shift + i] - (carry - q * base);
                carry = q;
                if (borrow < 0) {
                    remainder[shift + i] = borrow + base;
                    borrow = -1;
                } else {
                    remainder[shift + i] = borrow;
                    borrow = 0;
                }
            }
            while (borrow !== 0) {
                quotientDigit -= 1;
                carry = 0;
                for (i = 0; i < l; i++) {
                    carry += remainder[shift + i] - base + divisor[i];
                    if (carry < 0) {
                        remainder[shift + i] = carry + base;
                        carry = 0;
                    } else {
                        remainder[shift + i] = carry;
                        carry = 1;
                    }
                }
                borrow += carry;
            }
            result[shift] = quotientDigit;
        }
        // denormalization
        remainder = divModSmall(remainder, lambda)[0];
        return [arrayToSmall(result), arrayToSmall(remainder)];
    }

    function divMod2(a, b) { // Implementation idea shamelessly stolen from Silent Matt's library http://silentmatt.com/biginteger/
        // Performs faster than divMod1 on larger input sizes.
        var a_l = a.length,
            b_l = b.length,
            result = [],
            part = [],
            base = BASE,
            guess, xlen, highx, highy, check;
        while (a_l) {
            part.unshift(a[--a_l]);
            trim(part);
            if (compareAbs(part, b) < 0) {
                result.push(0);
                continue;
            }
            xlen = part.length;
            highx = part[xlen - 1] * base + part[xlen - 2];
            highy = b[b_l - 1] * base + b[b_l - 2];
            if (xlen > b_l) {
                highx = (highx + 1) * base;
            }
            guess = Math.ceil(highx / highy);
            do {
                check = multiplySmall(b, guess);
                if (compareAbs(check, part) <= 0) break;
                guess--;
            } while (guess);
            result.push(guess);
            part = subtract(part, check);
        }
        result.reverse();
        return [arrayToSmall(result), arrayToSmall(part)];
    }

    function divModSmall(value, lambda) {
        var length = value.length,
            quotient = createArray(length),
            base = BASE,
            i, q, remainder, divisor;
        remainder = 0;
        for (i = length - 1; i >= 0; --i) {
            divisor = remainder * base + value[i];
            q = truncate(divisor / lambda);
            remainder = divisor - q * lambda;
            quotient[i] = q | 0;
        }
        return [quotient, remainder | 0];
    }

    function divModAny(self, v) {
        var value, n = parseValue(v);
        if (supportsNativeBigInt) {
            return [new NativeBigInt(self.value / n.value), new NativeBigInt(self.value % n.value)];
        }
        var a = self.value, b = n.value;
        var quotient;
        if (b === 0) throw new Error("Cannot divide by zero");
        if (self.isSmall) {
            if (n.isSmall) {
                return [new SmallInteger(truncate(a / b)), new SmallInteger(a % b)];
            }
            return [Integer[0], self];
        }
        if (n.isSmall) {
            if (b === 1) return [self, Integer[0]];
            if (b == -1) return [self.negate(), Integer[0]];
            var abs = Math.abs(b);
            if (abs < BASE) {
                value = divModSmall(a, abs);
                quotient = arrayToSmall(value[0]);
                var remainder = value[1];
                if (self.sign) remainder = -remainder;
                if (typeof quotient === "number") {
                    if (self.sign !== n.sign) quotient = -quotient;
                    return [new SmallInteger(quotient), new SmallInteger(remainder)];
                }
                return [new BigInteger(quotient, self.sign !== n.sign), new SmallInteger(remainder)];
            }
            b = smallToArray(abs);
        }
        var comparison = compareAbs(a, b);
        if (comparison === -1) return [Integer[0], self];
        if (comparison === 0) return [Integer[self.sign === n.sign ? 1 : -1], Integer[0]];

        // divMod1 is faster on smaller input sizes
        if (a.length + b.length <= 200)
            value = divMod1(a, b);
        else value = divMod2(a, b);

        quotient = value[0];
        var qSign = self.sign !== n.sign,
            mod = value[1],
            mSign = self.sign;
        if (typeof quotient === "number") {
            if (qSign) quotient = -quotient;
            quotient = new SmallInteger(quotient);
        } else quotient = new BigInteger(quotient, qSign);
        if (typeof mod === "number") {
            if (mSign) mod = -mod;
            mod = new SmallInteger(mod);
        } else mod = new BigInteger(mod, mSign);
        return [quotient, mod];
    }

    BigInteger.prototype.divmod = function (v) {
        var result = divModAny(this, v);
        return {
            quotient: result[0],
            remainder: result[1]
        };
    };
    NativeBigInt.prototype.divmod = SmallInteger.prototype.divmod = BigInteger.prototype.divmod;


    BigInteger.prototype.divide = function (v) {
        return divModAny(this, v)[0];
    };
    NativeBigInt.prototype.over = NativeBigInt.prototype.divide = function (v) {
        return new NativeBigInt(this.value / parseValue(v).value);
    };
    SmallInteger.prototype.over = SmallInteger.prototype.divide = BigInteger.prototype.over = BigInteger.prototype.divide;

    BigInteger.prototype.mod = function (v) {
        return divModAny(this, v)[1];
    };
    NativeBigInt.prototype.mod = NativeBigInt.prototype.remainder = function (v) {
        return new NativeBigInt(this.value % parseValue(v).value);
    };
    SmallInteger.prototype.remainder = SmallInteger.prototype.mod = BigInteger.prototype.remainder = BigInteger.prototype.mod;

    BigInteger.prototype.pow = function (v) {
        var n = parseValue(v),
            a = this.value,
            b = n.value,
            value, x, y;
        if (b === 0) return Integer[1];
        if (a === 0) return Integer[0];
        if (a === 1) return Integer[1];
        if (a === -1) return n.isEven() ? Integer[1] : Integer[-1];
        if (n.sign) {
            return Integer[0];
        }
        if (!n.isSmall) throw new Error("The exponent " + n.toString() + " is too large.");
        if (this.isSmall) {
            if (isPrecise(value = Math.pow(a, b)))
                return new SmallInteger(truncate(value));
        }
        x = this;
        y = Integer[1];
        while (true) {
            if (b & 1 === 1) {
                y = y.times(x);
                --b;
            }
            if (b === 0) break;
            b /= 2;
            x = x.square();
        }
        return y;
    };
    SmallInteger.prototype.pow = BigInteger.prototype.pow;

    NativeBigInt.prototype.pow = function (v) {
        var n = parseValue(v);
        var a = this.value, b = n.value;
        var _0 = BigInt(0), _1 = BigInt(1), _2 = BigInt(2);
        if (b === _0) return Integer[1];
        if (a === _0) return Integer[0];
        if (a === _1) return Integer[1];
        if (a === BigInt(-1)) return n.isEven() ? Integer[1] : Integer[-1];
        if (n.isNegative()) return new NativeBigInt(_0);
        var x = this;
        var y = Integer[1];
        while (true) {
            if ((b & _1) === _1) {
                y = y.times(x);
                --b;
            }
            if (b === _0) break;
            b /= _2;
            x = x.square();
        }
        return y;
    }

    BigInteger.prototype.modPow = function (exp, mod) {
        exp = parseValue(exp);
        mod = parseValue(mod);
        if (mod.isZero()) throw new Error("Cannot take modPow with modulus 0");
        var r = Integer[1],
            base = this.mod(mod);
        if (exp.isNegative()) {
            exp = exp.multiply(Integer[-1]);
            base = base.modInv(mod);
        }
        while (exp.isPositive()) {
            if (base.isZero()) return Integer[0];
            if (exp.isOdd()) r = r.multiply(base).mod(mod);
            exp = exp.divide(2);
            base = base.square().mod(mod);
        }
        return r;
    };
    NativeBigInt.prototype.modPow = SmallInteger.prototype.modPow = BigInteger.prototype.modPow;

    function compareAbs(a, b) {
        if (a.length !== b.length) {
            return a.length > b.length ? 1 : -1;
        }
        for (var i = a.length - 1; i >= 0; i--) {
            if (a[i] !== b[i]) return a[i] > b[i] ? 1 : -1;
        }
        return 0;
    }

    BigInteger.prototype.compareAbs = function (v) {
        var n = parseValue(v),
            a = this.value,
            b = n.value;
        if (n.isSmall) return 1;
        return compareAbs(a, b);
    };
    SmallInteger.prototype.compareAbs = function (v) {
        var n = parseValue(v),
            a = Math.abs(this.value),
            b = n.value;
        if (n.isSmall) {
            b = Math.abs(b);
            return a === b ? 0 : a > b ? 1 : -1;
        }
        return -1;
    };
    NativeBigInt.prototype.compareAbs = function (v) {
        var a = this.value;
        var b = parseValue(v).value;
        a = a >= 0 ? a : -a;
        b = b >= 0 ? b : -b;
        return a === b ? 0 : a > b ? 1 : -1;
    }

    BigInteger.prototype.compare = function (v) {
        // See discussion about comparison with Infinity:
        // https://github.com/peterolson/BigInteger.js/issues/61
        if (v === Infinity) {
            return -1;
        }
        if (v === -Infinity) {
            return 1;
        }

        var n = parseValue(v),
            a = this.value,
            b = n.value;
        if (this.sign !== n.sign) {
            return n.sign ? 1 : -1;
        }
        if (n.isSmall) {
            return this.sign ? -1 : 1;
        }
        return compareAbs(a, b) * (this.sign ? -1 : 1);
    };
    BigInteger.prototype.compareTo = BigInteger.prototype.compare;

    SmallInteger.prototype.compare = function (v) {
        if (v === Infinity) {
            return -1;
        }
        if (v === -Infinity) {
            return 1;
        }

        var n = parseValue(v),
            a = this.value,
            b = n.value;
        if (n.isSmall) {
            return a == b ? 0 : a > b ? 1 : -1;
        }
        if (a < 0 !== n.sign) {
            return a < 0 ? -1 : 1;
        }
        return a < 0 ? 1 : -1;
    };
    SmallInteger.prototype.compareTo = SmallInteger.prototype.compare;

    NativeBigInt.prototype.compare = function (v) {
        if (v === Infinity) {
            return -1;
        }
        if (v === -Infinity) {
            return 1;
        }
        var a = this.value;
        var b = parseValue(v).value;
        return a === b ? 0 : a > b ? 1 : -1;
    }
    NativeBigInt.prototype.compareTo = NativeBigInt.prototype.compare;

    BigInteger.prototype.equals = function (v) {
        return this.compare(v) === 0;
    };
    NativeBigInt.prototype.eq = NativeBigInt.prototype.equals = SmallInteger.prototype.eq = SmallInteger.prototype.equals = BigInteger.prototype.eq = BigInteger.prototype.equals;

    BigInteger.prototype.notEquals = function (v) {
        return this.compare(v) !== 0;
    };
    NativeBigInt.prototype.neq = NativeBigInt.prototype.notEquals = SmallInteger.prototype.neq = SmallInteger.prototype.notEquals = BigInteger.prototype.neq = BigInteger.prototype.notEquals;

    BigInteger.prototype.greater = function (v) {
        return this.compare(v) > 0;
    };
    NativeBigInt.prototype.gt = NativeBigInt.prototype.greater = SmallInteger.prototype.gt = SmallInteger.prototype.greater = BigInteger.prototype.gt = BigInteger.prototype.greater;

    BigInteger.prototype.lesser = function (v) {
        return this.compare(v) < 0;
    };
    NativeBigInt.prototype.lt = NativeBigInt.prototype.lesser = SmallInteger.prototype.lt = SmallInteger.prototype.lesser = BigInteger.prototype.lt = BigInteger.prototype.lesser;

    BigInteger.prototype.greaterOrEquals = function (v) {
        return this.compare(v) >= 0;
    };
    NativeBigInt.prototype.geq = NativeBigInt.prototype.greaterOrEquals = SmallInteger.prototype.geq = SmallInteger.prototype.greaterOrEquals = BigInteger.prototype.geq = BigInteger.prototype.greaterOrEquals;

    BigInteger.prototype.lesserOrEquals = function (v) {
        return this.compare(v) <= 0;
    };
    NativeBigInt.prototype.leq = NativeBigInt.prototype.lesserOrEquals = SmallInteger.prototype.leq = SmallInteger.prototype.lesserOrEquals = BigInteger.prototype.leq = BigInteger.prototype.lesserOrEquals;

    BigInteger.prototype.isEven = function () {
        return (this.value[0] & 1) === 0;
    };
    SmallInteger.prototype.isEven = function () {
        return (this.value & 1) === 0;
    };
    NativeBigInt.prototype.isEven = function () {
        return (this.value & BigInt(1)) === BigInt(0);
    }

    BigInteger.prototype.isOdd = function () {
        return (this.value[0] & 1) === 1;
    };
    SmallInteger.prototype.isOdd = function () {
        return (this.value & 1) === 1;
    };
    NativeBigInt.prototype.isOdd = function () {
        return (this.value & BigInt(1)) === BigInt(1);
    }

    BigInteger.prototype.isPositive = function () {
        return !this.sign;
    };
    SmallInteger.prototype.isPositive = function () {
        return this.value > 0;
    };
    NativeBigInt.prototype.isPositive = SmallInteger.prototype.isPositive;

    BigInteger.prototype.isNegative = function () {
        return this.sign;
    };
    SmallInteger.prototype.isNegative = function () {
        return this.value < 0;
    };
    NativeBigInt.prototype.isNegative = SmallInteger.prototype.isNegative;

    BigInteger.prototype.isUnit = function () {
        return false;
    };
    SmallInteger.prototype.isUnit = function () {
        return Math.abs(this.value) === 1;
    };
    NativeBigInt.prototype.isUnit = function () {
        return this.abs().value === BigInt(1);
    }

    BigInteger.prototype.isZero = function () {
        return false;
    };
    SmallInteger.prototype.isZero = function () {
        return this.value === 0;
    };
    NativeBigInt.prototype.isZero = function () {
        return this.value === BigInt(0);
    }

    BigInteger.prototype.isDivisibleBy = function (v) {
        var n = parseValue(v);
        if (n.isZero()) return false;
        if (n.isUnit()) return true;
        if (n.compareAbs(2) === 0) return this.isEven();
        return this.mod(n).isZero();
    };
    NativeBigInt.prototype.isDivisibleBy = SmallInteger.prototype.isDivisibleBy = BigInteger.prototype.isDivisibleBy;

    function isBasicPrime(v) {
        var n = v.abs();
        if (n.isUnit()) return false;
        if (n.equals(2) || n.equals(3) || n.equals(5)) return true;
        if (n.isEven() || n.isDivisibleBy(3) || n.isDivisibleBy(5)) return false;
        if (n.lesser(49)) return true;
        // we don't know if it's prime: let the other functions figure it out
    }

    function millerRabinTest(n, a) {
        var nPrev = n.prev(),
            b = nPrev,
            r = 0,
            d, t, i, x;
        while (b.isEven()) b = b.divide(2), r++;
        next: for (i = 0; i < a.length; i++) {
            if (n.lesser(a[i])) continue;
            x = bigInt(a[i]).modPow(b, n);
            if (x.isUnit() || x.equals(nPrev)) continue;
            for (d = r - 1; d != 0; d--) {
                x = x.square().mod(n);
                if (x.isUnit()) return false;
                if (x.equals(nPrev)) continue next;
            }
            return false;
        }
        return true;
    }

    // Set "strict" to true to force GRH-supported lower bound of 2*log(N)^2
    BigInteger.prototype.isPrime = function (strict) {
        var isPrime = isBasicPrime(this);
        if (isPrime !== undefined) return isPrime;
        var n = this.abs();
        var bits = n.bitLength();
        if (bits <= 64)
            return millerRabinTest(n, [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37]);
        var logN = Math.log(2) * bits.toJSNumber();
        var t = Math.ceil((strict === true) ? (2 * Math.pow(logN, 2)) : logN);
        for (var a = [], i = 0; i < t; i++) {
            a.push(bigInt(i + 2));
        }
        return millerRabinTest(n, a);
    };
    NativeBigInt.prototype.isPrime = SmallInteger.prototype.isPrime = BigInteger.prototype.isPrime;

    BigInteger.prototype.isProbablePrime = function (iterations, rng) {
        var isPrime = isBasicPrime(this);
        if (isPrime !== undefined) return isPrime;
        var n = this.abs();
        var t = iterations === undefined ? 5 : iterations;
        for (var a = [], i = 0; i < t; i++) {
            a.push(bigInt.randBetween(2, n.minus(2), rng));
        }
        return millerRabinTest(n, a);
    };
    NativeBigInt.prototype.isProbablePrime = SmallInteger.prototype.isProbablePrime = BigInteger.prototype.isProbablePrime;

    BigInteger.prototype.modInv = function (n) {
        var t = bigInt.zero, newT = bigInt.one, r = parseValue(n), newR = this.abs(), q, lastT, lastR;
        while (!newR.isZero()) {
            q = r.divide(newR);
            lastT = t;
            lastR = r;
            t = newT;
            r = newR;
            newT = lastT.subtract(q.multiply(newT));
            newR = lastR.subtract(q.multiply(newR));
        }
        if (!r.isUnit()) throw new Error(this.toString() + " and " + n.toString() + " are not co-prime");
        if (t.compare(0) === -1) {
            t = t.add(n);
        }
        if (this.isNegative()) {
            return t.negate();
        }
        return t;
    };

    NativeBigInt.prototype.modInv = SmallInteger.prototype.modInv = BigInteger.prototype.modInv;

    BigInteger.prototype.next = function () {
        var value = this.value;
        if (this.sign) {
            return subtractSmall(value, 1, this.sign);
        }
        return new BigInteger(addSmall(value, 1), this.sign);
    };
    SmallInteger.prototype.next = function () {
        var value = this.value;
        if (value + 1 < MAX_INT) return new SmallInteger(value + 1);
        return new BigInteger(MAX_INT_ARR, false);
    };
    NativeBigInt.prototype.next = function () {
        return new NativeBigInt(this.value + BigInt(1));
    }

    BigInteger.prototype.prev = function () {
        var value = this.value;
        if (this.sign) {
            return new BigInteger(addSmall(value, 1), true);
        }
        return subtractSmall(value, 1, this.sign);
    };
    SmallInteger.prototype.prev = function () {
        var value = this.value;
        if (value - 1 > -MAX_INT) return new SmallInteger(value - 1);
        return new BigInteger(MAX_INT_ARR, true);
    };
    NativeBigInt.prototype.prev = function () {
        return new NativeBigInt(this.value - BigInt(1));
    }

    var powersOfTwo = [1];
    while (2 * powersOfTwo[powersOfTwo.length - 1] <= BASE) powersOfTwo.push(2 * powersOfTwo[powersOfTwo.length - 1]);
    var powers2Length = powersOfTwo.length, highestPower2 = powersOfTwo[powers2Length - 1];

    function shift_isSmall(n) {
        return Math.abs(n) <= BASE;
    }

    BigInteger.prototype.shiftLeft = function (v) {
        var n = parseValue(v).toJSNumber();
        if (!shift_isSmall(n)) {
            throw new Error(String(n) + " is too large for shifting.");
        }
        if (n < 0) return this.shiftRight(-n);
        var result = this;
        if (result.isZero()) return result;
        while (n >= powers2Length) {
            result = result.multiply(highestPower2);
            n -= powers2Length - 1;
        }
        return result.multiply(powersOfTwo[n]);
    };
    NativeBigInt.prototype.shiftLeft = SmallInteger.prototype.shiftLeft = BigInteger.prototype.shiftLeft;

    BigInteger.prototype.shiftRight = function (v) {
        var remQuo;
        var n = parseValue(v).toJSNumber();
        if (!shift_isSmall(n)) {
            throw new Error(String(n) + " is too large for shifting.");
        }
        if (n < 0) return this.shiftLeft(-n);
        var result = this;
        while (n >= powers2Length) {
            if (result.isZero() || (result.isNegative() && result.isUnit())) return result;
            remQuo = divModAny(result, highestPower2);
            result = remQuo[1].isNegative() ? remQuo[0].prev() : remQuo[0];
            n -= powers2Length - 1;
        }
        remQuo = divModAny(result, powersOfTwo[n]);
        return remQuo[1].isNegative() ? remQuo[0].prev() : remQuo[0];
    };
    NativeBigInt.prototype.shiftRight = SmallInteger.prototype.shiftRight = BigInteger.prototype.shiftRight;

    function bitwise(x, y, fn) {
        y = parseValue(y);
        var xSign = x.isNegative(), ySign = y.isNegative();
        var xRem = xSign ? x.not() : x,
            yRem = ySign ? y.not() : y;
        var xDigit = 0, yDigit = 0;
        var xDivMod = null, yDivMod = null;
        var result = [];
        while (!xRem.isZero() || !yRem.isZero()) {
            xDivMod = divModAny(xRem, highestPower2);
            xDigit = xDivMod[1].toJSNumber();
            if (xSign) {
                xDigit = highestPower2 - 1 - xDigit; // two's complement for negative numbers
            }

            yDivMod = divModAny(yRem, highestPower2);
            yDigit = yDivMod[1].toJSNumber();
            if (ySign) {
                yDigit = highestPower2 - 1 - yDigit; // two's complement for negative numbers
            }

            xRem = xDivMod[0];
            yRem = yDivMod[0];
            result.push(fn(xDigit, yDigit));
        }
        var sum = fn(xSign ? 1 : 0, ySign ? 1 : 0) !== 0 ? bigInt(-1) : bigInt(0);
        for (var i = result.length - 1; i >= 0; i -= 1) {
            sum = sum.multiply(highestPower2).add(bigInt(result[i]));
        }
        return sum;
    }

    BigInteger.prototype.not = function () {
        return this.negate().prev();
    };
    NativeBigInt.prototype.not = SmallInteger.prototype.not = BigInteger.prototype.not;

    BigInteger.prototype.and = function (n) {
        return bitwise(this, n, function (a, b) { return a & b; });
    };
    NativeBigInt.prototype.and = SmallInteger.prototype.and = BigInteger.prototype.and;

    BigInteger.prototype.or = function (n) {
        return bitwise(this, n, function (a, b) { return a | b; });
    };
    NativeBigInt.prototype.or = SmallInteger.prototype.or = BigInteger.prototype.or;

    BigInteger.prototype.xor = function (n) {
        return bitwise(this, n, function (a, b) { return a ^ b; });
    };
    NativeBigInt.prototype.xor = SmallInteger.prototype.xor = BigInteger.prototype.xor;

    var LOBMASK_I = 1 << 30, LOBMASK_BI = (BASE & -BASE) * (BASE & -BASE) | LOBMASK_I;
    function roughLOB(n) { // get lowestOneBit (rough)
        // SmallInteger: return Min(lowestOneBit(n), 1 << 30)
        // BigInteger: return Min(lowestOneBit(n), 1 << 14) [BASE=1e7]
        var v = n.value,
            x = typeof v === "number" ? v | LOBMASK_I :
                typeof v === "bigint" ? v | BigInt(LOBMASK_I) :
                    v[0] + v[1] * BASE | LOBMASK_BI;
        return x & -x;
    }

    function integerLogarithm(value, base) {
        if (base.compareTo(value) <= 0) {
            var tmp = integerLogarithm(value, base.square(base));
            var p = tmp.p;
            var e = tmp.e;
            var t = p.multiply(base);
            return t.compareTo(value) <= 0 ? { p: t, e: e * 2 + 1 } : { p: p, e: e * 2 };
        }
        return { p: bigInt(1), e: 0 };
    }

    BigInteger.prototype.bitLength = function () {
        var n = this;
        if (n.compareTo(bigInt(0)) < 0) {
            n = n.negate().subtract(bigInt(1));
        }
        if (n.compareTo(bigInt(0)) === 0) {
            return bigInt(0);
        }
        return bigInt(integerLogarithm(n, bigInt(2)).e).add(bigInt(1));
    }
    NativeBigInt.prototype.bitLength = SmallInteger.prototype.bitLength = BigInteger.prototype.bitLength;

    function max(a, b) {
        a = parseValue(a);
        b = parseValue(b);
        return a.greater(b) ? a : b;
    }
    function min(a, b) {
        a = parseValue(a);
        b = parseValue(b);
        return a.lesser(b) ? a : b;
    }
    function gcd(a, b) {
        a = parseValue(a).abs();
        b = parseValue(b).abs();
        if (a.equals(b)) return a;
        if (a.isZero()) return b;
        if (b.isZero()) return a;
        var c = Integer[1], d, t;
        while (a.isEven() && b.isEven()) {
            d = min(roughLOB(a), roughLOB(b));
            a = a.divide(d);
            b = b.divide(d);
            c = c.multiply(d);
        }
        while (a.isEven()) {
            a = a.divide(roughLOB(a));
        }
        do {
            while (b.isEven()) {
                b = b.divide(roughLOB(b));
            }
            if (a.greater(b)) {
                t = b; b = a; a = t;
            }
            b = b.subtract(a);
        } while (!b.isZero());
        return c.isUnit() ? a : a.multiply(c);
    }
    function lcm(a, b) {
        a = parseValue(a).abs();
        b = parseValue(b).abs();
        return a.divide(gcd(a, b)).multiply(b);
    }
    function randBetween(a, b, rng) {
        a = parseValue(a);
        b = parseValue(b);
        var usedRNG = rng || Math.random;
        var low = min(a, b), high = max(a, b);
        var range = high.subtract(low).add(1);
        if (range.isSmall) return low.add(Math.floor(usedRNG() * range));
        var digits = toBase(range, BASE).value;
        var result = [], restricted = true;
        for (var i = 0; i < digits.length; i++) {
            var top = restricted ? digits[i] + (i + 1 < digits.length ? digits[i + 1] / BASE : 0) : BASE;
            var digit = truncate(usedRNG() * top);
            result.push(digit);
            if (digit < digits[i]) restricted = false;
        }
        return low.add(Integer.fromArray(result, BASE, false));
    }

    var parseBase = function (text, base, alphabet, caseSensitive) {
        alphabet = alphabet || DEFAULT_ALPHABET;
        text = String(text);
        if (!caseSensitive) {
            text = text.toLowerCase();
            alphabet = alphabet.toLowerCase();
        }
        var length = text.length;
        var i;
        var absBase = Math.abs(base);
        var alphabetValues = {};
        for (i = 0; i < alphabet.length; i++) {
            alphabetValues[alphabet[i]] = i;
        }
        for (i = 0; i < length; i++) {
            var c = text[i];
            if (c === "-") continue;
            if (c in alphabetValues) {
                if (alphabetValues[c] >= absBase) {
                    if (c === "1" && absBase === 1) continue;
                    throw new Error(c + " is not a valid digit in base " + base + ".");
                }
            }
        }
        base = parseValue(base);
        var digits = [];
        var isNegative = text[0] === "-";
        for (i = isNegative ? 1 : 0; i < text.length; i++) {
            var c = text[i];
            if (c in alphabetValues) digits.push(parseValue(alphabetValues[c]));
            else if (c === "<") {
                var start = i;
                do { i++; } while (text[i] !== ">" && i < text.length);
                digits.push(parseValue(text.slice(start + 1, i)));
            }
            else throw new Error(c + " is not a valid character");
        }
        return parseBaseFromArray(digits, base, isNegative);
    };

    function parseBaseFromArray(digits, base, isNegative) {
        var val = Integer[0], pow = Integer[1], i;
        for (i = digits.length - 1; i >= 0; i--) {
            val = val.add(digits[i].times(pow));
            pow = pow.times(base);
        }
        return isNegative ? val.negate() : val;
    }

    function stringify(digit, alphabet) {
        alphabet = alphabet || DEFAULT_ALPHABET;
        if (digit < alphabet.length) {
            return alphabet[digit];
        }
        return "<" + digit + ">";
    }

    function toBase(n, base) {
        base = bigInt(base);
        if (base.isZero()) {
            if (n.isZero()) return { value: [0], isNegative: false };
            throw new Error("Cannot convert nonzero numbers to base 0.");
        }
        if (base.equals(-1)) {
            if (n.isZero()) return { value: [0], isNegative: false };
            if (n.isNegative())
                return {
                    value: [].concat.apply([], Array.apply(null, Array(-n.toJSNumber()))
                        .map(Array.prototype.valueOf, [1, 0])
                    ),
                    isNegative: false
                };

            var arr = Array.apply(null, Array(n.toJSNumber() - 1))
                .map(Array.prototype.valueOf, [0, 1]);
            arr.unshift([1]);
            return {
                value: [].concat.apply([], arr),
                isNegative: false
            };
        }

        var neg = false;
        if (n.isNegative() && base.isPositive()) {
            neg = true;
            n = n.abs();
        }
        if (base.isUnit()) {
            if (n.isZero()) return { value: [0], isNegative: false };

            return {
                value: Array.apply(null, Array(n.toJSNumber()))
                    .map(Number.prototype.valueOf, 1),
                isNegative: neg
            };
        }
        var out = [];
        var left = n, divmod;
        while (left.isNegative() || left.compareAbs(base) >= 0) {
            divmod = left.divmod(base);
            left = divmod.quotient;
            var digit = divmod.remainder;
            if (digit.isNegative()) {
                digit = base.minus(digit).abs();
                left = left.next();
            }
            out.push(digit.toJSNumber());
        }
        out.push(left.toJSNumber());
        return { value: out.reverse(), isNegative: neg };
    }

    function toBaseString(n, base, alphabet) {
        var arr = toBase(n, base);
        return (arr.isNegative ? "-" : "") + arr.value.map(function (x) {
            return stringify(x, alphabet);
        }).join('');
    }

    BigInteger.prototype.toArray = function (radix) {
        return toBase(this, radix);
    };

    SmallInteger.prototype.toArray = function (radix) {
        return toBase(this, radix);
    };

    NativeBigInt.prototype.toArray = function (radix) {
        return toBase(this, radix);
    };

    BigInteger.prototype.toString = function (radix, alphabet) {
        if (radix === undefined) radix = 10;
        if (radix !== 10 || alphabet) return toBaseString(this, radix, alphabet);
        var v = this.value, l = v.length, str = String(v[--l]), zeros = "0000000", digit;
        while (--l >= 0) {
            digit = String(v[l]);
            str += zeros.slice(digit.length) + digit;
        }
        var sign = this.sign ? "-" : "";
        return sign + str;
    };

    SmallInteger.prototype.toString = function (radix, alphabet) {
        if (radix === undefined) radix = 10;
        if (radix != 10 || alphabet) return toBaseString(this, radix, alphabet);
        return String(this.value);
    };

    NativeBigInt.prototype.toString = SmallInteger.prototype.toString;

    NativeBigInt.prototype.toJSON = BigInteger.prototype.toJSON = SmallInteger.prototype.toJSON = function () { return this.toString(); }

    BigInteger.prototype.valueOf = function () {
        return parseInt(this.toString(), 10);
    };
    BigInteger.prototype.toJSNumber = BigInteger.prototype.valueOf;

    SmallInteger.prototype.valueOf = function () {
        return this.value;
    };
    SmallInteger.prototype.toJSNumber = SmallInteger.prototype.valueOf;
    NativeBigInt.prototype.valueOf = NativeBigInt.prototype.toJSNumber = function () {
        return parseInt(this.toString(), 10);
    }

    function parseStringValue(v) {
        if (isPrecise(+v)) {
            var x = +v;
            if (x === truncate(x))
                return supportsNativeBigInt ? new NativeBigInt(BigInt(x)) : new SmallInteger(x);
            throw new Error("Invalid integer: " + v);
        }
        var sign = v[0] === "-";
        if (sign) v = v.slice(1);
        var split = v.split(/e/i);
        if (split.length > 2) throw new Error("Invalid integer: " + split.join("e"));
        if (split.length === 2) {
            var exp = split[1];
            if (exp[0] === "+") exp = exp.slice(1);
            exp = +exp;
            if (exp !== truncate(exp) || !isPrecise(exp)) throw new Error("Invalid integer: " + exp + " is not a valid exponent.");
            var text = split[0];
            var decimalPlace = text.indexOf(".");
            if (decimalPlace >= 0) {
                exp -= text.length - decimalPlace - 1;
                text = text.slice(0, decimalPlace) + text.slice(decimalPlace + 1);
            }
            if (exp < 0) throw new Error("Cannot include negative exponent part for integers");
            text += (new Array(exp + 1)).join("0");
            v = text;
        }
        var isValid = /^([0-9][0-9]*)$/.test(v);
        if (!isValid) throw new Error("Invalid integer: " + v);
        if (supportsNativeBigInt) {
            return new NativeBigInt(BigInt(sign ? "-" + v : v));
        }
        var r = [], max = v.length, l = LOG_BASE, min = max - l;
        while (max > 0) {
            r.push(+v.slice(min, max));
            min -= l;
            if (min < 0) min = 0;
            max -= l;
        }
        trim(r);
        return new BigInteger(r, sign);
    }

    function parseNumberValue(v) {
        if (supportsNativeBigInt) {
            return new NativeBigInt(BigInt(v));
        }
        if (isPrecise(v)) {
            if (v !== truncate(v)) throw new Error(v + " is not an integer.");
            return new SmallInteger(v);
        }
        return parseStringValue(v.toString());
    }

    function parseValue(v) {
        if (typeof v === "number") {
            return parseNumberValue(v);
        }
        if (typeof v === "string") {
            return parseStringValue(v);
        }
        if (typeof v === "bigint") {
            return new NativeBigInt(v);
        }
        return v;
    }
    // Pre-define numbers in range [-999,999]
    for (var i = 0; i < 1000; i++) {
        Integer[i] = parseValue(i);
        if (i > 0) Integer[-i] = parseValue(-i);
    }
    // Backwards compatibility
    Integer.one = Integer[1];
    Integer.zero = Integer[0];
    Integer.minusOne = Integer[-1];
    Integer.max = max;
    Integer.min = min;
    Integer.gcd = gcd;
    Integer.lcm = lcm;
    Integer.isInstance = function (x) { return x instanceof BigInteger || x instanceof SmallInteger || x instanceof NativeBigInt; };
    Integer.randBetween = randBetween;

    Integer.fromArray = function (digits, base, isNegative) {
        return parseBaseFromArray(digits.map(parseValue), parseValue(base || 10), isNegative);
    };

    return Integer;
})();

// Node.js check
if ( true && module.hasOwnProperty("exports")) {
    module.exports = bigInt;
}

//amd check
if (true) {
    !(__WEBPACK_AMD_DEFINE_RESULT__ = (function () {
        return bigInt;
    }).call(exports, __webpack_require__, exports, module),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
}


/***/ }),

/***/ 93628:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var reflectGetProto = __webpack_require__(48648);
var originalGetProto = __webpack_require__(71064);

var getDunderProto = __webpack_require__(7176);

/** @type {import('.')} */
module.exports = reflectGetProto
	? function getProto(O) {
		// @ts-expect-error TS can't narrow inside a closure, for some reason
		return reflectGetProto(O);
	}
	: originalGetProto
		? function getProto(O) {
			if (!O || (typeof O !== 'object' && typeof O !== 'function')) {
				throw new TypeError('getProto: not an object');
			}
			// @ts-expect-error TS can't narrow inside a closure, for some reason
			return originalGetProto(O);
		}
		: getDunderProto
			? function getProto(O) {
				// @ts-expect-error TS can't narrow inside a closure, for some reason
				return getDunderProto(O);
			}
			: null;


/***/ }),

/***/ 94459:
/***/ ((module) => {

"use strict";


/** @type {import('./isNaN')} */
module.exports = Number.isNaN || function isNaN(a) {
	return a !== a;
};


/***/ }),

/***/ 96542:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const { listTables: listTablesApi } = __webpack_require__(3398);
const { queryMagister } = __webpack_require__(12194);

/**
 * Handler para listar tablas de Magister
 * Soporta dos modos:
 * - 'api': Conecta vía API REST intermedia (recomendado)
 * - 'direct': Conecta directamente a Firebird (requiere port forwarding)
 */
module.exports.main = async () => {
    const connectionMode = process.env.MAGISTER_CONNECTION_MODE || 'api';
    
    try {
        if (connectionMode === 'direct') {
            console.log('🔍 [magister-list-tables] Modo: Conexión DIRECTA a Firebird');
            console.log(`🔍 [magister-list-tables] Host: ${process.env.MAGISTER_DB_HOST}:${process.env.MAGISTER_DB_PORT}`);
            
            // Conexión directa a Firebird
            const sql = `
                SELECT RDB$RELATION_NAME as table_name
                FROM RDB$RELATIONS
                WHERE RDB$SYSTEM_FLAG = 0
                ORDER BY RDB$RELATION_NAME
            `;
            const rows = await queryMagister(sql);
            
            return {
                status: true,
                mode: 'direct',
                total: rows.length,
                data: rows,
            };
        } else {
            console.log('🔍 [magister-list-tables] Modo: API REST intermedia');
            console.log(`🔍 [magister-list-tables] URL: ${process.env.MAGISTER_API_URL}`);
            
            // Conexión vía API REST
            const rows = await listTablesApi();
            
            return {
                status: true,
                mode: 'api',
                total: rows.length,
                data: rows,
            };
        }
    } catch (error) {
        console.error(`❌ [magister-list-tables] Error (modo: ${connectionMode}):`, error.message);
        console.error('❌ [magister-list-tables] Stack:', error.stack);
        
        return {
            status: false,
            mode: connectionMode,
            error: {
                message: error.message,
                name: error.name,
                code: error.code,
                errno: error.errno,
                syscall: error.syscall,
                stack: error.stack
            }
        };
    }
};



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
/******/ 			id: moduleId,
/******/ 			loaded: false,
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/node module decorator */
/******/ 	(() => {
/******/ 		__webpack_require__.nmd = (module) => {
/******/ 			module.paths = [];
/******/ 			if (!module.children) module.children = [];
/******/ 			return module;
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module used 'module' so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__(96542);
/******/ 	module.exports = __webpack_exports__;
/******/ 	
/******/ })()
;