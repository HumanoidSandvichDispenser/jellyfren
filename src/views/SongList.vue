<script setup lang="ts">
import Song from "../song";
import SongItem from "../components/SongItem.vue";
import { computed, ref, Ref } from "vue";
import SongList from "../components/SongList.vue";
import store from "../store";
import { useRoute } from "vue-router";
import { BaseItemDto } from "@jellyfin/client-axios";

const route = useRoute();
const id = computed(() => route.params["id"] as string);
const name = computed(() => {
    let item = store.state.items[id.value];
    if (item) {
        return item.Name ?? "Loading";
    }
    return "Loading";
});

let songs: Ref<BaseItemDto[]> = ref([]);

//const playlist = computed(() => store.state.currentPlaylist);
const playlist = computed({
    get: (): Song[] => store.state.currentPlaylist,
    set: (value: Song[]) => store.commit.setCurrentPlaylist(value)
});

store.state.jellyfin.itemsApi?.getItemsByUserId({
    userId: store.state.jellyfin.userId,
    recursive: true,
    parentId: id.value,
    sortBy: [
        "ParentIndexNumber",
        "IndexNumber",
        "SortName",
    ],
}).then((res) => {
    if (res.data.Items) {
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

function playSong(song: BaseItemDto) {
    store.dispatch.playSong(song);
}
</script>

<template>
    <div class="song-list-details">
        <div class="songs">
            <song-item
                v-for="(song, i) in songs"
                :song="song"
                :index="i"
                @play="playSong(song)"
            />
        </div>
    </div>
</template>
