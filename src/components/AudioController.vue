<script setup lang="ts">
import { computed } from "vue";
import store from "../store";
import { RouterLink } from "vue-router";

const isPlaying = computed(() => store.state.isPlaying);
const currentSong = computed(() => store.state.currentSong);
const currentSongLink = computed(() => "/list/" + currentSong.value.ParentId);

function play() {
    store.dispatch.play();
}

function pause() {
    store.dispatch.pause();
}

function stop() {
    store.dispatch.stop();
}
</script>

<template>
    <div class="audio-controller">
        <div class="song-info">
            <div class="title">
                <router-link :to="currentSongLink">
                    {{ currentSong.Name }}
                </router-link>
            </div>
            <div class="artist">{{ currentSong.AlbumArtist }}</div>
        </div>
        <div class="gap"></div>
        <div class="song-controls">
            <button v-if="isPlaying" @click="pause">Pause</button>
            <button v-else @click="play">Play</button>
            <button @click="stop">Stop</button>
        </div>
        <div class="gap"></div>
        <div class="song-misc">
            <button @click="stop">Favorite</button>
        </div>
    </div>
</template>

<style>
.audio-controller {
    display: flex;
    column-gap: 8px;
    width: 100%;
    padding: 8px;
    box-shadow: 0px -1px 4px var(--bg-dark);
}

.audio-controller > div {
    align-self: center;
    vertical-align: center;
}

.audio-controller .song-info {
    align-self: flex-start;
    flex: 1;
}

.audio-controller .song-controls {
    flex: 1;
}

.audio-controller > div > button {
    margin: 4px;
}

.audio-controller .song-misc {
    align-self: flex-end;
}
</style>
