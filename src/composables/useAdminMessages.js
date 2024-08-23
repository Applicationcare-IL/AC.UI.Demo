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
      // target: {
      //   label: "Services",
      //   value: "service",
      // },
      title: message.topic,
      // start_date: formatDateFromAPI(message.start_date),
      // end_date: formatDateFromAPI(message.end_date),
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
        customer_service_areas: message.customer_service_areas?.map(
          (service_area) => service_area.id
        ),
      };
    }
    if (message.target === "sale") {
      return {};
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
        teams_id: message.teams?.map((team) => team.id),
        roles_id: message.roles?.map((role) => role.id),
        users_id: message.users?.map((user) => user.id),
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
    //UTILITIES
    mapMessage,
    parseMessage,
  };
};

export default useAdminFlowmaze;
