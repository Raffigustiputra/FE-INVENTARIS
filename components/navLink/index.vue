<template>
    <div class="mx-4 my-4">
        <div class="px-4 py-2 text-center rounded-lg bg-red-400 hover:bg-black duration-300 hover:cursor-pointer">
            <h1>{{ props.navigationItem }}</h1>
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