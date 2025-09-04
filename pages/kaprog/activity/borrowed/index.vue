<template>
  <!-- Alert System -->
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
    <AlertWarning 
      class="z-50" 
      v-if="alertWarning" 
      :title="alertMessage" 
    />
  </transition>

  <!-- Page Header -->
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
        :text="'Search Anything'"
        v-model="searchQuery"
        @input="handleSearch"
      />
    </div>
  </div>

  <!-- Borrowed Detail Modal -->
  <UnitloanData
    :isOpen="!!currentModal"
    :modalType="currentModal"
    :unitItem="unitItem"
    :studentData="studentData"
    :teacherData="teacherData"
    :formData="formData"
    :selectedCollateralType="selectedCollateralType"
    :imagePreview="imagePreview"
    @close="closeModal"
  />

  <!-- Data Table -->
  <TableSkeleton v-if="pending" :rows="4" :columns="7" />
  <div v-else class="overflow-x-auto rounded-lg bg-white">
    <table class="min-w-full text-sm text-left">
      <thead class="bg-gray-100">
        <tr class="text-sm font-semibold text-gray-700">
          <th class="px-4 py-3">
            <input type="checkbox" v-model="selectAll" @change="toggleAll" />
          </th>
          <th class="py-3 px-4 text-center">Type</th>
          <th class="px-4 py-3 text-center first:!px-2 first:!text-left nth-2:!px-2 nth-2:!text-center">
            Unit Code
          </th>
          <th class="px-4 py-3 text-center">Brand</th>
          <th class="px-4 py-3 text-center">Borrowed Time</th>
          <th class="px-4 py-3 text-center">Action</th>
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200">
        <!-- Loading State -->
        <tr v-if="pending">
          <td colspan="7" class="px-4 py-3 text-center">Loading...</td>
        </tr>
        <!-- Empty State -->
        <tr v-else-if="!loanStore.loan || loanStore.loan.length === 0">
          <td colspan="7" class="px-4 py-3 text-center">
            No borrowed data available
          </td>
        </tr>
        <!-- Data Rows -->
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
            {{ item.unit_item?.sub_item?.item?.name || item.item_name || "N/A" }}
          </td>
          <td class="px-4 py-3 text-center">
            {{ item.unit_item?.code_unit || item.code_unit || "N/A" }}
          </td>
          <td class="px-4 py-3 text-center">
            {{ item.unit_item?.sub_item?.merk || item.brand || "N/A" }}
          </td>
          <td class="px-4 py-3 text-center">
            {{ formatDateTime(item.borrowed_at) }}
          </td>
          <td class="px-4 py-3 flex justify-center gap-1">
            <Tooltip text="Detail" position="top">
              <div
                class="bg-[#c89513] p-1.5 rounded-md flex justify-center items-center hover:cursor-pointer"
                @click="openDetailModal(item)"
              >
                <IconsDetail />
              </div>
            </Tooltip>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- Pagination -->
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
import {
  IconsNavbarIconsAddItem,
  IconsNavbarIconsFile,
  IconsNavbarIconsFilterMajor,
  IconsNavbarIconsFilterRole,
  IconsNavbarIconsPrint,
} from "#components";
import { ref, computed, onMounted, watch, nextTick } from "vue";
import { useLoanStore } from "~/stores/loan";
import { useAuthStore } from "~/stores/auth";
import UnitloanData from "~/components/Modal/unitLoan/UnitLoanData.vue";
import { formatDateTime } from "@/lib/helper"

// =============================================================================
// PAGE META & SETUP
// =============================================================================
definePageMeta({
  title: "Borrowed",
});

// =============================================================================
// STORE REFERENCES & CONFIG
// =============================================================================
const loanStore = useLoanStore();
const authStore = useAuthStore();
const url = useRuntimeConfig().public.authUrl;

// =============================================================================
// REACTIVE STATE
// =============================================================================
// Modal State
const currentModal = ref(null);

// Alert State
const alertError = ref(false);
const alertSuccess = ref(false);
const alertWarning = ref(false);
const alertMessage = ref("");

// Loading & UI State
const pending = ref(false);
const searchQuery = ref("");
const selectedItems = ref([]);
const selectAll = ref(false);

// Sorting & Filtering
const sortByType = ref("");
const sortByTime = ref("");
const exportData = ref("selected");

// Pagination
const currentPage = ref(1);
const lastPage = ref(0);
const allLoanCount = ref(0);
const maxVisiblePages = 3;

// Modal Data
const selectedCollateralType = ref("");
const imagePreview = ref("");

// Form Data Object
const formData = ref({
  // Common fields
  id: "",
  unitItemId: "",
  studentId: "",
  teacherId: "",
  borrowerName: "",
  borrowDate: "",
  returnDate: "",
  purpose: "",
  room: "",
  guarantee: "",
  image: "",

  // Teacher specific
  teacherName: "",
  employeeId: "",
  department: "",

  // Student specific
  studentName: "",
  class: "",

  // Consumable specific
  quantity: 1,
  usageDate: "",
});

// Data Objects
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

// =============================================================================
// COMPUTED PROPERTIES
// =============================================================================
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
      for (let i = lastPage.value - (maxVisiblePages - 2); i <= lastPage.value; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      pages.push("...");
      for (let i = currentPage.value - halfVisible + 1; i <= currentPage.value + halfVisible - 1; i++) {
        pages.push(i);
      }
      pages.push("...");
      pages.push(lastPage.value);
    }
  }
  return pages;
});

// =============================================================================
// BREADCRUMBS CONFIGURATION
// =============================================================================
const breadcrumbs = [
  {
    label: "Manage Inventory",
    icon: IconsNavbarIconsFile,
    click: () => openModalFromBreadcrumb({ label: "Manage Inventory" }),
  },
  {
    label: "Export Selected",
    icon: IconsNavbarIconsPrint,
    click: () => exportSelectedData(),
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

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================
const resetFormData = () => {
  formData.value = {
    id: "",
    unitItemId: "",
    studentId: "",
    teacherId: "",
    borrowerName: "",
    borrowDate: "",
    returnDate: "",
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
};

// =============================================================================
// MODAL FUNCTIONS
// =============================================================================
const closeModal = () => {
  currentModal.value = null;
  resetFormData();
  imagePreview.value = "";
  selectedCollateralType.value = "";
};

const openDetailModal = async (item) => {
  resetFormData();

  if (item.unit_item) {
    // Handle borrowable items
    unitItem.value = {
      code: item.unit_item.code_unit || "",
      brand: item.unit_item.sub_item?.merk || "",
      condition: item.unit_item.condition || "",
      type: item.unit_item.sub_item?.item?.name || "",
      status: item.unit_item.status || "",
    };

    formData.value = {
      ...formData.value,
      id: item.id || "",
      unitItemId: item.unit_item?.id || "",
      borrowerName: item.borrowed_by || "",
      borrowDate: item.borrowed_at || "",
      returnDate: item.returned_at || "",
      purpose: item.purpose || "",
      room: item.room || "",
      guarantee: item.guarantee || "",
      image: item.image || "",
    };

    selectedCollateralType.value = item.guarantee || "";
    imagePreview.value = item.image || "";

    // Determine borrower type
    if (item.student) {
      studentData.value = {
        nis: item.student.nis || "",
        name: item.student.name || "",
        rayon: item.student.rayon || "",
        majorId: item.student.major?.id || "",
        majorName: item.student.major?.name || "",
      };
      formData.value.studentId = item.student.id || "";
      currentModal.value = "borrowable-student";
    } else if (item.teacher) {
      teacherData.value = {
        nip: item.teacher.nip || "",
        name: item.teacher.name || "",
        telephone: item.teacher.telephone || "",
      };
      formData.value.teacherId = item.teacher.id || "";
      currentModal.value = "borrowable-teacher";
    }
  } else if (item.quantity) {
    // Handle consumable items
    formData.value = {
      ...formData.value,
      id: item.id || "",
      quantity: item.quantity || 1,
      usageDate: item.usage_date || "",
    };

    // Determine user type
    if (item.student) {
      formData.value.studentName = item.student.name || "";
      formData.value.studentId = item.student.nis || "";
      formData.value.class = item.student.class || "";
      currentModal.value = "consumable-student";
    } else if (item.teacher) {
      formData.value.teacherName = item.teacher.name || "";
      formData.value.employeeId = item.teacher.nip || "";
      formData.value.department = item.teacher.department || "";
      currentModal.value = "consumable-teacher";
    }
  }
};

// =============================================================================
// DATA FETCHING
// =============================================================================
const getHistoryData = async () => {
  try {
    pending.value = true;
    const response = await fetch(
      `${url}/unit-loan/history?data=borrowing&sort_by_type=${sortByType.value}&sort_by_time=${sortByTime.value}&search=${searchQuery.value}&page=${currentPage.value}`,
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

const exportSelectedData = async () => {
  if (selectedItems.value.length === 0) {
    alertWarning.value = true;
    alertMessage.value = "Please select items to export";
    return;
  }

  try {
    const response = await fetch(`${url}/export/unit-loan`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authStore.token}`,
      },
      body: JSON.stringify({  
        export: exportData.value,
        data: selectedItems.value,
        type: "borrowing",
        search: searchQuery.value,
        sort_by_type: sortByType.value,
        sort_by_time: sortByTime.value,
      }),
    });

    if (response.ok) {
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `borrowed_items_selected_${new Date().toISOString().slice(0, 10)}.xlsx`;
      link.click();
      window.URL.revokeObjectURL(url);
      
      alertSuccess.value = true;
      alertMessage.value = "Selected data exported successfully!";
    } else {
      alertError.value = true;
      alertMessage.value = "Failed to export selected data";
    }
  } catch (error) {
    console.error("Export error:", error);
    alertError.value = true;
    alertMessage.value = "Error occurred during export";
  }
};

// =============================================================================
// EVENT HANDLERS
// =============================================================================
let timeoutFiltering = null;

const handleSearch = () => {
  pending.value = true;
  if (timeoutFiltering) {
    clearTimeout(timeoutFiltering);
  }

  timeoutFiltering = setTimeout(() => {
    getHistoryData();
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
  getHistoryData();
};

const toggleAll = () => {
  if (selectAll.value) {
    exportData.value = "all";
    selectedItems.value = loanStore.loan.map((item) => item.id);
  } else {
    exportData.value = "selected";
    selectedItems.value = [];
  }
};

const openModalFromBreadcrumb = (item) => {
  console.log("Breadcrumb clicked:", item.label);
};

// =============================================================================
// PAGINATION HANDLERS
// =============================================================================
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

// =============================================================================
// LIFECYCLE HOOKS
// =============================================================================
onMounted(() => {
  getHistoryData();
});

// =============================================================================
// WATCHERS
// =============================================================================
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