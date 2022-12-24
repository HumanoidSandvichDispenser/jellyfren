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
    <div class="song-item">
        <div class="song-index" v-if="props.song.IndexNumber && !isInPlaylist">
            {{ props.song.IndexNumber }}
        </div>
        <div class="song-album" v-if="isInPlaylist">
            <img :src="imageUrl" />
        </div>
        <div class="song-info">
            <div class="title">
                {{ props.song.Name }}
                <span v-if="isPlaying">(currently playing)</span>
            </div>
            <div class="artist">{{ artists }}</div>
        </div>
        <div class="divider">
        </div>
        <div class="song-actions">
            <button @click="$emit('play')">Play</button>
            <button v-if="isInPlaylist" @click="$emit('remove')">
                Remove
            </button>
            <button v-else @click="$emit('add')">Add to Queue</button>
        </div>
    </div>
</template>

<style>
.song-item {
    display: flex;
    color: var(--fg0);
    background-color: var(--bg0);
    padding: 8px;
    transition-duration: 200ms;
    height: 48px;
}

.song-item .song-actions {
    display: none;
}

.song-item:hover {
    background-color: var(--bg1);
    transition-duration: 200ms;
}

.song-item:hover .song-actions {
    display: flex;
}

.song-item .divider {
    flex: 1;
}

.song-index {
    margin-right: 1em;
    width: 2em;
    text-align: right;
}

.song-album {
    margin-right: 8px;
}

.song-album > img {
    width: 48px;
    height: 48px;;
}

.song-info {
    text-align: left;
}

.song-info > .artist {
    color: var(--fg2);
}

.song-actions button {
    background-color: var(--bg0);
    color: var(--fg0);
    margin: 0 4px;
    transition-duration: 200ms;
    text-align: center;
}

.song-actions button:hover {
    background-color: var(--blue);
    color: var(--bg0);
    transition-duration: 200ms;
}
</style>
