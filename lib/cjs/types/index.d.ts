/// <reference types="node" />
import { EventEmitter } from 'events';
export interface ExpireOptions {
    expireInterval: number;
    onExpire?: (lastHeartbeat?: Date) => void;
    manualStart?: boolean;
}
declare interface Expire {
    on(event: 'expire', listener: (lastHeartbeat?: Date) => void): this;
    emit(event: 'expire', lastHeartbeat?: Date): boolean;
}
declare class Expire extends EventEmitter {
    lastHeartbeat?: Date;
    private readonly expireInterval;
    private readonly onExpire?;
    private readonly manualStart;
    private timeout;
    private started;
    constructor({ expireInterval, onExpire, manualStart }: ExpireOptions);
    private initialize;
    start(): void;
    stop(): void;
    heartbeat(): void;
}
export default Expire;
//# sourceMappingURL=index.d.ts.map