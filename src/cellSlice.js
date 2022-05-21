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
            const cells = action.payload;

            if (cells[0] instanceof Array) {
                return cells.forEach((cell) => {
                    state.cells = state.cells.add(List(cell));
                });
            }

            state.cells = state.cells.add(List(cells));
        },
        deleteCell: (state, action) => {
            const cells = action.payload;

            if (cells[0] instanceof Array) {
                return cells.forEach((cell) => {
                    state.cells = state.cells.delete(List(cell));
                });
            }

            state.cells = state.cells.delete(List(cells));
        },
        clearCells: (state) => {
            state.generation = 0;
            state.cells = state.cells.clear();
            state.history = state.history.clear();
        },
        setGeneration: (state, action) => {
            const { add, remove } = action.payload;

            add.forEach((cell) => {
                state.cells = state.cells.add(List(cell));
            });

            remove.forEach((cell) => {
                state.cells = state.cells.delete(List(cell));
            });
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

export const { setCell, deleteCell, revertDiff, clearCells, setHistory, removeLatestHistoryItem, resizeHistory, setGeneration } = cellSlice.actions;