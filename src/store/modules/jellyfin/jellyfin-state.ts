import { AxiosInstance } from "axios";
import Client from "../../../jellyfin/client";
import {
    Configuration,
    ItemsApi,
    LibraryApi,
    SessionApi,
    UserApi,
    UserLibraryApi,
    UserViewsApi,
} from "@jellyfin/client-axios";


export default interface JellyfinState {
    protocol: string;
    address: string;
    port: number;
    username: string;
    password: string;
    accessToken: string;
    userId: string;
    configuration: Configuration;
    axios?: AxiosInstance;
    libraryApi?: LibraryApi;
    userApi?: UserApi;
    userViewsApi?: UserViewsApi;
    sessionApi?: SessionApi;
    userLibraryApi?: UserLibraryApi;
    itemsApi?: ItemsApi;
};
