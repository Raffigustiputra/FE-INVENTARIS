import { defineStore } from "pinia";

export const useStudentStore = defineStore("students", {
    state: () => ({
        input : {
            id : '',
            name : '',
            nis : '',
            rayon : '',
            major_id : '',
        }, filter : {
            search : ''
        },
        students: [],
    }),
});