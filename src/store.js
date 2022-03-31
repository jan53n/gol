import { createSlice, configureStore } from '@reduxjs/toolkit';

const [ZOOM_MIN, ZOOM_MAX, ZOOM_DEFAULT] = [0, 100, 0];

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

export { ZOOM_DEFAULT, ZOOM_MIN, ZOOM_MAX };

export const { zoomTo } = zoomSlice.actions;

const store = configureStore({
    reducer: {
        zoom: zoomSlice.reducer
    }
});

export default store;