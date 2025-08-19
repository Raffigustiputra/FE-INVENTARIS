<template>
  <div>
    <Navbar :breadcrumbs="breadcrumbs" />

    <!-- Header -->
    <div class="flex items-center justify-between mt-12 mb-7">
      <h1 class="text-2xl font-semibold">Activity / History</h1>
      <SearchBox text="Search history..." />
    </div>

    <!-- Table -->
    <div class="overflow-x-auto rounded-lg bg-[#F7F8F9]">
      <table class="min-w-full text-sm text-left">
        <thead class="bg-[#F7F8F9] text-gray-700 font-semibold">
          <tr>
            <th class="w-1 px-4 py-2">
              <input
                type="checkbox"
                v-model="selectAll"
                @change="toggleAll"
                class="w-4 h-4 rounded-md border-2 border-gray-400 bg-gray-300 cursor-pointer checked:border-blue-500"
              />
            </th>
            <th class="px-6 py-2 font-semibold">Type</th>
            <th class="px-6 py-2 font-semibold text-center">Unit Code</th>
            <th class="px-6 py-2 font-semibold text-center">Brand</th>
            <th class="px-6 py-2 font-semibold text-center">Back Time</th>
            <th class="px-6 py-2 font-semibold text-center">Status</th>
            <th class="px-6 py-2 font-semibold text-center">Condition</th>
            <th class="px-4 py-2 font-semibold text-right">Action</th>
          </tr>
        </thead>

        <tbody class="bg-white">
          <tr
            v-for="item in items"
            :key="item.id"
            :class="[
              'border-b border-[#EEEEEE] hover:bg-gray-50 transition',
              selectedItems.includes(item.id) ? 'bg-[#F7F8F9]' : ''
            ]"
          >
            <!-- Checkbox -->
            <td class="px-4 py-2">
              <input
                type="checkbox"
                v-model="selectedItems"
                :value="item.id"
                class="w-4 h-4 rounded-md border-2 border-gray-400 cursor-pointer"
              />
            </td>

            <!-- Type -->
            <td class="px-6 py-2">
              <NuxtLink
                :to="`/kaprog/history/${item.id}`"
                class="text-xs text-black font-medium hover:underline"
              >
                <span class="text-xs font-medium">{{ item.type }}</span>
              </NuxtLink>
            </td>

            <!-- Unit Code -->
            <td class="px-6 py-2 text-xs text-center">
              <span class="text-xs font-medium">{{ item.unit_code }}</span>
            </td>

            <!-- Brand -->
            <td class="px-6 py-2 text-xs text-center">
              <span class="text-xs font-medium">{{ item.brand }}</span>
            </td>

            <!-- Back Time -->
            <td class="px-6 py-2 text-xs text-center">
              <span class="text-xs font-medium">{{ item.back_time }}</span>
            </td>

            <!-- Status -->
            <td class="px-6 py-2 text-center">
              <Badge type="status" :value="item.status" :label="item.status" />
            </td>

            <!-- Condition -->
            <td class="px-6 py-2 text-center">
              <Badge type="condition" :value="item.condition" :label="item.condition" />
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

    <!-- Footer -->
    <p class="mt-3 ml-2 text-xs text-gray-500">
      Showing 1 to {{ items.length }} of {{ items.length }} Items
    </p>
  </div>
</template>

<script setup>
import {
  IconsNavbarIconsFile,
  IconsNavbarIconsFilterMajor,
  IconsNavbarIconsPrint,
} from '#components'

import Badge from '~/components/badges/badge.vue'

const breadcrumbs = [
  { label: "Manage Inventory", icon: IconsNavbarIconsFile },
  { label: "Print Selected", icon: IconsNavbarIconsPrint },
  { label: "Sort by Major", icon: IconsNavbarIconsFilterMajor },
  { label: "Sort by Condition" },
]

const items = ref([
  {
    id: 1,
    type: "Laptop",
    unit_code: "LAPTOP",
    brand: "Dell",
    back_time: "2023-01-01",
    status: "Available",
    condition: "Good",
  },
])

const selectedItems = ref([])
const selectAll = ref(false)

const selectedCell = ref({
  rowId: null,
  column: null,
})

function toggleAll() {
  selectAll.value
    ? selectedItems.value = items.value.map((item) => item.id)
    : selectedItems.value = []
}

function selectCell(rowId, column) {
  selectedCell.value = { rowId, column }
}

watch(selectedItems, (newVal) => {
  selectAll.value = newVal.length === items.value.length
})
</script>
