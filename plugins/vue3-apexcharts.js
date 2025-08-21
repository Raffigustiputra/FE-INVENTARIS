   // ~/plugins/vue3-apexcharts.js
   import VueApexCharts from 'vue3-apexcharts';

   export default defineNuxtPlugin((nuxtApp) => {
     nuxtApp.vueApp.use(VueApexCharts);
     nuxtApp.vueApp.component('apexchart', VueApexCharts);
   });
   