import { createListenerMiddleware, isAnyOf } from "@reduxjs/toolkit";
import { grid } from "./gridSlice";
import { GRID_SIZE } from "./config";
import { player } from "./playerSlice";
import store from "./store";
import { setIntervalSynchronous } from "./util";
import HandleMap from "./worker";

const syncWorkerMiddleware = createListenerMiddleware();
let unsubscribePlayer;
const worker = new HandleMap({ width: GRID_SIZE, height: GRID_SIZE });

const waitForDrawCompletion = () => {
    return new Promise((resolve) => {
        syncWorkerMiddleware.startListening({
            type: "grid/draw/completed",
            effect: (action, { unsubscribe }) => {
                resolve(action);
                unsubscribe();
            }
        });
    });
};

const clearPlay = () => {
    if (unsubscribePlayer) {
        unsubscribePlayer();
        unsubscribePlayer = undefined;
    }
}

worker.start();

worker.listen("grid/draw", ({ payload }) => {
    store.dispatch(grid.draw(payload));
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
    actionCreator: player.next,
    effect: async () => {
        worker.send({ type: "map/next" });
    }
});

syncWorkerMiddleware.startListening({
    matcher: isAnyOf(player.next, player.pause, player.reset, player.play),
    effect: async () => {
        clearPlay();
    }
});

syncWorkerMiddleware.startListening({
    actionCreator: player.play,
    effect: async (_, { getState }) => {
        const timeout = getState().speed.value;

        unsubscribePlayer = setIntervalSynchronous(
            async () => {
                worker.send({ type: "map/next" });
                await waitForDrawCompletion();
            },
            timeout
        );
    }
});

syncWorkerMiddleware.startListening({
    actionCreator: player.reset,
    effect: async (_, { dispatch }) => {
        worker.reset();
        dispatch(grid.clear());
    }
});

export default syncWorkerMiddleware.middleware;