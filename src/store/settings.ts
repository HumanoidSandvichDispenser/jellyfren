import { reactive, ref } from "vue";
import { defineStore } from "pinia";
import { Store } from "tauri-plugin-store-api";
import Preferences from "@/preferences";
import Colorscheme from "@/colorscheme";

export const useSettingsStore = defineStore("settings", () => {
    const tauriStore = new Store("settings.json");

    async function loadSettings() {
        let settings = tauriStore.get("settings");
    }

    const preferences = reactive<Preferences>({
        itemsPerPage: 50,
    });

    const colorscheme = reactive<Colorscheme>({
        ["--bg-dark"]: "#0d1117",
        ["--bg0"]: "#161b22",
        ["--bg-nav"]: "#161b22aa",
        ["--bg1"]: "#21262d",
        ["--bg2"]: "#2b323b",
        ["--fg0"]: "#ecf2f8",
        ["--fg1"]: "#c6cdd5",
        ["--fg2"]: "#89929b",
        ["--red"]: "#fa7970",
        ["--orange"]: "#faa356",
        ["--yellow"]: "#ffdc8f",
        ["--green"]: "#7ce38b",
        ["--blue"]: "#77bdfb",
        ["--magenta"]: "#cea5fb",
        ["--accent"]: "var(--magenta)",
    });

    function setColor(key: string, color: string) {
        if (key in colorscheme) {
            colorscheme[key] = color;
        }
        document.documentElement.style.setProperty(key, color);
        //document.getRootNode().style.setPr
    }

    // deprecated
    const itemsPerPage = ref(50);

    return {
        preferences,
        itemsPerPage,
        colorscheme,
    }
});
