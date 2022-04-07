import { createSlice, configureStore } from '@reduxjs/toolkit';
import { PLAYER_PAUSE, PLAYER_PREV, PLAYER_RESET, PLAYER_NEXT, PLAYER_PLAY, SPEED_DEFAULT, ZOOM_DEFAULT } from './config';

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
        play: (state) => {
            state.state = PLAYER_PLAY;
        },
        pause: (state) => {
            state.state = PLAYER_PAUSE;
        },
        next: (state) => {
            state.state = PLAYER_NEXT;
        },
        previous: (state) => {
            state.state = PLAYER_PREV;
        },
        reset: (state) => {
            state.state = PLAYER_RESET;
        }
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
export const player = playerSlice.actions;

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

    // clear loop
    if (
        [PLAYER_PAUSE, PLAYER_RESET, PLAYER_NEXT, PLAYER_PREV].includes(player.state)
        && gameLoopIntervalId) {
        window.clearInterval(gameLoopIntervalId);
        gameLoopIntervalId = undefined;
    }
});

export default store;