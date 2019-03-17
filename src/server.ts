import WebSocket from 'ws'
import Connection from './connection'

export interface IServiceServer {
  connection: Connection
}

export default class Server {
  services: Map<string, IServiceServer> = new Map()

  constructor(options: WebSocket.ServerOptions = { port: 8080 }) {
    let wss = new WebSocket.Server(options)

    wss.on('connection', ws => {
      let cn = new Connection(ws)

      cn.on('add_service', ({ name }) => {
        this.services.set(name, {
          connection: cn
        })
      })

      cn.on('call_service', async ({ id, name, args }) => {
        this.services.get(name).connection.query('call', { name, args }, id)
        let res = await cn.expectValue(id)
        cn.query(`response:${res}`, res)
      })
    })
  }
}
