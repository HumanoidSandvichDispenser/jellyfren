<script setup lang="ts">
import { useJellyfinStore } from "@/store/jellyfin";
import { BaseItemDto } from "@jellyfin/client-axios";
import { computed, PropType } from "vue";

const jellyfin = useJellyfinStore();

const props = defineProps({
    album: {
        type: Object as PropType<BaseItemDto>,
        required: true,
    },
});

const url = computed(() => "/list/" + props.album.Id);

const artistUrl = computed(() => {
    if (props.album.AlbumArtists) {
        const albumArtists = props.album.AlbumArtists;
        if (albumArtists.length > 0) {
            const id = props.album.AlbumArtists[0].Id;
            if (id) {
                return "/library/" + id;
            }
        }
    }
    return "";
});

const imageUrl = computed(() => {
    const id = props.album.Id;
    const baseUrl = jellyfin.configuration.basePath;
    return `${baseUrl}/Items/${id}/Images/Primary?fillWidth=128`;
});
</script>

<template>
    <tr class="album item">
        <td class="album-art">
            <img :src="imageUrl">
        </td>
        <td class="album-name">
            <span>
                <router-link :to="url">
                    {{ props.album.Name }}
                </router-link>
            </span>
        </td>
        <td class="artist">
            <span>
                <!-- TODO: link to EVERY album artist -->
                <router-link :to="artistUrl">
                    {{ props.album.AlbumArtist }}
                </router-link>
            </span>
        </td>
    </tr>
</template>

<style>
.album.item {
    padding: 0;
}

.album.item .album-art img {
    display: block;
    width: 48px;
    height: 48px;
}

.album.item td > span {
    margin-left: 8px;
    margin-right: 8px;
}
</style>
