import { createListenerMiddleware, isAnyOf } from "@reduxjs/toolkit";
import { clearCells, deleteCell, generationComplete, setCell } from "./cellSlice";
import { PLAYER_PLAY } from "./config";
import { player } from "./playerSlice";
import { restartWorker } from "./worker";
import { sendAction } from "./worker";

const syncWorkerMiddleware = createListenerMiddleware();

restartWorker('top');

syncWorkerMiddleware.startListening({
    matcher: isAnyOf(setCell, deleteCell),
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
    actionCreator: generationComplete,
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
        restartWorker('reset');
        dispatch(clearCells());
    }
});

export default syncWorkerMiddleware.middleware;