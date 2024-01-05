import { useUtilsStore } from "@/stores/utils";

export function useUtils() {
  const utilsStore = useUtilsStore();

  const getNextEntityID = async (entity) => {
    return await utilsStore.getNextEntityID({
      entity_type: entity,
    });
  };

  return {
    // ACTIONS
    getNextEntityID,
  };
}
