import { defineStore } from "pinia";

import axiosConfig from "@/service/axiosConfig";

export const useAdminMessagesStore = defineStore("adminMessages", {
    actions: {
        getMessages(params) {
            return axiosConfig
                .get("/admin/message", { params })
                .then((response) => {
                    return response.data;
                })
                .catch((error) => {
                    console.error(error);
                });
        },
        getMessage(id) {
            return axiosConfig
                .get(`/admin/message/${id}`)
                .then((response) => {
                    return response.data;
                })
                .catch((error) => {
                    console.error(error);
                });
        },
        createMessage(user) {
            return axiosConfig
                .post("/admin/message", user)
                .then((response) => {
                    return response.data;
                })
                .catch((error) => {
                    console.error(error);
                });
        },
        updateMessage(userId, data) {
            return axiosConfig
                .patch(`/admin/message/${userId}`, data)
                .then((response) => {
                    return response.data;
                })
                .catch((error) => {
                    console.error(error);
                });
        },
    },
});
