<template>
  <div class="h-screen flex flex-col text-center font-Poppins">
    <header class=" border-gray-200">
      <img
        src="/images/WV-BLACKLANDSCAPE.png"
        alt="WV black landscape"
        class="w-50 m-5"
      />
    </header>

    <main class="text-black h-[80%] flex flex-col items-center justify-center">
      <img
        src="/images/errorImages/404.png"
        alt="404 Image"
        class="w-90" />
      <h1 class="text-6xl font-medium my-4 tracking-tight"> {{ error.statusCode }} </h1>

      <div v-if="error.statusCode === 404" class="flex items-center flex-col">
        <h2 class="text-2xl font-semibold text-gray-800">Something went wrong</h2>
        <p class="text-sm text-gray-400 font-medium">
          Sorry we were unable to find that page
        </p>
      </div>

      <div v-else-if="error.statusCode === 500" class="flex items-center flex-col">
        <h2 class="text-2xl font-semibold text-gray-800">Internal Server Error</h2>
        <p class="text-sm text-gray-400 font-medium">
          Oops! The server ran into a problem. We're working on fixing it as soon as possible.
        </p>
      </div>

      <div
        v-else-if="error.statusCode === 403"
        class="flex items-center flex-col">
        <h2 class="text-2xl font-semibold text-gray-800">Forbidden</h2>
        <p class="text-sm text-gray-400 font-medium mt-4">
          Accessing the page or resource <br />
          you were trying to reach is forbidden
        </p>
      </div>

      <div v-else-if="error.statusCode === 401" class="flex items-center flex-col">
        <h2 class="text-2xl font-semibold text-gray-800">Unauthorized</h2>
        <p class="text-sm text-gray-400 font-medium mt-4">
          Something has gone on the site’s server
        </p>
      </div>

      <button v-if="error.statusCode === 404 || error.statusCode === 401 || error.statusCode === 403"
        @click="goBack()"
        class="mt-15 inline-block cursor-pointer px-10 py-2 bg-[#023A8F] text-white font-medium rounded-lg shadow-md hover:bg-blue-700 transition duration-300 ease-in-out">
        Go back
      </button>

    </main>
  </div>
</template>

<script setup>

const props = defineProps(["error"]);

const goBack = () => {
  window.history.back();
};

</script>
