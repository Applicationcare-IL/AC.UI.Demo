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
  },
});
