<script setup lang="ts">
import { computed, ref, Ref } from "vue";
import store from "@/store";
import LibraryItem from "../components/LibraryItem.vue";
import { BaseItemDto, BaseItemDtoQueryResult } from "@jellyfin/client-axios";
import router from "@/router";

//let libraries: BaseItemDto[] = [];
let libraries: Ref<BaseItemDto[]> = ref([]);
const username = computed(() => store.state.jellyfin.username);

function onLibraryItemClicked(library: BaseItemDto) {
    if (!library.Id) {
        return;
    }

    console.log("Loading library " + library.Id);
    router.push("/library/" + library.Id);
}

function logout() {
    store.dispatch.jellyfin.deauthenticate().then(() => {
        router.push("/login");
    });
}

store.state.jellyfin.userViewsApi?.getUserViews({
    userId: store.state.jellyfin.userId,
}).then((result) => {
    let items = result.data.Items;
    let libraryItems = items?.filter(item => item.CollectionType == "music");

    if (!libraryItems) {
        return;
    }

    libraryItems.forEach(item => {
        const id = item.Id;
        if (id) {
            libraries.value.push(item);
            console.log(item);
            store.commit.setItem({ id, item });
        }
    });

    libraries.value = libraryItems;
    store.commit.setLibraries(libraryItems);
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
