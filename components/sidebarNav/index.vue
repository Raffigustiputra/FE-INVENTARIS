<template>
    <div class="">
        <div class="w-2/12 fixed h-screen bg-gray-100">
            <div class="flex items-center my-4 px-4">
                <div class="size-8 bg-black">
                    
                </div>
                <h1 class="text-2xl font-bold px-2">WIKPIN</h1>
            </div>
            <div class="h-0.5 bg-black/10 mx-4">
            </div>
            <div class="bg-black/10 gap-2 rounded-lg py-2 px-4 flex items-center mx-4 mt-4 h-auto">
                <div class="bg-black/10 size-8 rounded-full">

                </div>
                <div class="flex-col gap-1">
                    <h1 class="text-sm font-bold">SMK Wikrama Bogor</h1>
                    <p class="text-xs text-black/60">Kaprog - {{ props.countKaprog }}7 Account</p>
                </div>
            </div>
            <div>
                <div>
                    <h1 class="font-bold text-sm mx-6 my-4">GENERAL MENU</h1>
                </div>
                <div>
                    <NavLink navigationItem = "Dashboard" :icons="IconsDashboard"/>
                    <NavLink navigationItem = "Accounts" :icons="IconsAccounts"/>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { IconsAccounts, IconsDashboard, NavLink } from '#components';

const props = defineProps({
    countKaprog : Number,
})


</script>