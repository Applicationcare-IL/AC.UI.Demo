import { defineStore } from "pinia";

import axiosConfig from "@/service/axiosConfig";

export const useReportsStore = defineStore("reports", {
  actions: {
    getReports(params) {
      return axiosConfig
        .get("/reports", { params })
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          console.error(error);
        });
    },
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
