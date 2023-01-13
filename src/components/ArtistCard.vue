<script setup lang="ts">
import { computed, defineProps, PropType } from "vue";
import { RouterLink } from "vue-router";
import { useJellyfinStore } from "@/store/jellyfin";
import { BaseItemDto } from "@jellyfin/client-axios";
import Card from "./Card.vue";

const jellyfin = useJellyfinStore();

const props = defineProps({
    item: {
        type: Object as PropType<BaseItemDto>,
        required: true
    },
});

const name = computed(() => props.item.Name ?? "");

const url = computed(() => {
    const id = props.item.Id;
    if (id) {
        return "/library/" + id;
    }
    return "/";
});

const imageUrl = computed(() => {
    const id = props.item.Id;
    const baseUrl = jellyfin.configuration.basePath;
    return `${baseUrl}/Items/${id}/Images/Primary?fillWidth=128`;
});
</script>

<template>
    <card
        :primary-text="name"
        :primary-url="url"
        :image-url="imageUrl"
        image-fallback-url="https://cdn.7tv.app/emote/62967d6a0d36ad890711ca5a/4x.webp"
    />
</template>

<style>
</style>
