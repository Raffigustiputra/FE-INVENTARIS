<template>
  <div
    class="w-[243] h-[36px] p-2 border-2 border-[#E0E0E0] rounded-md flex items-center gap-2"
  >
    <IconsSearchIcon class="w-6 h-6 text-gray-500" />
    <input type="text" :placeholder="text" class="outline-none w-full" />
  </div>
</template>
<script setup>
import { IconsSearchIcon } from "#components";

const props = defineProps({
  text: {
    type: String,
    default: "Search Inventory...",
    required: true,
  },
});
</script>
