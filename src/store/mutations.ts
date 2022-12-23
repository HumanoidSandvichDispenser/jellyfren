import { BaseItemDto } from "@jellyfin/client-axios";
import Song from "../song";
import { RootState } from "./types";

const mutations = {
    addToPlaylist(state: RootState, song: BaseItemDto) {
        state.currentPlaylist.push(song);
    },
    removeFromPlaylist(state: RootState, index: number) {
        state.currentPlaylist.splice(index, 1);
    },
    setCurrentPlaylist(state: RootState, playlist: BaseItemDto[]) {
        state.currentPlaylist = playlist;
    },
    setLibraries(state: RootState, libraries: BaseItemDto[]) {
        state.libraries = libraries;
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
