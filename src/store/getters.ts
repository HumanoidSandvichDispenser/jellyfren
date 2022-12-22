import { defineGetters } from "direct-vuex";
import { rootGetterContext } from ".";
import { RootState } from "./types";

const getters = {
    isPlaying(...args: [any, any]): boolean {
        const { state } = rootGetterContext(args);
        if (state.audio) {
            const isPlaying = !state.audio.paused;
            return isPlaying;
        }
        return false;
    },
};

const getContext = (args: [any, any]) =>
    rootGetterContext(args);
