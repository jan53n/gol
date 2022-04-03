import { createSlice, configureStore } from '@reduxjs/toolkit';
import { PLAYER_PAUSE, SPEED_DEFAULT, ZOOM_DEFAULT } from './config';

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

const playerSlice = createSlice({
    name: 'player',
    initialState: {
        state: PLAYER_PAUSE
    },
    reducers: {
        setPlayerState: (state, action) => {
            state.state = action.payload;
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
        setDiff: (state, { payload: { add, remove } }) => {
            [state.add, state.remove] = [add, remove];
        },
    }
});

export const { zoomTo } = zoomSlice.actions;
export const { setSpeed } = speedSlice.actions;
export const { setDiff } = diffSlice.actions;
export const { setPlayerState } = playerSlice.actions;

const store = configureStore({
    reducer: {
        zoom: zoomSlice.reducer,
        speed: speedSlice.reducer,
        diff: diffSlice.reducer,
        player: playerSlice.reducer,
    }
});

export default store;