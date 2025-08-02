<template>
  <div>
    <div class="flex items-center justify-between mb-4">
      <h1 class="font-semibold text-2xl">List Account</h1>
      <SearchBox />
    </div>

    <div class="overflow-x-auto rounded-lg bg-[#F7F8F9]">
      <table class="min-w-full text-sm text-left">
        <thead class="h-6 bg-[#F7F8F9] rounded-t-lg">
          <tr class="text-sm font-medium text-gray-700">
            <th class="px-8 py-2 w-4/12">Name</th>
            <th class="px-4 py-2 w-3/12">Major Name</th>
            <th class="px-4 py-2 w-3/12">Role</th>
            <th class="px-4 py-2 w-3/12 text-right">Action</th> <!-- Tambah text-right -->
          </tr>
        </thead>
        <tbody class="bg-white">
          <tr
            v-for="i in 7"
            :key="i"
            class="border-b border-[#EEEEEE] hover:bg-gray-50"
          >
            <td class="flex items-center gap-2 px-8 py-4">
              <div class="size-6 bg-black rounded-full"></div>
              <span class="text-xs font-medium">NAMA KAPROG NYA DISINI NANTI</span>
            </td>
            <td class="px-4 py-4">
              <div class="bg-blue-300 w-24 flex justify-center rounded-md py-1">
                <span class="text-white text-xs font-medium">PPLG</span>
              </div>
            </td>
            <td class="px-4 py-4">
              <span class="text-xs font-medium">Super Admin</span>
            </td>
            <td class="px-4 py-4 text-right"> <!-- Tambah text-right -->
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
