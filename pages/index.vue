<script setup>
definePageMeta({
    layout: 'none',
});
</script>

<template>
    <div class="relative w-full h-screen flex items-center justify-center overflow-hidden">
        <!-- Background Image Layer -->
        <div
            class="absolute inset-0 bg-cover bg-center"
            style="background-image: url('/images/Banner-Web.jpg'); opacity: 0.3"></div>

        <!-- Konten utama -->
        <div class="relative z-10 mx-24">
            <div class="mb-6">
                <div class="font-bold text-3xl">
                    <div class="flex items-center justify-between w-full gap-3">
                        <h1>LOGO WV</h1>
                        <div class="flex justify-between items-center">
                            <img
                                src="/images/wikrama-logo.png"
                                alt="Logo Wikrama"
                                class="size-20 object-contain" />
                            <img
                                src="/images/rpl.png"
                                alt="Logo RPL"
                                class="size-24 object-contain" />
                        </div>
                    </div>
                    <h1>Welcome to WikVentory</h1>
                </div>

                <div class="w-5/12 mt-2">
                    <p>
                        A Data and Management System for Inventory Management. Monitor, manage, and
                        integrate all inventory data more easily and quickly. Please log in to start
                        using the available features.
                    </p>
                </div>
            </div>

            <div class="w-5/12 py-4 rounded-xl bg-white">
                <div class="w-full text-center">
                    <h1 class="font-semibold">Log in to start using WikVentory</h1>
                </div>
                <div class="mx-4 flex flex-col gap-1">
                    <h1>Username</h1>
                    <input type="text" class="px-4 py-1 w-full border border-black rounded-lg" />
                </div>
                <div class="mx-4 mt-4 flex flex-col gap-1">
                    <h1>Password</h1>
                    <input
                        type="password"
                        class="px-4 py-1 w-full border border-black rounded-lg" />
                </div>
                <div class="mx-4 mt-6">
                    <button
                        class="w-full bg-[#0844A4] text-white py-2 text-sm font-medium rounded-lg">
                        LOGIN
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>
