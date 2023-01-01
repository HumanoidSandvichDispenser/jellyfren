<script setup lang="ts">
import { defineProps, PropType } from "vue";
import { BaseItemDto } from "@jellyfin/client-axios";
import AlbumCard from "./AlbumCard.vue";

const props = defineProps({
    albums: {
        type: Object as PropType<BaseItemDto[]>,
        required: true
    }
});
</script>

<template>
    <div class="album-list">
        <album-card
            v-for="(album, i) in albums"
            :key="i"
            :id="album.Id"
            :item="album"
            :album-name="album.Name ?? ''"
            :artist-name="album.AlbumArtist ?? ''"
        />
    </div>
</template>

<style>
.album-list {
    display: flex;
    flex-direction: row;
    column-gap: 16px;
    row-gap: 16px;
    flex-wrap: wrap;
}
</style>
