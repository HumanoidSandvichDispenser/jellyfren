import Song from "../song";
import Client from "@/jellyfin/client";

export interface RootState {
    currentPlaylist: Song[],
    currentLibrary: string,
};
