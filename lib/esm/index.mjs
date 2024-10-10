import { EventEmitter } from 'events';
import { clearTimeout } from "timers";
class Expirer extends EventEmitter {
    lastHeartbeat;
    lastExpire;
    expireInterval;
    onExpire;
    manualStart;
    backoff;
    timeout;
    started = false;
    backoffCount = 0;
    constructor({ expireInterval, onExpire, manualStart, backoff = 'once' }) {
        super();
        this.backoff = backoff;
        this.expireInterval = expireInterval;
        this.onExpire = onExpire;
        this.manualStart = manualStart;
        if (!this.manualStart) {
            this.start();
        }
    }
    initialize() {
        if (!this.started) {
            return;
        }
        clearTimeout(this.timeout);
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
            }
            else {
                // It will restart when we get the next heartbeat
            }
        }, expireInterval);
    }
    start() {
        this.started = true;
        this.initialize();
    }
    stop() {
        this.started = false;
        clearTimeout(this.timeout);
        this.backoffCount = 0;
    }
    heartbeat() {
        this.lastHeartbeat = new Date();
        this.backoffCount = 0;
        clearTimeout(this.timeout);
        this.initialize();
    }
    isStarted() {
        return this.started;
    }
}
export default Expirer;
