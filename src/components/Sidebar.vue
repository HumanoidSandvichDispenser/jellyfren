<script setup lang="ts">
import { computed } from "vue";
import { RouterLink } from "vue-router";
import store from "../store";

const libraries = computed(() => store.state.libraries);
</script>

<template>
    <aside class="sidebar">
        <router-link to="/home">
            <button>Home</button>
        </router-link>
        <router-link to="/nowplaying">
            <button>Now Playing</button>
        </router-link>
        <h1>Libraries</h1>
        <router-link
            v-for="library in libraries"
            :to="'/library/' + library.Id"
        >
            <button>{{ library.Name }}</button>
        </router-link>
    </aside>
</template>

<style>
.content > aside.sidebar {
    flex-basis: 192px;
    flex-grow: 0;
    flex-shrink: 0;
    background-color: var(--bg-dark);
}

.content > aside.sidebar.open {
    flex-basis: 64px;
}

aside.sidebar button {
    display: block;
    width: 100%;
    text-align: left;
    border: unset;
    padding: 16px 32px;
    font-weight: 500;
}

aside.sidebar button:hover {
    border: unset;
}

aside.sidebar button.a {
    display: block;
    width: 100%;
}

aside.sidebar h1 {
    font-size: 14px;
    text-transform: uppercase;
    padding: 8px;
}
</style>
