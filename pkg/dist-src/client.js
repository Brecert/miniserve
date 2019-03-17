function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import WebSocket from 'ws';
import Connection from "./connection.js";
export default class Client {
  constructor(host = 'ws://localhost', port = 8080) {
    _defineProperty(this, "connection", void 0);

    _defineProperty(this, "services", new Map());

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

  async call(name, ...args) {
    let id = this.connection.query('call_service', {
      name,
      args
    });
    let res = await this.connection.expectValue(id);
    return res.value;
  }

}