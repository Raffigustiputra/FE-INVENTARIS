import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        isAuth: false,

        input: {
            username: '',
            password: '',
        },

        token: null,
        username: null,
        role: null,
        name: null,
        usid: null,
    }),

    getters: {  
        getToken: (state) => state.token,
        getRole: (state) => state.role,
        getName: (state) => state.name,
        getUsid: (state) => state.usid,
    },

    persist: true,
});
