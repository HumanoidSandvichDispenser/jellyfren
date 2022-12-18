import Song from "../song";

export interface RootState {
    currentPlaylist: Song[],
    currentLibrary: string
};
