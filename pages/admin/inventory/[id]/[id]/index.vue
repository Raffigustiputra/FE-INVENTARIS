
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
    <Navbar :breadcrumbs="breadcrumbs" />
    <div class="flex items-center justify-between mt-12 mb-4">
      <h1 class="font-semibold text-2xl">
        <NuxtLink to="/admin/inventory"
          >Inventory <span class="text-lg mx-1.5"> / </span>
        </NuxtLink>
        <span v-if="pending">... <span class="text-lg mx-1.5"> / </span> ...</span>
        <template v-else>
          <NuxtLink
            :to="`/admin/inventory/${unitItemStore.unitItems[0]?.sub_item.item_id}`"
          >
            {{ unitItemStore.unitItems[0]?.sub_item.item.name || "Unknown Item" }}
          </NuxtLink>
          <span class="text-lg mx-1.5"> /</span>
          {{ unitItemStore.unitItems[0]?.sub_item.merk || "Unknown Sub Item" }}
        </template>
      </h1>
      <SearchBox v-model="unitItemStore.filter.search" @input="handleSearch" />
    </div>
  </div>

  <TableSkeleton v-if="pending" :rows="6" :columns="6" />

  <div v-else class="overflow-x-auto rounded-lg bg-white">
    <table class="min-w-full text-sm text-left">
      <thead class="bg-gray-100">
        <tr class="text-sm font-semibold text-gray-700">
          <th class="px-4 py-3">
            <input type="checkbox" class="cursor-pointer" v-model="selectAll" @change="toggleAll" />
          </th>
          <th class="px-4 py-3 text-center">Type</th>
          <th class="px-4 py-3 text-center">Unit Code</th>
          <th class="px-4 py-3 text-center">Brand</th>
          <th class="px-4 py-3 text-center">Added Date</th>
          <th class="px-4 py-3 text-center">Status</th>
          <th class="px-4 py-3 text-center">Condition</th>
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200">
        <tr
          v-for="item in unitItemStore.unitItems"
          :key="item.id"
          class="hover:bg-gray-50"
        >
          <td class="px-4 py-3">
            <input type="checkbox" class="cursor-pointer" v-model="selectedItems" :value="item.id" />
          </td>
          <td class="px-4 py-3 text-center">{{ item.sub_item.item.name }}</td>
          <td class="px-4 py-3 text-center">{{ item.code_unit }}</td>
          <td class="px-4 py-3 text-center">{{ item.sub_item.merk }}</td>
          <td class="px-4 py-3 text-center">{{ formatDate(item.procurement_date) }}</td>
          <td class="px-4 py-3 text-center">
            <span
              :class="statusClass(item.status)"
              class="inline-block min-w-[80px] text-center px-3 py-1 rounded-md text-xs font-medium"
            >
              {{ toUpperCase(item.status) }}
            </span>
          </td>
          <td class="px-4 py-3 text-center">
            <span
              :class="conditionClass(item.condition)"
              class="inline-block min-w-[80px] text-center px-3 py-1 rounded-md text-xs font-medium"
            >
              {{ toUpperCase(item.condition) }}
            </span>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="flex items-center justify-between mt-4">
      <p class="text-xs text-gray-500 mt-3 ml-2">
        Showing 1 to {{ unitItemStore.unitItems.length }} of
        {{ allItemCount }} {{ unitItemStore.unitItems[0]?.sub_item.merk || "Unknown Sub Item" }} 
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
  </div>
</template>
<script setup>
import {
  IconsNavbarIconsFile,
  IconsNavbarIconsFilterMajor,
  IconsNavbarIconsFilterRole,
  IconsNavbarIconsPrint,
} from "#components";
import { ref, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import { statusClass, conditionClass, toUpperCase } from "@/lib/helper";

definePageMeta({
  title: "Inventory",
});

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
  {
    label: "Sort by Time",
    icon: IconsNavbarIconsFilterMajor,
    click: () => handleSort("date")
  },
  // {
  //   label: "Sort by Condition",
  //   icon: IconsNavbarIconsFilterRole,
  //   click: () => handleSort("condition")
  // },
];

const sortByDate = ref("");
const sortByCondition = ref("");
const exportData = ref("selected");

const url = useRuntimeConfig().public.authUrl;
const unitItemStore = useUnitItemStore();
const pending = ref(false);
const route = useRoute();
const timeoutFiltering = ref(null);

const lastPage = ref(0);
const currentPage = ref(1);
const allItemCount = ref(0);
const maxVisiblePages = 3;

const alertError = ref(false);
const alertSuccess = ref(false);
const alertWarning = ref(false);
const alertMessage = ref("");

const paginationItems = computed(() => {
  const pages = [];
  const halfVisible = Math.floor(maxVisiblePages / 2);

  // Filter only items with the current merk
  const currentMerk = unitItemStore.unitItems[0]?.sub_item.merk;
  const filteredItems = currentMerk
    ? unitItemStore.unitItems.filter(item => item.sub_item?.merk === currentMerk)
    : unitItemStore.unitItems;

  // Calculate total pages based on filtered items
  const totalFiltered = filteredItems.length;
  const itemsPerPage = 10; // adjust if needed
  const filteredLastPage = Math.max(1, Math.ceil(totalFiltered / itemsPerPage));

  if (currentPage.value > filteredLastPage) {
    currentPage.value = 1;
  }

  if (filteredLastPage <= maxVisiblePages) {
    for (let i = 1; i <= filteredLastPage; i++) {
      pages.push(i);
    }
  } else {
    if (currentPage.value <= halfVisible + 1) {
      for (let i = 1; i <= maxVisiblePages - 1; i++) {
        pages.push(i);
      }
      pages.push("...");
      pages.push(filteredLastPage);
    } else if (currentPage.value >= filteredLastPage - halfVisible) {
      pages.push(1);
      pages.push("...");
      for (
        let i = filteredLastPage - (maxVisiblePages - 2);
        i <= filteredLastPage;
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
      pages.push(filteredLastPage);
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

const handleSearch = () => {
  pending.value = true;
  if (timeoutFiltering.value) {
    clearTimeout(timeoutFiltering.value);
  }

  timeoutFiltering.value = setTimeout(() => {
    currentPage.value = 1; // Reset to first page when searching
    getUnitItemsInventory();
  }, 400);
};

const getUnitItemsInventory = async () => {
  pending.value = true;
  try {
    const response = await $fetch(
      `${url}/unit-items?search=${unitItemStore.filter.search}&page=${currentPage.value}&sort_date=${sortByDate.value}&sort_condition=${sortByCondition.value}&sub_item_id=${route.params.id}`, 
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${useAuthStore().token}`,
        },
      }
    );

    if (response.status === 200) {
      const id = route.params.id;
      unitItemStore.unitItems = response.data;
      
      // Set pagination data
      if (response.meta) {
        lastPage.value = response.meta.last_page;
        const currentMerk = unitItemStore.unitItems[0]?.sub_item.merk;
        if (currentMerk) {
          allItemCount.value = response.meta.total;
        } else {
          allItemCount.value = 0;
        }
      }
      
      pending.value = false;
    }
  } catch (error) {
    console.error("Error fetching unit items:", error);
    pending.value = false;
  }
};

onMounted(() => {
  getUnitItemsInventory();
});

const selectedItems = ref([]);
const selectAll = ref(false);

function toggleAll() {
  if (selectAll.value) {
    exportData.value = "all";
    selectedItems.value = unitItemStore.unitItems.map((item) => item.id);
  } else {
    exportData.value = "selected";
    selectedItems.value = [];
  }
}

const handleSort = (type) => {
  if (type === "date") {
    sortByDate.value = sortByDate.value === "asc" ? "desc" : "asc";
    sortByCondition.value = '';
  } else if (type === "condition") {
    sortByCondition.value = sortByCondition.value === "asc" ? "desc" : "asc";
    sortByDate.value = '';
  }
  getUnitItemsInventory();
};

const exportSelectedData = async () => {
  if (selectedItems.value.length === 0) {
    alertWarning.value = true;
    alertMessage.value = "Please select items to export";
    return;
  }

  try {
    const response = await fetch(`${url}/export/unit-items`, {
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
        sort_status: sortByDate.value,
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

watch(selectedItems, (newVal) => {
  selectAll.value =
    newVal.length === unitItemStore.unitItems.length &&
    unitItemStore.unitItems.length > 0;
});

const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  const day = date.getDate();
  const month = date.toLocaleString("en-US", { month: "short" });
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
};
</script>
