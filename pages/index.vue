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
let loading = ref(false);
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
        loading.value = true;
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
            username: response.data.username,
            major_id: response.data.major_id // Store the complete major object
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
    } finally {
        loading.value = false;
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

<div class="relative w-full min-h-screen flex flex-col lg:flex-row items-center justify-center overflow-hidden px-4 sm:px-8">
  <div class="absolute right-4 top-6 sm:right-8 sm:top-10">
    <div class="flex items-center relative gap-2">
      <img
        src="/public/images/wv-blue.png"
        alt="Logo wv-blue"
        class="w-14 h-14 sm:w-20 sm:h-20 object-contain" />
      <img
        src="/images/wikrama-logo.png"
        alt="Logo Wikrama"
        class="w-14 h-14 sm:w-20 sm:h-20 object-contain" />
    </div>
  </div>

  <!-- Background -->
  <div
    class="absolute inset-0 bg-cover bg-center opacity-30"
    style="background-image: url('/images/Banner-Web.jpg')">
  </div>

  <!-- Konten utama -->
  <div class="relative z-10 mx-4 sm:mx-12 lg:mx-24 w-full max-w-5xl">
    <div class="mb-6">
      <div class="font-bold text-2xl sm:text-3xl">
        <h1>Welcome to WikVentory</h1>
      </div>
      <div class="w-full sm:w-8/12 lg:w-5/12 mt-2 text-xs sm:text-sm">
        <p>
          A Data and Management System for Inventory Management. Monitor, manage,
          and integrate all inventory data more easily and quickly. Please log in
          to start using the available features.
        </p>
      </div>
    </div>

    <!-- Form Login -->
    <form
      @submit.prevent="login"
      class="w-full sm:w-8/12 md:w-6/12 lg:w-5/12 pt-4 pb-8 rounded-xl bg-white">
      <div class="w-full text-center">
        <h1 class="font-semibold text-sm sm:text-base">Log in to start using WikVentory</h1>
      </div>

      <div class="mx-4 flex flex-col gap-1">
        <h1 class="ml-1 font-medium text-xs sm:text-sm">Username</h1>
        <input
          v-model="authStore.input.username"
          type="text"
          placeholder="Input your username..."
          class="px-3 sm:px-4 py-2 sm:py-3 focus:ring-1 focus:ring-[#dddddd] outline-none w-full border text-xs sm:text-sm border-[#EAEAEA] rounded-lg" />
      </div>

      <div class="mx-4 mt-4 flex flex-col gap-1 relative">
        <h1 class="ml-1 font-medium text-xs sm:text-sm">Password</h1>
        <input
          v-model="authStore.input.password"
          :type="typeInputPassword"
          placeholder="Input your password..."
          class="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm w-full border focus:ring-1 focus:ring-[#dddddd] outline-none border-[#EAEAEA] rounded-lg" />
        <button
          type="button"
          @click="switchVisibility"
          class="absolute right-3 top-10 sm:top-11 transform -translate-y-1/2 hover:cursor-pointer">
          <!-- svg eye tetap -->
        </button>
      </div>

      <div class="mx-4 mt-6">
        <button
          @click="login"
          class="w-full bg-[#0844A4] text-white py-2 sm:py-3 flex justify-center items-center text-sm sm:text-base cursor-pointer font-medium rounded-md"
          :class="loading ? 'opacity-70 cursor-not-allowed' : ''">
          {{ loading ? 'Loading...' : 'Login' }}
        </button>
      </div>
    </form>

    <!-- Footer -->
    <p class="text-[10px] sm:text-xs font-semibold mt-6 sm:mt-10 text-center sm:text-left">
      © PPLG XII-V 2025. All Rights Reserved
    </p>
  </div>
</div>

</template>
