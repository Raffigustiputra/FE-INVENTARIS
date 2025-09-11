export default defineNuxtPlugin(async () => {
  const authStore = useAuthStore();
  const router = useRouter();

  // Initialize auth state
  await authStore.initializeAuth();

  if (authStore.isAuth && authStore.role) {
    const currentPath = router.currentRoute.value.path;
    
    if (currentPath === "/") {
      let dashboard = '/';
      
      switch (authStore.role) {
        case 'superadmin':
          dashboard = '/admin/dashboard';
          break;
        case 'admin':
          dashboard = '/kaprog/dashboard';
          break;
        case 'user':
          dashboard = '/user/dashboard';
          break;
      }
      
      if (dashboard !== '/') {
        await navigateTo(dashboard);
      }
    }
  }
});