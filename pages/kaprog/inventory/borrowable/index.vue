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
      <h1 class="font-semibold text-2xl">Inventory
        <div class="inline text-lg">/</div>
        Borrowed Items</h1>
      <SearchBox v-model="unitItemStore.filter.search" @input="handleSearch" />
    </div>
  </div>

  <!-- Modal Create Borrowable -->
  <div class="w-full">
    <Transition name="fade">
      <div
        v-if="modalCreate"
        class="fixed top-0 left-0 z-40 flex items-center justify-center w-full h-screen bg-black/30"
      >
        <Modal
          @btnClose="closeModalCreate"
          title="Add New Item"
          @btnSubmit="createUnitItem"
          :isSubmitting="isSubmitting"
          labelButton="Add Item"
        >
          <p class="text-sm font-medium text-[#727272] my-2">ITEM DETAILS</p>
          <div class="w-full flex items-center gap-2">
            <InputSelect
              class="w-1/2"
              label="Item Type"
              v-model="adminInventoryStore.input.item_id"
              @change="
                (event) =>
                  console.log('Selected item type:', event.target.value)
              "
            >
              <option
                v-for="type in mainInventoryStore.inventory"
                :key="type.id"
                :value="type.id"
              >
                {{ type.name }}
              </option>
            </InputSelect>
          </div>
          <div class="w-full flex items-center gap-2">
            <InputText
              class="w-1/2"
              label="Brand Name"
              placeholder="Enter Brand Name Here.."
              v-model="adminInventoryStore.input.merk"
            />
            <InputDate
              class="w-1/2"
              label="Added Date"
              v-model="adminInventoryStore.input.procurement_date"
            />
          </div>
          <InputTextarea
            label="Description"
            placeholder="Input Description Here.."
            v-model="adminInventoryStore.input.description"
          />
        </Modal>
      </div>
    </Transition>
  </div>

  <!-- Modal Update Borrowable -->
  <div class="w-full">
    <Transition name="fade">
      <div
        v-if="modalUpdate"
        class="fixed top-0 left-0 z-40 flex items-center justify-center w-full h-screen bg-black/30"
      >
        <Modal
          @btnSubmit="updateUnitItem"
          @btnClose="closeModalUpdate"
          title="Update Item"
          :isSubmitting="isSubmitting"
          labelButton="Update Item"
        >
          <div class="w-full flex items-center gap-2">
            <InputSelect
              class="w-1/2"
              label="Item Type"
              v-model="adminInventoryStore.input.item_id"
              @change="
                (event) =>
                  console.log('Selected item type:', event.target.value)
              "
            >
              <option
                v-for="type in mainInventoryStore.inventory"
                :key="type.id"
                :value="type.id"
              >
                {{ type.name }}
              </option>
            </InputSelect>
          </div>
          <div class="w-full flex items-center gap-2">
            <InputText
              class="w-1/2"
              label="Brand Name"
              placeholder="Enter Brand Name Here.."
              v-model="adminInventoryStore.input.merk"
            />
            <InputDate
              class="w-1/2"
              label="Added Date"
              v-model="adminInventoryStore.input.procurement_date"
            />
          </div>
          <div class="w-full flex items-center gap-2">
            <InputTextarea
              label="Description"
              placeholder="Input Description Here.."
              v-model="adminInventoryStore.input.description"
              rows="1"
            />
            <InputSelect
              class="w-full"
              label="Condition"
              v-model="adminInventoryStore.input.condition"
            >
              <option value="true">Good</option>
              <option value="false">Damaged</option>
            </InputSelect>
          </div>
        </Modal>
      </div>
    </Transition>
  </div>

  <!-- Modal Delete Borrowable -->
  <Transition name="fade">
    <div
      v-if="modalDelete"
      class="fixed top-0 left-0 z-40 flex items-center justify-center w-full h-screen bg-black/30"
    >
      <Modal
        @btnSubmit="deleteUnitItem"
        @btnClose="closeModalDelete"
        title="Confirm Deletion"
        :isSubmitting="isSubmitting"
        labelButton="Delete"
      >
        <div class="">
          <p class="text-gray-600">
            Are you sure you want to delete
            <span class="font-semibold">{{
              deleteItemData?.sub_item.item.name
            }}</span>
            with item code
            <span class="block"
              ><span class="font-semibold">{{ deleteItemData?.code_unit }}</span
              >?</span
            >
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
          <th class="px-4 py-3 text-center">Type</th>
          <th class="px-4 py-3 text-center">Unit Code</th>
          <th class="px-4 py-3 text-center">Brand</th>
          <th class="px-4 py-3 text-center">Borrowed Time</th>
          <th class="px-4 py-3 text-center">Status</th>
          <th class="px-4 py-3 text-center">Condition</th>
          <th class="px-4 py-3 text-center">Action</th>
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200">
        <tr
          v-for="item in unitItemStore.unitItems"
          :key="item.id"
          class="hover:bg-gray-50"
        >
          <td class="px-4 py-3">
            <input type="checkbox" v-model="selectedItems" :value="item.id" />
          </td>
          <td class="px-4 py-3 text-center">{{ item.sub_item.item.name }}</td>
          <td class="px-4 py-3 text-center">{{ item.code_unit }}</td>
          <td class="px-4 py-3 text-center">{{ item.sub_item.merk }}</td>
          <td class="px-4 py-3 text-center">
            {{ formatDate(item.procurement_date) }}
          </td>
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
      Showing {{ unitItemStore.unitItems.length > 0 ? 1 : 0 }} to
      {{ unitItemStore.unitItems.length }} of {{ allItemCount }} Inventory Items
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
  InputSelect,
} from "#components";
import { ref, onMounted, watch } from "vue";
import Pagination from "@/components/pagination/index.vue";
import { useUnitItemStore } from "@/stores/main-inventory";

definePageMeta({
  title: "Borrowable",
});
const url = useRuntimeConfig().public.authUrl;
const authStore = useAuthStore();
const unitItemStore = useUnitItemStore();
const mainInventoryStore = useMainInventoryStore();
const adminInventoryStore = useAdminInventoryStore();

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
    label: "Export Selected",
    icon: IconsNavbarIconsPrint,
  },
  {
    label: "Add Item",
    icon: IconsNavbarIconsAddItem,
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
  if (item.label === "Add Item Borrowable") {
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

const alertError = ref(false);
const alertSuccess = ref(false);
const alertWarning = ref(false);
const alertMessage = ref("");

function toggleAll() {
  if (selectAll.value) {
    selectedItems.value = unitItemStore.unitItems.map((item) => item.id);
  } else {
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
    getUnitItemsInventory();
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


const openModalUpdate = (item) => {
  modalTitle.value = "Update Item";
  modalUpdate.value = true;
  isSubmitting.value = false;

  // Convert condition to string for the select input
  let conditionValue = "true"; // Default to "true" (good)
  if (item.condition === false || item.condition === "false" || item.condition === "damaged") {
    conditionValue = "false";
  } else if (item.condition === true || item.condition === "true" || item.condition === "good") {
    conditionValue = "true";
  }

  adminInventoryStore.input = {
    id: item.id,
    item_id: item.sub_item?.item?.id || "",
    merk: item.sub_item?.merk || "",
    procurement_date: item.procurement_date || "",
    description: item.description || "",
    condition: conditionValue,
  };
};

const closeModalUpdate = () => {
  modalUpdate.value = false;
  adminInventoryStore.input = {};
};

const openModalDelete = (item) => {
  deleteItemData.value = item;
  modalDelete.value = true;
};

const closeModalDelete = () => {
  modalDelete.value = false;
  deleteItemData.value = null;
};

const pending = ref(true);
const error = ref(null);

const getMainInventoryItems = async () => {
  const response = await $fetch(
    `${url}/item?search=${unitItemStore.filter.search}&page=${currentPage.value}`,
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

const getUnitItemsInventory = async () => {
  pending.value = true;
  try {
    const response = await $fetch(
      `${url}/unit-items?search=${unitItemStore.filter.search}&page=${currentPage.value}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authStore.token}`,
        },
      }
    );

    if (response.status === 200) {
      unitItemStore.unitItems = response.data;

      if (response.meta) {
        lastPage.value = response.meta.last_page;
        allItemCount.value = response.meta.total;
      }

      pending.value = false;
    }
  } catch (error) {
    console.error("Error fetching unit items:", error);
    alertError.value = true;
    alertMessage.value = "Error loading inventory items";
    pending.value = false;
  }
};

const createUnitItem = async () => {
  if (isSubmitting.value) return;
  const { item_id, merk, description, procurement_date } =
    adminInventoryStore.input;
  console.log("Borrowable Item Form values:", adminInventoryStore.input);

  if (!item_id || !merk) {
    showAlert("warning", "Item type and brand name must be filled");
    return;
  }

  isSubmitting.value = true;
  const formData = new FormData();

  formData.append("item_id", item_id);
  formData.append("merk", merk);
  formData.append("description", description || "");
  formData.append(
    "procurement_date",
    procurement_date || new Date().toISOString().split("T")[0]
  );

  try {
    const response = await $fetch(`${url}/unit-items`, {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${authStore.token}`,
      },
    });

    console.log(response);

    if (response.status === 201 || response.status === 200) {
      getUnitItemsInventory();
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

const updateUnitItem = async () => {
  if (isSubmitting.value) return;
  const { id, item_id, merk, description, procurement_date, condition } =
    adminInventoryStore.input;

  if (!item_id || !merk) {
    showAlert("warning", "Item type and brand name must be filled");
    return;
  }

  // Convert string condition values to boolean for API
  let conditionValue;
  if (condition === 'true') {
    conditionValue = true;
  } else if (condition === 'false') {
    conditionValue = false;
  } else {
    // Default to true (good) if not specified
    conditionValue = true;
  }

  isSubmitting.value = true;
  const payload = {
    item_id,
    merk,
    description: description || "",
    procurement_date:
      procurement_date || new Date().toISOString().split("T")[0],
    condition: conditionValue
  };

  console.log("Sending update payload:", payload);

  try {
    const response = await $fetch(`${url}/unit-items/${id}`, {
      method: "PUT",
      body: payload,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authStore.token}`,
      },
    });

    if (response.status === 200) {
      getUnitItemsInventory();
      closeModalUpdate();
      showAlert("success", "Unit item updated successfully!");
    }
  } catch (e) {
    console.error("Error updating unit item:", e);
    showAlert("error", "Failed to update unit item");
  } finally {
    isSubmitting.value = false;
  }
};

const deleteUnitItem = async () => {
  isSubmitting.value = true;
  try {
    const response = await $fetch(
      `${url}/unit-items/${deleteItemData.value.id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authStore.token}`,
        },
      }
    );

    if (response.status === 200) {
      getUnitItemsInventory();
      closeModalDelete();
      showAlert("success", "Unit item deleted successfully!");
    }
  } catch (e) {
    console.error("Error deleting unit item:", e);
    showAlert("error", "Failed to delete unit item");
  } finally {
    isSubmitting.value = false;
  }
};

onMounted(() => {
  getMainInventoryItems();
  getUnitItemsInventory();
});

const statusClass = (status) => {
  switch ((status || "").toUpperCase()) {
    case "AVAILABLE":
      return "bg-green-200 text-green-700";
    case "BORROWED":
      return "bg-[#FFF3A4] text-[#978611]";
    case "UNAVAILABLE":
      return "bg-red-200 text-red-700";
    default:
      return "bg-gray-200 text-gray-700";
  }
};

const conditionClass = (condition) => {
  // Convert boolean values to string for display
  const conditionStr = condition === true || condition === 'true' ? 'GOOD' : 
                       condition === false || condition === 'false' ? 'DAMAGED' : 
                       String(condition || '').toUpperCase();
  
  switch (conditionStr) {
    case "GOOD":
    case "TRUE":
      return "bg-[#D2F3D8] text-[#59AE75]";
    case "DAMAGED":
    case "FALSE":
      return "bg-red-200 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const toUpperCase = (str) => {
  if (str === true || str === 'true') return "GOOD";
  if (str === false || str === 'false') return "DAMAGED";
  return str ? String(str).toUpperCase() : "";
};
</script>
