<script setup lang="ts">
import { computed } from "@vue/reactivity";
import { BaseItemDto } from "@jellyfin/client-axios";
import SongItem from "../components/SongItem.vue";
import draggable from "vuedraggable";
import store from "../store";
import AudioController from "../components/AudioController.vue";

const songs = computed({
    get: (): BaseItemDto[] => store.state.currentPlaylist,
    set: (value: BaseItemDto[]): void => store.commit.setCurrentPlaylist(value)
});

const currentSong = computed(() => store.state.currentSong);

function playSong(song: BaseItemDto) {
    store.dispatch.playSong(song);
}

function removeByIndex(index: number) {
    store.commit.removeFromPlaylist(index);
}
</script>

<template>
    <div class="now-playing">
        <h1>Now Playing</h1>
        <audio-controller />
        <draggable
            v-model="songs"
            item-key="id"
            tag="table"
            class="songs"
        >
            <template #item="{ element, index }">
                <song-item
                    :song="element"
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
.now-playing {
    padding: 16px;
}

.now-playing .songs {
    width: 100%;
}
</style>
