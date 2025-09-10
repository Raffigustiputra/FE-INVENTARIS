<template>
    <div class="fixed bottom-3 right-0 z-10 w-[20%]">
        <div class="w-full flex justify-end items-start">
            <div
                @click="$emit('hide')"
                class="cursor-pointer bg-[#F0F9F4] border-[#D4E4DA] mt-2 mr-2 w-full h-auto flex justify-start items-center p-4 gap-4 rounded-md shadow-md border">
                <div>
                    <svg
                        class="size-8"
                        viewBox="0 0 58 58"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <circle cx="29" cy="29" r="29" fill="#4CD760" />
                        <circle cx="29" cy="29" r="20" fill="white" />
                        <path
                            d="M19.667 30.7131L25.4106 36.4168L38.3337 23.5835"
                            stroke="#4CD760"
                            stroke-width="4.142"
                            stroke-linecap="round"
                            stroke-linejoin="round" />
                    </svg>
                </div>
                <div class="text-left">
                    <h1 class="font-medium text-xs text-black">{{ title }}</h1>
                    <span class="font-normal text-xs text-black/90">{{ subtitle }}</span>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
const props = defineProps(['title', 'subtitle']);
const emits = defineEmits('hide');
</script>
