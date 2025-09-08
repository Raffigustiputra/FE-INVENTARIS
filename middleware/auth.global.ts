import { useAuthStore } from "~/stores/auth";

export default defineNuxtRouteMiddleware((to, from) => {
  // Skip middleware on server-side
  if (process.server) return;
  
  const authStore = useAuthStore();
  const token = authStore.token || useCookie('auth_token').value;
  
  // Public routes that don't require authentication
  const publicRoutes = ['/login', '/register', '/forgot-password', '/'];
  
  // If route requires auth and user isn't authenticated
  if (!token && !publicRoutes.includes(to.path) && !to.path.startsWith('/public')) {
    // Save the intended destination
    if (to.fullPath) {
      useCookie('last_path').value = to.fullPath; // 1 hour
    }
    return navigateTo('/login');
  }
  
  // If user is authenticated and trying to access login page, redirect to role dashboard
  if (token && publicRoutes.includes(to.path)) {
    const role =
      authStore.role ||
      authStore.getRole ||
      useCookie('auth-role').value ||
      '';
    let dashboard = '/';
    if (role === 'superadmin') dashboard = '/admin/dashboard';
    else if (role === 'admin') dashboard = '/kaprog/dashboard';
    else if (role === 'user') dashboard = '/user/dashboard';
    return navigateTo(dashboard);
  }

  // Kalau belum login
  if (!authStore.getToken) {
    if (to.path !== "/") {
      return navigateTo("/");
    }
  }

  // superadmin → akses /admin/*
  if (to.path.startsWith("/admin") && authStore.role !== "superadmin") {
    return navigateTo("/");
  }

  // admin → akses /kaprog/*
  if (to.path.startsWith("/kaprog") && authStore.role !== "admin") {
    return navigateTo("/");
  }

  // user → akses /user/*
  if (to.path.startsWith("/user") && authStore.role !== "user") {
    return navigateTo("/");
  }
});