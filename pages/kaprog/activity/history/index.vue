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
    <AlertWarning class="z-50" v-if="alertWarning" :title="alertMessage" />
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
        History
        <div class="inline text-lg">/</div>
        {{ viewData === "borrowable" ? "Reusable" : "Consumable" }}
      </h1>
      <SearchBox
        :text="'Search Anything...'"
        v-model="searchQuery"
        @input="handleSearch"
      />
    </div>
  </div>

  <!-- History Detail Modal -->
  <UnitloanData
    :isOpen="!!currentModal"
    :modalType="currentModal"
    :unitItem="unitItem"
    :consumableItem="consumableItem"
    :studentData="studentData"
    :teacherData="teacherData"
    :formData="formData"
    :selectedCollateralType="selectedCollateralType"
    :imagePreview="imagePreview"
    @close="closeModal"
  />

  <!-- Data Table -->
  <TableSkeleton
    v-if="pending && viewData === 'borrowable'"
    :rows="4"
    :columns="7"
  />
  <div
    v-else-if="viewData === 'borrowable'"
    class="overflow-x-auto rounded-lg bg-white"
  >
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
        <!-- Loading State -->
        <tr v-if="pending">
          <td colspan="7" class="px-4 py-3 text-center">Loading...</td>
        </tr>
        <!-- Empty State -->
        <tr
          v-else-if="!historyStore.history || historyStore.history.length === 0"
        >
          <td colspan="7" class="px-4 py-3 text-center">
            No history data available
          </td>
        </tr>
        <!-- Data Rows -->
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
            {{
              item.unit_item?.sub_item?.item?.name || item.item_name || "N/A"
            }}
          </td>
          <td class="px-4 py-3 text-center">
            {{ item.unit_item?.code_unit || item.code_unit || "N/A" }}
          </td>
          <td class="px-4 py-3 text-center">
            {{ item.unit_item?.sub_item?.merk || item.brand || "N/A" }}
          </td>
          <td class="px-4 py-3 text-center">
            {{ formatDate(item.borrowed_at) }}
          </td>
          <td class="px-4 py-3 text-center">
            {{ formatDate(item.returned_at) }}
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

  <TableSkeleton
    v-if="pending && viewData === 'consumable'"
    :rows="4"
    :columns="7"
  />
  <div
    v-else-if="viewData === 'consumable'"
    class="overflow-x-auto rounded-lg bg-white"
  >
    <table class="min-w-full text-sm text-left">
      <thead class="bg-gray-100">
        <tr class="text-sm font-semibold text-gray-700">
          <th class="px-4 py-3">
            <input type="checkbox" v-model="selectAll" @change="toggleAll" />
          </th>
          <th class="py-3 px-4 text-center">Name</th>
          <th
            class="px-4 py-3 text-center first:!px-2 first:!text-left nth-2:!px-2 nth-2:!text-center"
          >
            Qty
          </th>
          <th class="px-4 py-3 text-center">Unit</th>
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
        <tr
          v-else-if="!historyStore.history || historyStore.history.length === 0"
        >
          <td colspan="7" class="px-4 py-3 text-center">
            No history data available
          </td>
        </tr>
        <!-- Data Rows -->
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
            {{ item.consumable_item.name || "N/A" }}
          </td>
          <td class="px-4 py-3 text-center">
            {{ item.quantity || "N/A" }}
          </td>
          <td class="px-4 py-3 text-center">
            {{ item.consumable_item.unit || "N/A" }}
          </td>
          <td class="px-4 py-3 text-center">
            {{ formatDate(item.borrowed_at) }}
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
      Showing {{ historyStore.history.length }} of {{ allHistoryCount }} Data
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
  IconsNavbarIconsChangeItems,
  IconsNavbarIconsFile,
  IconsNavbarIconsFilterMajor,
  IconsNavbarIconsFilterRole,
  IconsNavbarIconsPrint,
} from "#components";
import { ref, computed, onMounted, watch, nextTick } from "vue";
import { useHistory } from "~/stores/history";
import { useAuthStore } from "~/stores/auth";
import UnitloanData from "~/components/Modal/unitLoan/UnitLoanData.vue";

// =============================================================================
// PAGE META & SETUP
// =============================================================================
definePageMeta({
  title: "History",
});

// =============================================================================
// STORE REFERENCES & CONFIG
// =============================================================================
const historyStore = useHistory();
const authStore = useAuthStore();
const url = useRuntimeConfig().public.authUrl;
const storageUrl = useRuntimeConfig().public.storageUrl;
const exportData = ref("selected");


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
const viewData = ref("borrowable");
const sortByType = ref("");
const sortByTime = ref("");
const sortByQuantity = ref("");

// Pagination
const currentPage = ref(1);
const lastPage = ref(0);
const allHistoryCount = ref(0);
const maxVisiblePages = 3;

// Modal Data
const selectedCollateralType = ref("");
const imagePreview = ref("");

// Form Data Object
const formData = ref({
  // Common fields
  id: "",
  unitItemId: "",
  consumableItemId: "",
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

const consumableItem = ref({
  name: "",
  quantity: 0,
  unit: "",
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

// =============================================================================
// BREADCRUMBS CONFIGURATION
// =============================================================================
const breadcrumbs = computed(() => [
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
    label: "Change Items",
    icon: IconsNavbarIconsChangeItems,
    click: () => changeHistoryData(),
  },
  {
    label: "Sort by Type",
    icon: IconsNavbarIconsFilterMajor,
    click: () => handleSort("type"),
  },
  ...(viewData.value === "borrowable"
    ? [
        {
          label: "Sort by Time",
          icon: IconsNavbarIconsFilterRole,
          click: () => handleSort("time"),
        },
      ]
    : []),
  ...(viewData.value === "consumable"
    ? [
        {
          label: "Sort by Quantity",
          icon: IconsNavbarIconsFilterMajor,
          click: () => handleSort("quantity"),
        },
      ]
    : []),
]);

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================
const formatDate = (dateStr) => {
  if (!dateStr) return "N/A";
  const date = new Date(dateStr);
  const day = date.getDate();
  const month = date.toLocaleString("en-US", { month: "short" });
  const year = date.getFullYear();
  const time = date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  return `${day} ${month} ${year} ${time}`;
};

const resetFormData = () => {
  formData.value = {
    id: "",
    unitItemId: "",
    consumableItemId: "",
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

  consumableItem.value = {
    name: "",
    quantity: 0,
    unit: "",
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

  if (item.unit_item || item.consumable_item) {
    if (viewData.value === "borrowable") {
      unitItem.value = {
        code: item.unit_item.code_unit ?? "",
        brand: item.unit_item.sub_item?.merk ?? "",
        condition: item.unit_item.condition ?? "",
        type: item.unit_item.sub_item?.item?.name ?? "",
        status: item.unit_item.status ?? "",
      };
    } else {
      consumableItem.value = {
        name: item.consumable_item.name ?? "",
        quantity: item.consumable_item.quantity ?? 0,
        unit: item.consumable_item.unit ?? "",
      };
    }

    formData.value = {
      ...formData.value,
      id: item.id ?? "",
      unitItemId: item.unit_item?.id ?? "",
      consumableItemId: item.consumable_item?.id ?? "",
      borrowerName: item.borrowed_by ?? "",
      borrowDate: item.borrowed_at ?? "",
      returnDate: item.returned_at ?? "",
      purpose: item.purpose ?? "",
      quantity: item.quantity ?? 0,
      room: item.room ?? "",
      guarantee: item.guarantee ?? "",
      image: item.image ?? "",
    };

    selectedCollateralType.value = item.guarantee || "";
    imagePreview.value = item.image ? storageUrl + "/" + item.image : "";

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
      if (viewData.value === "borrowable") {
        currentModal.value = "borrowable-student";
      } else {
        currentModal.value = "consumable-student";
      }
    } else if (item.teacher) {
      teacherData.value = {
        nip: item.teacher.nip || "",
        name: item.teacher.name || "",
        telephone: item.teacher.telephone || "",
      };
      formData.value.teacherId = item.teacher.id || "";
      if (viewData.value === "borrowable") {
        currentModal.value = "borrowable-teacher";
      } else {
        currentModal.value = "consumable-teacher";
      }
    }
  }
};

// =============================================================================
// DATA FETCHING
// =============================================================================
const getHistoryData = async () => {
  try {
    pending.value = true;

    const response = ref(null);

    if (viewData.value === "borrowable") {
      response.value = await fetch(
        `${url}/unit-loan/history?data=returning&sort_by_type=${sortByType.value}&sort_by_time=${sortByTime.value}&search=${searchQuery.value}&page=${currentPage.value}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authStore.token}`,
          },
        }
      );
    } else {
      response.value = await fetch(
        `${url}/consumable-loan/history?sort_type=${sortByType.value}&sort_quantity=${sortByQuantity.value}&search=${searchQuery.value}&page=${currentPage.value}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authStore.token}`,
          },
        }
      );
    }

    if (response.value.ok) {
      const result = await response.value.json();
      if (result.data) {
        historyStore.history = result.data;
        lastPage.value = result.meta.last_page;
        allHistoryCount.value = result.meta.total;
      } else {
        historyStore.history = result;
        lastPage.value = result.meta.last_page;
        allHistoryCount.value = result.meta.total;
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

const changeHistoryData = () => {
  viewData.value =
    viewData.value === "borrowable" ? "consumable" : "borrowable";
  currentPage.value = 1;
  getHistoryData();
};

const exportSelectedData = async () => {
  if (selectedItems.value.length === 0) {
    alertWarning.value = true;
    alertMessage.value = "Please select items to export";
    return;
  }

  try {
    const endpoint = viewData.value === "borrowable" ? "unit-loan" : "consumable-loan";
    const requestBody = {
      export: exportData.value,
      data: selectedItems.value,
      search: searchQuery.value,
    };

    if (viewData.value === "borrowable") {
      requestBody.type = "returning";
      requestBody.sort_by_type = sortByType.value;
      requestBody.sort_by_time = sortByTime.value;
    } else {
      requestBody.sort_type = sortByType.value;
      requestBody.sort_quantity = sortByQuantity.value;
    }

    const response = await fetch(`${url}/export/${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authStore.token}`,
      },
      body: JSON.stringify(requestBody),
    });

    if (response.ok) {
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${viewData.value}_history_${new Date().toISOString().slice(0, 10)}.xlsx`;
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
    sortByQuantity.value = "";
  } else if (type === "time") {
    sortByTime.value = sortByTime.value === "asc" ? "desc" : "asc";
    sortByType.value = "";
    sortByQuantity.value = "";
  } else if (type === "quantity") {
    sortByQuantity.value = sortByQuantity.value === "asc" ? "desc" : "asc";
    sortByType.value = "";
    sortByTime.value = "";
  } else {
    sortByQuantity.value = "";
    sortByTime.value = "";
    sortByType.value = "";
  }
  getHistoryData();
};

const toggleAll = () => {
  if (selectAll.value) {
    exportData.value = "all";
    selectedItems.value = historyStore.history.map((item) => item.id);
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
