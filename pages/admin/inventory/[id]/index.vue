<template>
  <div>
    <Navbar :breadcrumbs="breadcrumbs" />
    <div class="flex items-center justify-between mt-12 mb-4">
      <h1 class="font-semibold text-2xl">
        <NuxtLink to="/admin/inventory/">
          Inventory 
        </NuxtLink>
        <span class="text-lg mx-1.5"> /</span> {{ subItemStore.subItems[0]?.item?.name }}
      </h1>
      <SearchBox />
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
          <tr class="border-b border-[#EEEEEE] hover:bg-gray-50">
            <td class="px-4 py-4">
              <input
                type="checkbox"
                v-model="selectedItems"
                :value="item.id"
                class="w-4 h-4 rounded-md border-2 border-gray-400 bg-gray-300 checked:border-blue-500"
              />
            </td>
            <td class="px-6 py-4 text-center">{{ item.item.name }}</td>
            <td class="px-6 py-4 text-center">
              <NuxtLink
                :to="`/admin/inventory/${item.item.id}/${item.id}`"
                class="text-black text-xs font-medium"
              >
                {{ item.merk }}
              </NuxtLink>
            </td>
            <td class="px-6 py-4 text-center">{{ item.stock }}</td>
            <td class="px-6 py-4 text-center">
              <div class="bg-blue-300 w-24 py-0.5 rounded-md inline-block">
                <span class="text-white text-xs font-medium">{{
                  item.major.name
                }}</span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
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

definePageMeta({
  title: "Inventory",
});

const selectedItems = ref([]);
const authStore = useAuthStore();
const subItemStore = useSubItemStore();
const url = useRuntimeConfig().public.authUrl;

const getSubItemInventory = async () => {
  setTimeout(() => setLoading(false), 2000);
  const response = await $fetch(`${url}/subitem`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authStore.token}`,
    },
  });

  if (response.status === 200) {
    const id = route.params.id;
    subItemStore.subItems = response.data.filter(item => item.item && String(item.item.id) === id);
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
    label: "Print Selected",
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
