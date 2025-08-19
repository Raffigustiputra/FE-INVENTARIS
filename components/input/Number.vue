<template>
    <div class="space-y-4 my-2 w-full">
        <!-- brand name -->
        <div>
            <label for="brand" class="block ml-0.5 text-sm font-medium text-[#727272]">{{ props.label }}</label>
            <input 
                type="number" 
                id="brand" 
                name="brand"
                :value="modelValue"
                @input="$emit('update:modelValue', $event.target.value)"
                class="outline-none mt-2 block w-full text-sm px-4 py-2 rounded-sm border border-[#D2D2D2] font-medium bg-[#F9FBFC]  focus:border-blue-500 focus:ring focus:ring-blue-200"
                :placeholder="props.placeholder" 
                :disabled="props.isDisabled" 
                :class="{
                    'bg-gray-100 cursor-not-allowed': props.isDisabled,
                    'bg-white': !props.isDisabled
                }"
            />
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    label: {
        type: String,
        default : 'Enter Label Here'
    },
    placeholder: {
        type: String,
        default : 'Enter Placeholder Here'
    },
    isDisabled: {
        type: Boolean,
        default : false
    },
    modelValue: {
        type: String
    }
})

const emit = defineEmits(['update:modelValue']);
</script>