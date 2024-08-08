import { defineStore } from "pinia";

import axiosConfig from "@/service/axiosConfig";

export const useAdminRolesStore = defineStore("adminRoles", {
  actions: {
    getRoles(params) {
      return axiosConfig
        .get("/admin/roles", { params })
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          console.error(error);
        });
    },
    getRole(id) {
      return axiosConfig
        .get(`/admin/roles/${id}`)
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          console.error(error);
        });
    },
    createRole(role) {
      return axiosConfig
        .post("/admin/roles", role)
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          console.error(error);
        });
    },
    updateRole(roleId, data) {
      return axiosConfig
        .patch(`/admin/roles/${roleId}`, data)
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          console.error(error);
        });
    },
    activateRole(roleId) {
      return axiosConfig
        .post(`/admin/roles/${roleId}/activate`)
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          console.error(error);
        });
    },
    addUsers(roleId, userIds) {
      return axiosConfig
        .post(`/admin/roles/${roleId}/users/add`, userIds)
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          console.error(error);
        });
    },
    removeUsers(roleId, userIds) {
      return axiosConfig
        .post(`/admin/roles/${roleId}/users/remove`, userIds)
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          console.error(error);
        });
    },
  },
});
