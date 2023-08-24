"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
const timers_1 = require("timers");
class Expire extends events_1.EventEmitter {
    constructor({ expireInterval, onExpire, manualStart, backoff = 'once' }) {
        super();
        this.started = false;
        this.backoffCount = 0;
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
        (0, timers_1.clearTimeout)(this.timeout);
        let expireInterval = this.expireInterval;
        switch (this.backoff) {
            case 'linear':
                expireInterval = expireInterval * (this.backoffCount + 1);
                break;
            case 'exponential':
                expireInterval = expireInterval * (Math.pow(2, this.backoffCount));
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
        (0, timers_1.clearTimeout)(this.timeout);
        this.backoffCount = 0;
    }
    heartbeat() {
        this.lastHeartbeat = new Date();
        this.backoffCount = 0;
        (0, timers_1.clearTimeout)(this.timeout);
        this.initialize();
    }
    isStarted() {
        return this.started;
    }
}
exports.default = Expire;
