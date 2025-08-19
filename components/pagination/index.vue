<template>
  <div class="flex items-center gap-1">
    <button
      @click="$emit('prev')"
      :disabled="currentPage === 1"
      class="w-8 h-8 text-2xl flex items-center justify-center rounded text-gray-500 disabled:opacity-40 hover:bg-gray-200 transition"
      :class="currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'"
    >
      ‹
    </button>
    <template v-for="page in paginationItems" :key="page">
      <button
        v-if="page !== '...'"
        @click="$emit('change', page)"
        :class="[
          'w-8 h-8 flex items-center cursor-pointer justify-center rounded transition',
          currentPage === page
            ? 'bg-blue-600 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
        ]"
      >
        {{ page }}
      </button>
      <span v-else class="px-2 text-gray-500">...</span>
    </template>
    <button
      @click="$emit('next')"
      :disabled="currentPage === lastPage"
      class="w-8 h-8 text-2xl flex items-center justify-center rounded text-gray-500 disabled:opacity-40 hover:bg-gray-200 transition"
      :class="currentPage === lastPage ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'"
    >
      ›
    </button>
  </div>
</template>

<script setup>
defineProps({
  currentPage: Number,
  lastPage: Number,
  paginationItems: Array,
});
defineEmits(['prev', 'next', 'change']);
</script>