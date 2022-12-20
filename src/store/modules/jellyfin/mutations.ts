import JellyfinState from "./jellyfin-state";
import Client from "@/jellyfin/client";
import Credentials from "@/jellyfin/credentials";

const mutations = {
    initClient(state: JellyfinState) {
        const credentialsStr = window.localStorage.getItem("credentials");
        const credentials = JSON.parse(credentialsStr ?? "{}") as Credentials;
        console.log(credentials.user);
        state.client = new Client(
            state.protocol,
            state.address,
            state.port,
            credentials.accessToken,
            credentials.user
        );
        state.protocol = credentials.protocol ?? "";
        state.address = credentials.address ?? "";
        state.port = credentials.port ?? 8096;
        state.username = credentials.username ?? "";
        console.log(credentials);
    },
    setProtocol(state: JellyfinState, protocol: string) {
        state.protocol = protocol;
    },
    setAddress(state: JellyfinState, address: string) {
        state.address = address;
    },
    setPort(state: JellyfinState, port: number) {
        state.port = port;
    },
    setUsername(state: JellyfinState, username: string) {
        state.username = username;
        console.log(state.username);
    },
    setPassword(state: JellyfinState, password: string) {
        state.password = password;
    },
};

export default mutations;
