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
        <Navbar :breadcrumbs="breadcrumbs" />
        <div class="flex items-center justify-between mt-12 mb-7">
            <h1 class="font-semibold text-2xl">List Students</h1>
            <SearchBox text="Search students..." />
        </div>

         <TableSkeleton v-if="pending"
        :rows="5"
        :columns="5"
     />

        <div v-else class="overflow-x-auto rounded-lg bg-[#F7F8F9]">
            <table class="min-w-full text-sm">
                <thead class="h-6 bg-[#F7F8F9] rounded-t-lg">
                    <tr class="text-sm font-medium text-gray-700">
                        <th class="px-8 py-2 w-3/12 text-left">Name</th>
                        <th class="px-4 py-2 w-3/12 text-center">NIS</th>
                        <th class="px-4 py-2 w-3/12 text-center">Rayon</th>
                        <th class="px-4 py-2 w-3/12 text-center">Major</th>
                        <th class="px-4 py-2 w-3/12 text-right">
                            <div class="mr-2">Action</div>
                        </th>
                    </tr>
                </thead>
                <tbody class="bg-white">
                    <tr v-for="i in 7" :key="i" class="border-b border-[#EEEEEE] hover:bg-gray-50">
                        <!-- Name -->
                        <td class="flex items-center gap-2 px-8 py-4 text-left">
                            <IconsUserIcon />
                            <span class="text-xs font-medium">John Doe {{ i }}</span>
                        </td>

                        <!-- NIS -->
                        <td class="px-4 py-4 text-center">
                            <span class="text-xs font-medium">1234567{{ i }}</span>
                        </td>

                        <!-- Rayon -->
                        <td class="px-4 py-4 text-center">
                            <span class="text-xs font-medium">Rayon {{ i }}</span>
                        </td>

                        <!-- Major -->
                        <td class="px-4 py-4 text-center">
                            <span class="text-xs font-medium">Major {{ i }}</span>
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
        <p class="text-xs text-gray-500 mt-3 ml-2">
            Showing  to  of
             Accounts
        </p>
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

let modalCreate = ref(false);
let modalEdit = ref(false);
let modalDelete = ref(false);
let Closemodal = () => {
    modalCreate.value = false;
    modalEdit.value = false;
    modalDelete.value = false;
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

const getStudent = async () => {
    setTimeout(() => setLoading(false), 5000);
    const response = await $fetch(`${url}/student`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authStore.token}`,
        },
    });

    if (response.status === 200 || response.status === 201) {
        studentStore.students = response.data;
    }
};

const submitCreateStudent = async () => {
    if ( studentStore.input.name === ''){
        showAlert('warning', 'Name cannot be empty');
        return;
    } else if ( studentStore.input.nis === '') {
        showAlert('warning', 'NIS cannot be empty');
        return;
    } else if ( studentStore.input.rayon === '') {
        showAlert('warning', 'Rayon cannot be empty');
        return;
    } else if ( studentStore.input.major_id === '') {
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
    },
    {
        label: 'Sort by Major',
        icon: IconsNavbarIconsFilterMajor,
    },
];
</script>
