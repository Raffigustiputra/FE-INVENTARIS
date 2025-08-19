<template>
    <h1>Hello, World!</h1>
</template>

<script setup lang="ts">
    definePageMeta({
    middleware: ["auth"],
    roles: ["superadmin"]
})

</script>