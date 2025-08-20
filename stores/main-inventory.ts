import { defineStore } from "pinia";

export const useMainInventoryStore = defineStore("main-inventory", {
    state: () => ({
        input: {
            type: '',
        },
        filter: {
          search: '',
        },
        inventory: [],
    }),
});

export const useSubItemStore = defineStore("sub-item", {
    state: () => ({
        subItems: [],
        filter: {
            search: '',
        },
    })
});

export const useUnitItemStore = defineStore("unit-item", {
  state: () => ({
    unitItems: [],
    filter: {
      search: '',
    },
  }),
  getters: {
    subItems: () => {
      const subItemStore = useSubItemStore()
      return subItemStore.subItems
    }
  }
})

export const useConsumableStore = defineStore("consumable", {
  state: () => {
    const authStore = useAuthStore() 
    return {
      input: {
        id: '',
        name: '',
        quantity: '',
        unit: '',
        major_id: authStore.major_id,
      },
      filter: {
        search: '',
      },
      consumables: [],
    }
  },
})

export const useAdminInventoryStore = defineStore("admin-inventory", {
    state: () => ({
        input: {
            id: '',
            item_id: '',
            merk: '',
            procurement_date: '',
            description: '',
            condition: '',
        },
        inputConsumable: {
            name: '',
            quantity: '',
            unit: '',
        },
        inventory: [],
    })
});