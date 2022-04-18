import { createSlice, configureStore } from '@reduxjs/toolkit';
import cellsHistoryMiddleware from './cellsHistoryMiddleware';
import { cellSlice } from './cellSlice';
import cellsUndoMiddleware from './cellsUndoMiddleware';
import { SPEED_DEFAULT, ZOOM_DEFAULT } from './config';
import playerSlice from './playerSlice';
import { serializableMiddleware } from './serializableMiddleware';

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

const store = configureStore({
    reducer: {
        zoom: zoomSlice.reducer,
        speed: speedSlice.reducer,
        cells: cellSlice.reducer,
        player: playerSlice.reducer,
    },

    middleware: [
        serializableMiddleware,
        cellsHistoryMiddleware,
        cellsUndoMiddleware,
    ]
});

export const { zoomTo } = zoomSlice.actions;
export const { setSpeed } = speedSlice.actions;
export default store;