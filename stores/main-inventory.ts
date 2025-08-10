import { defineStore } from "pinia";

export const useMainInventoryStore = defineStore("main-inventory", {
    state: () => ({
        inventory: [],
    }),
});