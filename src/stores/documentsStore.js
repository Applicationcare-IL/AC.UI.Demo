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
  },
});
