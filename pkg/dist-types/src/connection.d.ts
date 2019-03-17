/// <reference types="node" />
import WebSocket from 'ws';
import { EventEmitter } from 'events';
export interface ConnectionResponse {
    id: number;
    query: string;
}
export interface ConnectionResponseValue<T = any> extends ConnectionResponse {
    value: T;
}
export default class Connection extends EventEmitter {
    ws: WebSocket;
    constructor(ws: WebSocket);
    send(data: any): void;
    query(name: string, data: object, id?: number): number;
    expectValue(id: number, timeout?: number): Promise<ConnectionResponseValue>;
    handleMessage(msg: ConnectionResponse): void;
}
