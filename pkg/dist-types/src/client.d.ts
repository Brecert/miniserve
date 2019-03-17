import Connection from './connection';
interface IServiceClient {
    cb: (args: any) => any;
}
export default class Client {
    connection: Connection;
    services: Map<string, IServiceClient>;
    constructor(host?: string, port?: number);
    add(name: string, cb: (args: any) => any): void;
    call(name: any, ...args: any[]): Promise<any>;
}
export {};
