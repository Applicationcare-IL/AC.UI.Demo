import { defineStore } from "pinia";

import axiosConfig from "@/service/axiosConfig";

export const useSchemaStore = defineStore("schema", {
  actions: {
    getSchema(params) {
      return axiosConfig
        .get("/schema", { params })
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          console.error(error);
        });
    },
  },
});
