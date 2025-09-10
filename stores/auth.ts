import { defineStore } from "pinia";

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
    major_id: null as any | null,
    expiresAt: null as number | null,
  }),

  getters: {
    getToken: (state) => state.token,
    getRole: (state) => state.role,
    getName: (state) => state.name,
    getUsid: (state) => state.usid,
    getUsername: (state) => state.username,
    getMajor: (state) => state.major_id,
    isAuthenticated: (state) => {
      if (!state.token || !state.expiresAt) return false;

      if (Date.now() >= state.expiresAt) {
        const authStore = useAuthStore();
        authStore.logout();
        return false;
      }

      return true;
    },
  },

  actions: {
    setAuthData(data: any) {
      this.token = data.token;
      this.role = data.role;
      this.name = data.name;
      this.usid = data.usid;
      this.username = data.username;
      this.major_id = data.major_id;
      this.expiresAt = data.expires_at || null;
      this.isAuth = true;

      localStorage.setItem("auth_token", this.token || "");
      localStorage.setItem("token_expires", this.expiresAt?.toString() || "");
    },

    async validateTokenAndFetchUser() {
      if (this.expiresAt && Date.now() >= this.expiresAt) {
        this.logout();
        return false;
      }

      if (!this.token) {
        this.logout();
        return false;
      } 

      try {
        const config = useRuntimeConfig();
        const url = config.public.authUrl;

        const response = await $fetch(`${url}/user`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.token}`,
          },
        }) as any;

        if (response.status === 200) {
          this.name = response.data.name || this.name;
          this.username = response.data.username || this.username;
          this.role = response.data.role || this.role;
          this.major_id = response.data.major_id || this.major_id;

          return true;
        }
      } catch (error) {
        console.error("Token validation failed:", error);

        if ((error as any)?.response?.status === 401 || (error as any)?.statusCode === 401) {
          this.logout();
          return false;
        }

        console.warn("Network error during token validation, keeping current session");
        return true;
      }

      return false;
    },

    loadFromStorage() {
      if (process.client) {
        const token = localStorage.getItem("auth_token");

        if (token) {
          this.token = token;
          this.isAuth = true;
        }
      }
    },

    async logout() {
      this.token = null;
      this.role = null;
      this.name = null;
      this.usid = null;
      this.username = null;
      this.major_id = null;
      this.isAuth = false;
      this.expiresAt = null;
      this.input.username = "";
      this.input.password = "";

      localStorage.removeItem("auth_token");
      localStorage.removeItem("token_expires");
    },
  },

  persist: true,
});