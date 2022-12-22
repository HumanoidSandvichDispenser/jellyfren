<script setup lang="ts">
import { computed, ref, Ref } from "vue";
import { useRoute } from "vue-router";
import store from "../store";
import { BaseItemDto } from "@jellyfin/client-axios";
import AlbumCard from "../components/AlbumCard.vue";

const route = useRoute();
const id = computed(() => route.params["id"] as string);
const name = computed(() => {
    let item = store.state.items[id.value];
    if (item) {
        return item.Name ?? "Loading";
    }
    return "Loading";
});

const albums: Ref<BaseItemDto[]> = ref([]);

// fetch info about the current library
store.state.jellyfin.userLibraryApi?.getItem({
    userId: store.state.jellyfin.userId,
    itemId: id.value
}).then((res) => {
    store.commit.setItem({ id: id.value, item: res.data });
});

// fetch albums
store.state.jellyfin.itemsApi?.getItemsByUserId({
    userId: store.state.jellyfin.userId,
    includeItemTypes: ["MusicAlbum"],
    parentId: id.value,
}).then((res) => {
    if (res.data.Items) {
        res.data.Items.forEach(item => {
            if (item.Id) {
                store.commit.setItem({ id: item.Id, item: item });
            }
        });
        albums.value = res.data.Items;
    }
    console.log(res.data);
})

console.log(id.value);
</script>

<template>
    <div class="library">
        <h1>{{ name }}</h1>
        <div class="albums">
            <album-card
                v-for="(album, i) in albums"
                :key="i"
                :image-id="album.Id"
                :album-name="album.Name ?? ''"
                :artist-name="album.AlbumArtist ?? ''"
            />
        </div>
    </div>
</template>

<style>
.library {
    padding: 16px;
}

.albums {
    display: flex;
    flex-direction: row;
    column-gap: 16px;
    row-gap: 16px;
    flex-wrap: wrap;
}
</style>
