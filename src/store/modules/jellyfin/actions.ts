import { defineActions } from "direct-vuex";
import { ActionContext } from "vuex";
import { RootState } from "@/store/types";
import { moduleActionContext } from "@/store";
import JellyfinState from "./jellyfin-state";
import jellyfin from ".";

export default defineActions({
    login(context: ActionContext<JellyfinState, RootState>) {
        const { state } = getContext(context);
        const client = state.client;
        console.log("Logging on with the credentials");
        console.log({
            username: state.username,
            password: state.password
        })

        client?.login(
            state.username,
            state.password
        ).then((data) => {
            console.log("Logged in!");
            console.log(data);
            window.localStorage.setItem(
                "credentials",
                JSON.stringify(client.credentials)
            );
        }).catch((err) => {
            console.log("Could not log in");
            console.log(err.toString());
        });
    },
    tryAuthenticate(context: ActionContext<JellyfinState, RootState>) {
        const { state } = getContext(context);
        const client = state.client;
    }
});

const getContext = (context: ActionContext<JellyfinState, RootState>) =>
    moduleActionContext(context, jellyfin);
