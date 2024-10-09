import { useAdminMessagesStore } from "@/stores/adminMessagesStore";

const useAdminFlowmaze = () => {
  const { formatDateToAPI, formatDateFromAPI } = useDates();
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

  const activateMessage = async (data) => {
    return await adminMessagesStore.activateMessage(data);
  };

  const deactivateMessage = async (data) => {
    return await adminMessagesStore.deactivateMessage(data);
  };

  const mapMessage = (message) => {
    return {
      ...message,
      link_detail: {
        text: message.id,
        id: message.id,
      },
      title: message.topic,
      start_date: message.start_date ? formatDateFromAPI(message.start_date) : null,
      end_date: message.end_date ? formatDateFromAPI(message.end_date) : null,
      service_type: message.service_type_id, //temporal fix until backend fix the _id
    };
  };

  const parseTargetFields = (message) => {
    if (message.target === "service") {
      return {
        service_area: message.service_area?.id,
        service_type: message.service_type?.id,
        service_request_1: message.service_request_1?.id,
        service_request_2: message.service_request_2?.id,
        service_request_3: message.service_request_3?.id,
      };
    }

    if (message.target === "customer") {
      return {
        customer_service_areas: message.customer_service_areas
          ? message.customer_service_areas.map((service_area) => service_area.id)
          : [],
        customer_types: message.customer_types ? message.customer_types : [],
        customer_ratings: message.customer_ratings ? message.customer_ratings : [],
      };
    }

    if (message.target === "sale") {
      return {
        sale_type: message.sale?.id,
        sale_initiator: message.source?.id,
        tender: message.tender?.value ? 1 : 0,
      };
    }

    if (message.target === "project") {
      return {
        project_type_id: message.project_type?.id,
        project_area_id: message.project_area?.id,
        project_detail_id: message.project_detail?.id,
      };
    }

    if (message.target === "employee") {
      return {
        teams_id: message.teams ? message.teams.map((team) => team.id) : [],
        roles_id: message.roles ? message.roles.map((role) => role.id) : [],
        users_id: message.users ? message.users.map((user) => user.id) : [],
      };
    }
  };

  const parseMessage = (message) => {
    let targetFields = parseTargetFields(message);

    return {
      ...message,
      important: message.important.value === "true" ? 1 : 0,
      start_date: formatDateToAPI(message.start_date),
      end_date: formatDateToAPI(message.end_date),
      ...targetFields,
    };
  };

  return {
    // ACTIONS
    getMessages,
    getMessage,
    createMessage,
    updateMessage,
    activateMessage,
    deactivateMessage,
    //UTILITIES
    mapMessage,
    parseMessage,
  };
};

export default useAdminFlowmaze;
