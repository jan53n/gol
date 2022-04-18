import { createListenerMiddleware } from "@reduxjs/toolkit";
import { deleteCells, removeLatestHistoryItem, setCells } from "./cellSlice";
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

        if (lastHistoryItem.type === "cells/setCells") {
            listenerApi.dispatch(deleteCells(lastHistoryItem.payload));
        } else {
            listenerApi.dispatch(setCells(lastHistoryItem.payload));
        }
    }
});

export default cellsUndoMiddleware.middleware;