import { defineGetters } from "direct-vuex";
import JellyfinState from "./jellyfin-state";
import jellyfin from ".";
import { moduleGetterContext } from "@/store";

const getters = defineGetters<JellyfinState>()({
    serverURL(...args): string {
        const { state } = getContext(args);
        const url = new URL(state.protocol + "://" + state.address);
        url.port = state.port.toString();
        return url.toString().replace(/\/+$/, "");
    },
    token(...args): string {
        const { state } = getContext(args);
        return [
            `MediaBrowser Client="jellyfren"`,
            `Device="jellyfren"`,
            `DeviceId="jellyfren"`,
            `Version="0.0.0"`,
            `Token="${state.accessToken}`
        ].join(", ");
    },
});

export default getters;

const getContext = (args: [any, any, any, any]) =>
    moduleGetterContext(args, jellyfin);
