<script setup lang="ts">
import { computed, defineProps } from "vue";
import { RouterLink } from "vue-router";
import store from "@/store";

const props = defineProps({
    imageId: String,
    albumName: String,
    albumUrl: String,
    artistName: String,
    artistUrl: String,
});

const imageUrl = computed(() => {
    const imageId = props.imageId;
    const baseUrl = store.state.jellyfin.configuration.basePath;
    return `${baseUrl}/Items/${imageId}/Images/Primary?fillWidth=128`;
});
</script>

<template>
    <div class="album card">
        <div class="image">
            <img :src="imageUrl" />
        </div>
        <div class="footer">
            <div class="primary-text">
                <router-link to="/home">
                    {{ albumName }}
                </router-link>
            </div>
            <div class="secondary-text">
                <router-link to="/home">
                    {{ artistName }}
                </router-link>
            </div>
        </div>
    </div>
</template>

<style>
.album.card {
    width: 192px;
    background-color: var(--bg-dark);
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 2px rgba(0, 0, 0, 0.2);
}

.album .image {
    margin-bottom: 0;
}

.album img {
    display: block;
    width: 192px;
    height: 192px;
}

.album .footer {
    padding: 0.5em;
}

.album .footer div {
    display: block;
    width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    padding: 0.25em;
    line-height: 1;
    font-size: 14px;
}

.album .footer .secondary-text a {
    color: var(--fg2);
}

.album .footer .secondary-text a {
    color: var(--fg2);
}
</style>
