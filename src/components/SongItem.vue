<script setup lang="ts">
import { computed, onMounted, PropType, ref, watch } from "vue";
import { BaseItemDto } from "@jellyfin/client-axios";
import { useJellyfinStore } from "../store/jellyfin";

const jellyfin = useJellyfinStore();

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

const displayIndex = computed(() => props.index ?? props.song.IndexNumber);

const artists = computed(() => {
    if (props.song.Artists) {
        return props.song.Artists.join(", ");
    }
    return props.song.AlbumArtist;
});

const albumUrl = computed(() => {
    if (props.song.AlbumId) {
        return "/list/" + props.song.AlbumId;
    }
    return "";
});

const imageUrl = computed(() => {
    const id = props.song.AlbumId;
    const baseUrl = jellyfin.configuration.basePath;
    return `${baseUrl}/Items/${id}/Images/Primary?fillWidth=128`;
});

const isFavorite = ref(false);

watch(props.song, (song) => {
    isFavorite.value = song.UserData?.IsFavorite ?? false;
});

onMounted(() => {
    if (props.song) {
        isFavorite.value = props.song.UserData?.IsFavorite ?? false;
    }
});

function favorite() {
    if (isFavorite.value) {
        jellyfin.userLibraryApi?.unmarkFavoriteItem(
            {
                userId: jellyfin.userId,
                itemId: props.song.Id ?? "",
            })
            .then((response) => {
                isFavorite.value = response.data.IsFavorite ?? false;
            });
    } else {
        jellyfin.userLibraryApi?.markFavoriteItem(
            {
                userId: jellyfin.userId,
                itemId: props.song.Id ?? "",
            })
            .then((response) => {
                isFavorite.value = response.data.IsFavorite ?? false;
            });
    }
}
</script>

<template>
    <tr :class="{ 'song-item': true, 'current': isPlaying }">
        <td class="song-index">
            <span v-if="displayIndex != undefined">
                {{ displayIndex }}
            </span>
        </td>
        <td class="song-album-art" v-if="shouldShowAlbum">
            <img :src="imageUrl" />
        </td>
        <td class="song-info">
            <div class="title">
                {{ props.song.Name }}
            </div>
            <div class="artist">{{ artists }}</div>
        </td>
        <td class="song-album-title" v-if="shouldShowAlbum">
            <router-link v-if="shouldShowAlbum" :to="albumUrl">
                {{ props.song.Album }}
            </router-link>
        </td>
        <td class="divider">
        </td>
        <td class="song-actions" align="right">
            <button @click="$emit('play')" class="icon-button">
                <bootstrap-icon icon="play-circle-fill" />
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
            <button
                :class="{
                    'icon-button': true,
                    'is-favorite': isFavorite,
                }"
                @click="favorite"
            >
                <span v-if="isFavorite">
                    <bootstrap-icon  class="hover" icon="heartbreak-fill" />
                    <bootstrap-icon icon="heart-fill" class="normal" />
                </span>
                <bootstrap-icon v-else icon="heart-fill" />
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

.song-item.current {
    color: var(--accent);
}

.song-item > td {
    vertical-align: middle;
}

.song-item > td:not(:first-child) {
    vertical-align: middle;
    padding-left: 8px;
}

.song-item .song-actions {
    transition-duration: 200ms;
    padding: 8px 16px;
}

.song-item:hover {
    background-color: var(--bg1);
    transition-duration: 200ms;
}

.song-item .song-actions > button.is-favorite {
    opacity: unset;
    color: var(--accent);
}

.song-item .song-actions > button {
    opacity: 0;
}

.song-item .song-actions > button .hover {
    display: none;
}

.song-item .song-actions > button .normal {
    display: unset;
}

.song-item .song-actions > button:hover .hover {
    display: unset;
}

.song-item .song-actions > button:hover .normal {
    display: none;
}

.song-item:hover .song-actions > button {
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
    max-width: 64px;
    max-height: 64px;
}

.song-album-art .album-art-bar-container {
    display: flex;
    height: 100%;
    width: 100%;
    column-gap: 8px;
}

.album-art-bar-container .album-art-bar {
    background-color: var(--fg0);
    width: 16px;
    display: block;
    /*animation: album-art-bar 0.8s infinite;*/
}

.album-art-bar.bar-1 {
    animation-delay: 200ms;
    animation-duration: 1s;
}

.album-art-bar.bar-2 {
    animation-delay: 100ms;
    animation-duration: 0.7s;
}

.album-art-bar.bar-3 {
    animation-delay: 300ms;
    animation-duration: 0.4s;
}

@keyframes album-art-bar {
    0% {
        transform: scaleY(0.9);
    }
    25% {
        transform: scaleY(0.7);
    }
    35% {
        transform: scaleY(0.6);
    }
    40% {
        transform: scaleY(0.7);
    }
    50% {
        transform: scaleY(0.2);
    }
    100% {
        transform: scaleY(1.0);
    }
}

.song-album-art img {
    width: 64px;
    height: 64px;
    vertical-align: middle;
}

.song-info > .artist {
    color: var(--fg2);
}

.current .song-info > .artist {
    color: unset;
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
