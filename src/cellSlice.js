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
            const cells = action.payload;

            if (cells[0] instanceof Array) {
                return cells.forEach((cell) => {
                    state.cells = state.cells.add(List(cell));
                });
            }

            state.cells = state.cells.add(List(action.payload));
        },
        deleteCells: (state, action) => {
            const cells = action.payload;

            if (cells[0] instanceof Array) {
                return cells.forEach((cell) => {
                    state.cells = state.cells.delete(List(cell));
                });
            }

            state.cells = state.cells.delete(List(action.payload));
        },
        clearCells: (state) => {
            state.generation = 0;
            state.cells = state.cells.clear();
        }
    }
});

export const { setCells, deleteCells, setGeneration, revertDiff, clearCells } = cellSlice.actions;