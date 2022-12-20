import Client from "../../../jellyfin/client";

export default interface JellyfinState {
    client?: Client,
    protocol: string,
    address: string,
    port: number,
    username: string,
    password: string
};
