<template>
    <div class="mx-4 my-2">
        <NuxtLink
        :to="props.navigateTo"
        class="px-4 py-2 rounded-lg flex items-center gap-3 duration-300 hover:bg-black/10 hover:cursor-pointer"
        >
            <div class="flex items-center justify-start gap-2">
                <div  :class="props.majorColor" class="size-3 rounded-full "></div>
                <h1 class="font-semibold text-sm  text-[#727272]">{{ props.majorName }}</h1>
            </div>
        </NuxtLink>
    </div>
</template>
<script setup>
const props = defineProps({
    majorColor : String,
    majorName : String,
    navigateTo : String
})
</script>