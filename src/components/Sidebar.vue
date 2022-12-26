<script setup lang="ts">
import { computed, ref } from "vue";
import { RouterLink } from "vue-router";
import store from "../store";
import router from "../router";

const libraries = computed(() => store.state.libraries);
const isOpen = ref(false);
</script>

<template>
    <aside :class="{ sidebar: true, open: isOpen }">
        <button @click="isOpen = !isOpen">
            <span class="icon">
                <bootstrap-icon icon="list" />
            </span>
            <span class="text">Menu</span>
        </button>
        <router-link to="/home">
            <button>
                <span class="icon">
                    <bootstrap-icon icon="house-fill" />
                </span>
                <span class="text">Home</span>
            </button>
        </router-link>
        <router-link to="/nowplaying">
            <button>
                <span class="icon">
                    <bootstrap-icon icon="headphones" />
                </span>
                <span class="text">Now Playing</span>
            </button>
        </router-link>
        <h1 v-if="isOpen">Libraries</h1>
        <div v-if="isOpen">
            <router-link
                v-for="library in libraries"
                :to="'/library/' + library.Id"
            >
                <button>
                    <span class="icon">
                        <bootstrap-icon icon="collection-play-fill" />
                    </span>
                    <span class="text">{{ library.Name }}</span>
                </button>
            </router-link>
        </div>
    </aside>
</template>

<style>
aside.sidebar {
    flex-basis: 8px;
    flex-grow: 0;
    flex-shrink: 0;
    background-color: var(--bg-dark);
}

aside.sidebar.open {
    flex-basis: 256px;
}

aside.sidebar .text {
    display: none;
    vertical-align: middle;
}

aside.sidebar.open .text {
    margin-left: 24px;
    display: inline;
}

aside.sidebar a:hover {
    text-decoration: none;
}

aside.sidebar button {
    display: block;
    max-height: 48px;
    width: 100%;
    text-align: left;
    border: unset;
    font-weight: 500;
    padding: 12px 24px;
    border-radius: 0;
    box-shadow: none;
    margin: 0;
}

aside.sidebar button:hover {
    background-color: var(--bg1);
    border: unset;
}

aside.sidebar button .icon {
    display: inline-block;
    vertical-align: middle;
}

aside.sidebar button .icon > svg {
    display: inline-block;
    vertical-align: middle;
}

aside.sidebar .router-link-active button {
    background-color: var(--bg0);
}

aside.sidebar h1 {
    font-size: 14px;
    text-transform: uppercase;
    padding: 8px;
    padding-left: 16px;
}
</style>
