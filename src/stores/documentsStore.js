import axiosConfig from "@/service/axiosConfig";

import { defineStore } from "pinia";

export const useDocumentsStore = defineStore("documents", {
  actions: {
    getDocumentsFromApi(params) {
      return axiosConfig
        .get("/documents", { params })
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          console.error(error);
        });
    },
    createDocument(document) {
      return axiosConfig
        .post("/documents", document)
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          console.error(error);
          throw error;
        });
    },
    updateDocument(id, document) {
      return axiosConfig
        .patch("/documents/" + id, document)
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          console.error(error);
          throw error;
        });
    },
  },
});
