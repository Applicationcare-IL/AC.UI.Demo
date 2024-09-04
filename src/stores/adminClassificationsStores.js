import {defineStore} from "pinia";

import axiosConfig from "@/service/axiosConfig";

export const useAdminClassificationsStore = defineStore("adminClassifications", {
    actions: {
        getClassifications(params) {
            return axiosConfig
                .get("/admin/classifications", {params})
                .then((response) => {
                    return response.data;
                })
                .catch((error) => {
                    console.error(error);
                });
        }
    },
});