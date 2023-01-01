<script setup lang="ts">
import { useStore } from "@/store";
import { useJellyfinStore } from "@/store/jellyfin";
import {
    BaseItemDto,
    ItemsApiGetItemsByUserIdRequest
} from "@jellyfin/client-axios";
import { computed, ref, watch } from "vue";
import { useRoute } from "vue-router";
import AlbumList from "@/components/AlbumList.vue";
import ArtistCard from "@/components/ArtistCard.vue";
import { AxiosResponse } from "axios";

const route = useRoute();
const store = useStore();
const jellyfin = useJellyfinStore();

const id = computed(() => route.params["id"] as string);
const tab = computed(() => route.params["tab"] as string);
const page = ref(0);

function gotoPage(increment: number) {
    page.value += increment;
    page.value = Math.max(page.value, 0);
    loadCurrentTab();
}

watch(tab, (newTab, oldTab) => {
    loadCurrentTab();
    page.value = 0;
});

async function fetchChildren(parentId?: string, types?: string[]) {
    const params: ItemsApiGetItemsByUserIdRequest = {
        userId: jellyfin.userId,
        includeItemTypes: types,
        recursive: true,
        parentId,
        sortBy: ["SortName"],
        albumArtistIds: [],
        limit: 100,
        startIndex: page.value * 100,
    };
    return await jellyfin.itemsApi?.getItemsByUserId(params);
}

function setItemsFromResult(collection: typeof albums, result?: AxiosResponse) {
    let items = result?.data.Items as BaseItemDto[];
    if (items && result) {
        items.forEach((item) => {
            store.setItem(item.Id, item);
        });
        collection.value = result.data.Items;
    }
}

let albums = ref<BaseItemDto[]>([]);

function fetchAlbums() {
    // TODO: add caching
    fetchChildren(id.value, ["MusicAlbum"])
        .then((res) => {
            setItemsFromResult(albums, res);
        });
}

let artists = ref<BaseItemDto[]>([]);

function fetchArtists() {
    jellyfin.artistsApi?.getArtists({
        userId: jellyfin.userId,
        parentId: id.value,
    })
        .then((res) => {
            setItemsFromResult(artists, res);
        });
}

function loadCurrentTab() {
    switch (tab.value) {
        case "albums": {
            fetchAlbums();
            break;
        }
        case "artists": {
            fetchArtists();
            break;
        }
    }
}

loadCurrentTab();
</script>

<template>
    <div class="library">
        <div>{{ tab }}</div>
        <div>
            <router-link :to="`/library/${id}/albums`">Albums</router-link>
            <router-link :to="`/library/${id}/artists`">Artists</router-link>
        </div>
        <div>
            Page {{ page + 1}}
            <button @click="gotoPage(-1)">back</button>
            <button @click="gotoPage(1)">next</button>
        </div>
        <div class="albums" v-show="tab == 'albums'">
            <album-list :albums="albums" />
        </div>
        <div class="artists" v-show="tab == 'artists'">
            <artist-card
                v-for="(artist, i) in artists"
                :key="i"
                :item="artist"
            />
        </div>
        <div class="">

        </div>
    </div>
</template>

<style>
.library {
    padding: 16px;
}

.library > div {
    display: flex;
    flex-direction: row;
    column-gap: 16px;
    row-gap: 16px;
    flex-wrap: wrap;
}
</style>
