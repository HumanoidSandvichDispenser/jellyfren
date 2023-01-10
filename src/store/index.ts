import { reactive, ref } from "vue";
import { defineStore } from "pinia";
import { BaseItemDto } from "@jellyfin/client-axios";
import { useJellyfinStore } from "./jellyfin";

export const useStore = defineStore("store", () => {
    const jellyfin = useJellyfinStore();

    const currentPlaylist = ref<BaseItemDto[]>([]);
    const currentSong = ref<BaseItemDto>({ });
    const audio = reactive(new Audio());

    audio.onended = next;

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

        audio.src = url;
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
        audio.play();
        isPlaying.value = true;
    }

    function pause() {
        audio.pause();
        isPlaying.value = false;
    }

    function stop() {
        if (audio) {
            audio.pause();
            audio.src = "";
            isPlaying.value = false;
            currentSong.value = { };
        }
    }

    function next() {
        const index = currentPlaylist.value.findIndex((item) =>
            item.Id == currentSong.value.Id);
        if (index == -1) {
            // somehow the current song is not in the current playlist
            return;
        }

        // if there are no songs after this then stop
        if (index + 1 >= currentPlaylist.value.length) {
            stop();
            return;
        }

        // otherwise play the next song
        playSong(currentPlaylist.value[index + 1]);
    }

    // TODO: replace this with cache.itemCache
    const items = ref<{ [id: string]: BaseItemDto }>({ });
    const libraries = ref<BaseItemDto[]>([]);
    const playlists = ref<BaseItemDto[]>([]);

    function setItem(id?: string, item?: BaseItemDto) {
        if (id == undefined) {
            return;
        }

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
        next,
        items,
        libraries,
        playlists,
        setItem,
    };
});
