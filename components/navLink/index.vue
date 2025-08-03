<template>
  <div class="mx-4 my-3">
    <NuxtLink
      :to="props.navigateTo"
      class="px-4 py-2 rounded-lg flex items-center gap-3 duration-300 hover:cursor-pointer"
      :class="isActive ? 'bg-[#0844A4]' : 'hover:bg-black/10'"
    >
      <div>
        <component
          :is="props.icons"
          :class="['w-5 h-5', isActive ? 'text-white' : 'text-black/60']"
        />
      </div>
      <h1
        :class="[
          'text-sm font-medium',
          isActive ? 'text-white' : 'text-black/60'
        ]"
      >
        {{ props.navigationItem }}
      </h1>
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import type { Component } from 'vue'

const props = defineProps<{
  navigationItem: string
  navigateTo: string
  icons: Component | string
}>()

const route = useRoute()
const isActive = computed(() => route.path === props.navigateTo)
</script>
