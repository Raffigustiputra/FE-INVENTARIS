<template>
    <div>
        <Navbar :breadcrumbs="breadcrumbs" />

        <div class="flex items-center justify-between mt-12 mb-7">
            <h1 class="font-semibold text-2xl">Inventory</h1>
            <SearchBox text="Search inventory..." />
        </div>

        <div
            v-if="modaldelete"
            class="fixed top-0 left-0 z-40 flex items-center justify-center w-full h-screen bg-black/30">
            <Modal
                @btnClose="closeModalDelete"
                @btnSubmit="deleteItems"
                title="Delete Type"
                :isSubmitting="isSubmitting">
                <div class="w-full flex flex-col items-center py-4">
                    <div class="text-red-500 mb-3"></div>
                    <h3 class="text-lg font-medium text-gray-700 mb-2">Confirm Deletion</h3>
                    <p class="text-center text-gray-600">
                        Are you sure you want to delete
                        <span class="font-semibold"></span>
                        ?
                        <br />
                        <span class="text-sm text-red-500">This action cannot be undone.</span>
                    </p>
                </div>
            </Modal>
        </div>

        <!-- Tabel -->
        <div class="overflow-x-auto rounded-lg bg-[#F7F8F9]">
            <table class="min-w-full text-sm text-left">
                <thead class="bg-[#F7F8F9]">
                    <tr class="text-sm font-medium text-gray-700">
                        <th class="px-4 py-2 w-1">
                            <input
                                type="checkbox"
                                v-model="selectAll"
                                @change="toggleAll"
                                class="w-4 h-4 rounded-md border-2 border-gray-400 bg-gray-300 hover:cursor-pointer checked:border-blue-500" />
                        </th>
                        <th class="px-10 py-2">Type</th>
                        <th class="px-4 py-2 text-right">
                            <div class="mr-2">Action</div>
                        </th>
                    </tr>
                </thead>

                <tbody class="bg-white" v-for="item in mainInvetoryStore.inventory">
                    <tr :key="item.id">
                        <!-- Checkbox -->
                        <td class="px-4 py-4">
                            <input
                                type="checkbox"
                                v-model="selectedItems"
                                class="w-4 h-4 rounded-md border-2 border-gray-400 cursor-pointer" />
                        </td>

                        <!-- Name -->
                        <td class="px-10 py-4">
                            <NuxtLink
                                :to="`/admin/inventory`"
                                class="text-black text-xs font-medium">
                                {{ item.name }}
                            </NuxtLink>
                        </td>

                        <!-- Action -->
                        <td class="px-4 py-4 text-right">
                            <div class="inline-flex gap-1 items-center">
                                <ButtonEdit />
                                <ButtonDelete @click="openModalDelete(item)" />
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <p class="text-xs text-gray-500 mt-3 ml-2">Showing 1 to Items</p>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import {
    IconsNavbar,
    IconsNavbarIconsAddUser,
    IconsNavbarIconsFile,
    IconsNavbarIconsPrint,
} from '#components';

definePageMeta({
    layout: 'default',
    title: 'Inventory',
});

const url = useRuntimeConfig().public.authUrl;
const authStore = useAuthStore();
const router = useRouter();
const mainInvetoryStore = useMainInventoryStore();

const selectedItemId = ref(null);

const modaldelete = ref(false);
const openModalDelete = (item) => {
    selectedItemId.value = item.id;
    modaldelete.value = true;
};
const closeModalDelete = () => {
    modaldelete.value = false;
};

const getMainInvetoryItems = async () => {
    const response = await $fetch(`${url}/item`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authStore.token}`,
        },
    });

    if (response.status === 200) {
        mainInvetoryStore.inventory = response.data;
    }
};

const deleteItems = async () => {
    const response = await $fetch(`${url}/item/${selectedItemId.value}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authStore.token}`,
        },
    });

    if (response.status === 200) {
        getMainInvetoryItems();
        closeModalDelete();
    }
};

const breadcrumbs = [
    {
        label: 'Manage Inventory',
        icon: IconsNavbarIconsFile,
    },
    {
        label: 'Add Type',
        icon: IconsNavbarIconsAddUser,
    },
    {
        label: 'Print Selected',
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

onMounted(() => {
    getMainInvetoryItems();
});
</script>
