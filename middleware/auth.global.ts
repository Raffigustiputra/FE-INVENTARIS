import { useAuthStore } from "~/stores/auth";

export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore();

  // Kalau belum login
  if (!authStore.getToken) {
    if (to.path !== "/") {
      return navigateTo({
        path: "/",
        query: { message: "You must login first" }
      });
    }
  }

  // superadmin → akses /admin/*
  if (to.path.startsWith("/admin") && authStore.role !== "superadmin") {
    return navigateTo({
      path: "/",
      query: { message: "No access to Admin Page" }
    });
  }

  // admin → akses /kaprog/*
  if (to.path.startsWith("/kaprog") && authStore.role !== "admin") {
    return navigateTo({
      path: "/",
      query: { message: "No access to Kaprog Page" }
    });
  }

  // user → akses /user/*
  if (to.path.startsWith("/user") && authStore.role !== "user") {
    return navigateTo({
      path: "/",
      query: { message: "No access to User Page" }
    });
  }
});
