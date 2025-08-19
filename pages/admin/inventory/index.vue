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
  <div>
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
    <Navbar
      :breadcrumbs="breadcrumbs"
      @breadcrumbClick="handleBreadcrumbClick"
    />
    <div class="flex items-center justify-between mt-12 mb-7">
      <h1 class="font-semibold text-2xl">Inventory</h1>
      <SearchBox text="Search inventory..." />
    </div>

    <!-- Modal Create -->
    <Transition name="fade">
      <div
        v-if="modalCreate"
        class="fixed top-0 left-0 z-40 flex items-center justify-center w-full h-screen bg-black/30"
      >
        <Modal
          @btnClose="closeCreateModal"
          @btnSubmit="createItem"
          title="Create Type"
          :isSubmitting="isSubmitting"
        >
          <div class="w-full flex flex-col py-4">
            <div class="mb-4">
              <label
                class="block text-gray-700 text-sm font-medium mb-2"
                for="itemName"
              >
                Item Name
              </label>
              <input
                id="itemName"
                v-model="mainInventoryStore.input.name"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter item name"
              />
            </div>
          </div>
        </Modal>
      </div>
    </Transition>
  
    <!-- Modal Update -->
    <Transition name="fade">
      <div
        v-if="modalUpdate"
        class="fixed top-0 left-0 z-40 flex items-center justify-center w-full h-screen bg-black/30"
      >
        <Modal
          @btnClose="closeModalUpdate"
          @btnSubmit="updateItem"
          title="Update Type"
          :isSubmitting="isSubmitting"
        >
          <div class="w-full flex flex-col py-4">
            <div class="mb-4">
              <label
                class="block text-gray-700 text-sm font-medium mb-2"
                for="itemName"
              >
                Item Name
              </label>
              <input
                id="itemName"
                v-model="mainInventoryStore.input.name"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter item name"
              />
            </div>
          </div>
        </Modal>
      </div>
    </Transition>
  
    <!-- Modal Delete -->
    <Transition name="fade">
      <div
        v-if="modalDelete"
        class="fixed top-0 left-0 z-40 flex items-center justify-center w-full h-screen bg-black/30"
      >
        <Modal
          @btnClose="closeModalDelete"
          @btnSubmit="deleteItems"
          title="Delete Type"
          :isSubmitting="isSubmitting"
        >
          <div class="w-full flex flex-col items-center py-4">
            <div class="text-red-500 mb-3"></div>
            <h3 class="text-lg font-medium text-gray-700 mb-2">
              Confirm Deletion
            </h3>
            <p class="text-center text-gray-600">
              Are you sure you want to delete
              <span class="font-semibold">{{ deleteItemData?.name }}</span>
              ?
              <br />
            </p>
          </div>
        </Modal>
      </div>
    </Transition>

    <!-- SKELETON -->
     <TableSkeleton v-if="pending"
        :rows="3"
        :columns="5"
     />

    <!-- Tabel -->
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

        <tbody class="bg-white" v-for="item in mainInventoryStore.inventory">
          <tr 
              :key="item.id"
              class="hover:bg-gray-100 transition-colors duration-200"
            >
            <!-- Checkbox -->
            <td class="px-4 py-4">
              <input
                type="checkbox"
                v-model="selectedItems"
                :value="item.id"
                class="w-4 h-4 rounded-md border-2 border-gray-400 cursor-pointer"
                @click.stop
              />
            </td>

            <!-- Name -->
            <td class="px-10 w-full py-4 cursor-pointer" @click="viewItem(item.id)">
                {{ item.name }}
            </td>

            <!-- Action -->
            <td class="px-4 py-4 text-right">
              <div class="inline-flex gap-1 items-center">
                <ButtonEdit @click.stop="openModalUpdate(item)" />
                <ButtonDelete @click.stop="openModalDelete(item)" />
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <p class="text-xs text-gray-500 mt-3 ml-2">
      Showing {{ mainInventoryStore.inventory.length > 0 ? 1 : 0 }} to {{ mainInventoryStore.inventory.length }} of
      {{ mainInventoryStore.inventory.length }} Items
    </p>
  </div>
</template>

<script setup>
import { ref, Transition, watch } from "vue";
import {
  IconsNavbarIconsAddUser,
  IconsNavbarIconsFile,
  IconsNavbarIconsPrint,
} from "#components";

definePageMeta({
  layout: "default",
  title: "Inventory",
});

const url = useRuntimeConfig().public.authUrl;
const authStore = useAuthStore();
const mainInventoryStore = useMainInventoryStore();

const selectedItemId = ref(null);

const alertError = ref(false);
const alertMessage = ref("");
const alertSuccess = ref(false);
const alertWarning = ref(false);

const viewItem = (id) => {
  navigateTo(`/admin/inventory/${id}`);
};

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

const modalCreate = ref(false);
const openCreateModal = () => {
  mainInventoryStore.input = { name: "" };
  modalCreate.value = true;
};
const closeCreateModal = () => {
  modalCreate.value = false;
  mainInventoryStore.input = {};
};

const modalUpdate = ref(false);
const openModalUpdate = (item) => {
  selectedItemId.value = item.id;
  mainInventoryStore.input = { ...item };
  modalUpdate.value = true;
};
const closeModalUpdate = () => {
  modalUpdate.value = false;
  mainInventoryStore.input = {};
};

const modalDelete = ref(false);
const deleteItemData = ref(null);
const openModalDelete = (item) => {
  selectedItemId.value = item.id;
  deleteItemData.value = item;
  modalDelete.value = true;
};
const closeModalDelete = () => {
  modalDelete.value = false;
  deleteItemData.value = null;
};

const getMainInvetoryItems = async () => {
  const response = await $fetch(`${url}/item`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authStore.token}`,
    },
  });

  if (response.status === 200) {
    mainInventoryStore.inventory = response.data;
    // pending.value = false;
  }
};

const isSubmitting = ref(false);

const createItem = async () => {
  if (!mainInventoryStore.input.name || mainInventoryStore.input.name.trim() === "") {
    showAlert("warning", "Type name cannot be empty");
    return;
  }
  isSubmitting.value = true;
  const response = await $fetch(`${url}/item`, {
    method: "POST",
    body: mainInventoryStore.input,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authStore.token}`,
    },
  });
  isSubmitting.value = false;

  if (response.status === 201 || response.status === 200) {
    getMainInvetoryItems();
    closeCreateModal();
    showAlert("success", "Type created successfully!");
  }
};

const updateItem = async () => {
  if (!mainInventoryStore.input.name || mainInventoryStore.input.name.trim() === "") {
    showAlert("warning", "Type name cannot be empty");
    return;
  }
  isSubmitting.value = true;
  const response = await $fetch(`${url}/item/${selectedItemId.value}`, {
    method: "PUT",
    body: mainInventoryStore.input,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authStore.token}`,
    },
  });
  isSubmitting.value = false;

  if (response.status === 200) {
    getMainInvetoryItems();
    closeModalUpdate();
    showAlert("success", "Type updated successfully!");
  }
};

const deleteItems = async () => {
  if (!selectedItemId.value) {
    showAlert("warning", "No item selected for deletion");
    return;
  }
  isSubmitting.value = true;
  const response = await $fetch(`${url}/item/${selectedItemId.value}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authStore.token}`,
    },
  });
  isSubmitting.value = false;

  if (response.status === 200) {
    getMainInvetoryItems();
    closeModalDelete();
    showAlert("success", "Type deleted successfully!");
  }
};

const breadcrumbs = [
  {
    label: "Manage Inventory",
    icon: IconsNavbarIconsFile,
  },
  {
    label: "Add Type",
    icon: IconsNavbarIconsAddUser,
    onClick: openCreateModal,
  },
  {
    label: "Print Selected",
    icon: IconsNavbarIconsPrint,
  },
];

const selectedItems = ref([]);
const selectAll = ref(false);

function toggleAll() {
  if (selectAll.value) {
    selectedItems.value = mainInventoryStore.inventory.map((item) => item.id);
  } else {
    selectedItems.value = [];
  }
}

watch(selectedItems, (newVal) => {
  selectAll.value = newVal.length === mainInventoryStore.inventory.length && mainInventoryStore.inventory.length > 0;
});

onMounted(() => {
  getMainInvetoryItems();
});

function handleBreadcrumbClick(item) {
  if (item.onClick) item.onClick();
}
</script>
