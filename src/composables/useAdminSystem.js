import { useAdminSystemStore } from "@/stores/adminSystemStore";

const useAdminFlowmaze = () => {
  const adminSystemStore = useAdminSystemStore();

  // ACTIONS
  const getEasymazeEntitiesList = async (params) => {
    const response = await adminSystemStore.getEasymazeEntitiesList({
      per_page: 99999, // get all entities by default
      ...params,
    });
    const easymazeEntities = response.data;
    const totalRecords = response.meta.total;

    return { data: easymazeEntities, totalRecords };
  };

  const getSLAValue = async () => {
    try {
      return await adminSystemStore.getSALValue();
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const updateSLAValue = async (SLAValue) => {
    try {
      return await adminSystemStore.updateSLAValue({ value: SLAValue });
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  return {
    // ACTIONS
    getEasymazeEntitiesList,
    getSLAValue,
    updateSLAValue,
  };
};

export default useAdminFlowmaze;
