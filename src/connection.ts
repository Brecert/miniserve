import WebSocket from 'ws'
import { EventEmitter } from 'events'
import sleep from './utils/sleep'

export interface ConnectionResponse {
  id: number
  query: string
}

export interface ConnectionResponseValue<T = any> extends ConnectionResponse {
  value: T
}

export default class Connection extends EventEmitter {
  constructor(public ws: WebSocket) {
    super()

    this.ws.addEventListener('message', msg => this.handleMessage(JSON.parse(msg.toString())))
  }

  send(data) {
    this.ws.send(JSON.stringify(data))
  }

  query(name: string, data: object, id = Math.ceil(Math.random() * 10000)) {
    this.send({
      id: id,
      query: name,
      ...data
    })

    return id
  }

  expectValue(id: number, timeout = 5000): Promise<ConnectionResponseValue> {
    return new Promise((resolve, reject) => {
      this.once(`response:${id}`, res => {
        resolve(res)
      })

      sleep(timeout).then(() => {
        reject("timed out, client didn't respond fast enough")
      })
    })
  }

  handleMessage(msg: ConnectionResponse) {
    if ('query' in msg) {
      this.emit(msg.query, msg)
    } else {
      throw 'expected query in msg'
    }
  }
}
