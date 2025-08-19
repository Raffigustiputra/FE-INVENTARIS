import { defineStore } from "pinia";

export const useLoanStore = defineStore("loan", {
    state: () => ({
        inputBorrowableStudents: {
            name: "",
            class: "",
            item: ""
        },
        loan: []
    })
});