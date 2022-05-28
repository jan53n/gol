import { createListenerMiddleware, isAnyOf } from "@reduxjs/toolkit";
import { clear } from "./cellSlice";
import { PLAYER_PLAY } from "./config";
import { player } from "./playerSlice";
import { restartWorker, sendAction } from "./worker";

const syncWorkerMiddleware = createListenerMiddleware();

restartWorker();

syncWorkerMiddleware.startListening({
    predicate: ({ type, payload }) => {
        return type === "grid/draw" && payload.generation === undefined;
    },
    effect: (action, _listenerApi) => {
        sendAction(action);
    }
});

syncWorkerMiddleware.startListening({
    matcher: isAnyOf(player.next, player.play),
    effect: async () => {
        sendAction({ type: "map/next" });
    }
});

syncWorkerMiddleware.startListening({
    type: "grid/draw/completed",
    effect: async (_, { delay, getState }) => {
        const playing = getState().player.state === PLAYER_PLAY;
        const timeout = getState().speed.value;

        if (playing) {
            await delay(timeout);
            sendAction({ type: "map/next" });
        }
    }
});

syncWorkerMiddleware.startListening({
    actionCreator: player.reset,
    effect: (_, { dispatch }) => {
        dispatch(player.pause());
        dispatch(clear());
        restartWorker();
    }
});

export default syncWorkerMiddleware.middleware;