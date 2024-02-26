import { defineStore } from "pinia";

import axiosConfig from "@/service/axiosConfig";

export const useAttachmentStore = defineStore("attachment", {
  actions: {
    /**
     * Get attachments from the API
     * @param {Object} params - The parameters to send to the API
     * @param {string} params.entity_type - The entity type
     * @param {number} params.entity_id - The entity ID
     */
    getAttachmentsFromApi(params) {
      return axiosConfig
        .get("/entity-attachments", { params })
        .then((response) => {
          return response;
        })
        .catch((error) => {
          console.error(error);
        });
    },
    uploadAttachment(formData) {
      return axiosConfig
        .post("/entity-attachments/upload", formData, {
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
  },
});
