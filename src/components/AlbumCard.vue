<script setup lang="ts">
import { computed, defineProps, PropType } from "vue";
import { RouterLink } from "vue-router";
import { useJellyfinStore } from "@/store/jellyfin";
import { BaseItemDto } from "@jellyfin/client-axios";

const jellyfin = useJellyfinStore();

const props = defineProps({
    id: String,
    albumName: String,
    artistName: String,
    item: {
        type: Object as PropType<BaseItemDto>,
        required: true
    },
});

const albumUrl = computed(() => "/list/" + props.id);
const artistUrl = computed(() => {
    if (props.item && props.item.AlbumArtists) {
        const albumArtists = props.item.AlbumArtists;
        if (albumArtists.length > 0) {
            const id = props.item.AlbumArtists[0].Id;
            if (id) {
                return "/library/" + id + "?type=artist";
            }
        }
    }
    return "/";
});

const imageUrl = computed(() => {
    const id = props.id;
    const baseUrl = jellyfin.configuration.basePath;
    return `${baseUrl}/Items/${id}/Images/Primary?fillWidth=128`;
});

function imageFallback($event: Event) {
    if ($event.target instanceof HTMLImageElement) {
        $event.target.src = "https://cdn.7tv.app/emote/6309cf2ea78179df357449f3/4x.webp";
    }
}
</script>

<template>
    <div class="album card">
        <div class="image">
            <img :src="imageUrl" @error="imageFallback" />
        </div>
        <div class="footer">
            <div class="primary-text">
                <router-link :to="albumUrl">
                    {{ albumName }}
                </router-link>
            </div>
            <div class="secondary-text">
                <router-link
                    :to="artistUrl"
                >
                    {{ artistName }}
                </router-link>
            </div>
        </div>
    </div>
</template>

<style>
.album.card {
    width: 192px;
    background-color: var(--bg-dark);
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 2px rgba(0, 0, 0, 0.2);
}

.album.card img {
    display: block;
    width: 192px;
    height: 192px;
    border-radius: 8px;
}

.album.card img:hover {
    cursor: pointer;
    filter: brightness(50%);
    transition-duration: 200ms;
}

.album .image {
    margin-bottom: 0;
}

.album .footer {
    padding: 0.5em;
}

.album .footer div {
    display: block;
    width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    padding: 0.25em;
    line-height: 1;
    font-size: 14px;
}

.album .footer .secondary-text a {
    color: var(--fg2);
}

.album .footer .secondary-text a:hover {
    color: var(--accent);
}
</style>
