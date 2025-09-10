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
        Inventory
        <div class="inline text-lg">/</div>
        Consumable Items
      </h1>
      <SearchBox
        v-model="consumableItemStore.filter.search"
        @input="handleSearch"
      />
    </div>
  </div>

  <!-- Modal Create Consumable -->
  <div class="w-full">
    <Transition name="fade">
      <div
        v-if="modalCreate"
        class="fixed top-0 left-0 z-40 flex items-center justify-center w-full h-screen bg-black/30"
      >
        <Modal
          @btnClose="closeModalCreate"
          title="Add New Item"
          @btnSubmit="createConsumableItem"
          labelButton="Add Item"
          :isSubmitting="isSubmitting"
        >
          <p class="text-sm font-medium text-[#727272] my-2">ITEM DETAILS</p>
          <div class="w-full flex items-center gap-2">
            <InputText
              label="Item Name"
              placeholder="Enter Item Name"
              v-model="consumableItemStore.input.name"
            />
          </div>
          <div class="w-full flex items-center gap-2">
            <InputNumber
              label="QTY"
              placeholder="Enter Quantity"
              v-model="consumableItemStore.input.quantity"
            />
            <InputText
              label="QTY(pcs/pack)"
              v-model="consumableItemStore.input.unit"
              placeholder="Enter Unit"
            />
          </div>
        </Modal>
      </div>
    </Transition>
  </div>

  <!-- Modal Update Consumable -->
  <div class="w-full">
    <Transition name="fade">
      <div
        v-if="modalUpdate"
        class="fixed top-0 left-0 z-40 flex items-center justify-center w-full h-screen bg-black/30"
      >
        <Modal
          @btnSubmit="updateConsumableItem"
          @btnClose="closeModalUpdate"
          title="Update Item"
          :isSubmitting="isSubmitting"
        >
          <div class="w-full flex items-center gap-2"></div>
          <div class="w-full flex items-center gap-2">
            <InputText
              label="Item Name"
              placeholder="Enter Item Name"
              v-model="consumableItemStore.input.name"
            />
          </div>
          <div class="w-full flex items-center gap-2">
            <InputNumber
              label="QTY"
              placeholder="Enter Quantity"
              v-model="consumableItemStore.input.quantity"
            />
            <InputText
              label="QTY(pcs/pack)"
              v-model="consumableItemStore.input.unit"
              placeholder="Enter Unit"
            />
          </div>
        </Modal>
      </div>
    </Transition>
  </div>

  <!-- Modal Delete Consumable -->
  <Transition name="fade">
    <div
      v-if="modalDelete"
      class="fixed top-0 left-0 z-40 flex items-center justify-center w-full h-screen bg-black/30"
    >
      <Modal
        @btnSubmit="deleteConsumableItem"
        @btnClose="closeModalDelete"
        title="Confirm Deletion"
        :isSubmitting="isSubmitting"
        labelButton="Delete"
      >
        <div class="">
          <p class="text-gray-600">
            Are you sure you want to delete
            <span class="font-semibold">{{ deleteItemData?.name }}</span
            >?
          </p>
        </div>
      </Modal>
    </div>
  </Transition>

  <TableSkeleton v-if="pending" :rows="4" :columns="7" />

  <div
    v-else
    class="overflow-x-auto overflow-y-auto rounded-lg bg-white max-h-[65vh]"
  >
    <table class="min-w-full text-sm text-left relative">
      <thead class="bg-gray-100 sticky top-0 z-10">
        <tr class="text-sm font-semibold text-gray-700">
          <th class="px-4 py-3">
            <input type="checkbox" v-model="selectAll" @change="toggleAll" />
          </th>
          <th class="px-4 py-3 text-center">Name</th>
          <th class="px-4 py-3 text-center">Quantity</th>
          <th class="px-4 py-3 text-center">Unit</th>
          <th class="px-4 py-3 text-center">Action</th>
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200">
        <tr
          v-for="item in consumableItemStore.consumables"
          :key="item.id"
          class="hover:bg-gray-50"
        >
          <td class="px-4 py-3">
            <input type="checkbox" v-model="selectedItems" :value="item.id" />
          </td>
          <td class="px-4 py-3 text-center">{{ item.name }}</td>
          <td class="px-4 py-3 text-center">{{ item.quantity }}</td>
          <td class="px-4 py-3 text-center">{{ item.unit }}</td>
          <td class="px-4 py-3 flex justify-center gap-2">
            <Tooltip text="Edit" position="top">
              <ButtonEdit @click="openModalUpdate(item)" />
            </Tooltip>
            <Tooltip text="Delete" position="top">
              <ButtonDelete @click="openModalDelete(item)" />
            </Tooltip>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <div class="flex items-center justify-between mt-4">
    <p class="text-xs text-gray-500">
      Showing {{ consumableItemStore.consumables.length > 0 ? 1 : 0 }} to
      {{ consumableItemStore.consumables.length }} of
      {{ allItemCount }} Inventory Items
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
  IconsNavbarIconsFile,
  IconsNavbarIconsFilterMajor,
  IconsNavbarIconsFilterRole,
  IconsNavbarIconsPrint,
  IconsNavbarIconsAddItem,
  InputNumber,
} from "#components";
import { ref, onMounted, watch } from "vue";
import Pagination from "@/components/pagination/index.vue";

definePageMeta({
  title: "Consumable",
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
    click: () => exportSelectedData(),
  },
  {
    label: "Add Item Consumable",
    icon: IconsNavbarIconsAddItem,
  },
  {
    label: "Sort by Type",
    icon: IconsNavbarIconsFilterMajor,
    click: () => handleSort("type"),
  },
  {
    label: "Sort by Qty",
    icon: IconsNavbarIconsFilterRole,
    click: () => handleSort("quantity"),
  },
];

const url = useRuntimeConfig().public.authUrl;
const authStore = useAuthStore();
const consumableItemStore = useConsumableStore();
const mainInventoryStore = useMainInventoryStore();
const adminInventoryStore = useAdminInventoryStore();

const openModalFromBreadcrumb = (item) => {
  if (item.label === "Add Item Consumable") {
    modalCreate.value = true;
  }
};

// Modal states
const modalCreate = ref(false);
const modalUpdate = ref(false);
const modalDelete = ref(false);
const deleteItemData = ref(null);
const modalTitle = ref("");
const isSubmitting = ref(false);
const selectedItems = ref([]);
const selectAll = ref(false);

// Form state for modal form borrowing
const selectedItemType = ref("");
const formErrors = ref({
  itemType: "",
  general: "",
});

const alertError = ref(false);
const alertSuccess = ref(false);
const alertWarning = ref(false);
const alertMessage = ref("");

function toggleAll() {
  if (selectAll.value) {
    exportData.value = "all";
    selectedItems.value = consumableItemStore.consumables.map(
      (item) => item.id
    );
  } else {
    exportData.value = "selected";
    selectedItems.value = [];
  }
}

const lastPage = ref(0);
const currentPage = ref(1);
const allItemCount = ref(0);
const maxVisiblePages = 3;
const sortByType = ref("");
const sortByQuantity = ref("");

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
      getConsumableItems();
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
      getConsumableItems();
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
    getConsumableItems();
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
    getConsumableItems();
  }, 500);
};

watch(selectedItems, (newVal) => {
  selectAll.value =
    newVal.length === consumableItemStore.consumables.length &&
    consumableItemStore.consumables.length > 0;
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

const openModalUpdate = (item) => {
  modalTitle.value = "Update Item";
  modalUpdate.value = true;
  isSubmitting.value = false;

  consumableItemStore.input = {
    id: item.id, // Add the id field
    name: item.name,
    quantity: item.quantity || 0,
    unit: item.unit || "",
  };
};

const closeModalUpdate = () => {
  modalUpdate.value = false;
  consumableItemStore.input = {};
};

const openModalDelete = (item) => {
  console.log("Opening delete modal for item:", item);
  deleteItemData.value = item;
  modalDelete.value = true;
};

const closeModalDelete = () => {
  console.log("Closing delete modal");
  modalDelete.value = false;
  deleteItemData.value = null;
};

const handleSort = (type) => {
  if (type === "type") {
    sortByType.value = sortByType.value === "asc" ? "desc" : "asc";
    sortByQuantity.value = "";
  } else if (type === "quantity") {
    sortByQuantity.value = sortByQuantity.value === "asc" ? "desc" : "asc";
    sortByType.value = "";
  }
  getConsumableItems();
};

const exportSelectedData = async () => {
  if (selectedItems.value.length === 0) {
    alertWarning.value = true;
    alertMessage.value = "Please select items to export";
    return;
  }

  try {
    const response = await fetch(`${url}/export/consumable-items`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authStore.token}`,
      },
      body: JSON.stringify({
        data: selectedItems.value,
        export: exportData.value,
        search: consumableItemStore.filter.search,
        sort_type: sortByType.value,
        sort_quantity: sortByQuantity.value,
      }),
    });

    if (response.ok) {
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `consumable_items_${new Date()
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

const pending = ref(true);

const getMainInventoryItems = async () => {
  const response = await $fetch(
    `${url}/item?search=${consumableItemStore.filter.search}&page=${currentPage.value}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authStore.token}`,
      },
    }
  );

  if (response.status === 200) {
    mainInventoryStore.inventory = response.data;
  }
};

const getConsumableItems = async () => {
  pending.value = true;
  try {
    const response = await $fetch(
      `${url}/consumable-item/data?search=${consumableItemStore.filter.search}&page=${currentPage.value}&sort_quantity=${sortByQuantity.value}&sort_type=${sortByType.value}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authStore.token}`,
        },
      }
    );

    if (response.status === 200) {
      consumableItemStore.consumables = response.data;

      if (response.meta) {
        lastPage.value = response.meta.last_page;
        allItemCount.value = response.meta.total;
      }

      pending.value = false;
    }
  } catch (error) {
    console.error("Error fetching consumable items:", error);
    alertError.value = true;
    alertMessage.value = "Error loading consumable items";
    pending.value = false;
  }
};

const createConsumableItem = async () => {
  if (isSubmitting.value) return;
  const { name, quantity, unit, major_id } = consumableItemStore.input;
  console.log("Consumable Item Form values:", consumableItemStore.input);

  if (!name || !quantity || !unit || !major_id) {
    showAlert("warning", "All fields must be filled");
    return;
  }

  isSubmitting.value = true;
  const formData = new FormData();

  formData.append("name", name);
  formData.append("quantity", quantity);
  formData.append("unit", unit);
  // Get major_id from the currently logged in user
  formData.append("major_id", major_id);

  try {
    const response = await $fetch(`${url}/consumable-item`, {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${authStore.token}`,
      },
    });

    console.log(response);

    if (response.status === 201 || response.status === 200) {
      getConsumableItems();
      closeModalCreate();
      showAlert("success", "Unit item created successfully!");
    }
  } catch (e) {
    console.error("Error creating unit item:", e);
    showAlert("error", "Failed to create unit item");
  } finally {
    isSubmitting.value = false;
  }
};

const updateConsumableItem = async () => {
  if (isSubmitting.value) return;
  const { id, name, quantity, unit } = consumableItemStore.input;

  if (!id) {
    showAlert("error", "Item ID is missing");
    return;
  }

  if (!name || !quantity || !unit) {
    showAlert("warning", "All fields must be filled");
    return;
  }

  isSubmitting.value = true;
  const payload = {
    name,
    quantity,
    unit,
  };

  try {
    const response = await $fetch(`${url}/consumable-item/${id}`, {
      method: "PUT",
      body: payload,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authStore.token}`,
      },
    });

    if (response.status === 200) {
      getConsumableItems();
      closeModalUpdate();
      showAlert("success", "Consumable item updated successfully!");
    }
  } catch (e) {
    console.error("Error updating consumable item:", e);
    showAlert(
      "error",
      `Failed to update consumable item: ${e.message || "Unknown error"}`
    );
  } finally {
    isSubmitting.value = false;
  }
};

const deleteConsumableItem = async () => {
  if (!deleteItemData.value || !deleteItemData.value.id) {
    showAlert("error", "Item ID is missing");
    return;
  }

  isSubmitting.value = true;
  try {
    console.log("Deleting consumable item with ID:", deleteItemData.value.id);

    const response = await $fetch(
      `${url}/consumable-item/${deleteItemData.value.id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authStore.token}`,
        },
      }
    );

    console.log("Delete response:", response);

    if (response.status === 200) {
      getConsumableItems();
      closeModalDelete();
      showAlert("success", "Consumable item deleted successfully!");
    }
  } catch (e) {
    console.error("Error deleting consumable item:", e);
    showAlert(
      "error",
      `Failed to delete consumable item: ${e.message || "Unknown error"}`
    );
  } finally {
    isSubmitting.value = false;
  }
};

onMounted(() => {
  getMainInventoryItems();
  getConsumableItems();
});
</script>
