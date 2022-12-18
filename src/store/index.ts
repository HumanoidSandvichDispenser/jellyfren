import { createStore, StoreOptions } from "vuex";
import Song from "../song";
import { RootState } from "./types";
import mutations from "./mutations";

const test = new Song("F O R S E N B A J S", "2O3A");
test.isPlaying = true;

export default createStore({
    state: {
        currentPlaylist: [
            new Song("Your mom song", "DJ FGT"),
            new Song("Don't Doubt", "DJ FGT"),
            new Song("Same 3 Stones", "entexoi"),
            test,
            new Song("WHEN THE IMPOSTOR IS SNUS", "Karabast"),
        ],
        currentLibrary: ""
    },
    mutations
} as StoreOptions<RootState>);
