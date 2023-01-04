<script setup lang="ts">
import { computed } from "@vue/reactivity";
import { BaseItemDto } from "@jellyfin/client-axios";
import { useStore } from "@/store";
import { useJellyfinStore } from "@/store/jellyfin";
import SongItem from "../components/SongItem.vue";
import draggable from "vuedraggable";
import AudioController from "../components/AudioController.vue";

const store = useStore();

const songs = computed({
    get: (): BaseItemDto[] => store.currentPlaylist,
    set: (value: BaseItemDto[]) => store.currentPlaylist = value
});

const currentSong = computed(() => store.currentSong);

function playSong(song: BaseItemDto) {
    store.playSong(song);
}

function removeByIndex(index: number) {
    store.removeFromPlaylist(index);
}
</script>

<template>
    <div class="now-playing">
        <h1>Now Playing</h1>
        <draggable
            v-model="songs"
            item-key="id"
            tag="table"
            class="songs"
        >
            <template #item="{ element, index }">
                <song-item
                    :song="element"
                    :index="index + 1"
                    :is-playing="element.Id == currentSong.Id"
                    is-in-playlist
                    should-show-album
                    @play="playSong(element)"
                    @remove="removeByIndex(index)"
                />
            </template>
        </draggable>
    </div>
</template>

<style>
.now-playing h1 {
    padding: 16px;
}

.now-playing .songs {
    width: 100%;
}
</style>
