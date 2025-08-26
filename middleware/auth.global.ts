import { useAuthStore } from "~/stores/auth";

export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore();
  // Kalau belum login
  if (authStore.getToken) {
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
