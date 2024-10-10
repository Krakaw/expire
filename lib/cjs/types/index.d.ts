/// <reference types="node" />
import { EventEmitter } from 'events';
export type Backoff = 'once' | 'repeat' | 'linear' | 'exponential';
export interface ExpireOptions {
    expireInterval: number;
    onExpire?: (lastHeartbeat?: Date) => void;
    manualStart?: boolean;
    backoff?: Backoff;
}
declare interface Expirer {
    on(event: 'expire', listener: (lastHeartbeat?: Date) => void): this;
    emit(event: 'expire', lastHeartbeat?: Date): boolean;
}
declare class Expirer extends EventEmitter {
    lastHeartbeat?: Date;
    lastExpire?: Date;
    private readonly expireInterval;
    private readonly onExpire?;
    private readonly manualStart;
    private readonly backoff;
    private timeout;
    private started;
    private backoffCount;
    constructor({ expireInterval, onExpire, manualStart, backoff }: ExpireOptions);
    private initialize;
    start(): void;
    stop(): void;
    heartbeat(): void;
    isStarted(): boolean;
}
export default Expirer;
//# sourceMappingURL=index.d.ts.map