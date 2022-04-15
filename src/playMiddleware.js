import { createListenerMiddleware } from "@reduxjs/toolkit";
import { clearCells, setCells, setDiff } from "./cellSlice";
import { GRID_SIZE } from "./config";
import { Universe } from "./gol";
import { player } from "./playerSlice";
import store from "./store";

const playMiddleware = createListenerMiddleware();
const setter = (diff) => {
    store.dispatch(setDiff(diff));
};

let universe;

playMiddleware.startListening({
    actionCreator: player.play,
    effect: async (action, listenerApi) => {
        const { speed, cells } = listenerApi.getState();

        if (!(universe instanceof Universe)) {
            universe = new Universe({ gridSize: GRID_SIZE }, cells.cells);
        }

        universe.run(
            setter,
            speed.value
        );
    }
});

playMiddleware.startListening({
    actionCreator: player.pause,
    effect: async (action, listenerApi) => {
        if (universe instanceof Universe) {
            universe.clearLoop();
        }
    }
});

playMiddleware.startListening({
    actionCreator: player.reset,
    effect: async (action, listenerApi) => {
        if (universe instanceof Universe) {
            universe.clearLoop();
            store.dispatch(clearCells());
        }
    }
});

playMiddleware.startListening({
    actionCreator: setCells,
    effect: async (action, listenerApi) => {
        if (universe instanceof Universe) {
            universe.push(action.payload);
        }
    }
});

playMiddleware.startListening({
    actionCreator: player.next,
    effect: async (action, listenerApi) => {
        if (universe instanceof Universe) {
            if (action.type === 'player/next') {
                setter(universe.next());
            }
        }
    }
});


export default playMiddleware.middleware;