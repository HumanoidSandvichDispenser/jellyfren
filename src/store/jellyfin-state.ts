import { AxiosInstance } from "axios";
import {
    ArtistsApi,
    AudioApi,
    Configuration,
    ItemsApi,
    LibraryApi,
    SessionApi,
    UniversalAudioApi,
    UserApi,
    UserLibraryApi,
    UserViewsApi,
} from "@jellyfin/client-axios";
import { Store } from "tauri-plugin-store-api";


export default interface JellyfinState {
    protocol: string;
    address: string;
    port: number;
    username: string;
    password: string;
    accessToken: string;
    userId: string;
    configuration: Configuration;
    tauriStore: Store;
    isInitializing: boolean;
    axios?: AxiosInstance;
    libraryApi?: LibraryApi;
    userApi?: UserApi;
    userViewsApi?: UserViewsApi;
    sessionApi?: SessionApi;
    userLibraryApi?: UserLibraryApi;
    itemsApi?: ItemsApi;
    audioApi?: AudioApi;
    universalAudioApi?: UniversalAudioApi;
    artistsApi?: ArtistsApi;
};;;;;;;;;;;;;;;;;;;;;
