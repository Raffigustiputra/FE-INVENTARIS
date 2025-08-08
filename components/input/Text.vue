<template>
    <div class="space-y-4 my-2 w-full">
        <!-- brand name -->
        <div>
            <label for="brand" class="block ml-0.5 text-sm font-medium text-[#727272]">{{ props.label }}</label>
            <input 
                type="text" 
                id="brand" 
                name="brand"
                :value="modelValue"
                @input="$emit('update:modelValue', $event.target.value)"
                class="outline-none mt-2 block w-full px-4 py-2 rounded-sm border border-[#D2D2D2] font-medium bg-[#F9FBFC]  focus:border-blue-500 focus:ring focus:ring-blue-200"
                :placeholder="props.placeholder" 
                :disabled="disabled" 
            />
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    label: String,
    placeholder: String,
    disabled: Boolean,
    modelValue: String
})

const emit = defineEmits(['update:modelValue']);
</script>