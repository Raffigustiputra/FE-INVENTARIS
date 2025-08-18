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
      <SearchBox
        :text="'Search Borrowed Items'"
        v-model="searchQuery"
        @input="handleSearch"
      />
    </div>
  </div>

  <!-- Universal Modal -->
  <div class="w-full">
    <Transition name="fade">
      <div
        v-if="currentModal"
        class="fixed top-0 left-0 z-40 flex items-center justify-center w-full h-screen bg-black/30"
      >
        <Modal
          @btnSubmit="handleSubmit"
          @btnClose="closeModal"
          :title="getModalTitle()"
          :isSubmitting="isSubmitting"
          :disableSubmit="!isFormValid()"
          :showActions="!isPreviewData"
          class="max-h-[90vh] overflow-y-auto"
        >
          <!-- Initial Selection Form -->
          <div v-if="currentModal === 'selection'">
            <div>
              <label
                class="ml-0.5 mt-3 block text-sm font-medium text-[#727272]"
              >
                Item Type
              </label>
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
              <label
                class="ml-0.5 mt-5 block text-sm font-medium text-[#727272]"
              >
                Select Borrower's
              </label>
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
              <p
                v-if="formErrors.borrowerType"
                class="text-red-500 text-xs mt-1"
              >
                {{ formErrors.borrowerType }}
              </p>
            </div>
            <div v-if="formErrors.general" class="text-red-500 text-sm mb-3">
              {{ formErrors.general }}
            </div>
          </div>

          <!-- Borrowable Student Form -->
          <div
            v-if="
              currentModal === 'borrowable-student' ||
              currentModal === 'return-borrowable-student'
            "
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
                      :isDisabled="
                        isPreviewData ||
                        currentModal === 'return-borrowable-student'
                      "
                    />
                    <button
                      v-if="!isPreviewData"
                      class="absolute cursor-pointer inset-y-0 right-0 top-7 flex items-center pr-2"
                      @click="getUnitItemData(unitItem.code)"
                      :disabled="
                        isPreviewData ||
                        currentModal === 'return-borrowable-student'
                      "
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
                    unitItem.status === 'unavailable' &&
                    currentModal === 'borrowable-student'
                  "
                >
                  <p class="text-red-500 text-sm">
                    Item is currently unavailable
                  </p>
                </div>
              </div>
              <div>
                <p class="text-sm font-medium text-[#AAA] mb-2">
                  BORROWER INFO
                </p>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-x-4">
                  <div class="relative flex items-center gap-2">
                    <InputText
                      label="NIS"
                      placeholder="NIS"
                      v-model="studentData.nis"
                      @keydown.enter="getStudentData(studentData.nis)"
                      :isDisabled="
                        isPreviewData ||
                        currentModal === 'return-borrowable-student'
                      "
                    />
                    <button
                      v-if="!isPreviewData"
                      class="absolute cursor-pointer inset-y-0 right-0 top-7 flex items-center pr-2"
                      @click="getStudentData(studentData.nis)"
                      :disabled="
                        isPreviewData ||
                        currentModal === 'return-borrowable-student'
                      "
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
                    value="BKP"
                    v-model="selectedCollateralType"
                    :disabled="
                      isPreviewData ||
                      currentModal === 'return-borrowable-student'
                    "
                  />
                  <InputRadio
                    class="mt-5"
                    valueName="Student Card"
                    name="collateralType"
                    value="kartu pelajar"
                    v-model="selectedCollateralType"
                    :disabled="
                      isPreviewData ||
                      currentModal === 'return-borrowable-student'
                    "
                  />
                </div>
                <div class="flex gap-4">
                  <div class="w-1/2">
                    <InputFile
                      label="Upload Warranty"
                      :preview="imagePreview"
                      @update:file="handleFileInput"
                      :disabled="
                        isPreviewData ||
                        currentModal === 'return-borrowable-student'
                      "
                    />
                  </div>
                  <div class="w-1/2">
                    <InputText
                      label="Room"
                      placeholder="Enter Room"
                      class="mb-2"
                      v-model="formData.room"
                      :isDisabled="
                        isPreviewData ||
                        currentModal === 'return-borrowable-student'
                      "
                    />
                    <InputTextarea
                      label="Description"
                      v-model="formData.purpose"
                      :rows="3"
                      :disabled="
                        isPreviewData ||
                        currentModal === 'return-borrowable-student'
                      "
                    />
                    <InputDate
                      v-if="currentModal === 'return-borrowable-student'"
                      label="Return Time"
                      type="datetime-local"
                      v-model="formData.returnDate"
                    />
                  </div>
                </div>
                <div class="flex gap-4">
                  <InputDate
                    label="Date - Pick Up Time"
                    type="datetime-local"
                    v-model="formData.borrowDate"
                    :disabled="
                      isPreviewData ||
                      currentModal === 'return-borrowable-student'
                    "
                  />
                  <InputText
                    label="Lender's Name"
                    placeholder="Enter Lender's Name"
                    v-model="formData.borrowerName"
                    :isDisabled="
                      isPreviewData ||
                      currentModal === 'return-borrowable-student'
                    "
                  />
                </div>
              </div>
            </div>
            <div class="mt-6 flex items-center gap-2" v-if="!isPreviewData">
              <input
                type="checkbox"
                id="confirmData"
                v-model="termsAccepted"
                class="form-checkbox h-4 w-4 text-blue-600 transition duration-150 ease-in-out"
                :disabled="isPreviewData"
              />
              <label
                for="confirmData"
                class="text-sm text-gray-700 select-none"
              >
                Make sure the data is correct
              </label>
            </div>
          </div>

          <!-- Borrowable Teacher Form -->
          <div
            v-if="
              currentModal === 'borrowable-teacher' ||
              currentModal === 'return-borrowable-teacher'
            "
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
                      :isDisabled="
                        isPreviewData ||
                        currentModal === 'return-borrowable-teacher'
                      "
                    />
                    <button
                      v-if="!isPreviewData"
                      class="absolute cursor-pointer inset-y-0 right-0 top-7 flex items-center pr-2"
                      @click="getUnitItemData(unitItem.code)"
                      :disabled="
                        isPreviewData ||
                        currentModal === 'return-borrowable-teacher'
                      "
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
                    unitItem.status === 'unavailable' &&
                    currentModal === 'borrowable-student'
                  "
                >
                  <p class="text-red-500 text-sm">
                    Item is currently unavailable
                  </p>
                </div>
              </div>
              <div>
                <p class="text-sm font-medium text-[#AAA] mb-2">
                  BORROWER INFO
                </p>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-x-4">
                  <div class="relative flex items-center gap-2">
                    <InputText
                      label="NIP"
                      placeholder="NIP"
                      v-model="teacherData.nip"
                      @keydown.enter="getTeacherData(teacherData.nip)"
                      :isDisabled="
                        isPreviewData ||
                        currentModal === 'return-borrowable-teacher'
                      "
                    />
                    <button
                      v-if="!isPreviewData"
                      class="absolute cursor-pointer inset-y-0 right-0 top-7 flex items-center pr-2"
                      @click="getTeacherData(teacherData.nip)"
                      :disabled="
                        isPreviewData ||
                        currentModal === 'return-borrowable-teacher'
                      "
                    >
                      <IconsSearchIcon />
                    </button>
                  </div>
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
              <p class="text-sm font-medium text-[#AAA] mb-4">COLLATERAL</p>
              <div>
                <InputText
                  label="Room"
                  placeholder="Enter Room"
                  class="mb-2"
                  v-model="formData.room"
                  :isDisabled="
                    isPreviewData ||
                    currentModal === 'return-borrowable-teacher'
                  "
                />
                <InputTextarea
                  label="Description"
                  v-model="formData.purpose"
                  :rows="3"
                  :disabled="
                    isPreviewData ||
                    currentModal === 'return-borrowable-teacher'
                  "
                />
                <InputDate
                  v-if="currentModal === 'return-borrowable-teacher'"
                  label="Return Time"
                  type="datetime-local"
                  v-model="formData.returnDate"
                />
                <div class="flex gap-4">
                  <InputDate
                    label="Date - Pick Up Time"
                    type="datetime-local"
                    v-model="formData.borrowDate"
                    :disabled="
                      isPreviewData ||
                      currentModal === 'return-borrowable-teacher'
                    "
                  />
                  <InputText
                    label="Lender's Name"
                    placeholder="Enter Lender's Name"
                    v-model="formData.borrowerName"
                    :isDisabled="
                      isPreviewData ||
                      currentModal === 'return-borrowable-teacher'
                    "
                  />
                </div>
              </div>
            </div>
            <div class="mt-6 flex items-center gap-2" v-if="!isPreviewData">
              <input
                type="checkbox"
                id="confirmData"
                v-model="termsAccepted"
                class="form-checkbox h-4 w-4 text-blue-600 transition duration-150 ease-in-out"
                :disabled="isPreviewData"
              />
              <label
                for="confirmData"
                class="text-sm text-gray-700 select-none"
              >
                Make sure the data is correct
              </label>
            </div>
          </div>

          <!-- Consumable Student Form -->
          <div v-if="currentModal === 'consumable-student'">
            <div class="space-y-4">
              <div>
                <p class="text-sm font-medium text-[#AAA] mb-2">
                  ITEMS DETAILS
                </p>
                <InputSelect
                  placeholder="Select Item"
                  v-model="loanStore.loan"
                  class="w-1/2"
                  label="Name"
                >
                  <option value="superadmin">Super Admin</option>
                  <option value="admin">Admin</option>
                  <option value="user">User</option>
                </InputSelect>
                <div class="flex gap-4">
                  <InputNumber
                    v-model="formData.quantity"
                    class="mt-1 w-full"
                    label="Quantity"
                    placeholder="Enter Quantity"
                  />
                  <InputText
                    label="Unit (pcs/pack)"
                    v-model="formData.itemName"
                    class="mt-1 w-full"
                    placeholder="Enter unit"
                  />
                </div>
              </div>
              <div>
                <p class="text-sm font-medium text-[#AAA] mb-2">
                  BORROWER INFO
                </p>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-x-4">
                  <div class="relative flex items-center gap-2">
                    <InputText
                      label="NIS"
                      placeholder="NIS"
                      v-model="studentData.nis"
                      @keydown.enter="getStudentData(studentData.nis)"
                      :isDisabled="
                        isPreviewData ||
                        currentModal === 'return-borrowable-student'
                      "
                    />
                    <button
                      v-if="!isPreviewData"
                      class="absolute cursor-pointer inset-y-0 right-0 top-7 flex items-center pr-2"
                      @click="getStudentData(studentData.nis)"
                      :disabled="
                        isPreviewData ||
                        currentModal === 'return-borrowable-student'
                      "
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
              <div class="">
                <div class="flex gap-4">
                  <InputDate
                  label="Date - Pick Up Time"
                  type="datetime-local"
                  v-model="formData.borrowDate"
                  :disabled="
                    isPreviewData ||
                    currentModal === 'return-borrowable-teacher'
                  "
                />
                <InputText
                  label="Lender's Name"
                  placeholder="Enter Lender's Name"
                  v-model="formData.borrowerName"
                  :isDisabled="
                    isPreviewData ||
                    currentModal === 'return-borrowable-teacher'
                  "
                />
                </div>
                <InputDate
                  label="Return Time"
                  type="datetime-local"
                  v-model="formData.returnDate"
                />
              </div>
            </div>
            <div class="mt-6 flex items-center gap-2" v-if="!isPreviewData">
              <input
                type="checkbox"
                id="confirmData"
                v-model="termsAccepted"
                class="form-checkbox h-4 w-4 text-blue-600 transition duration-150 ease-in-out"
                :disabled="isPreviewData"
              />
              <label
                for="confirmData"
                class="text-sm text-gray-700 select-none"
              >
                Make sure the data is correct
              </label>
            </div>
          </div>

          <!-- Consumable Teacher Form -->
          <div v-if="currentModal === 'consumable-teacher'">
            <div class="space-y-4">
              <div>
                <p class="text-sm font-medium text-[#AAA] mb-2">
                  ITEMS DETAILS
                </p>
                <InputSelect
                  placeholder="Select Item"
                  v-model="loanStore.loan"
                  class="w-1/2"
                  label="Name"
                >
                  <option value="superadmin">Super Admin</option>
                  <option value="admin">Admin</option>
                  <option value="user">User</option>
                </InputSelect>
                <div class="flex gap-4">
                  <InputNumber
                    v-model="formData.quantity"
                    class="mt-1 w-full"
                    label="Quantity"
                    placeholder="Enter Quantity"
                  />
                  <InputText
                    label="Unit (pcs/pack)"
                    v-model="formData.itemName"
                    class="mt-1 w-full"
                    placeholder="Enter unit"
                  />
                </div>
              </div>
              <div>
                <p class="text-sm font-medium text-[#AAA] mb-2">
                  BORROWER INFO
                </p>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-x-4">
                  <div class="relative flex items-center gap-2">
                    <InputText
                      label="NIP"
                      placeholder="NIP"
                      v-model="teacherData.nip"
                      @keydown.enter="getTeacherData(teacherData.nip)"
                      :isDisabled="
                        isPreviewData ||
                        currentModal === 'return-borrowable-teacher'
                      "
                    />
                    <button
                      v-if="!isPreviewData"
                      class="absolute cursor-pointer inset-y-0 right-0 top-7 flex items-center pr-2"
                      @click="getTeacherData(teacherData.nip)"
                      :disabled="
                        isPreviewData ||
                        currentModal === 'return-borrowable-teacher'
                      "
                    >
                      <IconsSearchIcon />
                    </button>
                  </div>
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
              <div class="flex gap-4">
                <InputDate
                  label="Date - Pick Up Time"
                  type="datetime-local"
                  v-model="formData.borrowDate"
                  :disabled="
                    isPreviewData ||
                    currentModal === 'return-borrowable-teacher'
                  "
                />
                <InputText
                  label="Lender's Name"
                  placeholder="Enter Lender's Name"
                  v-model="formData.borrowerName"
                  :isDisabled="
                    isPreviewData ||
                    currentModal === 'return-borrowable-teacher'
                  "
                />
              </div>
            </div>
            <div class="mt-6 flex items-center gap-2" v-if="!isPreviewData">
              <input
                type="checkbox"
                id="confirmData"
                v-model="termsAccepted"
                class="form-checkbox h-4 w-4 text-blue-600 transition duration-150 ease-in-out"
                :disabled="isPreviewData"
              />
              <label
                for="confirmData"
                class="text-sm text-gray-700 select-none"
              >
                Make sure the data is correct
              </label>
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
                <IconsReturn @click="openReturnModal(item)" />
              </div>
            </Tooltip>
            <Tooltip text="Detail" position="top">
              <div
                class="bg-[#c89513] p-1.5 rounded-md flex justify-center items-center hover:cursor-pointer"
              >
                <IconsDetail @click="openDetailModal(item)" />
              </div>
            </Tooltip>
          </td>
        </tr>
      </tbody>
    </table>
    <p class="text-xs text-gray-500 mt-3 ml-2"></p>
  </div>
  <div class="flex items-center justify-between mt-4">
    <p class="text-xs text-gray-500">
      Showing {{ loanStore.loan.length }} of {{ allLoanCount }} Data
    </p>
    <Pagination
      :currentPage="currentPage"
      :lastPage="lastPage"
      :paginationItems="paginationItems"
      @prev="prevPage"
      @next="nextPage"
      @change="changePage"
    />
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useLoanStore } from "~/stores/loan";
import { useAuthStore } from "~/stores/auth";
import {
  IconsNavbarIconsAddItem,
  IconsNavbarIconsFile,
  IconsNavbarIconsFilterMajor,
  IconsNavbarIconsFilterRole,
  IconsNavbarIconsPrint,
} from "#components";

// Store references
const loanStore = useLoanStore();
const authStore = useAuthStore();
const url = useRuntimeConfig().public.authUrl;

// Modal state
const currentModal = ref(null);
const isSubmitting = ref(false);

// Form states
const selectedItemType = ref("");
const selectedBorrowerType = ref("");
const selectedCollateralType = ref("");
const termsAccepted = ref(false);
const imagePreview = ref("");

// Universal form data object
const formData = ref({
  // Borrowable
  id: "",
  unitItemId: "",
  studentId: "",
  teacherId: "",
  borrowerName: "",
  borrowDate: new Date()
    .toLocaleString("sv-SE", { timeZone: "Asia/Jakarta" })
    .slice(0, 16),
  returnDate: new Date()
    .toLocaleString("sv-SE", { timeZone: "Asia/Jakarta" })
    .slice(0, 16),
  purpose: "",
  room: "",
  guarantee: "",
  image: "",

  // Teacher forms
  teacherName: "",
  employeeId: "",
  department: "",

  // Student forms
  studentName: "",
  class: "",

  // Consumable forms
  quantity: 1,
  usageDate: "",
});

// Data objects
const studentData = ref({
  nis: "",
  name: "",
  rayon: "",
  majorId: "",
  majorName: "",
});

const teacherData = ref({
  nip: "",
  name: "",
  telephone: "",
});

const unitItem = ref({
  code: "",
  name: "",
  brand: "",
  condition: "",
  type: "",
  status: "",
});

// Form validation state
const formErrors = ref({
  itemType: "",
  borrowerType: "",
  general: "",
});

// Other states
const selectedItems = ref([]);
const selectAll = ref(false);
const alertError = ref(false);
const alertSuccess = ref(false);
const alertWarning = ref(false);
const alertMessage = ref("");
const pending = ref(false);
const searchQuery = ref("");
const sortByType = ref("");
const sortByTime = ref("");

// Modal control functions
const openModal = (modalType) => {
  currentModal.value = modalType;
  if (modalType === "selection") {
    resetFormData();
    resetSelections();
  }
};

const closeModal = () => {
  currentModal.value = null;
  isPreviewData.value = false;
  resetFormData();
  resetSelections();
  termsAccepted.value = false;
  imagePreview.value = "";
  formErrors.value = {
    itemType: "",
    borrowerType: "",
    general: "",
  };
};

// Modal helper functions
const getModalTitle = () => {
  const titles = {
    selection: "Form Borrowing",
    "borrowable-student":
      isPreviewData === true ? "Detail Borrowing" : "Form Borrowing",
    "borrowable-teacher":
      isPreviewData === true ? "Detail Borrowing" : "Form Borrowing",
    "consumable-student":
      isPreviewData === true ? "Detail Borrowing" : "Consumable Form - Student",
    "consumable-teacher":
      isPreviewData === true ? "Detail Borrowing" : "Consumable Form - Teacher",
    "return-consumable-student": "Return Consumable - Student",
    "return-consumable-teacher": "Return Consumable - Teacher",
    "return-borrowable-student": "Return Borrowable - Student",
    "return-borrowable-teacher": "Return Borrowable - Teacher",
    return: "Return Borrowing",
    preview: "Detail Borrowing",
  };
  return titles[currentModal.value] || "Form";
};

const needsScroll = () => {
  return ["borrowable-student", "return", "preview"].includes(
    currentModal.value
  );
};

const isFormValid = () => {
  switch (currentModal.value) {
    case "selection":
      return selectedItemType.value && selectedBorrowerType.value;
    case "borrowable-student":
      return termsAccepted.value && unitItem.value.status !== "unavailable";
    case "preview":
      return false;
    case "borrowable-teacher":
      return termsAccepted.value && unitItem.value.status !== "unavailable";
    case "return-borrowable-student":
      return formData.value.returnDate && termsAccepted.value;
    case "return-borrowable-teacher":
      return formData.value.returnDate && termsAccepted.value;
    case "consumable-student":
      return formData.value.studentName && formData.value.studentId;
    case "consumable-teacher":
      return formData.value.teacherName && formData.value.employeeId;
    default:
      return true;
  }
};

// Form submission handler
const handleSubmit = async () => {
  if (currentModal.value === "selection") {
    handleSelectionSubmit();
  } else {
    await submitForm();
  }
};

const handleSelectionSubmit = () => {
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

  // Determine next modal
  const nextModal = `${selectedItemType.value}-${selectedBorrowerType.value}`;
  currentModal.value = nextModal;

  if (
    nextModal === "borrowable-student" ||
    nextModal === "borrowable-teacher"
  ) {
    resetBorrowableData();
  } else {
    resetConsumableData();
  }
};

const submitForm = async () => {
  isSubmitting.value = true;

  try {
    switch (currentModal.value) {
      case "borrowable-student":
        await submitBorrowableStudent();
        break;
      case "return-borrowable-student":
        await submitReturn();
        break;
      case "borrowable-teacher":
        await submitBorrowableTeacher();
        break;
      case "return-borrowable-teacher":
        await submitReturn();
        break;
      case "consumable-student":
        await submitConsumableStudent();
        break;
      case "consumable-teacher":
        await submitConsumableTeacher();
        break;
    }
  } catch (error) {
    alertError.value = true;
    alertMessage.value = "An error occurred while submitting the form";
  } finally {
    isSubmitting.value = false;
  }
};

// Individual submit functions
const submitBorrowableStudent = async () => {
  const formDataToSend = new FormData();
  formDataToSend.append("unit_item_id", formData.value.unitItemId);
  formDataToSend.append("student_id", formData.value.studentId);
  formDataToSend.append("borrowed_by", formData.value.borrowerName);
  formDataToSend.append("borrowed_at", formData.value.borrowDate);
  formDataToSend.append("purpose", formData.value.purpose);
  formDataToSend.append("room", formData.value.room);
  formDataToSend.append("guarantee", selectedCollateralType.value);

  if (formData.value.image) {
    formDataToSend.append("image", formData.value.image);
  }

  const response = await fetch(`${url}/unit-loan`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${authStore.token}`,
    },
    body: formDataToSend,
  });

  if (response.ok) {
    alertSuccess.value = true;
    if (currentModal.value === "return") {
      alertMessage.value = "Return date submitted successfully!";
    } else {
      alertMessage.value = "Borrowable form submitted successfully!";
    }
    closeModal();
    getUnitLoan();
  } else {
    alertError.value = true;
    alertMessage.value = "Failed to submit return date";
  }
};

const submitBorrowableTeacher = async () => {
  const formDataToSend = new FormData();
  formDataToSend.append("unit_item_id", formData.value.unitItemId);
  formDataToSend.append("teacher_id", formData.value.teacherId);
  formDataToSend.append("borrowed_by", formData.value.borrowerName);
  formDataToSend.append("borrowed_at", formData.value.borrowDate);
  formDataToSend.append("purpose", formData.value.purpose);
  formDataToSend.append("room", formData.value.room);

  const response = await fetch(`${url}/unit-loan`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${authStore.token}`,
    },
    body: formDataToSend,
  });

  if (response.ok) {
    alertSuccess.value = true;
    alertMessage.value = "Return date submitted successfully!";
    closeModal();
    getUnitLoan();
  } else {
    alertError.value = true;
    alertMessage.value = "Failed to submit return date";
  }
};

const submitConsumableStudent = async () => {
  if (!formData.value.studentName || !formData.value.studentId) {
    alertError.value = true;
    alertMessage.value = "Please fill in required fields";
    return;
  }

  console.log("Consumable Student Form Data:", formData.value);

  alertSuccess.value = true;
  alertMessage.value = "Consumable form for student submitted successfully!";
  closeModal();
};

const submitConsumableTeacher = async () => {
  if (!formData.value.teacherName || !formData.value.employeeId) {
    alertError.value = true;
    alertMessage.value = "Please fill in required fields";
    return;
  }

  console.log("Consumable Teacher Form Data:", formData.value);

  alertSuccess.value = true;
  alertMessage.value = "Consumable form for teacher submitted successfully!";
  closeModal();
};

// Reset functions
const resetFormData = () => {
  formData.value = {
    id: "",
    unitItemId: "",
    studentId: "",
    teacherId: "",
    borrowerName: "",
    borrowDate: new Date()
      .toLocaleString("sv-SE", { timeZone: "Asia/Jakarta" })
      .slice(0, 16),
    returnDate: new Date()
      .toLocaleString("sv-SE", { timeZone: "Asia/Jakarta" })
      .slice(0, 16),
    purpose: "",
    room: "",
    guarantee: "",
    image: "",
    teacherName: "",
    employeeId: "",
    department: "",
    studentName: "",
    class: "",
    quantity: 1,
    usageDate: "",
  };
};

const resetBorrowableData = () => {
  studentData.value = {
    nis: "",
    name: "",
    rayon: "",
    majorId: "",
    majorName: "",
  };

  teacherData.value = {
    nip: "",
    name: "",
    telephone: "",
  };

  unitItem.value = {
    code: "",
    name: "",
    brand: "",
    condition: "",
    type: "",
    status: "",
  };

  selectedCollateralType.value = "";
  termsAccepted.value = false;
};

const resetSelections = () => {
  selectedItemType.value = "";
  selectedBorrowerType.value = "";
};

let timeoutFiltering = null;

const handleSearch = () => {
  pending.value = true;
  if (timeoutFiltering) {
    clearTimeout(timeoutFiltering);
  }

  timeoutFiltering = setTimeout(() => {
    getUnitLoan();
  }, 500);
};

const handleSort = (type) => {
  if (type === "type") {
    sortByType.value = sortByType.value === "asc" ? "desc" : "asc";
    sortByTime.value = "";
  } else if (type === "time") {
    sortByTime.value = sortByTime.value === "asc" ? "desc" : "asc";
    sortByType.value = "";
  } else {
    sortByType.value = "";
    sortByTime.value = "";
  }
  getUnitLoan();
};

let allLoanCount = ref(0);
const lastPage = ref(0);
const currentPage = ref(1);
const maxVisiblePages = 3;

// API functions
const getUnitLoan = async () => {
  try {
    pending.value = true;
    const response = await fetch(
      `${url}/unit-loan/history?sort_by_type=${sortByType.value}&sort_by_time=${sortByTime.value}&search=${searchQuery.value}&data=borrowing&page=${currentPage.value}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authStore.token}`,
        },
      }
    );

    if (response.ok) {
      const result = await response.json();
      if (result.data) {
        loanStore.loan = result.data;
        lastPage.value = result.meta.last_page;
        allLoanCount.value = result.meta.total;
      } else {
        loanStore.loan = result;
        lastPage.value = result.meta.last_page;
        allLoanCount.value = result.meta.total;
      }
    } else {
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

      if (data) {
        studentData.value = {
          nis: data.nis,
          name: data.name,
          rayon: data.rayon,
          majorId: data.major?.name || data.major_id || "",
          majorName: data.major?.name || "",
        };
        formData.value.studentId = data.id || "";
      } else {
        studentData.value = {
          nis: nis,
          name: "",
          rayon: "",
          majorId: "",
          majorName: "",
        };
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

const getTeacherData = async (nip) => {
  try {
    const response = await fetch(`${url}/teacher?search=${nip}`, {
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
        teacherData.value = {
          nip: data.nip || "",
          name: data.name || "",
          telephone: data.telephone || "",
        };
        formData.value.teacherId = data.id || "";
      } else {
        teacherData.value = {
          nip: "",
          name: "",
          telephone: "",
        };
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

      if (result.is_borrowed) {
        alertWarning.value = true;
        alertMessage.value = `Item is already borrowed by ${
          result.data.student?.name || result.data.teacher?.name || "unknown"
        } on ${formatDate(result.data.borrowed_at)}`;
        return null;
      }

      const data = Array.isArray(result.data) ? result.data[0] : result.data;

      if (data) {
        unitItem.value = {
          code: data.code_unit || data.unit_item.code_unit || "",
          brand: data.sub_item.merk || data.unit_item.sub_item?.merk || "",
          condition: data.condition || data.unit_item.condition || "",
          type:
            data.sub_item.item.name ||
            data.unit_item.sub_item?.item?.name ||
            "",
          status: data.status || data.unit_item.status || "",
        };
        formData.value.unitItemId = data.id || "";
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

const getDetailUnitItem = async (item) => {
  try {
    const data = item;

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

      teacherData.value = {
        nip: data.teacher?.nip || "",
        name: data.teacher?.name || "",
        telephone: data.teacher?.telephone || "",
      };

      formData.value = {
        ...formData.value,
        id: data.id || "",
        unitItemId: data.unit_item?.id || "",
        studentId: data.student?.id || "",
        teacherId: data.teacher?.id || "",
        borrowerName: data.borrowed_by || "",
        borrowDate: data.borrowed_at || "",
        purpose: data.purpose || "",
        room: data.room || "",
        guarantee: data.guarantee || "",
        image: data.image || "",
      };

      selectedCollateralType.value = data.guarantee || "";
      imagePreview.value = data.image || "";
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

// Event handlers
const handleFileInput = (file) => {
  formData.value.image = file;
  imagePreview.value = file ? URL.createObjectURL(file) : "";
};

let isPreviewData = ref(false);

const openDetailModal = async (item) => {
  isPreviewData.value = true;
  const data = await getDetailUnitItem(item);

  if (!data) return;

  const isConsumable = !!data.quantity;
  const isBorrowable = !isConsumable;

  const isStudent = !!data.student?.id;
  const isTeacher = !!data.teacher?.id;

  if (isConsumable) {
    currentModal.value = isStudent
      ? "consumable-student"
      : "consumable-teacher";
  } else if (isBorrowable) {
    currentModal.value = isStudent
      ? "borrowable-student"
      : "borrowable-teacher";
  }
};

const openReturnModal = async (item) => {
  const data = await getDetailUnitItem(item);

  if (!data) return;

  const isConsumable = !!data.quantity;
  const isBorrowable = !isConsumable;

  const isStudent = !!data.student?.id;
  const isTeacher = !!data.teacher?.id;

  if (isConsumable) {
    currentModal.value = isStudent
      ? "return-consumable-student"
      : "return-consumable-teacher";
  } else if (isBorrowable) {
    currentModal.value = isStudent
      ? "return-borrowable-student"
      : "return-borrowable-teacher";
  }
};

const toggleAll = () => {
  if (selectAll.value) {
    selectedItems.value = loanStore.loan.map((item) => item.id);
  } else {
    selectedItems.value = [];
  }
};

const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  const day = date.getDate();
  const month = date.toLocaleString("en-US", { month: "short" });
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
};

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
    click: () => handleSort("type"),
  },
  {
    label: "Sort by Time",
    icon: IconsNavbarIconsFilterRole,
    click: () => handleSort("time"),
  },
];

const openModalFromBreadcrumb = (item) => {
  if (item.label === "Create Borrowing") {
    openModal("selection");
  }
};

const paginationItems = computed(() => {
  const pages = [];
  const halfVisible = Math.floor(maxVisiblePages / 2);

  if (currentPage.value > lastPage.value) {
    currentPage.value = 1;
  }

  if (lastPage.value <= maxVisiblePages) {
    for (let i = 1; i <= lastPage.value; i++) {
      pages.push(i);
    }
  } else {
    if (currentPage.value <= halfVisible + 1) {
      for (let i = 1; i <= maxVisiblePages - 1; i++) {
        pages.push(i);
      }
      pages.push("...");
      pages.push(lastPage.value);
    } else if (currentPage.value >= lastPage.value - halfVisible) {
      pages.push(1);
      pages.push("...");
      for (
        let i = lastPage.value - (maxVisiblePages - 2);
        i <= lastPage.value;
        i++
      ) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      pages.push("...");
      for (
        let i = currentPage.value - halfVisible + 1;
        i <= currentPage.value + halfVisible - 1;
        i++
      ) {
        pages.push(i);
      }
      pages.push("...");
      pages.push(lastPage.value);
    }
  }
  return pages;
});

const nextPage = async () => {
  if (currentPage.value < lastPage.value) {
    currentPage.value++;
    pending.value = true;
    nextTick(() => {
      getHistoryData();
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: "smooth",
      });
    });
  }
};

const prevPage = async () => {
  if (currentPage.value > 1) {
    currentPage.value--;
    pending.value = true;
    nextTick(() => {
      getHistoryData();
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: "smooth",
      });
    });
  }
};

const changePage = async (page) => {
  if (page !== "...") {
    currentPage.value = page;
    pending.value = true;
  }
  nextTick(() => {
    getHistoryData();
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "smooth",
    });
  });
};

// Page metadata
definePageMeta({
  title: "Inventory",
});

// Lifecycle
onMounted(() => {
  getUnitLoan();
});

const submitReturn = async () => {
  const response = await fetch(`${url}/unit-loan/${formData.value.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authStore.token}`,
    },
    body: JSON.stringify({
      returned_at: formData.value.returnDate,
    }),
  });

  if (response.ok) {
    alertSuccess.value = true;
    alertMessage.value = "Return date submitted successfully!";
    closeModal();
    getUnitLoan();
  } else {
    alertError.value = true;
    alertMessage.value = "Failed to submit return date";
  }
};

watch([alertError, alertSuccess, alertWarning], ([error, success, warning]) => {
  if (error || success || warning) {
    setTimeout(() => {
      alertError.value = false;
      alertSuccess.value = false;
      alertWarning.value = false;
    }, 3000);
  }
});
</script>
