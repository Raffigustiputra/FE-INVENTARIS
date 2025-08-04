<template>
    <svg 
    class=""
    width="10" height="10" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M0 6.66667V0H6.66667V6.66667H0ZM0 15V8.33333H6.66667V15H0ZM8.33333 6.66667V0H15V6.66667H8.33333ZM8.33333 15V8.33333H15V15H8.33333ZM1.66667 5H5V1.66667H1.66667V5ZM10 5H13.3333V1.66667H10V5ZM10 13.3333H13.3333V10H10V13.3333ZM1.66667 13.3333H5V10H1.66667V13.3333Z"
             />
    </svg>
</template>
<script setup>
import { useRoute } from 'vue-router';

const props = defineProps({
    navigateTo: String
})

const route = useRoute()
</script>
