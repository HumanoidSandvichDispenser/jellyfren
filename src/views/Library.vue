<script setup lang="ts">
import { computed, ref, Ref, watch } from "vue";
import { useRoute } from "vue-router";
import store from "../store";
import {
    BaseItemDto, ItemsApiGetItemsByUserIdRequest
} from "@jellyfin/client-axios";
import AlbumCard from "../components/AlbumCard.vue";
import LoadingSpinner from "../components/LoadingSpinner.vue";

const route = useRoute();
const id = computed(() => route.params["id"] as string);
const queryType = computed(() => route.query["type"] as string);
const name = computed(() => {
    let item = store.state.items[id.value];
    if (item) {
        return item.Name ?? "Loading";
    }
    return "Loading";
});

const albums: Ref<BaseItemDto[]> = ref([]);
const isLoading = ref(true);

// fetch info about the current library
function fetchCurrentLibrary() {
    store.state.jellyfin.userLibraryApi?.getItem({
        userId: store.state.jellyfin.userId,
        itemId: id.value,
    }).then((res) => {
        store.commit.setItem({ id: id.value, item: res.data });
    });
}

// fetch albums
function fetchAlbums() {
    isLoading.value = true;
    const params: ItemsApiGetItemsByUserIdRequest = {
        userId: store.state.jellyfin.userId,
        includeItemTypes: ["MusicAlbum"],
        recursive: true,
        parentId: queryType.value == "artist" ? undefined : id.value,
        sortBy: ["SortName"],
        albumArtistIds: []
    };

    // if we're querying an artist, then filter through album artist id
    if (queryType.value) {
        params.albumArtistIds?.push(id.value);
    }

    store.state.jellyfin.itemsApi?.getItemsByUserId(params).then((res) => {
        isLoading.value = false;
        if (res.data.Items) {
            res.data.Items.forEach(item => {
                if (item.Id) {
                    store.commit.setItem({ id: item.Id, item: item });
                }
            });
            albums.value = res.data.Items;
        }
        console.log(res.data);
    });
}

watch(
    () => route.params,
    () => {
        fetchCurrentLibrary();
        albums.value.length = 0;
        fetchAlbums();
        console.log(queryType);
    }
);

fetchCurrentLibrary();
fetchAlbums();
</script>

<template>
    <div class="library">
        <h1>{{ name }}</h1>
        <h2>Albums</h2>
        <div class="albums">
            <loading-spinner v-if="isLoading" />
            <album-card
                v-for="(album, i) in albums"
                :key="i"
                :id="album.Id"
                :item="album"
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
