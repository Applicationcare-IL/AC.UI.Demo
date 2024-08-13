import { defineStore } from "pinia";

import axiosConfig from "@/service/axiosConfig";

export const useAdminTeamsStore = defineStore("adminTeams", {
  actions: {
    getTeams(params) {
      return axiosConfig
        .get("/admin/teams", { params })
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          console.error(error);
        });
    },
    getTeam(id) {
      return axiosConfig
        .get(`/admin/teams/${id}`)
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          console.error(error);
        });
    },
    createTeam(team) {
      return axiosConfig
        .post("/admin/teams", team)
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          console.error(error);
        });
    },
    updateTeam(teamId, data) {
      return axiosConfig
        .patch(`/admin/teams/${teamId}`, data)
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          console.error(error);
        });
    },
    activateTeam(teamId) {
      return axiosConfig
        .post(`/admin/teams/${teamId}/activate`)
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          console.error(error);
        });
    },
    deactivateTeam(teamId) {
      return axiosConfig
          .post(`/admin/teams/${teamId}/deactivate`)
          .then((response) => {
            return response.data;
          })
          .catch((error) => {
            console.error(error);
          });
    },
    addUsers(teamId, userIds) {
      return axiosConfig
        .post(`/admin/teams/${teamId}/employees/add`, userIds)
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          console.error(error);
        });
    },
    removeUsers(teamId, userIds) {
      return axiosConfig
        .post(`/admin/teams/${teamId}/employees/remove`, userIds)
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          console.error(error);
        });
    },
  },
});
