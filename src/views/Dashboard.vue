<script setup lang="ts">
import Song from "../song";
import { computed } from "vue";
import SongList from "../components/SongList.vue";
import store from "@/store";

//const playlist = computed(() => store.state.currentPlaylist);
const playlist = computed({
    get: (): Song[] => store.state.currentPlaylist,
    set: (value: Song[]) => store.commit.setCurrentPlaylist(value)
});

function playSongByIndex(index: number) {
    store.commit.playSongByIndex(index);
}
</script>

<template>
    <div class="dashboard">
        <song-list
            v-model:songs="playlist"
            list-title="Now Playing"
            is-sortable
        />
    </div>
</template>
