<script setup lang="ts">
import { computed } from "@vue/reactivity";
import SongItem from "../components/SongItem.vue";
import { BaseItemDto } from "@jellyfin/client-axios";
import store from "../store";

const songs = computed(() => store.state.currentPlaylist);
const currentSong = computed(() => store.state.currentSong);

function playSong(song: BaseItemDto) {
    store.dispatch.playSong(song);
}
</script>

<template>
    <div class="now-playing">
        <h1>Now Playing</h1>
	    <div class="songs">
            <song-item
                v-for="(song, i) in songs"
                :song="song"
                :index="i"
                :is-playing="song.Id == currentSong.Id"
                @play="playSong(song)"
            />
        </div>
    </div>
</template>

<style>
.now-playing {
    padding: 16px;
}
</style>
