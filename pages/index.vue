<style scoped>
.alert-enter-from,
.alert-leave-to {
    opacity: 0;
    transform: translateX(50%);
}

.alert-enter-to,
.alert-leave-from {
    opacity: 1;
    transform: translateX(0);
}

.alert-enter-active,
.alert-leave-active {
    transition: all 350ms ease;
}
</style>
<script setup>
const authStore = useAuthStore();
let switchEye = ref(false);
let typeInputPassword = ref('password');
const switchVisibility = () => {
    typeInputPassword.value = typeInputPassword.value === 'password' ? 'text' : 'password';
    switchEye.value = !switchEye.value;
};

const router = useRouter();
const url = useRuntimeConfig().public.authUrl;

const alertError = ref(false);
const alertMessage = ref('');
const alertSuccess = ref(false);

const showAlert = (type, message) => {
    if (type === 'error') {
        alertMessage.value = message;
        alertError.value = true;
        setTimeout(() => {
            alertError.value = false;
            alertMessage.value = null;
        }, 3000);
    } else if (type === 'success') {
        alertMessage.value = message;
        alertSuccess.value = true;
        setTimeout(() => {
            alertSuccess.value = false;
            alertMessage.value = null;
        }, 2500);
    } else {
        alert(message);
    }
};
    
const login = async () => {
    try {
        const response = await $fetch(`${url}/login`, {
            method: 'POST',
            body: {
                username: authStore.input.username,
                password: authStore.input.password,
            },
        });

        authStore.setAuthData({
            token: response.token,
            role: response.data.role,
            name: response.data.name,
            usid: response.data.usid,
            username: response.data.username
        });

        if (response.data.role === 'superadmin') {
            router.push('/admin/dashboard');
        } else if (response.data.role === 'admin') {
            router.push('/kaprog/dashboard');
        } else if (response.data.role === 'user') {
            router.push('/user/dashboard');
        } else {
            showAlert('error', 'Unknown role');
        }
    } catch (err) {
        console.error('Login gagal:', err);
        showAlert('error', 'Failed to login');
    }
};

definePageMeta({
    layout: 'none',
});
</script>

<template>
    <transition name="alert">
        <AlertError v-if="alertError" :title="alertMessage" @hide="alertError = false" />
    </transition>
    <transition name="alert">
        <AlertSuccess v-if="alertSuccess" :title="alertMessage" @hide="alertSuccess = false" />
    </transition>

    <div class="relative w-full h-screen flex flex-col lg:flex-row items-center justify-center overflow-hidden px-4 sm:px-8">
        <div class="absolute right-4 top-6 sm:right-8 sm:top-10">
            <div class="flex items-center relative gap-2">
                <img
                    src="/public/images/wv-blue.png"
                    alt="Logo wv-blue"
                    class="size-18 sm:size-20 object-contain" />
                <img src="/images/wikrama-logo.png" alt="Logo Wikrama" class="size-20 sm:size-18 object-contain" />
            </div>
        </div>

        <!-- Background Image Layer -->
        <div
            class="absolute inset-0 bg-cover bg-center opacity-30"
            style="background-image: url('/images/Banner-Web.jpg'); opacity: 0.3"></div>

        <!-- Konten utama -->
        <div class="relative z-10 mx-24">
            <div class="mb-6">
                <div class="font-bold text-3xl">
                    <div></div>
                    <h1>Welcome to WikVentory</h1>
                </div>
                <div class="w-full sm:w-8/12 lg:w-5/12 mt-2 text-sm sm:text-base">
                    <p>
                        A Data and Management System for Inventory Management. Monitor, manage, and
                        integrate all inventory data more easily and quickly. Please log in to start
                        using the available features.
                    </p>
                </div>
            </div>

            <form @submit.prevent="login" class="w-full sm:w-8/12 md:w-6/12 lg:w-5/12 pt-4 pb-8 rounded-xl bg-white">
                <div class="w-full text-center">
                    <h1 class="font-semibold">Log in to start using WikVentory</h1>
                </div>
                <div class="mx-4 flex flex-col gap-1">
                    <h1 class="ml-1 font-medium text-sm">Username</h1>
                    <input
                        v-model="authStore.input.username"
                        type="text"
                        placeholder="Input your username..."
                        class="px-4 py-3 focus:ring-1 focus:ring-[#dddddd] outline-none w-full border text-xs border-[#EAEAEA] rounded-lg" />
                </div>
                <div class="mx-4 mt-4 flex flex-col relati gap-1 relative">
                    <h1 class="ml-1 font-medium text-sm">Password</h1>
                    <input
                        v-model="authStore.input.password"
                        :type="typeInputPassword"
                        placeholder="Input your password..."
                        class="px-4 py-3 text-xs w-full border focus:ring-1 focus:ring-[#dddddd] outline-none border-[#EAEAEA] rounded-lg" />
                    <button
                        type="button"
                        @click="switchVisibility"
                        class="absolute right-3 top-11 transform -translate-y-1/2 hover:cursor-pointer">
                        <svg
                            v-if="switchEye === true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke-width="1.5"
                            stroke="currentColor"
                            class="size-6 text-[#D5D5D5]">
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                        </svg>
                        <svg
                            v-else
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke-width="1.5"
                            stroke="currentColor"
                            class="size-6 text-[#D5D5D5]">
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                        </svg>
                    </button>
                </div>
                <div class="mx-4 mt-6">
                    <button
                        @click="login"
                        class="w-full bg-[#0844A4] text-white py-2 text-sm hover:cursor-pointer font-medium rounded-md">
                        LOGIN
                    </button>
                </div>
            </form>
         <!--copy right-->
            <p class="text-xs font-semibold mt-10 text-center sm:text-left">
                © PPLG XII-V 2025. All Rights Reservedd
            </p>
        </div>
    </div>
</template>
