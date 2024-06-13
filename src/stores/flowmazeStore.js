import { defineStore } from "pinia";

import axiosConfig from "@/service/axiosConfig";

export const useFlowmazeStore = defineStore("flowmaze", {
  actions: {
    getScripts(params) {
      return axiosConfig
        .get("/flowmaze/scripts", { params })
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          console.error(error);
        });
    },
  },
});
