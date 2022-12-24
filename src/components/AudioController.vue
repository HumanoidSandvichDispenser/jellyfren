<script setup lang="ts">
import { computed, ref } from "vue";
import store from "../store";
import { RouterLink } from "vue-router";
import ProgressSlider from "./ProgressSlider.vue";

const progress = computed({
    get: (): number => {
        if (store.state.audio) {
            progressVal.value = store.state.audio.currentTime;
        }
        return progressVal.value;
    },
    set: (value: number): void => {
        if (store.state.audio) {
            store.state.audio.currentTime = value;
        }
        progressVal.value = value;
    }
});

const volume = computed({
    get: (): number => {
        if (store.state.audio) {
            volumeVal.value = store.state.audio.volume;
        }
        return volumeVal.value;
    },
    set: (value: number): void => {
        if (store.state.audio) {
            store.state.audio.volume = value;
        }
        volumeVal.value = value;
    }
});

const isMuted = computed({
    get: (): boolean => {
        if (store.state.audio) {
            isMutedVal.value = store.state.audio.muted;
        }
        return isMutedVal.value;
    },
    set: (value: boolean): void => {
        if (store.state.audio) {
            store.state.audio.muted = value;
        }
        isMutedVal.value = value;
    }
});

const progressVal = ref(0);
const volumeVal = ref(1);
const isMutedVal = ref(1);
//setInterval(() => progressUpdate.value = true, 1000);
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

function mute() {
    isMuted.value = !isMuted.value;
}
</script>

<template>
    <div class="audio-controller">
        <div class="controller-section song-info">
            <div class="title">
                <router-link :to="currentSongLink">
                    {{ currentSong.Name }}
                </router-link>
            </div>
            <div class="artist">{{ currentSong.AlbumArtist }}</div>
        </div>
        <div class="controller-section song-controls">
            <div>
                <button v-if="isPlaying" @click="pause">Pause</button>
                <button v-else @click="play">Play</button>
                <button @click="stop">Stop</button>
            </div>
            <div>
                <progress-slider v-model:value="progress" :max="100" />
            </div>
        </div>
        <div class="controller-section song-misc">
            <div>
                <button @click="stop">Favorite</button>
                <button @click="mute">{{ isMuted ? "Unmute" : "Mute" }}</button>
            </div>
            <div>
                <progress-slider v-model:value="volume" :max="1" :step="0.05" />
            </div>
        </div>
    </div>
</template>

<style>
.audio-controller {
    display: flex;
    column-gap: 8px;
    width: 100%;
    padding: 8px;
}

.audio-controller > div {
    align-self: center;
    vertical-align: center;
    flex: 1;
}

.audio-controller .song-info {
    align-self: flex-start;
}

.audio-controller .song-controls {
    align-self: flex-end;
}

.audio-controller > div > button {
    margin: 4px;
}

.audio-controller .song-misc {
    align-self: flex-end;
    align-content: center;
}
</style>
