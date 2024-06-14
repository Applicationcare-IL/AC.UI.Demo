import { useAdminFlowmazeStore } from "@/stores/adminFlowmazeStore";

export function useAdminFlowmaze() {
  const adminFlowmazeStore = useAdminFlowmazeStore();

  // ACTIONS
  const getScripts = async (params) => {
    const response = await adminFlowmazeStore.getScripts(params);
    const scripts = response.data;
    const totalRecords = response.meta.total;

    return { data: scripts, totalRecords };
  };

  const syncScripts = async () => {
    await adminFlowmazeStore.syncScripts();
  };

  return {
    // ACTIONS
    getScripts,
    syncScripts,
  };
}
