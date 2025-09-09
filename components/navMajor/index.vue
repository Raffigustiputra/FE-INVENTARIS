<template>
    <div class="mx-4 my-2">
        <NuxtLink
            :to="props.navigateTo"
            class="px-4 py-2 rounded-lg flex items-center gap-3 duration-300 hover:bg-black/10 hover:cursor-pointer">
            <div :class="['flex items-center justify-start gap-2', isSidebarCollapsed ? 'mx-auto' : '']">
                <div
                    :style="{ backgroundColor: props.majorColor }"
                    class="size-3 rounded-full"></div>
                <h1
                v-if="!isSidebarCollapsed"
                    class="font-semibold text-sm transition-all"
                    :class="isActive ? 'text-blue-600' : 'text-[#727272]'">
                    {{ props.majorName }}
                </h1>
            </div>
        </NuxtLink>
    </div>
</template>

<script setup>
import { useRoute } from 'vue-router';

const props = defineProps({
    majorColor: String,
    majorName: String,
    navigateTo: String,
    isSidebarCollapsed: { 
      type: Boolean,
      required: true,
    },
});

const route = useRoute();
const isActive = computed(() => route.path === props.navigateTo);
</script>
