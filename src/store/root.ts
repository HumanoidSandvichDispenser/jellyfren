import { ref } from "vue";
import { defineStore } from "pinia";
import { BaseItemDto } from "@jellyfin/client-axios";
import { useJellyfinStore } from "./jellyfin";
import { RootState } from "./types";

export const useRootStore = defineStore("root", {
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

/*
export const useRootStore = defineStore("root", () => {
    const jellyfin = useJellyfinStore();

    const currentPlaylist = ref<BaseItemDto[]>([]);
    const items = ref<{ [id: string]: BaseItemDto }>({ });
    const libraries = ref<BaseItemDto[]>([]);
    const currentSong = ref<BaseItemDto>({ });
    const isPlaying = ref(false);
    const audio = ref(new Audio());

    function playSong(song: BaseItemDto) {
        if (currentPlaylist.value.indexOf(song) == -1) {
            throw "Song should be in the current playlist before playing.";
        }

        const id = song.Id;
        const basePath = jellyfin.configuration.basePath;
        const url = `${basePath}/Audio/${id}/stream`;
        if (audio.value) {
            audio.value.src = url;
            currentSong.value = song;
            play();
        }
    }

    function play() {
        if (audio.value) {
            audio.value.play();
            isPlaying.value = true;
        }
    }

    function pause() {
        if (audio.value) {
            audio.value.pause();
            isPlaying.value = false;
        }
    }

    function stop() {
        if (audio.value) {
            audio.value.src = "";
            isPlaying.value = false;
            currentSong.value = {};
        }
    }

    function setItem(id: string, item: BaseItemDto) {
        if (item == undefined) {
            delete items.value[id];
        } else {
            items.value[id] = item;
        }
    }

    return {
        currentPlaylist,
        items,
        libraries,
        currentSong,
        isPlaying,
        audio,
        playSong,
        play,
        pause,
        stop,
        setItem,
    };
});
*/
