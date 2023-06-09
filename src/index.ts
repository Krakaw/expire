import { EventEmitter } from 'events';
import {clearTimeout} from "timers";

export interface ExpireOptions {
    expireInterval: number;
    onExpire?: (lastHeartbeat?: Date) => void;
    manualStart?: boolean;
}

declare interface Expire {
    on(event: 'expire', listener: (lastHeartbeat?: Date) => void): this;
    emit(event: 'expire', lastHeartbeat?: Date): boolean;
}
class Expire extends EventEmitter {
    public lastHeartbeat?: Date;

    private readonly expireInterval: number;
    private readonly onExpire?: (lastHeartbeat?: Date) => void;
    private readonly manualStart: boolean | undefined;

    private timeout!: NodeJS.Timeout;
    private started = false;
    constructor({ expireInterval, onExpire, manualStart }: ExpireOptions) {
        super();
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
        this.timeout = setTimeout(() => {
            this.emit('expire', this.lastHeartbeat);
            if (this.onExpire) {
                this.onExpire(this.lastHeartbeat);
            }
        }, this.expireInterval);
    }

    public start() {
        this.started = true;
        this.initialize();
    }

    public stop() {
        this.started = false;
        clearTimeout(this.timeout)
    }

    public heartbeat() {
        this.lastHeartbeat = new Date();
        this.initialize();
    }
}

export default Expire;