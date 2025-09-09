export default defineNuxtPlugin(() => {
  // Global fetch interceptor for handling 403 errors
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async (...args) => {
    const response = await originalFetch(...args);

    // Check if response is 403 Forbidden
    if (response.status === 403) {
      console.warn('403 Forbidden response detected, clearing last_path cookie');
      // Clear the last_path cookie when 403 occurs
      const lastPathCookie = useCookie('last_path');
      if (lastPathCookie.value) {
        lastPathCookie.value = null;
      }
    }

    return response;
  };

  // Handle $fetch by creating a custom fetch instance
  const customFetch = $fetch.create({
    onResponseError: ({ response }) => {
      // Check if the response is 403 Forbidden
      if (response?.status === 403) {
        console.warn('403 Forbidden error detected in $fetch, clearing last_path cookie');
        // Clear the last_path cookie when 403 occurs
        const lastPathCookie = useCookie('last_path');
        if (lastPathCookie.value) {
          lastPathCookie.value = null;
        }
      }
    }
  });

  // Replace global $fetch with our custom one
  globalThis.$fetch = customFetch as any;
});
