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

let library = ref<BaseItemDto>({ });

function fetchLibrary() {
    library.value = { };
    cache.fetchItem(id.value).then((item) => {
        library.value = item;
    });
}

const title = computed(() =>
    library.value.Name ?? "Loading...");

const totalCount = computed(() => {
    switch (tab.value) {
        case "albums":
            return cache.albumCounts[id.value] ?? 0;
        case "artists":
            return cache.artistCounts[id.value] ?? 0;
    }
    return 0;
});

function gotoPage(increment: number) {
    let pageCount = Math.ceil(totalCount.value / settings.itemsPerPage);
    page.value += increment;
    page.value = Math.max(page.value, 0);
    // pageCount - 1 because page index is zero-based
    page.value = Math.min(page.value, pageCount - 1);
    loadCurrentTab();
}

const range = computed(() => {
    let min = page.value * settings.itemsPerPage + 1;
    let max = (page.value + 1) * settings.itemsPerPage;
    min = Math.min(min, totalCount.value);
    max = Math.min(max, totalCount.value);
    return `${min} - ${max}`;
});

watch(id, (newId, oldId) => {
    page.value = 0;
    fetchLibrary();
    loadCurrentTab();
    //tab.value = "albums";
});

watch(tab, (newTab, oldTab) => {
    page.value = 0;
    fetchLibrary();
    loadCurrentTab();
});

let albums = ref<BaseItemDto[]>([]);
let artists = ref<BaseItemDto[]>([]);
let isLoading = ref(false);

function loadCurrentTab() {
    albums.value = [];
    artists.value = [];
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

fetchLibrary();
loadCurrentTab();

function playSong(song: BaseItemDto) {
    store.currentPlaylist.push(song);
    store.playSong(song);
}

function add(song: BaseItemDto) {
    store.currentPlaylist.push(song);
}

function remove(song: BaseItemDto) {
    const index = store.currentPlaylist.indexOf(song);
    if (index > -1) {
        store.removeFromPlaylist(index);
    }
}
</script>

<template>
    <div class="library">
        <h1>{{ title }}</h1>
        <div class="tabs">
            <router-link :to="`/library/${id}/albums`">
                <strong>Albums</strong>
            </router-link>
            <router-link :to="`/library/${id}/artists`">
                <strong>Artists</strong>
            </router-link>
        </div>
        <div class="page-navigation">
            <span class="range">{{ range }}</span>
            <span class="total-count"> / {{ totalCount }}</span>
            <button class="icon-button" @click="gotoPage(-1)">
                <bootstrap-icon icon="arrow-left" />
            </button>
            <button class="icon-button" @click="gotoPage(1)">
                <bootstrap-icon icon="arrow-right" />
            </button>
        </div>
        <div v-if="isLoading">
            <loading-spinner />
        </div>
        <div class="library-frame" v-show="!isLoading">
            <div class="albums" v-show="tab == 'albums'">
                <!-- TODO: replace this with a vertical list -->
                <album-list :albums="albums" />
            </div>
            <div class="artists" v-show="tab == 'artists'">
                <div class="artist-list">
                    <artist-card
                        v-for="(artist, i) in artists"
                        :key="i"
                        :item="artist"
                    />
                </div>
            </div>
            <div class="songs" v-show="tab == 'songs'">
                <!--song-item
                    v-for="(song, i) in songs"
                    :song="song"
                    :index="i + 1"
                    should-show-album
                    @play="playSong(song)"
                    @remove="remove(song)"
                    @add="add(song)"
                /-->
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

.tabs {
    display: flex;
    flex-direction: row;
    column-gap: 16px;
    row-gap: 16px;
    flex-wrap: wrap;
}

.library-frame {
    display: flex;
    flex-direction: row;
    column-gap: 16px;
    row-gap: 16px;
    flex-wrap: wrap;
}

.artist-list {
    display: flex;
    flex-direction: row;
    column-gap: 16px;
    row-gap: 16px;
    flex-wrap: wrap;
}

.page-navigation {
    vertical-align: middle;
}

.page-navigation .icon-button {
    margin: 8px;
    font-size: 1em;
}

.page-navigation .icon-button svg {
    stroke-width: 8px;
}

.page-navigation .range {
    font-weight: 600;
}

.page-navigation .total-count {
    color: var(--fg2);
}
</style>
