<template>
  <Transition name="fade">
    <div
      v-if="isOpen"
      class="fixed top-0 left-0 z-40 flex items-center justify-center w-full h-screen bg-black/30"
    >
      <Modal
        @btnClose="$emit('close')"
        :title="modalTitle"
        :isSubmitting="false"
        :disableSubmit="true"
        :showActions="false"
      >
        <div class="max-h-[28rem] overflow-y">
          <!-- Borrowable Student Form -->
          <BorrowableStudentForm
            v-if="modalType === 'borrowable-student'"
            :unitItem="unitItem"
            :studentData="studentData"
            :formData="formData"
            :selectedCollateralType="selectedCollateralType"
            :imagePreview="imagePreview"
          />
          
          <!-- Borrowable Teacher Form -->
          <BorrowableTeacherForm
            v-else-if="modalType === 'borrowable-teacher'"
            :unitItem="unitItem"
            :teacherData="teacherData"
            :formData="formData"
          />
          
          <!-- Consumable Student Form -->
          <ConsumableStudentForm
            v-else-if="modalType === 'consumable-student'"
            :formData="formData"
            :consumableItem="consumableItem"
            :studentData="studentData"
          />
          
          <!-- Consumable Teacher Form -->
          <ConsumableTeacherForm
            v-else-if="modalType === 'consumable-teacher'"
            :formData="formData"
            :consumableItem="consumableItem"
            :teacherData="teacherData"
          />
        </div>
      </Modal>
    </div>
  </Transition>
</template>

<script setup>
import BorrowableStudentForm from './forms/BorrowableStudentForm.vue'
import BorrowableTeacherForm from './forms/BorrowableTeacherForm.vue'
import ConsumableStudentForm from './forms/ConsumableStudentForm.vue'
import ConsumableTeacherForm from './forms/ConsumableTeacherForm.vue'

// =============================================================================
// PROPS
// =============================================================================
const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  modalType: {
    type: String,
    default: null,
    validator: (value) => [
      null,
      'borrowable-student',
      'borrowable-teacher', 
      'consumable-student',
      'consumable-teacher'
    ].includes(value)
  },
  unitItem: {
    type: Object,
    default: () => ({})
  },
  studentData: {
    type: Object,
    default: () => ({})
  },
  teacherData: {
    type: Object,
    default: () => ({})
  },
  formData: {
    type: Object,
    default: () => ({})
  },
  selectedCollateralType: {
    type: String,
    default: ''
  },
  consumableItem: {
    type: Object,
    default: () => ({})
  },
  imagePreview: {
    type: String,
    default: ''
  }
})

// =============================================================================
// EMITS
// =============================================================================
const emit = defineEmits(['close'])

// =============================================================================
// COMPUTED
// =============================================================================
const modalTitle = computed(() => {
  return 'Detail History'
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>