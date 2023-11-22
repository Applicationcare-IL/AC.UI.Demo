import { useSearchStore } from "@/stores/searchStore";

export function useSearch() {
  const searchStore = useSearchStore();

  return {
    // ACTIONS
    globalSearch: searchStore.globalSearch,
  };
}
