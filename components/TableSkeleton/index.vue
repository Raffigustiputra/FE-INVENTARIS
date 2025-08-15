<template>
  <div class="bg-white rounded-lg overflow-hidden">
    <!-- Header -->
    <div class="bg-[#F7F8F9] px-3 py-3 border-b border-gray-200">
      <div class="flex gap-2 justify-around items-center w-full flex-1">
        <div 
          v-for="n in columns" 
          :key="n"
          class="h-5 w-40 bg-gray-300 rounded animate-pulse"
        />
      </div>
    </div>
    
    <!-- Rows -->
    <div class="">
      <div 
        v-for="row in rows" 
        :key="row"
        class="px-3 py-5 flex gap-2 justify-around items-center w-full border-b border-gray-200"
      >
        <div 
          v-for="col in columns" 
          :key="col"
          class="h-5 w-40 bg-gray-200 rounded animate-pulse"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  rows: {
    type: Number,
    default: 4
  },
  columns: {
    type: Number,
    default: 5
  }
})
</script>