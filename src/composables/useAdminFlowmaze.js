import { useAdminFlowmazeStore } from "@/stores/adminFlowmazeStore";

const useAdminFlowmaze = () => {
  const adminFlowmazeStore = useAdminFlowmazeStore();

  // ACTIONS
  const getScripts = async (params) => {
    const response = await adminFlowmazeStore.getScripts(params);
    const scripts = response.data;
    const totalRecords = response.meta.total;

    return { data: scripts, totalRecords };
  };

  const getScript = async (id) => {
    const response = await adminFlowmazeStore.getScript(id);
    return mapScript(response.data);
  };

  const syncScripts = async () => {
    await adminFlowmazeStore.syncScripts();
  };

  const mapScript = (script) => {
    return {
      title: script.name,
      ...script,
    };
  };

  return {
    // ACTIONS
    getScripts,
    getScript,
    syncScripts,
    // UTILITIES
    mapScript,
  };
};

export default useAdminFlowmaze;
