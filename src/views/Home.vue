<script setup lang="ts">
import { computed, ref } from "vue";
import { useStore } from "@/store";
import { useJellyfinStore } from "@/store/jellyfin";
import router from "@/router";
import sizeof from "object-sizeof";

const store = useStore();
const jellyfin = useJellyfinStore();

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

const memory = ref(0);

function recalculate() {
    let size = sizeof(store.items);
    console.log(size);
    memory.value = size;
}

const itemCount = computed(() => Object.keys(store.items).length);
</script>

<template>
    <div class="home">
        <h1>Home</h1>
        <h2>Info</h2>
        <div class="user-info">
            Logged in as {{ username }}
            <button @click="logout">Log out</button>
        </div>
        <div>
            <div>Memory usage: {{ memory }}</div>
            <div>Number of items: {{ itemCount }}</div>
            <button @click="recalculate">Recalculate</button>
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
