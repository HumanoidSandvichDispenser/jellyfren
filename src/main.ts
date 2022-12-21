import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import store from "./store";
import router from "./router";

store.dispatch.jellyfin.ensureInit();

createApp(App)
    .use(store.original)
    .use(router)
    .mount("#app");
