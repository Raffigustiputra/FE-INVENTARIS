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
          label="NIS"
          placeholder="NIS"
          v-model="studentData.nis"
          :isDisabled="true"
        />
        <InputText
          label="Name"
          placeholder="Name"
          :isDisabled="true"
          v-model="studentData.name"
        />
        <InputText
          label="Rayon"
          placeholder="Rayon"
          :isDisabled="true"
          v-model="studentData.rayon"
        />
        <InputText
          label="Major"
          placeholder="Major"
          :isDisabled="true"
          v-model="studentData.majorName"
        />
      </div>
    </div>

    <!-- Collateral Section -->
    <div>
      <p class="text-sm font-medium text-[#AAA] mb-4">COLLATERAL</p>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
        <InputRadio
          label="Warranty"
          valueName="BKP"
          name="collateralType"
          value="BKP"
          :model-value="selectedCollateralType"
          @update:modelValue="$emit('update:selectedCollateralType', $event)"
          :disabled="true"
        />
        <InputRadio
          class="mt-5"
          valueName="Student Card"
          name="collateralType"
          value="kartu pelajar"
          :model-value="selectedCollateralType"
          @update:modelValue="$emit('update:selectedCollateralType', $event)"
          :disabled="true"
        />
      </div>
      <div class="flex gap-4">
        <div class="w-1/2">
          <InputFile
            label="Upload Warranty"
            :preview="imagePreview"
            :disabled="true"
          />
        </div>
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
            :rows="3"
            :disabled="true"
          />
          <InputText
            label="Lender's Name"
            placeholder="Enter Lender's Name"
            v-model="formData.borrowerName"
            :isDisabled="true"
          />
        </div>
      </div>
      <div class="flex gap-4">
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
</template>

<script setup>
// =============================================================================
// PROPS
// =============================================================================
const props = defineProps({
  unitItem: {
    type: Object,
    required: true,
  },
  studentData: {
    type: Object,
    required: true,
  },
  formData: {
    type: Object,
    required: true,
  },
  selectedCollateralType: {
    type: String,
    default: "",
  },
  imagePreview: {
    type: String,
    default: "",
  },
});

const emit = defineEmits([
  'update:selectedCollateralType',
]);
</script>
