import { EventEmitter } from 'events';
import { clearTimeout } from "timers";
class Expire extends EventEmitter {
    lastHeartbeat;
    expireInterval;
    onExpire;
    manualStart;
    timeout;
    started = false;
    constructor({ expireInterval, onExpire, manualStart }) {
        super();
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
        this.timeout = setTimeout(() => {
            this.emit('expire', this.lastHeartbeat);
            if (this.onExpire) {
                this.onExpire(this.lastHeartbeat);
            }
        }, this.expireInterval);
    }
    start() {
        this.started = true;
        this.initialize();
    }
    stop() {
        this.started = false;
        clearTimeout(this.timeout);
    }
    heartbeat() {
        this.lastHeartbeat = new Date();
        this.initialize();
    }
}
export default Expire;
