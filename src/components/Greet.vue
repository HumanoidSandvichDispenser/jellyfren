<script setup lang="ts">
import { ref, computed } from "vue";
import { invoke } from "@tauri-apps/api/tauri";

const greetMsg = ref("");
const name = ref(0);

const secondParagraph = computed(() => `The textbox is titled ${name.value}`);

async function greet() {
    // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
   greetMsg.value = await invoke("greet", { name: name.value });
}
</script>

<template>
    <div class="card">
        <input v-model="name" placeholder="Enter a name..." />
        <button type="button" @click="greet()">Greet</button>
    </div>
    <p>{{ greetMsg }}</p>
    <p>Second paragraph text: {{ secondParagraph }}</p>
</template>
