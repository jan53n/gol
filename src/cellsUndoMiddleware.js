import { createListenerMiddleware } from "@reduxjs/toolkit";
import { deleteCell, removeLatestHistoryItem, setCell } from "./cellSlice";
import { player } from "./playerSlice";

const cellsUndoMiddleware = createListenerMiddleware();


cellsUndoMiddleware.startListening({
    actionCreator: player.previous,
    effect: (_action, listenerApi) => {
        const { cells: { history } } = listenerApi.getState();
        const lastHistoryItem = history.last();

        if (!lastHistoryItem) {
            return;
        }

        lastHistoryItem.payload.skipHistory = true;
        listenerApi.dispatch(removeLatestHistoryItem());

        if (lastHistoryItem.type === "cells/setCell") {
            listenerApi.dispatch(deleteCell(lastHistoryItem.payload));
        } else {
            listenerApi.dispatch(setCell(lastHistoryItem.payload));
        }
    }
});

export default cellsUndoMiddleware.middleware;