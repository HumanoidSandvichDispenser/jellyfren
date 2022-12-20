import Song from "../song";
import { RootState } from "./types";

const mutations = {
    addToPlaylist(state: RootState, song: Song) {
        state.currentPlaylist.push(song);
    },
    removeFromPlaylist(state: RootState, index: number) {
        state.currentPlaylist.splice(index, 1);
    },
    setCurrentPlaylist(state: RootState, playlist: Song[]) {
        state.currentPlaylist = playlist;
    },
    playSong(state: RootState, newSong: Song) {
        state.currentPlaylist.forEach((song: Song, i: number) => {
            song.isPlaying = song == newSong;
        });
    },
    playSongByIndex(state: RootState, index: number) {
        state.currentPlaylist.forEach((song: Song, i: number) => {
            song.isPlaying = i == index;
        });
    },
}

export default mutations;
