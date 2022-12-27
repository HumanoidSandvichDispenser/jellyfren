<script setup lang="ts">
import SongItem from "../components/SongItem.vue";
import Song from "../song";
import draggable from "vuedraggable";
import { computed } from "vue";
import { useStore } from "../store";

const store = useStore();

const props = defineProps({
    listTitle: String,
    isSortable: Boolean,
    isPlaylist: Boolean,
    songs: Array<Song>
});

const emit = defineEmits([ "update:songs" ]);

const songs = computed({
    get: (): Song[] => props.songs ?? [],
    set: (value: Song[]): void => emit("update:songs", value)
});

function playSongByIndex(index: number) {
    store.playSongByIndex(index);
}
</script>

<template>
    <div class="song-list">
        <h1>{{ listTitle }} ({{ songs.length }})</h1>
        <div v-if="isSortable" class="songs sortable">
            <draggable
                v-model="songs"
                item-key="id"
            >
                <template #item="{ element, index }">
                    <!--song-item
                        :title="element.title"
                        :artist="element.artist"
                        :index="index"
                        :is-in-playlist="isPlaylist"
                        :is-playing="element.isPlaying"
                        @play="playSongByIndex(index)"
                    /-->
                </template>
            </draggable>
        </div>
        <div v-else class="songs">
            <!--song-item
                v-for="(song, i) in songs"
                :title="song.title"
                :artist="song.artist"
                :index="i"
                :is-in-playlist="isPlaylist"
                :is-playing="song.isPlaying"
                @play="playSongByIndex(i)"
            /-->
        </div>
        <!--greet /-->
    </div>
</template>
