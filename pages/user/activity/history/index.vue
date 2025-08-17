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
        History
      </h1>
      <SearchBox :text="'Search History'" />
    </div>
  </div>

  <!-- Modal DETAIL BORROWABLE STUDENT -->
  <div class="w-full">
    <Transition name="fade">
      <div
        v-if="modalDetailHistory"
        class="fixed top-0 left-0 z-40 flex items-center justify-center w-full h-screen bg-black/30"
      >
        <Modal
          @btnClose="closeModalDetailHistory"
          :title="
            isPreview
              ? 'Detail Borrowing'
              : isReturn
              ? 'Return Borrowing'
              : 'Form Borrowing'
          "
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
                  v-model="detailUnitItem.type"
                />
                <div class="relative flex items-center gap-2">
                  <InputText
                    label="Unit Code"
                    placeholder="Enter Unit Code"
                    v-model="detailUnitItem.code"
                    :isDisabled="isPreview | isReturn"
                  />
                  <button
                    v-if="!isPreview"
                    class="absolute cursor-pointer inset-y-0 right-0 top-7 flex items-center pr-2"
                    :disabled="isPreview | isReturn"
                  >
                    <IconsSearchIcon />
                  </button>
                </div>
                <InputText
                  label="Brand Name"
                  placeholder="Brand Name"
                  :isDisabled="true"
                  v-model="detailUnitItem.brand"
                />
                <InputText
                  label="Condition"
                  :isDisabled="true"
                  v-model="detailUnitItem.condition"
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
                    v-model="detailStudent.nis"
                    @keydown.enter="getStudentData(detailStudent.nis)"
                    :isDisabled="isPreview | isReturn"
                  />
                  <button
                    v-if="!isPreview"
                    class="absolute cursor-pointer inset-y-0 right-0 top-7 flex items-center pr-2"
                    @click="getStudentData(detailStudent.nis)"
                    :disabled="isPreview | isReturn"
                  >
                    <IconsSearchIcon />
                  </button>
                </div>
                <InputText
                  label="Name"
                  placeholder="Name"
                  :isDisabled="true"
                  v-model="detailStudent.name"
                />
                <InputText
                  label="Rayon"
                  placeholder="Rayon"
                  :isDisabled="true"
                  v-model="detailStudent.rayon"
                />
                <InputText
                  label="Major"
                  placeholder="Major"
                  :isDisabled="true"
                  v-model="detailStudent.majorId"
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
                  v-model="detailBorrowable.guarantee"
                  :disabled="isPreview | isReturn"
                />
                <InputRadio
                  class="mt-5"
                  valueName="Student Card"
                  name="collateralType"
                  value="kartu pelajar"
                  v-model="detailBorrowable.guarantee"
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
                    v-model="detailBorrowable.room"
                    :isDisabled="isPreview | isReturn"
                  />
                  <InputTextarea
                    label="Description"
                    valueName="Student Card"
                    name="collateralType"
                    value="student_card"
                    v-model="detailBorrowable.purpose"
                    :rows="3"
                    :disabled="isPreview | isReturn"
                  />
                  <InputDate
                    v-if="isReturn"
                    label="Return Time"
                    type="datetime-local"
                    v-model="detailBorrowable.returnDate"
                  />
                  <InputText
                  label="Lender's Name"
                  placeholder="Enter Lender's Name"
                  v-model="detailBorrowable.borrowerName"
                  :isDisabled="isPreview | isReturn"
                />
                </div>
              </div>
              <div class="flex gap-4">
                <InputDate
                  label="Date - Pick Up Time"
                  type="datetime-local"
                  v-model="detailBorrowable.borrowDate"
                  :disabled="isPreview | isReturn"
                />
                <InputDate
                  label="Return Time"
                  type="datetime-local"
                  v-model="detailBorrowable.returnDate"
                  :disabled="isPreview | isReturn"
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
          <th class="px-4 py-3 text-center">Returned Time</th>
          <th class="px-4 py-3 text-center">Action</th>
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200">
        <tr v-if="pending">
          <td colspan="6" class="px-4 py-3 text-center">Loading...</td>
        </tr>
        <tr
          v-else-if="!historyStore.history || historyStore.history.length === 0"
        >
          <td colspan="6" class="px-4 py-3 text-center">
            No history data available
          </td>
        </tr>
        <tr
          v-else
          v-for="item in historyStore.history"
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
            {{ formatDateTime(item.borrowed_at) }}
          </td>
          <td class="px-4 py-3 text-center">
            {{ formatDateTime(item.returned_at) }}
          </td>
          <td class="px-4 py-3 flex justify-center gap-1">
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
import { useHistory } from "~/stores/history";
import { useAuthStore } from "~/stores/auth";
import { formatDateTime } from "~/lib/helper";

const historyStore = useHistory();
const url = useRuntimeConfig().public.authUrl;
const authStore = useAuthStore();

const getHistoryData = async () => {
  try {
    pending.value = true;
    const response = await fetch(`${url}/unit-loan/history?data=returning`, {
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
        historyStore.history = result.data;
      } else {
        historyStore.history = result;
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
  getHistoryData();
});

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

definePageMeta({
  title: "Inventory",
});

const breadcrumbs = [
  {
    label: "Manage Inventory",
    icon: IconsNavbarIconsFile,
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

const modalDetailHistory = ref(false);
const detailUnitItem = ref({
  code: "",
  brand: "",
  condition: "",
  type: "",
});
const detailStudent = ref({
  nis: "",
  name: "",
  rayon: "",
  majorId: "",
});
const detailBorrowable = ref({
  guarantee: "",
  image: "",
  room: "",
  purpose: "",
  borrowDate: "",
  returnDate: "",
  borrowerName: "",
});

let isPreview = ref(false);

async function openModalDetail(item) {
  isPreview.value = true;
  modalDetailHistory.value = true;
  detailUnitItem.value = {
    code: item.unit_item.code_unit || "",
    brand: item.unit_item.sub_item?.merk || "",
    condition: item.unit_item.condition || "",
    type: item.unit_item.sub_item?.item?.name || "",
  };
  detailStudent.value = {
    nis: item.student?.nis || "",
    name: item.student?.name || "",
    rayon: item.student?.rayon || "",
    majorId: item.student?.major?.name || "",
  };
  detailBorrowable.value = {
    guarantee: item.guarantee || "",
    image: item.image || "",
    room: item.room || "",
    purpose: item.purpose || "",
    borrowDate: item.borrowed_at || "",
    returnDate: item.returned_at || "",
    borrowerName: item.borrowed_by || "",
  };
}

function closeModalDetailHistory() {
  modalDetailHistory.value = false;
  isPreview.value = false;
}
</script>
