import tailwindcss from "@tailwindcss/vite";
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],

  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
  ssr: false,
  runtimeConfig : {
    public : {
      authUrl : process.env.NUXT_AUTH_URL,
    }
  },

  modules: ['@pinia/nuxt'],
  imports: {
    dirs: ['./stores']
  }
});