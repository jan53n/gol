import { createSlice } from "@reduxjs/toolkit";
import { List, Set } from "immutable";
import { HISTORY_SIZE } from "./config";

export const cellSlice = createSlice({
    name: 'cells',
    initialState: {
        cells: Set(),
        history: List(),
        generation: 0,
    },
    reducers: {
        setCell: (state, action) => {
            const [x, y] = action.payload;
            state.cells = state.cells.add(List([x, y]));
        },
        drawCell: (state, { payload: [x, y, on, generation] }) => {
            state.generation = generation;

            if (on) {
                state.cells = state.cells.add(List([x, y]));
            } else {
                state.cells = state.cells.delete(List([x, y]));
            }
        },
        deleteCell: (state, action) => {
            const [x, y] = action.payload;
            state.cells = state.cells.delete(List([x, y]));
        },
        clearCells: (state) => {
            state.generation = 0;
            state.cells = state.cells.clear();
            state.history = state.history.clear();
        },
        setGeneration: (state, { payload }) => {
            state.generation = payload;
        },
        setHistory: (state, { payload }) => {
            state.history = state.history.push(payload);
        },
        removeLatestHistoryItem: (state) => {
            state.history = state.history.pop();
        },
        resizeHistory: (state) => {
            state.history = state.history.takeLast(HISTORY_SIZE);
        }
    }
});

export const {
    setCell,
    deleteCell,
    revertDiff,
    clearCells,
    setHistory,
    removeLatestHistoryItem,
    resizeHistory,
    setGeneration } = cellSlice.actions;