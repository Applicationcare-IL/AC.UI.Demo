import { defineStore } from "pinia";

import axiosConfig from "@/service/axiosConfig";

export const useReportsStore = defineStore("reports", {
  actions: {
    getReport(params) {
      return axiosConfig
        .get("/reports", { params })
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          console.error(error);
        });
    },
  },
});
