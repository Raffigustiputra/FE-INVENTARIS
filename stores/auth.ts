import { defineStore } from "pinia";
// Tambahkan import useCookie dari Nuxt
import { useCookie } from "#app";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    isAuth: false,
    input: {
      username: "",
      password: "",
    },
    token: null as string | null,
    username: null as string | null,
    role: null as string | null,
    name: null as string | null,
    usid: null as string | null,
    loginTime: 0 as number,
  }),

  getters: {
    getToken: (state) => state.token,
    getRole: (state) => state.role,
    getName: (state) => state.name,
    getUsid: (state) => state.usid,
    getUsername: (state) => state.username,
    isAuthenticated: (state) => !!state.token,
  },

  actions: {
    setAuthData(data: any) {
      this.token = data.token;
      this.role = data.role;
      this.name = data.name;
      this.usid = data.usid;
      this.username = data.username;
      this.isAuth = true;

    getters: {
        getToken: (state) => state.token,
        getRole: (state) => state.role,
        getName: (state) => state.name,
        getUsid: (state) => state.usid,
        getUsername: (state) => state.username,
        isAuthenticated: (state) => !!state.token,
    },

    actions: {
        setAuthData(data: any) {
            this.token = data.token;
            this.role = data.role;
            this.name = data.name;
            this.usid = data.usid;
            this.username = data.username;
            this.isAuth = true;
            
            if (process.client) {
                localStorage.setItem('auth-token', data.token);
                localStorage.setItem('auth-usid', data.usid);
                localStorage.setItem('auth-isAuth', 'true');
            }
        },

        if (token) {
          this.token = token;
          this.role = role;
          this.name = name;
          this.usid = usid;
          this.username = username;
          this.isAuth = isAuth === "true";
          this.loginTime = loginTime ? parseInt(loginTime) : 0;
        }
      }
    },
});
