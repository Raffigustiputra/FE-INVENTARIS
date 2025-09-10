<template>
    <div class="flex flex-col ml-3 gap-3">
        <div
            v-for="n in 5"
            :key="n"
            class="bg-[#F7F8F9] flex items-center rounded-md justify-between px-2 py-2 animate-pulse">
            <!-- kiri -->
            <div>
                <div class="h-3 w-28 bg-gray-300 rounded mb-2"></div>
                <div class="h-2 w-20 bg-gray-200 rounded"></div>
            </div>
            <!-- kanan -->
            <div class="py-1 px-3 rounded-md bg-gray-300">
                <div class="h-3 w-12 bg-gray-200 rounded"></div>
            </div>
        </div>
    </div>
</template>
