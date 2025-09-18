import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  css: ["~/assets/css/main.css"],

  app: {
    baseURL: '/inventory-ui/',
    head: {
      link: [
        {
          rel: 'icon',
          type: 'image/png',
          href: '/inventory-ui/images/WV APP - Circle.png',
        }
      ]
    }
  },

  // devServer: {
  //   host: "15.15.12.19",
  //   port: 5173, // bisa diganti
  // },

  vite: {
    plugins: [tailwindcss()],
  },

  ssr: false,

  runtimeConfig: {
    public: {
      authUrl:
        process.env.NUXT_PUBLIC_AUTH_URL || "http://45.64.100.26:2233/inventory-api/public/api",
        storageUrl: process.env.NUXT_PUBLIC_STORAGE_URL || "http://45.64.100.26:2233/inventory-api/public/storage",
    },
  },

  nitro: {
    preset: 'static'
  },

  modules: ["@pinia/nuxt", "pinia-plugin-persistedstate/nuxt"],

  plugins: [
    { src: "~/plugins/vue3-apexcharts.js", mode: "client" }, // Ensure this is added
  ],

  imports: {
    dirs: ["./stores"],
  },
});
