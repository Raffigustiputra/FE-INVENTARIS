<template>
    <div class="flex justify-between items-center">
        <div>
            <h1 class="font-semibold text-lg">Welcome back, Admin!</h1>
            <p class="text-xs text-gray-500">Here's a summary of your dashboard for today</p>
        </div>

        <div class="flex items-center gap-1 text-sm text-gray-600">
            <span class="font-semibold text-black">{{ today }}</span>
            <Calendar class="w-4 h-4" />
        </div>
    </div>

    <!-- Grid kartu info -->
    <div class="mt-6 border-y border-gray-200">
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 divide-x divide-gray-200">
            <div v-for="i in 4" :key="i" class="flex items-center p-4">
                <!-- Icon -->
                <userIcon class="mr-4" />

                <!-- Text -->
                <div>
                    <p class="text-xs font-semibold text-gray-800">INI TITLE</p>
                    <p class="text-sm font-bold text-gray-900">125</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import Calendar from '@/components/icons/calendar.vue'
import UserIcon from '@/components/icons/userIcon.vue'

definePageMeta({
    layout: "default",
    title: "Home - Inventaris"
})

const now = new Date()

const weekday = now.toLocaleDateString("en-GB", { weekday: "short" })
const date = now.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
})

const today = `${weekday}, ${date}`
</script>