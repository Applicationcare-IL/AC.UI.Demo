import { useMessagesStore } from "@/stores/messagesStore";

const useMessages = () => {
  const messagesStore = useMessagesStore();

  const readMessage = (messageId) => {
    try {
      messagesStore.readMessage(messageId);
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  return {
    // ACTIONS
    getMessages: messagesStore.getMessages,
    readMessage,
  };
};

export default useMessages;
