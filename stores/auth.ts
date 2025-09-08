import { defineStore } from "pinia";
import { useCookie } from "#app"; // Pastikan import ini sesuai dengan framework Anda

let logoutTimer: any = null;

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
    isAuthenticated: (state) => 
      !!state.token && !!state.expiresAt && Date.now() < state.expiresAt,
  },

  actions: {
    setAuthData(data: any) {
      this.token = data.token;
      this.role = data.role;
      this.name = data.name;
      this.usid = data.usid;
      this.username = data.username;
      this.major_id = data.major_id;
      this.isAuth = true;

      // Set expiration time (30 detik untuk testing)
      const expiresIn = 30 * 1000; // 30 detik
      this.expiresAt = Date.now() + expiresIn;

      if (process.client) {
        // Simpan data ke localStorage
        localStorage.setItem("auth-expiresAt", this.expiresAt.toString());
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
        const tokenCookie = useCookie("auth-token", { maxAge: 30 }); // 30 detik
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

    // Mulai timer untuk logout otomatis
    this.startTokenTimer();
  },

  // Do not call store methods during store definition; call loadFromStorage()
  // from components or after creating the store instance.
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
          if (Date.now() > expiresAt) {
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
          console.log(token);
          this.token = token;
          this.role = role;
          this.name = name;
          this.usid = usid;
          this.username = username;
          this.major_id = major;
          this.isAuth = isAuth === "true";
          
          // Mulai timer untuk logout otomatis
          this.startTokenTimer();
          console.log(this.startTokenTimer);
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

      if (logoutTimer) {
        clearTimeout(logoutTimer);
        logoutTimer = null;
      }

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

    startTokenTimer() {
      if (!this.expiresAt) return;

      const timeout = this.expiresAt - Date.now();
      if (timeout > 0) {
        if (logoutTimer) clearTimeout(logoutTimer);

        logoutTimer = setTimeout(() => {
          this.logout();
          if (process.client) {
            window.location.href = "/login"; // redirect
          }
        }, timeout);
      } else {
        this.logout();
        if (process.client) {
          window.location.href = "/login";
        }
      }
    },
  },

  persist: true,
});