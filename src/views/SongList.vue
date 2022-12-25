<script setup lang="ts">
import { computed, defineProps, ref, Ref } from "vue";
import store from "../store";
import { useRoute } from "vue-router";
import { BaseItemDto } from "@jellyfin/client-axios";
import SongItem from "../components/SongItem.vue";
import LoadingSpinner from "../components/LoadingSpinner.vue";

const props = defineProps({
    baseUrl: String
});

const route = useRoute();
const id = computed(() => route.params["id"] as string);
const name = computed(() => {
    let item = store.state.items[id.value];
    if (item) {
        return item.Name ?? "Loading";
    }
    return "Loading";
});
const artists = computed(() => {
    let item = store.state.items[id.value];
    if (item) {
        return item.AlbumArtists;
    }
    return [];
});
const imageUrl = computed(() => {
    return store.state.jellyfin.configuration.basePath + "/Items/" + id.value +
           "/Images/Primary?width=192";
});

const item: Ref<BaseItemDto> = ref({});
const songs: Ref<BaseItemDto[]> = ref([]);
const isLoading = ref(true);

//const playlist = computed(() => store.state.currentPlaylist);
const playlist = computed({
    get: (): BaseItemDto[] => store.state.currentPlaylist,
    set: (value: BaseItemDto[]) => store.commit.setCurrentPlaylist(value)
});

function fetchCurrentItemList() {
    store.state.jellyfin.userLibraryApi?.getItem({
        userId: store.state.jellyfin.userId,
        itemId: id.value,
    }).then((res) => {
        item.value = res.data;
        store.commit.setItem({ id: id.value, item: res.data });
    });
}

function fetchItems() {
    isLoading.value = true;
    store.state.jellyfin.itemsApi?.getItemsByUserId({
        userId: store.state.jellyfin.userId,
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
                        store.commit.setItem({ id: item.Id, item: item });
                    }
                });
                songs.value = res.data.Items;
            }
            console.log(res.data);
        }
    });
}

function playSong(song: BaseItemDto) {
    store.commit.setCurrentPlaylist(songs.value);
    store.dispatch.playSong(song);
}

function add(song: BaseItemDto) {
    store.commit.addToPlaylist(song);
}

function remove(song: BaseItemDto) {
    const index = store.state.currentPlaylist.indexOf(song);
    if (index > -1) {
        store.commit.removeFromPlaylist(index);
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
                <div class="subdetails">
                    <router-link
                        v-for="(artist, i) in artists"
                        :key="i"
                        :to="'/library/' + artist.Id + '?type=artist'"
                    >
                        <span v-if="i > 0">, </span>{{ artist.Name }}
                    </router-link>
                    <span class="other" v-if="item.ProductionYear">
                        &middot; {{ item.ProductionYear }}
                    </span>
                    <span
                        class="other"
                        v-if="item.Genres && item.Genres.length > 0"
                    >
                        &middot; {{ item.Genres.join(", ") }}
                    </span>
                    <span
                        class="other"
                        v-if="item.Tags && item.Tags.length > 0"
                    >
                        &middot; {{ item.Tags.join(", ") }}
                    </span>
                </div>
                <div class="subdetails">
                    <span class="other">
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
                :index="i"
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
    display: flex;
    flex-direction: column;
    align-content: flex-end;
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
</style>
