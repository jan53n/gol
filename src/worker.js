import { setGeneration } from "./cellSlice";
import { GRID_SIZE } from "./config";
import store from "./store";
let worker = start();

export function listenForAction(type, callback) {
    worker.addEventListener('message', ({ data }) => {
        if (data.type === type) {
            callback(data);
        }
    });
}

function start() {
    return new Worker('./cellMap.js');
}

export function sendAction(action) {
    worker.postMessage(action);
}

export function restartWorker(t) {
    worker.terminate();
    worker = start();

    listenForAction('map/generation', ({ payload }) => {
        store.dispatch(setGeneration(payload));
    });

    sendAction({ type: 'map/config', payload: { width: GRID_SIZE, height: GRID_SIZE } });
}

export default worker;