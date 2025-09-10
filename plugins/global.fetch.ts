export default defineNuxtPlugin(() => {
  const authStore = useAuthStore();
  const router = useRouter();
  
  const originalFetch = globalThis.$fetch;
  
  const customFetch = async (request: any, opts?: any) => {
    try {
      const response = await originalFetch(request, opts);
      
      // Check if response contains TOKEN_EXPIRED error
      if (response?.error === 'TOKEN_EXPIRED') {
        await authStore.logout();
        await router.push('/');
        throw new Error('Session expired');
      }
      
      return response;
    } catch (error: any) {
      // Check for TOKEN_EXPIRED in error responses
      if (error?.statusCode === 401) {
        await authStore.logout();
        await router.push('/');
        alert("Session expired. Please log in again.");
        throw new Error('Session expired');
      }
      
      throw error;
    }
  };

  Object.setPrototypeOf(customFetch, originalFetch);
  Object.assign(customFetch, originalFetch);
  
  globalThis.$fetch = customFetch as typeof globalThis.$fetch;
});