<template>
    <div class="mx-4 my-2">
        <div class="px-4 py-2 rounded-lg flex items-center gap-3 hover:bg-black/10 duration-300 hover:cursor-pointer">
            <div class=" ">
                <component :is="props.icons" />
            </div>
            <h1 class="text-sm text-black/60 font-semibold">{{ props.navigationItem }}</h1>
        </div>
        <!-- <div class="px-4 py-2 text-center rounded-lg bg-red-400 hover:bg-black duration-300 hover:cursor-pointer">
            <h1>Main Menu</h1>
        </div> -->
        </div>
</template>
<script setup lang="ts">
import type { Component } from 'vue';

const props = defineProps<{
  navigationItem: string,
  icons: Component | string
}>()

</script>