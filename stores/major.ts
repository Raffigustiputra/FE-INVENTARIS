import { defineStore } from "pinia";

export const useMajorStore = defineStore("major", {
    state: () => ({
        input : {
            name : '',
            icon : '',
            color : ''
        },

        dataMajor : []
    }),
});