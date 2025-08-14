<template>
  <div class="space-y-4 w-full">
    <!-- description -->
    <div>
      <label
        for="brand"
        class="block ml-0.5 text-sm font-medium text-gray-700"
        >{{ props.label }}</label
      >
      <textarea
        type="textarea"
        id="description"
        name="description"
        class="outline-none mt-1 block w-full px-4 py-2 rounded-sm border text-sm border-[#D2D2D2] bg-[#F9FBFC] focus:border-blue-500 focus:ring focus:ring-blue-200"
        :placeholder="props.placeholder"
        rows="4"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
      ></textarea>
    </div>
  </div>
</template>
<script setup>
const props = defineProps({
  label: String,
  placeholder: String,
  modelValue: String,
});
const emit = defineEmits(["update:modelValue"]);
</script>
