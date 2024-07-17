import { defineStore } from "pinia";

import axiosConfig from "@/service/axiosConfig";

export const useAdminUsersStore = defineStore("adminUsers", {
  actions: {
    getUsers(params) {
      return axiosConfig
        .get("/admin/employees", { params })
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          console.error(error);
        });
    },
    getUser(id) {
      return axiosConfig
        .get(`/admin/employees/${id}`)
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          console.error(error);
        });
    },
  },
});
