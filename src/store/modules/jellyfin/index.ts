import { defineModule } from "direct-vuex";
import JellyfinState from "./jellyfin-state";
import mutations from "./mutations";
import actions from "./actions";
import getters from "./getters";
import { Configuration } from "@jellyfin/client-axios";
import { moduleGetterContext } from "@/store";

const jellyfin = defineModule({
    namespaced: true,
    state: (): JellyfinState => {
        return {
            //client: new Client("", "", 443),
            protocol: "https",
            address: "",
            port: 443,
            username: "",
            password: "",
            accessToken: "",
            userId: "",
            configuration: new Configuration(),
        };
    },
    getters,
    mutations,
    actions,
});

export default jellyfin;
