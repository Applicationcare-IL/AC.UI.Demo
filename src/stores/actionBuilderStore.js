import { defineStore } from "pinia";

import axiosConfig from "@/service/axiosConfig";

export const useActionBuilderStore = defineStore("actionBuilder", {
  actions: {
    getScopes(params) {
      return axiosConfig
        .get("/url-action-builder/scopes", { params })
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
