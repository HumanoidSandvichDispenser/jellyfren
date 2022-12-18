<script setup lang="ts">
import SongItem from "./components/SongItem.vue";
import Song from "./song";
import { computed } from "vue";
import { useStore } from "vuex";
import draggable from "vuedraggable";

const store = useStore();

//const playlist = computed(() => store.state.currentPlaylist);
const playlist = computed({
    get: (): Song[] => store.state.currentPlaylist,
    set: (value: Song[]) => store.commit("SET_CURRENT_PLAYLIST", value)
});

function playSongByIndex(index: number) {
    store.commit("PLAY_SONG_BY_INDEX", index);
}
</script>

<template>
    <div class="container">
        <h1>Now Playing ({{ playlist.length }})</h1>
        <draggable
            v-model="playlist"
            item-key="id"
        >
            <template #item="{ element, index }">
                <song-item
                    v-bind="element"
                    :artist="element.artist"
                    :index="index"
                    @play="playSongByIndex(index)"
                />
            </template>
        </draggable>
        <!--greet /-->
    </div>
</template>

<style>
:root {
    --bg0: #0d1117;
    --bg1: #161b22;
    --bg2: #21262d;
    --fg0: #ecf2f8;
    --fg1: #c6cdd5;
    --fg2: #89929b;
    --red: #fa7970;
    --orange: #faa356;
    --yellow: #ffdc8f;
    --green: #7ce38b;
    /*--cyan: #a2d2fb;*/
    --blue: #77bdfb;
    --magenta: #cea5fb;
}

body,
#app {
    background-color: var(--bg0);
    color: var(--fg0);
}

body {
    margin: 0;
    min-height: 100vh;
}
</style>
