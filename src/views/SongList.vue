<script setup lang="ts">
import { computed, defineProps, ref, watch } from "vue";
import { useStore } from "../store";
import { useJellyfinStore } from "../store/jellyfin";
import { useRoute } from "vue-router";
import { BaseItemDto } from "@jellyfin/client-axios";
import SongItem from "../components/SongItem.vue";
import LoadingSpinner from "../components/LoadingSpinner.vue";

const store = useStore();
const jellyfin = useJellyfinStore();

const route = useRoute();
const id = computed(() => route.params["id"] as string);
const name = computed(() => {
    let item = store.items[id.value];
    if (item) {
        return item.Name ?? "Loading";
    }
    return "Loading";
});
const artists = computed(() => {
    let item = store.items[id.value];
    if (item) {
        return item.AlbumArtists;
    }
    return [];
});
const imageUrl = computed(() => {
    return jellyfin.configuration.basePath + "/Items/" + id.value +
           "/Images/Primary?width=192";
});

const item = ref<BaseItemDto>({});
const songs = ref<BaseItemDto[]>([]);
const isLoading = ref(true);

const isPlaylist = computed(() => item.value.Type == "Playlist");

function fetchCurrentItemList() {
    jellyfin.userLibraryApi?.getItem({
        userId: jellyfin.userId,
        itemId: id.value,
    }).then((res) => {
        item.value = res.data;
        store.setItem(id.value, res.data);
    });
}

function fetchItems() {
    isLoading.value = true;
    jellyfin.itemsApi?.getItemsByUserId({
        userId: jellyfin.userId,
        parentId: id.value,
        sortBy: [
            "ParentIndexNumber",
            "IndexNumber",
            "SortName",
        ],
    }).then((res) => {
        if (res.data.Items) {
            isLoading.value = false;
            if (res.data.Items) {
                res.data.Items.forEach(item => {
                    if (item.Id) {
                        store.setItem(item.Id, item);
                    }
                });
                songs.value = res.data.Items;
            }
        }
    });
}

watch(
    id,
    () => {
        fetchCurrentItemList();
        songs.value.length = 0;
        fetchItems();
    }
);

function playSong(song: BaseItemDto) {
    store.currentPlaylist = songs.value;
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

fetchCurrentItemList();
fetchItems();
</script>

<template>
    <div class="song-list">
        <div
            class="list-info"
            :style="{
                '--bg-image': `url(${imageUrl})`
            }"
        >
            <div class="cover">
                <img :src="imageUrl" />
            </div>
            <div class="details">
                <div class="name">
                    {{ name }}
                </div>
                <div class="artist-name">
                    <span v-if="!isPlaylist">
                        <span
                            v-for="(artist, i) in artists"
                            :key="i"
                        >
                            <span v-if="i > 0">, </span>
                            <router-link
                                :to="'/library/' + artist.Id + '?type=artist'"
                            >
                                {{ artist.Name }}
                            </router-link>
                        </span>
                    </span>
                </div>
                <div class="subdetails">
                    <span class="other" v-if="item.ProductionYear">
                        <bootstrap-icon icon="calendar" />
                        {{ item.ProductionYear }}
                    </span>
                    <span
                        class="other"
                        v-if="item.Genres && item.Genres.length > 0"
                    >
                        <bootstrap-icon icon="disc" />
                        {{ item.Genres.join(", ") }}
                    </span>
                    <span
                        class="other"
                        v-if="item.Tags && item.Tags.length > 0"
                    >
                        <bootstrap-icon icon="tag" />
                        {{ item.Tags.join(", ") }}
                    </span>
                    <span class="other" v-if="item.ChildCount">
                        <bootstrap-icon icon="music-note-list" />
                        {{ item.ChildCount }}
                        {{ item.ChildCount > 1 ? "songs" : "song" }}
                    </span>
                </div>
            </div>
        </div>
        <table class="songs">
            <loading-spinner v-if="isLoading" />
            <song-item
                v-for="(song, i) in songs"
                :song="song"
                :index="i + 1"
                :should-show-album="isPlaylist"
                @play="playSong(song)"
                @remove="remove(song)"
                @add="add(song)"
            />
        </table>
    </div>
</template>

<style>
.songs > h1 {
    padding: 16px;
}

.songs {
    border-spacing: 0;
    width: 100%;
}

.list-info {
    position: relative;
    display: flex;
    padding: 16px;
}

.list-info::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0.5;
}

.list-info > * {
    position: relative;
    filter: initial;
}

.list-info .cover img {
    max-width: 192px;
    max-height: 192px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.list-info .details {
    padding-left: 16px;
}

.list-info .details .artist-name {
    font-weight: 700;
    margin-bottom: 8px;
}

.list-info .details .name {
    margin-bottom: 8px;
    font-size: 32px;
    font-weight: 700;
    line-height: 1em;
}

.list-info .details .other {
    color: var(--fg2);
}

.list-info .details .other svg.bi {
    margin-right: 0.25em;
}

.list-info .subdetails {
    display: flex;
    flex-direction: row;
    column-gap: 24px;
}
</style>
