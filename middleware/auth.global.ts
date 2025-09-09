export default defineNuxtRouteMiddleware(async (to, from) => {
  const authStore = useAuthStore();
  
  // Skip validation on server-side or if already on login page
  if (process.server || to.path === "/") {
    return;
  }

  // If we have a token but haven't validated it yet, validate it
  if (authStore.token && !authStore.isAuth) {
    const isValid = await authStore.validateTokenAndFetchUser();
    
    if (!isValid) {
      return navigateTo("/");
    }
  }

  // If user is authenticated and trying to access login page
  if (authStore.isAuth && to.path === "/") {
    const role = authStore.role;
    let dashboard = '/';
    if (role === 'superadmin') dashboard = '/admin/dashboard';
    else if (role === 'admin') dashboard = '/kaprog/dashboard';
    else if (role === 'user') dashboard = '/user/dashboard';
    return navigateTo(dashboard);
  }

  // If not authenticated and trying to access protected routes
  if (!authStore.getToken) {
    if (to.path !== "/") {
      return navigateTo("/");
    }
  }

  // Role-based access control
  if (to.path.startsWith("/admin") && authStore.role !== "superadmin") {
    return navigateTo("/");
  }

  if (to.path.startsWith("/kaprog") && authStore.role !== "admin") {
    return navigateTo("/");
  }

  if (to.path.startsWith("/user") && authStore.role !== "user") {
    return navigateTo("/");
  }
});