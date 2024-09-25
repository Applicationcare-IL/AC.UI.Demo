import { defineStore } from "pinia";

import axiosConfig from "@/service/axiosConfig";

export const useAdminOptionSetsStore = defineStore("adminOptionSets", {
  actions: {
    getOptionSets(params) {
      return axiosConfig
        .get("/admin/options-set", { params })
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          console.error(error);
        });
    },
    addValue(params) {
      return axiosConfig
        .post(`/admin/options-set`, { ...params })
        .then(({ data }) => {
          return data;
        })
        .catch((error) => {
          console.error(error);
          throw error;
        });
    },
    activateOptionSet(id) {
      return axiosConfig
        .post(`/admin/options-set/${id}/activate`)
        .then(({ data }) => {
          return data;
        })
        .catch((error) => {
          console.error(error);
          throw error;
        });
    },
    deactivateOptionSet(id) {
      return axiosConfig
        .post(`/admin/options-set/${id}/deactivate`)
        .then(({ data }) => {
          return data;
        })
        .catch((error) => {
          console.error(error);
          throw error;
        });
    },
  },
});
