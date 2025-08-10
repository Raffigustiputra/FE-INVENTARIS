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

      if (process.client) {
        // Simpan ke cookies
        useCookie("auth-token").value = data.token;
        useCookie("auth-usid").value = data.usid;
        useCookie("auth-role").value = data.role;
        useCookie("auth-name").value = data.name;
        useCookie("auth-username").value = data.username;
        useCookie("auth-isAuth").value = "true";
        useCookie("auth-login-time").value = Date.now().toString();

        // Optional: tetap simpan ke localStorage jika ingin fallback
        localStorage.setItem("auth-token", data.token);
        localStorage.setItem("auth-usid", data.usid);
        localStorage.setItem("auth-role", data.role);
        localStorage.setItem("auth-name", data.name);
        localStorage.setItem("auth-username", data.username);
        localStorage.setItem("auth-isAuth", "true");
        localStorage.setItem("auth-login-time", Date.now().toString());
      }
    },

    loadFromStorage() {
      if (process.client) {
        // Ambil dari cookies, fallback ke null jika undefined
        const token = useCookie("auth-token").value ?? null;
        const role = useCookie("auth-role").value ?? null;
        const name = useCookie("auth-name").value ?? null;
        const usid = useCookie("auth-usid").value ?? null;
        const username = useCookie("auth-username").value ?? null;
        const isAuth = useCookie("auth-isAuth").value ?? null;
        const loginTime = useCookie("auth-login-time").value ?? null;

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

    logout() {
      this.token = null;
      this.role = null;
      this.name = null;
      this.usid = null;
      this.username = null;
      this.isAuth = false;
      this.input.username = "";
      this.input.password = "";
      this.loginTime = 0;

      if (process.client) {
        // Hapus dari cookies
        useCookie("auth-token").value = null;
        useCookie("auth-role").value = null;
        useCookie("auth-name").value = null;
        useCookie("auth-usid").value = null;
        useCookie("auth-username").value = null;
        useCookie("auth-isAuth").value = null;
        useCookie("auth-login-time").value = null;

        // Optional: hapus dari localStorage juga
        localStorage.removeItem("auth-token");
        localStorage.removeItem("auth-role");
        localStorage.removeItem("auth-name");
        localStorage.removeItem("auth-usid");
        localStorage.removeItem("auth-username");
        localStorage.removeItem("auth-isAuth");
        localStorage.removeItem("auth-login-time");
      }
    },
  },
});
