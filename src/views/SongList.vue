<script setup lang="ts">
import { computed, ref, Ref } from "vue";
import store from "../store";
import { useRoute } from "vue-router";
import { BaseItemDto } from "@jellyfin/client-axios";
import SongItem from "../components/SongItem.vue";
import LoadingSpinner from "../components/LoadingSpinner.vue";

const route = useRoute();
const id = computed(() => route.params["id"] as string);
const name = computed(() => {
    let item = store.state.items[id.value];
    if (item) {
        return item.Name ?? "Loading";
    }
    return "Loading";
});

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

fetchCurrentItemList();
fetchItems();
</script>

<template>
    <div class="song-list">
        <div class="songs">
            <h1>{{ name }}</h1>
            <loading-spinner v-if="isLoading" />
            <song-item
                v-for="(song, i) in songs"
                :song="song"
                :index="i"
                @play="playSong(song)"
            />
        </div>
    </div>
</template>
