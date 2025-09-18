import { defineStore } from "pinia";
import Accounts from "~/components/icons/accounts.vue";

export const useAccountsStore = defineStore("accounts", {
    state: () => ({
        input : {
            id : '',
            name : '',
            username : '',
            role : '',
            password : '',
            major_id : '',
        }, filter : {
            search : ''
        },
        Accounts : [],
        total : 0
    }),
});