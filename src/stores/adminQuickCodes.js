import {defineStore} from "pinia";

import axiosConfig from "@/service/axiosConfig";

export const useAdminQuickCodesStore = defineStore("adminQuickCodes", {
    actions: {
        getQuickCodes(params) {
            return axiosConfig
                .get("/admin/quick-codes", {params})
                .then((response) => {
                    return response.data;
                })
                .catch((error) => {
                    console.error(error);
                });
        },
        getQuickCode(id) {
            return axiosConfig
                .get(`/admin/quick-codes/${id}`)
                .then((response) => {
                    return response.data;
                })
                .catch((error) => {
                    console.error(error);
                });
        },
        createQuickCode(quickCode) {
            return axiosConfig
                .post("/admin/quick-codes", quickCode)
                .then((response) => {
                    return response.data;
                })
                .catch((error) => {
                    console.error(error);
                });
        },
        updateQuickCode(quickCodeId, data) {
            return axiosConfig
                .patch(`/admin/quick-codes/${quickCodeId}`, data)
                .then((response) => {
                    return response.data;
                })
                .catch((error) => {
                    console.error(error);
                });
        },
        activateQuickCode(quickCodeId) {
            return axiosConfig
                .post(`/admin/quick-codes/${quickCodeId}/activate`)
                .then((response) => {
                    return response.data;
                })
                .catch((error) => {
                    console.error(error);
                });
        },
        deactivateQuickCode(quickCodeId) {
            return axiosConfig
                .post(`/admin/quick-codes/${quickCodeId}/deactivate`)
                .then((response) => {
                    return response.data;
                })
                .catch((error) => {
                    console.error(error);
                });
        },
    }
});