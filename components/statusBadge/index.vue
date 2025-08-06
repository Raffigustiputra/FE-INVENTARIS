<template>
    <span :style="badgeStyle" class="inline-flex items-center px-8 py-1 rounded-md font-semibold text-xs">
        {{ status }}
    </span>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
    status: {
        type: String,
        required: true,
        validator: (value) => ['available', 'borrowed', 'unavailable'].includes(value),
    },
})

const colorMap = {
    AVAILABLE: {
        backgroundColor: '#D2F3D8',
        color: '#59AE75'
    },
    BORROWED: {
        backgroundColor: '#FFF3A4',
        color: '#978611'
    }, 
    UNAVAILABLE: {
        backgroundColor: '#FEBCBE',
        color: '#BA4042'
    }
}

const badgeStyle = computed(() => {
    const colors = colorMap[props.status] || {};
    return {
        backgroundColor: colors.backgroundColor,
        color: colors.color
    }
})
</script>