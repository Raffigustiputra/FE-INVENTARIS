<template>
    <div class="">
        <div class="w-2/12 fixed h-screen bg-white border border-r border-black/10 ">
            <div class="flex items-center my-4 px-4">
                <div class="size-8 bg-black">
                    
                </div>
                <h1 class="text-2xl font-bold px-2">WV</h1>
            </div>
            <div class="border-b border-black/10 mx-4">
            </div>
            <div class="bg-[#EBEBEB] gap-2 rounded-lg py-2 px-4 flex items-center mx-4 mt-4 h-auto">
                <div class="bg-black/10 size-8 rounded-full">

                </div>
                <div class="flex-col gap-1">
                    <h1 class="text-sm font-bold">SMK Wikrama Bogor</h1>
                    <p class="text-xs text-black/60">Kaprog - {{ props.countKaprog }}7 Account</p>
                </div>
            </div>
            <div class="">
                <div>
                    <h1 class="font-bold text-sm mx-6 mt-4 mb-2 text-[#BAB8B8]">GENERAL MENU</h1>
                </div>
                <div>
                    <NavLink navigationItem = "Dashboard" :icons="IconsDashboard" navigateTo="/user/dashboard"/>
                    <NavLink navigationItem = "Accounts" :icons="IconsAccounts" navigateTo="/user/accounts"/>
                </div>
            </div>
            <div class="border-b border-black/10 mx-4"></div>
            <div>
                <div>
                    <h1 class="font-bold text-sm mx-6 my-4 text-[#BAB8B8]">MAJOR</h1>
                </div>
                <div>
                    <NavMajor majorColor="bg-blue-300" majorName="PPLG"/>
                    <NavMajor majorColor="bg-blue-300" majorName="PPLG"/>
                    <NavMajor majorColor="bg-blue-300" majorName="PPLG"/>
                    <NavMajor majorColor="bg-blue-300" majorName="PPLG"/>
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