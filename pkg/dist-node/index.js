'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var WebSocket = _interopDefault(require('ws'));
var events = require('events');

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }

  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }

      _next(undefined);
    });
  };
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    var ownKeys = Object.keys(source);

    if (typeof Object.getOwnPropertySymbols === 'function') {
      ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
        return Object.getOwnPropertyDescriptor(source, sym).enumerable;
      }));
    }

    ownKeys.forEach(function (key) {
      _defineProperty(target, key, source[key]);
    });
  }

  return target;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

class Connection extends events.EventEmitter {
  constructor(ws) {
    super();
    this.ws = ws;
    this.ws.addEventListener('message', msg => this.handleMessage(JSON.parse(msg.toString())));
  }

  send(data) {
    this.ws.send(JSON.stringify(data));
  }

  query(name, data, id = Math.ceil(Math.random() * 10000)) {
    this.send(_objectSpread({
      id: id,
      query: name
    }, data));
    return id;
  }

  expectValue(id, timeout = 5000) {
    return new Promise((resolve, reject) => {
      this.once(`response:${id}`, res => {
        resolve(res);
      });
      sleep(timeout).then(() => {
        reject("timed out, client didn't respond fast enough");
      });
    });
  }

  handleMessage(msg) {
    if ('query' in msg) {
      this.emit(msg.query, msg);
    } else {
      throw 'expected query in msg';
    }
  }

}

function _defineProperty$1(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}
class Server {
  constructor(options = {
    port: 8080
  }) {
    var _this = this;

    _defineProperty$1(this, "services", new Map());

    let wss = new WebSocket.Server(options);
    wss.on('connection', ws => {
      let cn = new Connection(ws);
      cn.on('add_service', ({
        name
      }) => {
        this.services.set(name, {
          connection: cn
        });
      });
      cn.on('call_service',
      /*#__PURE__*/
      function () {
        var _ref = _asyncToGenerator(function* ({
          id,
          name,
          args
        }) {
          _this.services.get(name).connection.query('call', {
            name,
            args
          }, id);

          let res = yield cn.expectValue(id);
          cn.query(`response:${res}`, res);
        });

        return function (_x) {
          return _ref.apply(this, arguments);
        };
      }());
    });
  }

}

function _defineProperty$2(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}
class Client {
  constructor(host = 'ws://localhost', port = 8080) {
    _defineProperty$2(this, "connection", void 0);

    _defineProperty$2(this, "services", new Map());

    let ws = new WebSocket(`${host}:${port}`);
    this.connection = new Connection(ws);
    this.connection.on('call', ({
      id,
      name,
      args
    }) => {
      let res = this.services.get(name).cb(args);
      this.connection.query(`response:${id}`, {
        value: res
      });
    });
  }

  add(name, cb) {
    this.connection.query('add_service', {
      name
    });
    this.services.set(name, {
      cb
    });
  }

  call(name, ...args) {
    var _this = this;

    return _asyncToGenerator(function* () {
      let id = _this.connection.query('call_service', {
        name,
        args
      });

      let res = yield _this.connection.expectValue(id);
      return res.value;
    })();
  }

}

exports.ServiceServer = Server;
exports.ServiceClient = Client;
