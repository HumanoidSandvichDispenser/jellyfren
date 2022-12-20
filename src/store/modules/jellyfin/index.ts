import { defineModule } from "direct-vuex";
import JellyfinState from "./jellyfin-state";
import mutations from "./mutations";
import actions from "./actions";

const jellyfin = defineModule({
    state: (): JellyfinState => {
        return {
            client: undefined,
            protocol: "https",
            address: "",
            port: 443,
            username: "",
            password: ""
        }
    },
    mutations,
    actions
});

export default jellyfin;
