import { useAnnouncementsStore } from "@/stores/announcementsStore";

export function useAnnouncements() {
  const announcementsStore = useAnnouncementsStore();

  return {
    // ACTIONS
    getAnnouncements: announcementsStore.getAnnouncements,
  };
}
