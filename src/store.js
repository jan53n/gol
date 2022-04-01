import { createSlice, configureStore } from '@reduxjs/toolkit';
import { SPEED_DEFAULT, ZOOM_DEFAULT } from './config';

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

export const { zoomTo } = zoomSlice.actions;
export const { setSpeed } = speedSlice.actions;

const store = configureStore({
    reducer: {
        zoom: zoomSlice.reducer,
        speed: speedSlice.reducer,
    }
});

export default store;