<script setup lang="ts">
import { computed, defineProps, PropType } from "vue";
import { RouterLink } from "vue-router";
import { useJellyfinStore } from "@/store/jellyfin";
import { BaseItemDto } from "@jellyfin/client-axios";

const jellyfin = useJellyfinStore();

const props = defineProps({
    primaryText: {
        type: String,
        required: true,
    },
    primaryUrl: {
        type: String,
        required: true,
    },
    secondaryText: String,
    secondaryUrl: String,
    imageUrl: {
        type: String,
        required: true,
    },
    imageFallbackUrl: {
        type: String,
        required: true,
    },
});

function imageFallback($event: Event) {
    if ($event.target instanceof HTMLImageElement) {
        $event.target.src = props.imageFallbackUrl;
    }
}
</script>

<template>
    <div class="album card">
        <div class="image">
            <img :src="imageUrl" @error="imageFallback" />
        </div>
        <div class="footer">
            <div class="primary-text">
                <router-link :to="primaryUrl ?? ''">
                    {{ primaryText }}
                </router-link>
            </div>
            <div class="secondary-text" v-if="secondaryText">
                <router-link
                    :to="secondaryUrl ?? ''"
                >
                    {{ secondaryText }}
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

.album.card img {
    display: block;
    width: 192px;
    height: 192px;
    border-radius: 8px;
}

.album.card img:hover {
    cursor: pointer;
    filter: brightness(50%);
    transition-duration: 200ms;
}

.album .image {
    margin-bottom: 0;
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

.album .footer .secondary-text a:hover {
    color: var(--accent);
}
</style>
