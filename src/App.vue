<script setup lang="ts">
import Sidebar from "./components/Sidebar.vue";
import Navigation from "./components/Navigation.vue";
import AudioController from "./components/AudioController.vue";
</script>

<template>
    <div class="content">
        <sidebar />
        <main>
            <navigation />
            <!--router-view v-slot="{ Component, route }">
                <Transition name="fade">
                    <component :is="Component" :key="route.path" />
                </Transition>
            </router-view-->
            <router-view />
        </main>
    </div>
    <div class="footer">
        <audio-controller />
    </div>
</template>

<style>
:root {
    --bg-dark: #0d1117;
    --bg0: #161b22;
    --bg-nav: #161b22aa;
    --bg1: #21262d;
    --bg2: #2b323b;
    --fg0: #ecf2f8;
    --fg1: #c6cdd5;
    --fg2: #89929b;
    --red: #fa7970;
    --orange: #faa356;
    --yellow: #ffdc8f;
    --green: #7ce38b;
    --blue: #77bdfb;
    --magenta: #cea5fb;
    --accent: var(--magenta);
    --progress-bg: var(--bg2);
    --jellyfin-gradient: linear-gradient(35deg, var(--blue), var(--magenta));
}

body,
#app {
    overflow: hidden;
    background-color: var(--bg0);
    color: var(--fg0);
}

#app {
    display: flex;
    flex-direction: column;
    height: 100%;
}

.content {
    overflow: hidden;
    display: flex;
    flex-grow: 1;
}

#app > .footer {
    flex-grow: 0;
    width: 100%;
    box-shadow: 0px -1px 4px var(--bg-dark);
    z-index: 1;
}

.content > main {
    flex: 1;
    width: 100%;
    overflow-y: auto;
}

.v-enter-active,
.v-leave-active {
    transition: opacity 0.5s ease;
}
.v-enter-from,
.v-leave-to {
    opacity: 0;
}
body {
    height: 100vh;
    overflow: hidden;
    margin: 0;
    min-height: 100vh;
    font-family: Arial, sans-serif;
}

h1 {
    font-size: 48px;
    margin: 0;
    padding: 16px 0;
    text-align: left;
}

h1.center {
    text-align: center;
}

h2 {
    font-weight: 500;
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
    border-color: var(--accent);
}

button.accent {
    background-color: var(--accent);
    color: var(--bg0);
}

button.accent:hover {
    background-color: var(--bg0);
    color: var(--fg0);
}

button.icon-button {
    background: none;
    box-shadow: none;
    font-size: 1.5em;
    padding: 0;
    outline: none;
    border: none;
}

button.icon-button:hover {
    background: none;
    color: var(--accent);
}

a,
a:visited {
    color: var(--fg0);
    text-decoration: none;
}

a:hover,
a:visited:hover {
    color: var(--accent);
    text-decoration: underline;
}

a.router-link-active {
    color: var(--accent);
}

th {
    padding: 8px;
    text-align: left;
    text-transform: uppercase;
    font-size: 12px;
}

::-webkit-scrollbar {
    width: 12px;
}

::-webkit-scrollbar-track {
    background: var(--bg-dark);
}

::-webkit-scrollbar-thumb {
    background: var(--bg2);
}

::-webkit-scrollbar-thumb:hover {
    background: var(--accent);
}
</style>
