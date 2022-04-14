import { createSlice, configureStore } from '@reduxjs/toolkit';
import { List, Set } from 'immutable';
import { SPEED_DEFAULT, ZOOM_DEFAULT } from './config';
import playerSlice from './playerSlice';
import playMiddleware from './playMiddleware';

const zoomSlice = createSlice({
    name: 'zoom',
    initialState: {
        value: ZOOM_DEFAULT
    },
    reducers: {
        zoomTo: (state, action) => {
            state.value = action.payload;
        },
    }
});

const speedSlice = createSlice({
    name: 'speed',
    initialState: {
        value: SPEED_DEFAULT
    },
    reducers: {
        setSpeed: (state, action) => {
            state.value = action.payload;
        },
    }
});

const cellSlice = createSlice({
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

const store = configureStore({
    reducer: {
        zoom: zoomSlice.reducer,
        speed: speedSlice.reducer,
        cells: cellSlice.reducer,
        player: playerSlice.reducer,
    },
    middleware: [
        playMiddleware
    ]
});

export const { zoomTo } = zoomSlice.actions;
export const { setSpeed } = speedSlice.actions;
export const { setCells, deleteCells } = cellSlice.actions;
export default store;