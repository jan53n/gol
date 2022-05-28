import { draw, setGeneration } from "./cellSlice";
import { GRID_SIZE } from "./config";
import store from "./store";

let unsub;
let _worker;

const worker = () => _worker;

export function listenForAction(type, callback) {
    const w = worker();
    const l = w.addEventListener('message', ({ data }) => {
        if (data.type === type) {
            callback(data);
        }
    });

    unsub = () => w.removeEventListener('message', l);
}

function start() {
    const _w = new Worker('./cellMap.js');
    _w.postMessage({ type: 'map/config', payload: { width: GRID_SIZE, height: GRID_SIZE } });
    return _w;
}

export function sendAction(action) {
    worker()?.postMessage(action);
}

export function restartWorker() {
    if (unsub) unsub();
    worker()?.terminate();
    _worker = start();

    listenForAction('grid/draw', ({ payload }) => {
        store.dispatch(draw(payload));
    });
}