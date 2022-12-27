import { ref } from "vue";
import { defineStore } from "pinia";
import { BaseItemDto } from "@jellyfin/client-axios";
import { useJellyfinStore } from "./jellyfin";
import { RootState } from "./types";

export const useStore = defineStore("store", {
    state: (): RootState => ({
        currentPlaylist: [],
        items: { },
        libraries: [],
        currentSong: { },
        isPlaying: false,
        audio: new Audio(),
    }),

    actions: {
        playSong(song: BaseItemDto) {
            const jellyfin = useJellyfinStore();
            if (this.currentPlaylist.indexOf(song) == -1) {
                throw "Song should be in the current playlist before playing.";
            }

            const id = song.Id;
            const basePath = jellyfin.configuration.basePath;
            const url = `${basePath}/Audio/${id}/stream`;

            if (this.audio) {
                this.audio.src = url;
                this.currentSong = song;
                this.play();
            }
        },

        playSongByIndex(index: number) {
            this.playSong(this.currentPlaylist[index]);
        },

        removeFromPlaylist(index: number) {
            this.currentPlaylist.splice(index, 1);
        },

        play() {
            if (this.audio) {
                this.audio.play();
                this.isPlaying = true;
            }
        },

        pause() {
            if (this.audio) {
                this.audio.pause();
                this.isPlaying = false;
            }
        },

        stop() {
            if (this.audio) {
                this.audio.src = "";
                this.isPlaying = false;
                this.currentSong = { };
            }
        },

        setItem(id: string, item: BaseItemDto) {
            if (item == undefined) {
                delete this.items[id];
            } else {
                this.items[id] = item;
            }
        },
    }
});
