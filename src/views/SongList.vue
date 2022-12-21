<script setup lang="ts">
import SongItem from "../components/SongItem.vue";
import Song from "../song";
import { computed } from "vue";
import { useStore } from "vuex";
import draggable from "vuedraggable";

const store = useStore();

//const playlist = computed(() => store.state.currentPlaylist);
const songs = computed({
});

function playSongByIndex(index: number) {
    store.commit("PLAY_SONG_BY_INDEX", index);
}

function setSongs() {
}
</script>

<template>
    <div class="dashboard">
        <h1>Now Playing ({{ songs.length }})</h1>
        <draggable
            v-model="songs"
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
