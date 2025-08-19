<template>
    <div class="fixed top-0 right-0 z-10 w-2/12">
        <div class="w-full flex justify-end items-start">
            <div
                @click="$emit('hide')"
                class="cursor-pointer bg-[#FFF7EA] border-[#EFDECA] mt-2 mr-2 w-full h-auto flex justify-start items-center p-3 gap-4 rounded-md shadow-md border">
                <div>
                    <svg
                        class="size-8"
                        viewBox="0 0 58 58"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <circle cx="29" cy="29" r="29" fill="#FDBD1A" />
                        <circle cx="29" cy="29" r="20" fill="white" />
                        <path
                            d="M28.5004 17.75V32.0833M28.5896 39.25V39.4292L28.4111 39.4295V39.25H28.5896Z"
                            stroke="#FDBD1A"
                            stroke-width="4.698"
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
