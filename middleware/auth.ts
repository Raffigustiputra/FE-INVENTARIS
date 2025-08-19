export default defineNuxtRouteMiddleware( (to, form ) => {
    const authStore = useAuthStore()

    // belum login
    if (!authStore.token){
        return navigateTo({
            path: '/',
            query: { message: 'Harus Login terlebih dahulu' }
        })
    }

    //cek role 
    const allowedRoles = to.meta.roles as string[] | undefined
    if (allowedRoles && !allowedRoles.includes(authStore.role ?? '')){
        return navigateTo({
            path: '/',
            query: { message: 'Anda tidak memiliki akses kehalaman ini' }
        })
    }
})