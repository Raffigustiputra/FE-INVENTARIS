<template>
    <div>
        <Navbar :breadcrumbs="breadcrumbs" />
        <div class="flex items-center justify-between mt-12 mb-4">
            <h1 class="font-semibold text-2xl">
                Activity / History
            </h1>
            <SearchBox text="Search History Activity..." />
        </div>
    </div>

    <div class="overflow-x-auto rounded-lg bg-white">
        <table class="min-w-full text-sm text-left">
            <thead class="bg-gray-100">
                <tr class="text-sm font-semibold text-gray-700">
                    <th class="px-4 py-3 w-10 text-center">
                        <input type="checkbox" />
                    </th>
                    <th class="px-4 py-3 text-center whitespace-nowrap w-24">Type</th>
                    <th class="px-4 py-3 whitespace-nowrap w-40">Unit Code</th>
                    <th class="px-4 py-3 text-center whitespace-nowrap w-24">Brand</th>
                    <th class="px-4 py-3 whitespace-nowrap w-40">Borrowed Time</th>
                    <th class="px-4 py-3 whitespace-nowrap w-40">Back Time</th>
                    <th class="px-4 py-3 text-center whitespace-nowrap w-24">Status</th>
                    <th class="px-4 py-3 text-center whitespace-nowrap w-24">Condition</th>
                    <th class="px-4 py-3 text-center whitespace-nowrap w-20">Action</th>
                </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="item in inventory" :key="item.code" class="hover:bg-gray-50">
                    <td class="px-4 py-3 text-center w-10">
                        <input type="checkbox" />
                    </td>
                    <td class="px-4 py-3 text-center w-24">{{ item.type }}</td>
                    <td class="px-4 py-3 w-40">{{ item.code }}</td>
                    <td class="px-4 py-3 text-center w-24">{{ item.brand }}</td>
                    <td class="px-4 py-3 w-40">{{ item.addedDate }}</td>
                    <td class="px-4 py-3 w-40">{{ item.addedDate }}</td>
                    <td class="px-4 py-3 text-center w-24">
                        <span
                            :class="statusClass(item.status)"
                            class="inline-block min-w-[80px] text-center px-3 py-1 rounded-md text-xs font-medium">
                            {{ item.status }}
                        </span>
                    </td>
                    <td class="px-4 py-3 text-center w-24">
                        <span
                            :class="conditionClass(item.condition)"
                            class="inline-block min-w-[80px] text-center px-3 py-1 rounded-md text-xs font-medium">
                            {{ item.condition }}
                        </span>
                    </td>
                    <td class="px-4 py-3 flex justify-center gap-2 w-20">
                        <button @click="OpenModal(item)">
                            <IconsExternal />
                        </button>
                    </td>
                </tr>
            </tbody>
        </table>
        <p class="text-xs text-gray-500 mt-3 ml-2">
            Showing 1 to {{ inventory.length }} of {{ inventory.length }} Laptop Lenovo
        </p>
        <!-- Modal Detail Borrowed -->
        <Transition name="fade">
            <div v-if="modal"
                class="fixed top-0 left-0 z-40 flex items-center justify-center w-full h-screen backdrop-blur-sm bg-black/30">
                <Modal @btnClose="Closemodal" title="Show Borrowed Details" :showActions="false">
                    <div class="grid grid-cols-2 gap-4 w-full p-2">
                        <InputText label="Item Type" :placeholder="selectedItem.type || '-'" disabled="true" />
                        <InputText label="Unit Code" :placeholder="selectedItem.code || '-'" disabled="true" />

                        <InputText label="Brand Name" :placeholder="selectedItem.brand || '-'" disabled="true" />
                        <InputText label="Borrowed Date" :placeholder="selectedItem.addedDate || '-'" disabled="true" />

                        <InputText label="Borrower's Name" :placeholder="selectedItem.borrowerName || '-'"
                            disabled="true" />
                        <InputText label="Borrower's NIS" :placeholder="selectedItem.nis || '-'" disabled="true" />

                        <InputText label="Borrower's Rombel" :placeholder="selectedItem.rombel || '-'"
                            disabled="true" />
                        <InputText label="Borrower's Rayon" :placeholder="selectedItem.rayon || '-'" disabled="true" />

                        <InputText label="Borrower's Room" :placeholder="selectedItem.room || '-'" disabled="true" />
                        <InputText label="Guarantee" :placeholder="selectedItem.guarantee || '-'" disabled="true" />

                        <div class="col-span-2">
                            <InputText label="Borrowing Reason" :placeholder="selectedItem.reason || '-'"
                                disabled="true" />
                        </div>
                    </div>
                </Modal>
            </div>
        </Transition>

    </div>
</template>
<script setup>
import { IconsNavbarIconsFile, IconsNavbarIconsFilterMajor, IconsNavbarIconsFilterRole, IconsNavbarIconsPrint } from '#components';

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

const inventory = [
    {
        type: 'Laptop',
        code: 'PPLG-LAPTOP-001',
        brand: 'Lenovo',
        addedDate: '31 Jul 2025',
        status: 'AVAILABLE',
        condition: 'GOOD',
        borrowerName: 'Nur Rizky',
        nis: '12345678',
        rombel: 'PPLG XII-5',
        rayon: 'Ciawi 5',
        room: '202',
        guarantee: 'BKP',
        reason: 'pengen aja',
    },
    {
        type: 'Laptop',
        code: 'PPLG-LAPTOP-002',
        brand: 'Lenovo',
        addedDate: '31 Jul 2025',
        status: 'AVAILABLE',
        condition: 'GOOD',
        borrowerName: 'Nur Rizky',
        nis: '12345678',
        rombel: 'PPLG XII-5',
        rayon: 'Ciawi 5',
        room: '202',
        guarantee: 'BKP',
        reason: 'pengen aja',
    },
    {
        type: 'Laptop',
        code: 'PPLG-LAPTOP-003',
        brand: 'Lenovo',
        addedDate: '31 Jul 2025',
        status: 'AVAILABLE',
        condition: 'GOOD',
        borrowerName: 'Nur Rizky',
        nis: '12345678',
        rombel: 'PPLG XII-5',
        rayon: 'Ciawi 5',
        room: '202',
        guarantee: 'BKP',
        reason: 'pengen aja',
    },
    {
        type: 'Laptop',
        code: 'PPLG-LAPTOP-004',
        brand: 'Lenovo',
        addedDate: '31 Jul 2025',
        status: 'BORROWED',
        condition: 'GOOD',
        borrowerName: 'Andika Satrio Nurcahyo',
        nis: '12309526',
        rombel: 'PPLG XII-5',
        rayon: 'Cicurug 8',
        room: '323',
        guarantee: 'Kartu Pelajar',
        reason: 'Pinjam Laptop untuk Mapel Produktif di 323',
    },
    {
        type: 'Laptop',
        code: 'PPLG-LAPTOP-005',
        brand: 'Lenovo',
        addedDate: '31 Jul 2025',
        status: 'UNAVAILABLE',
        condition: 'DAMAGED',
        borrowerName: 'Nur Rizky',
        nis: '12345678',
        rombel: 'PPLG XII-5',
        rayon: 'Ciawi 5',
        room: '202',
        guarantee: 'BKP',
        reason: 'pengen aja',
    },
    {
        type: 'Laptop',
        code: 'PPLG-LAPTOP-006',
        brand: 'Lenovo',
        addedDate: '31 Jul 2025',
        status: 'AVAILABLE',
        condition: 'GOOD',
        borrowerName: 'Nur Rizky',
        nis: '12345678',
        rombel: 'PPLG XII-5',
        rayon: 'Ciawi 5',
        room: '202',
        guarantee: 'BKP',
        reason: 'pengen aja',
    },
    {
        type: 'Laptop',
        code: 'PPLG-LAPTOP-007',
        brand: 'Lenovo',
        addedDate: '31 Jul 2025',
        status: 'AVAILABLE',
        condition: 'GOOD',
        borrowerName: 'Nur Rizky',
        nis: '12345678',
        rombel: 'PPLG XII-5',
        rayon: 'Ciawi 5',
        room: '202',
        guarantee: 'BKP',
        reason: 'pengen aja',
    },
];
let modal = ref(false)
let selectedItem = ref({})

const OpenModal = (item) => {
    selectedItem.value = item
    modal.value = true
}

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

const Closemodal = () => {
    modal.value = false
}

</script>
<style scoped>
.fade-enter-from,
.fade-leave-to {
    opacity: 0;
    transform: translateY(10px) scale(0.95);
}

.fade-enter-to,
.fade-leave-from {
    opacity: 1;
    transform: translateY(0) scale(1);
}

.fade-enter-active,
.fade-leave-active {
    transition: all 300ms cubic-bezier(0.22, 1, 0.36, 1);
}
</style>
