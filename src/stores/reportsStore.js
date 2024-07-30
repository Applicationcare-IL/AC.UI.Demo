import { defineStore } from "pinia";

import axiosConfig from "@/service/axiosConfig";

export const useReportsStore = defineStore("reports", {
  actions: {
    getReportData(params) {
      return axiosConfig
        .get("/reports/data", { params })
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          console.error(error);
        });
    },
  },
});
