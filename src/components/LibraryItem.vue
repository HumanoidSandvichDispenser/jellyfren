<script setup lang="ts">
import { defineProps } from "vue";

const props = defineProps({
    name: String,
    image: String,
});
</script>

<template>
    <button class="library-item">
        <h3>{{ name }}</h3>
    </button>
</template>

<style>
.library-item {
    height: 128px;
    width: 256px;
    margin: 8px;
}

.library-item h3 {
    display: block;
    margin: 0;
    padding: 8px;
    text-align: center;
}
</style>
