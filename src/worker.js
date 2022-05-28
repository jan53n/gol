export default class HandleMap {
    constructor(config) {
        this.config = config;
        this._setup();
    }

    _setup() {
        this.worker = new Worker("./cellMap.js");
    }

    start() {
        this.send({ type: "map/config", payload: this.config });
    }

    send(action) {
        this.worker.postMessage(action);
    }

    reset() {
        this.send({ type: "map/reset" });
        return this.listenAsync("map/reset/completed");
    }

    listen(type, callback, options = {}) {
        const l = this.worker.addEventListener('message', ({ data }) => {
            if (data.type === type) {
                callback(data);
            }
        }, options);

        return () => this.worker.removeEventListener('message', l);
    }

    listenAsync(type) {
        return new Promise((resolve, reject) => {
            const unsub = this.listen(type, (data) => {
                resolve(data);
                unsub();
            });
        });
    }
}