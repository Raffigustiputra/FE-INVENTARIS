export default defineNuxtPlugin(async () => {
  const authStore = useAuthStore();

  authStore.loadFromStorage();

  if (authStore.token) {
    const isValid = await authStore.validateTokenAndFetchUser();

    if (!isValid) {
      await navigateTo("/");
    }
  }
});
