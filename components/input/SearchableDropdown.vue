<template>
  <div class="space-y-4 my-2 w-full">
    <div>
      <label class="block ml-0.5 text-sm font-medium text-[#727272]">{{ label }}</label>
      <div class="relative mt-2">
        <div class="relative flex w-full items-center">
          <input
            type="text"
            v-model="searchText"
            @input="onInput"
            @focus="showDropdown = true"
            @blur="handleBlur"
            @click="showDropdown = true"
            @keydown.down.prevent="navigateDropdown(1)"
            @keydown.up.prevent="navigateDropdown(-1)"
            @keydown.enter.prevent="selectHighlightedOption"
            @keydown.esc="showDropdown = false"
            :class="[
              'outline-none block w-full px-4 py-2 rounded-sm text-sm border border-[#D2D2D2] font-medium bg-[#F9FBFC] focus:border-blue-500 focus:ring focus:ring-blue-200',
              { 'bg-gray-100 cursor-not-allowed': disabled }
            ]"
            :placeholder="placeholder"
            :disabled="disabled"
          />
          <button 
            v-if="searchText && !disabled"
            type="button"
            @mousedown.prevent="clearInput"
            class="absolute cursor-pointer right-2.5 text-gray-400 hover:text-gray-700 focus:outline-none"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div
          v-if="showDropdown && filteredOptions.length > 0"
          class="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto"
        >
          <div
            v-for="(option, index) in filteredOptions"
            :key="option[valueProperty]"
            @mousedown="selectOption(option)"
            :class="{
              'bg-blue-100': highlightedIndex === index,
            }"
            class="px-4 py-2 text-sm hover:bg-blue-50 cursor-pointer transition-colors duration-200"
          >
            <div class="font-normal">{{ option[labelProperty] }}</div>
          </div>
        </div>
        <div
          v-if="showDropdown && filteredOptions.length === 0 && searchText"
          class="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg px-4 py-2 text-sm text-gray-500"
        >
          {{ noResultsText }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'

const props = defineProps({
  label: {
    type: String,
    default: 'Label'
  },
  modelValue: {
    type: [String, Number, null],
    default: null,
  },
  options: {
    type: Array,
    default: () => [],
  },
  valueProperty: {
    type: String,
    default: 'code_unit',
  },
  labelProperty: {
    type: String,
    default: 'code_unit',
  },
  sublabelProperty: {
    type: String,
    default: 'item_name',
  },
  placeholder: {
    type: String,
    default: 'Search unit code...',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  noResultsText: {
    type: String,
    default: 'No results found',
  },
})

const emit = defineEmits(['update:modelValue', 'select'])

const searchText = ref('')
const showDropdown = ref(false)
const highlightedIndex = ref(0)

const clearInput = () => {
  searchText.value = ''
  emit('update:modelValue', null)
  emit('select', null)
  showDropdown.value = false
}

const filteredOptions = computed(() => {
  if (!searchText.value) return props.options.slice(0, 10) // Show first 10 when no search
  
  return props.options.filter((option) =>
    option[props.labelProperty].toLowerCase().includes(searchText.value.toLowerCase()) ||
    (option[props.sublabelProperty] && option[props.sublabelProperty].toLowerCase().includes(searchText.value.toLowerCase()))
  ).slice(0, 20) // Limit to 20 results
})

const getSelectedOptionLabel = () => {
  const selectedOption = props.options.find(
    (option) => option[props.valueProperty] === props.modelValue,
  )
  return selectedOption ? selectedOption[props.labelProperty] : ''
}

// Handle user input
const onInput = () => {
  showDropdown.value = true
  highlightedIndex.value = 0
}

// Navigate through dropdown with keyboard
const navigateDropdown = (direction) => {
  if (showDropdown.value && filteredOptions.value.length > 0) {
    if (direction === 1) {
      highlightedIndex.value = Math.min(highlightedIndex.value + 1, filteredOptions.value.length - 1)
    } else if (direction === -1) {
      highlightedIndex.value = Math.max(highlightedIndex.value - 1, 0)
    }
  }
}

// Select option with keyboard enter key
const selectHighlightedOption = () => {
  if (showDropdown.value && filteredOptions.value.length > 0) {
    const option = filteredOptions.value[highlightedIndex.value]
    if (option) {
      selectOption(option)
    }
  }
}

// Select an option from the dropdown
const selectOption = (option) => {
  const value = option[props.valueProperty]
  emit('update:modelValue', value)
  emit('select', option)
  
  searchText.value = option[props.labelProperty]
  showDropdown.value = false
}

// Handle blur event
const handleBlur = () => {
  setTimeout(() => {
    showDropdown.value = false
    
    // If no option is selected, clear the input
    if (!props.modelValue && searchText.value) {
      searchText.value = ''
    }
    
    // If an option is selected but search text doesn't match, restore correct label
    if (props.modelValue && searchText.value !== getSelectedOptionLabel()) {
      searchText.value = getSelectedOptionLabel()
    }
  }, 200)
}

// Watch for external changes to modelValue
watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue !== null) {
      searchText.value = getSelectedOptionLabel()
    } else {
      searchText.value = ''
    }
  },
  { immediate: true },
)
</script>