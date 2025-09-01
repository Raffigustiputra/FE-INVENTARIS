<template>
  <header class="w-full bg-white z-50 sticky top-0 left-0 right-0">
      <div class=" mx-auto flex items-center justify-between">
        <button @click="sidebarStore.toggle()" class="p-2 hover:bg-gray-200 cursor-pointer rounded-full">
          <IconsBurgernav
            class="size-8 text-gray-600 transition-transform duration-300"
          />
        </button>
        <nav class="flex items-center font-semibold text-lg"></nav>

        <div class="flex items-center gap-3 m-3">
          <div class="select-none text-right">
            <p class="font-medium text-gray-800">
              {{ authStore.name || "User" }}
            </p>
            <p class="text-sm text-gray-600">{{ authStore.role || "Role" }}</p>
          </div>
          <div
            class="bg-white flex items-center justify-center p-3 rounded-lg shadow"
          >
            <IconsAvatar />
          </div>
        </div>
      </div>

      <!-- <div class="w-full h-0.5 bg-gray-100 fixed left-0 mt-2.5 z-100"></div> -->
      <div
      v-if="breadcrumbs && breadcrumbs.length > 0"
      class="select-none w-full border-t-2 border-b-2 bg-white mt-2.5 -mb-5 border-gray-100 py-3 px-1"
      >
      <div class="mx-auto flex items-center gap-5">
          <div
            v-for="(item, index) in breadcrumbs"
            :key="index"
            class="flex items-center gap-4"
          >
            <div
              class="text-[#A9A9A9] flex gap-2.5 hover:text-[#727272] hover:cursor-pointer"
              @click="
                item.click ? item.click() : $emit('breadcrumbClick', item)
              "
            >
              <component :is="item.icon" class="w-5 h-5" v-if="item.icon" />
              <h3 class="font-medium text-sm">{{ item.label }}</h3>
            </div>
          </div>
        </div>
      </div>
      <!-- <div class="w-full h-0.5 bg-gray-100 fixed left-0 mt-4.5 -z-1"></div> -->
  </header>
</template>

<script setup>
import { IconsBurgernav } from '#components';
import { useAuthStore } from '@/stores/auth';
import { useSidebarStore } from '~/stores/sidebar';
const sidebarStore = useSidebarStore();

const emit = defineEmits(["breadcrumbClick"]);
const authStore = useAuthStore();

defineProps({
  breadcrumbs: {
    type: Array,
    default: () => [],
  },
});

function toggleMenu(path) {
  if (sidebarStore.isCollapsed) {
    sidebarStore.toggle(); // Or simply do nothing: return;
    return;
  }
}

// const formatRole = (role) => {
//   if (!role) return 'Role';

//   const roleMap = {
//     'superadmin': 'Super Administrator',
//     'admin': 'Administrator',
//     'kaprog': 'Kepala Program',
//     'user': 'User',
//     'student': 'Student'
//   };

//   return roleMap[role.toLowerCase()] || role.charAt(0).toUpperCase() + role.slice(1);
// };
</script>
