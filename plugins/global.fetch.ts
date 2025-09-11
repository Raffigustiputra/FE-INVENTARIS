export default defineNuxtPlugin(() => {
  const authStore = useAuthStore();
  const router = useRouter();
  
  // Create reactive state for alerts
  const alertState = reactive({
    showError: false,
    showWarning: false,
    showSuccess: false,
    message: ''
  });
  
  // Function to show alerts
  const showAlert = (type: 'error' | 'warning' | 'success', message: string) => {
    alertState.message = message;
    
    if (type === 'error') {
      alertState.showError = true;
      setTimeout(() => {
        alertState.showError = false;
        alertState.message = '';
      }, 3000);
    } else if (type === 'warning') {
      alertState.showWarning = true;
      setTimeout(() => {
        alertState.showWarning = false;
        alertState.message = '';
      }, 3000);
    } else if (type === 'success') {
      alertState.showSuccess = true;
      setTimeout(() => {
        alertState.showSuccess = false;
        alertState.message = '';
      }, 3000);
    }
  };
  
  const originalFetch = globalThis.$fetch;
  
  const customFetch = async (request: any, opts?: any) => {
    try {
      const response = await originalFetch(request, opts);
      
      // Check if response contains TOKEN_EXPIRED error
      if (response?.error === 'TOKEN_EXPIRED') {
        showAlert('warning', 'Session expired. Please login again.');
        await authStore.logout();
        await router.push('/');
        throw new Error('Session expired');
      }
      
      return response;
    } catch (error: any) {
      if (error?.statusCode === 401) {
        const isLogoutRequest = typeof request === 'string' 
          ? request.includes('/logout') 
          : request?.url?.includes('/logout');
        
        const isLoginRequest = typeof request === 'string' 
          ? request.includes('/login') 
          : request?.url?.includes('/login');
        
        if (!isLogoutRequest && !isLoginRequest) {
          showAlert('error', 'Session expired. You will be redirected to login.');
          await authStore.logout();
          await router.push('/');
          throw new Error('Session expired');
        }
      }
      
      // Handle other error types
      if (error?.statusCode === 403) {
        showAlert('error', 'Access denied. You do not have permission.');
      } else if (error?.statusCode === 404) {
        showAlert('warning', 'Resource not found.');
      } else if (error?.statusCode >= 500) {
        showAlert('error', 'Server error occurred. Please try again later.');
      }
      
      throw error;
    }
  };

  Object.setPrototypeOf(customFetch, originalFetch);
  Object.assign(customFetch, originalFetch);
  
  globalThis.$fetch = customFetch as typeof globalThis.$fetch;
  
  // Provide alert state globally
  return {
    provide: {
      globalAlerts: alertState,
      showGlobalAlert: showAlert
    }
  };
});