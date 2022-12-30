<script setup lang="ts">
import { computed, ref } from "vue";
import { useJellyfinStore } from "@/store/jellyfin";
import router from "../router";

const jellyfin = useJellyfinStore();

const protocol = ref(jellyfin.protocol);
const address = ref(jellyfin.address);
const port = ref(jellyfin.port);
const username = ref(jellyfin.username);
const password = ref("");

function login() {
    console.log("lol");
    jellyfin.authenticate(
        protocol.value,
        address.value,
        port.value,
        username.value,
        password.value
    ).then(() => {
        router.push("/home");
    });
}

const insecure = computed(() => protocol.value != "https");

</script>

<template>
    <div class="login">
        <center>
            <h1>Login to Jellyfin</h1>
        </center>
        <div>
            <input placeholder="Username" v-model="username" />
        </div>
        <div>
            <input placeholder="Password" type="password" v-model="password" />
        </div>
        <div>
            <input
                placeholder="Protocol"
                id="protocol"
                type="url"
                v-model="protocol"
            />
            <input placeholder="Server Address" type="url" v-model="address" />
            <input placeholder="Port" id="port" v-model="port" />
        </div>
        <div>
            <button class="accent" id="login-button" @click="login">
                Log in to {{ protocol }}://{{ address }}:{{ port }}
            </button>
        </div>
        <div v-show="insecure" class="warning">
            <strong>Warning:</strong>
            the server you are connecting to is not protected by HTTPS. Please
            ensure the server <code v-if="address != ''">{{ address }}</code> is
            not public facing and only accessible by your local network.
        </div>
    </div>
</template>

<style>
.login {
    max-width: 768px;
    margin: auto;
}

.login h1 {
    padding: 48px;
}

.login > div {
    display: flex;
}

.login > div > * {
    flex: 1;
    margin: 4px;
}

input#protocol,
input#port {
    flex: 0;
}

input#protocol {
    width: 4em;
}

input#port {
    width: 3em;
}

.login #login-button {
    text-align: center;
    font-weight: 500;
}

.login #login-button > * {
    display: inline;
}

.login .warning {
    display: inline;
}
</style>
