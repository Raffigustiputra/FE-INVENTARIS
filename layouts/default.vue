<template>
  <Head>
    <Title>{{ route.meta.title }} - Inventaris</Title>
  </Head>
  <div class="w-full min-h-screen font-Poppins">
    <div class="flex">
      <div class="w-2/12">
        <SidebarNav />
      </div>
        <div class="">
            <Navbar />
            </div>
      <div class="w-10/12 flex py-4 px-10 flex-col">
        <div class="w-full mt-20 h-auto ">
          <slot></slot>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
const route = useRoute();
</script>
