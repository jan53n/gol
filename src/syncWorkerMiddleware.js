import { createListenerMiddleware, isAnyOf } from "@reduxjs/toolkit";
import { deleteCell, setCell, setGeneration } from "./cellSlice";
import { player } from "./playerSlice";
import store from "./store";
import { setIntervalSync } from "./util";
import worker, { listenForAction, sendAction } from "./worker";

const syncWorkerMiddleware = createListenerMiddleware();
let clearPlayInterval;

function waitForNextGeneration() {
    return new Promise((resolve, reject) => {
        const listener = worker.addEventListener('message', ({ data }) => {
            if (data.type === "map/generation") {
                resolve(true);
                worker.removeEventListener('message', listener);
            }
        });
    });
}

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
    actionCreator: player.next,
    effect: () => {
        sendAction({ type: 'map/next' });
    }
});

syncWorkerMiddleware.startListening({
    matcher: isAnyOf(player.play, player.pause, player.next, player.previous),
    effect: (action, _listenerApi) => {
        if (clearPlayInterval) {
            clearPlayInterval();
            clearPlayInterval = undefined;
        }
    }
});

syncWorkerMiddleware.startListening({
    actionCreator: player.play,
    effect: (_action, listenerApi) => {
        const zoom = listenerApi.getState().zoom.value;
        clearPlayInterval = setIntervalSync(
            async () => {
                sendAction({ type: 'map/next' });
                await waitForNextGeneration();
            },
            zoom
        );
    }
});

export default syncWorkerMiddleware.middleware;