import { useCommunicationsStore } from "@/stores/communicationsStore";

export function useCommunications() {
  const communicationStore = useCommunicationsStore();

  const addAttachmentToEmail = async (formData) => {
    try {
      const response = await communicationStore.addAttachmentToEmail(formData);
      return response;
    } catch (error) {
      console.error(error);
    }
  };

  return {
    // ACTIONS
    sendSMS: communicationStore.sendSMS,
    sendEmail: communicationStore.sendEmail,
    addAttachmentToEmail,
    deleteAttachment: communicationStore.deleteAttachment,
  };
}
