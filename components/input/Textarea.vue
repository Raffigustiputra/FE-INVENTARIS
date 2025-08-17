<template>
  <div class="space-y-4 my-2 w-full">
    <!-- description -->
    <div>
      <label
        for="brand"
        class="block ml-0.5 text-sm font-medium text-[#727272]"
        >{{ props.label }}</label
      >
      <textarea
        type="textarea"
        id="description"
        name="description"
        class="outline-none resize-none mt-1 block w-full px-4 py-2 rounded-sm border text-sm border-[#D2D2D2] bg-[#F9FBFC] focus:border-blue-500 focus:ring focus:ring-blue-200"
        :class="{'bg-gray-100 cursor-not-allowed': props.disabled}"
        :placeholder="props.placeholder"
        :rows="props.rows"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        :disabled="props.disabled"
      ></textarea>
    </div>
  </div>
</template>
<script setup>
const props = defineProps({
  label: String,
  placeholder: String,
  modelValue: String,
  rows: {
    type: Number,
    default: 4
  },
  disabled: Boolean
});
const emit = defineEmits(["update:modelValue"]);
</script>
