import { defineStore } from "pinia";

import axiosConfig from "@/service/axiosConfig";

export const useAdminReportsStore = defineStore("adminReports", {
  actions: {
    getReports(params) {
      return axiosConfig
        .get("/admin/reports", { params })
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          console.error(error);
        });
    },
    getReport(id) {
      return axiosConfig
        .get(`/admin/reports/${id}`)
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          console.error(error);
        });
    },
    createReport(data) {
      return axiosConfig
        .post("/admin/reports", data)
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          console.error(error);
        });
    },
    updateReport(reportId, data) {
      return axiosConfig
        .patch(`/admin/reports/${reportId}`, data)
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          console.error(error);
        });
    },
  },
});
