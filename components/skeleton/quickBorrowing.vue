<template>
  <div class="flex flex-col mx-4 gap-4 animate-pulse">
    <!-- Item Type Label Skeleton -->
    <div>
      <div class="h-4 bg-gray-300 rounded w-20 mb-3"></div>

      <!-- Borrowable Item Skeleton -->
      <div class="mb-3">
        <div class="border-2 border-gray-200 rounded-lg px-4 py-3">
          <div class="flex items-center gap-3">
            <div class="flex items-center relative">
              <div class="w-5 h-5 bg-gray-300 rounded-full"></div>
            </div>
            <div class="h-4 bg-gray-300 rounded w-32"></div>
          </div>
        </div>
      </div>

      <!-- Consumable Item Skeleton -->
      <div class="mb-4">
        <div class="border-2 border-gray-200 rounded-lg px-4 py-3">
          <div class="flex items-center gap-3">
            <div class="flex items-center relative">
              <div class="w-5 h-5 bg-gray-300 rounded-full"></div>
            </div>
            <div class="h-4 bg-gray-300 rounded w-36"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Borrower Type Label Skeleton -->
    <div>
      <div class="h-4 bg-gray-300 rounded w-28 mb-3"></div>

      <!-- Student Option Skeleton -->
      <div class="mb-3">
        <div class="border-2 border-gray-200 rounded-lg px-4 py-3">
          <div class="flex items-center gap-3">
            <div class="flex items-center relative">
              <div class="w-5 h-5 bg-gray-300 rounded-full"></div>
            </div>
            <div class="h-4 bg-gray-300 rounded w-16"></div>
          </div>
        </div>
      </div>

      <!-- Teacher Option Skeleton -->
      <div class="mb-6">
        <div class="border-2 border-gray-200 rounded-lg px-4 py-3">
          <div class="flex items-center gap-3">
            <div class="flex items-center relative">
              <div class="w-5 h-5 bg-gray-300 rounded-full"></div>
            </div>
            <div class="h-4 bg-gray-300 rounded w-16"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Button Skeleton -->
    <div class="w-full py-2 bg-gray-300 rounded-md"></div>
  </div>
</template>

<script setup>
// No props needed for this skeleton
</script>

<style scoped>
.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: .5;
  }
}
</style>