import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import router from "./router";
import BootstrapIcon from "@dvuckovic/vue3-bootstrap-icons";
import { createPinia } from "pinia";
import { useJellyfinStore } from "./store/jellyfin";

const pinia = createPinia();
const app = createApp(App);
app.use(pinia);
const jellyfin = useJellyfinStore();

// try to login first before we continue loading our app
jellyfin.ensureInit()
    .then(() => {

    }).catch(() => {
        console.log("Jellyfin");
        jellyfin.configuration.apiKey = undefined;
        jellyfin.accessToken = "";
    }).finally(() => {
        app.use(router)
            .use(BootstrapIcon)
            .mount("#app");
    });
