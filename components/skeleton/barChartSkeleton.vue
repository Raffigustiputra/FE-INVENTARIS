<template>
  <div class="rounded-lg py-6 px-20 w-full animate-pulse">
    <div class="flex justify-between items-center mb-6">
      <div class="h-6 bg-gray-300 rounded w-1/4"></div>
      <div class="h-8 bg-gray-300 rounded w-1/5"></div>
    </div>

    <div class="flex items-end justify-between h-[32rem] space-x-10">
      <div class="w-full bg-gray-300 rounded-t-md" style="height: 90%;"></div>
      <div class="w-full bg-gray-300 rounded-t-md" style="height: 90%;"></div>
      <div class="w-full bg-gray-300 rounded-t-md" style="height: 45%;"></div>
      <div class="w-full bg-gray-300 rounded-t-md" style="height: 70%;"></div>
      <div class="w-full bg-gray-300 rounded-t-md" style="height: 30%;"></div>
      <div class="w-full bg-gray-300 rounded-t-md" style="height: 65%;"></div>
      <div class="w-full bg-gray-300 rounded-t-md" style="height: 55%;"></div>
      <div class="w-full bg-gray-300 rounded-t-md" style="height: 95%;"></div>
    </div>

    <div class="flex justify-between mt-2 space-x-10">
       <div v-for="i in 8" :key="i" class="w-full h-4 bg-gray-300 rounded"></div>
    </div>
  </div>
</template>