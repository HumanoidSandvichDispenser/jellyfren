import { ref } from "vue";
import { defineStore } from "pinia";
import axios, { AxiosInstance } from "axios";
import {
    ArtistsApi,
    AudioApi,
    Configuration,
    ItemFields,
    ItemsApi,
    LibraryApi,
    SessionApi,
    SortOrder,
    UniversalAudioApi,
    UserApi,
    UserLibraryApi,
    UserViewsApi,
} from "@jellyfin/client-axios";
import { Store } from "tauri-plugin-store-api";
import { useStore } from ".";
import JellyfinState from "./jellyfin-state";

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
        isInitializing: false,
        tauriStore: new Store(".auth.dat"),
    }),

    getters: {
        serverURL(): string {
            const url = new URL(this.protocol + "://" + this.address);
            url.port = this.port.toString();
            return url.toString().replace(/\/+$/, "");
        },

        token(): string {
            return [
                "MediaBrowser Client=\"jellyfren\"",
                "Device=\"jellyfren\"",
                "DeviceId=\"jellyfren\"",
                "Version=\"0.0.0\"",
                `Token="${this.accessToken}"`
            ].join(", ");
        },
    },

    actions: {
        async init(): Promise<void> {
            const res = await this.tauriStore.get("configuration");

            if (!res) {
                console.log("This is the first time logging in.");
                return Promise.reject("First time login.");
            }

            const configuration = res as Configuration;

            if (typeof(configuration.apiKey) != "string") {
                return Promise.reject("Invalid auth configuration");
            }

            this.setConfiguration(configuration);
            this.accessToken = configuration.apiKey;

            await this.fetchUserId();
            await this.fetchAll();
            console.log("Found user id");
            console.log(this.userId);
        },

        async ensureInit() {
            if (!this.isInitializing || !this.configuration.apiKey) {
                this.isInitializing = true;
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
            this.protocol = protocol;
            this.address = address;
            this.port = port;
            this.username = username;

            const ax = axios.create({
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

                await this.setConfiguration(new Configuration({
                    basePath: this.serverURL,
                    apiKey: this.token,
                    username: this.userId,
                }));

                // save authentication configuration
                this.tauriStore.set(
                    "configuration",
                    this.configuration
                );
            }

            console.log("Logged in");
            console.log(res);
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
            this.universalAudioApi = new UniversalAudioApi(config, url, ax);
            this.artistsApi = new ArtistsApi(config, url, ax);
        },

        async deauthenticate() {
            this.accessToken = "";
            this.setConfiguration(new Configuration({ }));
            await this.tauriStore.delete("configuration");
            return this.sessionApi?.reportSessionEnded();
        },

        async fetchUserId() {
            const res = await this.userApi?.getCurrentUser();
            if (res && res.data.Id && res.data.Name) {
                this.userId = res.data.Id;
                this.username = res.data.Name;
            }
        },

        async fetchAll() {
            await this.fetchLibraries();
            await this.fetchPlaylists();
        },

        async fetchLibraries() {
            const store = useStore();
            const result = await this.userViewsApi?.getUserViews({
                userId: this.userId,
            });

            const items = result?.data.Items;
            const libraryItems = items?.filter(item => item.CollectionType == "music");

            if (!libraryItems) {
                return;
            }

            libraryItems.forEach((item) => {
                if (item.Id) {
                    // TODO: assign item id in root store
                    store.setItem(item.Id, item);
                }
            });

            store.libraries = libraryItems;
        },

        async fetchPlaylists() {
            const store = useStore();

            const res = await this.itemsApi?.getItems({
                userId: this.userId,
                includeItemTypes: ["Playlist"],
                recursive: true,
                fields: [ItemFields.SortName],
                sortBy: ["SortName"],
            });

            if (res?.data.Items) {
                store.playlists = res.data.Items;
            }
        },
    }
});
