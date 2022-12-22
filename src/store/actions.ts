import { ActionContext } from "vuex";
import { RootState } from "./types";
import { defineActions } from "direct-vuex";
import store, { rootActionContext } from ".";
import { BaseItemDto } from "@jellyfin/client-axios";

const actions = defineActions({
    playSong(context, song: BaseItemDto) {
        const { state, commit, dispatch } = getContext(context);
        const id = song.Id;
        const basePath = state.jellyfin.configuration.basePath;
        const url = `${basePath}/Audio/${id}/stream`;
        if (state.audio) {
            state.audio.src = url;
            commit.setCurrentSong(song);
            dispatch.play();
        }
        //state.audio?.src = state.conf
    },
    play(context) {
        const { state, commit } = getContext(context);
        if (state.audio) {
            state.audio.play();
            commit.setIsPlaying(true);
        }
    },
    pause(context) {
        const { state, commit } = getContext(context);
        if (state.audio) {
            state.audio.pause();
            commit.setIsPlaying(false);
        }
    },
    stop(context) {
        const { state, commit } = getContext(context);
        if (state.audio) {
            state.audio.src = "";
            commit.setIsPlaying(false);
            commit.setCurrentSong({});
        }
    }
});

const getContext = (context: ActionContext<RootState, RootState>) =>
    rootActionContext(context);

export default actions;
