<script setup lang="ts">
import store from "./store";
import router from "./router";

store.dispatch.jellyfin.init().then(() => {
    if (router.currentRoute.value.path == "/") {
        router.push("/home");
    }
}).catch(() => {
    router.push("/login");
});
</script>

<template>
    <router-view />
</template>

<style>
:root {
    /*--bg-dark: #0a0b0b;*/
    --bg-dark: #0d1117;
    --bg0: #161b22;
    --bg1: #21262d;
    --bg2: #2b323b;
    --fg0: #ecf2f8;
    --fg1: #c6cdd5;
    --fg2: #89929b;
    --red: #fa7970;
    --orange: #faa356;
    --yellow: #ffdc8f;
    --green: #7ce38b;
    /*--cyan: #a2d2fb;*/
    --blue: #77bdfb;
    --magenta: #cea5fb;
    --jellyfin-gradient: linear-gradient(35deg, var(--blue), var(--magenta));
}

body,
#app {
    background-color: var(--bg0);
    color: var(--fg0);
}

body {
    margin: 0;
    min-height: 100vh;
}

h1 {
    margin: 0;
    padding: 16px;
    text-align: center;
}

input,
button {
    border: 1px solid transparent;
    border-radius: 8px;
    padding: 8px 16px;
    font-size: 1em;
    font-weight: 500;
    font-family: inherit;
    color: var(--fg0);
    background-color: var(--bg-dark);
    box-shadow: 0 2px 2px rgba(0, 0, 0, 0.2);
    transition-duration: 200ms;
}

input:focus {
    border-color: var(--magenta);
}

button.accent {
    background-color: var(--magenta);
    color: var(--bg0);
}

button.accent:hover {
    background-color: var(--bg0);
    color: var(--fg0);
}
</style>
