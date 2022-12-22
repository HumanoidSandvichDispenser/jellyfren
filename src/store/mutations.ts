import { BaseItemDto } from "@jellyfin/client-axios";
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
    setCurrentLibrary(state: RootState, library: BaseItemDto) {
        state.currentLibrary = library;
    },
    setItem(state: RootState, payload: { id: string, item: BaseItemDto }) {
        if (payload.item == undefined) {
            delete state.items[payload.id];
        } else {
            state.items[payload.id] = payload.item;
        }
    },
    setAudio(state: RootState, audio: HTMLAudioElement) {
        state.audio = audio;
    },
    setCurrentSong(state: RootState, song: BaseItemDto) {
        state.currentSong = song;
    },
    setIsPlaying(state: RootState, isPlaying: boolean) {
        state.isPlaying = isPlaying;
    },
};

export default mutations;
