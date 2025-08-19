<template>
  <div>
    <Navbar
      :breadcrumbs="breadcrumbs"
      @breadcrumbClick="handleBreadcrumbClick"
    />

    <AlertSuccess
      v-if="alertShow"
      :title="alertTitle"
      :subtitle="alertSubtitle"
      @hide="alertShow = false"
    />

    <!-- Modal Import Teacher -->
    <Transition name="fade">
      <div
        v-if="modalImport"
        class="fixed top-0 left-0 z-40 flex items-center justify-center w-full h-screen backdrop-blur-sm bg-black/30"
      >
        <Modal
          @btnSubmit="submitImportTeacher"
          @btnClose="closeModalImport"
          title="Import Teacher"
        >
          <div
            class="w-full border-2 border-gray-300 rounded-lg p-8 min-h-[180px] flex flex-col items-center justify-center text-gray-500"
          >
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
                    @change="handleFileUpload"
                  />
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
                  @change="handleFileUpload"
                />
              </label>
            </template>
          </div>
        </Modal>
      </div>
    </Transition>

    <div class="flex items-center justify-between mt-12 mb-7">
      <h1 class="font-semibold text-2xl">List Teachers</h1>
      <div
        class="w-64 h-9 p-2 border-2 border-[#E0E0E0] rounded-md flex items-center gap-2"
      >
        <IconsSearchIcon class="w-6 h-6 text-gray-500" />
        <input
          type="text"
          v-model="teacherStore.filter.search"
          @input="handleSearch"
          class="outline-none w-full"
          placeholder="Search anything..."
        />
      </div>
    </div>

    <TableSkeleton v-if="pending" :rows="3" :columns="5" />
    <!-- Table -->
    <div v-else class="overflow-x-auto rounded-lg bg-[#F7F8F9]">
      <table class="min-w-full text-sm text-left">
        <thead class="h-6 bg-[#F7F8F9] rounded-t-lg">
          <tr class="text-sm font-medium text-gray-700">
            <th class="px-8 py-2 w-4/12">Name</th>
            <th class="px-4 py-2 w-3/12">NIP</th>
            <th align="center" class="px-4 py-2 w-3/12">Telephone</th>
            <th class="px-4 py-2 w-3/12 text-right">
              <div class="mr-2">Action</div>
            </th>
          </tr>
        </thead>
        <tbody class="bg-white">
          <tr
            v-for="teacher in teacherStore.teachers"
            :key="teacher.id"
            class="border-b border-[#EEEEEE] hover:bg-gray-50"
          >
            <td class="flex items-center gap-2 px-8 py-4">
              <IconsUserIcon />
              <span class="text-xs font-medium">{{ teacher.name }}</span>
            </td>
            <td class="px-4 py-4">
              <span class="text-xs font-medium">{{
                teacher.nip || "N/A"
              }}</span>
            </td>
            <td align="center" class="px-4 py-4">
              <span class="text-xs font-medium">{{ teacher.telephone }}</span>
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
    <div class="flex items-center justify-between mt-4">
      <p class="text-xs text-gray-500">
        Showing {{ teacherStore.teachers.length }} of
        {{ allTeacherCount }} Accounts
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
  </div>
</template>

<script setup>
import {
  IconsNavbarIconsAddUser,
  IconsNavbarIconsManageUser,
} from "#components";
import IconsUpload from "@/components/icons/upload.vue";

import { useAuthStore } from "@/stores/auth";
import AlertSuccess from "@/components/alert/Success.vue"; // sesuaikan path-nya
import Pagination from "@/components/pagination/index.vue";

definePageMeta({
  layout: "default",
  title: "Teachers",
});

let timeoutFiltering = null;

const handleSearch = () => {
  pending.value = true;
  if (timeoutFiltering) {
    clearTimeout(timeoutFiltering);
  }

  timeoutFiltering = setTimeout(() => {
    getTeachers();
  }, 500);
};

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

const nextPage = async () => {
  if (currentPage.value < lastPage.value) {
    currentPage.value++;
    pending.value = true;
    console.log(currentPage.value);
    nextTick(() => {
      getTeachers();
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
      getTeachers();
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
    getTeachers();
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "smooth",
    });
  });
};

const allTeacherCount = ref(0);

const alertShow = ref(false);
const alertTitle = ref("");
const alertSubtitle = ref("");

const authStore = useAuthStore();
const url = useRuntimeConfig().public.authUrl;
const teacherStore = useTeacherStore();

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

const submitImportTeacher = async () => {
  if (!fileImport.value) {
    alert("Please select a file");
    return;
  }
  const formData = new FormData();
  formData.append("file", fileImport.value);

  try {
    const response = await $fetch(`${url}/teacher/import`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${authStore.token}`,
      },
      body: formData,
    });

    if (response.status === "success") {
      alertTitle.value = "Import successful";
      alertSubtitle.value = response.message;
      alertShow.value = true;

      setTimeout(() => {
        alertShow.value = false;
      }, 3000);

      getTeachers();
    } else {
      alertTitle.value = "Import failed";
      alertSubtitle.value = response.message || "Please try again";
      alertShow.value = true;

      setTimeout(() => {
        alertShow.value = false;
      }, 3000);
    }
  } catch (err) {
    console.error(err);
    alertTitle.value = "Error";
    alertSubtitle.value = "Error while importing file";
    alertShow.value = true;
  } finally {
    closeModalImport();
  }
};

const pending = ref(true);
const error = ref(null);

const getTeachers = async () => {
  const response = await $fetch(
    `${url}/teacher/data?search=${teacherStore.filter.search}&page=${currentPage.value}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authStore.token}`,
        "ngrok-skip-browser-warning": "true",
      },
    }
  );

  if (response.status === 200 || response.status === 201) {
    teacherStore.teachers = response.data;
    lastPage.value = response.meta.last_page;
    allTeacherCount.value = response.meta.total;
    pending.value = false;
  }
};

onMounted(() => {
  getTeachers();
});

const breadcrumbs = [
  {
    label: "Manage Teachers",
    icon: IconsNavbarIconsManageUser,
  },
  {
    label: "Import Teacher",
    icon: IconsNavbarIconsAddUser,
    onClick: openModalImport,
  },
];

function handleBreadcrumbClick(item) {
  if (item.onClick) item.onClick();
}
</script>
