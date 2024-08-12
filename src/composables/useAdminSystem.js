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

  return {
    // ACTIONS
    getEasymazeEntitiesList,
  };
};

export default useAdminFlowmaze;
