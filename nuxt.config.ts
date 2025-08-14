import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  css: [
    '~/assets/css/main.css',
    '@vuepic/vue-datepicker/dist/main.css' // tambahin CSS datepicker biar langsung global
  ],

  vite: {
    plugins: [
      tailwindcss(),
    ],
  },

  build: {
    transpile: ['@vuepic/vue-datepicker'] // WAJIB buat Vue Date Picker
  },

  ssr: false,

  runtimeConfig: {
    public: {
      authUrl: process.env.NUXT_AUTH_URL,
    }
  },

  modules: ['@pinia/nuxt', 'pinia-plugin-persistedstate/nuxt'],
  imports: {
    dirs: ['./stores']
  }
});
