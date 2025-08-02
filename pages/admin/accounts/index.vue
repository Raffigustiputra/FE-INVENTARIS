<template>
    <div>
      <!-- <div class="relative">

        <div
            class="flex fixed top-16 items-center gap-6 w-9/12 mb-4 px-4 py-2 border-b text-gray-400 text-sm font-medium">
            <div class="flex items-center gap-1 cursor-pointer hover:text-black">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="size-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M5 13l4 4L19 7" />
                </svg>
                Manage Accounts
            </div>

            <div class="flex items-center gap-1 cursor-pointer hover:text-black">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="size-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 4v16m8-8H4" />
                </svg>
                Add Account
            </div>

            <div class="flex items-center gap-1 cursor-pointer hover:text-black">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="size-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M3 10h18M3 6h18M3 14h18M3 18h18" />
                </svg>
                Sort by Major
            </div>

            <div class="flex items-center gap-1 cursor-pointer hover:text-black">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="size-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
                </svg>
                Sort by Role
            </div>
        </div>
      </div> -->
        
      <div class="flex items-center justify-between mb-7 mt-4">
            <h1 class="font-semibold text-2xl">List Account</h1>
            <SearchBox />
        </div>

        <div class="overflow-x-auto rounded-lg bg-[#F7F8F9]">
            <table class="min-w-full text-sm text-left">
                <thead class="h-6 bg-[#F7F8F9] rounded-t-lg">
                    <tr class="text-sm font-medium text-gray-700">
                        <th class="px-8 py-2 w-4/12">Name</th>
                        <th class="px-4 py-2 w-3/12">Major Name</th>
                        <th align="center" class="px-4 py-2 w-3/12">Role</th>
                        <th class="px-4 py-2 w-3/12 text-right">Action</th>
                        <!-- Tambah text-right -->
                    </tr>
                </thead>
                <tbody class="bg-white">
                    <tr v-for="i in 7" :key="i" class="border-b border-[#EEEEEE] hover:bg-gray-50">
                        <td class="flex items-center gap-2 px-8 py-4">
                            <div class="size-6 bg-black rounded-full"></div>
                            <span class="text-xs font-medium">NAMA KAPROG NYA DISINI NANTI</span>
                        </td>
                        <td class="px-4 py-4">
                            <div class="bg-blue-300 w-24 flex justify-center rounded-md py-1">
                                <span class="text-white text-xs font-medium">PPLG</span>
                            </div>
                        </td>
                        <td align="center" class="px-4 py-4">
                            <span class="text-xs font-medium">Super Admin</span>
                        </td>
                        <td class="px-4 py-4 text-right">
                            <!-- Tambah text-right -->
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
