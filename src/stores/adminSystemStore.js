import { defineStore } from "pinia";

import axiosConfig from "@/service/axiosConfig";

export const useAdminSystemStore = defineStore("adminSystem", {
  actions: {
    getEasymazeEntitiesList(params) {
      return axiosConfig
        .get("/admin/system/easymaze-entities", { params })
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          console.error(error);
        });
    },
  },
});
