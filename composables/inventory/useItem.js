import { useAuthStore } from '@/stores/auth';

export const useItem = () => {
  const items = ref([]);
  const pending = ref(true);
  const error = ref(null);
  
  const { public: { authUrl } } = useRuntimeConfig();
  const authStore = useAuthStore();

  const fetchItems = async () => {
    try {
      pending.value = true;
      error.value = null;
      
      const res = await $fetch(`${authUrl}/item`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authStore.token}`,
           'ngrok-skip-browser-warning': 'true',
        },
      });

      if (res.status === 200 && res.data) {
        items.value = res.data;
      } else {
        items.value = [];
      }
    } catch (err) {
      console.error('Fetch Items Error:', err);
      error.value = err;
      items.value = [];
    } finally {
      pending.value = false;
    }
  };

  const createItem = async (itemData) => {
    try {
      console.log('=== CREATE ITEM DEBUG ===');
      console.log('URL:', `${authUrl}/item`);
      console.log('Token:', authStore.token ? 'Present' : 'Missing');
      console.log('Data:', itemData);

      const res = await $fetch(`${authUrl}/item`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authStore.token}`,
           'ngrok-skip-browser-warning': 'true',
        },
        body: itemData
      });
      
      console.log('=== SUCCESS RESPONSE ===');
      console.log('Response:', res);
      
      await fetchItems();
      return { success: true, data: res };
      
    } catch (err) {
      console.log('=== ERROR RESPONSE ===');
      console.error('Error status:', err.status || err.statusCode);
      console.error('Error data:', err.data);
      console.error('Full error:', err);
      
      return { success: false, error: err };
    }
  };

  const deleteItem = async (itemId) => {
    try {
      const res = await $fetch(`${authUrl}/item/${itemId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${authStore.token}`,
        },
      });
      
      if (res.status === 200) {
        await fetchItems();
        return { success: true };
      }
    } catch (err) {
      return { success: false, error: err };
    }
  };

  const updateItem = async (itemData) => {
    try {
      console.log('=== UPDATE ITEM DEBUG ===');
      console.log('URL:', `${authUrl}/item/${itemData.id}`);
      console.log('Token:', authStore.token ? 'Present' : 'Missing');
      console.log('Data:', itemData);

      const res = await $fetch(`${authUrl}/item/${itemData.id}`, {
        method: 'PUT',
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authStore.token}`,
          'ngrok-skip-browser-warning': 'true',
        },
        body: { name: itemData.name }
      });
      
      console.log('=== UPDATE SUCCESS RESPONSE ===');
      console.log('Response:', res);
      
      await fetchItems();
      return { success: true, data: res };
      
    } catch (err) {
      console.log('=== UPDATE ERROR RESPONSE ===');
      console.error('Error status:', err.status || err.statusCode);
      console.error('Error data:', err.data);
      console.error('Full error:', err);
      
      return { success: false, error: err };
    }
  };

  return {
    items: readonly(items),
    pending: readonly(pending),
    error: readonly(error),
    fetchItems,
    createItem,
    deleteItem,
    updateItem
  };
};
