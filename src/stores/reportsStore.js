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
    getReport(id) {
      return axiosConfig
        .get(`/reports/${id}`)
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          console.error(error);
        });
    },
    exportReport(id, params) {
      return axiosConfig
        .get(`/reports/${id}/export`, { params })
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
