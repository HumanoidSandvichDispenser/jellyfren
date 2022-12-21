import axios, { AxiosInstance } from "axios";
import JellyfinState from "./jellyfin-state";
import {
    Configuration,
    ItemsApi,
    LibraryApi,
    SessionApi,
    UserApi,
    UserLibraryApi,
    UserViewsApi,
} from "@jellyfin/client-axios";
import { defineMutations } from "direct-vuex";
import getters from "./getters";

const mutations = defineMutations<JellyfinState>()({
    assign(state, newState: JellyfinState) {
        Object.assign(state, newState);
    },
    setInfo(
        state,
        payload: {
            protocol: string;
            address: string;
            port: number;
            username: string;
            password: string;
        }
    ) {
        console.log("Set info");
        console.log(payload);
        state.protocol = payload.protocol;
        state.address = payload.address;
        state.port = payload.port;
        state.username = payload.username;
        state.password = payload.password;
    },
    setProtocol(state, protocol: string) {
        state.protocol = protocol;
    },
    setAddress(state, address: string) {
        state.address = address;
    },
    setPort(state, port: number) {
        state.port = port;
    },
    setUsername(state, username: string) {
        state.username = username;
    },
    setPassword(state, password: string) {
        state.password = password;
    },
    setUserId(state, userId: string) {
        state.userId = userId;
    },
    setAccessToken(state, accessToken: string) {
        console.log("Access token set.");
        state.accessToken = accessToken;
    },
    setConfiguration(state, config: Configuration) {
        console.log("Login configuration updated.");
        state.configuration = config;
        if (config.username) {
            state.userId = config.username;
        }
        const configuration = state.configuration;
        const url = config.basePath;
        const token = config.apiKey;
        const ax = axios.create({
            headers: {
                Authorization: token,
                ["X-Emby-Authorization"]: token
            }
        });
        state.libraryApi = new LibraryApi(configuration, url, ax);
        state.userApi = new UserApi(configuration, url, ax);
        state.userViewsApi = new UserViewsApi(configuration, url, ax);
        state.sessionApi = new SessionApi(configuration, url, ax);
        state.userLibraryApi = new UserLibraryApi(configuration, url, ax);
        state.itemsApi = new ItemsApi(configuration, url, ax);
    },
    setAxios(state, instance: AxiosInstance) {
        state.axios = instance;
    },
    setHeaders(state, headers: string) {
    }
});

export default mutations;
