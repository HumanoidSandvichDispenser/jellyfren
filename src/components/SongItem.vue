<script setup lang="ts">
import SongInfo from "../song-info";

const props = defineProps({
    title: String,
    artist: String,
    isInPlaylist: Boolean,
    isPlaying: Boolean,
    index: Number
});
</script>

<template>
    <div
        ref="song-item"
        class="song-item"
    >
        <div class="song-info">
            <div class="title">
                {{ title }}
                <span v-if="isPlaying">(Currently playing)</span>
            </div>
            <div class="artist">{{ artist }}</div>
        </div>
        <div class="divider">
        </div>
        <div class="song-actions">
            <button @click="$emit('play')">Play</button>
            <button v-if="isInPlaylist" @click="$emit('remove')">
                Remove
            </button>
            <button v-else>Add to Playlist</button>
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

.song-info {
    text-align: left;
}

.song-info > .artist {
    color: var(--fg2);
}

.song-actions button {
    background-color: var(--bg0);
    color: var(--fg0);
    margin: 4px;
    transition-duration: 200ms;
}

.song-actions button:hover {
    background-color: var(--blue);
    color: var(--bg0);
    transition-duration: 200ms;
}
</style>
