<template>
    <div>
        <Navbar :breadcrumbs="breadcrumbs" />
        <div class="flex items-center justify-between mt-12 mb-4">
            <h1 class="font-semibold text-2xl">
                <NuxtLink to="/admin/inventory">Inventory /</NuxtLink>
            </h1>
            <SearchBox />
        </div>

        <div class="overflow-x-auto mt-7 rounded-lg bg-[#F7F8F9]">
            <table class="min-w-full text-sm text-left">
                <thead class="bg-[#F7F8F9]">
                    <tr class="text-sm font-medium text-gray-700">
                        <th class="px-4 py-2 w-1">
                            <input
                                type="checkbox"
                                v-model="selectAll"
                                @change="toggleAll"
                                class="w-4 h-4 rounded-md border-2 border-gray-400 bg-gray-300 checked:border-blue-500" />
                        </th>
                        <th class="px-6 py-2 text-center">Type</th>
                        <th class="px-6 py-2 text-center">Brand</th>
                        <th class="px-6 py-2">Stock</th>
                        <th class="px-6 py-2 text-center">Major</th>
                        <th class="px-4 py-2 text-right"><div class="mr-2">Action</div></th>
                    </tr>
                </thead>
                <tbody class="bg-white">
                    <tr
                        v-for="(item, index) in items"
                        :key="item.id"
                        class="border-b border-[#EEEEEE] hover:bg-gray-50">
                        <td class="px-4 py-4">
                            <input
                                type="checkbox"
                                v-model="selectedItems"
                                :value="item.id"
                                class="w-4 h-4 rounded-md border-2 border-gray-400 bg-gray-300 checked:border-blue-500" />
                        </td>
                        <td class="px-6 py-4 text-center">{{ item.type }}</td>
                        <td class="px-6 py-4 text-center">
                            <NuxtLink
                                :to="`/admin/inventory/${item.id}/${item.id}`"
                                class="text-black text-xs font-medium">
                                {{ item.brand }}
                            </NuxtLink>
                        </td>
                        <td class="px-6 py-4">{{ item.stock }}</td>
                        <td class="px-6 py-4 text-center">
                            <div class="bg-blue-300 w-24 py-0.5 rounded-md inline-block">
                                <span class="text-white text-xs font-medium">{{ item.major }}</span>
                            </div>
                        </td>
                        <td class="px-4 py-4 text-right">
                            <div class="inline-flex gap-1 items-center">
                                <ButtonEdit />
                                <ButtonDelete />
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup>
import {
    IconsNavbarIconsFile,
    IconsNavbarIconsFilterMajor,
    IconsNavbarIconsFilterRole,
    IconsNavbarIconsPrint,
} from '#components';

definePageMeta({
    title: 'Inventory',
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
        label: 'Sort by Major',
        icon: IconsNavbarIconsFilterMajor,
    },
    {
        label: 'Sort by Stock',
        icon: IconsNavbarIconsFilterRole,
    },
];

const items = ref([
    { id: 1, type: 'Laptop', brand: 'Lenovo', stock: 15, major: 'RPL' },
    { id: 2, type: 'Laptop', brand: 'Acer', stock: 10, major: 'TKJ' },
    { id: 3, type: 'Laptop', brand: 'Asus', stock: 8, major: 'RPL' },
    { id: 4, type: 'Laptop', brand: 'HP', stock: 12, major: 'MM' },
    { id: 5, type: 'Laptop', brand: 'Dell', stock: 7, major: 'DKV' },
    { id: 6, type: 'Laptop', brand: 'MSI', stock: 5, major: 'TKJ' },
    { id: 7, type: 'Laptop', brand: 'Macbook', stock: 3, major: 'RPL' },
]);

const selectedItems = ref([]);
const selectAll = ref(false);

const toggleAll = () => {
    if (selectAll.value) {
        selectedItems.value = items.value.map((item) => item.id);
    } else {
        selectedItems.value = [];
    }
};
</script>
