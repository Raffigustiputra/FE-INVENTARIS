<template>
  <div class="w-full">
    <label
      :for="`radio-${props.value}`"
      class="ml-0.5 mb-1 block text-sm font-medium cursor-pointer text-[#727272]"
      :class="{'cursor-not-allowed': props.disabled}"
    >
      {{ props.label }}
    </label>
    <div
      class="flex px-4 py-2 rounded-sm border focus:border border-[#D2D2D2] justify-start items-center gap-3"
    >
      <label
        :for="`radio-${props.value}`"
        class="flex items-center gap-2 cursor-pointer w-full"
        :class="{'cursor-not-allowed': props.disabled}"
      >
        <input
          type="radio"
          :name="props.name"
          :id="`radio-${props.value}`"
          class="size-4 outline-none"
          :class="{'cursor-not-allowed': props.disabled}"
          :value="props.value"
          :checked="modelValue === props.value"
          @change="$emit('update:modelValue', props.value)"
          :disabled="props.disabled"
        />
        <p class="text-sm">{{ props.valueName }}</p>
      </label>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  label: String,
  valueName: String,
  value: String,
  name: String,
  modelValue: String,
  disabled: Boolean
});

defineEmits(["update:modelValue"]);
</script>
