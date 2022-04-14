import { createSlice } from "@reduxjs/toolkit";
import { List, Set } from "immutable";

export const cellSlice = createSlice({
    name: 'cells',
    initialState: {
        cells: Set(),
    },
    reducers: {
        setCells: (state, action) => {
            state.cells = state.cells.add(List(action.payload));
        },
        deleteCells: (state, action) => {
            state.cells = state.cells.delete(List(action.payload));
        },
    }
});

export const { setCells, deleteCells } = cellSlice.actions;