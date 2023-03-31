/// <reference types="node" />
import { EventEmitter } from 'events';
export interface ExpireOptions {
    expireInterval: number;
    onExpire: () => void;
    manualStart?: boolean;
}
declare interface Expire {
    on(event: 'expire', listener: (lastHeartbeat?: Date) => void): this;
    emit(event: 'expire', lastHeartbeat?: Date): boolean;
}
declare class Expire extends EventEmitter {
    lastHeartbeat?: Date;
    private readonly expireInterval;
    private readonly onExpire;
    private readonly manualStart;
    private timeout;
    constructor({ expireInterval, onExpire, manualStart }: ExpireOptions);
    start(): void;
    stop(): void;
    heartbeat(): void;
}
export default Expire;
