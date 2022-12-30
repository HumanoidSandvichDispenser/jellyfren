<script setup lang="ts">
import { computed, ref, Ref } from "vue";
import LibraryItem from "../components/LibraryItem.vue";
import { BaseItemDto, BaseItemDtoQueryResult } from "@jellyfin/client-axios";
import { useStore } from "@/store";
import { useJellyfinStore } from "@/store/jellyfin";
import router from "@/router";
import LoadingSpinner from "../components/LoadingSpinner.vue";

const store = useStore();
const jellyfin = useJellyfinStore();

const libraries = computed(() => store.libraries);
const username = computed(() => jellyfin.username);

function logout() {
    // `finally` so it runs whether or not we are authenticated
    jellyfin.deauthenticate().then(() => {

    }).catch(() => {

    }).finally(() => {
        router.replace("/login");
    });
}

const isLoading = ref(true);

jellyfin.fetchLibraries().then(() => {
    isLoading.value = false;
    jellyfin.fetchPlaylists();
});

function onLibraryItemClicked(library: BaseItemDto) {
    if (!library.Id) {
        return;
    }

    console.log("Loading library " + library.Id);
    router.push("/library/" + library.Id);
}
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
