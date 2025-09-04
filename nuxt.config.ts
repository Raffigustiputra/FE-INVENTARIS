   import tailwindcss from "@tailwindcss/vite";

   export default defineNuxtConfig({
     compatibilityDate: "2025-07-15",
     devtools: { enabled: true },
     css: [
       '~/assets/css/main.css', 
     ],

     vite: {
       plugins: [
         tailwindcss(),
       ],
     },

     ssr: false,

     runtimeConfig: {
       public: {
         authUrl: process.env.NUXT_AUTH_URL,
         storageUrl: process.env.NUXT_STORAGE_URL,
       }
     },

     modules: [
       '@pinia/nuxt', 
       'pinia-plugin-persistedstate/nuxt',
     ],
     
     // Add the plugin for vue3-apexcharts
     plugins: [
       { src: '~/plugins/vue3-apexcharts.js', mode: 'client' } // Ensure this is added
     ],

     imports: {
       dirs: ['./stores']
     }
   });
   