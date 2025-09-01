// stores/sidebar.ts
import { defineStore } from "pinia";

interface SidebarState {
  isCollapsed: boolean;
}

export const useSidebarStore = defineStore("sidebar", {
  state: (): SidebarState => ({
    isCollapsed: false,
  }),
  actions: {
    toggle() {
      this.isCollapsed = !this.isCollapsed;
    },
  },
});