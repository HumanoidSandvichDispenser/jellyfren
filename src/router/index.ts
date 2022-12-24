import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import Dashboard from "../views/Dashboard.vue";
import Login from "../views/Login.vue";
import Home from "../views/Home.vue";
import Library from "../views/Library.vue";
import SongList from "../views/SongList.vue";
import NowPlaying from "../views/NowPlaying.vue";

const routes: RouteRecordRaw[] = [
    {
        path: "/home",
        name: "Home",
        component: Home
    },
    {
        path: "/dashboard",
        name: "Dashboard",
        component: Dashboard
    },
    {
        path: "/login",
        name: "Login",
        component: Login
    },
    {
        path: "/library/:id",
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

export default createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
});