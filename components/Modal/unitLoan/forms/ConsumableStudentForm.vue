<template>
  <div class="space-y-4">
    <div>
      <label class="ml-0.5 block text-sm font-medium text-[#727272]">
        Student Name
      </label>
      <input
        type="text"
        v-model="formData.studentName"
        class="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Enter student name"
        disabled
      />
    </div>
    <div>
      <label class="ml-0.5 block text-sm font-medium text-[#727272]">
        Student ID
      </label>
      <input
        type="text"
        v-model="formData.studentId"
        class="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Enter student ID"
        disabled
      />
    </div>
    <div>
      <label class="ml-0.5 block text-sm font-medium text-[#727272]">
        Class
      </label>
      <input
        type="text"
        v-model="formData.class"
        class="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Enter class"
        disabled
      />
    </div>
    <div>
      <label class="ml-0.5 block text-sm font-medium text-[#727272]">
        Quantity
      </label>
      <input
        type="number"
        v-model="formData.quantity"
        class="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Enter quantity"
        min="1"
        disabled
      />
    </div>
    <div>
      <label class="ml-0.5 block text-sm font-medium text-[#727272]">
        Usage Date
      </label>
      <input
        type="date"
        v-model="formData.usageDate"
        class="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        disabled
      />
    </div>
  </div>
</template>

<script setup>
// =============================================================================
// PROPS
// =============================================================================
const props = defineProps({
  formData: {
    type: Object,
    required: true
  }
})
</script>