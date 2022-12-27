import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
//import store from "./store";
import router from "./router";
import BootstrapIcon from "@dvuckovic/vue3-bootstrap-icons";
import { createPinia } from "pinia";

const pinia = createPinia();

createApp(App)
    .use(router)
    .use(BootstrapIcon)
    .use(pinia)
    .mount("#app");
