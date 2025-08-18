<template>
    <div class="space-y-4 my-2 w-full">
        <!-- brand name -->
        <div>
            <label class="block ml-0.5 text-sm font-medium text-gray-700">
                {{ label }}
            </label>
            <select
                class="mt-2 block w-full px-4 py-2 rounded-sm border outline-none border-[#D2D2D2] font-medium bg-[#F9FBFC] text-[#727272] focus:border-blue-500 focus:ring focus:ring-blue-200"
                :value="modelValue"
                :class="{ 'opacity-50 cursor-not-allowed' : isDisabled, 'cursor-pointer': !isDisabled }"
                @change="$emit('update:modelValue', $event.target.value)"
                :disabled="isDisabled"
            >
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
    isDisabled: {
        type: Boolean,
        default: false
    }
});

defineEmits(['update:modelValue']);
</script>
