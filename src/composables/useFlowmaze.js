import { useFlowmazeStore } from "@/stores/flowmazeStore";

export function useFlowmaze() {
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
        id: script.id,
        name: script.name,
      };
    });
  };

  const executeIssue = async (params) => {
    await flowmazeStore
      .issue(params)
      .then((res) => {
        return res;
      })
      .catch((error) => {
        console.error("Composable error: ", error);
        throw new Error(error);
      });
  };

  return {
    // ACTIONS
    getScripts,
    executeIssue,
  };
}
