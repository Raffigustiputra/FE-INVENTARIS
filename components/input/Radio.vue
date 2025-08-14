<template>
    <div class="w-full">
        <label for="brand" class="ml-0.5 mb-2 block text-sm font-medium text-[#727272]">{{ props.label }}</label>
        <div class="flex px-4 py-2 rounded-sm border focus:border border-[#D2D2D2]  bg-[#F9FBFC] justify-start items-center gap-3">
            <input type="radio" id="brand" name="brand"
            class="size-4 outline-none"
            :value="props.value"
            placeholder="Enter brand name" />
            <p class="text-sm text-">{{ props.valueName }}</p>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    label : String,
    valueName : String,
    value : String

})
</script>