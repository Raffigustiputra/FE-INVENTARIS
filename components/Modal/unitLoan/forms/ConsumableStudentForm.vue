<template>
  <div class="space-y-4">
    <div>
      <p class="text-sm font-medium text-[#AAA] mb-2">ITEMS DETAILS</p>
      <InputText
        placeholder="Select Item"
        v-model="consumableItem.name"
        class="w-1/2"
        label="Name"
        :isDisabled="true"
      />
      <div class="flex gap-4">
        <InputNumber
          v-model="formData.quantity"
          class="mt-1 w-full"
          label="Quantity"
          placeholder="Enter Quantity"
          :isDisabled="true"
        />
        <InputText
          label="Unit (pcs/pack)"
          v-model="consumableItem.unit"
          class="mt-1 w-full"
          placeholder="Enter unit"
          :isDisabled="true"
        />
      </div>
    </div>
    <div>
      <p class="text-sm font-medium text-[#AAA] mb-2">BORROWER INFO</p>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-x-4">
        <div class="relative flex items-center gap-2">
          <InputText
            label="NIS"
            placeholder="NIS"
            v-model="studentData.nis"
            :isDisabled="true"
          />
        </div>
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
    <div class="">
      <div class="flex gap-4">
        <InputDate
          label="Date - Pick Up Time"
          type="datetime-local"
          v-model="formData.borrowDate"
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
  </div>
</template>

<script setup>
// =============================================================================
// PROPS
// =============================================================================
const props = defineProps({
  formData: {
    type: Object,
    required: true,
  },
  studentData: {
    type: Object,
    required: true,
  },
  consumableItem: {
    type: Object,
    required: true,
  },
});
console.log(props.consumableItem);
</script>
