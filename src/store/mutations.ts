import Song from "../song";
import { RootState } from "./types";

const mutations = {
    ADD_TO_PLAYLIST(state: RootState, song: Song) {
        state.currentPlaylist.push(song);
    },
    REMOVE_FROM_PLAYLIST(state: RootState, index: number) {
        state.currentPlaylist.splice(index, 1);
    },
    SET_CURRENT_PLAYLIST(state: RootState, playlist: Song[]) {
        state.currentPlaylist = playlist;
    },
    PLAY_SONG(state: RootState, newSong: Song) {
        state.currentPlaylist.forEach((song: Song, i: number) => {
            song.isPlaying = song == newSong;
        });
    },
    PLAY_SONG_BY_INDEX(state: RootState, index: number) {
        state.currentPlaylist.forEach((song: Song, i: number) => {
            song.isPlaying = i == index;
        });
    }
}

export default mutations;
