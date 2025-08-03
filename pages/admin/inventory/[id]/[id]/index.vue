<template>
    <div>
        <Navbar :breadcrumbs="breadcrumbs" />
        <div class="flex items-center justify-between mt-12 mb-4">
            <h1 class="font-semibold text-2xl">
                <NuxtLink to="/admin/inventory">Inventory /</NuxtLink>
                lengtop / lenodo
            </h1>
            <SearchBox />
        </div>
    </div>

    <div class="overflow-x-auto rounded-lg bg-white">
        <table class="min-w-full text-sm text-left">
            <thead class="bg-gray-100">
                <tr class="text-sm font-semibold text-gray-700">
                    <th class="px-4 py-3"><input type="checkbox" /></th>
                    <th class="px-4 py-3 text-center">Type</th>
                    <th class="px-4 py-3">Unit Code</th>
                    <th class="px-4 py-3 text-center">Brand</th>
                    <th class="px-4 py-3">Added Date</th>
                    <th class="px-4 py-3 text-center">Status</th>
                    <th class="px-4 py-3 text-center">Condition</th>
                    <th class="px-4 py-3 text-center">Action</th>
                </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="item in inventory" :key="item.code" class="hover:bg-gray-50">
                    <td class="px-4 py-3"><input type="checkbox" /></td>
                    <td class="px-4 py-3 text-center">{{ item.type }}</td>
                    <td class="px-4 py-3">{{ item.code }}</td>
                    <td class="px-4 py-3 text-center">{{ item.brand }}</td>
                    <td class="px-4 py-3">{{ item.addedDate }}</td>
                    <td class="px-4 py-3 text-center">
                        <span
                            :class="statusClass(item.status)"
                            class="inline-block min-w-[80px] text-center px-3 py-1 rounded-md text-xs font-medium">
                            {{ item.status }}
                        </span>
                    </td>
                    <td class="px-4 py-3 text-center">
                        <span
                            :class="conditionClass(item.condition)"
                            class="inline-block min-w-[80px] text-center px-3 py-1 rounded-md text-xs font-medium">
                            {{ item.condition }}
                        </span>
                    </td>
                    <td class="px-4 py-3 flex justify-center gap-2">
                        <ButtonEdit />
                        <ButtonDelete />
                    </td>
                </tr>
            </tbody>
        </table>
        <p class="text-xs text-gray-500 mt-3 ml-2">
            Showing 1 to {{ inventory.length }} of {{ inventory.length }} Laptop Lenovo
        </p>
    </div>
</template>
<script setup>
import { IconsNavbarIconsFile, IconsNavbarIconsPrint } from '#components';

const breadcrumbs = [
    {
        label: 'Manage Inventory',
        icon: IconsNavbarIconsFile,
    },
    {
        label: 'Print Selected',
        icon: IconsNavbarIconsPrint,
    },
];

const inventory = [
    {
        type: 'Laptop',
        code: 'PPLG-LAPTOP-001',
        brand: 'Lenovo',
        addedDate: '31 Jul 2025',
        status: 'AVAILABLE',
        condition: 'GOOD',
    },
    {
        type: 'Laptop',
        code: 'PPLG-LAPTOP-002',
        brand: 'Lenovo',
        addedDate: '31 Jul 2025',
        status: 'AVAILABLE',
        condition: 'GOOD',
    },
    {
        type: 'Laptop',
        code: 'PPLG-LAPTOP-003',
        brand: 'Lenovo',
        addedDate: '31 Jul 2025',
        status: 'AVAILABLE',
        condition: 'GOOD',
    },
    {
        type: 'Laptop',
        code: 'PPLG-LAPTOP-004',
        brand: 'Lenovo',
        addedDate: '31 Jul 2025',
        status: 'BORROWED',
        condition: 'GOOD',
    },
    {
        type: 'Laptop',
        code: 'PPLG-LAPTOP-005',
        brand: 'Lenovo',
        addedDate: '31 Jul 2025',
        status: 'UNAVAILABLE',
        condition: 'DAMAGED',
    },
    {
        type: 'Laptop',
        code: 'PPLG-LAPTOP-006',
        brand: 'Lenovo',
        addedDate: '31 Jul 2025',
        status: 'AVAILABLE',
        condition: 'GOOD',
    },
    {
        type: 'Laptop',
        code: 'PPLG-LAPTOP-007',
        brand: 'Lenovo',
        addedDate: '31 Jul 2025',
        status: 'AVAILABLE',
        condition: 'GOOD',
    },
];

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
            return 'bg-green-100 text-green-700';
        case 'DAMAGED':
            return 'bg-red-100 text-red-700';
        default:
            return 'bg-gray-100 text-gray-700';
    }
};
</script>
