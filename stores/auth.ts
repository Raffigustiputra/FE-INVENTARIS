import { defineStore } from "pinia";
import { useCookie } from "#app";

// Hapus variable logoutTimer karena tidak digunakan lagi
// let logoutTimer: any = null;

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
      // Pengecekan langsung: jika token ada dan belum expired
      if (!state.token || !state.expiresAt) return false;
      
      // Jika sudah expired, logout otomatis
      if (Date.now() >= state.expiresAt) {
        // Panggil logout secara langsung
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

      console.log(data);

      if (process.client) {
        // Simpan data ke localStorage
        localStorage.setItem("auth-expiresAt", this.expiresAt ? this.expiresAt.toString() : "");
        localStorage.setItem("auth-token", data.token);
        localStorage.setItem("auth-role", data.role || "");
        localStorage.setItem("auth-name", data.name || "");
        localStorage.setItem("auth-usid", data.usid || "");
        localStorage.setItem("auth-username", data.username || "");
        localStorage.setItem("auth-isAuth", "true");

        if (data.major_id && typeof data.major_id === "object") {
          localStorage.setItem("auth-major", JSON.stringify(data.major_id));
        } else {
          localStorage.setItem("auth-major", data.major_id || "");
        }

        // Simpan data ke cookies (jika diperlukan)
        const tokenCookie = useCookie("auth-token", { maxAge: 30 });
        tokenCookie.value = data.token;
        
        const roleCookie = useCookie("auth-role", { maxAge: 30 });
        roleCookie.value = data.role;
        
        const nameCookie = useCookie("auth-name", { maxAge: 30 });
        nameCookie.value = data.name;
        
        const usidCookie = useCookie("auth-usid", { maxAge: 30 });
        usidCookie.value = data.usid;
        
        const usernameCookie = useCookie("auth-username", { maxAge: 30 });
        usernameCookie.value = data.username;
        
        const majorCookie = useCookie("auth-major", { maxAge: 30 });
        majorCookie.value = typeof data.major_id === "object" 
          ? JSON.stringify(data.major_id) 
          : data.major_id || "";
          
        const isAuthCookie = useCookie("auth-isAuth", { maxAge: 30 });
        isAuthCookie.value = "true";  
      }

      // Hapus pemanggilan startTokenTimer() karena tidak digunakan lagi
      // this.startTokenTimer();
    },

    async validateTokenAndFetchUser() {
      // Cek expired terlebih dahulu
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

        console.log(url)
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
        
        // Check if it's a 401 error
        if ((error as any)?.response?.status === 401 || (error as any)?.statusCode === 401) {
          this.logout();
          return false;
        }
        
        // For other errors, still consider token valid but log the error
        console.warn("Network error during token validation, keeping current session");
        return true;
      }
      
      return false;
    },

    loadFromStorage() {
      if (process.client) {
        // Ambil data dari localStorage
        const token = localStorage.getItem("auth-token");
        const role = localStorage.getItem("auth-role");
        const name = localStorage.getItem("auth-name");
        const usid = localStorage.getItem("auth-usid");
        const username = localStorage.getItem("auth-username");
        const majorStr = localStorage.getItem("auth-major");
        const isAuth = localStorage.getItem("auth-isAuth");
        const expiresAtStr = localStorage.getItem("auth-expiresAt");

        // Cek expired
        if (expiresAtStr) {
          const expiresAt = parseInt(expiresAtStr);
          if (Date.now() >= expiresAt) {
            this.logout(); // otomatis logout kalau udah expired
            return;
          }
          this.expiresAt = expiresAt;
        }

        // Parse major object if it exists
        let major = null;
        if (majorStr) {
          try {
            major = JSON.parse(majorStr);
          } catch (e) {
            major = majorStr;
          }
        }

        if (token) {
          this.token = token;
          this.role = role;
          this.name = name;
          this.usid = usid;
          this.username = username;
          this.major_id = major;
          this.isAuth = true;
          
          // Hapus pemanggilan startTokenTimer()
          // this.startTokenTimer();
        }
      }
    },

    logout() {
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

      // Hapus timer logic karena tidak digunakan lagi
      // if (logoutTimer) {
      //   clearTimeout(logoutTimer);
      //   logoutTimer = null;
      // }

      if (process.client) {
        // Hapus data dari localStorage
        const keys = [
          "auth-token", "auth-role", "auth-name", "auth-usid", 
          "auth-username", "auth-major", "auth-isAuth", "auth-expiresAt"
        ];
        keys.forEach((k) => localStorage.removeItem(k));

        // Hapus cookies
        const cookies = [
          "auth-token", "auth-role", "auth-name", "auth-usid",
          "auth-username", "auth-major", "auth-isAuth"
        ];
        
        cookies.forEach(name => {
          const cookie = useCookie(name);
          cookie.value = null;
        });
      }
    },

    // Hapus method startTokenTimer() karena tidak digunakan lagi
    // startTokenTimer() { ... }
  },

  persist: true,
});