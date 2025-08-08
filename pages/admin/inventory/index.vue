  <template>
    <div>
      <Navbar :breadcrumbs="breadcrumbs" />

      <div class="flex items-center justify-between mt-12 mb-7">
        <h1 class="font-semibold text-2xl">Inventory</h1>
        <SearchBox text="Search inventory..." />
      </div>

      <!-- Loading State dengan Skeleton -->
    <div v-if="pending" class="space-y-4">
      <TableSkeleton 
        :rows="4" 
        :columns="5"
      />
    </div>

      <!-- Tabel -->
      <div v-else class="overflow-x-auto rounded-lg bg-[#F7F8F9]">
        <table class="min-w-full text-sm text-left">
          <thead class="bg-[#F7F8F9]">
            <tr class="text-sm font-medium text-gray-700">
              <th class="px-4 py-2 w-1">
                <input
                  type="checkbox"
                  v-model="selectAll"
                  @change="toggleAll"
                  class="w-4 h-4 rounded-md border-2 border-gray-400 bg-gray-300 hover:cursor-pointer checked:border-blue-500"
                />
              </th>
              <th class="px-10 py-2">Type</th>
              <th class="px-4 py-2 text-right">
                <div class="mr-2">Action</div>
              </th>
            </tr>
          </thead>

          <tbody class="bg-white">
            <tr
              v-for="item in items"
              :key="item.id"
              :class="[
                'border-b border-[#EEEEEE] hover:bg-gray-50',
                selectedItems.includes(item.id) ? 'bg-[#F7F8F9]' : '',
              ]"
            >
              <!-- Checkbox -->
              <td class="px-4 py-4">
                <input
                  type="checkbox"
                  v-model="selectedItems"
                  :value="item.id"
                  class="w-4 h-4 rounded-md border-2 border-gray-400 cursor-pointer"
                />
              </td>

              <!-- Name -->
              <td class="px-10 py-4">
                <NuxtLink
                  :to="`/admin/inventory/${item.id}`"
                  class="text-black text-xs font-medium"
                  >{{ item.name }}</NuxtLink
                >
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
        Showing 1 to {{ items.length }} of {{ items.length }} Items
      </p>
    </div>
  </template>

  <script setup>
  import { ref, watch } from "vue";
  import {
    IconsNavbar,
    IconsNavbarIconsAddUser,
    IconsNavbarIconsFile,
    IconsNavbarIconsPrint,
  } from "#components";
  import { useAuthStore } from "@/stores/auth";

  definePageMeta({
    layout: "default",
    title: "Inventory",
  });

  const authStore = useAuthStore();
  const items = ref([]);
  const url = useRuntimeConfig().public.localUrl;
  const pending = ref(true);
  const error = ref(null);

  const fetchItem = async () => {
    try {
      pending.value = true;
      const res = await $fetch(`${url}/item`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authStore.token}`,
        },
      });

      if (res.status === 200 && res.data) {
        items.value = res.data;
      } else {
        items.value = [];
      }
    } catch (err) {
      error.value = err;
    } finally {
      pending.value = false;
    }
  };

  onMounted(() => {
    console.log("Token:", authStore.token);
    fetchItem();
  });

  const breadcrumbs = [
    {
      label: "Manage Inventory",
      icon: IconsNavbarIconsFile,
    },
    {
      label: "Add Type",
      icon: IconsNavbarIconsAddUser,
    },
    {
      label: "Print Selected",
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
  </script>
