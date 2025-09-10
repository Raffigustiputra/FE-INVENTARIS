<template>
    <div class="mt-2 border-t border-[#D9D9D9]">
        <h1 class="font-semibold mt-4 text-md">Latest Activity</h1>

        <div class="mt-4 mr-2">
            <table class="min-w-full text-xs text-left rounded-t-lg overflow-hidden">
                <thead class="h-6 bg-[#F7F8F9]">
                    <tr class="font-semibold text-gray-700">
                        <th class="px-6 py-1 w-2/12">Type</th>
                        <th align="center" class="px-3 py-1 w-3/12">Unit Code</th>
                        <th align="center" class="px-3 py-1 w-2/12">Brand</th>
                        <th align="center" class="px-3 py-1 w-3/12">Date Time</th>
                        <th align="center" class="px-3 py-1 w-3/12">Status</th>
                    </tr>
                </thead>
                <tbody class="bg-white animate-pulse">
                    <tr v-for="n in 5" :key="n" class="border-b border-[#EEEEEE]">
                        <td class="px-6 py-4">
                            <div class="h-3 w-20 bg-gray-200 rounded"></div>
                        </td>
                        <td align="center" class="px-3 py-2">
                            <div class="h-3 w-16 bg-gray-200 rounded mx-auto"></div>
                        </td>
                        <td align="center" class="px-3 py-2">
                            <div class="h-3 w-14 bg-gray-200 rounded mx-auto"></div>
                        </td>
                        <td align="center" class="px-3 py-2">
                            <div class="h-3 w-24 bg-gray-200 rounded mx-auto"></div>
                        </td>
                        <td align="center" class="px-3 py-2">
                            <div class="h-4 w-16 bg-gray-300 rounded mx-auto"></div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>
