import { createListenerMiddleware, isAnyOf } from "@reduxjs/toolkit";
import { deleteCell, setCell, setGeneration } from "./cellSlice";
import worker from "./worker";
import store from "./store";

console.log(worker);

const syncWorkerMiddleware = createListenerMiddleware();

syncWorkerMiddleware.startListening({
    matcher: isAnyOf(setCell, deleteCell),
    effect: (action, _listenerApi) => {
        worker.postMessage(action);
    }
});

worker.addEventListener('message', ({ data }) => {
    if (data.type === 'generation') {
        store.dispatch(setGeneration(data.payload));
    }
});

export default syncWorkerMiddleware.middleware;