import { createListenerMiddleware, isAnyOf } from "@reduxjs/toolkit";
import { clear, draw } from "./cellSlice";
import { GRID_SIZE, PLAYER_PLAY } from "./config";
import { player } from "./playerSlice";
import store from "./store";
import HandleMap from "./worker";

const syncWorkerMiddleware = createListenerMiddleware();

const worker = new HandleMap({ width: GRID_SIZE, height: GRID_SIZE });

worker.start();

worker.listen("grid/draw", ({ payload }) => {
    store.dispatch(draw(payload));
});

syncWorkerMiddleware.startListening({
    predicate: ({ type, payload }) => {
        return type === "grid/draw" && payload.generation === undefined;
    },
    effect: (action, _listenerApi) => {
        worker.send(action);
    }
});

syncWorkerMiddleware.startListening({
    matcher: isAnyOf(player.next, player.play),
    effect: async () => {
        worker.send({ type: "map/next" });
    }
});

syncWorkerMiddleware.startListening({
    type: "grid/draw/completed",
    effect: async (_, { delay, getState }) => {
        const playing = getState().player.state === PLAYER_PLAY;
        const timeout = getState().speed.value;

        if (playing) {
            await delay(timeout);
            worker.send({ type: "map/next" });
        }
    }
});

syncWorkerMiddleware.startListening({
    actionCreator: player.reset,
    effect: async (_, { dispatch }) => {
        dispatch(clear());
        await worker.reset();
    }
});

export default syncWorkerMiddleware.middleware;