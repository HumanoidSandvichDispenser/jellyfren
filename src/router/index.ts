import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import { useJellyfinStore } from "@/store/jellyfin";
import Login from "../views/Login.vue";
import Home from "../views/Home.vue";
import Library from "../views/LibraryNew.vue";
import SongList from "../views/SongList.vue";
import NowPlaying from "../views/NowPlaying.vue";

const routes: RouteRecordRaw[] = [
    {
        path: "/home",
        name: "Home",
        component: Home
    },
    {
        path: "/login",
        name: "Login",
        component: Login
    },
    {
        path: "/library/:id/:tab?",
        name: "Library",
        component: Library
    },
    {
        path: "/list/:id",
        name: "List",
        component: SongList
    },
    {
        path: "/nowplaying",
        name: "Now Playing",
        component: NowPlaying
    },
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
});

router.beforeEach((to) => {
    const jellyfin = useJellyfinStore();

    // force to login page if we're not logged in
    if (!jellyfin.configuration.apiKey && to.path != "/login") {
        if (!jellyfin.isInitializing) {
            return "/login";
        }
    }

    // default to albums if no library tab is specified
    if (to.path.startsWith("/library")) {
        if (!to.params["tab"]) {
            to.params["tab"] = "albums";
        }
    }
});

export default router;
