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
    createUser(user) {
      return axiosConfig
        .post("/admin/employees", user)
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          console.error(error);
        });
    },
    updateUser(userId, data) {
      return axiosConfig
        .patch(`/admin/employees/${userId}`, data)
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          console.error(error);
        });
    },
    activateUser(userId) {
      return axiosConfig
        .post(`/admin/employees/${userId}/activate`)
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          console.error(error);
        });
    },
    deactivateUser(userId) {
      return axiosConfig
          .post(`/admin/employees/${userId}/deactivate`)
          .then((response) => {
            return response.data;
          })
          .catch((error) => {
            console.error(error);
          });
    },
    unlockUser(userId) {
      return axiosConfig
          .post(`/admin/employees/${userId}/unlock`)
          .then((response) => {
            return response.data;
          })
          .catch((error) => {
            console.error(error);
          });
    },
    resetPassUser(userId) {
      return axiosConfig
          .post(`/admin/employees/${userId}/send-reset-password-email`)
          .then((response) => {
            return response.data;
          })
          .catch((error) => {
            console.error(error);
          });
    },
    checkIfUserExists(userEmail) {
      return axiosConfig
          .post("/admin/employees/exists", { email: userEmail })
          .then((response) => {
            return response.data.exists;
          })
          .catch((error) => {
            console.error(error);
          });
    },
  },
});
