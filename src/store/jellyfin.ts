import { ref } from "vue";
import { defineStore } from "pinia";
import axios, { AxiosInstance } from "axios";
import {
    AudioApi,
    Configuration,
    ItemsApi,
    LibraryApi,
    SessionApi,
    UserApi,
    UserLibraryApi,
    UserViewsApi,
} from "@jellyfin/client-axios";
import { useRootStore } from "./root";
import JellyfinState from "./modules/jellyfin/jellyfin-state";

export const useJellyfinStore = defineStore("jellyfin", {
    state: (): JellyfinState => ({
        protocol: "https",
        address: "",
        port: 443,
        username: "",
        password: "",
        accessToken: "",
        userId: "",
        configuration: new Configuration(),
    }),

    getters: {
        serverURL(): string {
            const url = new URL(this.protocol + "://" + this.address);
            url.port = this.port.toString();
            return url.toString().replace(/\/+$/, "");
        },

        token(): string {
            return [
                `MediaBrowser Client="jellyfren"`,
                `Device="jellyfren"`,
                `DeviceId="jellyfren"`,
                `Version="0.0.0"`,
                `Token="${this.accessToken}`
            ].join(", ");
        },
    },

    actions: {
        async init(): Promise<void> {
            const data = window.localStorage.getItem("jellyfin/configuration");

            if (data == null) {
                console.log("This is the first time logging in.");
                return rej("First time login.");
            }

            const configuration = JSON.parse(data);
            this.configuration = configuration;
            this.accessToken = configuration.apiKey;

            await this.fetchUserId();
            console.log("Found user id");
            console.log(this.userId);
        },

        async ensureInit() {
            if (this.configuration.apiKey == undefined) {
                await this.init();
            }
        },

        async authenticate(
            protocol: string,
            address: string,
            port: number,
            username: string,
            password: string
        ) {
            let ax = axios.create({
                headers: {
                    Authorization: this.token,
                },
            });

            console.log("Connecting to " + this.serverURL);

            const userApi = new UserApi(undefined, this.serverURL, ax);

            const res = (await userApi.authenticateUserByName({
                authenticateUserByName: {
                    Username: username,
                    Pw: password
                }
            })).data;

            if (res.AccessToken && res.User?.Id) {
                this.accessToken = res.AccessToken;
                this.userId = res.User.Id;
                this.configuration = new Configuration({
                    basePath: this.serverURL,
                    apiKey: this.token,
                    username: this.userId,
                });

                this.protocol = protocol;
                this.address = address;
                this.port = port;
                this.username = username;

                // save authentication configuration
                window.localStorage.setItem(
                    "jellyfin/configuration",
                    JSON.stringify(this.configuration)
                );
            }
        },

        async setConfiguration(config: Configuration) {
            this.configuration = config;
            if (config.username) {
                this.userId = config.username;
            }
            const url = config.basePath;
            const token = config.apiKey;
            const ax = axios.create({
                headers: {
                    Authorization: token,
                    ["X-Emby-Authorization"]: token
                }
            });
            this.libraryApi = new LibraryApi(config, url, ax);
            this.userApi = new UserApi(config, url, ax);
            this.userViewsApi = new UserViewsApi(config, url, ax);
            this.sessionApi = new SessionApi(config, url, ax);
            this.userLibraryApi = new UserLibraryApi(config, url, ax);
            this.itemsApi = new ItemsApi(config, url, ax);
            this.audioApi = new AudioApi(config, url, ax);
        },

        async deauthenticate() {
            this.accessToken = "";
            this.configuration = new Configuration({ });
            window.localStorage.removeItem("jellyfin/configuration");
            return this.sessionApi?.reportSessionEnded();
        },

        async fetchUserId() {
            let res = await this.userApi?.getCurrentUser();
            if (res && res.data.Id && res.data.Name) {
                this.userId = res.data.Id;
                this.username = res.data.Name;
            }
        },

        async fetchLibraries() {
            const root = useRootStore();
            let result = await this.userViewsApi?.getUserViews({
                userId: this.userId,
            });

            let items = result?.data.Items;
            let libraryItems = items?.filter(item => item.CollectionType == "music");

            if (!libraryItems) {
                return;
            }

            libraryItems.forEach((item) => {
                if (item.Id) {
                    // TODO: assign item id in root store
                    root.setItem(item.Id, item);
                }
            })
        },
    }
});
