import { defineActions, ModuleOptions } from "direct-vuex";
import { ActionContext } from "vuex";
import { RootState } from "@/store/types";
import store, { moduleActionContext } from "@/store";
import JellyfinState from "./jellyfin-state";
import jellyfin from ".";
import axios from "axios";
import { UserApi } from "@jellyfin/client-axios";
import { Configuration } from "@jellyfin/client-axios";

export default defineActions({
    async fetchUserId(context) {
        const { state, commit } = getContext(context);
        let res = await state.userApi?.getCurrentUser();
        if (res&& res.data.Id && res.data.Name) {
            commit.setUserId(res.data.Id);
            commit.setUsername(res.data.Name);
        }
    },
    async fetchLibraries(context) {
        const { state, rootCommit } = getContext(context);
        let result = await state.userViewsApi?.getUserViews({
            userId: state.userId,
        });

        let items = result?.data.Items;
        let libraryItems = items?.filter(item => item.CollectionType == "music");

        if (!libraryItems) {
            return;
        }

        libraryItems.forEach(item => {
            const id = item.Id;
            if (id) {
                rootCommit.setItem({ id, item });
            }
        });

        rootCommit.setLibraries(libraryItems);
    },
    async ensureInit(context): Promise<void> {
        const { state, dispatch } = getContext(context);
        if (state.configuration.apiKey == undefined) {
            console.log("Jellyfin client is not initialized. Initializing NOW!");
            await dispatch.init();
        }
    },
    async init(context): Promise<void> {
        const { state, commit, dispatch } = getContext(context);
        return new Promise<void>((res, rej) => {
            const data = window.localStorage.getItem("jellyfin/configuration");

            if (data == null) {
                console.log("This is the first time logging in.");
                return rej("First time login.");
            }

            const configuration = JSON.parse(data);
            commit.setAccessToken(configuration.apiKey);

            commit.setConfiguration(configuration);
            dispatch.fetchUserId().then(() => {
                console.log("Found user id");
                console.log(state.userId);
                res();
            }).catch((err) => {
                console.log("Auth token may have expired.");
                rej(err);
            });
        });
    },
    async authenticate(
        context,
        payload: {
            protocol: string;
            address: string;
            port: number;
            username: string;
            password: string;
        }
    ) {
        const { state, getters, commit } = getContext(context);

        commit.setInfo(payload);

        let ax = axios.create({
            headers: {
                Authorization: getters.token
            }
        });

        console.log("Connecting to " + getters.serverURL);

        const userApi = new UserApi(undefined, getters.serverURL, ax);

        const res = (await userApi.authenticateUserByName({
            authenticateUserByName: {
                Username: state.username,
                Pw: state.password
            }
        })).data;

        if (res.AccessToken && res.User && res.User.Id) {
            commit.setAccessToken(res.AccessToken);
            commit.setUserId(res.User.Id);
            commit.setConfiguration(new Configuration({
                basePath: getters.serverURL,
                apiKey: getters.token,
                username: state.userId,
            }));

            // save userdata
            window.localStorage.setItem(
                "jellyfin/configuration",
                JSON.stringify(state.configuration)
            );
        }
    },
    async deauthenticate(context) {
        const { state, getters, commit } = getContext(context);
        commit.setAccessToken("");
        commit.setConfiguration(new Configuration({ }));
        window.localStorage.removeItem("jellyfin/configuration");
        return state.sessionApi?.reportSessionEnded();
    }
});

const getContext = (context: ActionContext<JellyfinState, RootState>) =>
    moduleActionContext(context, jellyfin);
