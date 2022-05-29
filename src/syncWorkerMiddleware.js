import { createListenerMiddleware, isAnyOf } from "@reduxjs/toolkit";
import { grid } from "./gridSlice";
import { GRID_SIZE } from "./config";
import { player } from "./playerSlice";
import store from "./store";
import { setIntervalSynchronous } from "./util";
import HandleMap from "./worker";
import { interval, Subscription, tap } from "rxjs";

const syncWorkerMiddleware = createListenerMiddleware();
/**
 * @type {Subscription}
 */
let playerSubscription;
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

worker.start();

worker.listen("grid/draw", ({ payload }) => {
    store.dispatch(grid.draw(payload));
});

syncWorkerMiddleware.startListening({
    predicate: () => true,
    effect: (action) => console.log('store', action),
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
        playerSubscription?.unsubscribe();
    }
});

syncWorkerMiddleware.startListening({
    actionCreator: player.play,
    effect: async (_, { getState }) => {
        const timeout = getState().speed.value;
        playerSubscription = interval(timeout)
            .pipe(
                tap(async () => {
                    worker.send({ type: "map/next" });
                    await waitForDrawCompletion();
                })
            )
            .subscribe();
    }
});

syncWorkerMiddleware.startListening({
    actionCreator: player.reset,
    effect: async (_, { dispatch }) => {
        await worker.reset();
        console.log('worker reset');
        dispatch(grid.clear());
    }
});

export default syncWorkerMiddleware.middleware;