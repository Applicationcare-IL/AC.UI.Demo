import { defineStore } from "pinia";

import axiosConfig from "@/service/axiosConfig";

export const useAdminFlowmazeStore = defineStore("adminFlowmaze", {
  actions: {
    getScripts(params) {
      return axiosConfig
        .get("/admin/flowmaze/scripts", { params })
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          console.error(error);
        });
    },
  },
});
