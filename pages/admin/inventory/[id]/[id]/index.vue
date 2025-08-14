<template>
    <div>
        <Navbar :breadcrumbs="breadcrumbs" />
        <div class="flex items-center justify-between mt-12 mb-4">
            <h1 class="font-semibold text-2xl">
                <NuxtLink to="/admin/inventory">Inventory <span class="text-lg mx-1.5"> / </span> </NuxtLink>
                <NuxtLink 
                :to="`/admin/inventory/${unitItemStore.unitItems[0]?.sub_item.item_id}`"
                >
                    {{ unitItemStore.unitItems[0]?.sub_item.item.name || 'Unknown Item' }}
                </NuxtLink>
                <span class="text-lg mx-1.5"> /</span> {{ unitItemStore.unitItems[0]?.sub_item.merk || 'Unknown Sub Item' }}
            </h1>
            <SearchBox />
        </div>
    </div>

    <div class="overflow-x-auto rounded-lg bg-white">
        <table class="min-w-full text-sm text-left">
            <thead class="bg-gray-100">
                <tr class="text-sm font-semibold text-gray-700">
                    <th class="px-4 py-3">
                        <input
                            type="checkbox"
                            v-model="selectAll"
                            @change="toggleAll"
                        />
                    </th>
                    <th class="px-4 py-3 text-center">Type</th>
                    <th class="px-4 py-3">Unit Code</th>
                    <th class="px-4 py-3 text-center">Brand</th>
                    <th class="px-4 py-3">Added Date</th>
                    <th class="px-4 py-3 text-center">Status</th>
                    <th class="px-4 py-3 text-center">Condition</th>
                </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="item in unitItemStore.unitItems" :key="item.id" class="hover:bg-gray-50">
                    <td class="px-4 py-3">
                        <input
                            type="checkbox"
                            v-model="selectedItems"
                            :value="item.id"
                        />
                    </td>
                    <td class="px-4 py-3 text-center">{{ item.sub_item.item.name }}</td>
                    <td class="px-4 py-3">{{ item.code_unit }}</td>
                    <td class="px-4 py-3 text-center">{{ item.sub_item.merk }}</td>
                    <td class="px-4 py-3">{{ formatDate(item.procurement_date) }}</td>
                    <td class="px-4 py-3 text-center">
                        <span
                            :class="statusClass(statusText(item.status, item.condition))"
                            class="inline-block min-w-[80px] text-center px-3 py-1 rounded-md text-xs font-medium">
                            {{ statusText(item.status, item.condition) }}
                        </span>
                    </td>
                    <td class="px-4 py-3 text-center">
                        <span
                            :class="conditionClass(conditionText(item.condition))"
                            class="inline-block min-w-[80px] text-center px-3 py-1 rounded-md text-xs font-medium">
                            {{ conditionText(item.condition) }}
                        </span>
                    </td>
                </tr>
            </tbody>
        </table>
        <p class="text-xs text-gray-500 mt-3 ml-2">
            Showing 1 to {{ unitItemStore.unitItems.length }} of {{ unitItemStore.unitItems.length }} Laptop Lenovo
        </p>
    </div>
</template>
<script setup>
import { IconsNavbarIconsFile, IconsNavbarIconsFilterMajor, IconsNavbarIconsFilterRole, IconsNavbarIconsPrint } from '#components';
import { ref, onMounted, watch } from "vue";
import { useRoute } from "vue-router";

definePageMeta({
  title: "Inventory",
});

const breadcrumbs = [
    {
        label: 'Manage Inventory',
        icon: IconsNavbarIconsFile,
    },
    {
        label: 'Print Selected',
        icon: IconsNavbarIconsPrint,
    },
    {
    label: "Sort by Major",
    icon: IconsNavbarIconsFilterMajor,
  },
  {
    label: "Sort by Condition",
    icon: IconsNavbarIconsFilterRole,
  }
];

const url = useRuntimeConfig().public.authUrl;
const unitItemStore = useUnitItemStore();
const route = useRoute();

const getUnitItemsInventory = async () => {
    const response = await $fetch(`${url}/unit-items`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${useAuthStore().token}`,
        },
    });

    if (response.status === 200) {
        const id = route.params.id;
        unitItemStore.unitItems = response.data.filter(
            item => item.sub_item && String(item.sub_item.id) === id
        );
    }
}

onMounted(() => {
    getUnitItemsInventory();
});

const statusClass = (status) => {
    switch (status) {
        case 'AVAILABLE':
            return 'bg-green-200 text-green-700';
        case 'BORROWED':
            return 'bg-yellow-200 text-yellow-800';
        case 'UNAVAILABLE':
            return 'bg-red-200 text-red-700';
        default:
            return 'bg-gray-200 text-gray-700';
    }
};

const conditionClass = (condition) => {
    switch (condition) {
        case 'GOOD':
            return 'bg-green-200 text-green-700';
        case 'DAMAGED':
            return 'bg-red-200 text-red-700';
        default:
            return 'bg-gray-100 text-gray-700';
    }
};

const conditionText = (condition) => {
    switch (condition) {
        case 0: return 'DAMAGED';
        case 1: return 'GOOD';
        default: return 'UNKNOWN';
    }
};

const statusText = (status, condition) => {
    if (condition === 0) return 'UNAVAILABLE';
    switch (status) {
        case 0: return 'BORROWED';
        case 1: return 'AVAILABLE';
        case 2: return 'UNAVAILABLE';
        default: return 'UNKNOWN';
    }
};

const selectedItems = ref([]);
const selectAll = ref(false);

function toggleAll() {
    if (selectAll.value) {
        selectedItems.value = unitItemStore.unitItems.map((item) => item.id);
    } else {
        selectedItems.value = [];
    }
}

watch(selectedItems, (newVal) => {
    selectAll.value = newVal.length === unitItemStore.unitItems.length && unitItemStore.unitItems.length > 0;
});

const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const day = date.getDate();
    const month = date.toLocaleString('en-US', { month: 'short' });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
};
</script>
