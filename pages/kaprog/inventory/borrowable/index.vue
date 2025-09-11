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

@media print {
  body * {
    visibility: hidden !important;
  }
  #print-area, #print-area * {
    visibility: visible !important;
    display: block !important;
  }
  #print-area {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    background: white; /* opsional kalau mau putih */
  }
}

</style>

<template>
  <transition name="alert">
    <AlertError class="z-50" v-if="alertError" :title="alertMessage" @hide="alertError = false" />
  </transition>
  <transition name="alert">
    <AlertSuccess class="z-50" v-if="alertSuccess" :title="alertMessage" @hide="alertSuccess = false" />
  </transition>
  <transition name="alert">
    <AlertWarning class="z-50" v-if="alertWarning" :title="alertMessage" />
  </transition>
  <div>
    <Navbar :breadcrumbs="breadcrumbs" @breadcrumbClick="openModalFromBreadcrumb" />
    <div class="flex items-center justify-between mt-12 mb-4">
      <h1 class="font-semibold text-2xl">Inventory
        <div class="inline text-lg">/</div>
        Reusable Items</h1>
      <SearchBox v-model="mainInventoryStore.filter.search" @input="handleSearch" />
    </div>
  </div>

  <TableSkeleton v-if="pending" :rows="4" :columns="1" />

  <div v-else class="overflow-x-auto overflow-y-auto rounded-lg bg-white max-h-[65vh]">
    <table class="min-w-full text-sm text-left relative">
      <thead class="bg-gray-100 sticky top-0 z-10">
        <tr class="text-sm font-semibold text-gray-700">
          <th class="px-4 py-3 w-1">
            <input type="checkbox" v-model="selectAll" @change="toggleAll" />
          </th>
          <th class="px-10 py-3 text-left">Type</th>
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200">
        <tr
          v-for="item in mainInventoryStore.inventory"
          :key="item.id"
          class="hover:bg-gray-100 transition-colors duration-200"
        >
          <td class="px-4 py-3">
            <input type="checkbox" v-model="selectedItems" :value="item.id" />
          </td>
          <td class="px-10 py-4 text-left cursor-pointer" @click="viewItem(item.id)">{{ item.name }}</td>
        </tr>
      </tbody>
    </table>
  </div>

  <div class="flex items-center justify-between mt-4">
    <p class="text-xs text-gray-500">
      Showing {{ unitItemStore.unitItems.length > 0 ? 1 : 0 }} to
      {{ unitItemStore.unitItems.length }} of {{ allItemCount }} Inventory Items
    </p>
    <Pagination :currentPage="currentPage" :lastPage="lastPage" :paginationItems="paginationItems" @prev="prevPage"
      @next="nextPage" @change="changePage" />
  </div>

  <template>
    <!-- Modal Print QR -->
    <Transition name="fade">
      <div v-if="modalPrintQR"
        class="fixed top-0 left-0 z-50 flex items-center justify-center w-full h-screen bg-black/60">
        <div class="bg-white w-[90%] h-[90%] rounded-lg overflow-auto relative p-4">
          <!-- Tombol Close -->
          <button class="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded" @click="closeModalPrintQR">
            X
          </button>

          <!-- Hanya ini yang akan diprint -->
          <div id="print-area" class="bg-gray-900 p-4">
            <IndexQR :items="selectedUnitItems" />
          </div>
        </div>
      </div>
    </Transition>


  </template>




</template>
<script setup>
import {
  IconsNavbarIconsFile,
  IconsNavbarIconsFilterMajor,
  IconsNavbarIconsFilterRole,
  IconsNavbarIconsPrint,
  IconsNavbarIconsAddItem,
  IconsNavbarIconsAddQr,
  InputSelect,
} from "#components";
import { ref, onMounted, watch, nextTick } from "vue";
import Pagination from "@/components/pagination/index.vue";
import { useUnitItemStore } from "@/stores/main-inventory";
import IndexQR from "@/pages/admin/qr/index.vue";

definePageMeta({
  title: "Borrowable",
});

const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  const day = date.getDate();
  const month = date.toLocaleString("en-US", { month: "short" });
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
};

const exportData = ref("selected");

const breadcrumbs = [
  {
    label: "Manage Inventory",
    icon: IconsNavbarIconsFile,
  },
  {
    label: "Export Selected",
    icon: IconsNavbarIconsPrint,
    click: () => exportSelectedData()
  },
];

const url = useRuntimeConfig().public.authUrl;
const authStore = useAuthStore();
const unitItemStore = useUnitItemStore();
const mainInventoryStore = useMainInventoryStore();
const adminInventoryStore = useAdminInventoryStore();

const openModalFromBreadcrumb = (item) => {
  if (item.label === "Add Item") {
    modalCreate.value = true;
  }
  if (item.label === "Print QR-Code") {
    if (selectedUnitItems.value.length === 0) {
      showAlert("warning", "Pilih minimal satu barang dulu!");
      return;
    }
    modalPrintQR.value = true;
  }
};

// Modal states
const modalCreate = ref(false);
const modalUpdate = ref(false);
const modalDelete = ref(false);
const isSubmitting = ref(false);
const selectedItems = ref([]);
const sortByCondition = ref("asc");
const sortByDate = ref("asc");
const sortByType = ref("asc");
const selectAll = ref(false);
const modalPrintQR = ref(false);

const selectedUnitItems = computed(() =>
  unitItemStore.unitItems.filter((item) => selectedItems.value.includes(item.id))
);

const closeModalPrintQR = () => {
  modalPrintQR.value = false;
};

watch(modalPrintQR, async (newVal) => {
  if (newVal) {
    await nextTick();
    setTimeout(() => {
      window.print();
    }, 300);
  }
});

const alertError = ref(false);
const alertSuccess = ref(false);
const alertWarning = ref(false);
const alertMessage = ref("");

const viewItem = (id) => {
  navigateTo(`/kaprog/inventory/borrowable/${id}`);
};

function toggleAll() {
  if (selectAll.value) {
    exportData.value = "all";
    selectedItems.value = mainInventoryStore.inventory.map((item) => item.id);
  } else {
    exportData.value = "selected";
    selectedItems.value = [];
  }
}

const lastPage = ref(0);
const currentPage = ref(1);
const allItemCount = ref(0);
const maxVisiblePages = 3;

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
    console.log(currentPage.value);
    nextTick(() => {
      getUnitItemsInventory();
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
    console.log(currentPage.value);
    nextTick(() => {
      getUnitItemsInventory();
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
    console.log(currentPage.value);
  }
  nextTick(() => {
    getUnitItemsInventory();
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "smooth",
    });
  });
};

let timeoutFiltering = null;

const handleSearch = () => {
  pending.value = true;
  if (timeoutFiltering) {
    clearTimeout(timeoutFiltering);
  }

  timeoutFiltering = setTimeout(() => {
    currentPage.value = 1; // Reset to first page when searching
    getMainInventoryItems();
  }, 500);
};

watch(selectedItems, (newVal) => {
  selectAll.value =
    newVal.length === unitItemStore.unitItems.length &&
    unitItemStore.unitItems.length > 0;
});

const showAlert = (type, message) => {
  alertMessage.value = message;

  if (type === "error") {
    alertError.value = true;
    setTimeout(() => {
      alertError.value = false;
      alertMessage.value = "";
    }, 3000);
  } else if (type === "warning") {
    alertWarning.value = true;
    setTimeout(() => {
      alertWarning.value = false;
      alertMessage.value = "";
    }, 2500);
  } else if (type === "success") {
    alertSuccess.value = true;
    setTimeout(() => {
      alertSuccess.value = false;
      alertMessage.value = "";
    }, 2500);
  } else {
    alert(message);
  }
};

const closeModalCreate = () => {
  modalCreate.value = false;
  adminInventoryStore.input = {};
};

const pending = ref(true);
const error = ref(null);

const exportSelectedData = async () => {
  if (selectedItems.value.length === 0) {
    showAlert("warning", "Please select items to export");
    return;
  }

  try {
    const response = await fetch(`${url}/export/items`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authStore.token}`,
      },
      body: JSON.stringify({
        data: selectedItems.value,
        export: exportData.value,
        search: unitItemStore.filter.search,
        sort_condition: sortByCondition.value,
        sort_type: sortByType.value,
        sort_date: sortByDate.value,
      }),
    });

    if (response.ok) {
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `borrowable_items_${new Date()
        .toISOString()
        .slice(0, 10)}.xlsx`;
      link.click();
      window.URL.revokeObjectURL(url);

      showAlert("success", "Selected data exported successfully!");
    } else {
      showAlert("error", "Failed to export selected data");
    }
  } catch (error) {
    console.error("Export error:", error);
    showAlert("error", "Error occurred during export");
  }
};

const getMainInventoryItems = async () => {
  pending.value = true;
  const response = await $fetch(
    `${url}/item?search=${mainInventoryStore.filter.search}&page=${currentPage.value}&sort_type=${sortByType.value}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authStore.token}`,
      },
      params: {
        search: mainInventoryStore.filter.search,
        sort_by_type: mainInventoryStore.filter.sortByType,
        sort_by_time: mainInventoryStore.filter.sortByTime,
      },
    }
  );

  if (response.status === 200) {
    pending.value = false;
    mainInventoryStore.inventory = response.data;
  }
};

const getUnitItemsInventory = async () => {
  try {
    pending.value = true;

    const response = await $fetch(`${url}/unit-items?sort_condition=${sortByCondition.value}&sort_date=${sortByDate.value}&sort_type=${sortByType.value}&`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authStore.token}`,
      },
      params: {
        search: unitItemStore.filter.search,
        page: currentPage.value,
        sort_by_type: unitItemStore.filter.sortByType,
        sort_by_time: unitItemStore.filter.sortByTime,
      },
    });

    if (response) {
      unitItemStore.unitItems = response.data ?? response;

      if (response.meta) {
        lastPage.value = response.meta.last_page;
        allItemCount.value = response.meta.total;
      }
    } else {
      alertError.value = true;
      alertMessage.value = "Failed to fetch inventory items";
    }
  } catch (error) {
    console.error("Error fetching unit items:", error);
    alertError.value = true;
    alertMessage.value = "Network error while fetching inventory items";
  } finally {
    pending.value = false;
  }
};

const handleSortInventory = (type) => {
  if (type === "type") {
    sortByType.value = sortByType.value === "asc" ? "desc" : "asc";
    sortByCondition.value = "";
    sortByDate.value = "";
  } else if (type === "date") {
    sortByType.value = "";
    sortByCondition.value = "";
    sortByDate.value = sortByDate.value === "asc" ? "desc" : "asc";
  } else if (type === "condition") {
    sortByType.value = "";
    sortByDate.value = "";
    sortByCondition.value = sortByCondition.value === "asc" ? "desc" : "asc";
  }

  getMainInventoryItems();
};

onMounted(() => {
  getMainInventoryItems();
});

</script>
