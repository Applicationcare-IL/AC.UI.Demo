import { useFlowmazeStore } from "@/stores/flowmazeStore";

const useFlowmaze = () => {
  const flowmazeStore = useFlowmazeStore();

  // ACTIONS
  const getScripts = async (params) => {
    const response = await flowmazeStore.getScripts(params);
    const scripts = response.data;
    const totalRecords = response.meta.total;

    return { data: mapScripts(scripts), totalRecords };
  };

  const mapScripts = (scripts) => {
    return scripts.map((script) => {
      return {
        ...script,
        id: script.id,
        name: script.name,
      };
    });
  };

  const executeIssue = (params) => {
    return new Promise((resolve, reject) => {
      flowmazeStore
        .issue(params)
        .then((res) => {
          resolve(res);
        })
        .catch((error) => {
          console.error("Composable error: ", error);
          reject(error);
        });
    });
  };

  return {
    // ACTIONS
    getScripts,
    executeIssue,
  };
};

export default useFlowmaze;
