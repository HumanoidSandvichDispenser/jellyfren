import { reactive, ref } from "vue";
import { defineStore } from "pinia";
import { Store } from "tauri-plugin-store-api";
import Preferences from "@/preferences";

export const useSettingsStore = defineStore("settings", () => {
    const tauriStore = new Store("settings.json");

    async function loadSettings() {
        let settings = tauriStore.get("settings");
    }

    const preferences = reactive<Preferences>({
        itemsPerPage: 50,
    });

    const itemsPerPage = ref(50);

    return {
        itemsPerPage,
    }
});
