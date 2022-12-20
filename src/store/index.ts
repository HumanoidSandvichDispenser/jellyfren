import { StoreOptions } from "vuex";
import { createDirectStore } from "direct-vuex";
import Song from "../song";
import { RootState } from "./types";
import mutations from "./mutations";
import jellyfin from "./modules/jellyfin";

/*
const store = createStore({
    state: {
        currentPlaylist: [
            new Song("Your mom song", "DJ FGT"),
            new Song("Don't Doubt", "DJ FGT"),
            new Song("Same 3 Stones", "entexoi"),
            new Song("F O R S E N B A J S", "2O3A"),
            new Song("WHEN THE IMPOSTOR IS SNUS", "Karabast"),
        ],
        currentLibrary: "",
        client: undefined,
        protocol: "https",
        address: "",
        port: 8096,
        username: "",
        password: ""
    },
    mutations
} as StoreOptions<RootState>);
*/

const { store, rootActionContext, moduleActionContext } = createDirectStore({
    state: {
        currentPlaylist: [
            new Song("Your mom song", "DJ FGT"),
            new Song("Don't Doubt", "DJ FGT"),
            new Song("Same 3 Stones", "entexoi"),
            new Song("F O R S E N B A J S", "2O3A"),
            new Song("WHEN THE IMPOSTOR IS SNUS", "Karabast"),
        ],
        currentLibrary: ""
    },
    mutations,
    modules: {
        jellyfin
    }
});

export default store;
export {
    rootActionContext,
    moduleActionContext
};
