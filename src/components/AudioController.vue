<script setup lang="ts">
import { computed, ref } from "vue";
import { useStore } from "../store";
import { RouterLink } from "vue-router";
import ProgressSlider from "./ProgressSlider.vue";

const store = useStore();

const progress = computed({
    get: (): number => {
        return progressVal.value = store.audio.currentTime;
    },
    set: (value: number): void => {
        progressVal.value = store.audio.currentTime = value;
    }
});

const runTime = computed(() => {
    if (store.currentSong.RunTimeTicks) {
        const ticks = store.currentSong.RunTimeTicks;
        const ms = ticks / 10000;
        const s = ms / 1000;
        return s;
    }
    return 1;
})

const volume = computed({
    get: (): number => {
        if (store.audio) {
            volumeVal.value = store.audio.volume;
        }
        return volumeVal.value;
    },
    set: (value: number): void => {
        if (store.audio) {
            store.audio.volume = value;
        }
        volumeVal.value = value;
    }
});

const isMutedVal = ref(false);

const isMuted = computed({
    get: (): boolean => {
        if (store.audio) {
            isMutedVal.value = store.audio.muted;
        }
        return isMutedVal.value;
    },
    set: (value: boolean): void => {
        if (store.audio) {
            store.audio.muted = value;
        }
        isMutedVal.value = value;
    }
});

const progressVal = ref(0);
const volumeVal = ref(1);
//setInterval(() => progressUpdate.value = true, 1000);
const isPlaying = computed(() => store.isPlaying);
const currentSong = computed(() => store.currentSong);
const currentSongLink = computed(() => "/list/" + currentSong.value.ParentId);

function play() {
    store.play();
}

function pause() {
    store.pause();
}

function stop() {
    store.stop();
}

function mute() {
    isMuted.value = !isMuted.value;
}

setInterval(() => {
    progressVal.value++;
    progressVal.value--;
    //store.audio.currentTime = store.audio.currentTime;
}, 100);
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
                <progress-slider v-model:value="progress" :max="runTime" />
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
