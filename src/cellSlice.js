import { createSlice } from "@reduxjs/toolkit";
import { List, Set } from "immutable";

export const cellSlice = createSlice({
    name: 'cells',
    initialState: {
        cells: Set(),
        generation: 0,
    },
    reducers: {
        setCell: (state, action) => {
            const [x, y] = action.payload;
            state.cells = state.cells.add(List([x, y]));
        },
        setGeneration: (state, { payload: { generation, drawables } }) => {
            state.generation = generation;

            drawables.forEach(([x, y, on]) => {
                if (on) {
                    state.cells = state.cells.add(List([x, y]));
                } else {
                    state.cells = state.cells.delete(List([x, y]));
                }
            });
        },
        generationComplete: () => { },
        deleteCell: (state, action) => {
            const [x, y] = action.payload;
            state.cells = state.cells.delete(List([x, y]));
        },
        clearCells: (state) => {
            state.generation = 0;
            state.cells = state.cells.clear();
        },
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
    setGeneration,
    generationComplete,
} = cellSlice.actions;