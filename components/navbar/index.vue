<template>
    <div>
        <div class="w-10/12 h-18.5 flex flex-col fixed top-0 right-0 bg-white shadow-sm z-10 border-b border-black/10">
            <div class="container mx-auto flex items-center justify-between py-3 px-6">
                <nav class="flex items-center font-semibold text-lg">
                    <IconsNavbar />
                </nav>
    
                <div class="flex items-center gap-3">
                    <div class="text-right">
                        <p class="font-medium text-gray-800">Admin</p>
                        <p class="text-sm text-gray-600">Manage Your Items</p>
                    </div>
                    <div class="bg-white flex items-center justify-center p-3 rounded-lg shadow">
                        <IconsAvatar />
                    </div>
                </div>
            </div>
            <div class="w-10/12 border-t border-b bg-white fixed top-[73px] right-0 border-gray-100 py-3 px-6">
                <div class="container mx-auto flex items-center gap-5">
                    <div class="flex items-center gap-4">
                        <h3 class="text-gray-700 font-medium">Manage Account</h3>
                    </div>
                    <div class="flex items-center gap-4">
                        <h3 class="text-gray-700 font-medium">Manage Account</h3>
                    </div>
                    <div class="flex items-center gap-4">
                        <h3 class="text-gray-700 font-medium">Manage Account</h3>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>

import { BadgeInfo } from "#components";

</script>
