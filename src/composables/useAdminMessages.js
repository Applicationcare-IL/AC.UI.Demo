import { useAdminMessagesStore } from "@/stores/adminMessagesStore";

const useAdminFlowmaze = () => {
  const { formatDateToAPI } = useDates();
  const adminMessagesStore = useAdminMessagesStore();

  // ACTIONS
  const getMessages = async (params) => {
    const response = await adminMessagesStore.getMessages(params);
    const messages = response.data.map((message) => mapMessage(message));
    const totalRecords = response.meta.total;

    return { data: messages, totalRecords };
  };

  const getMessage = async (id) => {
    const response = await adminMessagesStore.getMessage(id);

    return mapMessage(response.data);
  };

  const createMessage = async (message) => {
    return await adminMessagesStore.createMessage(message);
  };

  const updateMessage = async (messageId, data) => {
    return await adminMessagesStore.updateMessage(messageId, data);
  };

  const mapMessage = (message) => {
    return {
      ...message,
      link_detail: {
        text: message.id,
        id: message.id,
      },
      title: message.topic,
      target: "services",
      //fake state to be able to show something in the list
      state: {
        id: 291,
        value: "active",
        value_en: "Active",
        value_he: "פעיל",
        attributes: [],
      },
    };
  };

  const parseMessage = (message) => {
    return {
      ...message,
      important: message.important.value,
      teams_id: message.teams_id.map((team) => team.id),
      roles_id: message.roles_id.map((role) => role.id),
      users_id: message.users_id.map((user) => user.id),
      start_date: formatDateToAPI(message.start_date),
    };
  };

  return {
    // ACTIONS
    getMessages,
    getMessage,
    createMessage,
    updateMessage,
    //UTILITIES
    mapMessage,
    parseMessage,
  };
};

export default useAdminFlowmaze;
