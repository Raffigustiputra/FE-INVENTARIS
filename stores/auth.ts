import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    isAuth: false,
    isInitialized: false,
    input: {
      username: "",
      password: "",
    },
    userInfo : [],
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
      return Date.now() < state.expiresAt;
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
      this.isInitialized = true;

      if (process.client) {
        localStorage.setItem("auth_token", this.token || "");
        localStorage.setItem("token_expires", this.expiresAt?.toString() || "");
        localStorage.setItem("user_data", JSON.stringify({
          role: this.role,
          name: this.name,
          usid: this.usid,
          username: this.username,
          major_id: this.major_id
        }));
      }
    },

    async initializeAuth() {
      if (this.isInitialized) return;

      this.loadFromStorage();

      if (this.token) {
        if (this.expiresAt && Date.now() >= this.expiresAt) {
          this.logout();
          return;
        }

        const isValid = await this.validateTokenAndFetchUser();
        if (!isValid) {
          this.logout();
        }
      }

      this.isInitialized = true;
    },

    async getUser() {
      if (!this.token) return null;
      
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
          this.name = response.data.name;
          this.username = response.data.username;
          this.role = response.data.role;
          this.major_id = response.data.major_id;
          this.isAuth = true;

          // Save to localStorage
          if (process.client) {
            localStorage.setItem("user_data", JSON.stringify({
              role: this.role,
              name: this.name,
              usid: this.usid,
              username: this.username,
              major_id: this.major_id
            }));
          }

          // Return user data instead of navigating
          return response.data;
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
        return null;
      }
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
          this.isAuth = true;

          // Update localStorage
          if (process.client) {
            localStorage.setItem("user_data", JSON.stringify({
              role: this.role,
              name: this.name,
              usid: this.usid,
              username: this.username,
              major_id: this.major_id
            }));
          }

          return true;
        }
      } catch (error) {
        console.error("Token validation failed:", error);

        if ((error as any)?.statusCode === 401 || (error as any)?.status === 401) {
          this.logout();
          return false;
        }

        console.warn("Network error during token validation, keeping current session");
        return this.isAuth;
      }

      return false;
    },

    loadFromStorage() {
      if (!process.client) return;

      const token = localStorage.getItem("auth_token");
      const expiresAt = localStorage.getItem("token_expires");
      const userData = localStorage.getItem("user_data");

      if (token && expiresAt) {
        const expiryTime = parseInt(expiresAt);
        
        if (Date.now() < expiryTime) {
          this.token = token;
          this.expiresAt = expiryTime;

          if (userData) {
            try {
              const parsedData = JSON.parse(userData);
              this.role = parsedData.role;
              this.name = parsedData.name;
              this.usid = parsedData.usid;
              this.username = parsedData.username;
              this.major_id = parsedData.major_id;
              this.isAuth = true;
            } catch (e) {
              console.error("Failed to parse user data:", e);
            }
          }
        } else {
          this.clearStorage();
        }
      }
    },

    clearStorage() {
      if (!process.client) return;
      
      localStorage.removeItem("auth_token");
      localStorage.removeItem("token_expires");
      localStorage.removeItem("user_data");
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
      this.isInitialized = true;

      this.clearStorage();
    },
  },

  persist: true,
});