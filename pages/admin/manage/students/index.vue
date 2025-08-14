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
            <AlertError
                class="z-50"
                v-if="alertError"
                :title="alertMessage"
                @hide="alertError = false" />
        </transition>
        <transition name="alert">
            <AlertSuccess
                class="z-50"
                v-if="alertSuccess"
                :title="alertMessage"
                @hide="alertSuccess = false" />
        </transition>
        <transition name="alert">
            <AlertWarning class="z-50" v-if="alertWarning" :title="alertMessage" />
        </transition>
        <Transition name="fade">
            <div
                v-if="modalImport"
                class="fixed top-0 left-0 z-40 flex items-center justify-center w-full h-screen backdrop-blur-sm bg-black/30">
                <Modal
                    @btnSubmit="submitImportStudent"
                    @btnClose="closeModalImport"
                    title="Import Student">
                    <div
                        class="w-full border-2 border-gray-300 rounded-lg p-8 min-h-[180px] flex flex-col items-center justify-center text-gray-500">
                        <IconsUpload class="w-10 h-10 mb-3 text-gray-400" />

                        <!-- Kalau belum ada file -->
                        <template v-if="!fileImport">
                            <p>
                                Drag & Drop or
                                <label class="text-blue-500 cursor-pointer">
                                    Choose File
                                    <input
                                        type="file"
                                        accept=".csv,.xlsx"
                                        class="hidden"
                                        @change="handleFileUpload" />
                                </label>
                                to upload
                            </p>
                            <p class="text-xs mt-1">CSV or XLSX</p>
                        </template>

                        <!-- Kalau sudah ada file -->
                        <template v-else>
                            <p class="mt-3 text-sm text-gray-700 font-medium">
                                📄 {{ fileImport.name }}
                            </p>
                            <label class="mt-2 text-blue-500 cursor-pointer text-sm">
                                Change File
                                <input
                                    type="file"
                                    accept=".csv,.xlsx"
                                    class="hidden"
                                    @change="handleFileUpload" />
                            </label>
                        </template>
                    </div>
                </Modal>
            </div>
        </Transition>
        <Navbar :breadcrumbs="breadcrumbs" @breadcrumbClick="handleBreadcrumbClick" />
        <div class="flex items-center justify-between mt-12 mb-7">
            <h1 class="font-semibold text-2xl">List Students</h1>
            <div class="w-64 h-9 p-2 border-2 border-[#E0E0E0] rounded-md flex items-center gap-2">
                <IconsSearchIcon class="w-6 h-6 text-gray-500" />
                <input
                    type="text"
                    v-model="studentStore.filter.search"
                    @input="handleSearch"
                    class="outline-none w-full" />
            </div>
        </div>

        <TableSkeleton v-if="pending" :rows="5" :columns="5" />

        <div v-else class="overflow-x-auto rounded-lg bg-[#F7F8F9]">
            <table class="min-w-full text-sm">
                <thead class="h-6 bg-[#F7F8F9] rounded-t-lg">
                    <tr class="text-sm font-medium text-gray-700">
                        <th class="px-8 py-2 w-3/12 text-left">Name</th>
                        <th class="px-4 py-2 w-3/12 text-center">NIS</th>
                        <th class="px-4 py-2 w-2/12 text-center">Rayon</th>
                        <th class="px-4 py-2 w-3/12 text-center">Major</th>
                        <th class="px-4 py-2 w-3/12 text-right">
                            <div class="mr-2">Action</div>
                        </th>
                    </tr>
                </thead>
                <tbody class="bg-white">
                    <tr
                        v-for="i in studentStore.students"
                        :key="i"
                        class="border-b border-[#EEEEEE] hover:bg-gray-50">
                        <!-- Name -->
                        <td class="flex items-center gap-2 px-8 py-4 text-left">
                            <IconsUserIcon />
                            <span class="text-xs font-medium">{{ i.name }}</span>
                        </td>

                        <!-- NIS -->
                        <td class="px-4 py-4 text-center">
                            <span class="text-xs font-medium">{{ i.nis }}</span>
                        </td>

                        <!-- Rayon -->
                        <td class="px-4 py-4 text-center">
                            <span class="text-xs font-medium">{{ i.rayon }}</span>
                        </td>

                        <!-- Major -->
                        <td class="px-4 py-4 text-center">
                            <div
                                :style="{
                                    backgroundColor: `rgba(${parseInt(
                                        i.major?.color.slice(1, 3),
                                        16
                                    )}, ${parseInt(i.major?.color.slice(3, 5), 16)}, ${parseInt(
                                        i.major?.color.slice(5, 7),
                                        16
                                    )}, 0.8)`,
                                }"
                                class="w-24 flex justify-center items-center rounded-md py-1 mx-auto">
                                <span
                                    :style="{ color: darkenColor(i.major?.color, 70) }"
                                    class="text-xs font-medium">
                                    {{ i.major?.name || 'N/A' }}
                                </span>
                            </div>
                        </td>

                        <!-- Action -->
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
<div class="flex items-center justify-between mt-4">
    <!-- Info jumlah -->
    <p class="text-xs text-gray-500">
        Showing {{ studentStore.students.length }} of {{ allStudentCount }} Accounts
    </p>

    <!-- Pagination -->
    <div class="flex items-center gap-1">
        <!-- Prev -->
        <button
            @click="prevPage"
            :disabled="currentPage === 1"
            class="w-8 h-8 flex items-center justify-center rounded text-gray-500 disabled:opacity-40 hover:bg-gray-200 transition">
            ‹
        </button>

        <!-- Numbers -->
        <template v-for="page in paginationItems" :key="page">
            <button
                v-if="page !== '...'"
                @click="changePage(page)"
                :class="[
                    'w-8 h-8 flex items-center justify-center rounded transition',
                    currentPage === page
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                ]">
                {{ page }}
            </button>
            <span v-else class="px-2 text-gray-500">...</span>
        </template>

        <!-- Next -->
        <button
            @click="nextPage"
            :disabled="currentPage === lastPage"
            class="w-8 h-8 flex items-center justify-center rounded text-gray-500 disabled:opacity-40 hover:bg-gray-200 transition">
            ›
        </button>
    </div>
</div>

    </div>
</template>

<script setup>
import {
    IconsNavbarIconsAddUser,
    IconsNavbarIconsFilterMajor,
    IconsNavbarIconsFilterRole,
    IconsNavbarIconsManageUser,
} from '#components';
import { useAuthStore } from '@/stores/auth';

definePageMeta({
    layout: 'default',
    title: 'Accounts',
});

const authStore = useAuthStore();
const url = useRuntimeConfig().public.authUrl;
const studentStore = useStudentStore();

const lastPage = ref(0);
const currentPage = ref(1);
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
            pages.push('...');
            pages.push(lastPage.value);
        } else if (currentPage.value >= lastPage.value - halfVisible) {
            pages.push(1);
            pages.push('...');
            for (let i = lastPage.value - (maxVisiblePages - 2); i <= lastPage.value; i++) {
                pages.push(i);
            }
        } else {
            pages.push(1);
            pages.push('...');
            for (
                let i = currentPage.value - halfVisible + 1;
                i <= currentPage.value + halfVisible - 1;
                i++
            ) {
                pages.push(i);
            }
            pages.push('...');
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
            getStudent();
            window.scrollTo({
                top: document.documentElement.scrollHeight,
                behavior: 'smooth',
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
            getStudent();
            window.scrollTo({
                top: document.documentElement.scrollHeight,
                behavior: 'smooth',
            });
        });
    }
};

const changePage = async (page) => {
    if (page !== '...') {
        currentPage.value = page;
        pending.value = true;
        console.log(currentPage.value);
    }
    nextTick(() => {
        getStudent();
        window.scrollTo({
            top: document.documentElement.scrollHeight,
            behavior: 'smooth',
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
        getStudent();
    }, 500);
};

let modalCreate = ref(false);
let modalEdit = ref(false);
let modalDelete = ref(false);
let Closemodal = () => {
    modalCreate.value = false;
    modalEdit.value = false;
    modalDelete.value = false;
};

const modalImport = ref(false);
const fileImport = ref(null);

const handleFileUpload = (event) => {
    fileImport.value = event.target.files[0];
};

const openModalImport = () => {
    modalImport.value = true;
};

const closeModalImport = () => {
    modalImport.value = false;
    fileImport.value = null;
};

const alertError = ref(false);
const alertMessage = ref('');
const alertSuccess = ref(false);
const alertWarning = ref(false);

const showAlert = (type, message) => {
    alertMessage.value = message;

    if (type === 'error') {
        alertError.value = true;
        setTimeout(() => {
            alertError.value = false;
            alertMessage.value = '';
        }, 3000);
    } else if (type === 'warning') {
        alertWarning.value = true;
        setTimeout(() => {
            alertWarning.value = false;
            alertMessage.value = '';
        }, 2500);
    } else if (type === 'success') {
        alertSuccess.value = true;
        setTimeout(() => {
            alertSuccess.value = false;
            alertMessage.value = '';
        }, 2500);
    } else {
        alert(message);
    }
};

const pending = ref(true);
const error = ref(null);

const submitImportStudent = async () => {
    if (!fileImport.value) {
        alert('Please select a file');
        return;
    }
    const formData = new FormData();
    formData.append('file', fileImport.value);

    try {
        const response = await $fetch(`${url}/student/import`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${authStore.token}`,
            },
            body: formData,
        });

        if (response.status === 'success') {
            alertTitle.value = 'Import successful';
            alertSubtitle.value = response.message;
            alertShow.value = true;

            setTimeout(() => {
                alertShow.value = false;
            }, 3000);

            getStudent();
        } else {
            alertTitle.value = 'Import failed';
            alertSubtitle.value = response.message || 'Please try again';
            alertShow.value = true;

            setTimeout(() => {
                alertShow.value = false;
            }, 3000);
        }
    } catch (err) {
        console.error(err);
        alertTitle.value = 'Error';
        alertSubtitle.value = 'Error while importing file';
        alertShow.value = true;
    } finally {
        closeModalImport();
    }
};

const allStudentCount = ref(0);

const getStudent = async () => {
    const response = await $fetch(
        `${url}/student/data?search=${studentStore.filter.search}&page=${currentPage.value}`,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${authStore.token}`,
            },
        }
    );

    if (response.status === 200 || response.status === 201) {
        studentStore.students = response.data;
        lastPage.value = response.meta.last_page;
        allStudentCount.value = response.meta.total;
        pending.value = false;
    }
};

const submitCreateStudent = async () => {
    if (studentStore.input.name === '') {
        showAlert('warning', 'Name cannot be empty');
        return;
    } else if (studentStore.input.nis === '') {
        showAlert('warning', 'NIS cannot be empty');
        return;
    } else if (studentStore.input.rayon === '') {
        showAlert('warning', 'Rayon cannot be empty');
        return;
    } else if (studentStore.input.major_id === '') {
        showAlert('warning', 'Major cannot be empty');
        return;
    }
    const response = await $fetch(`${url}/student`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authStore.token}`,
        },
        body: {
            name: studentStore.input.name,
            nis: studentStore.input.nis,
            rayon: studentStore.input.rayon,
            major_id: studentStore.input.major_id,
        },
    });

    if (response.status === 200 || response.status === 201) {
        showAlert('success', 'Student Successfully Created');
        Closemodal();
        getStudent();
    } else {
        showAlert('error', 'Something went wrong while creating student');
    }
};

const submitEditStudent = async () => {
    if (studentStore.input.name === '') {
        showAlert('warning', 'Name cannot be empty');
        return;
    } else if (studentStore.input.nis === '') {
        showAlert('warning', 'NIS cannot be empty');
        return;
    } else if (studentStore.input.rayon === '') {
        showAlert('warning', 'Rayon cannot be empty');
        return;
    } else if (studentStore.input.major_id === '') {
        showAlert('warning', 'Major cannot be empty');
        return;
    }
    const response = await $fetch(`${url}/student/${studentStore.input.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authStore.token}`,
        },
        body: {
            name: studentStore.input.name,
            nis: studentStore.input.nis,
            rayon: studentStore.input.rayon,
            major_id: studentStore.input.major_id,
        },
    });

    if (response.status === 200 || response.status === 201) {
        showAlert('success', 'Student Successfully Updated');
        Closemodal();
        getStudent();
    } else {
        showAlert('error', 'Something went wrong while updating student');
    }
};

const submitDeleteStudent = async () => {
    const response = await $fetch(`${url}/student/${studentStore.input.id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authStore.token}`,
        },
    });
    if (response.status === 200 || response.status === 201) {
        showAlert('success', 'Student Successfully Deleted');
        Closemodal();
        getStudent();
    } else {
        showAlert('error', 'Something went wrong while deleting student');
    }
};

function darkenColor(hex, percent) {
    if (!hex) return '#000';
    let num = parseInt(hex.slice(1), 16),
        r = (num >> 16) - percent,
        g = ((num >> 8) & 0x00ff) - percent,
        b = (num & 0x0000ff) - percent;
    return (
        '#' +
        (0x1000000 + (r < 0 ? 0 : r) * 0x10000 + (g < 0 ? 0 : g) * 0x100 + (b < 0 ? 0 : b))
            .toString(16)
            .slice(1)
    );
}

onMounted(() => {
    getStudent();
});

const breadcrumbs = [
    {
        label: 'Manage Accounts',
        icon: IconsNavbarIconsManageUser,
    },
    {
        label: 'Import Student',
        icon: IconsNavbarIconsAddUser,
        onClick: openModalImport,
    },
    {
        label: 'Sort by Major',
        icon: IconsNavbarIconsFilterMajor,
    },
];

function handleBreadcrumbClick(item) {
    if (item.onClick) item.onClick();
}
</script>
