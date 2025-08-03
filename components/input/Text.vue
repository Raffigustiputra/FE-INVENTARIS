<template>
    <div class="space-y-4 w-full">
        <!-- brand name -->
        <div>
            <label for="brand" class="block text-sm font-medium text-gray-700">{{ props.label }}</label>
            <input type="text" id="brand" name="brand"
                class="mt-1 block w-full px-4 py-2 rounded-sm border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                placeholder="Enter brand name" />
        </div>
    </div>
</template>

<script setup>

const props = defineProps({
    label : String
})
</script>