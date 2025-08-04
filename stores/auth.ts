import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        isAuth: false,

        input: {
            username: '',
            password: '',
        },

        token: null,
        role: null,
        name: null,
        usid: null,
    }),

    getters: {
        key: (state) => state.token,
        role: (state) => state.role,
        name: (state) => state.name,
        usid: (state) => state.usid,
    },
});
