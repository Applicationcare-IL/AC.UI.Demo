import { defineStore } from "pinia";

import axiosConfig from "@/service/axiosConfig";

export const useMessagesStore = defineStore("messages", {
  actions: {
    getMessages(params) {
      return axiosConfig
        .get("/messages", { params })
        .then((response) => {
          const data = response.data.data;
          return { data };
        })
        .catch((error) => {
          console.error(error);
        });
    },
    readMessage(messageId) {
      return axiosConfig
        .post(`/messages/${messageId}/read`)
        .then(({ data }) => {
          return data;
        })
        .catch((error) => {
          console.error(error);
          throw error;
        });
    },
  },
});
