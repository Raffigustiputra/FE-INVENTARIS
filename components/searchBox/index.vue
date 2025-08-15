<template>
  <div
    class="w-64 h-9 p-2 border-2 border-[#E0E0E0] rounded-md flex items-center gap-2"
  >
    <IconsSearchIcon class="w-6 h-6 text-gray-500" />
    <input
    :v-model="props.value"
    type="text" :placeholder="text" class="outline-none w-full" />
  </div>
</template>
<script setup>
import { IconsSearchIcon } from "#components";

const props = defineProps({
  text: {
    type: String,
    default: "Search Inventory...",
    required: true,
  }, value : {
    type: String,
    required: true
  }
});
</script>
