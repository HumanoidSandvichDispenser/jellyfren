import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import store from "./store";
import router from "./router";
import BootstrapIcon from "@dvuckovic/vue3-bootstrap-icons";

store.dispatch.jellyfin.ensureInit();

createApp(App)
    .use(store.original)
    .use(router)
    .use(BootstrapIcon)
    .mount("#app");
