<script setup lang="ts">
import { computed, ref, Ref } from "vue";
import store from "@/store";
import LibraryItem from "../components/LibraryItem.vue";
import { BaseItemDto, BaseItemDtoQueryResult } from "@jellyfin/client-axios";
import router from "@/router";

//let libraries: BaseItemDto[] = [];
let libraries: Ref<BaseItemDto[]> = ref([]);
const api = () => store.state.jellyfin;

api().userViewsApi?.getUserViews({
    userId: api().userId,
}).then((result) => {
    let items = result.data.Items;
    items?.filter(item => item.CollectionType == "music").forEach(item => {
        libraries.value.push(item);
        console.log(item);
    });
});

const username = computed(() => api().username);

function onLibraryItemClicked(id: string) {
    console.log("Loading library " + id);
    router.push("/library/" + id);
}

function logout() {
    store.dispatch.jellyfin.deauthenticate().then(() => {
        router.push("/login");
    });
}
</script>

<template>
    <div class="home">
        <h1>Home</h1>
        <h2>Libraries</h2>
        <div class="libraries">
            <library-item
                v-for="(library, i) in libraries"
                :name="library.Name"
                :key="i"
                @click="onLibraryItemClicked(library.Id)"
            />
        </div>
        <h2>Info</h2>
        <div class="user-info">
            Logged in as {{ username }}
            <button @click="logout">Log out</button>
        </div>
    </div>
</template>

<style>
.home {
    padding: 16px;
}

.libraries {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    flex-direction: row;
}
</style>
