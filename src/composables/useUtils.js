import { useUtilsStore } from "@/stores/utils";

export function useUtils() {
  const utilsStore = useUtilsStore();

  const getNextEntityID = async (entity) => {
    const response = await utilsStore.getNextEntityID({
      entity_type: entity,
    });

    return response.data.id;
  };

  return {
    // ACTIONS
    getNextEntityID,
  };
}
