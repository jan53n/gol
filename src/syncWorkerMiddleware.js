import { createListenerMiddleware, isAnyOf } from "@reduxjs/toolkit";
import Queue from "queue";
import { deleteCell, setCell, setGeneration } from "./cellSlice";
import { player } from "./playerSlice";
import store from "./store";
import worker, { listenForAction, sendAction } from "./worker";

const queue = new Queue({ concurrency: 1, autostart: true });
let intervalListener;

const next = () => {
    if (queue.length > 0) {
        return;
    }

    queue.push(() => {
        return new Promise((resolve, reject) => {
            sendAction({ type: 'map/next' });
            const listener = worker.addEventListener('message', ({ data }) => {
                if (data.type === "map/generation") {
                    worker.removeEventListener('message', listener);
                    resolve();
                }
            });
        });
    });
};

const syncWorkerMiddleware = createListenerMiddleware();


listenForAction('map/generation', ({ payload }) => {
    store.dispatch(setGeneration(payload));
});

syncWorkerMiddleware.startListening({
    matcher: isAnyOf(setCell, deleteCell),
    effect: (action, _listenerApi) => {
        sendAction(action);
    }
});

syncWorkerMiddleware.startListening({
    matcher: isAnyOf(player.next, player.pause, player.previous, player.reset),
    effect: async () => {
        if (intervalListener) {
            queue.stop();
            clearInterval(intervalListener);
        }
    }
});

syncWorkerMiddleware.startListening({
    actionCreator: player.next,
    effect: async () => {
        queue.stop();
        next();
    }
});

syncWorkerMiddleware.startListening({
    actionCreator: player.play,
    effect: (_, listenerApi) => {
        const zoom = listenerApi.getState().zoom.value;

        queue.stop();
        intervalListener = setInterval(() => {
            next();
        }, zoom);
    }
});

export default syncWorkerMiddleware.middleware;