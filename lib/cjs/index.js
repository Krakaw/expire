"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
const timers_1 = require("timers");
class Expire extends events_1.EventEmitter {
    constructor({ expireInterval, onExpire, manualStart }) {
        super();
        this.started = false;
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
        (0, timers_1.clearTimeout)(this.timeout);
    }
    heartbeat() {
        this.lastHeartbeat = new Date();
        this.initialize();
    }
}
exports.default = Expire;
