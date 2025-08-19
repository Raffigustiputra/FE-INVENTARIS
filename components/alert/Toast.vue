<template>
  <div
    v-if="show"
    class="flex items-center w-full max-w-xs p-4 mb-4 text-gray-500 bg-red-100 rounded-lg shadow"
    role="alert"
  >
    <div class="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-red-500 bg-red-200 rounded-lg">
      <!-- Icon tanda silang -->
      <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path
          fill-rule="evenodd"
          d="M4.293 4.293a1 1 0 011.414 0L10 
             8.586l4.293-4.293a1 1 0 011.414 
             1.414L11.414 10l4.293 4.293a1 1 
             0 01-1.414 1.414L10 11.414l-4.293 
             4.293a1 1 0 01-1.414-1.414L8.586 
             10 4.293 5.707a1 1 0 010-1.414z"
          clip-rule="evenodd"
        ></path>
      </svg>
    </div>
    <div class="ms-3 text-sm font-normal">{{ message }}</div>
    <button
      @click="show = false"
      type="button"
      class="ms-auto -mx-1.5 -my-1.5 text-red-400 hover:text-red-900 rounded-lg focus:ring-2 focus:ring-red-300 p-1.5 hover:bg-red-200 inline-flex items-center justify-center h-8 w-8"
    >
      <span class="sr-only">Close</span>
      ✕
    </button>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  message: { type: String, default: '' },
  duration: { type: Number, default: 3000 }
})

const show = ref(true)

onMounted(() => {
  if (props.duration > 0) {
    setTimeout(() => (show.value = false), props.duration)
  }
})
</script>
