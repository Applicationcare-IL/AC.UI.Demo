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
    },
});