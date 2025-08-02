<template>
  <div>
    <Navbar :breadcrumbs="breadcrumbs" />
    <div class="flex items-center justify-between mt-12 mb-4">
      <h1 class="font-semibold text-2xl">Inventory</h1>
      <SearchBox text="Search inventory..." />
    </div>

    <div class="overflow-x-auto rounded-lg bg-[#F7F8F9]">
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
            <th class="px-4 py-2">Type</th>
            <th class="px-4 py-2 text-right"><div class="mr-2">Action</div></th>
          </tr>
        </thead>
        <tbody class="bg-white">
          <tr
            v-for="(item, index) in items"
            :key="item.id"
            class="border-b border-[#EEEEEE] hover:bg-gray-50"
          >
            <td class="px-4 py-4">
              <input
                type="checkbox"
                v-model="selectedItems"
                :value="item.id"
                class="w-4 h-4 rounded-md border-2 border-gray-400 bg-gray-300 checked:border-blue-500"
              />
            </td>
            <td class="px-4 py-4">
              <span class="text-black text-xs font-medium">{{ item.name }}</span>
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
import { IconsNavbarIconsFile, IconsNavbarIconsPrint } from '#components'
import { ref, watch } from 'vue'

definePageMeta({
    layout: "default",
    title: "Inventory"
})

const breadcrumbs = [{
  label: "Manage Inventory",
  icon: IconsNavbarIconsFile,
}, {
  label: "Print Selected",
  icon: IconsNavbarIconsPrint
}]

const items = ref([
  { id: 1, name: 'Lenovo' },
  { id: 2, name: 'Acer' },
  { id: 3, name: 'Asus' },
  { id: 4, name: 'HP' },
  { id: 5, name: 'Dell' },
  { id: 6, name: 'MSI' },
  { id: 7, name: 'Macbook' }
])

const selectedItems = ref([])
const selectAll = ref(false)

function toggleAll() {
  if (selectAll.value) {
    selectedItems.value = items.value.map(item => item.id)
  } else {
    selectedItems.value = []
  }
}

watch(selectedItems, (newVal) => {
  selectAll.value = newVal.length === items.value.length
});
</script>