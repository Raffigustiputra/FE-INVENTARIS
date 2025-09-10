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
    <AlertWarning class="z-50" v-if="alertWarning" :title="alertMessage" @hide="alertWarning = false" />
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
        <NuxtLink to="/kaprog/inventory/borrowable/">
          Reusable 
        </NuxtLink>
        <span v-if="pending" class="text-lg">/ ...</span>
        <template v-else>
            <span class="text-lg">/ </span>{{ matchingItemName }}
          </template>
      </h1>
      <SearchBox text="Search Anything..." v-model="subItemStore.filter.search" @input="handleSearch" />
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

  <TableSkeleton v-if="pending" :rows="4" :columns="7" />

  <div
    v-else
    class="overflow-x-auto overflow-y-auto rounded-lg bg-white max-h-[65vh]"
  >
    <table class="min-w-full text-sm text-left relative">
      <thead class="bg-gray-100 sticky top-0 z-10">
        <tr class="text-sm font-semibold text-gray-700">
          <th class="px-4 py-3 w-1">
            <input type="checkbox" v-model="selectAll" @change="toggleAll" />
          </th>
          <th class="px-10 py-3 text-left w-2">Type</th>
          <th class="px-6 py-3 text-center">Brand</th>
          <th class="px-6 py-3 text-center">Stock</th>
        </tr>
      </thead>
      <tbody
          class="bg-white"
          v-for="item in subItemStore.subItems"
          :key="item.id"
        >
          <tr class="border-b border-[#EEEEEE] hover:bg-gray-100">
            <td class="px-4 py-4 w-1">
              <input
                type="checkbox"
                v-model="selectedItems"
                :value="item.id"
                class="rounded-md border-2 border-gray-400 bg-gray-300 checked:border-blue-500"
                @click.stop
              />
            </td>
            <td class="px-10 py-4 text-left cursor-pointer" @click="viewItem(item)">{{ item.item.name }}</td>
            <td class="px-6 py-4 text-center cursor-pointer" @click="viewItem(item)">
                <span style="text-transform: capitalize;">{{ item.merk }}</span>
            </td>
            <td class="px-6 py-4 text-center cursor-pointer" @click="viewItem(item)">{{ item.stock }}</td>
          </tr>
        </tbody>
    </table>
  </div>

  <div class="flex items-center justify-between mt-4">
    <p class="text-xs text-gray-500">
      Showing {{ subItemStore.subItems.length > 0 ? 1 : 0 }} to
      {{ subItemStore.subItems.length }} of {{ countSubItems }} Inventory Items
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
import { darkenColor } from "~/lib/helper";

definePageMeta({
  title: "Borrowable",
});

const exportData = ref("selected");

const breadcrumbs = [
  {
    label: "Manage Inventory",
    icon: IconsNavbarIconsFile,
  },
  {
    label: "Add Item",
    icon: IconsNavbarIconsAddItem,
  },
  {
    label: "Export Selected",
    icon: IconsNavbarIconsPrint,
    click: () => exportSelectedData(),
  },
];

const viewItem = (item) => {
  navigateTo(`/kaprog/inventory/borrowable/${item.item.id}/${item.id}`);
};

const openModalFromBreadcrumb = (item) => {
  if (item.label === "Add Item") {
    modalCreate.value = true;
    // Auto-select item type based on subItemStore.subItems[0]?.item.name
    const currentItemName = matchingItemName.value;
    if (currentItemName) {
      const matchingItem = mainInventoryStore.inventory.find(type => type.name === currentItemName);
      if (matchingItem) {
        adminInventoryStore.input.item_id = matchingItem.id;
      }
    }
  }
};

const closeModalCreate = () => {
  modalCreate.value = false;
  adminInventoryStore.input = {};
};

const url = useRuntimeConfig().public.authUrl;
const authStore = useAuthStore();
const subItemStore = useSubItemStore();
const mainInventoryStore = useMainInventoryStore();
const adminInventoryStore = useAdminInventoryStore();

// Modal states
const route = useRoute();
const selectedItems = ref([]);
const sortByCondition = ref("asc");
const sortByDate = ref("asc");
const sortByType = ref("asc");
const selectAll = ref(false);
const modalCreate = ref(false);
const isSubmitting = ref(false);

const alertError = ref(false);
const alertSuccess = ref(false);
const alertWarning = ref(false);
const alertMessage = ref("");

function toggleAll() {
  if (selectAll.value) {
    exportData.value = "all";
    selectedItems.value = subItemStore.subItems.map((item) => item.id);
  } else {
    exportData.value = "selected";
    selectedItems.value = [];
  }
}

const lastPage = ref(0);
const currentPage = ref(1);
const countSubItems = ref(0);
const maxVisiblePages = 3;

const getMainInventoryItems = async () => {
  pending.value = true;
  const response = await $fetch(
    `${url}/item?search=${mainInventoryStore.filter.search}&page=${currentPage.value}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authStore.token}`,
      },
    }
  );

  if (response.status === 200) {
    pending.value = false;
    mainInventoryStore.inventory = response.data;
  }
};

const matchingItemName = computed(() => {
    const id = route.params.id;
    return mainInventoryStore.inventory.find(type => String(type.id) === id)?.name;
  });

const getSubItemInventory = async () => {
  pending.value = true;
  const response = await $fetch(`${url}/subitem/paginate?search=${subItemStore.filter.search}&page=${currentPage.value}}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authStore.token}`,
    },  
  });

  if (response.status === 200) {
    const id = route.params.id;
    subItemStore.subItems = response.data.filter(item => item.item && String(item.item.id) === id);
    lastPage.value = response.meta.last_page;
    countSubItems.value = response.data.filter(item => item.item && String(item.item.id) === id).length;
    pending.value = false;
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
    }, 3000);
  } else if (type === "success") {
    alertSuccess.value = true;
    setTimeout(() => {
      alertSuccess.value = false;
      alertMessage.value = "";
    }, 3000);
  } else {
    alert(message);
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
      getSubItemInventory();
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
      getSubItemInventory();
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
      getSubItemInventory();
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

const nextPage = async () => {
  if (currentPage.value < lastPage.value) {
    currentPage.value++;
    pending.value = true;
    console.log(currentPage.value);
    nextTick(() => {
      getSubItemInventory();
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
      getSubItemInventory();
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
    getSubItemInventory();
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
    getSubItemInventory();
  }, 500);
};

watch(selectedItems, (newVal) => {
  selectAll.value =
    newVal.length === subItemStore.subItems.length &&
    subItemStore.subItems.length > 0;
});

const pending = ref(true);
const error = ref(null);

const exportSelectedData = async () => {
  if (selectedItems.value.length === 0) {
    showAlert("warning", "Please select items to export");
    return;
  }

  try {
    const response = await fetch(`${url}/export/subitems`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authStore.token}`,
      },
      body: JSON.stringify({
        data: selectedItems.value,
        export: exportData.value,
        search: subItemStore.filter.search,
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
}
onMounted(() => {
  getSubItemInventory();
  getMainInventoryItems();
});
</script>
