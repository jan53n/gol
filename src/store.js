import { createSlice, configureStore } from '@reduxjs/toolkit';
import gridSlice from './gridSlice';
import { CELL_SIZE, SPEED_DEFAULT, ZOOM_DEFAULT } from './config';
import playerSlice from './playerSlice';
import { serializableMiddleware } from './serializableMiddleware';
import syncWorkerMiddleware from './syncWorkerMiddleware';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';

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
        grid: gridSlice.reducer,
        player: playerSlice.reducer,
    },

    middleware: [
        serializableMiddleware,
        syncWorkerMiddleware
    ]
});

export const { zoomTo } = zoomSlice.actions;
export const { setSpeed } = speedSlice.actions;

export const useZoom = () => {
    const zoom = useSelector(({ zoom }) => zoom.value);
    return useMemo(() => CELL_SIZE - (zoom * CELL_SIZE) / 100, [zoom]);
};

export default store;