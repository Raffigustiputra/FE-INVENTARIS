<template>
  <div class="mx-4 my-3">
    <NuxtLink
      :to="props.navigateTo"
      class="px-4 py-2 rounded-lg flex items-center gap-3 duration-300 hover:cursor-pointer"
      :class="[
        isActive && !props.childMenu ? 'bg-[#0844A4]' : 'hover:bg-black/10',
        isActive && props.childMenu ? 'bg-[#414141]/20' : ''
      ]"
    >
      <div>
        <slot :isActive="isActive"></slot>
      </div>  
     <template v-if="!props.isCollapsed">
        <h1
          :class="[
            'text-sm font-semibold select-none transition-opacity duration-200 whitespace-nowrap',
            isActive && !props.childMenu ? 'text-white' : 'text-black/60',
          ]"
        >
          {{ props.navigationItem }}
        </h1>
        <svg
          v-if="props.childMenu"
          :class="[
            'w-4 h-4 transition-transform absolute right-6 select-none',
            isOpen ? 'rotate-180' : 'rotate-0', isActive && !props.childMenu ? 'text-white' : 'text-black/60'
          ]"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </template>
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import type { Component } from "vue";

const props = defineProps<{
  navigationItem: string;
  navigateTo: string;
  icons: Component | string;
  childMenu?: string | null;
  isOpen?: boolean;
  isCollapsed?: boolean; 
}>();

const route = useRoute();

const isActive = computed(() => {
  const currentPath = route.path;
  const basePath = props.navigateTo;
  const isChildActive = props.childMenu?.some(child => currentPath.startsWith(child.path));

  if (props.childMenu && props.childMenu.length > 0) {
    return isChildActive;
  }

  return currentPath === basePath || currentPath.startsWith(basePath + "/");
});
</script>