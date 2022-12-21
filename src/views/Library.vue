<script setup lang="ts">
import { useRoute } from "vue-router";
import store from "../store";
import { UserLibraryApiGetRootFolderRequest } from "@jellyfin/client-axios";

const route = useRoute();
const api = () => store.state.jellyfin;

api().itemsApi?.getItemsByUserId({
    userId: api().userId,
    includeItemTypes: ["MusicAlbum"],
    parentId: route.params["id"].toString(),
}).then((res) => {
    console.log(res.data);
})

console.log(route.params["id"]);
</script>

<template>
    <div class="library">
        <h1>Library</h1>
    </div>
</template>
