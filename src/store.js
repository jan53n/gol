import { createSlice, configureStore } from '@reduxjs/toolkit';
import { PLAYER_PAUSE, PLAYER_PLAY, PLAYER_PREV, PLAYER_NEXT, SPEED_DEFAULT, ZOOM_DEFAULT, PLAYER_RESET } from './config';

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
        setDiff: (state, action) => {
            state.add = action.payload.add;
            state.remove = action.payload.remove;
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

let gameLoopIntervalId;

store.subscribe(() => {
    const { player, speed } = store.getState();

    // initiate game loop with setInterval
    if (player.state === PLAYER_PLAY && !gameLoopIntervalId) {
        gameLoopIntervalId = window.setInterval(() => {
            store.dispatch(setDiff({ add: [[10, 10], [3, 3]], remove: [] }));
        }, speed.value);
    }

    if (player.state === PLAYER_PAUSE && gameLoopIntervalId) {
        window.clearInterval(gameLoopIntervalId);
        gameLoopIntervalId = undefined;
    }

    if (player.state === PLAYER_NEXT) {
        store.dispatch(setDiff({ add: [[2, 2], [7, 8]], remove: [] }));
    }

    if (player.state === PLAYER_PREV) {
        store.dispatch(setDiff({ add: [[15, 10], [5, 3]], remove: [] }));
    }

    if (player.state === PLAYER_RESET) {
        store.dispatch(setDiff({ add: [[15, 10], [5, 3]], remove: [] }));
    }
});

export default store;