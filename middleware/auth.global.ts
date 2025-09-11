export default defineNuxtRouteMiddleware(async (to, from) => {
  const authStore = useAuthStore();
  
  // Skip pada server-side
  if (process.server) {
    return;
  }

  // Initialize auth jika belum
  if (!authStore.isInitialized) {
    await authStore.initializeAuth();
  }

  // Auto redirect jika sudah login dan akses login page
  if (authStore.isAuth && to.path === "/") {
    const role = authStore.role;
    let dashboard = '/';
    
    switch (role) {
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
      return navigateTo(dashboard);
    }
  }

  // Protect routes jika belum login
  if (!authStore.isAuth && to.path !== "/") {
    return navigateTo("/");
  }

  // Role-based access control
  if (authStore.isAuth) {
    if (to.path.startsWith("/admin") && authStore.role !== "superadmin") {
      return navigateTo("/");
    }

    if (to.path.startsWith("/kaprog") && authStore.role !== "admin") {
      return navigateTo("/");
    }

    if (to.path.startsWith("/user") && authStore.role !== "user") {
      return navigateTo("/");
    }
  }
});