<template>
  <div>
    <Navbar :breadcrumbs="breadcrumbs" />
    <div class="flex items-center justify-between mt-12 mb-4">
      <h1 class="font-semibold text-2xl">
        <NuxtLink to="/admin/inventory/">
          Inventory 
        </NuxtLink>
        <span class="text-lg mx-1.5"> /</span>
        <span v-if="pending">...</span>
        <span v-else>{{ subItemStore.subItems[0]?.item?.name }}</span>
      </h1>
      <SearchBox v-model="subItemStore.filter.search" @input="handleSearch" />
    </div>

     <TableSkeleton v-if="pending"
        :rows="4"
        :columns="4"
     />

    <div v-else class="overflow-x-auto mt-7 rounded-lg bg-[#F7F8F9]">
      <table class="min-w-full text-sm text-left">
        <thead class="bg-[#F7F8F9]">
          <tr class="text-sm font-medium text-gray-700">
            <th class="px-4 py-2 w-1">
              <input
                type="checkbox"
                v-model="selectAll"
                @change="toggleAll"
                class="w-4 h-4 rounded-md border-2 border-gray-400 bg-gray-300 checked:border-blue-500"
              />
            </th>
            <th class="px-6 py-2 text-center">Type</th>
            <th class="px-6 py-2 text-center">Brand</th>
            <th class="px-6 py-2 text-center">Stock</th>
            <th class="px-6 py-2 text-center">Major</th>
          </tr>
        </thead>
        <tbody
          class="bg-white"
          v-for="item in subItemStore.subItems"
          :key="item.id"
        >
          <tr class="border-b border-[#EEEEEE] hover:bg-gray-100">
            <td class="px-4 py-4">
              <input
                type="checkbox"
                v-model="selectedItems"
                :value="item.id"
                class="w-4 h-4 rounded-md border-2 border-gray-400 bg-gray-300 checked:border-blue-500"
                @click.stop
              />
            </td>
            <td class="px-6 py-4 text-center cursor-pointer" @click="viewItem(item)">{{ item.item.name }}</td>
            <td class="px-6 py-4 text-center cursor-pointer" @click="viewItem(item)">
                {{ item.merk }}
            </td>
            <td class="px-6 py-4 text-center cursor-pointer" @click="viewItem(item)">{{ item.stock }}</td>
            <td class="px-6 py-4 text-center cursor-pointer" @click="viewItem(item)">
              <div 
                class="w-24 py-0.5 rounded-md inline-block"
                :style="{
                  backgroundColor: `rgba(${parseInt(
                    item.major?.color.slice(1, 3),
                    16
                  )}, ${parseInt(item.major?.color.slice(3, 5), 16)}, ${parseInt(
                    item.major?.color.slice(5, 7),
                    16
                  )}, 0.8)`,
                }"
              >
                <span 
                  class="text-xs font-medium"
                  :style="{ color: darkenColor(item.major?.color, 70) }"
                >
                  {{ item.major.name }}
                </span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
     <div class="flex items-center justify-between mt-4">
      <p class="text-xs text-gray-500 mt-3 ml-2">
        Showing {{ subItemStore.subItems.length > 0 ? 1 : 0 }} to {{ subItemStore.subItems.length }} of
        {{ countSubItems }} Items
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
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import {
  IconsNavbarIconsFile,
  IconsNavbarIconsFilterMajor,
  IconsNavbarIconsFilterRole,
  IconsNavbarIconsPrint,
} from "#components";
import { darkenColor } from "~/lib/helper";

definePageMeta({
  title: "Inventory",
});

const selectedItems = ref([]);
const authStore = useAuthStore();
const subItemStore = useSubItemStore();
const pending = ref(false);
const url = useRuntimeConfig().public.authUrl;

const viewItem = (item) => {
  navigateTo(`/admin/inventory/${item.item.id}/${item.id}`);
};

let timeoutFiltering = null;

const handleSearch = () => {
  pending.value = true;
  if (timeoutFiltering) {
    clearTimeout(timeoutFiltering);
  }

  timeoutFiltering = setTimeout(() => {
    getSubItemInventory();
  }, 400);
};

const lastPage = ref(0);
const currentPage = ref(1);
const maxVisiblePages = 3;
const countSubItems = ref(0);

const paginationItems = computed(() => {
  const pages = [];
  const halfVisible = Math.floor(maxVisiblePages / 2);

  if (currentPage.value > lastPage.value) {
    currentPage.value = 1;
  }

  const filteredItems = subItemStore.subItems.filter(
    (item) => item.item && String(item.item.id) === route.params.id
  );

  const totalPages = Math.ceil(filteredItems.length / maxVisiblePages);

  if (totalPages <= maxVisiblePages) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    if (currentPage.value <= halfVisible + 1) {
      for (let i = 1; i <= maxVisiblePages - 1; i++) {
        pages.push(i);
      }
      pages.push("...");
      pages.push(totalPages);
    } else if (currentPage.value >= totalPages - halfVisible) {
      pages.push(1);
      pages.push("...");
      for (
        let i = totalPages - (maxVisiblePages - 2);
        i <= totalPages;
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
      pages.push(totalPages);
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
      getSubItemInventory();
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
      getSubItemInventory();
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
    getSubItemInventory();
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "smooth",
    });
  });
};

const getSubItemInventory = async () => {
  setTimeout(() => setLoading(false), 2000);
  pending.value = true;
  const response = await $fetch(`${url}/subitem/paginate?search=${subItemStore.filter.search}&page=${currentPage.value}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authStore.token}`,
    },  
  });

  if (response.status === 200) {
    const id = route.params.id;
    subItemStore.subItems = response.data.filter(item => item.item && String(item.item.id) === id);
    lastPage.value = response.meta.last_page;
    countSubItems.value = response.data.filter(item => item.item && String(item.item.id) === id).length;
    pending.value = false;
  }
};

onMounted(() => {
  getSubItemInventory();
});

const route = useRoute();
const selectAll = ref(false);

const breadcrumbs = [
  {
    label: "Manage Inventory",
    icon: IconsNavbarIconsFile,
  },
  {
    label: "Export Selected",
    icon: IconsNavbarIconsPrint,
  },
  {
    label: "Sort by Major",
    icon: IconsNavbarIconsFilterMajor,
  },
  {
    label: "Sort by Stock",
    icon: IconsNavbarIconsFilterRole,
  },
];

const toggleAll = () => {
  if (selectAll.value) {
    selectedItems.value = subItemStore.subItems.map((item) => item.id);
  } else {
    selectedItems.value = [];
  }
};
</script>
