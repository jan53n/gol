import { createListenerMiddleware, isAnyOf } from "@reduxjs/toolkit";
import { deleteCell, resizeHistory, setCell, setHistory } from "./cellSlice";
import { HISTORY_SIZE } from "./config";

const cellsHistoryMiddleware = createListenerMiddleware();

cellsHistoryMiddleware.startListening({
    matcher: isAnyOf(setCell, deleteCell),
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