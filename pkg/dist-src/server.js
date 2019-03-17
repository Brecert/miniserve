function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import WebSocket from 'ws';
import Connection from "./connection.js";
export default class Server {
  constructor(options = {
    port: 8080
  }) {
    _defineProperty(this, "services", new Map());

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
      cn.on('call_service', async ({
        id,
        name,
        args
      }) => {
        this.services.get(name).connection.query('call', {
          name,
          args
        }, id);
        let res = await cn.expectValue(id);
        cn.query(`response:${res}`, res);
      });
    });
  }

}