import { ref } from "vue";
import { defineStore } from "pinia";

export const useSettingsStore = defineStore("settings", () => {
    async function loadSettings() {

    }

    const itemsPerPage = ref(50);

    return {
        itemsPerPage,
    }
});
