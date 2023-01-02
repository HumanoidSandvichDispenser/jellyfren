<script setup lang="ts">
import { useStore } from "@/store";
import { useJellyfinStore } from "@/store/jellyfin";
import {
    BaseItemDto,
    ItemsApiGetItemsByUserIdRequest
} from "@jellyfin/client-axios";
import { computed, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { AxiosResponse } from "axios";
import { useCacheStore } from "@/store/cache";
import AlbumList from "@/components/AlbumList.vue";
import ArtistCard from "@/components/ArtistCard.vue";
import LoadingSpinner from "@/components/LoadingSpinner.vue";
import { useSettingsStore } from "@/store/settings";

const route = useRoute();
const store = useStore();
const jellyfin = useJellyfinStore();
const cache = useCacheStore();
const settings = useSettingsStore();

const id = computed(() => route.params["id"] as string);
const tab = computed(() => route.params["tab"] as string);
const page = ref(0);

const totalCount = computed(() => {
    switch (tab.value) {
        case "albums":
            return cache.albumCount;
        case "artists":
            return cache.artistCount;
    }
    return 0;
});

function gotoPage(increment: number) {
    let pageCount = Math.ceil(totalCount.value / settings.itemsPerPage);
    page.value += increment;
    page.value = Math.max(page.value, 0);
    page.value = Math.min(page.value, pageCount);
    loadCurrentTab();
}

const range = computed(() => {
    let min = page.value * settings.itemsPerPage + 1;
    let max = (page.value + 1) * settings.itemsPerPage;
    min = Math.min(min, totalCount.value);
    max = Math.min(max, totalCount.value);
    return `${min} - ${max}`;
});

watch(tab, (newTab, oldTab) => {
    loadCurrentTab();
    page.value = 0;
});

let albums = ref<BaseItemDto[]>([]);
let artists = ref<BaseItemDto[]>([]);
let isLoading = ref(false);

function loadCurrentTab() {
    isLoading.value = true;
    switch (tab.value) {
        case "albums": {
            cache.fetchAlbums(id.value, page.value)
                .then((res) => {
                    res.forEach(Object.freeze);
                    albums.value = res;
                })
                .catch()
                .finally(() => {
                    isLoading.value = false;
                });
            break;
        }
        case "artists": {
            cache.fetchArtists(id.value, page.value)
                .then((res) => {
                    Object.freeze(res);
                    artists.value = res;
                })
                .catch()
                .finally(() => {
                    isLoading.value = false;
                });
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
            Items {{ range }} / {{ totalCount }}
            <button @click="gotoPage(-1)">back</button>
            <button @click="gotoPage(1)">next</button>
        </div>
        <div v-if="isLoading">
            <loading-spinner />
        </div>
        <div v-show="!isLoading">
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
