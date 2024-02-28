import { useCallsStore } from "@/stores/callsStore";

export function useCalls() {
  const callsStore = useCallsStore();

  const takeCall = (callId, params) => {
    return callsStore.takeCall(callId, params);
  };

  return {
    // ACTIONS
    takeCall,
  };
}
