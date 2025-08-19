<template>
<div>
    <h1 class="text-2xl font-bold">Dashboard</h1>
</div>
</template>

<script setup>




</script>

<style scoped>
.fade-enter-from,
.fade-leave-to {
    opacity: 0;
    transform: translateY(10px) scale(0.95);
}

.fade-enter-to,
.fade-leave-from {
    opacity: 1;
    transform: translateY(0) scale(1);
}

.fade-enter-active,
.fade-leave-active {
    transition: all 300ms cubic-bezier(0.22, 1, 0.36, 1); /* spring-like easing */
}
</style>
