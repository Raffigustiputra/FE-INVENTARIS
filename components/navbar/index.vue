<template>
  <div>
    <div
      class="w-8/10 h-18.5 flex flex-col fixed top-0 right-0 bg-white z-10 border-b border-black/10"
    >
      <div
        class="container mx-auto flex items-center justify-between py-3 px-6"
      >
        <nav class="flex items-center font-semibold text-lg">
        </nav>

        <div class="flex items-center gap-3">
          <div class="text-right">
            <p class="font-medium text-gray-800">Admin</p>
            <p class="text-sm text-gray-600">Manage Your Items</p>
          </div>
          <div
            class="bg-white flex items-center justify-center p-3 rounded-lg shadow"
          >
            <IconsAvatar />
          </div>
        </div>
      </div>

      <div
        v-if="breadcrumbs && breadcrumbs.length > 0"
        class="w-8/10 border-t-2 border-b-2 bg-white fixed top-[73px] right-0 border-gray-100 py-3 px-9"
      >
        <div class="container mx-auto flex items-center gap-5">
          <div
        v-for="(item, index) in breadcrumbs"
        :key="index"
        class="flex items-center gap-4"
          >
<<<<<<< HEAD
        <div class="text-[#A9A9A9] flex gap-2.5 hover:text-[#727272] hover:cursor-pointer"
          @click="$emit('breadcrumbClick', item)">
=======
        <div class="text-[#A9A9A9] flex gap-1 hover:text-[#727272] hover:cursor-pointer">
>>>>>>> 4a0d519aee222149bc56d09d89cf6ebfef761e29
          <component
            :is="item.icon"
            class="w-5 h-5"
            v-if="item.icon"
          />
          <h3 class="font-medium text-sm">{{ item.label }}</h3>
        </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const emit = defineEmits(['breadcrumbClick']);
defineProps({
  breadcrumbs: {
    type: Array,
    default: () => [],
  },
});
</script>