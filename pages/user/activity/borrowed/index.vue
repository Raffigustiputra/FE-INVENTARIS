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
          :title="
            isPreview
              ? 'Detail Borrowing'
              : isReturn
              ? 'Return Borrowing'
              : 'Form Borrowing'
          "
          @btnSubmit="submitBorrowableStudent"
          :isSubmitting="isSubmitting"
          :disableSubmit="!termsAccepted || isPreview"
          :showActions="!isPreview"
          class="max-h-[90vh] overflow-y-auto"
        >
          <div class="space-y-6">
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
                    @keydown.enter="getUnitItemData(unitItem.code)"
                    :isDisabled="isPreview | isReturn"
                  />
                  <button
                    v-if="!isPreview"
                    class="absolute cursor-pointer inset-y-0 right-0 top-7 flex items-center pr-2"
                    @click="getUnitItemData(unitItem.code)"
                    :disabled="isPreview | isReturn"
                  >
                    <IconsSearchIcon />
                  </button>
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
              <div
                v-if="
                  unitItem.status === 'unavailable' && !isPreview && !isReturn
                "
              >
                <p class="text-red-500 text-sm">
                  Item is currently unavailable
                </p>
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
                    @keydown.enter="getStudentData(studentData.nis)"
                    :isDisabled="isPreview | isReturn"
                  />
                  <button
                    v-if="!isPreview"
                    class="absolute cursor-pointer inset-y-0 right-0 top-7 flex items-center pr-2"
                    @click="getStudentData(studentData.nis)"
                    :disabled="isPreview | isReturn"
                  >
                    <IconsSearchIcon />
                  </button>
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
            <p class="text-sm font-medium text-[#AAA] mb-4">COLLATERAL</p>
            <div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                <InputRadio
                  label="Warranty"
                  valueName="BKP"
                  name="collateralType"
                  value="bkp"
                  v-model="selectedCollateralType"
                  :disabled="isPreview | isReturn"
                />
                <InputRadio
                  class="mt-5"
                  valueName="Student Card"
                  name="collateralType"
                  value="kartu pelajar"
                  v-model="selectedCollateralType"
                  :disabled="isPreview | isReturn"
                />
              </div>
              <div class="flex gap-4">
                <div class="w-1/2">
                  <InputFile
                    label="Upload Warranty"
                    :preview="imagePreview"
                    @update:file="handleFileInput"
                    :disabled="isPreview | isReturn"
                  />
                </div>
                <div class="w-1/2">
                  <InputText
                    label="Room"
                    placeholder="Enter Room"
                    class="mb-2"
                    v-model="borrowableStudentForm.room"
                    :isDisabled="isPreview | isReturn"
                  />
                  <InputTextarea
                    label="Description"
                    valueName="Student Card"
                    name="collateralType"
                    value="student_card"
                    v-model="borrowableStudentForm.purpose"
                    :rows="3"
                    :disabled="isPreview | isReturn"
                  />
                  <InputDate
                    v-if="isReturn"
                    label="Return Time"
                    type="datetime-local"
                    v-model="borrowableStudentForm.returnDate"
                  />
                </div>
              </div>
              <div class="flex gap-4">
                <InputDate
                  label="Date - Pick Up Time"
                  type="datetime-local"
                  v-model="borrowableStudentForm.borrowDate"
                  :disabled="isPreview | isReturn"
                />
                <InputText
                  label="Lender's Name"
                  placeholder="Enter Lender's Name"
                  v-model="borrowableStudentForm.borrowerName"
                  :isDisabled="isPreview | isReturn"
                />
              </div>
            </div>
          </div>
          <div class="mt-6 flex items-center gap-2" v-if="!isPreview">
            <input
              type="checkbox"
              id="confirmDataBorrowableStudent"
              v-model="termsAccepted"
              class="form-checkbox h-4 w-4 text-blue-600 transition duration-150 ease-in-out"
              :disabled="isPreview"
            />
            <label
              for="confirmDataBorrowableStudent"
              class="text-sm text-gray-700 select-none"
            >
              Make sure the data is correct
            </label>
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
          @btnClose="closeModalBorrowableStudent"
          title="Form Borrowing"
          @btnSubmit="submitBorrowableStudent"
          :isSubmitting="isSubmitting"
          :disableSubmit="!termsAccepted || isPreview"
          :showActions="!isPreview"
          class="max-h-[90vh] overflow-y-auto"
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
          <template v-if="isPreview" #footer>
            <button
              @click="closeModalBorrowableStudent"
              class="border-2 hover:cursor-pointer hover:bg-black/10 duration-200 border-[#D2D2D2] px-3 py-1 text-sm rounded-md font-medium w-full"
            >
              Close
            </button>
          </template>
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
          <td colspan="6" class="px-4 py-3 text-center">
            No loan data available
          </td>
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
            <Tooltip text="Return" position="top">
              <div
                class="bg-blue-400 p-1.5 rounded-md flex justify-center items-center hover:cursor-pointer"
              >
                <IconsReturn @click="openModalReturnBorrowableStudent(item)" />
              </div>
            </Tooltip>
            <Tooltip text="Detail" position="top">
              <div
                class="bg-[#c89513] p-1.5 rounded-md flex justify-center items-center hover:cursor-pointer"
              >
                <IconsDetail @click="openModalDetail(item)" />
              </div>
            </Tooltip>
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
const selectedCollateralType = ref("");
const termsAccepted = ref(false);

const studentData = ref({
  nis: "",
  name: "",
  rayon: "",
  majorId: "",
  majorName: "",
});

const unitItem = ref({
  code: "",
  name: "",
  brand: "",
  condition: "",
  type: "",
});

// Form data
const borrowableStudentForm = ref({
  id: "",
  unitItemId: "",
  studentId: "",
  borrowerName: "",
  borrowDate: "",
  returnDate: "",
  purpose: "",
  room: "",
  guarantee: "",
  image: "",
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

  // Close the first modal
  modalFormBorrowing.value = false;

  // Open appropriate modal based on selections
  if (
    selectedItemType.value === "borrowable" &&
    selectedBorrowerType.value === "student"
  ) {
    resetBorrowableStudentForm();
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
  isPreview.value = false;
  resetBorrowableStudentForm();
  termsAccepted.value = false; // Reset the checkbox when closing the modal
};

const getUnitLoan = async () => {
  try {
    pending.value = true;
    const response = await fetch(`${url}/unit-loan/history?data=borrowing`, {
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
    if (isReturn.value) {
      // Handle return case
      const response = await fetch(
        `${url}/unit-loan/${borrowableStudentForm.value.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authStore.token}`,
          },
          body: JSON.stringify({
            returned_at: borrowableStudentForm.value.returnDate,
          }),
        }
      );

      if (response.ok) {
        alertSuccess.value = true;
        alertMessage.value = "Return date submitted successfully!";
        closeModalBorrowableStudent();
        getUnitLoan();
      } else {
        alertError.value = true;
        alertMessage.value = "Failed to submit return date";
      }
    } else {
      // Handle borrow case
      const formData = new FormData();
      formData.append("unit_item_id", borrowableStudentForm.value.unitItemId);
      formData.append("student_id", borrowableStudentForm.value.studentId);
      formData.append("borrowed_by", borrowableStudentForm.value.borrowerName);
      formData.append("borrowed_at", borrowableStudentForm.value.borrowDate);
      formData.append("purpose", borrowableStudentForm.value.purpose);
      formData.append("room", borrowableStudentForm.value.room);
      formData.append("guarantee", selectedCollateralType.value);
      if (borrowableStudentForm.value.image) {
        formData.append("image", borrowableStudentForm.value.image);
      }

      const response = await fetch(`${url}/unit-loan`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authStore.token}`,
        },
        body: formData,
      });

      if (response.ok) {
        alertSuccess.value = true;
        alertMessage.value =
          "Borrowable form for student submitted successfully!";
        closeModalBorrowableStudent();
        getUnitLoan();
        imagePreview.value = "";
      } else {
        alertError.value = true;
        alertMessage.value = "Failed to submit borrowable form for student";
      }
    }
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
    id: "",
    unitItemId: "",
    studentId: "",
    borrowerName: "",
    borrowDate: "",
    purpose: "",
    returnDate: "",
    room: "",
    guarantee: "",
    image: "",
  };
  selectedCollateralType.value = ""; // Reset collateral type selection
  termsAccepted.value = false; // Reset terms checkbox
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

let timeoutFiltering = null;

const handleStudentData = () => {
  if (timeoutFiltering) {
    clearTimeout(timeoutFiltering);
  }

  timeoutFiltering = setTimeout(() => {
    if (studentData.value.nis) {
      getStudentData(studentData.value.nis);
    }
  }, 500);
};

const handleUnitItem = () => {
  if (timeoutFiltering) {
    clearTimeout(timeoutFiltering);
  }

  timeoutFiltering = setTimeout(() => {
    if (unitItem.value.code) {
      getUnitItemData(unitItem.value.code);
    }
  }, 500);
};

const getStudentData = async (nis) => {
  try {
    const response = await fetch(`${url}/student?search=${nis}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authStore.token}`,
      },
    });

    if (response.ok) {
      const result = await response.json();
      const data = Array.isArray(result.data) ? result.data[0] : result.data;
      console.log("Student Data:", data);
      if (data) {
        studentData.value = {
          nis: data.nis,
          name: data.name,
          rayon: data.rayon,
          majorId: data.major?.name || data.major_id || "",
          majorName: data.major?.name || "",
        };
        borrowableStudentForm.value.studentId = data.id || "";
      } else {
        studentData.value = { nis: nis, name: "", rayon: "", majorId: "", majorName: "" };
      }
      return data;
    } else {
      console.error("Failed to fetch student data:", response.statusText);
      return null;
    }
  } catch (error) {
    console.error("Error fetching student data:", error);
    return null;
  }
};

const getTeacherData = async (employeeId) => {
  try {
    const response = await fetch(`${url}/teacher?search=${employeeId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authStore.token}`,
      },
    });

    if (response.ok) {
      const result = await response.json();
      const data = Array.isArray(result.data) ? result.data[0] : result.data;

      if (data) {
        borrowableTeacherForm.value.teacherName = data.name || "";
        borrowableTeacherForm.value.employeeId = data.employee_id || "";
        borrowableTeacherForm.value.department = data.department || "";
      } else {
        borrowableTeacherForm.value.teacherName = "";
        borrowableTeacherForm.value.employeeId = employeeId;
        borrowableTeacherForm.value.department = "";
      }
      return data;
    } else {
      console.error("Failed to fetch teacher data:", response.statusText);
      return null;
    }
  } catch (error) {
    console.error("Error fetching teacher data:", error);
    return null;
  }
};

const getUnitItemData = async (code) => {
  try {
    const response = await fetch(`${url}/unit-loan/check`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authStore.token}`,
      },
      body: JSON.stringify({ code_unit: code }),
    });

    if (response.ok) {
      const result = await response.json();
      const data = Array.isArray(result.data) ? result.data[0] : result.data;

      if (data) {
        unitItem.value = {
          code: data.code_unit || "",
          brand: data.sub_item.merk || "",
          condition: data.condition || "",
          type: data.sub_item.item.name || "",
          status: data.status || "",
        };
        borrowableStudentForm.value.unitItemId = data.id || "";
      } else {
        unitItem.value = {
          code: code,
          brand: "",
          condition: "",
          type: "",
          status: "",
        };
      }
      return data;
    } else {
      console.error("Failed to fetch unit item data:", response.statusText);
      return null;
    }
  } catch (error) {
    console.error("Error fetching unit item data:", error);
    return null;
  }
};

let isPreview = ref(false);

const getDetailUnitItem = async (id) => {
  try {
    const response = await fetch(`${url}/unit-loan/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authStore.token}`,
      },
    });

    if (response.ok) {
      const result = await response.json();
      const data = Array.isArray(result.data) ? result.data[0] : result.data;

      if (data) {
        unitItem.value = {
          code: data.unit_item.code_unit || "",
          brand: data.unit_item.sub_item?.merk || "",
          condition: data.unit_item.condition || "",
          type: data.unit_item.sub_item?.item?.name || "",
          status: data.unit_item.status || "",
        };
        studentData.value = {
          nis: data.student?.nis || "",
          name: data.student?.name || "",
          rayon: data.student?.rayon || "",
          majorId: data.student?.major?.id || "",
          majorName: data.student?.major?.name || "",
        };
        borrowableStudentForm.value = {
          id: data.id || "",
          unitItemId: data.unit_item?.id || "",
          studentId: data.student?.id || "",
          borrowerName: data.borrowed_by || "",
          borrowDate: data.borrowed_at || "",
          purpose: data.purpose || "",
          room: data.room || "",
          guarantee: data.guarantee || "",
          image: data.image || "",
        };
        selectedCollateralType.value = data.guarantee || "";
        imagePreview.value = data.image || "";
      }
      return data;
    } else {
      console.error("Failed to fetch unit item data:", response.statusText);
      return null;
    }
  } catch (error) {
    console.error("Error fetching unit item data:", error);
    return null;
  }
};

const imagePreview = ref("");
let isReturn = ref(false);

function handleFileInput(file) {
  borrowableStudentForm.value.image = file;
  imagePreview.value = file ? URL.createObjectURL(file) : "";
}

async function openModalDetail(item) {
  isPreview.value = true;
  modalBorrowableStudent.value = true;
  await getDetailUnitItem(item.id);
}

async function openModalReturnBorrowableStudent(item) {
  isReturn.value = true;
  modalBorrowableStudent.value = true;
  await getDetailUnitItem(item.id);
}
</script>
