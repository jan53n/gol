import { GRID_SIZE } from "./config";

const worker = new Worker('./cellMap.js');

export function listenForAction(type, callback) {
    worker.addEventListener('message', ({ data }) => {
        if (data.type === type) {
            callback(data);
        }
    });
}

export function sendAction(action) {
    worker.postMessage(action);
}

sendAction({ type: 'map/config', payload: { width: GRID_SIZE, height: GRID_SIZE } });

export default worker;