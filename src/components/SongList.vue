<script setup lang="ts">
import { defineProps, PropType, ref } from "vue";
import { useStore } from "../store";
import { BaseItemDto } from "@jellyfin/client-axios";
import SongItem from "../components/SongItem.vue";

const store = useStore();

const props = defineProps({
    songs: {
        type: Object as PropType<BaseItemDto[]>,
        required: true
    },
    sortable: Boolean,
});

const emit = defineEmits(["change"]);

const songs = computed({
    get: () => {
        return props.songs;
    },
    set: (value: BaseItemDto[]) => {
        emit("change", value);
    }
})

function playSong(song: BaseItemDto) {
    store.currentPlaylist.push(song);
    store.playSong(song);
}

function add(song: BaseItemDto) {
    store.currentPlaylist.push(song);
}

function remove(song: BaseItemDto) {
    const index = store.currentPlaylist.indexOf(song);
    if (index > -1) {
        store.removeFromPlaylist(index);
    }
}
</script>

<template>
    <table class="songs">
        <song-item
            v-for="(song, i) in songs"
            :song="song"
            :index="i"
            @play="playSong(song)"
            @remove="remove(song)"
            @add="add(song)"
        />
    </table>
</template>

<style>
.songs > h1 {
    padding: 16px;
}

.songs {
    border-spacing: 0;
    width: 100%;
}

.list-info {
    position: relative;
    display: flex;
    padding: 16px;
}

.list-info::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0.5;
}

.list-info > * {
    position: relative;
    filter: initial;
}

.list-info .cover img {
    max-width: 192px;
    max-height: 192px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.list-info .details {
    padding-left: 16px;
    display: flex;
    flex-direction: column;
    align-content: flex-end;
}

.list-info .details .name {
    margin-bottom: 8px;
    font-size: 32px;
    font-weight: 700;
    line-height: 1em;
}

.list-info .details .other {
    color: var(--fg2);
}
</style>
