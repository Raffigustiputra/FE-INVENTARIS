<template>
    <div class="">
        <button-edit />
        <button-delete />
        <div class="w-4/12">
            <InputText label="Brand Name" />
            <InputText label="Unit Code" />
            <InputTextarea />
            <InputDate />
            <InputSelect label="type">
            <option value="">Laptop</option>
            <option value="">Desktop</option>
            <option value="">Printer</option>
            </InputSelect>
        </div>
    </div>
</template>
<script setup>
definePageMeta({
    layout: "default",
    title: "Home - Inventaris"
})
</script>