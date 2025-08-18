<template>
    <div class="space-y-4 my-2 w-full">
        <!-- brand name -->
        <div>
            <label class="block ml-0.5 text-sm font-medium text-gray-700">
                {{ label }}
            </label>
            <select
                class="mt-1 block h-9.5 w-full px-4 rounded-sm border outline-none border-[#D2D2D2] font-medium bg-[#F9FBFC] text-[#727272] focus:border-blue-500 focus:ring focus:ring-blue-200"
                :value="modelValue"
                @change="$emit('update:modelValue', $event.target.value)">
                <!-- placeholder option -->
                <option value="" disabled hidden>{{ placeholder }}</option>
                <slot></slot>
            </select>

            <!-- slot buat option dari luar -->
        </div>
    </div>
</template>

<script setup>
defineProps({
    label: String,
    placeholder: {
        type: String,
        default: 'Select an option',
    },
    modelValue: [String, Number],
});

defineEmits(['update:modelValue']);
</script>
