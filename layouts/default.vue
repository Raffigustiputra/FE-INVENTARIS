<template>
  <Head>
    <Title>{{ route.meta.title }} - Inventaris</Title>
  </Head>
  <div class="w-full min-h-screen font-Poppins">
    <!-- Online checking -->
    <div v-if="!isOnline" class="h-screen flex flex-col text-center font-Poppins">
      <header>
        <img
          src="/public/images/WV-BLACKLANDSCAPE.png"
          alt="WV black landscape"
          class="w-50 m-5"/>
      </header>
      <main class="text-black h-[80%] flex flex-col items-center justify-center">
        <img
          src="/public/images/errorImages/403.png"
          alt="404 Image"
          class="w-90"/>
        <div
          class="flex items-center flex-col">
          <h2 class="text-3xl font-semibold text-gray-800">Error Connection</h2>
          <p class="text-sm text-gray-400 font-medium mt-4">
            Your device may be offline or the WiKVENTORY <br> server may be experiencing problems.
          </p>
        </div>
      </main>
    </div>

    
    <div v-else class="flex">
      <div v-if="loading" class="flex fixed inset-0 items-center justify-center z-50 bg-black/20">
         <Loading/>
      </div>
      <div class="w-2/12">
        <SidebarNav 
          @logout="handleLogout"
        />
      </div>
      <div class="">
        <Navbar/>
      </div>
      <div class="ml-12 w-8/10 flex py-4 px-10 flex-col">
        <div class="w-full mt-20 h-auto">
          <slot></slot>
        </div>
      </div>
    </div>

  </div>
</template>
<script setup>
import Loading from '@/components/loading/index.vue'
const { isOnline } = useOnlineStatus()
const route = useRoute();

const loading = ref(true);

function handleLogout(val) {
  loading.value = val;
}
</script>
