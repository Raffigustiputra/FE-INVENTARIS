<template>
  <div
    class="w-10/12 h-20 fixed top-0 right-0 bg-white shadow-sm z-10 border-b border-black/10"
  >
    <div class="container mx-auto flex items-center justify-between py-3 px-6">
      <nav class="flex items-center font-semibold text-lg mt-2.5">
        <IconsNavbar />
      </nav>

      <div class="flex items-center gap-3">
        <div class="text-right">
          <p class="font-bold text-gray-800">Admin</p>
          <p class="text-sm text-gray-600">Manage Your Items</p>
        </div>
        <div class="bg-white flex items-center justify-center p-3 rounded-lg shadow"><IconsAvatar /></div>
        <!-- coba Badge -->
        <BadgeInfo type="good" text="Good" />
      </div>
    </div>
  </div>
</template>
<script setup>

import { BadgeInfo } from "#components";

</script>
