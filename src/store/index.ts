import { StoreOptions } from "vuex";
import { createDirectStore } from "direct-vuex";
import Song from "../song";
import { RootState } from "./types";
import mutations from "./mutations";
import actions from "./actions";
import jellyfin from "./modules/jellyfin";

const {
    store,
    rootActionContext,
    moduleActionContext,
    rootGetterContext,
    moduleGetterContext,
} = createDirectStore({
    state: (): RootState => {
        return {
            currentPlaylist: [],
            items: {},
            libraries: [],
            currentSong: {},
            isPlaying: false
        }
    },
    mutations,
    actions,
    modules: {
        jellyfin,
    },
});

export default store;
export {
    rootActionContext,
    moduleActionContext,
    rootGetterContext,
    moduleGetterContext,
};

export type Store = typeof store;
