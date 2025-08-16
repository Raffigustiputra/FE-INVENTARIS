import { defineStore } from "pinia";

export const useMainInventoryStore = defineStore("main-inventory", {
    state: () => ({
        input: {
            type: '',
        },
        inventory: [],
    }),
});

export const useSubItemStore = defineStore("sub-item", {
    state: () => ({
        subItems: [],
    })
});

export const useUnitItemStore = defineStore("unit-item", {
    state: () => ({
        unitItems: [],
        subItems: useSubItemStore(),
        filter: {
            search: '',
        },
    })
});

export const useAdminInventoryStore = defineStore("admin-inventory", {
    state: () => ({
        input: {
            id: '',
            item_id: '',
            merk: '',
            procurement_date: '',
            description: '',
        },
        inventory: [],
    })
});