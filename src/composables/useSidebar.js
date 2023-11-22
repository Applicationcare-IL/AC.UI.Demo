import { useSidebarStore } from "@/stores/sidebarStore";

export function useSidebar() {
  const sidebarStore = useSidebarStore();

  return {
    // PROPERTIES
    activeSidebar: sidebarStore.activeSidebar,
    // ACTIONS
    toggleActiveSidebar: sidebarStore.toggleActiveSidebar,
    openSidebar: sidebarStore.openSidebar,
    closeSidebar: sidebarStore.closeSidebar,
  };
}
