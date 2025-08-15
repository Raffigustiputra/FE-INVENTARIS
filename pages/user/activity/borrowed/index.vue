<style scoped>
.alert-enter-from,
.alert-leave-to {
  opacity: 0;
  transform: translateX(50%);
}

.alert-enter-to,
.alert-leave-from {
  opacity: 1;
  transform: translateX(0);
}

.alert-enter-active,
.alert-leave-active {
  transition: all 350ms ease;
}

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

<template>
  <transition name="alert">
    <AlertError
      class="z-50"
      v-if="alertError"
      :title="alertMessage"
      @hide="alertError = false"
    />
  </transition>
  <transition name="alert">
    <AlertSuccess
      class="z-50"
      v-if="alertSuccess"
      :title="alertMessage"
      @hide="alertSuccess = false"
    />
  </transition>
  <transition name="alert">
    <AlertWarning class="z-50" v-if="alertWarning" :title="alertMessage" />
  </transition>

  <div>
    <Navbar
      :breadcrumbs="breadcrumbs"
      @breadcrumbClick="openModalFromBreadcrumb"
    />
    <div class="flex items-center justify-between mt-12 mb-4">
      <h1 class="font-semibold text-2xl">
        Activity
        <div class="inline text-lg">/</div>
        Borrowed
      </h1>
      <SearchBox :text="'Search Borrowed'" />
    </div>
  </div>

  <!-- Modal FORM BORROWING -->
  <div class="w-full">
    <Transition name="fade">
      <div
        v-if="modalFormBorrowing"
        class="fixed top-0 left-0 z-40 flex items-center justify-center w-full h-screen bg-black/30"
      >
        <Modal
          @btnSubmit="handleFormBorrowingSubmit"
          @btnClose="closeModalCreate"
          title="Form Borrowing"
          :isSubmitting="isSubmitting"
        >
          <div>
            <label class="ml-0.5 mt-3 block text-sm font-medium text-[#727272]"
              >Item Type</label
            >
            <div class="w-full flex items-center gap-2">
              <InputRadio
                class="w-1/2"
                valueName="Consumable Item"
                name="itemType"
                value="consumable"
                v-model="selectedItemType"
              />
              <InputRadio
                class="w-1/2"
                valueName="Borrowable Item"
                name="itemType"
                value="borrowable"
                v-model="selectedItemType"
              />
            </div>
            <p v-if="formErrors.itemType" class="text-red-500 text-xs mt-1">
              {{ formErrors.itemType }}
            </p>
          </div>
          <div class="mb-3">
            <label class="ml-0.5 mt-5 block text-sm font-medium text-[#727272]"
              >Select Borrow's</label
            >
            <div class="w-full flex items-center gap-2">
              <InputRadio
                class="w-1/2"
                valueName="Student"
                name="borrowerType"
                value="student"
                v-model="selectedBorrowerType"
              />
              <InputRadio
                class="w-1/2"
                valueName="Teacher"
                name="borrowerType"
                value="teacher"
                v-model="selectedBorrowerType"
              />
            </div>
            <p v-if="formErrors.borrowerType" class="text-red-500 text-xs mt-1">
              {{ formErrors.borrowerType }}
            </p>
          </div>
          <div v-if="formErrors.general" class="text-red-500 text-sm mb-3">
            {{ formErrors.general }}
          </div>
        </Modal>
      </div>
    </Transition>
  </div>

  <!-- Modal BORROWABLE STUDENT -->
  <div class="w-full">
    <Transition name="fade">
      <div
        v-if="modalBorrowableStudent"
        class="fixed top-0 left-0 z-40 flex items-center justify-center w-full h-screen bg-black/30"
      >
        <Modal
          @btnClose="closeModalBorrowableStudent"
          title="Form Borrowing"
          @btnSubmit="createUnitItem"
          :isSubmitting="isSubmitting"
          class="max-h-[90vh] overflow-y-auto"
        >
          <div class="space-y-6">
            <div>
              <p class="text-sm font-medium text-[#AAA] mb-2">ITEM DETAILS</p>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-x-4">
                <InputText
                  label="Type"
                  placeholder="Type Name"
                  isDisabled="true"
                />
                <InputText label="Unit Code" placeholder="Enter Unit Code" />
                <InputText
                  label="Brand Name"
                  placeholder="Brand Name"
                  isDisabled="true"
                />
                <InputText label="Condition" isDisabled="true" />
              </div>
            </div>
            <div>
              <p class="text-sm font-medium text-[#AAA] mb-2">BORROWER INFO</p>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-x-4">
                <InputText label="NIS" placeholder="NIS" />
                <InputText label="Name" placeholder="Name" isDisabled="true" />
                <InputText
                  label="Rayon"
                  placeholder="Rayon"
                  isDisabled="true"
                />
                <InputText
                  label="Major"
                  placeholder="Major"
                  isDisabled="true"
                />
              </div>
            </div>
            <p class="text-sm font-medium text-[#AAA] mb-4">COLLATERAL</p>
            <div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                <InputRadio
                  label="Warranty"
                  valueName="BKP"
                  name="collateralType"
                  value="bkp"
                  v-model="selectedCollateralType"
                />
                <InputRadio
                  class="mt-5"
                  valueName="Student Card"
                  name="collateralType"
                  value="student_card"
                  v-model="selectedCollateralType"
                />
              </div>
              <div class="flex gap-4">
                <div class="w-1/2">
                  <InputFile
                    label="Upload Warranty"
                    valueName="BKP"
                    name="collateralType"
                    value="bkp"
                    v-model="selectedCollateralType"
                  />
                </div>
                <div class="w-1/2">
                  <InputText
                    label="Room"
                    placeholder="Enter Room"
                    class="mb-2"
                  />
                  <InputTextarea
                    label="Description"
                    valueName="Student Card"
                    name="collateralType"
                    value="student_card"
                    v-model="selectedCollateralType"
                    :rows="3"
                  />
                </div>
              </div>
              <div class="flex gap-4">
                <InputDate label="Date - Pick Up Time" type="datetime-local" />
                <InputText
                  label="Lender's Name"
                  placeholder="Enter Lender's Name"
                />
              </div>
            </div>
          </div>
        </Modal>
      </div>
    </Transition>
  </div>

  <!-- Modal BORROWABLE TEACHER -->
  <div class="w-full">
    <Transition name="fade">
      <div
        v-if="modalBorrowableTeacher"
        class="fixed top-0 left-0 z-40 flex items-center justify-center w-full h-screen bg-black/30"
      >
        <Modal
          @btnSubmit="submitBorrowableTeacher"
          @btnClose="closeModalBorrowableTeacher"
          title="Borrowable Form - Teacher"
          :isSubmitting="isSubmitting"
        >
          <div class="space-y-4">
            <div>
              <label class="ml-0.5 block text-sm font-medium text-[#727272]"
                >Teacher Name</label
              >
              <input
                type="text"
                v-model="borrowableTeacherForm.teacherName"
                class="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter teacher name"
              />
            </div>
            <div>
              <label class="ml-0.5 block text-sm font-medium text-[#727272]"
                >Employee ID</label
              >
              <input
                type="text"
                v-model="borrowableTeacherForm.employeeId"
                class="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter employee ID"
              />
            </div>
            <div>
              <label class="ml-0.5 block text-sm font-medium text-[#727272]"
                >Department</label
              >
              <input
                type="text"
                v-model="borrowableTeacherForm.department"
                class="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter department"
              />
            </div>
            <div>
              <label class="ml-0.5 block text-sm font-medium text-[#727272]"
                >Borrow Date</label
              >
              <input
                type="date"
                v-model="borrowableTeacherForm.borrowDate"
                class="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label class="ml-0.5 block text-sm font-medium text-[#727272]"
                >Return Date</label
              >
              <input
                type="date"
                v-model="borrowableTeacherForm.returnDate"
                class="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </Modal>
      </div>
    </Transition>
  </div>

  <!-- Modal CONSUMABLE STUDENT -->
  <div class="w-full">
    <Transition name="fade">
      <div
        v-if="modalConsumableStudent"
        class="fixed top-0 left-0 z-40 flex items-center justify-center w-full h-screen bg-black/30"
      >
        <Modal
          @btnSubmit="submitConsumableStudent"
          @btnClose="closeModalConsumableStudent"
          title="Consumable Form - Student"
          :isSubmitting="isSubmitting"
        >
          <div class="space-y-4">
            <div>
              <label class="ml-0.5 block text-sm font-medium text-[#727272]"
                >Student Name</label
              >
              <input
                type="text"
                v-model="consumableStudentForm.studentName"
                class="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter student name"
              />
            </div>
            <div>
              <label class="ml-0.5 block text-sm font-medium text-[#727272]"
                >Student ID</label
              >
              <input
                type="text"
                v-model="consumableStudentForm.studentId"
                class="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter student ID"
              />
            </div>
            <div>
              <label class="ml-0.5 block text-sm font-medium text-[#727272]"
                >Class</label
              >
              <input
                type="text"
                v-model="consumableStudentForm.class"
                class="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter class"
              />
            </div>
            <div>
              <label class="ml-0.5 block text-sm font-medium text-[#727272]"
                >Quantity</label
              >
              <input
                type="number"
                v-model="consumableStudentForm.quantity"
                class="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter quantity"
                min="1"
              />
            </div>
            <div>
              <label class="ml-0.5 block text-sm font-medium text-[#727272]"
                >Usage Date</label
              >
              <input
                type="date"
                v-model="consumableStudentForm.usageDate"
                class="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </Modal>
      </div>
    </Transition>
  </div>

  <!-- Modal CONSUMABLE TEACHER -->
  <div class="w-full">
    <Transition name="fade">
      <div
        v-if="modalConsumableTeacher"
        class="fixed top-0 left-0 z-40 flex items-center justify-center w-full h-screen bg-black/30"
      >
        <Modal
          @btnSubmit="submitConsumableTeacher"
          @btnClose="closeModalConsumableTeacher"
          title="Consumable Form - Teacher"
          :isSubmitting="isSubmitting"
        >
          <div class="space-y-4">
            <div>
              <label class="ml-0.5 block text-sm font-medium text-[#727272]"
                >Teacher Name</label
              >
              <input
                type="text"
                v-model="consumableTeacherForm.teacherName"
                class="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter teacher name"
              />
            </div>
            <div>
              <label class="ml-0.5 block text-sm font-medium text-[#727272]"
                >Employee ID</label
              >
              <input
                type="text"
                v-model="consumableTeacherForm.employeeId"
                class="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter employee ID"
              />
            </div>
            <div>
              <label class="ml-0.5 block text-sm font-medium text-[#727272]"
                >Department</label
              >
              <input
                type="text"
                v-model="consumableTeacherForm.department"
                class="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter department"
              />
            </div>
            <div>
              <label class="ml-0.5 block text-sm font-medium text-[#727272]"
                >Quantity</label
              >
              <input
                type="number"
                v-model="consumableTeacherForm.quantity"
                class="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter quantity"
                min="1"
              />
            </div>
            <div>
              <label class="ml-0.5 block text-sm font-medium text-[#727272]"
                >Usage Date</label
              >
              <input
                type="date"
                v-model="consumableTeacherForm.usageDate"
                class="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </Modal>
      </div>
    </Transition>
  </div>

  <TableSkeleton v-if="pending" :rows="4" :columns="7" />
  <div v-else class="overflow-x-auto rounded-lg bg-white">
    <table class="min-w-full text-sm text-left">
      <thead class="bg-gray-100">
        <tr class="text-sm font-semibold text-gray-700">
          <th class="px-4 py-3">
            <input type="checkbox" v-model="selectAll" @change="toggleAll" />
          </th>
          <th class="py-3 px-4 text-center">Type</th>
          <th
            class="px-4 py-3 text-center first:!px-2 first:!text-left nth-2:!px-2 nth-2:!text-center"
          >
            Unit Code
          </th>
          <th class="px-4 py-3 text-center">Brand</th>
          <th class="px-4 py-3 text-center">Borrowed Time</th>
          <th class="px-4 py-3 text-center">Action</th>
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200">
        <tr v-if="pending">
          <td colspan="6" class="px-4 py-3 text-center">Loading...</td>
        </tr>
        <tr v-else-if="!loanStore.loan || loanStore.loan.length === 0">
          <td colspan="6" class="px-4 py-3 text-center">No loan data available</td>
        </tr>
        <tr
          v-else
          v-for="item in loanStore.loan"
          :key="item.id"
          class="hover:bg-gray-50"
        >
          <td class="px-4 py-3">
            <input type="checkbox" v-model="selectedItems" :value="item.id" />
          </td>
          <td class="py-3 text-center">
            {{ item.unit_item.sub_item.item.name }}
          </td>
          <td class="px-4 py-3 text-center">{{ item.unit_item.code_unit }}</td>
          <td class="px-4 py-3 text-center">
            {{ item.unit_item.sub_item.merk }}
          </td>
          <td class="px-4 py-3 text-center">
            {{ formatDate(item.borrowed_at) }}
          </td>
          <td class="px-4 py-3 flex justify-center gap-2">
            <ButtonEdit @click="openModalUpdate(item)" />
            <ButtonDelete @click="openModalDelete(item)" />
          </td>
        </tr>
      </tbody>
    </table>
    <p class="text-xs text-gray-500 mt-3 ml-2"></p>
  </div>
</template>

<script setup>
import {
  IconsNavbarIconsAddItem,
  IconsNavbarIconsFile,
  IconsNavbarIconsFilterMajor,
  IconsNavbarIconsFilterRole,
  IconsNavbarIconsPrint,
} from "#components";
import { ref } from "vue";
import { useLoanStore } from "~/stores/loan";
import { useAuthStore } from "~/stores/auth";

const modalFormBorrowing = ref(false);
const modalBorrowableStudent = ref(false);
const modalBorrowableTeacher = ref(false);
const modalConsumableStudent = ref(false);
const modalConsumableTeacher = ref(false);
const loanStore = useLoanStore();
const url = useRuntimeConfig().public.authUrl;
const authStore = useAuthStore();

// Form states
const selectedItemType = ref("");
const selectedBorrowerType = ref("");

// Form data
const borrowableStudentForm = ref({
  studentName: "",
  studentId: "",
  class: "",
  borrowDate: "",
  returnDate: "",
});

const borrowableTeacherForm = ref({
  teacherName: "",
  employeeId: "",
  department: "",
  borrowDate: "",
  returnDate: "",
});

const consumableStudentForm = ref({
  studentName: "",
  studentId: "",
  class: "",
  quantity: 1,
  usageDate: "",
});

const consumableTeacherForm = ref({
  teacherName: "",
  employeeId: "",
  department: "",
  quantity: 1,
  usageDate: "",
});

// Form validation state
const formErrors = ref({
  itemType: "",
  borrowerType: "",
  general: "",
});

// Modal functions
const openModalFormBorrowing = () => {
  modalFormBorrowing.value = true;
};

const closeModalCreate = () => {
  modalFormBorrowing.value = false;
  selectedItemType.value = "";
  selectedBorrowerType.value = "";
};

// Handle form borrowing submit - conditional logic
const handleFormBorrowingSubmit = () => {
  // Reset form errors
  formErrors.value = {
    itemType: "",
    borrowerType: "",
    general: "",
  };

  // Validate both fields are selected
  let hasError = false;

  if (!selectedItemType.value) {
    formErrors.value.itemType = "Please select an item type";
    hasError = true;
  }

  if (!selectedBorrowerType.value) {
    formErrors.value.borrowerType = "Please select a borrower type";
    hasError = true;
  }

  if (hasError) {
    formErrors.value.general = "Please select both Item Type and Borrower Type";
    return;
  }

  // Proceed with form submission since validation passed
  console.log("Form submission with:", {
    itemType: selectedItemType.value,
    borrowerType: selectedBorrowerType.value,
  });

  // Close the first modal
  modalFormBorrowing.value = false;

  // Open appropriate modal based on selections
  if (
    selectedItemType.value === "borrowable" &&
    selectedBorrowerType.value === "student"
  ) {
    modalBorrowableStudent.value = true;
  } else if (
    selectedItemType.value === "borrowable" &&
    selectedBorrowerType.value === "teacher"
  ) {
    modalBorrowableTeacher.value = true;
  } else if (
    selectedItemType.value === "consumable" &&
    selectedBorrowerType.value === "student"
  ) {
    modalConsumableStudent.value = true;
  } else if (
    selectedItemType.value === "consumable" &&
    selectedBorrowerType.value === "teacher"
  ) {
    modalConsumableTeacher.value = true;
  }
};

// Borrowable Student Modal functions
const closeModalBorrowableStudent = () => {
  modalBorrowableStudent.value = false;
  resetBorrowableStudentForm();
};

const getUnitLoan = async () => {
  try {
    pending.value = true;
    const response = await fetch(`${url}/unit-loan`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authStore.token}`,
      },
    });
    
    if (response.ok) {
      const result = await response.json();
      
      // Check if the data structure has a 'data' property
      if (result.data) {
        loanStore.loan = result.data;
        console.log("Loan data loaded successfully:", result.data);
      } else {
        loanStore.loan = result;
        console.log("Loan data loaded with fallback structure:", result);
      }
    } else {
      console.error("Error response:", response.status, response.statusText);
      alertError.value = true;
      alertMessage.value = "Failed to fetch loan data";
    }
  } catch (error) {
    console.error("Error fetching unit loan data:", error);
    alertError.value = true;
    alertMessage.value = "Network error while fetching loan data";
  } finally {
    pending.value = false;
  }
};

onMounted(() => {
  getUnitLoan();
});

const submitBorrowableStudent = async () => {
  isSubmitting.value = true;

  try {
    if (
      !borrowableStudentForm.value.studentName ||
      !borrowableStudentForm.value.studentId
    ) {
      alertError.value = true;
      alertMessage.value = "Please fill in required fields";
      return;
    }

    console.log("Borrowable Student Form Data:", borrowableStudentForm.value);

    alertSuccess.value = true;
    alertMessage.value = "Borrowable form for student submitted successfully!";

    closeModalBorrowableStudent();
    resetSelections();
  } catch (error) {
    alertError.value = true;
    alertMessage.value = "An error occurred while submitting the form";
  } finally {
    isSubmitting.value = false;
  }
};

const closeModalBorrowableTeacher = () => {
  modalBorrowableTeacher.value = false;
  resetBorrowableTeacherForm();
};

const submitBorrowableTeacher = async () => {
  isSubmitting.value = true;

  try {
    if (
      !borrowableTeacherForm.value.teacherName ||
      !borrowableTeacherForm.value.employeeId
    ) {
      alertError.value = true;
      alertMessage.value = "Please fill in required fields";
      return;
    }

    console.log("Borrowable Teacher Form Data:", borrowableTeacherForm.value);

    alertSuccess.value = true;
    alertMessage.value = "Borrowable form for teacher submitted successfully!";

    closeModalBorrowableTeacher();
    resetSelections();
  } catch (error) {
    alertError.value = true;
    alertMessage.value = "An error occurred while submitting the form";
  } finally {
    isSubmitting.value = false;
  }
};

const closeModalConsumableStudent = () => {
  modalConsumableStudent.value = false;
  resetConsumableStudentForm();
};

const submitConsumableStudent = async () => {
  isSubmitting.value = true;

  try {
    if (
      !consumableStudentForm.value.studentName ||
      !consumableStudentForm.value.studentId
    ) {
      alertError.value = true;
      alertMessage.value = "Please fill in required fields";
      return;
    }

    console.log("Consumable Student Form Data:", consumableStudentForm.value);

    alertSuccess.value = true;
    alertMessage.value = "Consumable form for student submitted successfully!";

    closeModalConsumableStudent();
    resetSelections();
  } catch (error) {
    alertError.value = true;
    alertMessage.value = "An error occurred while submitting the form";
  } finally {
    isSubmitting.value = false;
  }
};

const closeModalConsumableTeacher = () => {
  modalConsumableTeacher.value = false;
  resetConsumableTeacherForm();
};

const submitConsumableTeacher = async () => {
  isSubmitting.value = true;

  try {
    if (
      !consumableTeacherForm.value.teacherName ||
      !consumableTeacherForm.value.employeeId
    ) {
      alertError.value = true;
      alertMessage.value = "Please fill in required fields";
      return;
    }

    console.log("Consumable Teacher Form Data:", consumableTeacherForm.value);

    alertSuccess.value = true;
    alertMessage.value = "Consumable form for teacher submitted successfully!";

    closeModalConsumableTeacher();
    resetSelections();
  } catch (error) {
    alertError.value = true;
    alertMessage.value = "An error occurred while submitting the form";
  } finally {
    isSubmitting.value = false;
  }
};

const resetBorrowableStudentForm = () => {
  borrowableStudentForm.value = {
    studentName: "",
    studentId: "",
    class: "",
    borrowDate: "",
    returnDate: "",
  };
};

const resetBorrowableTeacherForm = () => {
  borrowableTeacherForm.value = {
    teacherName: "",
    employeeId: "",
    department: "",
    borrowDate: "",
    returnDate: "",
  };
};

const resetConsumableStudentForm = () => {
  consumableStudentForm.value = {
    studentName: "",
    studentId: "",
    class: "",
    quantity: 1,
    usageDate: "",
  };
};

const resetConsumableTeacherForm = () => {
  consumableTeacherForm.value = {
    teacherName: "",
    employeeId: "",
    department: "",
    quantity: 1,
    usageDate: "",
  };
};

const resetSelections = () => {
  selectedItemType.value = "";
  selectedBorrowerType.value = "";
};

// Other existing variables and functions
const isSubmitting = ref(false);
const selectedItems = ref([]);
const selectAll = ref(false);
const alertError = ref(false);
const alertSuccess = ref(false);
const alertWarning = ref(false);
const alertMessage = ref("");
const pending = ref(false);

const toggleAll = () => {
  if (selectAll.value) {
    selectedItems.value = unitItemStore.unitItems.map((item) => item.id);
  } else {
    selectedItems.value = [];
  }
};

const openModalUpdate = (item) => {
  console.log("Update item:", item);
};

const openModalDelete = (item) => {
  console.log("Delete item:", item);
};

const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  const day = date.getDate();
  const month = date.toLocaleString("en-US", { month: "short" });
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
};

definePageMeta({
  title: "Inventory",
});

const breadcrumbs = [
  {
    label: "Manage Inventory",
    icon: IconsNavbarIconsFile,
  },
  {
    label: "Create Borrowing",
    icon: IconsNavbarIconsAddItem,
  },
  {
    label: "Print Selected",
    icon: IconsNavbarIconsPrint,
  },
  {
    label: "Sort by Type",
    icon: IconsNavbarIconsFilterMajor,
  },
  {
    label: "Sort by Time",
    icon: IconsNavbarIconsFilterRole,
  },
];

const openModalFromBreadcrumb = (item) => {
  if (item.label === "Create Borrowing") {
    openModalFormBorrowing();
  }
};
</script>
