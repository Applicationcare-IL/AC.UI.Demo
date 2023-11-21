import { useAnnouncementsStore } from "@/stores/announcementsStore";

export function useSidebar() {
  const announcementsStore = useAnnouncementsStore();

  return {
    // ACTIONS
    getAnnouncements: announcementsStore.getAnnouncements,
  };
}
