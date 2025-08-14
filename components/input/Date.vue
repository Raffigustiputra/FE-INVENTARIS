<template>
  <div class="space-y-4 my-2 w-full">
    <div>
      <label
        for="brand"
        class="ml-0.5 block text-sm font-medium text-gray-700"
        >{{ props.label }}</label
      >
      <input
        type="date"
        id="brand"
        name="brand"
        class="mt-1 block w-full px-4 py-2 rounded-sm border border-[#D2D2D2] bg-[#F9FBFC] focus:border-blue-500 focus:ring focus:ring-blue-200 outline-none"
        placeholder="Enter brand name"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
      />
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  label: String,
  modelValue: String,
});

const emit = defineEmits(["update:modelValue"]);
</script>
