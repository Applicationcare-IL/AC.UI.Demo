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
    getScript(id) {
      return axiosConfig
        .get(`/admin/flowmaze/scripts/${id}`)
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          console.error(error);
        });
    },
    syncScripts() {
      return axiosConfig
        .post("/admin/flowmaze/scripts/sync")
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          console.error(error);
        });
    },
  },
});
