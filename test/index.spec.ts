import sinon from 'sinon';
import {assert} from "chai";
import Expire from "../src";

describe('Expire', async () => {
    it('should expire once after a set amount of time has elapsed automatically', async () => {
        const cb = sinon.fake()
        const expire = new Expire({expireInterval: 10, onExpire: cb});
        assert(cb.notCalled);
        await new Promise(r => setTimeout(r, 10));
        assert(cb.called);
        await new Promise(r => setTimeout(r, 10));
        assert(cb.callCount === 1);
        assert(expire.isStarted() === true);
        // Restart the countdown
        expire.heartbeat();
        assert.equal(cb.callCount , 1);
        await new Promise(r => setTimeout(r, 10));
        assert.equal(cb.callCount , 2);
    })

    it('should not expire after a heartbeat', async () => {
        const cb = sinon.fake()
        const expire = new Expire({expireInterval: 10, onExpire: cb});
        assert(cb.notCalled);
        await new Promise(r => setTimeout(r, 9));
        expire.heartbeat()
        await new Promise(r => setTimeout(r, 9));
        assert(cb.notCalled);
        await new Promise(r => setTimeout(r, 2));
        assert(cb.called);
        assert.equal(cb.callCount , 1);
        await new Promise(r => setTimeout(r, 10));
        assert.equal(cb.callCount , 1);
    })

    it('should expire every interval', async () => {
        const cb = sinon.fake()
        const expire = new Expire({expireInterval: 10, onExpire: cb, backoff: 'repeat'});
        assert(cb.notCalled);
        await new Promise(r => setTimeout(r, 10));
        assert(cb.called);
        await new Promise(r => setTimeout(r, 10));
        assert.equal(cb.callCount, 2);
        await new Promise(r => setTimeout(r, 10));
        assert.equal(cb.callCount, 3);
        await new Promise(r => setTimeout(r, 10));
        assert.equal(cb.callCount, 4);
        expire.stop()
    })

    it('should backoff linearly with manual start', async () => {
        const cb = sinon.fake()
        const expire = new Expire({expireInterval: 10, onExpire: cb, backoff: 'linear', manualStart: true});
        assert(expire.isStarted() === false)
        expire.start();
        assert(cb.notCalled);
        await new Promise(r => setTimeout(r, 10));
        assert(cb.called);
        assert.equal(cb.callCount, 1);
        await new Promise(r => setTimeout(r, 20));
        assert.equal(cb.callCount, 2);
        await new Promise(r => setTimeout(r, 30));
        assert.equal(cb.callCount, 3);
        await new Promise(r => setTimeout(r, 40));
        assert.equal(cb.callCount, 4);
        expire.stop()
    });

    it('should backoff exponentially', async () => {
        const cb = sinon.fake()
        const expire = new Expire({expireInterval: 10, onExpire: cb, backoff: 'exponential'});
        assert(cb.notCalled);
        await new Promise(r => setTimeout(r, 10));
        assert(cb.called);
        assert.equal(cb.callCount, 1);
        await new Promise(r => setTimeout(r, 20));
        assert.equal(cb.callCount, 2);
        await new Promise(r => setTimeout(r, 40));
        assert.equal(cb.callCount, 3);
        await new Promise(r => setTimeout(r, 80));
        assert.equal(cb.callCount, 4);
        await new Promise(r => setTimeout(r, 160));
        assert.equal(cb.callCount, 5);
        // A heartbeat should reset it
        expire.heartbeat()
        assert.equal(cb.callCount, 5);
        await new Promise(r => setTimeout(r, 10));
        assert.equal(cb.callCount, 6);
        expire.stop()
    });


})