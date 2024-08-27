import { defineStore } from "pinia";

import axiosConfig from "@/service/axiosConfig";

export const useAdminMessagesStore = defineStore("adminMessages", {
    actions: {
        getMessages(params) {
            return axiosConfig
                .get("/admin/messages", {params})
                .then((response) => {
                    return response.data;
                })
                .catch((error) => {
                    console.error(error);
                });
        },
        getMessage(id) {
            return axiosConfig
                .get(`/admin/messages/${id}`)
                .then((response) => {
                    return response.data;
                })
                .catch((error) => {
                    console.error(error);
                });
        },
        createMessage(user) {
            return axiosConfig
                .post("/admin/messages", user)
                .then((response) => {
                    return response.data;
                })
                .catch((error) => {
                    console.error(error);
                });
        },
        updateMessage(userId, data) {
            return axiosConfig
                .patch(`/admin/messages/${userId}`, data)
                .then((response) => {
                    return response.data;
                })
                .catch((error) => {
                    console.error(error);
                });
        },
        activateMessage(data) {
            return axiosConfig
                .post(`/admin/messages/activate`, data)
                .then((response) => {
                    return response.data;
                })
                .catch((error) => {
                    console.error(error);
                });
        },
        deactivateMessage(data) {
            return axiosConfig
                .post(`/admin/messages/deactivate`, data)
                .then((response) => {
                    return response.data;
                })
                .catch((error) => {
                    console.error(error);
                });
        },
    },
});
