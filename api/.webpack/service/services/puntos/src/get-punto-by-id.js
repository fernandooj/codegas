/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./lib/connection-pg.js":
/*!******************************!*\
  !*** ./lib/connection-pg.js ***!
  \******************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const { Pool } = __webpack_require__(/*! pg */ "./node_modules/pg/lib/index.js");
 
const {RDS_HOSTNAME, RDS_DB, RDS_PORT, RDS_USERNAME, RDS_PASSWORD} = process.env;

const poolConection = new Pool({
  host: RDS_HOSTNAME,
  database: RDS_DB,
  port: RDS_PORT,
  user: RDS_USERNAME,
  password: RDS_PASSWORD,
});


module.exports = {poolConection}

/***/ }),

/***/ "./lib/errors/database-error.js":
/*!**************************************!*\
  !*** ./lib/errors/database-error.js ***!
  \**************************************/
/***/ ((module) => {

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


/***/ }),

/***/ "./node_modules/pg-connection-string/index.js":
/*!****************************************************!*\
  !*** ./node_modules/pg-connection-string/index.js ***!
  \****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var url = __webpack_require__(/*! url */ "url")
var fs = __webpack_require__(/*! fs */ "fs")

//Parse method copied from https://github.com/brianc/node-postgres
//Copyright (c) 2010-2014 Brian Carlson (brian.m.carlson@gmail.com)
//MIT License

//parses a connection string
function parse(str) {
  //unix socket
  if (str.charAt(0) === '/') {
    var config = str.split(' ')
    return { host: config[0], database: config[1] }
  }

  // url parse expects spaces encoded as %20
  var result = url.parse(
    / |%[^a-f0-9]|%[a-f0-9][^a-f0-9]/i.test(str) ? encodeURI(str).replace(/\%25(\d\d)/g, '%$1') : str,
    true
  )
  var config = result.query
  for (var k in config) {
    if (Array.isArray(config[k])) {
      config[k] = config[k][config[k].length - 1]
    }
  }

  var auth = (result.auth || ':').split(':')
  config.user = auth[0]
  config.password = auth.splice(1).join(':')

  config.port = result.port
  if (result.protocol == 'socket:') {
    config.host = decodeURI(result.pathname)
    config.database = result.query.db
    config.client_encoding = result.query.encoding
    return config
  }
  if (!config.host) {
    // Only set the host if there is no equivalent query param.
    config.host = result.hostname
  }

  // If the host is missing it might be a URL-encoded path to a socket.
  var pathname = result.pathname
  if (!config.host && pathname && /^%2f/i.test(pathname)) {
    var pathnameSplit = pathname.split('/')
    config.host = decodeURIComponent(pathnameSplit[0])
    pathname = pathnameSplit.splice(1).join('/')
  }
  // result.pathname is not always guaranteed to have a '/' prefix (e.g. relative urls)
  // only strip the slash if it is present.
  if (pathname && pathname.charAt(0) === '/') {
    pathname = pathname.slice(1) || null
  }
  config.database = pathname && decodeURI(pathname)

  if (config.ssl === 'true' || config.ssl === '1') {
    config.ssl = true
  }

  if (config.ssl === '0') {
    config.ssl = false
  }

  if (config.sslcert || config.sslkey || config.sslrootcert || config.sslmode) {
    config.ssl = {}
  }

  if (config.sslcert) {
    config.ssl.cert = fs.readFileSync(config.sslcert).toString()
  }

  if (config.sslkey) {
    config.ssl.key = fs.readFileSync(config.sslkey).toString()
  }

  if (config.sslrootcert) {
    config.ssl.ca = fs.readFileSync(config.sslrootcert).toString()
  }

  switch (config.sslmode) {
    case 'disable': {
      config.ssl = false
      break
    }
    case 'prefer':
    case 'require':
    case 'verify-ca':
    case 'verify-full': {
      break
    }
    case 'no-verify': {
      config.ssl.rejectUnauthorized = false
      break
    }
  }

  return config
}

module.exports = parse

parse.parse = parse


/***/ }),

/***/ "./node_modules/pg-int8/index.js":
/*!***************************************!*\
  !*** ./node_modules/pg-int8/index.js ***!
  \***************************************/
/***/ ((module) => {

"use strict";


// selected so (BASE - 1) * 0x100000000 + 0xffffffff is a safe integer
var BASE = 1000000;

function readInt8(buffer) {
	var high = buffer.readInt32BE(0);
	var low = buffer.readUInt32BE(4);
	var sign = '';

	if (high < 0) {
		high = ~high + (low === 0);
		low = (~low + 1) >>> 0;
		sign = '-';
	}

	var result = '';
	var carry;
	var t;
	var digits;
	var pad;
	var l;
	var i;

	{
		carry = high % BASE;
		high = high / BASE >>> 0;

		t = 0x100000000 * carry + low;
		low = t / BASE >>> 0;
		digits = '' + (t - BASE * low);

		if (low === 0 && high === 0) {
			return sign + digits + result;
		}

		pad = '';
		l = 6 - digits.length;

		for (i = 0; i < l; i++) {
			pad += '0';
		}

		result = pad + digits + result;
	}

	{
		carry = high % BASE;
		high = high / BASE >>> 0;

		t = 0x100000000 * carry + low;
		low = t / BASE >>> 0;
		digits = '' + (t - BASE * low);

		if (low === 0 && high === 0) {
			return sign + digits + result;
		}

		pad = '';
		l = 6 - digits.length;

		for (i = 0; i < l; i++) {
			pad += '0';
		}

		result = pad + digits + result;
	}

	{
		carry = high % BASE;
		high = high / BASE >>> 0;

		t = 0x100000000 * carry + low;
		low = t / BASE >>> 0;
		digits = '' + (t - BASE * low);

		if (low === 0 && high === 0) {
			return sign + digits + result;
		}

		pad = '';
		l = 6 - digits.length;

		for (i = 0; i < l; i++) {
			pad += '0';
		}

		result = pad + digits + result;
	}

	{
		carry = high % BASE;
		t = 0x100000000 * carry + low;
		digits = '' + t % BASE;

		return sign + digits + result;
	}
}

module.exports = readInt8;


/***/ }),

/***/ "./node_modules/pg-pool/index.js":
/*!***************************************!*\
  !*** ./node_modules/pg-pool/index.js ***!
  \***************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

const EventEmitter = (__webpack_require__(/*! events */ "events").EventEmitter)

const NOOP = function () {}

const removeWhere = (list, predicate) => {
  const i = list.findIndex(predicate)

  return i === -1 ? undefined : list.splice(i, 1)[0]
}

class IdleItem {
  constructor(client, idleListener, timeoutId) {
    this.client = client
    this.idleListener = idleListener
    this.timeoutId = timeoutId
  }
}

class PendingItem {
  constructor(callback) {
    this.callback = callback
  }
}

function throwOnDoubleRelease() {
  throw new Error('Release called on client which has already been released to the pool.')
}

function promisify(Promise, callback) {
  if (callback) {
    return { callback: callback, result: undefined }
  }
  let rej
  let res
  const cb = function (err, client) {
    err ? rej(err) : res(client)
  }
  const result = new Promise(function (resolve, reject) {
    res = resolve
    rej = reject
  })
  return { callback: cb, result: result }
}

function makeIdleListener(pool, client) {
  return function idleListener(err) {
    err.client = client

    client.removeListener('error', idleListener)
    client.on('error', () => {
      pool.log('additional client error after disconnection due to error', err)
    })
    pool._remove(client)
    // TODO - document that once the pool emits an error
    // the client has already been closed & purged and is unusable
    pool.emit('error', err, client)
  }
}

class Pool extends EventEmitter {
  constructor(options, Client) {
    super()
    this.options = Object.assign({}, options)

    if (options != null && 'password' in options) {
      // "hiding" the password so it doesn't show up in stack traces
      // or if the client is console.logged
      Object.defineProperty(this.options, 'password', {
        configurable: true,
        enumerable: false,
        writable: true,
        value: options.password,
      })
    }
    if (options != null && options.ssl && options.ssl.key) {
      // "hiding" the ssl->key so it doesn't show up in stack traces
      // or if the client is console.logged
      Object.defineProperty(this.options.ssl, 'key', {
        enumerable: false,
      })
    }

    this.options.max = this.options.max || this.options.poolSize || 10
    this.options.maxUses = this.options.maxUses || Infinity
    this.options.allowExitOnIdle = this.options.allowExitOnIdle || false
    this.options.maxLifetimeSeconds = this.options.maxLifetimeSeconds || 0
    this.log = this.options.log || function () {}
    this.Client = this.options.Client || Client || (__webpack_require__(/*! pg */ "./node_modules/pg/lib/index.js").Client)
    this.Promise = this.options.Promise || global.Promise

    if (typeof this.options.idleTimeoutMillis === 'undefined') {
      this.options.idleTimeoutMillis = 10000
    }

    this._clients = []
    this._idle = []
    this._expired = new WeakSet()
    this._pendingQueue = []
    this._endCallback = undefined
    this.ending = false
    this.ended = false
  }

  _isFull() {
    return this._clients.length >= this.options.max
  }

  _pulseQueue() {
    this.log('pulse queue')
    if (this.ended) {
      this.log('pulse queue ended')
      return
    }
    if (this.ending) {
      this.log('pulse queue on ending')
      if (this._idle.length) {
        this._idle.slice().map((item) => {
          this._remove(item.client)
        })
      }
      if (!this._clients.length) {
        this.ended = true
        this._endCallback()
      }
      return
    }

    // if we don't have any waiting, do nothing
    if (!this._pendingQueue.length) {
      this.log('no queued requests')
      return
    }
    // if we don't have any idle clients and we have no more room do nothing
    if (!this._idle.length && this._isFull()) {
      return
    }
    const pendingItem = this._pendingQueue.shift()
    if (this._idle.length) {
      const idleItem = this._idle.pop()
      clearTimeout(idleItem.timeoutId)
      const client = idleItem.client
      client.ref && client.ref()
      const idleListener = idleItem.idleListener

      return this._acquireClient(client, pendingItem, idleListener, false)
    }
    if (!this._isFull()) {
      return this.newClient(pendingItem)
    }
    throw new Error('unexpected condition')
  }

  _remove(client) {
    const removed = removeWhere(this._idle, (item) => item.client === client)

    if (removed !== undefined) {
      clearTimeout(removed.timeoutId)
    }

    this._clients = this._clients.filter((c) => c !== client)
    client.end()
    this.emit('remove', client)
  }

  connect(cb) {
    if (this.ending) {
      const err = new Error('Cannot use a pool after calling end on the pool')
      return cb ? cb(err) : this.Promise.reject(err)
    }

    const response = promisify(this.Promise, cb)
    const result = response.result

    // if we don't have to connect a new client, don't do so
    if (this._isFull() || this._idle.length) {
      // if we have idle clients schedule a pulse immediately
      if (this._idle.length) {
        process.nextTick(() => this._pulseQueue())
      }

      if (!this.options.connectionTimeoutMillis) {
        this._pendingQueue.push(new PendingItem(response.callback))
        return result
      }

      const queueCallback = (err, res, done) => {
        clearTimeout(tid)
        response.callback(err, res, done)
      }

      const pendingItem = new PendingItem(queueCallback)

      // set connection timeout on checking out an existing client
      const tid = setTimeout(() => {
        // remove the callback from pending waiters because
        // we're going to call it with a timeout error
        removeWhere(this._pendingQueue, (i) => i.callback === queueCallback)
        pendingItem.timedOut = true
        response.callback(new Error('timeout exceeded when trying to connect'))
      }, this.options.connectionTimeoutMillis)

      this._pendingQueue.push(pendingItem)
      return result
    }

    this.newClient(new PendingItem(response.callback))

    return result
  }

  newClient(pendingItem) {
    const client = new this.Client(this.options)
    this._clients.push(client)
    const idleListener = makeIdleListener(this, client)

    this.log('checking client timeout')

    // connection timeout logic
    let tid
    let timeoutHit = false
    if (this.options.connectionTimeoutMillis) {
      tid = setTimeout(() => {
        this.log('ending client due to timeout')
        timeoutHit = true
        // force kill the node driver, and let libpq do its teardown
        client.connection ? client.connection.stream.destroy() : client.end()
      }, this.options.connectionTimeoutMillis)
    }

    this.log('connecting new client')
    client.connect((err) => {
      if (tid) {
        clearTimeout(tid)
      }
      client.on('error', idleListener)
      if (err) {
        this.log('client failed to connect', err)
        // remove the dead client from our list of clients
        this._clients = this._clients.filter((c) => c !== client)
        if (timeoutHit) {
          err.message = 'Connection terminated due to connection timeout'
        }

        // this client won’t be released, so move on immediately
        this._pulseQueue()

        if (!pendingItem.timedOut) {
          pendingItem.callback(err, undefined, NOOP)
        }
      } else {
        this.log('new client connected')

        if (this.options.maxLifetimeSeconds !== 0) {
          const maxLifetimeTimeout = setTimeout(() => {
            this.log('ending client due to expired lifetime')
            this._expired.add(client)
            const idleIndex = this._idle.findIndex((idleItem) => idleItem.client === client)
            if (idleIndex !== -1) {
              this._acquireClient(
                client,
                new PendingItem((err, client, clientRelease) => clientRelease()),
                idleListener,
                false
              )
            }
          }, this.options.maxLifetimeSeconds * 1000)

          maxLifetimeTimeout.unref()
          client.once('end', () => clearTimeout(maxLifetimeTimeout))
        }

        return this._acquireClient(client, pendingItem, idleListener, true)
      }
    })
  }

  // acquire a client for a pending work item
  _acquireClient(client, pendingItem, idleListener, isNew) {
    if (isNew) {
      this.emit('connect', client)
    }

    this.emit('acquire', client)

    client.release = this._releaseOnce(client, idleListener)

    client.removeListener('error', idleListener)

    if (!pendingItem.timedOut) {
      if (isNew && this.options.verify) {
        this.options.verify(client, (err) => {
          if (err) {
            client.release(err)
            return pendingItem.callback(err, undefined, NOOP)
          }

          pendingItem.callback(undefined, client, client.release)
        })
      } else {
        pendingItem.callback(undefined, client, client.release)
      }
    } else {
      if (isNew && this.options.verify) {
        this.options.verify(client, client.release)
      } else {
        client.release()
      }
    }
  }

  // returns a function that wraps _release and throws if called more than once
  _releaseOnce(client, idleListener) {
    let released = false

    return (err) => {
      if (released) {
        throwOnDoubleRelease()
      }

      released = true
      this._release(client, idleListener, err)
    }
  }

  // release a client back to the poll, include an error
  // to remove it from the pool
  _release(client, idleListener, err) {
    client.on('error', idleListener)

    client._poolUseCount = (client._poolUseCount || 0) + 1

    this.emit('release', err, client)

    // TODO(bmc): expose a proper, public interface _queryable and _ending
    if (err || this.ending || !client._queryable || client._ending || client._poolUseCount >= this.options.maxUses) {
      if (client._poolUseCount >= this.options.maxUses) {
        this.log('remove expended client')
      }
      this._remove(client)
      this._pulseQueue()
      return
    }

    const isExpired = this._expired.has(client)
    if (isExpired) {
      this.log('remove expired client')
      this._expired.delete(client)
      this._remove(client)
      this._pulseQueue()
      return
    }

    // idle timeout
    let tid
    if (this.options.idleTimeoutMillis) {
      tid = setTimeout(() => {
        this.log('remove idle client')
        this._remove(client)
      }, this.options.idleTimeoutMillis)

      if (this.options.allowExitOnIdle) {
        // allow Node to exit if this is all that's left
        tid.unref()
      }
    }

    if (this.options.allowExitOnIdle) {
      client.unref()
    }

    this._idle.push(new IdleItem(client, idleListener, tid))
    this._pulseQueue()
  }

  query(text, values, cb) {
    // guard clause against passing a function as the first parameter
    if (typeof text === 'function') {
      const response = promisify(this.Promise, text)
      setImmediate(function () {
        return response.callback(new Error('Passing a function as the first parameter to pool.query is not supported'))
      })
      return response.result
    }

    // allow plain text query without values
    if (typeof values === 'function') {
      cb = values
      values = undefined
    }
    const response = promisify(this.Promise, cb)
    cb = response.callback

    this.connect((err, client) => {
      if (err) {
        return cb(err)
      }

      let clientReleased = false
      const onError = (err) => {
        if (clientReleased) {
          return
        }
        clientReleased = true
        client.release(err)
        cb(err)
      }

      client.once('error', onError)
      this.log('dispatching query')
      try {
        client.query(text, values, (err, res) => {
          this.log('query dispatched')
          client.removeListener('error', onError)
          if (clientReleased) {
            return
          }
          clientReleased = true
          client.release(err)
          if (err) {
            return cb(err)
          }
          return cb(undefined, res)
        })
      } catch (err) {
        client.release(err)
        return cb(err)
      }
    })
    return response.result
  }

  end(cb) {
    this.log('ending')
    if (this.ending) {
      const err = new Error('Called end on pool more than once')
      return cb ? cb(err) : this.Promise.reject(err)
    }
    this.ending = true
    const promised = promisify(this.Promise, cb)
    this._endCallback = promised.callback
    this._pulseQueue()
    return promised.result
  }

  get waitingCount() {
    return this._pendingQueue.length
  }

  get idleCount() {
    return this._idle.length
  }

  get expiredCount() {
    return this._clients.reduce((acc, client) => acc + (this._expired.has(client) ? 1 : 0), 0)
  }

  get totalCount() {
    return this._clients.length
  }
}
module.exports = Pool


/***/ }),

/***/ "./node_modules/pg-protocol/dist/buffer-reader.js":
/*!********************************************************!*\
  !*** ./node_modules/pg-protocol/dist/buffer-reader.js ***!
  \********************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BufferReader = void 0;
const emptyBuffer = Buffer.allocUnsafe(0);
class BufferReader {
    constructor(offset = 0) {
        this.offset = offset;
        this.buffer = emptyBuffer;
        // TODO(bmc): support non-utf8 encoding?
        this.encoding = 'utf-8';
    }
    setBuffer(offset, buffer) {
        this.offset = offset;
        this.buffer = buffer;
    }
    int16() {
        const result = this.buffer.readInt16BE(this.offset);
        this.offset += 2;
        return result;
    }
    byte() {
        const result = this.buffer[this.offset];
        this.offset++;
        return result;
    }
    int32() {
        const result = this.buffer.readInt32BE(this.offset);
        this.offset += 4;
        return result;
    }
    string(length) {
        const result = this.buffer.toString(this.encoding, this.offset, this.offset + length);
        this.offset += length;
        return result;
    }
    cstring() {
        const start = this.offset;
        let end = start;
        while (this.buffer[end++] !== 0) { }
        this.offset = end;
        return this.buffer.toString(this.encoding, start, end - 1);
    }
    bytes(length) {
        const result = this.buffer.slice(this.offset, this.offset + length);
        this.offset += length;
        return result;
    }
}
exports.BufferReader = BufferReader;
//# sourceMappingURL=buffer-reader.js.map

/***/ }),

/***/ "./node_modules/pg-protocol/dist/buffer-writer.js":
/*!********************************************************!*\
  !*** ./node_modules/pg-protocol/dist/buffer-writer.js ***!
  \********************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

//binary data writer tuned for encoding binary specific to the postgres binary protocol
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Writer = void 0;
class Writer {
    constructor(size = 256) {
        this.size = size;
        this.offset = 5;
        this.headerPosition = 0;
        this.buffer = Buffer.allocUnsafe(size);
    }
    ensure(size) {
        var remaining = this.buffer.length - this.offset;
        if (remaining < size) {
            var oldBuffer = this.buffer;
            // exponential growth factor of around ~ 1.5
            // https://stackoverflow.com/questions/2269063/buffer-growth-strategy
            var newSize = oldBuffer.length + (oldBuffer.length >> 1) + size;
            this.buffer = Buffer.allocUnsafe(newSize);
            oldBuffer.copy(this.buffer);
        }
    }
    addInt32(num) {
        this.ensure(4);
        this.buffer[this.offset++] = (num >>> 24) & 0xff;
        this.buffer[this.offset++] = (num >>> 16) & 0xff;
        this.buffer[this.offset++] = (num >>> 8) & 0xff;
        this.buffer[this.offset++] = (num >>> 0) & 0xff;
        return this;
    }
    addInt16(num) {
        this.ensure(2);
        this.buffer[this.offset++] = (num >>> 8) & 0xff;
        this.buffer[this.offset++] = (num >>> 0) & 0xff;
        return this;
    }
    addCString(string) {
        if (!string) {
            this.ensure(1);
        }
        else {
            var len = Buffer.byteLength(string);
            this.ensure(len + 1); // +1 for null terminator
            this.buffer.write(string, this.offset, 'utf-8');
            this.offset += len;
        }
        this.buffer[this.offset++] = 0; // null terminator
        return this;
    }
    addString(string = '') {
        var len = Buffer.byteLength(string);
        this.ensure(len);
        this.buffer.write(string, this.offset);
        this.offset += len;
        return this;
    }
    add(otherBuffer) {
        this.ensure(otherBuffer.length);
        otherBuffer.copy(this.buffer, this.offset);
        this.offset += otherBuffer.length;
        return this;
    }
    join(code) {
        if (code) {
            this.buffer[this.headerPosition] = code;
            //length is everything in this packet minus the code
            const length = this.offset - (this.headerPosition + 1);
            this.buffer.writeInt32BE(length, this.headerPosition + 1);
        }
        return this.buffer.slice(code ? 0 : 5, this.offset);
    }
    flush(code) {
        var result = this.join(code);
        this.offset = 5;
        this.headerPosition = 0;
        this.buffer = Buffer.allocUnsafe(this.size);
        return result;
    }
}
exports.Writer = Writer;
//# sourceMappingURL=buffer-writer.js.map

/***/ }),

/***/ "./node_modules/pg-protocol/dist/index.js":
/*!************************************************!*\
  !*** ./node_modules/pg-protocol/dist/index.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DatabaseError = exports.serialize = exports.parse = void 0;
const messages_1 = __webpack_require__(/*! ./messages */ "./node_modules/pg-protocol/dist/messages.js");
Object.defineProperty(exports, "DatabaseError", ({ enumerable: true, get: function () { return messages_1.DatabaseError; } }));
const serializer_1 = __webpack_require__(/*! ./serializer */ "./node_modules/pg-protocol/dist/serializer.js");
Object.defineProperty(exports, "serialize", ({ enumerable: true, get: function () { return serializer_1.serialize; } }));
const parser_1 = __webpack_require__(/*! ./parser */ "./node_modules/pg-protocol/dist/parser.js");
function parse(stream, callback) {
    const parser = new parser_1.Parser();
    stream.on('data', (buffer) => parser.parse(buffer, callback));
    return new Promise((resolve) => stream.on('end', () => resolve()));
}
exports.parse = parse;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ "./node_modules/pg-protocol/dist/messages.js":
/*!***************************************************!*\
  !*** ./node_modules/pg-protocol/dist/messages.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NoticeMessage = exports.DataRowMessage = exports.CommandCompleteMessage = exports.ReadyForQueryMessage = exports.NotificationResponseMessage = exports.BackendKeyDataMessage = exports.AuthenticationMD5Password = exports.ParameterStatusMessage = exports.ParameterDescriptionMessage = exports.RowDescriptionMessage = exports.Field = exports.CopyResponse = exports.CopyDataMessage = exports.DatabaseError = exports.copyDone = exports.emptyQuery = exports.replicationStart = exports.portalSuspended = exports.noData = exports.closeComplete = exports.bindComplete = exports.parseComplete = void 0;
exports.parseComplete = {
    name: 'parseComplete',
    length: 5,
};
exports.bindComplete = {
    name: 'bindComplete',
    length: 5,
};
exports.closeComplete = {
    name: 'closeComplete',
    length: 5,
};
exports.noData = {
    name: 'noData',
    length: 5,
};
exports.portalSuspended = {
    name: 'portalSuspended',
    length: 5,
};
exports.replicationStart = {
    name: 'replicationStart',
    length: 4,
};
exports.emptyQuery = {
    name: 'emptyQuery',
    length: 4,
};
exports.copyDone = {
    name: 'copyDone',
    length: 4,
};
class DatabaseError extends Error {
    constructor(message, length, name) {
        super(message);
        this.length = length;
        this.name = name;
    }
}
exports.DatabaseError = DatabaseError;
class CopyDataMessage {
    constructor(length, chunk) {
        this.length = length;
        this.chunk = chunk;
        this.name = 'copyData';
    }
}
exports.CopyDataMessage = CopyDataMessage;
class CopyResponse {
    constructor(length, name, binary, columnCount) {
        this.length = length;
        this.name = name;
        this.binary = binary;
        this.columnTypes = new Array(columnCount);
    }
}
exports.CopyResponse = CopyResponse;
class Field {
    constructor(name, tableID, columnID, dataTypeID, dataTypeSize, dataTypeModifier, format) {
        this.name = name;
        this.tableID = tableID;
        this.columnID = columnID;
        this.dataTypeID = dataTypeID;
        this.dataTypeSize = dataTypeSize;
        this.dataTypeModifier = dataTypeModifier;
        this.format = format;
    }
}
exports.Field = Field;
class RowDescriptionMessage {
    constructor(length, fieldCount) {
        this.length = length;
        this.fieldCount = fieldCount;
        this.name = 'rowDescription';
        this.fields = new Array(this.fieldCount);
    }
}
exports.RowDescriptionMessage = RowDescriptionMessage;
class ParameterDescriptionMessage {
    constructor(length, parameterCount) {
        this.length = length;
        this.parameterCount = parameterCount;
        this.name = 'parameterDescription';
        this.dataTypeIDs = new Array(this.parameterCount);
    }
}
exports.ParameterDescriptionMessage = ParameterDescriptionMessage;
class ParameterStatusMessage {
    constructor(length, parameterName, parameterValue) {
        this.length = length;
        this.parameterName = parameterName;
        this.parameterValue = parameterValue;
        this.name = 'parameterStatus';
    }
}
exports.ParameterStatusMessage = ParameterStatusMessage;
class AuthenticationMD5Password {
    constructor(length, salt) {
        this.length = length;
        this.salt = salt;
        this.name = 'authenticationMD5Password';
    }
}
exports.AuthenticationMD5Password = AuthenticationMD5Password;
class BackendKeyDataMessage {
    constructor(length, processID, secretKey) {
        this.length = length;
        this.processID = processID;
        this.secretKey = secretKey;
        this.name = 'backendKeyData';
    }
}
exports.BackendKeyDataMessage = BackendKeyDataMessage;
class NotificationResponseMessage {
    constructor(length, processId, channel, payload) {
        this.length = length;
        this.processId = processId;
        this.channel = channel;
        this.payload = payload;
        this.name = 'notification';
    }
}
exports.NotificationResponseMessage = NotificationResponseMessage;
class ReadyForQueryMessage {
    constructor(length, status) {
        this.length = length;
        this.status = status;
        this.name = 'readyForQuery';
    }
}
exports.ReadyForQueryMessage = ReadyForQueryMessage;
class CommandCompleteMessage {
    constructor(length, text) {
        this.length = length;
        this.text = text;
        this.name = 'commandComplete';
    }
}
exports.CommandCompleteMessage = CommandCompleteMessage;
class DataRowMessage {
    constructor(length, fields) {
        this.length = length;
        this.fields = fields;
        this.name = 'dataRow';
        this.fieldCount = fields.length;
    }
}
exports.DataRowMessage = DataRowMessage;
class NoticeMessage {
    constructor(length, message) {
        this.length = length;
        this.message = message;
        this.name = 'notice';
    }
}
exports.NoticeMessage = NoticeMessage;
//# sourceMappingURL=messages.js.map

/***/ }),

/***/ "./node_modules/pg-protocol/dist/parser.js":
/*!*************************************************!*\
  !*** ./node_modules/pg-protocol/dist/parser.js ***!
  \*************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Parser = void 0;
const messages_1 = __webpack_require__(/*! ./messages */ "./node_modules/pg-protocol/dist/messages.js");
const buffer_reader_1 = __webpack_require__(/*! ./buffer-reader */ "./node_modules/pg-protocol/dist/buffer-reader.js");
const assert_1 = __importDefault(__webpack_require__(/*! assert */ "assert"));
// every message is prefixed with a single bye
const CODE_LENGTH = 1;
// every message has an int32 length which includes itself but does
// NOT include the code in the length
const LEN_LENGTH = 4;
const HEADER_LENGTH = CODE_LENGTH + LEN_LENGTH;
const emptyBuffer = Buffer.allocUnsafe(0);
class Parser {
    constructor(opts) {
        this.buffer = emptyBuffer;
        this.bufferLength = 0;
        this.bufferOffset = 0;
        this.reader = new buffer_reader_1.BufferReader();
        if ((opts === null || opts === void 0 ? void 0 : opts.mode) === 'binary') {
            throw new Error('Binary mode not supported yet');
        }
        this.mode = (opts === null || opts === void 0 ? void 0 : opts.mode) || 'text';
    }
    parse(buffer, callback) {
        this.mergeBuffer(buffer);
        const bufferFullLength = this.bufferOffset + this.bufferLength;
        let offset = this.bufferOffset;
        while (offset + HEADER_LENGTH <= bufferFullLength) {
            // code is 1 byte long - it identifies the message type
            const code = this.buffer[offset];
            // length is 1 Uint32BE - it is the length of the message EXCLUDING the code
            const length = this.buffer.readUInt32BE(offset + CODE_LENGTH);
            const fullMessageLength = CODE_LENGTH + length;
            if (fullMessageLength + offset <= bufferFullLength) {
                const message = this.handlePacket(offset + HEADER_LENGTH, code, length, this.buffer);
                callback(message);
                offset += fullMessageLength;
            }
            else {
                break;
            }
        }
        if (offset === bufferFullLength) {
            // No more use for the buffer
            this.buffer = emptyBuffer;
            this.bufferLength = 0;
            this.bufferOffset = 0;
        }
        else {
            // Adjust the cursors of remainingBuffer
            this.bufferLength = bufferFullLength - offset;
            this.bufferOffset = offset;
        }
    }
    mergeBuffer(buffer) {
        if (this.bufferLength > 0) {
            const newLength = this.bufferLength + buffer.byteLength;
            const newFullLength = newLength + this.bufferOffset;
            if (newFullLength > this.buffer.byteLength) {
                // We can't concat the new buffer with the remaining one
                let newBuffer;
                if (newLength <= this.buffer.byteLength && this.bufferOffset >= this.bufferLength) {
                    // We can move the relevant part to the beginning of the buffer instead of allocating a new buffer
                    newBuffer = this.buffer;
                }
                else {
                    // Allocate a new larger buffer
                    let newBufferLength = this.buffer.byteLength * 2;
                    while (newLength >= newBufferLength) {
                        newBufferLength *= 2;
                    }
                    newBuffer = Buffer.allocUnsafe(newBufferLength);
                }
                // Move the remaining buffer to the new one
                this.buffer.copy(newBuffer, 0, this.bufferOffset, this.bufferOffset + this.bufferLength);
                this.buffer = newBuffer;
                this.bufferOffset = 0;
            }
            // Concat the new buffer with the remaining one
            buffer.copy(this.buffer, this.bufferOffset + this.bufferLength);
            this.bufferLength = newLength;
        }
        else {
            this.buffer = buffer;
            this.bufferOffset = 0;
            this.bufferLength = buffer.byteLength;
        }
    }
    handlePacket(offset, code, length, bytes) {
        switch (code) {
            case 50 /* BindComplete */:
                return messages_1.bindComplete;
            case 49 /* ParseComplete */:
                return messages_1.parseComplete;
            case 51 /* CloseComplete */:
                return messages_1.closeComplete;
            case 110 /* NoData */:
                return messages_1.noData;
            case 115 /* PortalSuspended */:
                return messages_1.portalSuspended;
            case 99 /* CopyDone */:
                return messages_1.copyDone;
            case 87 /* ReplicationStart */:
                return messages_1.replicationStart;
            case 73 /* EmptyQuery */:
                return messages_1.emptyQuery;
            case 68 /* DataRow */:
                return this.parseDataRowMessage(offset, length, bytes);
            case 67 /* CommandComplete */:
                return this.parseCommandCompleteMessage(offset, length, bytes);
            case 90 /* ReadyForQuery */:
                return this.parseReadyForQueryMessage(offset, length, bytes);
            case 65 /* NotificationResponse */:
                return this.parseNotificationMessage(offset, length, bytes);
            case 82 /* AuthenticationResponse */:
                return this.parseAuthenticationResponse(offset, length, bytes);
            case 83 /* ParameterStatus */:
                return this.parseParameterStatusMessage(offset, length, bytes);
            case 75 /* BackendKeyData */:
                return this.parseBackendKeyData(offset, length, bytes);
            case 69 /* ErrorMessage */:
                return this.parseErrorMessage(offset, length, bytes, 'error');
            case 78 /* NoticeMessage */:
                return this.parseErrorMessage(offset, length, bytes, 'notice');
            case 84 /* RowDescriptionMessage */:
                return this.parseRowDescriptionMessage(offset, length, bytes);
            case 116 /* ParameterDescriptionMessage */:
                return this.parseParameterDescriptionMessage(offset, length, bytes);
            case 71 /* CopyIn */:
                return this.parseCopyInMessage(offset, length, bytes);
            case 72 /* CopyOut */:
                return this.parseCopyOutMessage(offset, length, bytes);
            case 100 /* CopyData */:
                return this.parseCopyData(offset, length, bytes);
            default:
                assert_1.default.fail(`unknown message code: ${code.toString(16)}`);
        }
    }
    parseReadyForQueryMessage(offset, length, bytes) {
        this.reader.setBuffer(offset, bytes);
        const status = this.reader.string(1);
        return new messages_1.ReadyForQueryMessage(length, status);
    }
    parseCommandCompleteMessage(offset, length, bytes) {
        this.reader.setBuffer(offset, bytes);
        const text = this.reader.cstring();
        return new messages_1.CommandCompleteMessage(length, text);
    }
    parseCopyData(offset, length, bytes) {
        const chunk = bytes.slice(offset, offset + (length - 4));
        return new messages_1.CopyDataMessage(length, chunk);
    }
    parseCopyInMessage(offset, length, bytes) {
        return this.parseCopyMessage(offset, length, bytes, 'copyInResponse');
    }
    parseCopyOutMessage(offset, length, bytes) {
        return this.parseCopyMessage(offset, length, bytes, 'copyOutResponse');
    }
    parseCopyMessage(offset, length, bytes, messageName) {
        this.reader.setBuffer(offset, bytes);
        const isBinary = this.reader.byte() !== 0;
        const columnCount = this.reader.int16();
        const message = new messages_1.CopyResponse(length, messageName, isBinary, columnCount);
        for (let i = 0; i < columnCount; i++) {
            message.columnTypes[i] = this.reader.int16();
        }
        return message;
    }
    parseNotificationMessage(offset, length, bytes) {
        this.reader.setBuffer(offset, bytes);
        const processId = this.reader.int32();
        const channel = this.reader.cstring();
        const payload = this.reader.cstring();
        return new messages_1.NotificationResponseMessage(length, processId, channel, payload);
    }
    parseRowDescriptionMessage(offset, length, bytes) {
        this.reader.setBuffer(offset, bytes);
        const fieldCount = this.reader.int16();
        const message = new messages_1.RowDescriptionMessage(length, fieldCount);
        for (let i = 0; i < fieldCount; i++) {
            message.fields[i] = this.parseField();
        }
        return message;
    }
    parseField() {
        const name = this.reader.cstring();
        const tableID = this.reader.int32();
        const columnID = this.reader.int16();
        const dataTypeID = this.reader.int32();
        const dataTypeSize = this.reader.int16();
        const dataTypeModifier = this.reader.int32();
        const mode = this.reader.int16() === 0 ? 'text' : 'binary';
        return new messages_1.Field(name, tableID, columnID, dataTypeID, dataTypeSize, dataTypeModifier, mode);
    }
    parseParameterDescriptionMessage(offset, length, bytes) {
        this.reader.setBuffer(offset, bytes);
        const parameterCount = this.reader.int16();
        const message = new messages_1.ParameterDescriptionMessage(length, parameterCount);
        for (let i = 0; i < parameterCount; i++) {
            message.dataTypeIDs[i] = this.reader.int32();
        }
        return message;
    }
    parseDataRowMessage(offset, length, bytes) {
        this.reader.setBuffer(offset, bytes);
        const fieldCount = this.reader.int16();
        const fields = new Array(fieldCount);
        for (let i = 0; i < fieldCount; i++) {
            const len = this.reader.int32();
            // a -1 for length means the value of the field is null
            fields[i] = len === -1 ? null : this.reader.string(len);
        }
        return new messages_1.DataRowMessage(length, fields);
    }
    parseParameterStatusMessage(offset, length, bytes) {
        this.reader.setBuffer(offset, bytes);
        const name = this.reader.cstring();
        const value = this.reader.cstring();
        return new messages_1.ParameterStatusMessage(length, name, value);
    }
    parseBackendKeyData(offset, length, bytes) {
        this.reader.setBuffer(offset, bytes);
        const processID = this.reader.int32();
        const secretKey = this.reader.int32();
        return new messages_1.BackendKeyDataMessage(length, processID, secretKey);
    }
    parseAuthenticationResponse(offset, length, bytes) {
        this.reader.setBuffer(offset, bytes);
        const code = this.reader.int32();
        // TODO(bmc): maybe better types here
        const message = {
            name: 'authenticationOk',
            length,
        };
        switch (code) {
            case 0: // AuthenticationOk
                break;
            case 3: // AuthenticationCleartextPassword
                if (message.length === 8) {
                    message.name = 'authenticationCleartextPassword';
                }
                break;
            case 5: // AuthenticationMD5Password
                if (message.length === 12) {
                    message.name = 'authenticationMD5Password';
                    const salt = this.reader.bytes(4);
                    return new messages_1.AuthenticationMD5Password(length, salt);
                }
                break;
            case 10: // AuthenticationSASL
                message.name = 'authenticationSASL';
                message.mechanisms = [];
                let mechanism;
                do {
                    mechanism = this.reader.cstring();
                    if (mechanism) {
                        message.mechanisms.push(mechanism);
                    }
                } while (mechanism);
                break;
            case 11: // AuthenticationSASLContinue
                message.name = 'authenticationSASLContinue';
                message.data = this.reader.string(length - 8);
                break;
            case 12: // AuthenticationSASLFinal
                message.name = 'authenticationSASLFinal';
                message.data = this.reader.string(length - 8);
                break;
            default:
                throw new Error('Unknown authenticationOk message type ' + code);
        }
        return message;
    }
    parseErrorMessage(offset, length, bytes, name) {
        this.reader.setBuffer(offset, bytes);
        const fields = {};
        let fieldType = this.reader.string(1);
        while (fieldType !== '\0') {
            fields[fieldType] = this.reader.cstring();
            fieldType = this.reader.string(1);
        }
        const messageValue = fields.M;
        const message = name === 'notice' ? new messages_1.NoticeMessage(length, messageValue) : new messages_1.DatabaseError(messageValue, length, name);
        message.severity = fields.S;
        message.code = fields.C;
        message.detail = fields.D;
        message.hint = fields.H;
        message.position = fields.P;
        message.internalPosition = fields.p;
        message.internalQuery = fields.q;
        message.where = fields.W;
        message.schema = fields.s;
        message.table = fields.t;
        message.column = fields.c;
        message.dataType = fields.d;
        message.constraint = fields.n;
        message.file = fields.F;
        message.line = fields.L;
        message.routine = fields.R;
        return message;
    }
}
exports.Parser = Parser;
//# sourceMappingURL=parser.js.map

/***/ }),

/***/ "./node_modules/pg-protocol/dist/serializer.js":
/*!*****************************************************!*\
  !*** ./node_modules/pg-protocol/dist/serializer.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.serialize = void 0;
const buffer_writer_1 = __webpack_require__(/*! ./buffer-writer */ "./node_modules/pg-protocol/dist/buffer-writer.js");
const writer = new buffer_writer_1.Writer();
const startup = (opts) => {
    // protocol version
    writer.addInt16(3).addInt16(0);
    for (const key of Object.keys(opts)) {
        writer.addCString(key).addCString(opts[key]);
    }
    writer.addCString('client_encoding').addCString('UTF8');
    var bodyBuffer = writer.addCString('').flush();
    // this message is sent without a code
    var length = bodyBuffer.length + 4;
    return new buffer_writer_1.Writer().addInt32(length).add(bodyBuffer).flush();
};
const requestSsl = () => {
    const response = Buffer.allocUnsafe(8);
    response.writeInt32BE(8, 0);
    response.writeInt32BE(80877103, 4);
    return response;
};
const password = (password) => {
    return writer.addCString(password).flush(112 /* startup */);
};
const sendSASLInitialResponseMessage = function (mechanism, initialResponse) {
    // 0x70 = 'p'
    writer.addCString(mechanism).addInt32(Buffer.byteLength(initialResponse)).addString(initialResponse);
    return writer.flush(112 /* startup */);
};
const sendSCRAMClientFinalMessage = function (additionalData) {
    return writer.addString(additionalData).flush(112 /* startup */);
};
const query = (text) => {
    return writer.addCString(text).flush(81 /* query */);
};
const emptyArray = [];
const parse = (query) => {
    // expect something like this:
    // { name: 'queryName',
    //   text: 'select * from blah',
    //   types: ['int8', 'bool'] }
    // normalize missing query names to allow for null
    const name = query.name || '';
    if (name.length > 63) {
        /* eslint-disable no-console */
        console.error('Warning! Postgres only supports 63 characters for query names.');
        console.error('You supplied %s (%s)', name, name.length);
        console.error('This can cause conflicts and silent errors executing queries');
        /* eslint-enable no-console */
    }
    const types = query.types || emptyArray;
    var len = types.length;
    var buffer = writer
        .addCString(name) // name of query
        .addCString(query.text) // actual query text
        .addInt16(len);
    for (var i = 0; i < len; i++) {
        buffer.addInt32(types[i]);
    }
    return writer.flush(80 /* parse */);
};
const paramWriter = new buffer_writer_1.Writer();
const writeValues = function (values, valueMapper) {
    for (let i = 0; i < values.length; i++) {
        const mappedVal = valueMapper ? valueMapper(values[i], i) : values[i];
        if (mappedVal == null) {
            // add the param type (string) to the writer
            writer.addInt16(0 /* STRING */);
            // write -1 to the param writer to indicate null
            paramWriter.addInt32(-1);
        }
        else if (mappedVal instanceof Buffer) {
            // add the param type (binary) to the writer
            writer.addInt16(1 /* BINARY */);
            // add the buffer to the param writer
            paramWriter.addInt32(mappedVal.length);
            paramWriter.add(mappedVal);
        }
        else {
            // add the param type (string) to the writer
            writer.addInt16(0 /* STRING */);
            paramWriter.addInt32(Buffer.byteLength(mappedVal));
            paramWriter.addString(mappedVal);
        }
    }
};
const bind = (config = {}) => {
    // normalize config
    const portal = config.portal || '';
    const statement = config.statement || '';
    const binary = config.binary || false;
    const values = config.values || emptyArray;
    const len = values.length;
    writer.addCString(portal).addCString(statement);
    writer.addInt16(len);
    writeValues(values, config.valueMapper);
    writer.addInt16(len);
    writer.add(paramWriter.flush());
    // format code
    writer.addInt16(binary ? 1 /* BINARY */ : 0 /* STRING */);
    return writer.flush(66 /* bind */);
};
const emptyExecute = Buffer.from([69 /* execute */, 0x00, 0x00, 0x00, 0x09, 0x00, 0x00, 0x00, 0x00, 0x00]);
const execute = (config) => {
    // this is the happy path for most queries
    if (!config || (!config.portal && !config.rows)) {
        return emptyExecute;
    }
    const portal = config.portal || '';
    const rows = config.rows || 0;
    const portalLength = Buffer.byteLength(portal);
    const len = 4 + portalLength + 1 + 4;
    // one extra bit for code
    const buff = Buffer.allocUnsafe(1 + len);
    buff[0] = 69 /* execute */;
    buff.writeInt32BE(len, 1);
    buff.write(portal, 5, 'utf-8');
    buff[portalLength + 5] = 0; // null terminate portal cString
    buff.writeUInt32BE(rows, buff.length - 4);
    return buff;
};
const cancel = (processID, secretKey) => {
    const buffer = Buffer.allocUnsafe(16);
    buffer.writeInt32BE(16, 0);
    buffer.writeInt16BE(1234, 4);
    buffer.writeInt16BE(5678, 6);
    buffer.writeInt32BE(processID, 8);
    buffer.writeInt32BE(secretKey, 12);
    return buffer;
};
const cstringMessage = (code, string) => {
    const stringLen = Buffer.byteLength(string);
    const len = 4 + stringLen + 1;
    // one extra bit for code
    const buffer = Buffer.allocUnsafe(1 + len);
    buffer[0] = code;
    buffer.writeInt32BE(len, 1);
    buffer.write(string, 5, 'utf-8');
    buffer[len] = 0; // null terminate cString
    return buffer;
};
const emptyDescribePortal = writer.addCString('P').flush(68 /* describe */);
const emptyDescribeStatement = writer.addCString('S').flush(68 /* describe */);
const describe = (msg) => {
    return msg.name
        ? cstringMessage(68 /* describe */, `${msg.type}${msg.name || ''}`)
        : msg.type === 'P'
            ? emptyDescribePortal
            : emptyDescribeStatement;
};
const close = (msg) => {
    const text = `${msg.type}${msg.name || ''}`;
    return cstringMessage(67 /* close */, text);
};
const copyData = (chunk) => {
    return writer.add(chunk).flush(100 /* copyFromChunk */);
};
const copyFail = (message) => {
    return cstringMessage(102 /* copyFail */, message);
};
const codeOnlyBuffer = (code) => Buffer.from([code, 0x00, 0x00, 0x00, 0x04]);
const flushBuffer = codeOnlyBuffer(72 /* flush */);
const syncBuffer = codeOnlyBuffer(83 /* sync */);
const endBuffer = codeOnlyBuffer(88 /* end */);
const copyDoneBuffer = codeOnlyBuffer(99 /* copyDone */);
const serialize = {
    startup,
    password,
    requestSsl,
    sendSASLInitialResponseMessage,
    sendSCRAMClientFinalMessage,
    query,
    parse,
    bind,
    execute,
    describe,
    close,
    flush: () => flushBuffer,
    sync: () => syncBuffer,
    end: () => endBuffer,
    copyData,
    copyDone: () => copyDoneBuffer,
    copyFail,
    cancel,
};
exports.serialize = serialize;
//# sourceMappingURL=serializer.js.map

/***/ }),

/***/ "./node_modules/pg-types/index.js":
/*!****************************************!*\
  !*** ./node_modules/pg-types/index.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

var textParsers = __webpack_require__(/*! ./lib/textParsers */ "./node_modules/pg-types/lib/textParsers.js");
var binaryParsers = __webpack_require__(/*! ./lib/binaryParsers */ "./node_modules/pg-types/lib/binaryParsers.js");
var arrayParser = __webpack_require__(/*! ./lib/arrayParser */ "./node_modules/pg-types/lib/arrayParser.js");
var builtinTypes = __webpack_require__(/*! ./lib/builtins */ "./node_modules/pg-types/lib/builtins.js");

exports.getTypeParser = getTypeParser;
exports.setTypeParser = setTypeParser;
exports.arrayParser = arrayParser;
exports.builtins = builtinTypes;

var typeParsers = {
  text: {},
  binary: {}
};

//the empty parse function
function noParse (val) {
  return String(val);
};

//returns a function used to convert a specific type (specified by
//oid) into a result javascript type
//note: the oid can be obtained via the following sql query:
//SELECT oid FROM pg_type WHERE typname = 'TYPE_NAME_HERE';
function getTypeParser (oid, format) {
  format = format || 'text';
  if (!typeParsers[format]) {
    return noParse;
  }
  return typeParsers[format][oid] || noParse;
};

function setTypeParser (oid, format, parseFn) {
  if(typeof format == 'function') {
    parseFn = format;
    format = 'text';
  }
  typeParsers[format][oid] = parseFn;
};

textParsers.init(function(oid, converter) {
  typeParsers.text[oid] = converter;
});

binaryParsers.init(function(oid, converter) {
  typeParsers.binary[oid] = converter;
});


/***/ }),

/***/ "./node_modules/pg-types/lib/arrayParser.js":
/*!**************************************************!*\
  !*** ./node_modules/pg-types/lib/arrayParser.js ***!
  \**************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var array = __webpack_require__(/*! postgres-array */ "./node_modules/postgres-array/index.js");

module.exports = {
  create: function (source, transform) {
    return {
      parse: function() {
        return array.parse(source, transform);
      }
    };
  }
};


/***/ }),

/***/ "./node_modules/pg-types/lib/binaryParsers.js":
/*!****************************************************!*\
  !*** ./node_modules/pg-types/lib/binaryParsers.js ***!
  \****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var parseInt64 = __webpack_require__(/*! pg-int8 */ "./node_modules/pg-int8/index.js");

var parseBits = function(data, bits, offset, invert, callback) {
  offset = offset || 0;
  invert = invert || false;
  callback = callback || function(lastValue, newValue, bits) { return (lastValue * Math.pow(2, bits)) + newValue; };
  var offsetBytes = offset >> 3;

  var inv = function(value) {
    if (invert) {
      return ~value & 0xff;
    }

    return value;
  };

  // read first (maybe partial) byte
  var mask = 0xff;
  var firstBits = 8 - (offset % 8);
  if (bits < firstBits) {
    mask = (0xff << (8 - bits)) & 0xff;
    firstBits = bits;
  }

  if (offset) {
    mask = mask >> (offset % 8);
  }

  var result = 0;
  if ((offset % 8) + bits >= 8) {
    result = callback(0, inv(data[offsetBytes]) & mask, firstBits);
  }

  // read bytes
  var bytes = (bits + offset) >> 3;
  for (var i = offsetBytes + 1; i < bytes; i++) {
    result = callback(result, inv(data[i]), 8);
  }

  // bits to read, that are not a complete byte
  var lastBits = (bits + offset) % 8;
  if (lastBits > 0) {
    result = callback(result, inv(data[bytes]) >> (8 - lastBits), lastBits);
  }

  return result;
};

var parseFloatFromBits = function(data, precisionBits, exponentBits) {
  var bias = Math.pow(2, exponentBits - 1) - 1;
  var sign = parseBits(data, 1);
  var exponent = parseBits(data, exponentBits, 1);

  if (exponent === 0) {
    return 0;
  }

  // parse mantissa
  var precisionBitsCounter = 1;
  var parsePrecisionBits = function(lastValue, newValue, bits) {
    if (lastValue === 0) {
      lastValue = 1;
    }

    for (var i = 1; i <= bits; i++) {
      precisionBitsCounter /= 2;
      if ((newValue & (0x1 << (bits - i))) > 0) {
        lastValue += precisionBitsCounter;
      }
    }

    return lastValue;
  };

  var mantissa = parseBits(data, precisionBits, exponentBits + 1, false, parsePrecisionBits);

  // special cases
  if (exponent == (Math.pow(2, exponentBits + 1) - 1)) {
    if (mantissa === 0) {
      return (sign === 0) ? Infinity : -Infinity;
    }

    return NaN;
  }

  // normale number
  return ((sign === 0) ? 1 : -1) * Math.pow(2, exponent - bias) * mantissa;
};

var parseInt16 = function(value) {
  if (parseBits(value, 1) == 1) {
    return -1 * (parseBits(value, 15, 1, true) + 1);
  }

  return parseBits(value, 15, 1);
};

var parseInt32 = function(value) {
  if (parseBits(value, 1) == 1) {
    return -1 * (parseBits(value, 31, 1, true) + 1);
  }

  return parseBits(value, 31, 1);
};

var parseFloat32 = function(value) {
  return parseFloatFromBits(value, 23, 8);
};

var parseFloat64 = function(value) {
  return parseFloatFromBits(value, 52, 11);
};

var parseNumeric = function(value) {
  var sign = parseBits(value, 16, 32);
  if (sign == 0xc000) {
    return NaN;
  }

  var weight = Math.pow(10000, parseBits(value, 16, 16));
  var result = 0;

  var digits = [];
  var ndigits = parseBits(value, 16);
  for (var i = 0; i < ndigits; i++) {
    result += parseBits(value, 16, 64 + (16 * i)) * weight;
    weight /= 10000;
  }

  var scale = Math.pow(10, parseBits(value, 16, 48));
  return ((sign === 0) ? 1 : -1) * Math.round(result * scale) / scale;
};

var parseDate = function(isUTC, value) {
  var sign = parseBits(value, 1);
  var rawValue = parseBits(value, 63, 1);

  // discard usecs and shift from 2000 to 1970
  var result = new Date((((sign === 0) ? 1 : -1) * rawValue / 1000) + 946684800000);

  if (!isUTC) {
    result.setTime(result.getTime() + result.getTimezoneOffset() * 60000);
  }

  // add microseconds to the date
  result.usec = rawValue % 1000;
  result.getMicroSeconds = function() {
    return this.usec;
  };
  result.setMicroSeconds = function(value) {
    this.usec = value;
  };
  result.getUTCMicroSeconds = function() {
    return this.usec;
  };

  return result;
};

var parseArray = function(value) {
  var dim = parseBits(value, 32);

  var flags = parseBits(value, 32, 32);
  var elementType = parseBits(value, 32, 64);

  var offset = 96;
  var dims = [];
  for (var i = 0; i < dim; i++) {
    // parse dimension
    dims[i] = parseBits(value, 32, offset);
    offset += 32;

    // ignore lower bounds
    offset += 32;
  }

  var parseElement = function(elementType) {
    // parse content length
    var length = parseBits(value, 32, offset);
    offset += 32;

    // parse null values
    if (length == 0xffffffff) {
      return null;
    }

    var result;
    if ((elementType == 0x17) || (elementType == 0x14)) {
      // int/bigint
      result = parseBits(value, length * 8, offset);
      offset += length * 8;
      return result;
    }
    else if (elementType == 0x19) {
      // string
      result = value.toString(this.encoding, offset >> 3, (offset += (length << 3)) >> 3);
      return result;
    }
    else {
      console.log("ERROR: ElementType not implemented: " + elementType);
    }
  };

  var parse = function(dimension, elementType) {
    var array = [];
    var i;

    if (dimension.length > 1) {
      var count = dimension.shift();
      for (i = 0; i < count; i++) {
        array[i] = parse(dimension, elementType);
      }
      dimension.unshift(count);
    }
    else {
      for (i = 0; i < dimension[0]; i++) {
        array[i] = parseElement(elementType);
      }
    }

    return array;
  };

  return parse(dims, elementType);
};

var parseText = function(value) {
  return value.toString('utf8');
};

var parseBool = function(value) {
  if(value === null) return null;
  return (parseBits(value, 8) > 0);
};

var init = function(register) {
  register(20, parseInt64);
  register(21, parseInt16);
  register(23, parseInt32);
  register(26, parseInt32);
  register(1700, parseNumeric);
  register(700, parseFloat32);
  register(701, parseFloat64);
  register(16, parseBool);
  register(1114, parseDate.bind(null, false));
  register(1184, parseDate.bind(null, true));
  register(1000, parseArray);
  register(1007, parseArray);
  register(1016, parseArray);
  register(1008, parseArray);
  register(1009, parseArray);
  register(25, parseText);
};

module.exports = {
  init: init
};


/***/ }),

/***/ "./node_modules/pg-types/lib/builtins.js":
/*!***********************************************!*\
  !*** ./node_modules/pg-types/lib/builtins.js ***!
  \***********************************************/
/***/ ((module) => {

/**
 * Following query was used to generate this file:

 SELECT json_object_agg(UPPER(PT.typname), PT.oid::int4 ORDER BY pt.oid)
 FROM pg_type PT
 WHERE typnamespace = (SELECT pgn.oid FROM pg_namespace pgn WHERE nspname = 'pg_catalog') -- Take only builting Postgres types with stable OID (extension types are not guaranted to be stable)
 AND typtype = 'b' -- Only basic types
 AND typelem = 0 -- Ignore aliases
 AND typisdefined -- Ignore undefined types
 */

module.exports = {
    BOOL: 16,
    BYTEA: 17,
    CHAR: 18,
    INT8: 20,
    INT2: 21,
    INT4: 23,
    REGPROC: 24,
    TEXT: 25,
    OID: 26,
    TID: 27,
    XID: 28,
    CID: 29,
    JSON: 114,
    XML: 142,
    PG_NODE_TREE: 194,
    SMGR: 210,
    PATH: 602,
    POLYGON: 604,
    CIDR: 650,
    FLOAT4: 700,
    FLOAT8: 701,
    ABSTIME: 702,
    RELTIME: 703,
    TINTERVAL: 704,
    CIRCLE: 718,
    MACADDR8: 774,
    MONEY: 790,
    MACADDR: 829,
    INET: 869,
    ACLITEM: 1033,
    BPCHAR: 1042,
    VARCHAR: 1043,
    DATE: 1082,
    TIME: 1083,
    TIMESTAMP: 1114,
    TIMESTAMPTZ: 1184,
    INTERVAL: 1186,
    TIMETZ: 1266,
    BIT: 1560,
    VARBIT: 1562,
    NUMERIC: 1700,
    REFCURSOR: 1790,
    REGPROCEDURE: 2202,
    REGOPER: 2203,
    REGOPERATOR: 2204,
    REGCLASS: 2205,
    REGTYPE: 2206,
    UUID: 2950,
    TXID_SNAPSHOT: 2970,
    PG_LSN: 3220,
    PG_NDISTINCT: 3361,
    PG_DEPENDENCIES: 3402,
    TSVECTOR: 3614,
    TSQUERY: 3615,
    GTSVECTOR: 3642,
    REGCONFIG: 3734,
    REGDICTIONARY: 3769,
    JSONB: 3802,
    REGNAMESPACE: 4089,
    REGROLE: 4096
};


/***/ }),

/***/ "./node_modules/pg-types/lib/textParsers.js":
/*!**************************************************!*\
  !*** ./node_modules/pg-types/lib/textParsers.js ***!
  \**************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var array = __webpack_require__(/*! postgres-array */ "./node_modules/postgres-array/index.js")
var arrayParser = __webpack_require__(/*! ./arrayParser */ "./node_modules/pg-types/lib/arrayParser.js");
var parseDate = __webpack_require__(/*! postgres-date */ "./node_modules/postgres-date/index.js");
var parseInterval = __webpack_require__(/*! postgres-interval */ "./node_modules/postgres-interval/index.js");
var parseByteA = __webpack_require__(/*! postgres-bytea */ "./node_modules/postgres-bytea/index.js");

function allowNull (fn) {
  return function nullAllowed (value) {
    if (value === null) return value
    return fn(value)
  }
}

function parseBool (value) {
  if (value === null) return value
  return value === 'TRUE' ||
    value === 't' ||
    value === 'true' ||
    value === 'y' ||
    value === 'yes' ||
    value === 'on' ||
    value === '1';
}

function parseBoolArray (value) {
  if (!value) return null
  return array.parse(value, parseBool)
}

function parseBaseTenInt (string) {
  return parseInt(string, 10)
}

function parseIntegerArray (value) {
  if (!value) return null
  return array.parse(value, allowNull(parseBaseTenInt))
}

function parseBigIntegerArray (value) {
  if (!value) return null
  return array.parse(value, allowNull(function (entry) {
    return parseBigInteger(entry).trim()
  }))
}

var parsePointArray = function(value) {
  if(!value) { return null; }
  var p = arrayParser.create(value, function(entry) {
    if(entry !== null) {
      entry = parsePoint(entry);
    }
    return entry;
  });

  return p.parse();
};

var parseFloatArray = function(value) {
  if(!value) { return null; }
  var p = arrayParser.create(value, function(entry) {
    if(entry !== null) {
      entry = parseFloat(entry);
    }
    return entry;
  });

  return p.parse();
};

var parseStringArray = function(value) {
  if(!value) { return null; }

  var p = arrayParser.create(value);
  return p.parse();
};

var parseDateArray = function(value) {
  if (!value) { return null; }

  var p = arrayParser.create(value, function(entry) {
    if (entry !== null) {
      entry = parseDate(entry);
    }
    return entry;
  });

  return p.parse();
};

var parseIntervalArray = function(value) {
  if (!value) { return null; }

  var p = arrayParser.create(value, function(entry) {
    if (entry !== null) {
      entry = parseInterval(entry);
    }
    return entry;
  });

  return p.parse();
};

var parseByteAArray = function(value) {
  if (!value) { return null; }

  return array.parse(value, allowNull(parseByteA));
};

var parseInteger = function(value) {
  return parseInt(value, 10);
};

var parseBigInteger = function(value) {
  var valStr = String(value);
  if (/^\d+$/.test(valStr)) { return valStr; }
  return value;
};

var parseJsonArray = function(value) {
  if (!value) { return null; }

  return array.parse(value, allowNull(JSON.parse));
};

var parsePoint = function(value) {
  if (value[0] !== '(') { return null; }

  value = value.substring( 1, value.length - 1 ).split(',');

  return {
    x: parseFloat(value[0])
  , y: parseFloat(value[1])
  };
};

var parseCircle = function(value) {
  if (value[0] !== '<' && value[1] !== '(') { return null; }

  var point = '(';
  var radius = '';
  var pointParsed = false;
  for (var i = 2; i < value.length - 1; i++){
    if (!pointParsed) {
      point += value[i];
    }

    if (value[i] === ')') {
      pointParsed = true;
      continue;
    } else if (!pointParsed) {
      continue;
    }

    if (value[i] === ','){
      continue;
    }

    radius += value[i];
  }
  var result = parsePoint(point);
  result.radius = parseFloat(radius);

  return result;
};

var init = function(register) {
  register(20, parseBigInteger); // int8
  register(21, parseInteger); // int2
  register(23, parseInteger); // int4
  register(26, parseInteger); // oid
  register(700, parseFloat); // float4/real
  register(701, parseFloat); // float8/double
  register(16, parseBool);
  register(1082, parseDate); // date
  register(1114, parseDate); // timestamp without timezone
  register(1184, parseDate); // timestamp
  register(600, parsePoint); // point
  register(651, parseStringArray); // cidr[]
  register(718, parseCircle); // circle
  register(1000, parseBoolArray);
  register(1001, parseByteAArray);
  register(1005, parseIntegerArray); // _int2
  register(1007, parseIntegerArray); // _int4
  register(1028, parseIntegerArray); // oid[]
  register(1016, parseBigIntegerArray); // _int8
  register(1017, parsePointArray); // point[]
  register(1021, parseFloatArray); // _float4
  register(1022, parseFloatArray); // _float8
  register(1231, parseFloatArray); // _numeric
  register(1014, parseStringArray); //char
  register(1015, parseStringArray); //varchar
  register(1008, parseStringArray);
  register(1009, parseStringArray);
  register(1040, parseStringArray); // macaddr[]
  register(1041, parseStringArray); // inet[]
  register(1115, parseDateArray); // timestamp without time zone[]
  register(1182, parseDateArray); // _date
  register(1185, parseDateArray); // timestamp with time zone[]
  register(1186, parseInterval);
  register(1187, parseIntervalArray);
  register(17, parseByteA);
  register(114, JSON.parse.bind(JSON)); // json
  register(3802, JSON.parse.bind(JSON)); // jsonb
  register(199, parseJsonArray); // json[]
  register(3807, parseJsonArray); // jsonb[]
  register(3907, parseStringArray); // numrange[]
  register(2951, parseStringArray); // uuid[]
  register(791, parseStringArray); // money[]
  register(1183, parseStringArray); // time[]
  register(1270, parseStringArray); // timetz[]
};

module.exports = {
  init: init
};


/***/ }),

/***/ "./node_modules/pg/lib/client.js":
/*!***************************************!*\
  !*** ./node_modules/pg/lib/client.js ***!
  \***************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var EventEmitter = (__webpack_require__(/*! events */ "events").EventEmitter)
var utils = __webpack_require__(/*! ./utils */ "./node_modules/pg/lib/utils.js")
var sasl = __webpack_require__(/*! ./sasl */ "./node_modules/pg/lib/sasl.js")
var pgPass = __webpack_require__(/*! pgpass */ "./node_modules/pgpass/lib/index.js")
var TypeOverrides = __webpack_require__(/*! ./type-overrides */ "./node_modules/pg/lib/type-overrides.js")

var ConnectionParameters = __webpack_require__(/*! ./connection-parameters */ "./node_modules/pg/lib/connection-parameters.js")
var Query = __webpack_require__(/*! ./query */ "./node_modules/pg/lib/query.js")
var defaults = __webpack_require__(/*! ./defaults */ "./node_modules/pg/lib/defaults.js")
var Connection = __webpack_require__(/*! ./connection */ "./node_modules/pg/lib/connection.js")

class Client extends EventEmitter {
  constructor(config) {
    super()

    this.connectionParameters = new ConnectionParameters(config)
    this.user = this.connectionParameters.user
    this.database = this.connectionParameters.database
    this.port = this.connectionParameters.port
    this.host = this.connectionParameters.host

    // "hiding" the password so it doesn't show up in stack traces
    // or if the client is console.logged
    Object.defineProperty(this, 'password', {
      configurable: true,
      enumerable: false,
      writable: true,
      value: this.connectionParameters.password,
    })

    this.replication = this.connectionParameters.replication

    var c = config || {}

    this._Promise = c.Promise || global.Promise
    this._types = new TypeOverrides(c.types)
    this._ending = false
    this._ended = false
    this._connecting = false
    this._connected = false
    this._connectionError = false
    this._queryable = true

    this.connection =
      c.connection ||
      new Connection({
        stream: c.stream,
        ssl: this.connectionParameters.ssl,
        keepAlive: c.keepAlive || false,
        keepAliveInitialDelayMillis: c.keepAliveInitialDelayMillis || 0,
        encoding: this.connectionParameters.client_encoding || 'utf8',
      })
    this.queryQueue = []
    this.binary = c.binary || defaults.binary
    this.processID = null
    this.secretKey = null
    this.ssl = this.connectionParameters.ssl || false
    // As with Password, make SSL->Key (the private key) non-enumerable.
    // It won't show up in stack traces
    // or if the client is console.logged
    if (this.ssl && this.ssl.key) {
      Object.defineProperty(this.ssl, 'key', {
        enumerable: false,
      })
    }

    this._connectionTimeoutMillis = c.connectionTimeoutMillis || 0
  }

  _errorAllQueries(err) {
    const enqueueError = (query) => {
      process.nextTick(() => {
        query.handleError(err, this.connection)
      })
    }

    if (this.activeQuery) {
      enqueueError(this.activeQuery)
      this.activeQuery = null
    }

    this.queryQueue.forEach(enqueueError)
    this.queryQueue.length = 0
  }

  _connect(callback) {
    var self = this
    var con = this.connection
    this._connectionCallback = callback

    if (this._connecting || this._connected) {
      const err = new Error('Client has already been connected. You cannot reuse a client.')
      process.nextTick(() => {
        callback(err)
      })
      return
    }
    this._connecting = true

    this.connectionTimeoutHandle
    if (this._connectionTimeoutMillis > 0) {
      this.connectionTimeoutHandle = setTimeout(() => {
        con._ending = true
        con.stream.destroy(new Error('timeout expired'))
      }, this._connectionTimeoutMillis)
    }

    if (this.host && this.host.indexOf('/') === 0) {
      con.connect(this.host + '/.s.PGSQL.' + this.port)
    } else {
      con.connect(this.port, this.host)
    }

    // once connection is established send startup message
    con.on('connect', function () {
      if (self.ssl) {
        con.requestSsl()
      } else {
        con.startup(self.getStartupConf())
      }
    })

    con.on('sslconnect', function () {
      con.startup(self.getStartupConf())
    })

    this._attachListeners(con)

    con.once('end', () => {
      const error = this._ending ? new Error('Connection terminated') : new Error('Connection terminated unexpectedly')

      clearTimeout(this.connectionTimeoutHandle)
      this._errorAllQueries(error)
      this._ended = true

      if (!this._ending) {
        // if the connection is ended without us calling .end()
        // on this client then we have an unexpected disconnection
        // treat this as an error unless we've already emitted an error
        // during connection.
        if (this._connecting && !this._connectionError) {
          if (this._connectionCallback) {
            this._connectionCallback(error)
          } else {
            this._handleErrorEvent(error)
          }
        } else if (!this._connectionError) {
          this._handleErrorEvent(error)
        }
      }

      process.nextTick(() => {
        this.emit('end')
      })
    })
  }

  connect(callback) {
    if (callback) {
      this._connect(callback)
      return
    }

    return new this._Promise((resolve, reject) => {
      this._connect((error) => {
        if (error) {
          reject(error)
        } else {
          resolve()
        }
      })
    })
  }

  _attachListeners(con) {
    // password request handling
    con.on('authenticationCleartextPassword', this._handleAuthCleartextPassword.bind(this))
    // password request handling
    con.on('authenticationMD5Password', this._handleAuthMD5Password.bind(this))
    // password request handling (SASL)
    con.on('authenticationSASL', this._handleAuthSASL.bind(this))
    con.on('authenticationSASLContinue', this._handleAuthSASLContinue.bind(this))
    con.on('authenticationSASLFinal', this._handleAuthSASLFinal.bind(this))
    con.on('backendKeyData', this._handleBackendKeyData.bind(this))
    con.on('error', this._handleErrorEvent.bind(this))
    con.on('errorMessage', this._handleErrorMessage.bind(this))
    con.on('readyForQuery', this._handleReadyForQuery.bind(this))
    con.on('notice', this._handleNotice.bind(this))
    con.on('rowDescription', this._handleRowDescription.bind(this))
    con.on('dataRow', this._handleDataRow.bind(this))
    con.on('portalSuspended', this._handlePortalSuspended.bind(this))
    con.on('emptyQuery', this._handleEmptyQuery.bind(this))
    con.on('commandComplete', this._handleCommandComplete.bind(this))
    con.on('parseComplete', this._handleParseComplete.bind(this))
    con.on('copyInResponse', this._handleCopyInResponse.bind(this))
    con.on('copyData', this._handleCopyData.bind(this))
    con.on('notification', this._handleNotification.bind(this))
  }

  // TODO(bmc): deprecate pgpass "built in" integration since this.password can be a function
  // it can be supplied by the user if required - this is a breaking change!
  _checkPgPass(cb) {
    const con = this.connection
    if (typeof this.password === 'function') {
      this._Promise
        .resolve()
        .then(() => this.password())
        .then((pass) => {
          if (pass !== undefined) {
            if (typeof pass !== 'string') {
              con.emit('error', new TypeError('Password must be a string'))
              return
            }
            this.connectionParameters.password = this.password = pass
          } else {
            this.connectionParameters.password = this.password = null
          }
          cb()
        })
        .catch((err) => {
          con.emit('error', err)
        })
    } else if (this.password !== null) {
      cb()
    } else {
      pgPass(this.connectionParameters, (pass) => {
        if (undefined !== pass) {
          this.connectionParameters.password = this.password = pass
        }
        cb()
      })
    }
  }

  _handleAuthCleartextPassword(msg) {
    this._checkPgPass(() => {
      this.connection.password(this.password)
    })
  }

  _handleAuthMD5Password(msg) {
    this._checkPgPass(() => {
      const hashedPassword = utils.postgresMd5PasswordHash(this.user, this.password, msg.salt)
      this.connection.password(hashedPassword)
    })
  }

  _handleAuthSASL(msg) {
    this._checkPgPass(() => {
      try {
        this.saslSession = sasl.startSession(msg.mechanisms)
        this.connection.sendSASLInitialResponseMessage(this.saslSession.mechanism, this.saslSession.response)
      } catch (err) {
        this.connection.emit('error', err)
      }
    })
  }

  _handleAuthSASLContinue(msg) {
    try {
      sasl.continueSession(this.saslSession, this.password, msg.data)
      this.connection.sendSCRAMClientFinalMessage(this.saslSession.response)
    } catch (err) {
      this.connection.emit('error', err)
    }
  }

  _handleAuthSASLFinal(msg) {
    try {
      sasl.finalizeSession(this.saslSession, msg.data)
      this.saslSession = null
    } catch (err) {
      this.connection.emit('error', err)
    }
  }

  _handleBackendKeyData(msg) {
    this.processID = msg.processID
    this.secretKey = msg.secretKey
  }

  _handleReadyForQuery(msg) {
    if (this._connecting) {
      this._connecting = false
      this._connected = true
      clearTimeout(this.connectionTimeoutHandle)

      // process possible callback argument to Client#connect
      if (this._connectionCallback) {
        this._connectionCallback(null, this)
        // remove callback for proper error handling
        // after the connect event
        this._connectionCallback = null
      }
      this.emit('connect')
    }
    const { activeQuery } = this
    this.activeQuery = null
    this.readyForQuery = true
    if (activeQuery) {
      activeQuery.handleReadyForQuery(this.connection)
    }
    this._pulseQueryQueue()
  }

  // if we receieve an error event or error message
  // during the connection process we handle it here
  _handleErrorWhileConnecting(err) {
    if (this._connectionError) {
      // TODO(bmc): this is swallowing errors - we shouldn't do this
      return
    }
    this._connectionError = true
    clearTimeout(this.connectionTimeoutHandle)
    if (this._connectionCallback) {
      return this._connectionCallback(err)
    }
    this.emit('error', err)
  }

  // if we're connected and we receive an error event from the connection
  // this means the socket is dead - do a hard abort of all queries and emit
  // the socket error on the client as well
  _handleErrorEvent(err) {
    if (this._connecting) {
      return this._handleErrorWhileConnecting(err)
    }
    this._queryable = false
    this._errorAllQueries(err)
    this.emit('error', err)
  }

  // handle error messages from the postgres backend
  _handleErrorMessage(msg) {
    if (this._connecting) {
      return this._handleErrorWhileConnecting(msg)
    }
    const activeQuery = this.activeQuery

    if (!activeQuery) {
      this._handleErrorEvent(msg)
      return
    }

    this.activeQuery = null
    activeQuery.handleError(msg, this.connection)
  }

  _handleRowDescription(msg) {
    // delegate rowDescription to active query
    this.activeQuery.handleRowDescription(msg)
  }

  _handleDataRow(msg) {
    // delegate dataRow to active query
    this.activeQuery.handleDataRow(msg)
  }

  _handlePortalSuspended(msg) {
    // delegate portalSuspended to active query
    this.activeQuery.handlePortalSuspended(this.connection)
  }

  _handleEmptyQuery(msg) {
    // delegate emptyQuery to active query
    this.activeQuery.handleEmptyQuery(this.connection)
  }

  _handleCommandComplete(msg) {
    // delegate commandComplete to active query
    this.activeQuery.handleCommandComplete(msg, this.connection)
  }

  _handleParseComplete(msg) {
    // if a prepared statement has a name and properly parses
    // we track that its already been executed so we don't parse
    // it again on the same client
    if (this.activeQuery.name) {
      this.connection.parsedStatements[this.activeQuery.name] = this.activeQuery.text
    }
  }

  _handleCopyInResponse(msg) {
    this.activeQuery.handleCopyInResponse(this.connection)
  }

  _handleCopyData(msg) {
    this.activeQuery.handleCopyData(msg, this.connection)
  }

  _handleNotification(msg) {
    this.emit('notification', msg)
  }

  _handleNotice(msg) {
    this.emit('notice', msg)
  }

  getStartupConf() {
    var params = this.connectionParameters

    var data = {
      user: params.user,
      database: params.database,
    }

    var appName = params.application_name || params.fallback_application_name
    if (appName) {
      data.application_name = appName
    }
    if (params.replication) {
      data.replication = '' + params.replication
    }
    if (params.statement_timeout) {
      data.statement_timeout = String(parseInt(params.statement_timeout, 10))
    }
    if (params.lock_timeout) {
      data.lock_timeout = String(parseInt(params.lock_timeout, 10))
    }
    if (params.idle_in_transaction_session_timeout) {
      data.idle_in_transaction_session_timeout = String(parseInt(params.idle_in_transaction_session_timeout, 10))
    }
    if (params.options) {
      data.options = params.options
    }

    return data
  }

  cancel(client, query) {
    if (client.activeQuery === query) {
      var con = this.connection

      if (this.host && this.host.indexOf('/') === 0) {
        con.connect(this.host + '/.s.PGSQL.' + this.port)
      } else {
        con.connect(this.port, this.host)
      }

      // once connection is established send cancel message
      con.on('connect', function () {
        con.cancel(client.processID, client.secretKey)
      })
    } else if (client.queryQueue.indexOf(query) !== -1) {
      client.queryQueue.splice(client.queryQueue.indexOf(query), 1)
    }
  }

  setTypeParser(oid, format, parseFn) {
    return this._types.setTypeParser(oid, format, parseFn)
  }

  getTypeParser(oid, format) {
    return this._types.getTypeParser(oid, format)
  }

  // Ported from PostgreSQL 9.2.4 source code in src/interfaces/libpq/fe-exec.c
  escapeIdentifier(str) {
    return '"' + str.replace(/"/g, '""') + '"'
  }

  // Ported from PostgreSQL 9.2.4 source code in src/interfaces/libpq/fe-exec.c
  escapeLiteral(str) {
    var hasBackslash = false
    var escaped = "'"

    for (var i = 0; i < str.length; i++) {
      var c = str[i]
      if (c === "'") {
        escaped += c + c
      } else if (c === '\\') {
        escaped += c + c
        hasBackslash = true
      } else {
        escaped += c
      }
    }

    escaped += "'"

    if (hasBackslash === true) {
      escaped = ' E' + escaped
    }

    return escaped
  }

  _pulseQueryQueue() {
    if (this.readyForQuery === true) {
      this.activeQuery = this.queryQueue.shift()
      if (this.activeQuery) {
        this.readyForQuery = false
        this.hasExecuted = true

        const queryError = this.activeQuery.submit(this.connection)
        if (queryError) {
          process.nextTick(() => {
            this.activeQuery.handleError(queryError, this.connection)
            this.readyForQuery = true
            this._pulseQueryQueue()
          })
        }
      } else if (this.hasExecuted) {
        this.activeQuery = null
        this.emit('drain')
      }
    }
  }

  query(config, values, callback) {
    // can take in strings, config object or query object
    var query
    var result
    var readTimeout
    var readTimeoutTimer
    var queryCallback

    if (config === null || config === undefined) {
      throw new TypeError('Client was passed a null or undefined query')
    } else if (typeof config.submit === 'function') {
      readTimeout = config.query_timeout || this.connectionParameters.query_timeout
      result = query = config
      if (typeof values === 'function') {
        query.callback = query.callback || values
      }
    } else {
      readTimeout = this.connectionParameters.query_timeout
      query = new Query(config, values, callback)
      if (!query.callback) {
        result = new this._Promise((resolve, reject) => {
          query.callback = (err, res) => (err ? reject(err) : resolve(res))
        })
      }
    }

    if (readTimeout) {
      queryCallback = query.callback

      readTimeoutTimer = setTimeout(() => {
        var error = new Error('Query read timeout')

        process.nextTick(() => {
          query.handleError(error, this.connection)
        })

        queryCallback(error)

        // we already returned an error,
        // just do nothing if query completes
        query.callback = () => {}

        // Remove from queue
        var index = this.queryQueue.indexOf(query)
        if (index > -1) {
          this.queryQueue.splice(index, 1)
        }

        this._pulseQueryQueue()
      }, readTimeout)

      query.callback = (err, res) => {
        clearTimeout(readTimeoutTimer)
        queryCallback(err, res)
      }
    }

    if (this.binary && !query.binary) {
      query.binary = true
    }

    if (query._result && !query._result._types) {
      query._result._types = this._types
    }

    if (!this._queryable) {
      process.nextTick(() => {
        query.handleError(new Error('Client has encountered a connection error and is not queryable'), this.connection)
      })
      return result
    }

    if (this._ending) {
      process.nextTick(() => {
        query.handleError(new Error('Client was closed and is not queryable'), this.connection)
      })
      return result
    }

    this.queryQueue.push(query)
    this._pulseQueryQueue()
    return result
  }

  ref() {
    this.connection.ref()
  }

  unref() {
    this.connection.unref()
  }

  end(cb) {
    this._ending = true

    // if we have never connected, then end is a noop, callback immediately
    if (!this.connection._connecting || this._ended) {
      if (cb) {
        cb()
      } else {
        return this._Promise.resolve()
      }
    }

    if (this.activeQuery || !this._queryable) {
      // if we have an active query we need to force a disconnect
      // on the socket - otherwise a hung query could block end forever
      this.connection.stream.destroy()
    } else {
      this.connection.end()
    }

    if (cb) {
      this.connection.once('end', cb)
    } else {
      return new this._Promise((resolve) => {
        this.connection.once('end', resolve)
      })
    }
  }
}

// expose a Query constructor
Client.Query = Query

module.exports = Client


/***/ }),

/***/ "./node_modules/pg/lib/connection-parameters.js":
/*!******************************************************!*\
  !*** ./node_modules/pg/lib/connection-parameters.js ***!
  \******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var dns = __webpack_require__(/*! dns */ "dns")

var defaults = __webpack_require__(/*! ./defaults */ "./node_modules/pg/lib/defaults.js")

var parse = (__webpack_require__(/*! pg-connection-string */ "./node_modules/pg-connection-string/index.js").parse) // parses a connection string

var val = function (key, config, envVar) {
  if (envVar === undefined) {
    envVar = process.env['PG' + key.toUpperCase()]
  } else if (envVar === false) {
    // do nothing ... use false
  } else {
    envVar = process.env[envVar]
  }

  return config[key] || envVar || defaults[key]
}

var readSSLConfigFromEnvironment = function () {
  switch (process.env.PGSSLMODE) {
    case 'disable':
      return false
    case 'prefer':
    case 'require':
    case 'verify-ca':
    case 'verify-full':
      return true
    case 'no-verify':
      return { rejectUnauthorized: false }
  }
  return defaults.ssl
}

// Convert arg to a string, surround in single quotes, and escape single quotes and backslashes
var quoteParamValue = function (value) {
  return "'" + ('' + value).replace(/\\/g, '\\\\').replace(/'/g, "\\'") + "'"
}

var add = function (params, config, paramName) {
  var value = config[paramName]
  if (value !== undefined && value !== null) {
    params.push(paramName + '=' + quoteParamValue(value))
  }
}

class ConnectionParameters {
  constructor(config) {
    // if a string is passed, it is a raw connection string so we parse it into a config
    config = typeof config === 'string' ? parse(config) : config || {}

    // if the config has a connectionString defined, parse IT into the config we use
    // this will override other default values with what is stored in connectionString
    if (config.connectionString) {
      config = Object.assign({}, config, parse(config.connectionString))
    }

    this.user = val('user', config)
    this.database = val('database', config)

    if (this.database === undefined) {
      this.database = this.user
    }

    this.port = parseInt(val('port', config), 10)
    this.host = val('host', config)

    // "hiding" the password so it doesn't show up in stack traces
    // or if the client is console.logged
    Object.defineProperty(this, 'password', {
      configurable: true,
      enumerable: false,
      writable: true,
      value: val('password', config),
    })

    this.binary = val('binary', config)
    this.options = val('options', config)

    this.ssl = typeof config.ssl === 'undefined' ? readSSLConfigFromEnvironment() : config.ssl

    if (typeof this.ssl === 'string') {
      if (this.ssl === 'true') {
        this.ssl = true
      }
    }
    // support passing in ssl=no-verify via connection string
    if (this.ssl === 'no-verify') {
      this.ssl = { rejectUnauthorized: false }
    }
    if (this.ssl && this.ssl.key) {
      Object.defineProperty(this.ssl, 'key', {
        enumerable: false,
      })
    }

    this.client_encoding = val('client_encoding', config)
    this.replication = val('replication', config)
    // a domain socket begins with '/'
    this.isDomainSocket = !(this.host || '').indexOf('/')

    this.application_name = val('application_name', config, 'PGAPPNAME')
    this.fallback_application_name = val('fallback_application_name', config, false)
    this.statement_timeout = val('statement_timeout', config, false)
    this.lock_timeout = val('lock_timeout', config, false)
    this.idle_in_transaction_session_timeout = val('idle_in_transaction_session_timeout', config, false)
    this.query_timeout = val('query_timeout', config, false)

    if (config.connectionTimeoutMillis === undefined) {
      this.connect_timeout = process.env.PGCONNECT_TIMEOUT || 0
    } else {
      this.connect_timeout = Math.floor(config.connectionTimeoutMillis / 1000)
    }

    if (config.keepAlive === false) {
      this.keepalives = 0
    } else if (config.keepAlive === true) {
      this.keepalives = 1
    }

    if (typeof config.keepAliveInitialDelayMillis === 'number') {
      this.keepalives_idle = Math.floor(config.keepAliveInitialDelayMillis / 1000)
    }
  }

  getLibpqConnectionString(cb) {
    var params = []
    add(params, this, 'user')
    add(params, this, 'password')
    add(params, this, 'port')
    add(params, this, 'application_name')
    add(params, this, 'fallback_application_name')
    add(params, this, 'connect_timeout')
    add(params, this, 'options')

    var ssl = typeof this.ssl === 'object' ? this.ssl : this.ssl ? { sslmode: this.ssl } : {}
    add(params, ssl, 'sslmode')
    add(params, ssl, 'sslca')
    add(params, ssl, 'sslkey')
    add(params, ssl, 'sslcert')
    add(params, ssl, 'sslrootcert')

    if (this.database) {
      params.push('dbname=' + quoteParamValue(this.database))
    }
    if (this.replication) {
      params.push('replication=' + quoteParamValue(this.replication))
    }
    if (this.host) {
      params.push('host=' + quoteParamValue(this.host))
    }
    if (this.isDomainSocket) {
      return cb(null, params.join(' '))
    }
    if (this.client_encoding) {
      params.push('client_encoding=' + quoteParamValue(this.client_encoding))
    }
    dns.lookup(this.host, function (err, address) {
      if (err) return cb(err, null)
      params.push('hostaddr=' + quoteParamValue(address))
      return cb(null, params.join(' '))
    })
  }
}

module.exports = ConnectionParameters


/***/ }),

/***/ "./node_modules/pg/lib/connection.js":
/*!*******************************************!*\
  !*** ./node_modules/pg/lib/connection.js ***!
  \*******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var net = __webpack_require__(/*! net */ "net")
var EventEmitter = (__webpack_require__(/*! events */ "events").EventEmitter)

const { parse, serialize } = __webpack_require__(/*! pg-protocol */ "./node_modules/pg-protocol/dist/index.js")

const flushBuffer = serialize.flush()
const syncBuffer = serialize.sync()
const endBuffer = serialize.end()

// TODO(bmc) support binary mode at some point
class Connection extends EventEmitter {
  constructor(config) {
    super()
    config = config || {}

    this.stream = config.stream || new net.Socket()
    if (typeof this.stream === 'function') {
      this.stream = this.stream(config)
    }

    this._keepAlive = config.keepAlive
    this._keepAliveInitialDelayMillis = config.keepAliveInitialDelayMillis
    this.lastBuffer = false
    this.parsedStatements = {}
    this.ssl = config.ssl || false
    this._ending = false
    this._emitMessage = false
    var self = this
    this.on('newListener', function (eventName) {
      if (eventName === 'message') {
        self._emitMessage = true
      }
    })
  }

  connect(port, host) {
    var self = this

    this._connecting = true
    this.stream.setNoDelay(true)
    this.stream.connect(port, host)

    this.stream.once('connect', function () {
      if (self._keepAlive) {
        self.stream.setKeepAlive(true, self._keepAliveInitialDelayMillis)
      }
      self.emit('connect')
    })

    const reportStreamError = function (error) {
      // errors about disconnections should be ignored during disconnect
      if (self._ending && (error.code === 'ECONNRESET' || error.code === 'EPIPE')) {
        return
      }
      self.emit('error', error)
    }
    this.stream.on('error', reportStreamError)

    this.stream.on('close', function () {
      self.emit('end')
    })

    if (!this.ssl) {
      return this.attachListeners(this.stream)
    }

    this.stream.once('data', function (buffer) {
      var responseCode = buffer.toString('utf8')
      switch (responseCode) {
        case 'S': // Server supports SSL connections, continue with a secure connection
          break
        case 'N': // Server does not support SSL connections
          self.stream.end()
          return self.emit('error', new Error('The server does not support SSL connections'))
        default:
          // Any other response byte, including 'E' (ErrorResponse) indicating a server error
          self.stream.end()
          return self.emit('error', new Error('There was an error establishing an SSL connection'))
      }
      var tls = __webpack_require__(/*! tls */ "tls")
      const options = {
        socket: self.stream,
      }

      if (self.ssl !== true) {
        Object.assign(options, self.ssl)

        if ('key' in self.ssl) {
          options.key = self.ssl.key
        }
      }

      if (net.isIP(host) === 0) {
        options.servername = host
      }
      try {
        self.stream = tls.connect(options)
      } catch (err) {
        return self.emit('error', err)
      }
      self.attachListeners(self.stream)
      self.stream.on('error', reportStreamError)

      self.emit('sslconnect')
    })
  }

  attachListeners(stream) {
    parse(stream, (msg) => {
      var eventName = msg.name === 'error' ? 'errorMessage' : msg.name
      if (this._emitMessage) {
        this.emit('message', msg)
      }
      this.emit(eventName, msg)
    })
  }

  requestSsl() {
    this.stream.write(serialize.requestSsl())
  }

  startup(config) {
    this.stream.write(serialize.startup(config))
  }

  cancel(processID, secretKey) {
    this._send(serialize.cancel(processID, secretKey))
  }

  password(password) {
    this._send(serialize.password(password))
  }

  sendSASLInitialResponseMessage(mechanism, initialResponse) {
    this._send(serialize.sendSASLInitialResponseMessage(mechanism, initialResponse))
  }

  sendSCRAMClientFinalMessage(additionalData) {
    this._send(serialize.sendSCRAMClientFinalMessage(additionalData))
  }

  _send(buffer) {
    if (!this.stream.writable) {
      return false
    }
    return this.stream.write(buffer)
  }

  query(text) {
    this._send(serialize.query(text))
  }

  // send parse message
  parse(query) {
    this._send(serialize.parse(query))
  }

  // send bind message
  bind(config) {
    this._send(serialize.bind(config))
  }

  // send execute message
  execute(config) {
    this._send(serialize.execute(config))
  }

  flush() {
    if (this.stream.writable) {
      this.stream.write(flushBuffer)
    }
  }

  sync() {
    this._ending = true
    this._send(syncBuffer)
  }

  ref() {
    this.stream.ref()
  }

  unref() {
    this.stream.unref()
  }

  end() {
    // 0x58 = 'X'
    this._ending = true
    if (!this._connecting || !this.stream.writable) {
      this.stream.end()
      return
    }
    return this.stream.write(endBuffer, () => {
      this.stream.end()
    })
  }

  close(msg) {
    this._send(serialize.close(msg))
  }

  describe(msg) {
    this._send(serialize.describe(msg))
  }

  sendCopyFromChunk(chunk) {
    this._send(serialize.copyData(chunk))
  }

  endCopyFrom() {
    this._send(serialize.copyDone())
  }

  sendCopyFail(msg) {
    this._send(serialize.copyFail(msg))
  }
}

module.exports = Connection


/***/ }),

/***/ "./node_modules/pg/lib/defaults.js":
/*!*****************************************!*\
  !*** ./node_modules/pg/lib/defaults.js ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


module.exports = {
  // database host. defaults to localhost
  host: 'localhost',

  // database user's name
  user: process.platform === 'win32' ? process.env.USERNAME : process.env.USER,

  // name of database to connect
  database: undefined,

  // database user's password
  password: null,

  // a Postgres connection string to be used instead of setting individual connection items
  // NOTE:  Setting this value will cause it to override any other value (such as database or user) defined
  // in the defaults object.
  connectionString: undefined,

  // database port
  port: 5432,

  // number of rows to return at a time from a prepared statement's
  // portal. 0 will return all rows at once
  rows: 0,

  // binary result mode
  binary: false,

  // Connection pool options - see https://github.com/brianc/node-pg-pool

  // number of connections to use in connection pool
  // 0 will disable connection pooling
  max: 10,

  // max milliseconds a client can go unused before it is removed
  // from the pool and destroyed
  idleTimeoutMillis: 30000,

  client_encoding: '',

  ssl: false,

  application_name: undefined,

  fallback_application_name: undefined,

  options: undefined,

  parseInputDatesAsUTC: false,

  // max milliseconds any query using this connection will execute for before timing out in error.
  // false=unlimited
  statement_timeout: false,

  // Abort any statement that waits longer than the specified duration in milliseconds while attempting to acquire a lock.
  // false=unlimited
  lock_timeout: false,

  // Terminate any session with an open transaction that has been idle for longer than the specified duration in milliseconds
  // false=unlimited
  idle_in_transaction_session_timeout: false,

  // max milliseconds to wait for query to complete (client side)
  query_timeout: false,

  connect_timeout: 0,

  keepalives: 1,

  keepalives_idle: 0,
}

var pgTypes = __webpack_require__(/*! pg-types */ "./node_modules/pg-types/index.js")
// save default parsers
var parseBigInteger = pgTypes.getTypeParser(20, 'text')
var parseBigIntegerArray = pgTypes.getTypeParser(1016, 'text')

// parse int8 so you can get your count values as actual numbers
module.exports.__defineSetter__('parseInt8', function (val) {
  pgTypes.setTypeParser(20, 'text', val ? pgTypes.getTypeParser(23, 'text') : parseBigInteger)
  pgTypes.setTypeParser(1016, 'text', val ? pgTypes.getTypeParser(1007, 'text') : parseBigIntegerArray)
})


/***/ }),

/***/ "./node_modules/pg/lib/index.js":
/*!**************************************!*\
  !*** ./node_modules/pg/lib/index.js ***!
  \**************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var Client = __webpack_require__(/*! ./client */ "./node_modules/pg/lib/client.js")
var defaults = __webpack_require__(/*! ./defaults */ "./node_modules/pg/lib/defaults.js")
var Connection = __webpack_require__(/*! ./connection */ "./node_modules/pg/lib/connection.js")
var Pool = __webpack_require__(/*! pg-pool */ "./node_modules/pg-pool/index.js")
const { DatabaseError } = __webpack_require__(/*! pg-protocol */ "./node_modules/pg-protocol/dist/index.js")

const poolFactory = (Client) => {
  return class BoundPool extends Pool {
    constructor(options) {
      super(options, Client)
    }
  }
}

var PG = function (clientConstructor) {
  this.defaults = defaults
  this.Client = clientConstructor
  this.Query = this.Client.Query
  this.Pool = poolFactory(this.Client)
  this._pools = []
  this.Connection = Connection
  this.types = __webpack_require__(/*! pg-types */ "./node_modules/pg-types/index.js")
  this.DatabaseError = DatabaseError
}

if (typeof process.env.NODE_PG_FORCE_NATIVE !== 'undefined') {
  module.exports = new PG(__webpack_require__(/*! ./native */ "./node_modules/pg/lib/native/index.js"))
} else {
  module.exports = new PG(Client)

  // lazy require native module...the native module may not have installed
  Object.defineProperty(module.exports, "native", ({
    configurable: true,
    enumerable: false,
    get() {
      var native = null
      try {
        native = new PG(__webpack_require__(/*! ./native */ "./node_modules/pg/lib/native/index.js"))
      } catch (err) {
        if (err.code !== 'MODULE_NOT_FOUND') {
          throw err
        }
      }

      // overwrite module.exports.native so that getter is never called again
      Object.defineProperty(module.exports, "native", ({
        value: native,
      }))

      return native
    },
  }))
}


/***/ }),

/***/ "./node_modules/pg/lib/native/client.js":
/*!**********************************************!*\
  !*** ./node_modules/pg/lib/native/client.js ***!
  \**********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


// eslint-disable-next-line
var Native = __webpack_require__(/*! pg-native */ "pg-native")
var TypeOverrides = __webpack_require__(/*! ../type-overrides */ "./node_modules/pg/lib/type-overrides.js")
var EventEmitter = (__webpack_require__(/*! events */ "events").EventEmitter)
var util = __webpack_require__(/*! util */ "util")
var ConnectionParameters = __webpack_require__(/*! ../connection-parameters */ "./node_modules/pg/lib/connection-parameters.js")

var NativeQuery = __webpack_require__(/*! ./query */ "./node_modules/pg/lib/native/query.js")

var Client = (module.exports = function (config) {
  EventEmitter.call(this)
  config = config || {}

  this._Promise = config.Promise || global.Promise
  this._types = new TypeOverrides(config.types)

  this.native = new Native({
    types: this._types,
  })

  this._queryQueue = []
  this._ending = false
  this._connecting = false
  this._connected = false
  this._queryable = true

  // keep these on the object for legacy reasons
  // for the time being. TODO: deprecate all this jazz
  var cp = (this.connectionParameters = new ConnectionParameters(config))
  this.user = cp.user

  // "hiding" the password so it doesn't show up in stack traces
  // or if the client is console.logged
  Object.defineProperty(this, 'password', {
    configurable: true,
    enumerable: false,
    writable: true,
    value: cp.password,
  })
  this.database = cp.database
  this.host = cp.host
  this.port = cp.port

  // a hash to hold named queries
  this.namedQueries = {}
})

Client.Query = NativeQuery

util.inherits(Client, EventEmitter)

Client.prototype._errorAllQueries = function (err) {
  const enqueueError = (query) => {
    process.nextTick(() => {
      query.native = this.native
      query.handleError(err)
    })
  }

  if (this._hasActiveQuery()) {
    enqueueError(this._activeQuery)
    this._activeQuery = null
  }

  this._queryQueue.forEach(enqueueError)
  this._queryQueue.length = 0
}

// connect to the backend
// pass an optional callback to be called once connected
// or with an error if there was a connection error
Client.prototype._connect = function (cb) {
  var self = this

  if (this._connecting) {
    process.nextTick(() => cb(new Error('Client has already been connected. You cannot reuse a client.')))
    return
  }

  this._connecting = true

  this.connectionParameters.getLibpqConnectionString(function (err, conString) {
    if (err) return cb(err)
    self.native.connect(conString, function (err) {
      if (err) {
        self.native.end()
        return cb(err)
      }

      // set internal states to connected
      self._connected = true

      // handle connection errors from the native layer
      self.native.on('error', function (err) {
        self._queryable = false
        self._errorAllQueries(err)
        self.emit('error', err)
      })

      self.native.on('notification', function (msg) {
        self.emit('notification', {
          channel: msg.relname,
          payload: msg.extra,
        })
      })

      // signal we are connected now
      self.emit('connect')
      self._pulseQueryQueue(true)

      cb()
    })
  })
}

Client.prototype.connect = function (callback) {
  if (callback) {
    this._connect(callback)
    return
  }

  return new this._Promise((resolve, reject) => {
    this._connect((error) => {
      if (error) {
        reject(error)
      } else {
        resolve()
      }
    })
  })
}

// send a query to the server
// this method is highly overloaded to take
// 1) string query, optional array of parameters, optional function callback
// 2) object query with {
//    string query
//    optional array values,
//    optional function callback instead of as a separate parameter
//    optional string name to name & cache the query plan
//    optional string rowMode = 'array' for an array of results
//  }
Client.prototype.query = function (config, values, callback) {
  var query
  var result
  var readTimeout
  var readTimeoutTimer
  var queryCallback

  if (config === null || config === undefined) {
    throw new TypeError('Client was passed a null or undefined query')
  } else if (typeof config.submit === 'function') {
    readTimeout = config.query_timeout || this.connectionParameters.query_timeout
    result = query = config
    // accept query(new Query(...), (err, res) => { }) style
    if (typeof values === 'function') {
      config.callback = values
    }
  } else {
    readTimeout = this.connectionParameters.query_timeout
    query = new NativeQuery(config, values, callback)
    if (!query.callback) {
      let resolveOut, rejectOut
      result = new this._Promise((resolve, reject) => {
        resolveOut = resolve
        rejectOut = reject
      })
      query.callback = (err, res) => (err ? rejectOut(err) : resolveOut(res))
    }
  }

  if (readTimeout) {
    queryCallback = query.callback

    readTimeoutTimer = setTimeout(() => {
      var error = new Error('Query read timeout')

      process.nextTick(() => {
        query.handleError(error, this.connection)
      })

      queryCallback(error)

      // we already returned an error,
      // just do nothing if query completes
      query.callback = () => {}

      // Remove from queue
      var index = this._queryQueue.indexOf(query)
      if (index > -1) {
        this._queryQueue.splice(index, 1)
      }

      this._pulseQueryQueue()
    }, readTimeout)

    query.callback = (err, res) => {
      clearTimeout(readTimeoutTimer)
      queryCallback(err, res)
    }
  }

  if (!this._queryable) {
    query.native = this.native
    process.nextTick(() => {
      query.handleError(new Error('Client has encountered a connection error and is not queryable'))
    })
    return result
  }

  if (this._ending) {
    query.native = this.native
    process.nextTick(() => {
      query.handleError(new Error('Client was closed and is not queryable'))
    })
    return result
  }

  this._queryQueue.push(query)
  this._pulseQueryQueue()
  return result
}

// disconnect from the backend server
Client.prototype.end = function (cb) {
  var self = this

  this._ending = true

  if (!this._connected) {
    this.once('connect', this.end.bind(this, cb))
  }
  var result
  if (!cb) {
    result = new this._Promise(function (resolve, reject) {
      cb = (err) => (err ? reject(err) : resolve())
    })
  }
  this.native.end(function () {
    self._errorAllQueries(new Error('Connection terminated'))

    process.nextTick(() => {
      self.emit('end')
      if (cb) cb()
    })
  })
  return result
}

Client.prototype._hasActiveQuery = function () {
  return this._activeQuery && this._activeQuery.state !== 'error' && this._activeQuery.state !== 'end'
}

Client.prototype._pulseQueryQueue = function (initialConnection) {
  if (!this._connected) {
    return
  }
  if (this._hasActiveQuery()) {
    return
  }
  var query = this._queryQueue.shift()
  if (!query) {
    if (!initialConnection) {
      this.emit('drain')
    }
    return
  }
  this._activeQuery = query
  query.submit(this)
  var self = this
  query.once('_done', function () {
    self._pulseQueryQueue()
  })
}

// attempt to cancel an in-progress query
Client.prototype.cancel = function (query) {
  if (this._activeQuery === query) {
    this.native.cancel(function () {})
  } else if (this._queryQueue.indexOf(query) !== -1) {
    this._queryQueue.splice(this._queryQueue.indexOf(query), 1)
  }
}

Client.prototype.ref = function () {}
Client.prototype.unref = function () {}

Client.prototype.setTypeParser = function (oid, format, parseFn) {
  return this._types.setTypeParser(oid, format, parseFn)
}

Client.prototype.getTypeParser = function (oid, format) {
  return this._types.getTypeParser(oid, format)
}


/***/ }),

/***/ "./node_modules/pg/lib/native/index.js":
/*!*********************************************!*\
  !*** ./node_modules/pg/lib/native/index.js ***!
  \*********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

module.exports = __webpack_require__(/*! ./client */ "./node_modules/pg/lib/native/client.js")


/***/ }),

/***/ "./node_modules/pg/lib/native/query.js":
/*!*********************************************!*\
  !*** ./node_modules/pg/lib/native/query.js ***!
  \*********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var EventEmitter = (__webpack_require__(/*! events */ "events").EventEmitter)
var util = __webpack_require__(/*! util */ "util")
var utils = __webpack_require__(/*! ../utils */ "./node_modules/pg/lib/utils.js")

var NativeQuery = (module.exports = function (config, values, callback) {
  EventEmitter.call(this)
  config = utils.normalizeQueryConfig(config, values, callback)
  this.text = config.text
  this.values = config.values
  this.name = config.name
  this.callback = config.callback
  this.state = 'new'
  this._arrayMode = config.rowMode === 'array'

  // if the 'row' event is listened for
  // then emit them as they come in
  // without setting singleRowMode to true
  // this has almost no meaning because libpq
  // reads all rows into memory befor returning any
  this._emitRowEvents = false
  this.on(
    'newListener',
    function (event) {
      if (event === 'row') this._emitRowEvents = true
    }.bind(this)
  )
})

util.inherits(NativeQuery, EventEmitter)

var errorFieldMap = {
  /* eslint-disable quote-props */
  sqlState: 'code',
  statementPosition: 'position',
  messagePrimary: 'message',
  context: 'where',
  schemaName: 'schema',
  tableName: 'table',
  columnName: 'column',
  dataTypeName: 'dataType',
  constraintName: 'constraint',
  sourceFile: 'file',
  sourceLine: 'line',
  sourceFunction: 'routine',
}

NativeQuery.prototype.handleError = function (err) {
  // copy pq error fields into the error object
  var fields = this.native.pq.resultErrorFields()
  if (fields) {
    for (var key in fields) {
      var normalizedFieldName = errorFieldMap[key] || key
      err[normalizedFieldName] = fields[key]
    }
  }
  if (this.callback) {
    this.callback(err)
  } else {
    this.emit('error', err)
  }
  this.state = 'error'
}

NativeQuery.prototype.then = function (onSuccess, onFailure) {
  return this._getPromise().then(onSuccess, onFailure)
}

NativeQuery.prototype.catch = function (callback) {
  return this._getPromise().catch(callback)
}

NativeQuery.prototype._getPromise = function () {
  if (this._promise) return this._promise
  this._promise = new Promise(
    function (resolve, reject) {
      this._once('end', resolve)
      this._once('error', reject)
    }.bind(this)
  )
  return this._promise
}

NativeQuery.prototype.submit = function (client) {
  this.state = 'running'
  var self = this
  this.native = client.native
  client.native.arrayMode = this._arrayMode

  var after = function (err, rows, results) {
    client.native.arrayMode = false
    setImmediate(function () {
      self.emit('_done')
    })

    // handle possible query error
    if (err) {
      return self.handleError(err)
    }

    // emit row events for each row in the result
    if (self._emitRowEvents) {
      if (results.length > 1) {
        rows.forEach((rowOfRows, i) => {
          rowOfRows.forEach((row) => {
            self.emit('row', row, results[i])
          })
        })
      } else {
        rows.forEach(function (row) {
          self.emit('row', row, results)
        })
      }
    }

    // handle successful result
    self.state = 'end'
    self.emit('end', results)
    if (self.callback) {
      self.callback(null, results)
    }
  }

  if (process.domain) {
    after = process.domain.bind(after)
  }

  // named query
  if (this.name) {
    if (this.name.length > 63) {
      /* eslint-disable no-console */
      console.error('Warning! Postgres only supports 63 characters for query names.')
      console.error('You supplied %s (%s)', this.name, this.name.length)
      console.error('This can cause conflicts and silent errors executing queries')
      /* eslint-enable no-console */
    }
    var values = (this.values || []).map(utils.prepareValue)

    // check if the client has already executed this named query
    // if so...just execute it again - skip the planning phase
    if (client.namedQueries[this.name]) {
      if (this.text && client.namedQueries[this.name] !== this.text) {
        const err = new Error(`Prepared statements must be unique - '${this.name}' was used for a different statement`)
        return after(err)
      }
      return client.native.execute(this.name, values, after)
    }
    // plan the named query the first time, then execute it
    return client.native.prepare(this.name, this.text, values.length, function (err) {
      if (err) return after(err)
      client.namedQueries[self.name] = self.text
      return self.native.execute(self.name, values, after)
    })
  } else if (this.values) {
    if (!Array.isArray(this.values)) {
      const err = new Error('Query values must be an array')
      return after(err)
    }
    var vals = this.values.map(utils.prepareValue)
    client.native.query(this.text, vals, after)
  } else {
    client.native.query(this.text, after)
  }
}


/***/ }),

/***/ "./node_modules/pg/lib/query.js":
/*!**************************************!*\
  !*** ./node_modules/pg/lib/query.js ***!
  \**************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const { EventEmitter } = __webpack_require__(/*! events */ "events")

const Result = __webpack_require__(/*! ./result */ "./node_modules/pg/lib/result.js")
const utils = __webpack_require__(/*! ./utils */ "./node_modules/pg/lib/utils.js")

class Query extends EventEmitter {
  constructor(config, values, callback) {
    super()

    config = utils.normalizeQueryConfig(config, values, callback)

    this.text = config.text
    this.values = config.values
    this.rows = config.rows
    this.types = config.types
    this.name = config.name
    this.binary = config.binary
    // use unique portal name each time
    this.portal = config.portal || ''
    this.callback = config.callback
    this._rowMode = config.rowMode
    if (process.domain && config.callback) {
      this.callback = process.domain.bind(config.callback)
    }
    this._result = new Result(this._rowMode, this.types)

    // potential for multiple results
    this._results = this._result
    this.isPreparedStatement = false
    this._canceledDueToError = false
    this._promise = null
  }

  requiresPreparation() {
    // named queries must always be prepared
    if (this.name) {
      return true
    }
    // always prepare if there are max number of rows expected per
    // portal execution
    if (this.rows) {
      return true
    }
    // don't prepare empty text queries
    if (!this.text) {
      return false
    }
    // prepare if there are values
    if (!this.values) {
      return false
    }
    return this.values.length > 0
  }

  _checkForMultirow() {
    // if we already have a result with a command property
    // then we've already executed one query in a multi-statement simple query
    // turn our results into an array of results
    if (this._result.command) {
      if (!Array.isArray(this._results)) {
        this._results = [this._result]
      }
      this._result = new Result(this._rowMode, this.types)
      this._results.push(this._result)
    }
  }

  // associates row metadata from the supplied
  // message with this query object
  // metadata used when parsing row results
  handleRowDescription(msg) {
    this._checkForMultirow()
    this._result.addFields(msg.fields)
    this._accumulateRows = this.callback || !this.listeners('row').length
  }

  handleDataRow(msg) {
    let row

    if (this._canceledDueToError) {
      return
    }

    try {
      row = this._result.parseRow(msg.fields)
    } catch (err) {
      this._canceledDueToError = err
      return
    }

    this.emit('row', row, this._result)
    if (this._accumulateRows) {
      this._result.addRow(row)
    }
  }

  handleCommandComplete(msg, connection) {
    this._checkForMultirow()
    this._result.addCommandComplete(msg)
    // need to sync after each command complete of a prepared statement
    // if we were using a row count which results in multiple calls to _getRows
    if (this.rows) {
      connection.sync()
    }
  }

  // if a named prepared statement is created with empty query text
  // the backend will send an emptyQuery message but *not* a command complete message
  // since we pipeline sync immediately after execute we don't need to do anything here
  // unless we have rows specified, in which case we did not pipeline the intial sync call
  handleEmptyQuery(connection) {
    if (this.rows) {
      connection.sync()
    }
  }

  handleError(err, connection) {
    // need to sync after error during a prepared statement
    if (this._canceledDueToError) {
      err = this._canceledDueToError
      this._canceledDueToError = false
    }
    // if callback supplied do not emit error event as uncaught error
    // events will bubble up to node process
    if (this.callback) {
      return this.callback(err)
    }
    this.emit('error', err)
  }

  handleReadyForQuery(con) {
    if (this._canceledDueToError) {
      return this.handleError(this._canceledDueToError, con)
    }
    if (this.callback) {
      try {
        this.callback(null, this._results)
      }
      catch(err) {
        process.nextTick(() => {
          throw err
        })
      }
    }
    this.emit('end', this._results)
  }

  submit(connection) {
    if (typeof this.text !== 'string' && typeof this.name !== 'string') {
      return new Error('A query must have either text or a name. Supplying neither is unsupported.')
    }
    const previous = connection.parsedStatements[this.name]
    if (this.text && previous && this.text !== previous) {
      return new Error(`Prepared statements must be unique - '${this.name}' was used for a different statement`)
    }
    if (this.values && !Array.isArray(this.values)) {
      return new Error('Query values must be an array')
    }
    if (this.requiresPreparation()) {
      this.prepare(connection)
    } else {
      connection.query(this.text)
    }
    return null
  }

  hasBeenParsed(connection) {
    return this.name && connection.parsedStatements[this.name]
  }

  handlePortalSuspended(connection) {
    this._getRows(connection, this.rows)
  }

  _getRows(connection, rows) {
    connection.execute({
      portal: this.portal,
      rows: rows,
    })
    // if we're not reading pages of rows send the sync command
    // to indicate the pipeline is finished
    if (!rows) {
      connection.sync()
    } else {
      // otherwise flush the call out to read more rows
      connection.flush()
    }
  }

  // http://developer.postgresql.org/pgdocs/postgres/protocol-flow.html#PROTOCOL-FLOW-EXT-QUERY
  prepare(connection) {
    // prepared statements need sync to be called after each command
    // complete or when an error is encountered
    this.isPreparedStatement = true

    // TODO refactor this poor encapsulation
    if (!this.hasBeenParsed(connection)) {
      connection.parse({
        text: this.text,
        name: this.name,
        types: this.types,
      })
    }

    // because we're mapping user supplied values to
    // postgres wire protocol compatible values it could
    // throw an exception, so try/catch this section
    try {
      connection.bind({
        portal: this.portal,
        statement: this.name,
        values: this.values,
        binary: this.binary,
        valueMapper: utils.prepareValue,
      })
    } catch (err) {
      this.handleError(err, connection)
      return
    }

    connection.describe({
      type: 'P',
      name: this.portal || '',
    })

    this._getRows(connection, this.rows)
  }

  handleCopyInResponse(connection) {
    connection.sendCopyFail('No source stream defined')
  }

  // eslint-disable-next-line no-unused-vars
  handleCopyData(msg, connection) {
    // noop
  }
}

module.exports = Query


/***/ }),

/***/ "./node_modules/pg/lib/result.js":
/*!***************************************!*\
  !*** ./node_modules/pg/lib/result.js ***!
  \***************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var types = __webpack_require__(/*! pg-types */ "./node_modules/pg-types/index.js")

var matchRegexp = /^([A-Za-z]+)(?: (\d+))?(?: (\d+))?/

// result object returned from query
// in the 'end' event and also
// passed as second argument to provided callback
class Result {
  constructor(rowMode, types) {
    this.command = null
    this.rowCount = null
    this.oid = null
    this.rows = []
    this.fields = []
    this._parsers = undefined
    this._types = types
    this.RowCtor = null
    this.rowAsArray = rowMode === 'array'
    if (this.rowAsArray) {
      this.parseRow = this._parseRowAsArray
    }
  }

  // adds a command complete message
  addCommandComplete(msg) {
    var match
    if (msg.text) {
      // pure javascript
      match = matchRegexp.exec(msg.text)
    } else {
      // native bindings
      match = matchRegexp.exec(msg.command)
    }
    if (match) {
      this.command = match[1]
      if (match[3]) {
        // COMMMAND OID ROWS
        this.oid = parseInt(match[2], 10)
        this.rowCount = parseInt(match[3], 10)
      } else if (match[2]) {
        // COMMAND ROWS
        this.rowCount = parseInt(match[2], 10)
      }
    }
  }

  _parseRowAsArray(rowData) {
    var row = new Array(rowData.length)
    for (var i = 0, len = rowData.length; i < len; i++) {
      var rawValue = rowData[i]
      if (rawValue !== null) {
        row[i] = this._parsers[i](rawValue)
      } else {
        row[i] = null
      }
    }
    return row
  }

  parseRow(rowData) {
    var row = {}
    for (var i = 0, len = rowData.length; i < len; i++) {
      var rawValue = rowData[i]
      var field = this.fields[i].name
      if (rawValue !== null) {
        row[field] = this._parsers[i](rawValue)
      } else {
        row[field] = null
      }
    }
    return row
  }

  addRow(row) {
    this.rows.push(row)
  }

  addFields(fieldDescriptions) {
    // clears field definitions
    // multiple query statements in 1 action can result in multiple sets
    // of rowDescriptions...eg: 'select NOW(); select 1::int;'
    // you need to reset the fields
    this.fields = fieldDescriptions
    if (this.fields.length) {
      this._parsers = new Array(fieldDescriptions.length)
    }
    for (var i = 0; i < fieldDescriptions.length; i++) {
      var desc = fieldDescriptions[i]
      if (this._types) {
        this._parsers[i] = this._types.getTypeParser(desc.dataTypeID, desc.format || 'text')
      } else {
        this._parsers[i] = types.getTypeParser(desc.dataTypeID, desc.format || 'text')
      }
    }
  }
}

module.exports = Result


/***/ }),

/***/ "./node_modules/pg/lib/sasl.js":
/*!*************************************!*\
  !*** ./node_modules/pg/lib/sasl.js ***!
  \*************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

const crypto = __webpack_require__(/*! crypto */ "crypto")

function startSession(mechanisms) {
  if (mechanisms.indexOf('SCRAM-SHA-256') === -1) {
    throw new Error('SASL: Only mechanism SCRAM-SHA-256 is currently supported')
  }

  const clientNonce = crypto.randomBytes(18).toString('base64')

  return {
    mechanism: 'SCRAM-SHA-256',
    clientNonce,
    response: 'n,,n=*,r=' + clientNonce,
    message: 'SASLInitialResponse',
  }
}

function continueSession(session, password, serverData) {
  if (session.message !== 'SASLInitialResponse') {
    throw new Error('SASL: Last message was not SASLInitialResponse')
  }
  if (typeof password !== 'string') {
    throw new Error('SASL: SCRAM-SERVER-FIRST-MESSAGE: client password must be a string')
  }
  if (password === '') {
    throw new Error('SASL: SCRAM-SERVER-FIRST-MESSAGE: client password must be a non-empty string')
  }
  if (typeof serverData !== 'string') {
    throw new Error('SASL: SCRAM-SERVER-FIRST-MESSAGE: serverData must be a string')
  }

  const sv = parseServerFirstMessage(serverData)

  if (!sv.nonce.startsWith(session.clientNonce)) {
    throw new Error('SASL: SCRAM-SERVER-FIRST-MESSAGE: server nonce does not start with client nonce')
  } else if (sv.nonce.length === session.clientNonce.length) {
    throw new Error('SASL: SCRAM-SERVER-FIRST-MESSAGE: server nonce is too short')
  }

  var saltBytes = Buffer.from(sv.salt, 'base64')

  var saltedPassword = crypto.pbkdf2Sync(password, saltBytes, sv.iteration, 32, 'sha256')

  var clientKey = hmacSha256(saltedPassword, 'Client Key')
  var storedKey = sha256(clientKey)

  var clientFirstMessageBare = 'n=*,r=' + session.clientNonce
  var serverFirstMessage = 'r=' + sv.nonce + ',s=' + sv.salt + ',i=' + sv.iteration

  var clientFinalMessageWithoutProof = 'c=biws,r=' + sv.nonce

  var authMessage = clientFirstMessageBare + ',' + serverFirstMessage + ',' + clientFinalMessageWithoutProof

  var clientSignature = hmacSha256(storedKey, authMessage)
  var clientProofBytes = xorBuffers(clientKey, clientSignature)
  var clientProof = clientProofBytes.toString('base64')

  var serverKey = hmacSha256(saltedPassword, 'Server Key')
  var serverSignatureBytes = hmacSha256(serverKey, authMessage)

  session.message = 'SASLResponse'
  session.serverSignature = serverSignatureBytes.toString('base64')
  session.response = clientFinalMessageWithoutProof + ',p=' + clientProof
}

function finalizeSession(session, serverData) {
  if (session.message !== 'SASLResponse') {
    throw new Error('SASL: Last message was not SASLResponse')
  }
  if (typeof serverData !== 'string') {
    throw new Error('SASL: SCRAM-SERVER-FINAL-MESSAGE: serverData must be a string')
  }

  const { serverSignature } = parseServerFinalMessage(serverData)

  if (serverSignature !== session.serverSignature) {
    throw new Error('SASL: SCRAM-SERVER-FINAL-MESSAGE: server signature does not match')
  }
}

/**
 * printable       = %x21-2B / %x2D-7E
 *                   ;; Printable ASCII except ",".
 *                   ;; Note that any "printable" is also
 *                   ;; a valid "value".
 */
function isPrintableChars(text) {
  if (typeof text !== 'string') {
    throw new TypeError('SASL: text must be a string')
  }
  return text
    .split('')
    .map((_, i) => text.charCodeAt(i))
    .every((c) => (c >= 0x21 && c <= 0x2b) || (c >= 0x2d && c <= 0x7e))
}

/**
 * base64-char     = ALPHA / DIGIT / "/" / "+"
 *
 * base64-4        = 4base64-char
 *
 * base64-3        = 3base64-char "="
 *
 * base64-2        = 2base64-char "=="
 *
 * base64          = *base64-4 [base64-3 / base64-2]
 */
function isBase64(text) {
  return /^(?:[a-zA-Z0-9+/]{4})*(?:[a-zA-Z0-9+/]{2}==|[a-zA-Z0-9+/]{3}=)?$/.test(text)
}

function parseAttributePairs(text) {
  if (typeof text !== 'string') {
    throw new TypeError('SASL: attribute pairs text must be a string')
  }

  return new Map(
    text.split(',').map((attrValue) => {
      if (!/^.=/.test(attrValue)) {
        throw new Error('SASL: Invalid attribute pair entry')
      }
      const name = attrValue[0]
      const value = attrValue.substring(2)
      return [name, value]
    })
  )
}

function parseServerFirstMessage(data) {
  const attrPairs = parseAttributePairs(data)

  const nonce = attrPairs.get('r')
  if (!nonce) {
    throw new Error('SASL: SCRAM-SERVER-FIRST-MESSAGE: nonce missing')
  } else if (!isPrintableChars(nonce)) {
    throw new Error('SASL: SCRAM-SERVER-FIRST-MESSAGE: nonce must only contain printable characters')
  }
  const salt = attrPairs.get('s')
  if (!salt) {
    throw new Error('SASL: SCRAM-SERVER-FIRST-MESSAGE: salt missing')
  } else if (!isBase64(salt)) {
    throw new Error('SASL: SCRAM-SERVER-FIRST-MESSAGE: salt must be base64')
  }
  const iterationText = attrPairs.get('i')
  if (!iterationText) {
    throw new Error('SASL: SCRAM-SERVER-FIRST-MESSAGE: iteration missing')
  } else if (!/^[1-9][0-9]*$/.test(iterationText)) {
    throw new Error('SASL: SCRAM-SERVER-FIRST-MESSAGE: invalid iteration count')
  }
  const iteration = parseInt(iterationText, 10)

  return {
    nonce,
    salt,
    iteration,
  }
}

function parseServerFinalMessage(serverData) {
  const attrPairs = parseAttributePairs(serverData)
  const serverSignature = attrPairs.get('v')
  if (!serverSignature) {
    throw new Error('SASL: SCRAM-SERVER-FINAL-MESSAGE: server signature is missing')
  } else if (!isBase64(serverSignature)) {
    throw new Error('SASL: SCRAM-SERVER-FINAL-MESSAGE: server signature must be base64')
  }
  return {
    serverSignature,
  }
}

function xorBuffers(a, b) {
  if (!Buffer.isBuffer(a)) {
    throw new TypeError('first argument must be a Buffer')
  }
  if (!Buffer.isBuffer(b)) {
    throw new TypeError('second argument must be a Buffer')
  }
  if (a.length !== b.length) {
    throw new Error('Buffer lengths must match')
  }
  if (a.length === 0) {
    throw new Error('Buffers cannot be empty')
  }
  return Buffer.from(a.map((_, i) => a[i] ^ b[i]))
}

function sha256(text) {
  return crypto.createHash('sha256').update(text).digest()
}

function hmacSha256(key, msg) {
  return crypto.createHmac('sha256', key).update(msg).digest()
}

module.exports = {
  startSession,
  continueSession,
  finalizeSession,
}


/***/ }),

/***/ "./node_modules/pg/lib/type-overrides.js":
/*!***********************************************!*\
  !*** ./node_modules/pg/lib/type-overrides.js ***!
  \***********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var types = __webpack_require__(/*! pg-types */ "./node_modules/pg-types/index.js")

function TypeOverrides(userTypes) {
  this._types = userTypes || types
  this.text = {}
  this.binary = {}
}

TypeOverrides.prototype.getOverrides = function (format) {
  switch (format) {
    case 'text':
      return this.text
    case 'binary':
      return this.binary
    default:
      return {}
  }
}

TypeOverrides.prototype.setTypeParser = function (oid, format, parseFn) {
  if (typeof format === 'function') {
    parseFn = format
    format = 'text'
  }
  this.getOverrides(format)[oid] = parseFn
}

TypeOverrides.prototype.getTypeParser = function (oid, format) {
  format = format || 'text'
  return this.getOverrides(format)[oid] || this._types.getTypeParser(oid, format)
}

module.exports = TypeOverrides


/***/ }),

/***/ "./node_modules/pg/lib/utils.js":
/*!**************************************!*\
  !*** ./node_modules/pg/lib/utils.js ***!
  \**************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const crypto = __webpack_require__(/*! crypto */ "crypto")

const defaults = __webpack_require__(/*! ./defaults */ "./node_modules/pg/lib/defaults.js")

function escapeElement(elementRepresentation) {
  var escaped = elementRepresentation.replace(/\\/g, '\\\\').replace(/"/g, '\\"')

  return '"' + escaped + '"'
}

// convert a JS array to a postgres array literal
// uses comma separator so won't work for types like box that use
// a different array separator.
function arrayString(val) {
  var result = '{'
  for (var i = 0; i < val.length; i++) {
    if (i > 0) {
      result = result + ','
    }
    if (val[i] === null || typeof val[i] === 'undefined') {
      result = result + 'NULL'
    } else if (Array.isArray(val[i])) {
      result = result + arrayString(val[i])
    } else if (val[i] instanceof Buffer) {
      result += '\\\\x' + val[i].toString('hex')
    } else {
      result += escapeElement(prepareValue(val[i]))
    }
  }
  result = result + '}'
  return result
}

// converts values from javascript types
// to their 'raw' counterparts for use as a postgres parameter
// note: you can override this function to provide your own conversion mechanism
// for complex types, etc...
var prepareValue = function (val, seen) {
  // null and undefined are both null for postgres
  if (val == null) {
    return null
  }
  if (val instanceof Buffer) {
    return val
  }
  if (ArrayBuffer.isView(val)) {
    var buf = Buffer.from(val.buffer, val.byteOffset, val.byteLength)
    if (buf.length === val.byteLength) {
      return buf
    }
    return buf.slice(val.byteOffset, val.byteOffset + val.byteLength) // Node.js v4 does not support those Buffer.from params
  }
  if (val instanceof Date) {
    if (defaults.parseInputDatesAsUTC) {
      return dateToStringUTC(val)
    } else {
      return dateToString(val)
    }
  }
  if (Array.isArray(val)) {
    return arrayString(val)
  }
  if (typeof val === 'object') {
    return prepareObject(val, seen)
  }
  return val.toString()
}

function prepareObject(val, seen) {
  if (val && typeof val.toPostgres === 'function') {
    seen = seen || []
    if (seen.indexOf(val) !== -1) {
      throw new Error('circular reference detected while preparing "' + val + '" for query')
    }
    seen.push(val)

    return prepareValue(val.toPostgres(prepareValue), seen)
  }
  return JSON.stringify(val)
}

function pad(number, digits) {
  number = '' + number
  while (number.length < digits) {
    number = '0' + number
  }
  return number
}

function dateToString(date) {
  var offset = -date.getTimezoneOffset()

  var year = date.getFullYear()
  var isBCYear = year < 1
  if (isBCYear) year = Math.abs(year) + 1 // negative years are 1 off their BC representation

  var ret =
    pad(year, 4) +
    '-' +
    pad(date.getMonth() + 1, 2) +
    '-' +
    pad(date.getDate(), 2) +
    'T' +
    pad(date.getHours(), 2) +
    ':' +
    pad(date.getMinutes(), 2) +
    ':' +
    pad(date.getSeconds(), 2) +
    '.' +
    pad(date.getMilliseconds(), 3)

  if (offset < 0) {
    ret += '-'
    offset *= -1
  } else {
    ret += '+'
  }

  ret += pad(Math.floor(offset / 60), 2) + ':' + pad(offset % 60, 2)
  if (isBCYear) ret += ' BC'
  return ret
}

function dateToStringUTC(date) {
  var year = date.getUTCFullYear()
  var isBCYear = year < 1
  if (isBCYear) year = Math.abs(year) + 1 // negative years are 1 off their BC representation

  var ret =
    pad(year, 4) +
    '-' +
    pad(date.getUTCMonth() + 1, 2) +
    '-' +
    pad(date.getUTCDate(), 2) +
    'T' +
    pad(date.getUTCHours(), 2) +
    ':' +
    pad(date.getUTCMinutes(), 2) +
    ':' +
    pad(date.getUTCSeconds(), 2) +
    '.' +
    pad(date.getUTCMilliseconds(), 3)

  ret += '+00:00'
  if (isBCYear) ret += ' BC'
  return ret
}

function normalizeQueryConfig(config, values, callback) {
  // can take in strings or config objects
  config = typeof config === 'string' ? { text: config } : config
  if (values) {
    if (typeof values === 'function') {
      config.callback = values
    } else {
      config.values = values
    }
  }
  if (callback) {
    config.callback = callback
  }
  return config
}

const md5 = function (string) {
  return crypto.createHash('md5').update(string, 'utf-8').digest('hex')
}

// See AuthenticationMD5Password at https://www.postgresql.org/docs/current/static/protocol-flow.html
const postgresMd5PasswordHash = function (user, password, salt) {
  var inner = md5(password + user)
  var outer = md5(Buffer.concat([Buffer.from(inner), salt]))
  return 'md5' + outer
}

module.exports = {
  prepareValue: function prepareValueWrapper(value) {
    // this ensures that extra arguments do not get passed into prepareValue
    // by accident, eg: from calling values.map(utils.prepareValue)
    return prepareValue(value)
  },
  normalizeQueryConfig,
  postgresMd5PasswordHash,
  md5,
}


/***/ }),

/***/ "./node_modules/pgpass/lib/helper.js":
/*!*******************************************!*\
  !*** ./node_modules/pgpass/lib/helper.js ***!
  \*******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var path = __webpack_require__(/*! path */ "path")
  , Stream = (__webpack_require__(/*! stream */ "stream").Stream)
  , split = __webpack_require__(/*! split2 */ "./node_modules/split2/index.js")
  , util = __webpack_require__(/*! util */ "util")
  , defaultPort = 5432
  , isWin = (process.platform === 'win32')
  , warnStream = process.stderr
;


var S_IRWXG = 56     //    00070(8)
  , S_IRWXO = 7      //    00007(8)
  , S_IFMT  = 61440  // 00170000(8)
  , S_IFREG = 32768  //  0100000(8)
;
function isRegFile(mode) {
    return ((mode & S_IFMT) == S_IFREG);
}

var fieldNames = [ 'host', 'port', 'database', 'user', 'password' ];
var nrOfFields = fieldNames.length;
var passKey = fieldNames[ nrOfFields -1 ];


function warn() {
    var isWritable = (
        warnStream instanceof Stream &&
          true === warnStream.writable
    );

    if (isWritable) {
        var args = Array.prototype.slice.call(arguments).concat("\n");
        warnStream.write( util.format.apply(util, args) );
    }
}


Object.defineProperty(module.exports, "isWin", ({
    get : function() {
        return isWin;
    } ,
    set : function(val) {
        isWin = val;
    }
}));


module.exports.warnTo = function(stream) {
    var old = warnStream;
    warnStream = stream;
    return old;
};

module.exports.getFileName = function(rawEnv){
    var env = rawEnv || process.env;
    var file = env.PGPASSFILE || (
        isWin ?
          path.join( env.APPDATA || './' , 'postgresql', 'pgpass.conf' ) :
          path.join( env.HOME || './', '.pgpass' )
    );
    return file;
};

module.exports.usePgPass = function(stats, fname) {
    if (Object.prototype.hasOwnProperty.call(process.env, 'PGPASSWORD')) {
        return false;
    }

    if (isWin) {
        return true;
    }

    fname = fname || '<unkn>';

    if (! isRegFile(stats.mode)) {
        warn('WARNING: password file "%s" is not a plain file', fname);
        return false;
    }

    if (stats.mode & (S_IRWXG | S_IRWXO)) {
        /* If password file is insecure, alert the user and ignore it. */
        warn('WARNING: password file "%s" has group or world access; permissions should be u=rw (0600) or less', fname);
        return false;
    }

    return true;
};


var matcher = module.exports.match = function(connInfo, entry) {
    return fieldNames.slice(0, -1).reduce(function(prev, field, idx){
        if (idx == 1) {
            // the port
            if ( Number( connInfo[field] || defaultPort ) === Number( entry[field] ) ) {
                return prev && true;
            }
        }
        return prev && (
            entry[field] === '*' ||
              entry[field] === connInfo[field]
        );
    }, true);
};


module.exports.getPassword = function(connInfo, stream, cb) {
    var pass;
    var lineStream = stream.pipe(split());

    function onLine(line) {
        var entry = parseLine(line);
        if (entry && isValidEntry(entry) && matcher(connInfo, entry)) {
            pass = entry[passKey];
            lineStream.end(); // -> calls onEnd(), but pass is set now
        }
    }

    var onEnd = function() {
        stream.destroy();
        cb(pass);
    };

    var onErr = function(err) {
        stream.destroy();
        warn('WARNING: error on reading file: %s', err);
        cb(undefined);
    };

    stream.on('error', onErr);
    lineStream
        .on('data', onLine)
        .on('end', onEnd)
        .on('error', onErr)
    ;

};


var parseLine = module.exports.parseLine = function(line) {
    if (line.length < 11 || line.match(/^\s+#/)) {
        return null;
    }

    var curChar = '';
    var prevChar = '';
    var fieldIdx = 0;
    var startIdx = 0;
    var endIdx = 0;
    var obj = {};
    var isLastField = false;
    var addToObj = function(idx, i0, i1) {
        var field = line.substring(i0, i1);

        if (! Object.hasOwnProperty.call(process.env, 'PGPASS_NO_DEESCAPE')) {
            field = field.replace(/\\([:\\])/g, '$1');
        }

        obj[ fieldNames[idx] ] = field;
    };

    for (var i = 0 ; i < line.length-1 ; i += 1) {
        curChar = line.charAt(i+1);
        prevChar = line.charAt(i);

        isLastField = (fieldIdx == nrOfFields-1);

        if (isLastField) {
            addToObj(fieldIdx, startIdx);
            break;
        }

        if (i >= 0 && curChar == ':' && prevChar !== '\\') {
            addToObj(fieldIdx, startIdx, i+1);

            startIdx = i+2;
            fieldIdx += 1;
        }
    }

    obj = ( Object.keys(obj).length === nrOfFields ) ? obj : null;

    return obj;
};


var isValidEntry = module.exports.isValidEntry = function(entry){
    var rules = {
        // host
        0 : function(x){
            return x.length > 0;
        } ,
        // port
        1 : function(x){
            if (x === '*') {
                return true;
            }
            x = Number(x);
            return (
                isFinite(x) &&
                  x > 0 &&
                  x < 9007199254740992 &&
                  Math.floor(x) === x
            );
        } ,
        // database
        2 : function(x){
            return x.length > 0;
        } ,
        // username
        3 : function(x){
            return x.length > 0;
        } ,
        // password
        4 : function(x){
            return x.length > 0;
        }
    };

    for (var idx = 0 ; idx < fieldNames.length ; idx += 1) {
        var rule = rules[idx];
        var value = entry[ fieldNames[idx] ] || '';

        var res = rule(value);
        if (!res) {
            return false;
        }
    }

    return true;
};



/***/ }),

/***/ "./node_modules/pgpass/lib/index.js":
/*!******************************************!*\
  !*** ./node_modules/pgpass/lib/index.js ***!
  \******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var path = __webpack_require__(/*! path */ "path")
  , fs = __webpack_require__(/*! fs */ "fs")
  , helper = __webpack_require__(/*! ./helper.js */ "./node_modules/pgpass/lib/helper.js")
;


module.exports = function(connInfo, cb) {
    var file = helper.getFileName();
    
    fs.stat(file, function(err, stat){
        if (err || !helper.usePgPass(stat, file)) {
            return cb(undefined);
        }

        var st = fs.createReadStream(file);

        helper.getPassword(connInfo, st, cb);
    });
};

module.exports.warnTo = helper.warnTo;


/***/ }),

/***/ "./node_modules/postgres-array/index.js":
/*!**********************************************!*\
  !*** ./node_modules/postgres-array/index.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";


exports.parse = function (source, transform) {
  return new ArrayParser(source, transform).parse()
}

class ArrayParser {
  constructor (source, transform) {
    this.source = source
    this.transform = transform || identity
    this.position = 0
    this.entries = []
    this.recorded = []
    this.dimension = 0
  }

  isEof () {
    return this.position >= this.source.length
  }

  nextCharacter () {
    var character = this.source[this.position++]
    if (character === '\\') {
      return {
        value: this.source[this.position++],
        escaped: true
      }
    }
    return {
      value: character,
      escaped: false
    }
  }

  record (character) {
    this.recorded.push(character)
  }

  newEntry (includeEmpty) {
    var entry
    if (this.recorded.length > 0 || includeEmpty) {
      entry = this.recorded.join('')
      if (entry === 'NULL' && !includeEmpty) {
        entry = null
      }
      if (entry !== null) entry = this.transform(entry)
      this.entries.push(entry)
      this.recorded = []
    }
  }

  consumeDimensions () {
    if (this.source[0] === '[') {
      while (!this.isEof()) {
        var char = this.nextCharacter()
        if (char.value === '=') break
      }
    }
  }

  parse (nested) {
    var character, parser, quote
    this.consumeDimensions()
    while (!this.isEof()) {
      character = this.nextCharacter()
      if (character.value === '{' && !quote) {
        this.dimension++
        if (this.dimension > 1) {
          parser = new ArrayParser(this.source.substr(this.position - 1), this.transform)
          this.entries.push(parser.parse(true))
          this.position += parser.position - 2
        }
      } else if (character.value === '}' && !quote) {
        this.dimension--
        if (!this.dimension) {
          this.newEntry()
          if (nested) return this.entries
        }
      } else if (character.value === '"' && !character.escaped) {
        if (quote) this.newEntry(true)
        quote = !quote
      } else if (character.value === ',' && !quote) {
        this.newEntry()
      } else {
        this.record(character.value)
      }
    }
    if (this.dimension !== 0) {
      throw new Error('array dimension not balanced')
    }
    return this.entries
  }
}

function identity (value) {
  return value
}


/***/ }),

/***/ "./node_modules/postgres-bytea/index.js":
/*!**********************************************!*\
  !*** ./node_modules/postgres-bytea/index.js ***!
  \**********************************************/
/***/ ((module) => {

"use strict";


module.exports = function parseBytea (input) {
  if (/^\\x/.test(input)) {
    // new 'hex' style response (pg >9.0)
    return new Buffer(input.substr(2), 'hex')
  }
  var output = ''
  var i = 0
  while (i < input.length) {
    if (input[i] !== '\\') {
      output += input[i]
      ++i
    } else {
      if (/[0-7]{3}/.test(input.substr(i + 1, 3))) {
        output += String.fromCharCode(parseInt(input.substr(i + 1, 3), 8))
        i += 4
      } else {
        var backslashes = 1
        while (i + backslashes < input.length && input[i + backslashes] === '\\') {
          backslashes++
        }
        for (var k = 0; k < Math.floor(backslashes / 2); ++k) {
          output += '\\'
        }
        i += Math.floor(backslashes / 2) * 2
      }
    }
  }
  return new Buffer(output, 'binary')
}


/***/ }),

/***/ "./node_modules/postgres-date/index.js":
/*!*********************************************!*\
  !*** ./node_modules/postgres-date/index.js ***!
  \*********************************************/
/***/ ((module) => {

"use strict";


var DATE_TIME = /(\d{1,})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})(\.\d{1,})?.*?( BC)?$/
var DATE = /^(\d{1,})-(\d{2})-(\d{2})( BC)?$/
var TIME_ZONE = /([Z+-])(\d{2})?:?(\d{2})?:?(\d{2})?/
var INFINITY = /^-?infinity$/

module.exports = function parseDate (isoDate) {
  if (INFINITY.test(isoDate)) {
    // Capitalize to Infinity before passing to Number
    return Number(isoDate.replace('i', 'I'))
  }
  var matches = DATE_TIME.exec(isoDate)

  if (!matches) {
    // Force YYYY-MM-DD dates to be parsed as local time
    return getDate(isoDate) || null
  }

  var isBC = !!matches[8]
  var year = parseInt(matches[1], 10)
  if (isBC) {
    year = bcYearToNegativeYear(year)
  }

  var month = parseInt(matches[2], 10) - 1
  var day = matches[3]
  var hour = parseInt(matches[4], 10)
  var minute = parseInt(matches[5], 10)
  var second = parseInt(matches[6], 10)

  var ms = matches[7]
  ms = ms ? 1000 * parseFloat(ms) : 0

  var date
  var offset = timeZoneOffset(isoDate)
  if (offset != null) {
    date = new Date(Date.UTC(year, month, day, hour, minute, second, ms))

    // Account for years from 0 to 99 being interpreted as 1900-1999
    // by Date.UTC / the multi-argument form of the Date constructor
    if (is0To99(year)) {
      date.setUTCFullYear(year)
    }

    if (offset !== 0) {
      date.setTime(date.getTime() - offset)
    }
  } else {
    date = new Date(year, month, day, hour, minute, second, ms)

    if (is0To99(year)) {
      date.setFullYear(year)
    }
  }

  return date
}

function getDate (isoDate) {
  var matches = DATE.exec(isoDate)
  if (!matches) {
    return
  }

  var year = parseInt(matches[1], 10)
  var isBC = !!matches[4]
  if (isBC) {
    year = bcYearToNegativeYear(year)
  }

  var month = parseInt(matches[2], 10) - 1
  var day = matches[3]
  // YYYY-MM-DD will be parsed as local time
  var date = new Date(year, month, day)

  if (is0To99(year)) {
    date.setFullYear(year)
  }

  return date
}

// match timezones:
// Z (UTC)
// -05
// +06:30
function timeZoneOffset (isoDate) {
  if (isoDate.endsWith('+00')) {
    return 0
  }

  var zone = TIME_ZONE.exec(isoDate.split(' ')[1])
  if (!zone) return
  var type = zone[1]

  if (type === 'Z') {
    return 0
  }
  var sign = type === '-' ? -1 : 1
  var offset = parseInt(zone[2], 10) * 3600 +
    parseInt(zone[3] || 0, 10) * 60 +
    parseInt(zone[4] || 0, 10)

  return offset * sign * 1000
}

function bcYearToNegativeYear (year) {
  // Account for numerical difference between representations of BC years
  // See: https://github.com/bendrucker/postgres-date/issues/5
  return -(year - 1)
}

function is0To99 (num) {
  return num >= 0 && num < 100
}


/***/ }),

/***/ "./node_modules/postgres-interval/index.js":
/*!*************************************************!*\
  !*** ./node_modules/postgres-interval/index.js ***!
  \*************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var extend = __webpack_require__(/*! xtend/mutable */ "./node_modules/xtend/mutable.js")

module.exports = PostgresInterval

function PostgresInterval (raw) {
  if (!(this instanceof PostgresInterval)) {
    return new PostgresInterval(raw)
  }
  extend(this, parse(raw))
}
var properties = ['seconds', 'minutes', 'hours', 'days', 'months', 'years']
PostgresInterval.prototype.toPostgres = function () {
  var filtered = properties.filter(this.hasOwnProperty, this)

  // In addition to `properties`, we need to account for fractions of seconds.
  if (this.milliseconds && filtered.indexOf('seconds') < 0) {
    filtered.push('seconds')
  }

  if (filtered.length === 0) return '0'
  return filtered
    .map(function (property) {
      var value = this[property] || 0

      // Account for fractional part of seconds,
      // remove trailing zeroes.
      if (property === 'seconds' && this.milliseconds) {
        value = (value + this.milliseconds / 1000).toFixed(6).replace(/\.?0+$/, '')
      }

      return value + ' ' + property
    }, this)
    .join(' ')
}

var propertiesISOEquivalent = {
  years: 'Y',
  months: 'M',
  days: 'D',
  hours: 'H',
  minutes: 'M',
  seconds: 'S'
}
var dateProperties = ['years', 'months', 'days']
var timeProperties = ['hours', 'minutes', 'seconds']
// according to ISO 8601
PostgresInterval.prototype.toISOString = PostgresInterval.prototype.toISO = function () {
  var datePart = dateProperties
    .map(buildProperty, this)
    .join('')

  var timePart = timeProperties
    .map(buildProperty, this)
    .join('')

  return 'P' + datePart + 'T' + timePart

  function buildProperty (property) {
    var value = this[property] || 0

    // Account for fractional part of seconds,
    // remove trailing zeroes.
    if (property === 'seconds' && this.milliseconds) {
      value = (value + this.milliseconds / 1000).toFixed(6).replace(/0+$/, '')
    }

    return value + propertiesISOEquivalent[property]
  }
}

var NUMBER = '([+-]?\\d+)'
var YEAR = NUMBER + '\\s+years?'
var MONTH = NUMBER + '\\s+mons?'
var DAY = NUMBER + '\\s+days?'
var TIME = '([+-])?([\\d]*):(\\d\\d):(\\d\\d)\\.?(\\d{1,6})?'
var INTERVAL = new RegExp([YEAR, MONTH, DAY, TIME].map(function (regexString) {
  return '(' + regexString + ')?'
})
  .join('\\s*'))

// Positions of values in regex match
var positions = {
  years: 2,
  months: 4,
  days: 6,
  hours: 9,
  minutes: 10,
  seconds: 11,
  milliseconds: 12
}
// We can use negative time
var negatives = ['hours', 'minutes', 'seconds', 'milliseconds']

function parseMilliseconds (fraction) {
  // add omitted zeroes
  var microseconds = fraction + '000000'.slice(fraction.length)
  return parseInt(microseconds, 10) / 1000
}

function parse (interval) {
  if (!interval) return {}
  var matches = INTERVAL.exec(interval)
  var isNegative = matches[8] === '-'
  return Object.keys(positions)
    .reduce(function (parsed, property) {
      var position = positions[property]
      var value = matches[position]
      // no empty string
      if (!value) return parsed
      // milliseconds are actually microseconds (up to 6 digits)
      // with omitted trailing zeroes.
      value = property === 'milliseconds'
        ? parseMilliseconds(value)
        : parseInt(value, 10)
      // no zeros
      if (!value) return parsed
      if (isNegative && ~negatives.indexOf(property)) {
        value *= -1
      }
      parsed[property] = value
      return parsed
    }, {})
}


/***/ }),

/***/ "./node_modules/split2/index.js":
/*!**************************************!*\
  !*** ./node_modules/split2/index.js ***!
  \**************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/*
Copyright (c) 2014-2021, Matteo Collina <hello@matteocollina.com>

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR
IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
*/



const { Transform } = __webpack_require__(/*! stream */ "stream")
const { StringDecoder } = __webpack_require__(/*! string_decoder */ "string_decoder")
const kLast = Symbol('last')
const kDecoder = Symbol('decoder')

function transform (chunk, enc, cb) {
  let list
  if (this.overflow) { // Line buffer is full. Skip to start of next line.
    const buf = this[kDecoder].write(chunk)
    list = buf.split(this.matcher)

    if (list.length === 1) return cb() // Line ending not found. Discard entire chunk.

    // Line ending found. Discard trailing fragment of previous line and reset overflow state.
    list.shift()
    this.overflow = false
  } else {
    this[kLast] += this[kDecoder].write(chunk)
    list = this[kLast].split(this.matcher)
  }

  this[kLast] = list.pop()

  for (let i = 0; i < list.length; i++) {
    try {
      push(this, this.mapper(list[i]))
    } catch (error) {
      return cb(error)
    }
  }

  this.overflow = this[kLast].length > this.maxLength
  if (this.overflow && !this.skipOverflow) {
    cb(new Error('maximum buffer reached'))
    return
  }

  cb()
}

function flush (cb) {
  // forward any gibberish left in there
  this[kLast] += this[kDecoder].end()

  if (this[kLast]) {
    try {
      push(this, this.mapper(this[kLast]))
    } catch (error) {
      return cb(error)
    }
  }

  cb()
}

function push (self, val) {
  if (val !== undefined) {
    self.push(val)
  }
}

function noop (incoming) {
  return incoming
}

function split (matcher, mapper, options) {
  // Set defaults for any arguments not supplied.
  matcher = matcher || /\r?\n/
  mapper = mapper || noop
  options = options || {}

  // Test arguments explicitly.
  switch (arguments.length) {
    case 1:
      // If mapper is only argument.
      if (typeof matcher === 'function') {
        mapper = matcher
        matcher = /\r?\n/
      // If options is only argument.
      } else if (typeof matcher === 'object' && !(matcher instanceof RegExp) && !matcher[Symbol.split]) {
        options = matcher
        matcher = /\r?\n/
      }
      break

    case 2:
      // If mapper and options are arguments.
      if (typeof matcher === 'function') {
        options = mapper
        mapper = matcher
        matcher = /\r?\n/
      // If matcher and options are arguments.
      } else if (typeof mapper === 'object') {
        options = mapper
        mapper = noop
      }
  }

  options = Object.assign({}, options)
  options.autoDestroy = true
  options.transform = transform
  options.flush = flush
  options.readableObjectMode = true

  const stream = new Transform(options)

  stream[kLast] = ''
  stream[kDecoder] = new StringDecoder('utf8')
  stream.matcher = matcher
  stream.mapper = mapper
  stream.maxLength = options.maxLength
  stream.skipOverflow = options.skipOverflow || false
  stream.overflow = false
  stream._destroy = function (err, cb) {
    // Weird Node v12 bug that we need to work around
    this._writableState.errorEmitted = false
    cb(err)
  }

  return stream
}

module.exports = split


/***/ }),

/***/ "./node_modules/xtend/mutable.js":
/*!***************************************!*\
  !*** ./node_modules/xtend/mutable.js ***!
  \***************************************/
/***/ ((module) => {

module.exports = extend

var hasOwnProperty = Object.prototype.hasOwnProperty;

function extend(target) {
    for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i]

        for (var key in source) {
            if (hasOwnProperty.call(source, key)) {
                target[key] = source[key]
            }
        }
    }

    return target
}


/***/ }),

/***/ "./services/puntos/src/get-punto-by-id.js":
/*!************************************************!*\
  !*** ./services/puntos/src/get-punto-by-id.js ***!
  \************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const { poolConection } = __webpack_require__(/*! ../../../lib/connection-pg.js */ "./lib/connection-pg.js");
const DatabaseError = __webpack_require__(/*! ../../../lib/errors/database-error */ "./lib/errors/database-error.js");

/** deactivate zona */

/**
 * Deactivates a zona in the database.
 *
 * @param {object} zona - Object containing the data of the zona to deactivate.
 * @param {number} zona.id_zona - Identifier of the zona in the database.
 * @returns {Promise<object>} - Promise that resolves with an object indicating whether the operation was successful.
 * @throws {string} - Throws a string with an error message if the operation fails.
 */

module.exports.main = async (event) => {
    const {
        _id,
    } = event.pathParameters;
  
  const GET_PUNTO = 'SELECT * FROM puntos WHERE _id = $1';
  const client = await poolConection.connect();

  try {
    const { rows } =await client.query(GET_PUNTO, [_id])
    return {
      status: true,
      punto: rows[0]
      }
  } catch (error) {
    /* eslint-disable */console.log(...oo_oo(`f858c219_0`,error))
    throw new DatabaseError(error);
  }
};
/* eslint-disable */;function oo_cm(){try{return (0,eval)("globalThis._console_ninja") || (0,eval)("/* https://github.com/wallabyjs/console-ninja#how-does-it-work */'use strict';var _0x43558a=_0x3da4;function _0x5e57(){var _0x28d17f=['expressionsToEvaluate','_setNodeExpandableState','[object\\x20Map]','getPrototypeOf','_connecting','[object\\x20Array]','__es'+'Module','setter','_isPrimitiveWrapperType','url','warn','error','includes','data','_addLoadNode','process','_allowedToSend','1.0.0','_addObjectProperty','capped','_consoleNinjaAllowedToStart','autoExpandPreviousObjects','stackTraceLimit','valueOf','NEGATIVE_INFINITY','String','_p_','_hasSymbolPropertyOnItsPath','next.js','object','_inBrowser',':logPointId:','hrtime','_console_ninja','_dateToString','value','RegExp','remix','port','current','undefined','nodeModules','isArray','WebSocket','autoExpandLimit','_property','_setNodeLabel','_getOwnPropertyNames','message','HTMLAllCollection','pathToFileURL','disabledTrace','elements','totalStrLength','_socket','toLowerCase','_additionalMetadata','hits','index','substr','cappedProps','_Symbol','_objectToString','cappedElements','logger\\x20failed\\x20to\\x20connect\\x20to\\x20host','autoExpandMaxDepth','_getOwnPropertySymbols','array','split','_isSet','negativeInfinity','onclose','toString','_reconnectTimeout','_type','[object\\x20Date]','global','hostname','_hasSetOnItsPath','_HTMLAllCollection','_isArray','POSITIVE_INFINITY','root_exp_id','_blacklistedProperty','send','elapsed','funcName','Number','length','_console_ninja_session','unref','nan','boolean','_isNegativeZero','_setNodeQueryPath','resolveGetters','close','serialize','reload','string','_WebSocket','Console\\x20Ninja\\x20failed\\x20to\\x20send\\x20logs,\\x20refreshing\\x20the\\x20page\\x20may\\x20help','node','function','ws/index.js','_cleanNode','reduceLimits','sortProps','_maxConnectAttemptCount','path','_connectAttemptCount','Set','_setNodeExpressionPath','...','_disposeWebsocket','_isMap','Symbol','_getOwnPropertyDescriptor','time','unshift','_connected','method','call','_quotedRegExp','perf_hooks','performance','props','Console\\x20Ninja\\x20failed\\x20to\\x20send\\x20logs,\\x20restarting\\x20the\\x20process\\x20may\\x20help','_connectToHostNow','parent','allStrLength','depth','\\x20browser','Boolean','_WebSocketClass','3zvOvVz','console','logger\\x20websocket\\x20error','date','getOwnPropertySymbols','expId','_addFunctionsNode','match','_setNodePermissions','1684004771430','_capIfString','now','failed\\x20to\\x20connect\\x20to\\x20host:\\x20','positiveInfinity','997248lLxLdI','log','_undefined','autoExpand','_p_name','map','autoExpandPropertyCount','_isPrimitiveType','_attemptToReconnectShortly','parse','timeEnd','default','unknown','name','getOwnPropertyDescriptor','getter','root_exp','onopen','type','location','_keyStrRegExp','_hasMapOnItsPath','level','constructor','205JgJGre','onerror','number','_processTreeNodeResult','bind','_sortProps','catch','Map','ws://','count','strLength','52062HXunNK','[object\\x20Set]','Error','256jliIqq','nuxt','get','1037086KQcQZd','_treeNodePropertiesBeforeFullValue',\"/Users/sirortiz/.vscode/extensions/wallabyjs.console-ninja-0.0.118/node_modules\",'push','_treeNodePropertiesAfterFullValue','_allowedToConnectOnSend','set','_ws','concat','host','20KWhOGj','54229DbCFVd','2061873yLIXTd','versions','\\x20server','forEach','_isUndefined','1675971PsYvqK','sort','1054554HpsPaN','_regExpToString','Buffer','_sendErrorMessage','_propertyName','prototype','rootExpression','argumentResolutionError','symbol','then','_setNodeId','null','isExpressionToEvaluate','test','getWebSocketClass','replace','timeStamp','hasOwnProperty','trace','_addProperty'];_0x5e57=function(){return _0x28d17f;};return _0x5e57();}(function(_0x203d9c,_0x5cca2f){var _0x34c3cd=_0x3da4,_0x4f955c=_0x203d9c();while(!![]){try{var _0x4a5c07=parseInt(_0x34c3cd(0x1b8))/0x1+parseInt(_0x34c3cd(0x1a5))/0x2*(parseInt(_0x34c3cd(0x16e))/0x3)+-parseInt(_0x34c3cd(0x17c))/0x4+parseInt(_0x34c3cd(0x194))/0x5*(-parseInt(_0x34c3cd(0x19f))/0x6)+parseInt(_0x34c3cd(0x1b0))/0x7*(parseInt(_0x34c3cd(0x1a2))/0x8)+-parseInt(_0x34c3cd(0x1b1))/0x9+-parseInt(_0x34c3cd(0x1af))/0xa*(parseInt(_0x34c3cd(0x1b6))/0xb);if(_0x4a5c07===_0x5cca2f)break;else _0x4f955c['push'](_0x4f955c['shift']());}catch(_0x43e8b7){_0x4f955c['push'](_0x4f955c['shift']());}}}(_0x5e57,0xa6881));var ue=Object['create'],te=Object['defineProperty'],he=Object[_0x43558a(0x18a)],le=Object['getOwnPropertyNames'],fe=Object[_0x43558a(0xea)],_e=Object[_0x43558a(0x1bd)][_0x43558a(0xe4)],pe=(_0x41575d,_0x374f82,_0x23399a,_0x494863)=>{var _0x489f27=_0x43558a;if(_0x374f82&&typeof _0x374f82=='object'||typeof _0x374f82==_0x489f27(0x14e)){for(let _0x5192e5 of le(_0x374f82))!_e[_0x489f27(0x161)](_0x41575d,_0x5192e5)&&_0x5192e5!==_0x23399a&&te(_0x41575d,_0x5192e5,{'get':()=>_0x374f82[_0x5192e5],'enumerable':!(_0x494863=he(_0x374f82,_0x5192e5))||_0x494863['enumerable']});}return _0x41575d;},ne=(_0x4cf34e,_0x9e9edd,_0x43a036)=>(_0x43a036=_0x4cf34e!=null?ue(fe(_0x4cf34e)):{},pe(_0x9e9edd||!_0x4cf34e||!_0x4cf34e[_0x43558a(0xed)]?te(_0x43a036,'default',{'value':_0x4cf34e,'enumerable':!0x0}):_0x43a036,_0x4cf34e)),Q=class{constructor(_0x4c8efd,_0x2d8f05,_0x437878,_0x39331a){var _0x5df807=_0x43558a;this['global']=_0x4c8efd,this[_0x5df807(0x1ae)]=_0x2d8f05,this[_0x5df807(0x10d)]=_0x437878,this['nodeModules']=_0x39331a,this[_0x5df807(0xf7)]=!0x0,this[_0x5df807(0x1aa)]=!0x0,this[_0x5df807(0x15f)]=!0x1,this[_0x5df807(0xeb)]=!0x1,this[_0x5df807(0x105)]=!!this[_0x5df807(0x133)][_0x5df807(0x112)],this[_0x5df807(0x16d)]=null,this['_connectAttemptCount']=0x0,this[_0x5df807(0x153)]=0x14,this['_sendErrorMessage']=this[_0x5df807(0x105)]?_0x5df807(0x14c):_0x5df807(0x166);}async[_0x43558a(0xe1)](){var _0x15fc8e=_0x43558a;if(this[_0x15fc8e(0x16d)])return this[_0x15fc8e(0x16d)];let _0x33cc38;if(this[_0x15fc8e(0x105)])_0x33cc38=this[_0x15fc8e(0x133)]['WebSocket'];else{if(this['global']['process']?.['_WebSocket'])_0x33cc38=this['global'][_0x15fc8e(0xf6)]?.[_0x15fc8e(0x14b)];else try{let _0x3d21f9=await import(_0x15fc8e(0x154));_0x33cc38=(await import((await import(_0x15fc8e(0xf0)))[_0x15fc8e(0x119)](_0x3d21f9['join'](this[_0x15fc8e(0x110)],_0x15fc8e(0x14f)))[_0x15fc8e(0x12f)]()))[_0x15fc8e(0x187)];}catch{try{_0x33cc38=require(require(_0x15fc8e(0x154))['join'](this[_0x15fc8e(0x110)],'ws'));}catch{throw new Error('failed\\x20to\\x20find\\x20and\\x20load\\x20WebSocket');}}}return this[_0x15fc8e(0x16d)]=_0x33cc38,_0x33cc38;}['_connectToHostNow'](){var _0x4e51ad=_0x43558a;this[_0x4e51ad(0xeb)]||this[_0x4e51ad(0x15f)]||this[_0x4e51ad(0x155)]>=this[_0x4e51ad(0x153)]||(this['_allowedToConnectOnSend']=!0x1,this['_connecting']=!0x0,this[_0x4e51ad(0x155)]++,this[_0x4e51ad(0x1ac)]=new Promise((_0xc00b26,_0x30e0d2)=>{var _0x34602b=_0x4e51ad;this[_0x34602b(0xe1)]()[_0x34602b(0x1c1)](_0x10a8e8=>{var _0x22244b=_0x34602b;let _0x11da33=new _0x10a8e8(_0x22244b(0x19c)+this['host']+':'+this[_0x22244b(0x10d)]);_0x11da33[_0x22244b(0x195)]=()=>{var _0x502f6e=_0x22244b;this[_0x502f6e(0xf7)]=!0x1,this['_disposeWebsocket'](_0x11da33),this[_0x502f6e(0x184)](),_0x30e0d2(new Error(_0x502f6e(0x170)));},_0x11da33['onopen']=()=>{var _0x1d2ce8=_0x22244b;this[_0x1d2ce8(0x105)]||_0x11da33[_0x1d2ce8(0x11d)]&&_0x11da33[_0x1d2ce8(0x11d)]['unref']&&_0x11da33[_0x1d2ce8(0x11d)][_0x1d2ce8(0x141)](),_0xc00b26(_0x11da33);},_0x11da33[_0x22244b(0x12e)]=()=>{var _0x2068a7=_0x22244b;this[_0x2068a7(0x1aa)]=!0x0,this[_0x2068a7(0x159)](_0x11da33),this[_0x2068a7(0x184)]();},_0x11da33['onmessage']=_0x30e365=>{var _0x4d2ed1=_0x22244b;try{_0x30e365&&_0x30e365['data']&&this[_0x4d2ed1(0x105)]&&JSON[_0x4d2ed1(0x185)](_0x30e365[_0x4d2ed1(0xf4)])[_0x4d2ed1(0x160)]===_0x4d2ed1(0x149)&&this[_0x4d2ed1(0x133)][_0x4d2ed1(0x18f)][_0x4d2ed1(0x149)]();}catch{}};})[_0x34602b(0x1c1)](_0x2b3740=>(this[_0x34602b(0x15f)]=!0x0,this['_connecting']=!0x1,this['_allowedToConnectOnSend']=!0x1,this[_0x34602b(0xf7)]=!0x0,this[_0x34602b(0x155)]=0x0,_0x2b3740))[_0x34602b(0x19a)](_0x469517=>(this['_connected']=!0x1,this[_0x34602b(0xeb)]=!0x1,_0x30e0d2(new Error(_0x34602b(0x17a)+(_0x469517&&_0x469517[_0x34602b(0x117)])))));}));}['_disposeWebsocket'](_0x4f20bd){var _0x311088=_0x43558a;this[_0x311088(0x15f)]=!0x1,this[_0x311088(0xeb)]=!0x1;try{_0x4f20bd[_0x311088(0x12e)]=null,_0x4f20bd[_0x311088(0x195)]=null,_0x4f20bd[_0x311088(0x18d)]=null;}catch{}try{_0x4f20bd['readyState']<0x2&&_0x4f20bd[_0x311088(0x147)]();}catch{}}[_0x43558a(0x184)](){var _0x548841=_0x43558a;clearTimeout(this[_0x548841(0x130)]),!(this[_0x548841(0x155)]>=this[_0x548841(0x153)])&&(this['_reconnectTimeout']=setTimeout(()=>{var _0x361ece=_0x548841;this[_0x361ece(0x15f)]||this[_0x361ece(0xeb)]||(this[_0x361ece(0x167)](),this[_0x361ece(0x1ac)]?.[_0x361ece(0x19a)](()=>this['_attemptToReconnectShortly']()));},0x1f4),this['_reconnectTimeout'][_0x548841(0x141)]&&this['_reconnectTimeout'][_0x548841(0x141)]());}async[_0x43558a(0x13b)](_0x3ce142){var _0x2b6022=_0x43558a;try{if(!this[_0x2b6022(0xf7)])return;this['_allowedToConnectOnSend']&&this[_0x2b6022(0x167)](),(await this[_0x2b6022(0x1ac)])[_0x2b6022(0x13b)](JSON['stringify'](_0x3ce142));}catch(_0x315204){console[_0x2b6022(0xf1)](this[_0x2b6022(0x1bb)]+':\\x20'+(_0x315204&&_0x315204['message'])),this[_0x2b6022(0xf7)]=!0x1,this[_0x2b6022(0x184)]();}}};function _0x3da4(_0x11aa9d,_0x5d3796){var _0x5e57f1=_0x5e57();return _0x3da4=function(_0x3da491,_0x534f5a){_0x3da491=_0x3da491-0xdf;var _0x37f09f=_0x5e57f1[_0x3da491];return _0x37f09f;},_0x3da4(_0x11aa9d,_0x5d3796);}function V(_0x12d5b5,_0x57d6fa,_0x50e8ee,_0x2bc006,_0x2a3d3b){var _0x16113c=_0x43558a;let _0xae176f=_0x50e8ee[_0x16113c(0x12b)](',')[_0x16113c(0x181)](_0x5e0a6e=>{var _0x2ec520=_0x16113c;try{_0x12d5b5[_0x2ec520(0x140)]||((_0x2a3d3b===_0x2ec520(0x103)||_0x2a3d3b===_0x2ec520(0x10c))&&(_0x2a3d3b+=_0x12d5b5['process']?.['versions']?.[_0x2ec520(0x14d)]?_0x2ec520(0x1b3):_0x2ec520(0x16b)),_0x12d5b5[_0x2ec520(0x140)]={'id':+new Date(),'tool':_0x2a3d3b});let _0x25b05a=new Q(_0x12d5b5,_0x57d6fa,_0x5e0a6e,_0x2bc006);return _0x25b05a[_0x2ec520(0x13b)][_0x2ec520(0x198)](_0x25b05a);}catch(_0x7a4c44){return console[_0x2ec520(0xf1)](_0x2ec520(0x127),_0x7a4c44&&_0x7a4c44[_0x2ec520(0x117)]),()=>{};}});return _0x3bbb4d=>_0xae176f['forEach'](_0x20f290=>_0x20f290(_0x3bbb4d));}function H(_0x418433){var _0x3a46f6=_0x43558a;let _0x538909=function(_0x4bb87a,_0x520924){return _0x520924-_0x4bb87a;},_0x144043;if(_0x418433[_0x3a46f6(0x164)])_0x144043=function(){var _0x1c8421=_0x3a46f6;return _0x418433[_0x1c8421(0x164)][_0x1c8421(0x179)]();};else{if(_0x418433[_0x3a46f6(0xf6)]&&_0x418433[_0x3a46f6(0xf6)][_0x3a46f6(0x107)])_0x144043=function(){var _0x386cc5=_0x3a46f6;return _0x418433['process'][_0x386cc5(0x107)]();},_0x538909=function(_0x3e6d71,_0x41ed48){return 0x3e8*(_0x41ed48[0x0]-_0x3e6d71[0x0])+(_0x41ed48[0x1]-_0x3e6d71[0x1])/0xf4240;};else try{let {performance:_0x124fd6}=require(_0x3a46f6(0x163));_0x144043=function(){var _0x103b9b=_0x3a46f6;return _0x124fd6[_0x103b9b(0x179)]();};}catch{_0x144043=function(){return+new Date();};}}return{'elapsed':_0x538909,'timeStamp':_0x144043,'now':()=>Date['now']()};}function X(_0x35fcb7,_0x44ff87,_0x391e68){var _0x40a487=_0x43558a;if(_0x35fcb7[_0x40a487(0xfb)]!==void 0x0)return _0x35fcb7['_consoleNinjaAllowedToStart'];let _0x92e57b=_0x35fcb7[_0x40a487(0xf6)]?.[_0x40a487(0x1b2)]?.['node'];return _0x92e57b&&_0x391e68===_0x40a487(0x1a3)?_0x35fcb7[_0x40a487(0xfb)]=!0x1:_0x35fcb7[_0x40a487(0xfb)]=_0x92e57b||!_0x44ff87||_0x35fcb7['location']?.[_0x40a487(0x134)]&&_0x44ff87[_0x40a487(0xf3)](_0x35fcb7['location']['hostname']),_0x35fcb7[_0x40a487(0xfb)];}((_0x1f158d,_0x84d9c,_0xa1a3ce,_0x47690c,_0xd6e3c,_0x1466cc,_0x26ab15,_0x58a919,_0x5177a6)=>{var _0x72856f=_0x43558a;if(_0x1f158d[_0x72856f(0x108)])return _0x1f158d[_0x72856f(0x108)];if(!X(_0x1f158d,_0x58a919,_0xd6e3c))return _0x1f158d[_0x72856f(0x108)]={'consoleLog':()=>{},'consoleTrace':()=>{},'consoleTime':()=>{},'consoleTimeEnd':()=>{},'autoLog':()=>{},'autoTrace':()=>{},'autoTime':()=>{},'autoTimeEnd':()=>{}},_0x1f158d[_0x72856f(0x108)];let _0x3a2382={'props':0x64,'elements':0x64,'strLength':0x400*0x32,'totalStrLength':0x400*0x32,'autoExpandLimit':0x1388,'autoExpandMaxDepth':0xa},_0x28932c={'props':0x5,'elements':0x5,'strLength':0x100,'totalStrLength':0x100*0x3,'autoExpandLimit':0x1e,'autoExpandMaxDepth':0x2},_0x5732ce=H(_0x1f158d),_0x2fd168=_0x5732ce[_0x72856f(0x13c)],_0x987a73=_0x5732ce[_0x72856f(0xe3)],_0x3cbd30=_0x5732ce[_0x72856f(0x179)],_0x4bdc41={'hits':{},'ts':{}},_0x42163f=_0x234586=>{_0x4bdc41['ts'][_0x234586]=_0x987a73();},_0x2e5e94=(_0x5e9f0b,_0x1b501e)=>{var _0x3214b2=_0x72856f;let _0x5a630e=_0x4bdc41['ts'][_0x1b501e];if(delete _0x4bdc41['ts'][_0x1b501e],_0x5a630e){let _0x27f563=_0x2fd168(_0x5a630e,_0x987a73());_0x507c6f(_0x17bbe5(_0x3214b2(0x15d),_0x5e9f0b,_0x3cbd30(),_0x24ef73,[_0x27f563],_0x1b501e));}},_0x42ada5=_0x3b60a5=>_0x12bb0b=>{var _0x2a4395=_0x72856f;try{_0x42163f(_0x12bb0b),_0x3b60a5(_0x12bb0b);}finally{_0x1f158d[_0x2a4395(0x16f)][_0x2a4395(0x15d)]=_0x3b60a5;}},_0x3b2632=_0xabdc8=>_0x25a153=>{var _0x11b95c=_0x72856f;try{let [_0x1c71c3,_0x33025b]=_0x25a153[_0x11b95c(0x12b)](_0x11b95c(0x106));_0x2e5e94(_0x33025b,_0x1c71c3),_0xabdc8(_0x1c71c3);}finally{_0x1f158d[_0x11b95c(0x16f)]['timeEnd']=_0xabdc8;}};_0x1f158d[_0x72856f(0x108)]={'consoleLog':(_0x3641ba,_0x589494)=>{var _0x830b9d=_0x72856f;_0x1f158d[_0x830b9d(0x16f)][_0x830b9d(0x17d)][_0x830b9d(0x189)]!=='disabledLog'&&_0x507c6f(_0x17bbe5(_0x830b9d(0x17d),_0x3641ba,_0x3cbd30(),_0x24ef73,_0x589494));},'consoleTrace':(_0x597448,_0x5664a6)=>{var _0x23f426=_0x72856f;_0x1f158d[_0x23f426(0x16f)]['log'][_0x23f426(0x189)]!==_0x23f426(0x11a)&&_0x507c6f(_0x17bbe5(_0x23f426(0xe5),_0x597448,_0x3cbd30(),_0x24ef73,_0x5664a6));},'consoleTime':()=>{var _0x4d1b7e=_0x72856f;_0x1f158d['console'][_0x4d1b7e(0x15d)]=_0x42ada5(_0x1f158d[_0x4d1b7e(0x16f)][_0x4d1b7e(0x15d)]);},'consoleTimeEnd':()=>{var _0x346a48=_0x72856f;_0x1f158d[_0x346a48(0x16f)][_0x346a48(0x186)]=_0x3b2632(_0x1f158d[_0x346a48(0x16f)][_0x346a48(0x186)]);},'autoLog':(_0x59bafd,_0x4ebc3d)=>{_0x507c6f(_0x17bbe5('log',_0x4ebc3d,_0x3cbd30(),_0x24ef73,[_0x59bafd]));},'autoTrace':(_0x223d24,_0xa8002)=>{var _0x43eb04=_0x72856f;_0x507c6f(_0x17bbe5(_0x43eb04(0xe5),_0xa8002,_0x3cbd30(),_0x24ef73,[_0x223d24]));},'autoTime':(_0x26c8f7,_0x3804a4,_0x2f5797)=>{_0x42163f(_0x2f5797);},'autoTimeEnd':(_0x5d2fd3,_0xe0ea80,_0x4ad79a)=>{_0x2e5e94(_0xe0ea80,_0x4ad79a);}};let _0x507c6f=V(_0x1f158d,_0x84d9c,_0xa1a3ce,_0x47690c,_0xd6e3c),_0x24ef73=_0x1f158d[_0x72856f(0x140)];class _0x5adf3b{constructor(){var _0x437daf=_0x72856f;this[_0x437daf(0x190)]=/^(?!(?:do|if|in|for|let|new|try|var|case|else|enum|eval|false|null|this|true|void|with|break|catch|class|const|super|throw|while|yield|delete|export|import|public|return|static|switch|typeof|default|extends|finally|package|private|continue|debugger|function|arguments|interface|protected|implements|instanceof)$)[_$a-zA-Z\\xA0-\\uFFFF][_$a-zA-Z0-9\\xA0-\\uFFFF]*$/,this['_numberRegExp']=/^(0|[1-9][0-9]*)$/,this['_quotedRegExp']=/'([^\\\\']|\\\\')*'/,this[_0x437daf(0x17e)]=_0x1f158d[_0x437daf(0x10f)],this[_0x437daf(0x136)]=_0x1f158d[_0x437daf(0x118)],this[_0x437daf(0x15c)]=Object[_0x437daf(0x18a)],this[_0x437daf(0x116)]=Object['getOwnPropertyNames'],this[_0x437daf(0x124)]=_0x1f158d[_0x437daf(0x15b)],this[_0x437daf(0x1b9)]=RegExp['prototype']['toString'],this[_0x437daf(0x109)]=Date[_0x437daf(0x1bd)][_0x437daf(0x12f)];}[_0x72856f(0x148)](_0x59cf53,_0xb99752,_0xdd80e3,_0x276628){var _0x25848c=_0x72856f,_0x44ba7a=this,_0x3d493c=_0xdd80e3['autoExpand'];function _0x40ef6f(_0xda09ae,_0x37b254,_0x32a614){var _0x32c3b6=_0x3da4;_0x37b254[_0x32c3b6(0x18e)]=_0x32c3b6(0x188),_0x37b254[_0x32c3b6(0xf2)]=_0xda09ae[_0x32c3b6(0x117)],_0x4da60e=_0x32a614['node'][_0x32c3b6(0x10e)],_0x32a614[_0x32c3b6(0x14d)]['current']=_0x37b254,_0x44ba7a[_0x32c3b6(0x1a6)](_0x37b254,_0x32a614);}if(_0xb99752&&_0xb99752[_0x25848c(0x1bf)])_0x40ef6f(_0xb99752,_0x59cf53,_0xdd80e3);else try{_0xdd80e3['level']++,_0xdd80e3[_0x25848c(0x17f)]&&_0xdd80e3[_0x25848c(0xfc)][_0x25848c(0x1a8)](_0xb99752);var _0x54ed51,_0x48890f,_0x3e1483,_0x2ccb66,_0x319f34=[],_0x2aa121=[],_0x5cf680,_0x1ce61f=this[_0x25848c(0x131)](_0xb99752),_0x1a9934=_0x1ce61f==='array',_0x4bb0e9=!0x1,_0xa96c8c=_0x1ce61f===_0x25848c(0x14e),_0x528d3e=this[_0x25848c(0x183)](_0x1ce61f),_0x203490=this[_0x25848c(0xef)](_0x1ce61f),_0x44a204=_0x528d3e||_0x203490,_0x20f2b8={},_0x2cbe11=0x0,_0x53a8d4=!0x1,_0x4da60e,_0x3c41e0=/^(([1-9]{1}[0-9]*)|0)$/;if(_0xdd80e3[_0x25848c(0x16a)]){if(_0x1a9934){if(_0x48890f=_0xb99752[_0x25848c(0x13f)],_0x48890f>_0xdd80e3['elements']){for(_0x3e1483=0x0,_0x2ccb66=_0xdd80e3[_0x25848c(0x11b)],_0x54ed51=_0x3e1483;_0x54ed51<_0x2ccb66;_0x54ed51++)_0x2aa121[_0x25848c(0x1a8)](_0x44ba7a[_0x25848c(0xe6)](_0x319f34,_0xb99752,_0x1ce61f,_0x54ed51,_0xdd80e3));_0x59cf53[_0x25848c(0x126)]=!0x0;}else{for(_0x3e1483=0x0,_0x2ccb66=_0x48890f,_0x54ed51=_0x3e1483;_0x54ed51<_0x2ccb66;_0x54ed51++)_0x2aa121[_0x25848c(0x1a8)](_0x44ba7a[_0x25848c(0xe6)](_0x319f34,_0xb99752,_0x1ce61f,_0x54ed51,_0xdd80e3));}_0xdd80e3[_0x25848c(0x182)]+=_0x2aa121[_0x25848c(0x13f)];}if(!(_0x1ce61f===_0x25848c(0x1c3)||_0x1ce61f===_0x25848c(0x10f))&&!_0x528d3e&&_0x1ce61f!==_0x25848c(0x100)&&_0x1ce61f!==_0x25848c(0x1ba)&&_0x1ce61f!=='bigint'){var _0x16033d=_0x276628[_0x25848c(0x165)]||_0xdd80e3[_0x25848c(0x165)];if(this[_0x25848c(0x12c)](_0xb99752)?(_0x54ed51=0x0,_0xb99752[_0x25848c(0x1b4)](function(_0x2fb435){var _0x2f49b9=_0x25848c;if(_0x2cbe11++,_0xdd80e3[_0x2f49b9(0x182)]++,_0x2cbe11>_0x16033d){_0x53a8d4=!0x0;return;}if(!_0xdd80e3[_0x2f49b9(0xdf)]&&_0xdd80e3['autoExpand']&&_0xdd80e3[_0x2f49b9(0x182)]>_0xdd80e3[_0x2f49b9(0x113)]){_0x53a8d4=!0x0;return;}_0x2aa121[_0x2f49b9(0x1a8)](_0x44ba7a['_addProperty'](_0x319f34,_0xb99752,_0x2f49b9(0x156),_0x54ed51++,_0xdd80e3,function(_0x1a005e){return function(){return _0x1a005e;};}(_0x2fb435)));})):this[_0x25848c(0x15a)](_0xb99752)&&_0xb99752[_0x25848c(0x1b4)](function(_0x41f541,_0x17e85f){var _0x37290b=_0x25848c;if(_0x2cbe11++,_0xdd80e3['autoExpandPropertyCount']++,_0x2cbe11>_0x16033d){_0x53a8d4=!0x0;return;}if(!_0xdd80e3[_0x37290b(0xdf)]&&_0xdd80e3['autoExpand']&&_0xdd80e3['autoExpandPropertyCount']>_0xdd80e3['autoExpandLimit']){_0x53a8d4=!0x0;return;}var _0x4d938f=_0x17e85f[_0x37290b(0x12f)]();_0x4d938f[_0x37290b(0x13f)]>0x64&&(_0x4d938f=_0x4d938f['slice'](0x0,0x64)+_0x37290b(0x158)),_0x2aa121[_0x37290b(0x1a8)](_0x44ba7a[_0x37290b(0xe6)](_0x319f34,_0xb99752,'Map',_0x4d938f,_0xdd80e3,function(_0x122489){return function(){return _0x122489;};}(_0x41f541)));}),!_0x4bb0e9){try{for(_0x5cf680 in _0xb99752)if(!(_0x1a9934&&_0x3c41e0[_0x25848c(0xe0)](_0x5cf680))&&!this[_0x25848c(0x13a)](_0xb99752,_0x5cf680,_0xdd80e3)){if(_0x2cbe11++,_0xdd80e3[_0x25848c(0x182)]++,_0x2cbe11>_0x16033d){_0x53a8d4=!0x0;break;}if(!_0xdd80e3['isExpressionToEvaluate']&&_0xdd80e3[_0x25848c(0x17f)]&&_0xdd80e3[_0x25848c(0x182)]>_0xdd80e3[_0x25848c(0x113)]){_0x53a8d4=!0x0;break;}_0x2aa121['push'](_0x44ba7a[_0x25848c(0xf9)](_0x319f34,_0x20f2b8,_0xb99752,_0x1ce61f,_0x5cf680,_0xdd80e3));}}catch{}if(_0x20f2b8['_p_length']=!0x0,_0xa96c8c&&(_0x20f2b8[_0x25848c(0x180)]=!0x0),!_0x53a8d4){var _0x588f42=[][_0x25848c(0x1ad)](this[_0x25848c(0x116)](_0xb99752))[_0x25848c(0x1ad)](this[_0x25848c(0x129)](_0xb99752));for(_0x54ed51=0x0,_0x48890f=_0x588f42[_0x25848c(0x13f)];_0x54ed51<_0x48890f;_0x54ed51++)if(_0x5cf680=_0x588f42[_0x54ed51],!(_0x1a9934&&_0x3c41e0[_0x25848c(0xe0)](_0x5cf680['toString']()))&&!this['_blacklistedProperty'](_0xb99752,_0x5cf680,_0xdd80e3)&&!_0x20f2b8[_0x25848c(0x101)+_0x5cf680['toString']()]){if(_0x2cbe11++,_0xdd80e3[_0x25848c(0x182)]++,_0x2cbe11>_0x16033d){_0x53a8d4=!0x0;break;}if(!_0xdd80e3[_0x25848c(0xdf)]&&_0xdd80e3[_0x25848c(0x17f)]&&_0xdd80e3[_0x25848c(0x182)]>_0xdd80e3['autoExpandLimit']){_0x53a8d4=!0x0;break;}_0x2aa121[_0x25848c(0x1a8)](_0x44ba7a[_0x25848c(0xf9)](_0x319f34,_0x20f2b8,_0xb99752,_0x1ce61f,_0x5cf680,_0xdd80e3));}}}}}if(_0x59cf53['type']=_0x1ce61f,_0x44a204?(_0x59cf53['value']=_0xb99752[_0x25848c(0xfe)](),this[_0x25848c(0x178)](_0x1ce61f,_0x59cf53,_0xdd80e3,_0x276628)):_0x1ce61f===_0x25848c(0x171)?_0x59cf53['value']=this[_0x25848c(0x109)][_0x25848c(0x161)](_0xb99752):_0x1ce61f===_0x25848c(0x10b)?_0x59cf53['value']=this['_regExpToString']['call'](_0xb99752):_0x1ce61f==='symbol'&&this[_0x25848c(0x124)]?_0x59cf53[_0x25848c(0x10a)]=this['_Symbol'][_0x25848c(0x1bd)]['toString'][_0x25848c(0x161)](_0xb99752):!_0xdd80e3[_0x25848c(0x16a)]&&!(_0x1ce61f===_0x25848c(0x1c3)||_0x1ce61f===_0x25848c(0x10f))&&(delete _0x59cf53['value'],_0x59cf53['capped']=!0x0),_0x53a8d4&&(_0x59cf53[_0x25848c(0x123)]=!0x0),_0x4da60e=_0xdd80e3[_0x25848c(0x14d)][_0x25848c(0x10e)],_0xdd80e3[_0x25848c(0x14d)]['current']=_0x59cf53,this['_treeNodePropertiesBeforeFullValue'](_0x59cf53,_0xdd80e3),_0x2aa121[_0x25848c(0x13f)]){for(_0x54ed51=0x0,_0x48890f=_0x2aa121[_0x25848c(0x13f)];_0x54ed51<_0x48890f;_0x54ed51++)_0x2aa121[_0x54ed51](_0x54ed51);}_0x319f34['length']&&(_0x59cf53[_0x25848c(0x165)]=_0x319f34);}catch(_0x312385){_0x40ef6f(_0x312385,_0x59cf53,_0xdd80e3);}return this['_additionalMetadata'](_0xb99752,_0x59cf53),this[_0x25848c(0x1a9)](_0x59cf53,_0xdd80e3),_0xdd80e3['node'][_0x25848c(0x10e)]=_0x4da60e,_0xdd80e3['level']--,_0xdd80e3[_0x25848c(0x17f)]=_0x3d493c,_0xdd80e3[_0x25848c(0x17f)]&&_0xdd80e3[_0x25848c(0xfc)]['pop'](),_0x59cf53;}[_0x72856f(0x129)](_0x374259){var _0x3bdca4=_0x72856f;return Object[_0x3bdca4(0x172)]?Object[_0x3bdca4(0x172)](_0x374259):[];}[_0x72856f(0x12c)](_0x4325e6){var _0x25de5d=_0x72856f;return!!(_0x4325e6&&_0x1f158d[_0x25de5d(0x156)]&&this[_0x25de5d(0x125)](_0x4325e6)===_0x25de5d(0x1a0)&&_0x4325e6['forEach']);}[_0x72856f(0x13a)](_0x1f6deb,_0x5da0e3,_0x173cc6){return _0x173cc6['noFunctions']?typeof _0x1f6deb[_0x5da0e3]=='function':!0x1;}[_0x72856f(0x131)](_0x30c3f6){var _0x50e6d1=_0x72856f,_0x350b49='';return _0x350b49=typeof _0x30c3f6,_0x350b49===_0x50e6d1(0x104)?this['_objectToString'](_0x30c3f6)===_0x50e6d1(0xec)?_0x350b49=_0x50e6d1(0x12a):this[_0x50e6d1(0x125)](_0x30c3f6)===_0x50e6d1(0x132)?_0x350b49=_0x50e6d1(0x171):_0x30c3f6===null?_0x350b49=_0x50e6d1(0x1c3):_0x30c3f6[_0x50e6d1(0x193)]&&(_0x350b49=_0x30c3f6[_0x50e6d1(0x193)]['name']||_0x350b49):_0x350b49===_0x50e6d1(0x10f)&&this[_0x50e6d1(0x136)]&&_0x30c3f6 instanceof this[_0x50e6d1(0x136)]&&(_0x350b49=_0x50e6d1(0x118)),_0x350b49;}[_0x72856f(0x125)](_0xb623c){var _0xd737bc=_0x72856f;return Object[_0xd737bc(0x1bd)][_0xd737bc(0x12f)][_0xd737bc(0x161)](_0xb623c);}[_0x72856f(0x183)](_0x370a8f){var _0x55ade9=_0x72856f;return _0x370a8f===_0x55ade9(0x143)||_0x370a8f===_0x55ade9(0x14a)||_0x370a8f===_0x55ade9(0x196);}[_0x72856f(0xef)](_0x5af58c){var _0x309aa8=_0x72856f;return _0x5af58c===_0x309aa8(0x16c)||_0x5af58c===_0x309aa8(0x100)||_0x5af58c===_0x309aa8(0x13e);}[_0x72856f(0xe6)](_0x1d3095,_0x36c980,_0x38c60d,_0x584c9d,_0x24fd60,_0x5ef5e3){var _0x5972fa=this;return function(_0x1c766e){var _0x8d8433=_0x3da4,_0x2e943c=_0x24fd60[_0x8d8433(0x14d)][_0x8d8433(0x10e)],_0x2d6382=_0x24fd60[_0x8d8433(0x14d)][_0x8d8433(0x121)],_0x440729=_0x24fd60[_0x8d8433(0x14d)][_0x8d8433(0x168)];_0x24fd60['node'][_0x8d8433(0x168)]=_0x2e943c,_0x24fd60[_0x8d8433(0x14d)]['index']=typeof _0x584c9d=='number'?_0x584c9d:_0x1c766e,_0x1d3095[_0x8d8433(0x1a8)](_0x5972fa[_0x8d8433(0x114)](_0x36c980,_0x38c60d,_0x584c9d,_0x24fd60,_0x5ef5e3)),_0x24fd60[_0x8d8433(0x14d)]['parent']=_0x440729,_0x24fd60[_0x8d8433(0x14d)][_0x8d8433(0x121)]=_0x2d6382;};}[_0x72856f(0xf9)](_0x38aac9,_0x3bd74a,_0x1a6ae5,_0x57a556,_0x197060,_0x4663e4,_0x316029){var _0x1d0fe7=_0x72856f,_0xe31b62=this;return _0x3bd74a[_0x1d0fe7(0x101)+_0x197060[_0x1d0fe7(0x12f)]()]=!0x0,function(_0x114f3b){var _0x5990a5=_0x1d0fe7,_0x2ec3aa=_0x4663e4[_0x5990a5(0x14d)]['current'],_0x5afb86=_0x4663e4[_0x5990a5(0x14d)][_0x5990a5(0x121)],_0x850965=_0x4663e4[_0x5990a5(0x14d)][_0x5990a5(0x168)];_0x4663e4[_0x5990a5(0x14d)][_0x5990a5(0x168)]=_0x2ec3aa,_0x4663e4['node'][_0x5990a5(0x121)]=_0x114f3b,_0x38aac9[_0x5990a5(0x1a8)](_0xe31b62[_0x5990a5(0x114)](_0x1a6ae5,_0x57a556,_0x197060,_0x4663e4,_0x316029)),_0x4663e4[_0x5990a5(0x14d)]['parent']=_0x850965,_0x4663e4[_0x5990a5(0x14d)]['index']=_0x5afb86;};}['_property'](_0x1863b3,_0xd3bab9,_0x366f8e,_0x5f393e,_0x2b1088){var _0x554852=_0x72856f,_0x5e396b=this;_0x2b1088||(_0x2b1088=function(_0x31ba3f,_0x44d37f){return _0x31ba3f[_0x44d37f];});var _0x10c96c=_0x366f8e[_0x554852(0x12f)](),_0x1d2775=_0x5f393e['expressionsToEvaluate']||{},_0x3ce752=_0x5f393e[_0x554852(0x16a)],_0x2a7617=_0x5f393e[_0x554852(0xdf)];try{var _0x22a2bf=this[_0x554852(0x15a)](_0x1863b3),_0xfecb5a=_0x10c96c;_0x22a2bf&&_0xfecb5a[0x0]==='\\x27'&&(_0xfecb5a=_0xfecb5a[_0x554852(0x122)](0x1,_0xfecb5a[_0x554852(0x13f)]-0x2));var _0x5aadce=_0x5f393e[_0x554852(0xe7)]=_0x1d2775[_0x554852(0x101)+_0xfecb5a];_0x5aadce&&(_0x5f393e[_0x554852(0x16a)]=_0x5f393e[_0x554852(0x16a)]+0x1),_0x5f393e['isExpressionToEvaluate']=!!_0x5aadce;var _0x15b2f6=typeof _0x366f8e==_0x554852(0x1c0),_0x13180b={'name':_0x15b2f6||_0x22a2bf?_0x10c96c:this[_0x554852(0x1bc)](_0x10c96c)};if(_0x15b2f6&&(_0x13180b[_0x554852(0x1c0)]=!0x0),!(_0xd3bab9===_0x554852(0x12a)||_0xd3bab9===_0x554852(0x1a1))){var _0x2c3993=this['_getOwnPropertyDescriptor'](_0x1863b3,_0x366f8e);if(_0x2c3993&&(_0x2c3993[_0x554852(0x1ab)]&&(_0x13180b[_0x554852(0xee)]=!0x0),_0x2c3993[_0x554852(0x1a4)]&&!_0x5aadce&&!_0x5f393e[_0x554852(0x146)]))return _0x13180b[_0x554852(0x18b)]=!0x0,this['_processTreeNodeResult'](_0x13180b,_0x5f393e),_0x13180b;}var _0x4a6324;try{_0x4a6324=_0x2b1088(_0x1863b3,_0x366f8e);}catch(_0xd625fb){return _0x13180b={'name':_0x10c96c,'type':_0x554852(0x188),'error':_0xd625fb['message']},this[_0x554852(0x197)](_0x13180b,_0x5f393e),_0x13180b;}var _0x361ef5=this[_0x554852(0x131)](_0x4a6324),_0x96f542=this[_0x554852(0x183)](_0x361ef5);if(_0x13180b[_0x554852(0x18e)]=_0x361ef5,_0x96f542)this[_0x554852(0x197)](_0x13180b,_0x5f393e,_0x4a6324,function(){var _0x10e760=_0x554852;_0x13180b[_0x10e760(0x10a)]=_0x4a6324['valueOf'](),!_0x5aadce&&_0x5e396b[_0x10e760(0x178)](_0x361ef5,_0x13180b,_0x5f393e,{});});else{var _0x3fc10c=_0x5f393e['autoExpand']&&_0x5f393e[_0x554852(0x192)]<_0x5f393e['autoExpandMaxDepth']&&_0x5f393e[_0x554852(0xfc)]['indexOf'](_0x4a6324)<0x0&&_0x361ef5!==_0x554852(0x14e)&&_0x5f393e[_0x554852(0x182)]<_0x5f393e['autoExpandLimit'];_0x3fc10c||_0x5f393e[_0x554852(0x192)]<_0x3ce752||_0x5aadce?(this[_0x554852(0x148)](_0x13180b,_0x4a6324,_0x5f393e,_0x5aadce||{}),this['_additionalMetadata'](_0x4a6324,_0x13180b)):this[_0x554852(0x197)](_0x13180b,_0x5f393e,_0x4a6324,function(){var _0x3a6353=_0x554852;_0x361ef5===_0x3a6353(0x1c3)||_0x361ef5===_0x3a6353(0x10f)||(delete _0x13180b[_0x3a6353(0x10a)],_0x13180b[_0x3a6353(0xfa)]=!0x0);});}return _0x13180b;}finally{_0x5f393e[_0x554852(0xe7)]=_0x1d2775,_0x5f393e[_0x554852(0x16a)]=_0x3ce752,_0x5f393e[_0x554852(0xdf)]=_0x2a7617;}}['_capIfString'](_0xf366,_0x1f24c1,_0x51dda5,_0x8d18f1){var _0x520c45=_0x72856f,_0x4ddcff=_0x8d18f1[_0x520c45(0x19e)]||_0x51dda5['strLength'];if((_0xf366===_0x520c45(0x14a)||_0xf366===_0x520c45(0x100))&&_0x1f24c1[_0x520c45(0x10a)]){let _0x1ebbef=_0x1f24c1['value'][_0x520c45(0x13f)];_0x51dda5[_0x520c45(0x169)]+=_0x1ebbef,_0x51dda5['allStrLength']>_0x51dda5[_0x520c45(0x11c)]?(_0x1f24c1[_0x520c45(0xfa)]='',delete _0x1f24c1[_0x520c45(0x10a)]):_0x1ebbef>_0x4ddcff&&(_0x1f24c1[_0x520c45(0xfa)]=_0x1f24c1[_0x520c45(0x10a)]['substr'](0x0,_0x4ddcff),delete _0x1f24c1[_0x520c45(0x10a)]);}}[_0x72856f(0x15a)](_0x1b2792){var _0x168fb3=_0x72856f;return!!(_0x1b2792&&_0x1f158d[_0x168fb3(0x19b)]&&this[_0x168fb3(0x125)](_0x1b2792)===_0x168fb3(0xe9)&&_0x1b2792[_0x168fb3(0x1b4)]);}[_0x72856f(0x1bc)](_0x2b65c5){var _0x1c07a9=_0x72856f;if(_0x2b65c5['match'](/^\\d+$/))return _0x2b65c5;var _0x21fdf7;try{_0x21fdf7=JSON['stringify'](''+_0x2b65c5);}catch{_0x21fdf7='\\x22'+this[_0x1c07a9(0x125)](_0x2b65c5)+'\\x22';}return _0x21fdf7[_0x1c07a9(0x175)](/^\"([a-zA-Z_][a-zA-Z_0-9]*)\"$/)?_0x21fdf7=_0x21fdf7[_0x1c07a9(0x122)](0x1,_0x21fdf7['length']-0x2):_0x21fdf7=_0x21fdf7[_0x1c07a9(0xe2)](/'/g,'\\x5c\\x27')[_0x1c07a9(0xe2)](/\\\\\"/g,'\\x22')['replace'](/(^\"|\"$)/g,'\\x27'),_0x21fdf7;}[_0x72856f(0x197)](_0x3cd7a6,_0x37d417,_0x19b02c,_0x25f6c5){var _0x16954e=_0x72856f;this[_0x16954e(0x1a6)](_0x3cd7a6,_0x37d417),_0x25f6c5&&_0x25f6c5(),this[_0x16954e(0x11f)](_0x19b02c,_0x3cd7a6),this[_0x16954e(0x1a9)](_0x3cd7a6,_0x37d417);}[_0x72856f(0x1a6)](_0x6e536f,_0x401029){var _0x17a6ac=_0x72856f;this['_setNodeId'](_0x6e536f,_0x401029),this[_0x17a6ac(0x145)](_0x6e536f,_0x401029),this['_setNodeExpressionPath'](_0x6e536f,_0x401029),this['_setNodePermissions'](_0x6e536f,_0x401029);}[_0x72856f(0x1c2)](_0x1f5ae5,_0x37eeda){}[_0x72856f(0x145)](_0x45aa2e,_0x4e50b0){}[_0x72856f(0x115)](_0x215b25,_0x229a35){}[_0x72856f(0x1b5)](_0x4e0829){var _0x1d8a5d=_0x72856f;return _0x4e0829===this[_0x1d8a5d(0x17e)];}['_treeNodePropertiesAfterFullValue'](_0x57cedd,_0x2c22c3){var _0x17cb81=_0x72856f;this[_0x17cb81(0x115)](_0x57cedd,_0x2c22c3),this[_0x17cb81(0xe8)](_0x57cedd),_0x2c22c3[_0x17cb81(0x152)]&&this[_0x17cb81(0x199)](_0x57cedd),this[_0x17cb81(0x174)](_0x57cedd,_0x2c22c3),this[_0x17cb81(0xf5)](_0x57cedd,_0x2c22c3),this[_0x17cb81(0x150)](_0x57cedd);}[_0x72856f(0x11f)](_0x26fb3a,_0x46c914){var _0x1028d4=_0x72856f;try{_0x26fb3a&&typeof _0x26fb3a[_0x1028d4(0x13f)]=='number'&&(_0x46c914[_0x1028d4(0x13f)]=_0x26fb3a['length']);}catch{}if(_0x46c914[_0x1028d4(0x18e)]===_0x1028d4(0x196)||_0x46c914['type']===_0x1028d4(0x13e)){if(isNaN(_0x46c914[_0x1028d4(0x10a)]))_0x46c914[_0x1028d4(0x142)]=!0x0,delete _0x46c914[_0x1028d4(0x10a)];else switch(_0x46c914['value']){case Number[_0x1028d4(0x138)]:_0x46c914[_0x1028d4(0x17b)]=!0x0,delete _0x46c914[_0x1028d4(0x10a)];break;case Number['NEGATIVE_INFINITY']:_0x46c914[_0x1028d4(0x12d)]=!0x0,delete _0x46c914['value'];break;case 0x0:this[_0x1028d4(0x144)](_0x46c914['value'])&&(_0x46c914['negativeZero']=!0x0);break;}}else _0x46c914[_0x1028d4(0x18e)]===_0x1028d4(0x14e)&&typeof _0x26fb3a['name']==_0x1028d4(0x14a)&&_0x26fb3a['name']&&_0x46c914[_0x1028d4(0x189)]&&_0x26fb3a[_0x1028d4(0x189)]!==_0x46c914[_0x1028d4(0x189)]&&(_0x46c914[_0x1028d4(0x13d)]=_0x26fb3a[_0x1028d4(0x189)]);}[_0x72856f(0x144)](_0x1b12a5){var _0x419206=_0x72856f;return 0x1/_0x1b12a5===Number[_0x419206(0xff)];}[_0x72856f(0x199)](_0x3b27b5){var _0x29228a=_0x72856f;!_0x3b27b5[_0x29228a(0x165)]||!_0x3b27b5[_0x29228a(0x165)][_0x29228a(0x13f)]||_0x3b27b5[_0x29228a(0x18e)]===_0x29228a(0x12a)||_0x3b27b5[_0x29228a(0x18e)]==='Map'||_0x3b27b5[_0x29228a(0x18e)]===_0x29228a(0x156)||_0x3b27b5[_0x29228a(0x165)][_0x29228a(0x1b7)](function(_0x562c07,_0x203d92){var _0x4fae3e=_0x29228a,_0x379f2d=_0x562c07['name']['toLowerCase'](),_0x90917a=_0x203d92[_0x4fae3e(0x189)][_0x4fae3e(0x11e)]();return _0x379f2d<_0x90917a?-0x1:_0x379f2d>_0x90917a?0x1:0x0;});}['_addFunctionsNode'](_0xa8661a,_0x21c0d1){var _0x1869f9=_0x72856f;if(!(_0x21c0d1['noFunctions']||!_0xa8661a[_0x1869f9(0x165)]||!_0xa8661a[_0x1869f9(0x165)][_0x1869f9(0x13f)])){for(var _0x4c2cb1=[],_0x30d651=[],_0x2b1d30=0x0,_0x108561=_0xa8661a[_0x1869f9(0x165)][_0x1869f9(0x13f)];_0x2b1d30<_0x108561;_0x2b1d30++){var _0x472036=_0xa8661a['props'][_0x2b1d30];_0x472036[_0x1869f9(0x18e)]===_0x1869f9(0x14e)?_0x4c2cb1[_0x1869f9(0x1a8)](_0x472036):_0x30d651[_0x1869f9(0x1a8)](_0x472036);}if(!(!_0x30d651[_0x1869f9(0x13f)]||_0x4c2cb1[_0x1869f9(0x13f)]<=0x1)){_0xa8661a['props']=_0x30d651;var _0x3aef4f={'functionsNode':!0x0,'props':_0x4c2cb1};this[_0x1869f9(0x1c2)](_0x3aef4f,_0x21c0d1),this[_0x1869f9(0x115)](_0x3aef4f,_0x21c0d1),this['_setNodeExpandableState'](_0x3aef4f),this[_0x1869f9(0x176)](_0x3aef4f,_0x21c0d1),_0x3aef4f['id']+='\\x20f',_0xa8661a[_0x1869f9(0x165)][_0x1869f9(0x15e)](_0x3aef4f);}}}['_addLoadNode'](_0xc96858,_0x321a05){}[_0x72856f(0xe8)](_0x282a18){}[_0x72856f(0x137)](_0x1be8e3){var _0x5607c7=_0x72856f;return Array[_0x5607c7(0x111)](_0x1be8e3)||typeof _0x1be8e3==_0x5607c7(0x104)&&this['_objectToString'](_0x1be8e3)==='[object\\x20Array]';}['_setNodePermissions'](_0x4e4ed7,_0x1fef99){}[_0x72856f(0x150)](_0x39b390){var _0x256ecd=_0x72856f;delete _0x39b390[_0x256ecd(0x102)],delete _0x39b390[_0x256ecd(0x135)],delete _0x39b390[_0x256ecd(0x191)];}[_0x72856f(0x157)](_0x7ede3c,_0x3dc2a2){}['_propertyAccessor'](_0x1ea295){var _0x108f2d=_0x72856f;return _0x1ea295?_0x1ea295[_0x108f2d(0x175)](this['_numberRegExp'])?'['+_0x1ea295+']':_0x1ea295[_0x108f2d(0x175)](this[_0x108f2d(0x190)])?'.'+_0x1ea295:_0x1ea295['match'](this[_0x108f2d(0x162)])?'['+_0x1ea295+']':'[\\x27'+_0x1ea295+'\\x27]':'';}}let _0x3fdb64=new _0x5adf3b();function _0x17bbe5(_0x2713a1,_0x158183,_0x3c9bec,_0x3cff7b,_0x47f7ba,_0x3ce83e){var _0xa09169=_0x72856f;let _0x2a0287,_0x133a67;try{_0x133a67=_0x987a73(),_0x2a0287=_0x4bdc41[_0x158183],!_0x2a0287||_0x133a67-_0x2a0287['ts']>0x1f4&&_0x2a0287[_0xa09169(0x19d)]&&_0x2a0287[_0xa09169(0x15d)]/_0x2a0287[_0xa09169(0x19d)]<0x64?(_0x4bdc41[_0x158183]=_0x2a0287={'count':0x0,'time':0x0,'ts':_0x133a67},_0x4bdc41[_0xa09169(0x120)]={}):_0x133a67-_0x4bdc41[_0xa09169(0x120)]['ts']>0x32&&_0x4bdc41[_0xa09169(0x120)][_0xa09169(0x19d)]&&_0x4bdc41[_0xa09169(0x120)][_0xa09169(0x15d)]/_0x4bdc41[_0xa09169(0x120)][_0xa09169(0x19d)]<0x64&&(_0x4bdc41[_0xa09169(0x120)]={});let _0x32daac=[],_0x3db0dd=_0x2a0287[_0xa09169(0x151)]||_0x4bdc41[_0xa09169(0x120)][_0xa09169(0x151)]?_0x28932c:_0x3a2382,_0x3c5c87=_0x4b5a97=>{var _0x4742b1=_0xa09169;let _0x448c7a={};return _0x448c7a[_0x4742b1(0x165)]=_0x4b5a97[_0x4742b1(0x165)],_0x448c7a['elements']=_0x4b5a97['elements'],_0x448c7a[_0x4742b1(0x19e)]=_0x4b5a97['strLength'],_0x448c7a[_0x4742b1(0x11c)]=_0x4b5a97[_0x4742b1(0x11c)],_0x448c7a[_0x4742b1(0x113)]=_0x4b5a97[_0x4742b1(0x113)],_0x448c7a['autoExpandMaxDepth']=_0x4b5a97[_0x4742b1(0x128)],_0x448c7a['sortProps']=!0x1,_0x448c7a['noFunctions']=!_0x5177a6,_0x448c7a[_0x4742b1(0x16a)]=0x1,_0x448c7a['level']=0x0,_0x448c7a[_0x4742b1(0x173)]=_0x4742b1(0x139),_0x448c7a[_0x4742b1(0x1be)]=_0x4742b1(0x18c),_0x448c7a['autoExpand']=!0x0,_0x448c7a[_0x4742b1(0xfc)]=[],_0x448c7a['autoExpandPropertyCount']=0x0,_0x448c7a[_0x4742b1(0x146)]=!0x0,_0x448c7a[_0x4742b1(0x169)]=0x0,_0x448c7a['node']={'current':void 0x0,'parent':void 0x0,'index':0x0},_0x448c7a;};for(var _0x169ed2=0x0;_0x169ed2<_0x47f7ba[_0xa09169(0x13f)];_0x169ed2++)_0x32daac[_0xa09169(0x1a8)](_0x3fdb64['serialize']({'timeNode':_0x2713a1===_0xa09169(0x15d)||void 0x0},_0x47f7ba[_0x169ed2],_0x3c5c87(_0x3db0dd),{}));if(_0x2713a1===_0xa09169(0xe5)){let _0x5e6c77=Error[_0xa09169(0xfd)];try{Error[_0xa09169(0xfd)]=0x1/0x0,_0x32daac[_0xa09169(0x1a8)](_0x3fdb64['serialize']({'stackNode':!0x0},new Error()['stack'],_0x3c5c87(_0x3db0dd),{'strLength':0x1/0x0}));}finally{Error[_0xa09169(0xfd)]=_0x5e6c77;}}return{'method':_0xa09169(0x17d),'version':_0x1466cc,'args':[{'id':_0x158183,'ts':_0x3c9bec,'args':_0x32daac,'context':_0x3ce83e,'session':_0x3cff7b}]};}catch(_0x49bcf6){return{'method':'log','version':_0x1466cc,'args':[{'id':_0x158183,'ts':_0x3c9bec,'args':[{'type':_0xa09169(0x188),'error':_0x49bcf6&&_0x49bcf6[_0xa09169(0x117)]}],'context':_0x3ce83e,'session':_0x3cff7b}]};}finally{try{if(_0x2a0287&&_0x133a67){let _0xc49f4b=_0x987a73();_0x2a0287[_0xa09169(0x19d)]++,_0x2a0287[_0xa09169(0x15d)]+=_0x2fd168(_0x133a67,_0xc49f4b),_0x2a0287['ts']=_0xc49f4b,_0x4bdc41[_0xa09169(0x120)][_0xa09169(0x19d)]++,_0x4bdc41['hits'][_0xa09169(0x15d)]+=_0x2fd168(_0x133a67,_0xc49f4b),_0x4bdc41['hits']['ts']=_0xc49f4b,(_0x2a0287['count']>0x32||_0x2a0287[_0xa09169(0x15d)]>0x64)&&(_0x2a0287[_0xa09169(0x151)]=!0x0),(_0x4bdc41[_0xa09169(0x120)][_0xa09169(0x19d)]>0x3e8||_0x4bdc41[_0xa09169(0x120)]['time']>0x12c)&&(_0x4bdc41[_0xa09169(0x120)]['reduceLimits']=!0x0);}}catch{}}}return _0x1f158d[_0x72856f(0x108)];})(globalThis,'127.0.0.1','50901',_0x43558a(0x1a7),'webpack',_0x43558a(0xf8),_0x43558a(0x177),[\"localhost\",\"127.0.0.1\",\"example.cypress.io\",\"sirs-MacBook-Pro-2.local\",\"192.168.10.4\"],'');");}catch(e){}};function oo_oo(i,...v){try{oo_cm().consoleLog(i, v);}catch(e){} return v};function oo_tr(i,...v){try{oo_cm().consoleTrace(i, v);}catch(e){} return v};function oo_ts(){try{oo_cm().consoleTime();}catch(e){}};function oo_te(){try{oo_cm().consoleTimeEnd();}catch(e){}};/*eslint eslint-comments/disable-enable-pair:,eslint-comments/no-unlimited-disable:,eslint-comments/no-aggregating-enable:,eslint-comments/no-duplicate-disable:,eslint-comments/no-unused-disable:,eslint-comments/no-unused-enable:,*/

/***/ }),

/***/ "pg-native":
/*!****************************!*\
  !*** external "pg-native" ***!
  \****************************/
/***/ ((module) => {

"use strict";
module.exports = require("pg-native");

/***/ }),

/***/ "assert":
/*!*************************!*\
  !*** external "assert" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("assert");

/***/ }),

/***/ "crypto":
/*!*************************!*\
  !*** external "crypto" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("crypto");

/***/ }),

/***/ "dns":
/*!**********************!*\
  !*** external "dns" ***!
  \**********************/
/***/ ((module) => {

"use strict";
module.exports = require("dns");

/***/ }),

/***/ "events":
/*!*************************!*\
  !*** external "events" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("events");

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/***/ ((module) => {

"use strict";
module.exports = require("fs");

/***/ }),

/***/ "net":
/*!**********************!*\
  !*** external "net" ***!
  \**********************/
/***/ ((module) => {

"use strict";
module.exports = require("net");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("path");

/***/ }),

/***/ "stream":
/*!*************************!*\
  !*** external "stream" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("stream");

/***/ }),

/***/ "string_decoder":
/*!*********************************!*\
  !*** external "string_decoder" ***!
  \*********************************/
/***/ ((module) => {

"use strict";
module.exports = require("string_decoder");

/***/ }),

/***/ "tls":
/*!**********************!*\
  !*** external "tls" ***!
  \**********************/
/***/ ((module) => {

"use strict";
module.exports = require("tls");

/***/ }),

/***/ "url":
/*!**********************!*\
  !*** external "url" ***!
  \**********************/
/***/ ((module) => {

"use strict";
module.exports = require("url");

/***/ }),

/***/ "util":
/*!***********************!*\
  !*** external "util" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("util");

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
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
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
/******/ 	var __webpack_exports__ = __webpack_require__("./services/puntos/src/get-punto-by-id.js");
/******/ 	var __webpack_export_target__ = exports;
/******/ 	for(var i in __webpack_exports__) __webpack_export_target__[i] = __webpack_exports__[i];
/******/ 	if(__webpack_exports__.__esModule) Object.defineProperty(__webpack_export_target__, "__esModule", { value: true });
/******/ 	
/******/ })()
;
//# sourceMappingURL=get-punto-by-id.js.map