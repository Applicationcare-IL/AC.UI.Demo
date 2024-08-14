import { defineStore } from "pinia";

import axiosConfig from "@/service/axiosConfig";

export const useAdminPermissionsStore = defineStore("adminPermissions", {
  actions: {
    getPermissions(params) {
      return axiosConfig
        .get("/admin/permissions", { params })
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          console.error(error);
        });
    },
    updatePermissions(data) {
      return axiosConfig
        .patch("/admin/permissions", data)
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          console.error(error);
          throw new Error(error);
        });
    },
  },
});
