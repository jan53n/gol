import { createListenerMiddleware, isAnyOf } from "@reduxjs/toolkit";
import { deleteCells, resizeHistory, setCells, setHistory } from "./cellSlice";
import { GRID_SIZE, HISTORY_SIZE } from "./config";

const cellsHistoryMiddleware = createListenerMiddleware();

cellsHistoryMiddleware.startListening({
    matcher: isAnyOf(setCells, deleteCells),
    effect: (action, listenerApi) => {

        const { cells: { history } } = listenerApi.getState();

        if (history.size > HISTORY_SIZE) {
            listenerApi.dispatch(resizeHistory());
        }
        
        if (!action.payload?.skipHistory) {
            listenerApi.dispatch(setHistory(action));
        }
    }
});

export default cellsHistoryMiddleware.middleware;