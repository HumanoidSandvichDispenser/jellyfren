<script setup lang="ts">
import { computed, ref } from "vue";
import { useStore } from "vuex";
import store from "../store";
import jellyfin from "../store/modules/jellyfin";
import router from "../router";

const protocol = ref(store.state.jellyfin.protocol);
const address = ref(store.state.jellyfin.address);
const port = ref(store.state.jellyfin.port);
const username = ref(store.state.jellyfin.username);
const password = ref("");

const serverURL = computed(() =>
    `${store.state.jellyfin.protocol}://${store.state.jellyfin.address}`);

const insecure = computed(() => protocol.value != "https");

function login() {
    store.dispatch.jellyfin.authenticate({
        protocol: protocol.value,
        address: address.value,
        port: port.value,
        username: username.value,
        password: password.value
    }).then(() => {
        router.push("/home");
    });
}
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
            ensure this server is accessible through your local network.
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
