import { createListenerMiddleware } from "@reduxjs/toolkit";
import { player } from "./playerSlice";

const playMiddleware = createListenerMiddleware();

playMiddleware.startListening({
    actionCreator: player.play,
    effect: async (action, listenerApi) => { }
});

playMiddleware.startListening({
    actionCreator: player.pause,
    effect: async (action, listenerApi) => { }
});


export default playMiddleware.middleware;