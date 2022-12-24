<script setup lang="ts">
import { useRoute } from "vue-router";
import router from "../router";

function back() {
    router.back();
}

function forward() {
    router.forward();
}
</script>

<template>
    <nav class="navigation">
        <div class="left">
            <button @click="back">
                &lsaquo;
            </button>
            <button @click="forward">
                &rsaquo;
            </button>
        </div>
        <div class="space"></div>
        <div class="right"></div>
    </nav>
</template>

<style>
.navigation {
    display: flex;
    width: 100%;
    position: sticky;
    top: 0;
    background-color: var(--bg-nav);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    z-index: 2;
}

.navigation > div {
    padding: 8px;
}

.navigation button {
    background-color: unset;
    box-shadow: unset;
    border: unset;
    outline: unset;
    font-size: 24px;
    height: 48px;
    width: 48px;
    padding: 0;
    margin: 0;
}

.navigation button:hover {
    color: var(--accent);
    border: unset;
    outline: unset;
    transition-duration: 200ms;
}

.navigation .left {
    align-self: flex-start;
}

.navigation .space {
    flex: 1;
}

.navigation .right {
    align-self: flex-end;
}
</style>
