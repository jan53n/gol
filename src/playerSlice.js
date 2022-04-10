import { createSlice } from "@reduxjs/toolkit";
import { PLAYER_PAUSE, PLAYER_PREV, PLAYER_RESET, PLAYER_NEXT, PLAYER_PLAY } from './config';

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
    },
});

export const player = playerSlice.actions;
export default playerSlice;