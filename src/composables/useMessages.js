import { useMessagesStore } from "@/stores/messagesStore";

const useMessages = () => {
  const messagesStore = useMessagesStore();

  return {
    // ACTIONS
    getMessages: messagesStore.getMessages,
  };
};

export default useMessages;
