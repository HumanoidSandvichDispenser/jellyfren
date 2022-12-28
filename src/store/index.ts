import { reactive, ref } from "vue";
import { defineStore } from "pinia";
import { BaseItemDto } from "@jellyfin/client-axios";
import { useJellyfinStore } from "./jellyfin";
import { RootState } from "./types";

export const useStore = defineStore("store", () => {
    const jellyfin = useJellyfinStore();

    const currentPlaylist = ref<BaseItemDto[]>([]);
    const currentSong = ref<BaseItemDto>({ });
    //const audio = reactive(new Audio());
    const audio = ref(new Audio());

    async function playSong(song: BaseItemDto) {
        if (currentPlaylist.value.indexOf(song) == -1) {
            throw "Song should be in the current playlist before playing.";
        }

        const id = song.Id;
        const basePath = jellyfin.configuration.basePath;

        // I spent 5 hours researching ways to get around webkit not being able
        // to seek streams, when all I had to do was append `?static=true` to
        // the URL. :DDDDD
        const url = `${basePath}/Audio/${id}/stream?static=true`;

        audio.value.src = url;
        currentSong.value = song;
        play();
    }

    function playSongByIndex(index: number) {
        playSong(currentPlaylist.value[index]);
    }

    function removeFromPlaylist(index: number) {
        currentPlaylist.value.splice(index, 1);
    }

    const isPlaying = ref(false);

    function play() {
        if (audio) {
            audio.value.play();
            isPlaying.value = true;
        }
    }

    function pause() {
        if (audio) {
            audio.value.pause();
            isPlaying.value = false;
        }
    }

    function stop() {
        if (audio) {
            audio.value.src = "";
            isPlaying.value = false;
            currentSong.value = { };
        }
    }

    function seek(time: number) {
        audio.value.currentTime = time;
    }

    const items = ref<{ [id: string]: BaseItemDto }>({ });
    const libraries = ref<BaseItemDto[]>([]);

    function setItem(id: string, item: BaseItemDto) {
        if (item == undefined) {
            delete items.value[id];
        } else {
            items.value[id] = item;
        }
    }

    return {
        currentPlaylist,
        currentSong,
        isPlaying,
        audio,
        playSong,
        playSongByIndex,
        removeFromPlaylist,
        play,
        pause,
        stop,
        seek,
        items,
        libraries,
        setItem,
    };
});
