import { useActionBuilderStore } from "@/stores/actionBuilderStore";

export function useActionBuilder() {
  const actionBuilderStore = useActionBuilderStore();

  const getScopes = (entityType, view) => {
    const params = {
      entity_type: entityType,
      view,
    };

    return actionBuilderStore.getScopes(params);
  };

  const executeAction = async (params) => {
    return await actionBuilderStore.executeAction(params);
  };

  return {
    // ACTIONS
    getScopes,
    executeAction,
  };
}
