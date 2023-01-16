<script setup lang="ts">
import { defineProps, PropType } from "vue";
import { BaseItemDto } from "@jellyfin/client-axios";
import AlbumCard from "./AlbumCard.vue";
import AlbumItem from "./AlbumItem.vue";

const props = defineProps({
    albums: {
        type: Object as PropType<BaseItemDto[]>,
        required: true
    }
});
</script>

<template>
    <div class="album-list flex">
        <!--album-item
            v-memo
            v-for="(album, i) in albums"
            :key="i"
            :item="album"
            :id="album.Id"
            :album-name="album.Name ?? ''"
            :artist-name="album.AlbumArtist ?? ''"
            :album-artists="album.AlbumArtists ?? []"
        /-->
        <table cellspacing="0">
            <album-item
                v-memo
                v-for="(album, i) in albums"
                :key="i"
                :album="album"
            />
        </table>
    </div>
</template>

<style>
.album-list.flex {
    display: flex;
    flex-direction: row;
    column-gap: 16px;
    row-gap: 16px;
    flex-wrap: wrap;
}
</style>
