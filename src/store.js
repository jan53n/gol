import { createSlice, configureStore } from '@reduxjs/toolkit';
import { ZOOM_DEFAULT } from './config';

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

export const { zoomTo } = zoomSlice.actions;

const store = configureStore({
    reducer: {
        zoom: zoomSlice.reducer
    }
});

export default store;