<script setup lang="ts">
</script>

<template>
    <div class="loading-spinner">
        <div class="spinner-1"></div>
        <div class="spinner-2"></div>
        <div class="spinner-3"></div>
    </div>
</template>

<style>
.loading-spinner {
    display: flex;
    justify-content: center;
    margin: auto;
    width: 64px;
    padding: 32px;
}

.loading-spinner > div {
    background-color: var(--fg0);
    width: 12px;
    height: 32px;
    margin: 4px;
    animation: loading-spinner 1s infinite;
}

.loading-spinner > .spinner-2 {
    animation-delay: 250ms;
}

.loading-spinner > .spinner-3 {
    animation-delay: 500ms;
}

@keyframes loading-spinner {
    0% {
        transform: scaleY(1.5);
    }
    50%, 100% {
        transform: scaleY(1.0);
    }
}
</style>
