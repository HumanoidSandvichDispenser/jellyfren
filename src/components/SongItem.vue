<script setup lang="ts">
import { computed, PropType } from "vue";
import { BaseItemDto } from "@jellyfin/client-axios";
import store from "../store";

const props = defineProps({
    song: {
        type: Object as PropType<BaseItemDto>,
        required: true,
    },
    isInPlaylist: Boolean,
    isPlaying: Boolean,
    index: Number,
    shouldShowAlbum: Boolean,
});

const artists = computed(() => {
    if (props.song.Artists) {
        return props.song.Artists.join(", ");
    }
    return props.song.AlbumArtist;
});

const imageUrl = computed(() => {
    const id = props.song.AlbumId;
    const baseUrl = store.state.jellyfin.configuration.basePath;
    return `${baseUrl}/Items/${id}/Images/Primary?fillWidth=128`;
});
</script>

<template>
    <tr class="song-item">
        <td class="song-index" v-if="props.song.IndexNumber && !isInPlaylist">
            {{ props.song.IndexNumber }}
        </td>
        <td class="song-album-art" v-if="isInPlaylist">
            <img :src="imageUrl" />
        </td>
        <td class="song-info">
            <div class="title">
                {{ props.song.Name }}
                <span v-if="isPlaying">(currently playing)</span>
            </div>
            <div class="artist">{{ artists }}</div>
        </td>
        <td class="song-album-title">
            <div v-if="shouldShowAlbum">{{ props.song.Album }}</div>
        </td>
        <td class="divider">
        </td>
        <td class="song-actions" align="right">
            <button @click="$emit('play')" class="icon-button">
                <bootstrap-icon icon="play-circle-fill" />
            </button>
            <button class="icon-button">
                <bootstrap-icon icon="heart-fill" />
            </button>
            <button
                v-if="isInPlaylist"
                @click="$emit('remove')"
                class="icon-button"
            >
                <bootstrap-icon icon="dash-circle-fill" />
            </button>
            <button v-else @click="$emit('add')" class="icon-button">
                <bootstrap-icon icon="plus-circle-fill" />
            </button>
        </td>
    </tr>
</template>

<style>
.song-item {
    color: var(--fg0);
    background-color: var(--bg0);
    padding: 8px;
    transition-duration: 200ms;
    height: 64px;
}

.song-item > td {
    vertical-align: middle;
}

.song-item > td:not(:first-child) {
    vertical-align: middle;
    padding-left: 8px;
}

.song-item .song-actions {
    opacity: 0;
    transition-duration: 200ms;
    padding: 8px 16px;
}

.song-item:hover {
    background-color: var(--bg1);
    transition-duration: 200ms;
}

.song-item:hover .song-actions {
    opacity: 1;
    transition-duration: 200ms;
}

.song-index {
    padding-left: 16px;
    width: 2em;
}

.song-album-art {
    width: 64px;
    height: 64px;
}

.song-album-art > img {
    width: 64px;
    height: 64px;
    vertical-align: middle;
}

.song-info > .artist {
    color: var(--fg2);
}

.song-actions button {
    background-color: var(--bg0);
    color: var(--fg0);
    margin: 0 8px;
    transition-duration: 200ms;
    text-align: center;
}

.song-actions button:hover {
    background-color: var(--accent);
    color: var(--bg0);
    transition-duration: 200ms;
}
</style>
