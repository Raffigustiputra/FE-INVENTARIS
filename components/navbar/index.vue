<template>
  <div>
    <div
      class="w-8/10 h-18.5 flex flex-col fixed top-0 right-0 bg-white shadow-sm z-10 border-b border-black/10"
    >
      <div
        class="container mx-auto flex items-center justify-between py-3 px-6"
      >
        <nav class="flex items-center font-semibold text-lg">
          <IconsNavbar />
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
        class="w-8/10 border-t border-b bg-white fixed top-[73px] right-0 border-gray-100 py-3 px-12"
      >
        <div class="container mx-auto flex items-center gap-5">
          <div
            v-for="(item, index) in breadcrumbs"
            :key="index"
            class="flex items-center gap-4"
          >
            <router-link
              v-if="item.to"
              :to="`/${item.to}`"
              class="text-[#A9A9A9] flex gap-1 hover:text-[#727272]"
            >
              <component
                :is="item.icon"
                class="w-5 h-5"
                v-if="item.icon"
              />
              <h3 class="font-medium text-sm">{{ item.label }}</h3>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  breadcrumbs: {
    type: Array,
    default: () => [],
  },
});
</script>
