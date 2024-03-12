import { defineStore } from "pinia";

import axiosConfig from "@/service/axiosConfig";

export const useActionBuilderStore = defineStore("actionBuilder", {
  actions: {
    getScopes(params) {
      return axiosConfig
        .get("/url-action-builder/scopes", { params })
        .then((response) => {
          return response.data.data;
        })
        .catch((error) => {
          console.error(error);
        });
    },
    executeAction(params) {
      return axiosConfig
        .post("/url-action-builder", params)
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
