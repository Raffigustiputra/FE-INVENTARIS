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
</style>
<template>
  <div>
    <transition name="alert">
      <AlertSuccess 
        v-if="alertSuccess" 
        :title="alertMessage" 
        @hide="alertSuccess = false"
        style="z-index: 9999;"
      />
    </transition>

    <Navbar
      :breadcrumbs="breadcrumbs"
      @breadcrumbClick="handleBreadcrumbClickType"
    />

    <div class="flex items-center justify-between mt-12 mb-7">
      <h1 class="font-semibold text-2xl">Inventory</h1>
      <SearchBox text="Search inventory..." />
    </div>

    <div v-if="pending" class="space-y-4">
      <TableSkeleton 
        :rows="4" 
        :columns="4"
      />
    </div>

    <div v-else class="overflow-x-auto rounded-lg bg-[#F7F8F9]">
      <table class="min-w-full text-sm text-left">
        <thead class="bg-[#F7F8F9]">
          <tr class="text-sm font-medium text-gray-700">
            <th class="px-4 py-2 w-1">
              <input
                type="checkbox"
                v-model="selectAll"
                @change="toggleAll"
                class="w-4 h-4 rounded-md border-2 border-gray-400 bg-gray-300 hover:cursor-pointer checked:border-blue-500"
              />
            </th>
            <th class="px-10 py-2">Type</th>
            <th class="px-4 py-2 text-right">
              <div class="mr-2">Action</div>
            </th>
          </tr>
        </thead>

        <tbody class="bg-white">
          <tr
            v-for="item in items"
            :key="item.id"
            :class="[
              'border-b border-[#EEEEEE] hover:bg-gray-50',
              selectedItems.includes(item.id) ? 'bg-[#F7F8F9]' : '',
            ]"
          >
            <!-- Checkbox -->
            <td class="px-4 py-4">
              <input
                type="checkbox"
                v-model="selectedItems"
                :value="item.id"
                class="w-4 h-4 rounded-md border-2 border-gray-400 cursor-pointer"
              />
            </td>

            <!-- Name -->
            <td class="px-10 py-4">
              <NuxtLink
                :to="`/admin/inventory/${item.id}`"
                class="text-black text-xs font-medium"
                >{{ item.name }}</NuxtLink
              >
            </td>

            <td class="px-4 py-4 text-right">
              <div class="inline-flex gap-1 items-center">
                <ButtonEdit @click="OpenModalUpdate(item)" />
                <ButtonDelete @click="OpenModalDelete(item)" />
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <p class="text-xs text-gray-500 mt-3 ml-2">
      Showing {{ items.length > 0 ? 1 : 0 }} to {{ items.length }} of
      {{ items.length }} Items
    </p>
  </div>

  <!-- MODAL CREATE -->
  <div
    v-if="modal"
    class="fixed top-0 left-0 z-40 flex items-center justify-center w-full h-screen bg-black/30"
  >
    <Modal
      @btnClose="Closemodal"
      @btnSubmit="handleCreateItem"
      title="Add New Type"
      :isSubmitting="isSubmitting"
    >
      <div class="w-full flex items-center gap-2">
        <InputText
          class="w-full"
          label="Type Name"
          placeholder="Enter Type Name Here.."
          v-model="typeName"
          required
        />
      </div>
    </Modal>
  </div>

  <!-- MODAL UPDATE -->
  <div
    v-if="modalUpdate"
    class="fixed top-0 left-0 z-40 flex items-center justify-center w-full h-screen bg-black/30"
  >
    <Modal
      @btnClose="CloseModalUpdate"
      @btnSubmit="handleUpdateItem"
      title="Update Type"
      :isSubmitting="isSubmitting"
    >
      <div class="w-full flex items-center gap-2">
        <InputText
          class="w-full"
          label="Type Name"
          placeholder="Enter Type Name Here.."
          v-model="typeName"
          required
        />
      </div>
    </Modal>
  </div>

  <!-- MODAL DELETE -->
  <div
    v-if="modalDelete"
    class="fixed top-0 left-0 z-40 flex items-center justify-center w-full h-screen bg-black/30"
  >
    <Modal
      @btnClose="CloseModalDelete"
      @btnSubmit="handleDeleteItem"
      title="Delete Type"
      :isSubmitting="isSubmitting"
    >
      <div class="w-full flex flex-col items-center py-4">
        <div class="text-red-500 mb-3">
        </div>
        <h3 class="text-lg font-medium text-gray-700 mb-2">Confirm Deletion</h3>
        <p class="text-center text-gray-600">
          Are you sure you want to delete <span class="font-semibold">{{ deletingItem?.name }}</span>?
          <br><span class="text-sm text-red-500">This action cannot be undone.</span>
        </p>
      </div>
    </Modal>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import {
  IconsNavbarIconsAddUser,
  IconsNavbarIconsFile,
  IconsNavbarIconsPrint,
} from "#components";
import { useAuthStore } from "@/stores/auth";
import { useItem } from "~/composables/inventory/useItem";

definePageMeta({
  layout: "default",
  title: "Inventory",
});

let modal = ref(false);
let modalUpdate = ref(false);
let modalDelete = ref(false);
let typeName = ref("");
let isSubmitting = ref(false);
let editingItem = ref(null);
let deletingItem = ref(null);
let OpenModalDelete = (item) => {
  modalDelete.value = true;
  deletingItem.value = item;
};

let CloseModalDelete = () => {
  modalDelete.value = false;
  deletingItem.value = null;
  isSubmitting.value = false;
};

let alertSuccess = ref(false);
let alertMessage = ref("");

const showAlert = (type, message) => {
  
  if (type === 'success') {
    alertMessage.value = message;
    alertSuccess.value = true;
    setTimeout(() => {
      alertSuccess.value = false;
      alertMessage.value = "";
    }, 3000);
  }
};

let OpenModal = () => {
  modal.value = true;
  typeName.value = "";
};
let Closemodal = () => {
  modal.value = false;
  typeName.value = "";
  isSubmitting.value = false;
};

let OpenModalUpdate = (item) => {
  modalUpdate.value = true;
  editingItem.value = item;
  typeName.value = item.name;
};

let CloseModalUpdate = () => {
  modalUpdate.value = false;
  typeName.value = "";
  editingItem.value = null;
  isSubmitting.value = false;
};

const handleBreadcrumbClickType = (breadcrumb) => {
  if (breadcrumb.label === "Add Type") {
    OpenModal();
  }
};

const { items,pending, fetchItems, createItem, updateItem, deleteItem } = useItem();

const handleCreateItem = async () => {
  console.log("=== FORM SUBMISSION DEBUG ===");
  console.log("typeName.value:", typeName.value);
  console.log("typeName.value length:", typeName.value.length);
  console.log("typeName.value after trim:", typeName.value.trim());
  console.log(
    "typeName.value after trim length:",
    typeName.value.trim().length
  );

  if (!typeName.value.trim()) {
    console.log("Validation failed: empty name");
    alert("Please enter a type name");
    return;
  }

  try {
    isSubmitting.value = true;

    const itemData = {
      name: typeName.value.trim(),
    };

    const result = await createItem(itemData);

    if (result && result.success) {
      Closemodal();
      showAlert('success', 'Type created successfully!');
    } else {
      console.error("Full error response:", result);
      const errorMsg =
        result?.error?.data?.message ||
        result?.error?.message ||
        result?.error ||
        "Unknown error";
      alert("Failed to create type: " + errorMsg);
    }
  } catch (error) {
    console.error("Create item error:", error);
    alert("An error occurred while creating the type: " + error.message);
  } finally {
    isSubmitting.value = false;
  }
};

const handleUpdateItem = async () => {
  if (!typeName.value.trim()) {
    alert("Please enter a type name");
    return;
  }

  if (!editingItem.value) {
    alert("No item selected for update");
    return;
  }

  try {
    isSubmitting.value = true;

    const itemData = {
      id: editingItem.value.id,
      name: typeName.value.trim(),
    };

    const result = await updateItem(itemData);

    if (result && result.success) {
      CloseModalUpdate();
      showAlert('success', 'Type updated successfully!');
    } else {
      console.error("Full error response:", result);
      const errorMsg =
        result?.error?.data?.message ||
        result?.error?.message ||
        result?.error ||
        "Unknown error";
      alert("Failed to update type: " + errorMsg);
    }
  } catch (error) {
    console.error("Update item error:", error);
    alert("An error occurred while updating the type: " + error.message);
  } finally {
    isSubmitting.value = false;
  }
};

const handleDeleteItem = async () => {
  if (!deletingItem.value) {
    alert("No item selected for delete");
    return;
  }
  try {
    isSubmitting.value = true;
    const result = await deleteItem(deletingItem.value.id);
    if (result && result.success) {
      CloseModalDelete();
      showAlert('success', 'Type deleted successfully!');
    } else {
      const errorMsg =
        result?.error?.data?.message ||
        result?.error?.message ||
        result?.error ||
        "Unknown error";
      alert("Failed to delete type: " + errorMsg);
    }
  } catch (error) {
    alert("An error occurred while deleting the type: " + error.message);
  } finally {
    isSubmitting.value = false;
  }
};

onMounted(() => {
  console.log("Auth Store:", useAuthStore());
  console.log("Local URL:", useRuntimeConfig().public.authUrl);
  fetchItems();
});

const breadcrumbs = [
  {
    label: "Manage Inventory",
    icon: IconsNavbarIconsFile,
  },
  {
    label: "Add Type",
    icon: IconsNavbarIconsAddUser,
  },
  {
    label: "Print Selected",
    icon: IconsNavbarIconsPrint,
  },
];

const selectedItems = ref([]);
const selectAll = ref(false);

const selectedCell = ref({
  rowId: null,
  column: null,
});

function toggleAll() {
  if (selectAll.value) {
    selectedItems.value = items.value.map((item) => item.id);
  } else {
    selectedItems.value = [];
  }
}

function selectCell(rowId, column) {
  selectedCell.value = { rowId, column };
}

watch(selectedItems, (newVal) => {
  selectAll.value = newVal.length === items.value.length;
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
</style>
