import { useActionBuilderStore } from "@/stores/callsStore";

export function useActionBuilder() {
  const callsStore = useActionBuilderStore();

  const takeCall = (callId, params) => {
    return callsStore.takeCall(callId, params);
  };

  return {
    // ACTIONS
    takeCall,
  };
}
