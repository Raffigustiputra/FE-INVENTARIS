<template>
    <div class="mx-4 my-2">
        <div class="px-4 py-2 rounded-lg flex items-center gap-3 hover:bg-black/10 duration-300 hover:cursor-pointer">
            <div class="size-6 bg-black/10 rounded-full ">

            </div>
            <h1 class="text-sm font-semibold">{{ props.navigationItem }}</h1>
        </div>
        <!-- <div class="px-4 py-2 text-center rounded-lg bg-red-400 hover:bg-black duration-300 hover:cursor-pointer">
            <h1>Main Menu</h1>
        </div> -->
        </div>
</template>
<script setup>
const props = defineProps({
    navigationItem : String
})
</script>