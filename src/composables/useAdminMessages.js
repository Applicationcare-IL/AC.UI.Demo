import { useAdminMessagesStore} from "@/stores/adminMessagesStore";

const useAdminFlowmaze = () => {
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
    }

    const createMessage = async (message) => {
        return await adminMessagesStore.createMessage(message);
    }

    const updateMessage = async (messageId, data) => {
        return await adminMessagesStore.updateMessage(messageId, data);
    }

    const mapMessage = (message) => {
        return {
            ...message,
            link_detail: {
                text: message.id,
                id: message.id,
            },
            title: message.topic,
            //fake state to be able to show something in the list
            state: {
                id: 291,
                value: "active",
                value_en: "Active",
                value_he: "פעיל",
                attributes: []
            },
        }
    };

    const parseMessage = (message) => {
        return {
            ...message,
        }
    }

    return {
        // ACTIONS
        getMessages,
        getMessage,
        createMessage,
        updateMessage,
        //UTILITIES
        mapMessage,
        parseMessage,
    }
}

export default useAdminFlowmaze;