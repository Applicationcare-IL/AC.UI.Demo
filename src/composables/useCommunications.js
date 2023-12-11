import { useCommunicationsStore } from "@/stores/communicationsStore";

export function useCommunications() {
  const communicationStore = useCommunicationsStore();

  return {
    // ACTIONS
    sendSMS: communicationStore.sendSMS,
    sendEmail: communicationStore.sendEmail,
  };
}
