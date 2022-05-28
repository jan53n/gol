import { createSlice } from "@reduxjs/toolkit";
import { List, Set } from "immutable";

export const gridSlice = createSlice({
    name: 'grid',
    initialState: {
        cells: Set(),
        generation: 0,
    },
    reducers: {
        draw: (state, { payload: { generation, drawables } }) => {

            if (generation) {
                state.generation = generation;
            }

            drawables.forEach(([x, y, on]) => {
                if (on) {
                    state.cells = state.cells.add(List([x, y]));
                } else {
                    state.cells = state.cells.delete(List([x, y]));
                }
            });
        },
        clear: (state) => {
            state.generation = 0;
            state.cells = Set();
        },
    }
});

export default gridSlice;

export const {
    draw,
    clear,
} = gridSlice.actions;