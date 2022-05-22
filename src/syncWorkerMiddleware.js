import { createListenerMiddleware, isAnyOf } from "@reduxjs/toolkit";
import { deleteCell, setCell } from "./cellSlice";
import { player } from "./playerSlice";
import store from "./store";
import { listenForAction, sendAction } from "./worker";

const syncWorkerMiddleware = createListenerMiddleware();
let intervalId = undefined;

listenForAction('cells/drawCell', (action) => {
    store.dispatch(action);
});

syncWorkerMiddleware.startListening({
    matcher: isAnyOf(setCell, deleteCell),
    effect: (action, _listenerApi) => {
        sendAction(action);
    }
});

syncWorkerMiddleware.startListening({
    matcher: player.play,
    effect: (action, listenerApi) => {
        const { zoom } = listenerApi.getState();

        if (intervalId) {
            window.clearInterval(intervalId);
        }

        intervalId = window.setInterval(() => {
            sendAction({ type: 'map/next' });
        }, zoom.value);
    }
});

syncWorkerMiddleware.startListening({
    matcher: player.next,
    effect: () => {
        if (intervalId) {
            window.clearInterval(intervalId);
        }

        sendAction({ type: 'map/next' });
    }
});

syncWorkerMiddleware.startListening({
    matcher: player.pause,
    effect: () => {
        window.clearInterval(intervalId);
    }
});

export default syncWorkerMiddleware.middleware;