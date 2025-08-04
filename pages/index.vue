<script setup>
const authStore = useAuthStore();

const router = useRouter();
const url = useRuntimeConfig().public.authUrl;

const login = async () => {
    try {
        const response = await $fetch(`${url}/login`, {
            method: 'POST'
            ,
            body: {
                username: authStore.input.username,
                password: authStore.input.password,
            },
        });
        console.log(response.data);

        authStore.token = response.token;
        authStore.role = response.data.role;
        authStore.name = response.data.name;
        authStore.usid = response.data.usid;
        authStore.username = response.data.username;

        router.push('/admin/dashboard');
    } catch (err) {
        console.error('Login gagal:', err);
        alert('Username/password salah atau server error.');
    }
};

definePageMeta({
    layout: 'none',
});
</script>

<template>
    <div class="relative w-full h-screen flex items-center justify-center overflow-hidden">
        <div class="absolute right-8 top-28">
            <div class="flex items-center relative">
                <img
                    src="/images/wikrama-logo.png"
                    alt="Logo Wikrama"
                    class="size-22 object-contain" />
                <img src="/images/rpl.png" alt="Logo RPL" class="size-20 object-contain" />
            </div>
        </div>

        <!-- Background Image Layer -->
        <div
            class="absolute inset-0 bg-cover bg-center"
            style="background-image: url('/images/Banner-Web.jpg'); opacity: 0.3"></div>

        <!-- Konten utama -->
        <div class="relative z-10 mx-24">
            <div class="mb-6">
                <div class="font-bold text-3xl">
                    <div></div>
                    <div class="flex items-center justify-between w-full gap-3">
                        <h1>LOGO WV</h1>
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
                    <input
                        v-model="authStore.input.username"
                        type="text"
                        class="px-4 py-1 w-full border border-black rounded-lg" />
                </div>
                <div class="mx-4 mt-4 flex flex-col gap-1">
                    <h1>Password</h1>
                    <input
                        v-model="authStore.input.password"
                        type="password"
                        class="px-4 py-1 w-full border border-black rounded-lg" />
                </div>
                <div class="mx-4 mt-6">
                    <button
                        @click="login"
                        class="w-full bg-[#0844A4] text-white py-2 text-sm font-medium rounded-lg">
                        LOGIN
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>
