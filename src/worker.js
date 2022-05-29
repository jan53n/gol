export default class HandleMap {
    constructor(config) {
        this.config = config;
        this._setup();
    }

    _setup() {
        this.worker = new Worker("./cellMap.js");
        this.worker.addEventListener('message', (({ data }) => console.log('worker', data)));
    }

    start() {
        this.send({ type: "map/config", payload: this.config });
    }

    send(action) {
        this.worker.postMessage(action);
    }

    reset() {
        this.send({ type: "map/clear" });
    }

    listen(type, callback, options = {}) {
        const l = this.worker.addEventListener('message', ({ data }) => {
            if (data.type === type) {
                callback(data);
            }
        }, options);

        return () => this.worker.removeEventListener('message', l);
    }
}