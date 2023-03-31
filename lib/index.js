"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
const timers_1 = require("timers");
class Expire extends events_1.EventEmitter {
    lastHeartbeat;
    expireInterval;
    onExpire;
    manualStart;
    timeout;
    constructor({ expireInterval, onExpire, manualStart }) {
        super();
        this.expireInterval = expireInterval;
        this.onExpire = onExpire;
        this.manualStart = !!manualStart;
        if (!this.manualStart) {
            this.start();
        }
    }
    start() {
        (0, timers_1.clearTimeout)(this.timeout);
        this.timeout = setTimeout(() => {
            this.emit('expire', this.lastHeartbeat);
            this.onExpire(this.lastHeartbeat);
        }, this.expireInterval);
    }
    stop() {
        (0, timers_1.clearTimeout)(this.timeout);
    }
    heartbeat() {
        this.lastHeartbeat = new Date();
        this.start();
    }
}
exports.default = Expire;
