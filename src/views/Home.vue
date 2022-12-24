<script setup lang="ts">
import { computed, ref, Ref } from "vue";
import store from "@/store";
import LibraryItem from "../components/LibraryItem.vue";
import { BaseItemDto, BaseItemDtoQueryResult } from "@jellyfin/client-axios";
import router from "@/router";
import LoadingSpinner from "../components/LoadingSpinner.vue";

//let libraries: BaseItemDto[] = [];
//let libraries: Ref<BaseItemDto[]> = ref([]);
let isLoading = ref(true);
const libraries = computed(() => store.state.libraries);
const username = computed(() => store.state.jellyfin.username);

function onLibraryItemClicked(library: BaseItemDto) {
    if (!library.Id) {
        return;
    }

    console.log("Loading library " + library.Id);
    router.push("/library/" + library.Id);
}

function logout() {
    // `finally` so it runs whether or not we are authenticated
    store.dispatch.jellyfin.deauthenticate(undefined).then(() => {

    }).catch(() => {

    }).finally(() => {
        router.replace("/login");
    });
}

store.dispatch.jellyfin.fetchLibraries(undefined).then(() => {
    isLoading.value = false;
});

</script>

<template>
    <div class="home">
        <h1>Home</h1>
        <h2>Libraries</h2>
        <div class="libraries">
            <library-item
                v-for="(library, i) in libraries"
                :name="library.Name ?? ''"
                :key="i"
                @click="onLibraryItemClicked(library)"
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
