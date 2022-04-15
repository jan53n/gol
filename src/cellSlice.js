import { createSlice } from "@reduxjs/toolkit";
import { List, Set } from "immutable";

export const cellSlice = createSlice({
    name: 'cells',
    initialState: {
        cells: Set(),
        generation: 0,
    },
    reducers: {
        setCells: (state, action) => {
            state.cells = state.cells.add(List(action.payload));
        },
        deleteCells: (state, action) => {
            state.cells = state.cells.delete(List(action.payload));
        },
        setDiff: (state, action) => {
            state.generation += 1;
            const { add, remove } = action.payload;
            add.forEach((cell) => {
                state.cells = state.cells.add(List(cell));
            });

            remove.forEach((cell) => {
                state.cells = state.cells.delete(List(cell));
            });
        },
        clearCells: (state, action) => {
            state.generation = 0;
            state.cells = Set();
        },
    }
});

export const { setCells, deleteCells, setDiff, clearCells } = cellSlice.actions;