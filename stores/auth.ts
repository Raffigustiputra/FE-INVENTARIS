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
    major_id: null as any | null, // Changed to any type to support full major object structure
  }),

    getters: {
        getToken: (state) => state.token,
        getRole: (state) => state.role,
        getName: (state) => state.name,
        getUsid: (state) => state.usid,
        getUsername: (state) => state.username,
        getMajor: (state) => state.major_id,
        isAuthenticated: (state) => !!state.token,
    },

    actions: {
        setAuthData(data: any) {
            this.token = data.token;
            this.role = data.role;
            this.name = data.name;
            this.usid = data.usid;
            this.username = data.username;
            this.major_id = data.major_id; // This will now store the full major object
            this.isAuth = true;
            
            if (process.client) {
                localStorage.setItem('auth-token', data.token);
                localStorage.setItem('auth-usid', data.usid);
                localStorage.setItem('auth-isAuth', 'true');
                
                // Store major as JSON if it's an object
                if (data.major_id && typeof data.major_id === 'object') {
                    localStorage.setItem('auth-major', JSON.stringify(data.major_id));
                } else {
                    localStorage.setItem('auth-major', data.major_id || '');
                }
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
        const majorStr = localStorage.getItem('auth-major');
        const isAuth = useCookie("auth-isAuth").value ?? null;
        
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
          this.isAuth = isAuth === "true";
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
            this.input.username = '';
            this.input.password = '';
            
            if (process.client) {
                localStorage.removeItem('auth-token');
                localStorage.removeItem('auth-role');
                localStorage.removeItem('auth-name');
                localStorage.removeItem('auth-usid');
                localStorage.removeItem('auth-username');
                localStorage.removeItem('auth-major_id');
                localStorage.removeItem('auth-isAuth');
                
                // Also clear cookies if they exist
                const tokenCookie = useCookie("auth-token");
                const roleCookie = useCookie("auth-role");
                const nameCookie = useCookie("auth-name");
                const usidCookie = useCookie("auth-usid");
                const usernameCookie = useCookie("auth-username");
                const majorCookie = useCookie("auth-major_id");
                const isAuthCookie = useCookie("auth-isAuth");
                
                if (tokenCookie.value) tokenCookie.value = null;
                if (roleCookie.value) roleCookie.value = null;
                if (nameCookie.value) nameCookie.value = null;
                if (usidCookie.value) usidCookie.value = null;
                if (usernameCookie.value) usernameCookie.value = null;
                if (majorCookie.value) majorCookie.value = null;
                if (isAuthCookie.value) isAuthCookie.value = null;
            }
        }
    },
    persist : true
});