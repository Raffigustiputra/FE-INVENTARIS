<template>
  <Head>
    <Title>{{ route.meta.title }} - Inventaris</Title>
  </Head>
  <div class="w-full min-h-screen font-Poppins">
    <!-- Online checking -->
    <div
      v-if="!isOnline"
      class="h-screen flex flex-col text-center font-Poppins"
    >
      <header>
        <img
          src="/public/images/WV-BLACKLANDSCAPE.png"
          alt="WV black landscape"
          class="w-50 m-5"
        />
      </header>
      <main
        class="text-black h-[80%] flex flex-col items-center justify-center"
      >
        <img
          src="/public/images/errorImages/403.png"
          alt="404 Image"
          class="w-90"
        />
        <div class="flex items-center flex-col">
          <h2 class="text-3xl font-semibold text-gray-800">Error Connection</h2>
          <p class="text-sm text-gray-400 font-medium mt-4">
            Your device may be offline or the WiKVENTORY <br />
            server may be experiencing problems.
          </p>
        </div>
      </main>
    </div>

    <div v-else>
      <SidebarNav />
      <div
        :class="[
          'transition-all duration-300 ease-in-out',
          sidebarStore.isCollapsed ? 'ml-25' : 'ml-[320px]',
        ]"
      >
        <main class="w-full h-full px-5">
          <slot></slot>
        </main>
      </div>
    </div>
  </div>
</template>
<script setup>
import { useSidebarStore } from "~/stores/sidebar"; 
const sidebarStore = useSidebarStore(); 

const { isOnline } = useOnlineStatus();
const route = useRoute();
</script>
