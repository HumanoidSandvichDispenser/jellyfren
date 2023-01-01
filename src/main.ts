import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
//import store from "./store";
import router from "./router";
import BootstrapIcon from "@dvuckovic/vue3-bootstrap-icons";
import { createPinia } from "pinia";
import { useJellyfinStore } from "./store/jellyfin";

const pinia = createPinia();


const app = createApp(App);

app.use(pinia);

// try to login first before we continue loading our app
useJellyfinStore().ensureInit()
    .then(() => {
        app.use(router)
            .use(BootstrapIcon)
            .mount("#app");
    });
 
