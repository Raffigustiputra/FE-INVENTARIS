import { defineStore } from "pinia";

export const useHistory = defineStore("history", {
    state: () => ({
        search: "",
        history: []
    })
});