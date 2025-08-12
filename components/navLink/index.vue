<template>
  <div class="mx-4 my-3">
    <NuxtLink
      :to="props.navigateTo"
      class="px-4 py-2 rounded-lg flex items-center gap-3 duration-300 hover:cursor-pointer"
      :class="isActive ? 'bg-[#0844A4]' : 'hover:bg-black/10'"
    >
      <div>
        <slot :isActive="isActive"></slot>
      </div>
      <h1
        :class="[
<<<<<<< HEAD
          'text-sm font-semibold select-none',
          isActive ? 'text-white' : 'text-black/60',
=======
          'text-sm font-medium',
          isActive ? 'text-white' : 'text-black/60'
>>>>>>> 4a0d519aee222149bc56d09d89cf6ebfef761e29
        ]"
      >
        {{ props.navigationItem }}
      </h1>
      <svg
        v-if="props.childMenu"
        :class="['w-4 h-4 transition-transform absolute right-10 select-none', isOpen ? 'rotate-180' : 'rotate-0']"
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
  isOpen?: boolean
}>();

const route = useRoute();
const isActive = computed(() => route.path === props.navigateTo);
</script>
