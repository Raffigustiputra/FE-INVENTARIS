<script setup>
definePageMeta({
  layout: "none",
})
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 font-Poppins">
    <div class="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
      <h1 class="text-2xl font-semibold text-center text-gray-800 mb-6">Login</h1>
      <form class="space-y-4">
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
          <input
            id="email"
            type="email"
            placeholder="you@example.com"
            class="w-full px-4 py-2 mt-1 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
          <input
            id="password"
            type="password"
            placeholder="••••••••"
            class="w-full px-4 py-2 mt-1 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <button
          type="submit"
          class="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 cursor-pointer text-white font-semibold rounded-xl transition duration-200"
        >
          Sign In
        </button>
      </form>
    </div>
  </div>
</template>
