import WebSocket from 'ws';
import Connection from './connection';
export interface IServiceServer {
    connection: Connection;
}
export default class Server {
    services: Map<string, IServiceServer>;
    constructor(options?: WebSocket.ServerOptions);
}
