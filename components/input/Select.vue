<template>
    <div class="space-y-4 my-2 w-full">
        <!-- brand name -->
        <div>
            <label for="brand" class="block ml-0.5 text-sm font-medium text-gray-700 ">{{ props.label }}</label>
            <select name="" class="mt-1 block w-full px-4 py-2 rounded-sm border border-[#D2D2D2] font-medium bg-[#F9FBFC]  focus:border-blue-500 focus:ring focus:ring-blue-200" id="">
                <slot></slot>
            </select>
        </div>
    </div>
</template>

<script setup>

const props = defineProps({
    label : String
})
</script>