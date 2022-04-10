import { createSlice, configureStore } from '@reduxjs/toolkit';
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

const diffSlice = createSlice({
    name: 'diff',
    initialState: {
        add: [],
        remove: [],
        history: [],
    },
    reducers: {
        setDiff: (state, action) => {
            state.add = action.payload.add;
            state.remove = action.payload.remove;
        },
    }
});

const store = configureStore({
    reducer: {
        zoom: zoomSlice.reducer,
        speed: speedSlice.reducer,
        diff: diffSlice.reducer,
        player: playerSlice.reducer,
    },
    middleware: [
        playMiddleware
    ]
});

export const { zoomTo } = zoomSlice.actions;
export const { setSpeed } = speedSlice.actions;
export const { setDiff } = diffSlice.actions;
export default store;