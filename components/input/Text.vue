<template>
    <div class="space-y-4 my-2 w-full">
        <!-- brand name -->
        <div>
            <label for="brand" class="block text-sm font-medium text-gray-700">{{ props.label }}</label>
            <input type="text" id="brand" name="brand"
                class="mt-1 block w-full px-4 py-2 rounded-sm border border-[#D2D2D2] font-medium bg-[#F9FBFC]  focus:border-blue-500 focus:ring focus:ring-blue-200"
                :placeholder="props.placeholder" />
        </div>
    </div>
</template>

<script setup>

const props = defineProps({
    label : String,
    placeholder : String    
})
</script>