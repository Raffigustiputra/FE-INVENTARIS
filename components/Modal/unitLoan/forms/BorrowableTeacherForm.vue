<template>
  <div class="space-y-6">
    <!-- Item Details Section -->
    <div>
      <p class="text-sm font-medium text-[#AAA] mb-2">ITEM DETAILS</p>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-x-4">
        <InputText
          label="Type"
          placeholder="Type Name"
          :isDisabled="true"
          v-model="unitItem.type"
        />
        <div class="relative flex items-center gap-2">
          <InputText
            label="Unit Code"
            placeholder="Enter Unit Code"
            v-model="unitItem.code"
            :isDisabled="true"
          />
        </div>
        <InputText
          label="Brand Name"
          placeholder="Brand Name"
          :isDisabled="true"
          v-model="unitItem.brand"
        />
        <InputText
          label="Condition"
          :isDisabled="true"
          v-model="unitItem.condition"
        />
      </div>
    </div>

    <!-- Borrower Info Section -->
    <div>
      <p class="text-sm font-medium text-[#AAA] mb-2">BORROWER INFO</p>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-x-4">
        <InputText
          label="NIP"
          placeholder="NIP"
          v-model="teacherData.nip"
          :isDisabled="true"
        />
        <InputText
          label="Name"
          placeholder="Name"
          :isDisabled="true"
          v-model="teacherData.name"
        />
      </div>
      <InputNumber
        label="Telephone"
        placeholder="Telephone"
        :isDisabled="true"
        v-model="teacherData.telephone"
      />
    </div>

    <!-- Collateral Section -->
    <div>
      <p class="text-sm font-medium text-[#AAA] mb-4">COLLATERAL</p>
      <div class="flex gap-4">
        <div class="w-1/2">
          <InputText
            label="Room"
            placeholder="Enter Room"
            class="mb-2"
            v-model="formData.room"
            :isDisabled="true"
          />
          <InputTextarea
            label="Description"
            v-model="formData.purpose"
            :rows="5"
            :disabled="true"
          />
        </div>
        <div class="w-1/2">
          <InputText
            label="Lender's Name"
            placeholder="Enter Lender's Name"
            v-model="formData.borrowerName"
            :isDisabled="true"
          />
          <InputDate
            label="Date - Pick Up Time"
            type="datetime-local"
            v-model="formData.borrowDate"
            :disabled="true"
          />
          <InputDate
            label="Return Time"
            type="datetime-local"
            v-model="formData.returnDate"
            :disabled="true"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// =============================================================================
// PROPS
// =============================================================================
const props = defineProps({
  unitItem: {
    type: Object,
    required: true
  },
  teacherData: {
    type: Object,
    required: true
  },
  formData: {
    type: Object,
    required: true
  }
})
</script>