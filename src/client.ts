import WebSocket from 'ws'
import Connection from './connection'

interface IServiceClient {
  cb: (args) => any
}

export default class Client {
  connection: Connection
  services: Map<string, IServiceClient> = new Map()

  constructor(host = 'ws://localhost', port = 8080) {
    let ws = new WebSocket(`${host}:${port}`)
    this.connection = new Connection(ws)

    this.connection.on('call', ({ id, name, args }) => {
      let res = this.services.get(name).cb(args)
      this.connection.query(`response:${id}`, {
        value: res
      })
    })
  }

  add(name: string, cb: (args) => any) {
    this.connection.query('add_service', { name })
    this.services.set(name, { cb })
  }

  async call(name, ...args) {
    let id = this.connection.query('call_service', { name, args })
    let res = await this.connection.expectValue(id)
    return res.value
  }
}
