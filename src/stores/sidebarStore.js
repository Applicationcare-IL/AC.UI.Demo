import { defineStore } from "pinia";

export const useSidebarStore = defineStore("sidebar", {
  state: () => {
    return { activeSidebar: [] };
  },
  actions: {
    toggleActiveSidebar(activeSidebarName) {
      const index = this.activeSidebar.indexOf(activeSidebarName);
      if (index === -1) {
        this.activeSidebar.push(activeSidebarName);
      } else {
        this.activeSidebar.splice(index, 1);
      }
    },
    openSidebar(activeSidebarName) {
      if (!this.activeSidebar.includes(activeSidebarName)) {
        this.activeSidebar.push(activeSidebarName);
      }
    },
    closeSidebar(activeSidebarName) {
      const index = this.activeSidebar.indexOf(activeSidebarName);
      if (index !== -1) {
        this.activeSidebar.splice(index, 1);
      }
    },
  },
});
