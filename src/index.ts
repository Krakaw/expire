import {EventEmitter} from 'events';
import {clearTimeout} from "timers";

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

class Expirer extends EventEmitter {
    public lastHeartbeat?: Date;
    public lastExpire?: Date;

    private readonly expireInterval: number;
    private readonly onExpire?: (lastHeartbeat?: Date) => void;
    private readonly manualStart: boolean | undefined;
    private readonly backoff: Backoff;

    private timeout!: NodeJS.Timeout;
    private started = false;
    private backoffCount = 0;

    constructor({expireInterval, onExpire, manualStart, backoff = 'once'}: ExpireOptions) {
        super();
        this.backoff = backoff;
        this.expireInterval = expireInterval;
        this.onExpire = onExpire;
        this.manualStart = manualStart;
        if (!this.manualStart) {
            this.start();
        }
    }

    private initialize() {
        if (!this.started) {
            return;
        }
        clearTimeout(this.timeout)
        let expireInterval = this.expireInterval;
        switch (this.backoff) {
            case 'linear':
                expireInterval = expireInterval * (this.backoffCount + 1);
                break;
            case 'exponential':
                expireInterval = expireInterval * (2 ** this.backoffCount);
                break;
            case 'repeat':
                expireInterval = this.expireInterval;
                break;
            default:

        }

        this.timeout = setTimeout(() => {
            this.backoffCount++;
            this.lastExpire = new Date();
            this.emit('expire', this.lastHeartbeat);
            if (this.onExpire) {
                this.onExpire(this.lastHeartbeat);
            }
            if (this.backoff !== 'once') {
                this.initialize();
            } else {
                // It will restart when we get the next heartbeat
            }
        }, expireInterval);
    }

    public start() {
        this.started = true;
        this.initialize();
    }

    public stop() {
        this.started = false;
        clearTimeout(this.timeout)
        this.backoffCount = 0;
    }

    public heartbeat() {
        this.lastHeartbeat = new Date();
        this.backoffCount = 0;
        clearTimeout(this.timeout)
        this.initialize();
    }

    public isStarted() {
        return this.started;
    }
}

export default Expirer;