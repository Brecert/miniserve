import { EventEmitter } from 'events';
import sleep from "./utils/sleep.js";
export default class Connection extends EventEmitter {
  constructor(ws) {
    super();
    this.ws = ws;
    this.ws.addEventListener('message', msg => this.handleMessage(JSON.parse(msg.toString())));
  }

  send(data) {
    this.ws.send(JSON.stringify(data));
  }

  query(name, data, id = Math.ceil(Math.random() * 10000)) {
    this.send({
      id: id,
      query: name,
      ...data
    });
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