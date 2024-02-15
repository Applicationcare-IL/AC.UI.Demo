import { defineStore } from "pinia";

import axiosConfig from "@/service/axiosConfig";

export const useCommunicationsStore = defineStore("communications", {
  actions: {
    sendSMS(params) {
      return axiosConfig
        .post("/communications/sms", params)
        .then((response) => {
          const data = response.data.data;
          return { data };
        })
        .catch((error) => {
          console.error(error);
        });
    },
    sendEmail(params) {
      return axiosConfig
        .post("/communications/email", params)
        .then((response) => {
          const data = response.data.data;
          return { data };
        })
        .catch((error) => {
          console.error(error);
        });
    },
    addAttachmentToEmail(formData) {
      return axiosConfig
        .post("/communications/attachments", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          const data = response.data.data;
          return { data };
        })
        .catch((error) => {
          console.error(error);
        });
    },
    deleteAttachment(attachmentId) {
      return axiosConfig
        .delete(`/communications/attachments/${attachmentId}`)
        .then((response) => {
          const data = response.data.data;
          return { data };
        })
        .catch((error) => {
          console.error(error);
        });
    },
  },
});
