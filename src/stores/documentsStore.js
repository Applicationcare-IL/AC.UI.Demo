import { defineStore } from "pinia";

import axiosConfig from "@/service/axiosConfig";

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
    deleteDocument(id) {
      return axiosConfig
        .delete("/documents/" + id)
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          console.error(error);
          throw error;
        });
    },
    uploadDocument(id, document) {
      return axiosConfig
        .post("/documents/" + id + "/upload", document)
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          console.error(error);
          throw error;
        });
    },
    downloadDocument(id) {
      return axiosConfig
        .get("/documents/" + id + "/download", {
          responseType: "blob",
        })
        .then((response) => {
          return response;
        })
        .catch((error) => {
          console.error(error);
          throw error;
        });
    },
  },
});
