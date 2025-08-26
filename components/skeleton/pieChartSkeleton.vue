<template>
  <div class="border-gray-200 rounded-lg p-6 w-full animate-pulse">
    <div class="h-6 bg-gray-300 rounded w-1/2 mx-auto mb-6"></div>
    
    <div class="flex flex-col items-center space-y-6">
      <div class="w-36 h-36 bg-gray-300 rounded-full"></div>

      <div class="w-full space-y-4">
        <div v-for="i in 5" :key="i" class="flex items-center justify-center space-x-2 ">
          <div class="h-3 w-3 bg-gray-300 rounded-full"></div>
          <div class="h-4 bg-gray-300 rounded w-3/4"></div>
        </div>
      </div>
    </div>
  </div>
</template>