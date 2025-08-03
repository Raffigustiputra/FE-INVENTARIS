<template>
    <div class="">
        <button-edit />
        <button-delete />
        <div class="w-4/12">
            <InputText label="Brand Name" />
            <InputText label="Unit Code" />
        </div>
    </div>
</template>
<script setup>
definePageMeta({
    layout: "default",
    title: "Home - Inventaris"
})
</script>