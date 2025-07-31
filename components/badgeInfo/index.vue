<template>
  <span :class="badgeClasses">
    {{ text }}
  </span>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  type: {
    type: String,
    required: true,
    validator: (value) => ['good', 'bad', 'warning', 'info', 'default'].includes(value),
  },
  text: {
    type: String,
    required: true,
  },
});

const badgeClasses = computed(() => {
  const baseClasses = 'inline-flex items-center px-3 py-1 rounded-md text-xs font-medium';
  
  switch (props.type) {
    case 'good':
      return `${baseClasses} bg-green-600 text-green-100`;
    case 'bad':
      return `${baseClasses} bg-red-600 text-red-100`;
    case 'warning':
      return `${baseClasses} bg-yellow-600 text-yellow-100`;
    case 'info':
      return `${baseClasses} bg-blue-600 text-blue-100`;
    case 'default':
    default:
      return `${baseClasses} bg-gray-600 text-gray-100`;
  }
});
</script>