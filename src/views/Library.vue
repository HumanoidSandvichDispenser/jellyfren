<script setup lang="ts">
import { computed, ref, Ref, watch } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "@/store";
import { useJellyfinStore } from "@/store/jellyfin";
import {
    BaseItemDto, ItemsApiGetItemsByUserIdRequest
} from "@jellyfin/client-axios";
import AlbumCard from "../components/AlbumCard.vue";
import LoadingSpinner from "../components/LoadingSpinner.vue";

const store = useStore();
const jellyfin = useJellyfinStore();

const route = useRoute();
const id = computed(() => route.params["id"] as string);
const queryType = computed(() => route.query["type"] as string);
const name = computed(() => {
    let item = store.items[id.value];
    if (item) {
        return item.Name ?? "Loading";
    }
    return "Loading";
});

// fetch info about the current library
function fetchCurrentLibrary() {
    jellyfin.userLibraryApi?.getItem({
        userId: jellyfin.userId,
        itemId: id.value,
    }).then((res) => {
        store.setItem(id.value, res.data);
    });
}

fetchCurrentLibrary();

const albums: Ref<BaseItemDto[]> = ref([]);
const isLoading = ref(true);

function fetchAlbums() {
    isLoading.value = true;
    const params: ItemsApiGetItemsByUserIdRequest = {
        userId: jellyfin.userId,
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

    jellyfin.itemsApi?.getItemsByUserId(params).then((res) => {
        isLoading.value = false;
        if (res.data.Items) {
            res.data.Items.forEach(item => {
                if (item.Id) {
                    store.setItem(item.Id, item);
                }
            });
            albums.value = res.data.Items;
        }
        console.log(res.data);
    });
}

fetchAlbums();

watch(
    () => route.params,
    () => {
        fetchCurrentLibrary();
        albums.value.length = 0;
        fetchAlbums();
        console.log(queryType);
    }
);
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
