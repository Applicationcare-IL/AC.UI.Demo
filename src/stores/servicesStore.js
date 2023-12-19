import axiosConfig from "@/service/axiosConfig";
import { defineStore } from "pinia";

export const useServicesStore = defineStore("services", {
  actions: {
    getServicesFromApi(params) {
      return axiosConfig
        .get("/services", { params })
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          console.error(error);
        });
    },
    getServiceFromApi(id) {
      return axiosConfig
        .get("/services/" + id)
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          console.error(error);
        });
    },
    createService(service) {
      return axiosConfig
        .post("/services", service)
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          console.error(error);
          throw error;
        });
    },

    updateService(id, service) {
      return axiosConfig
        .patch("/services/" + id, service)
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          console.error(error);
          throw error;
        });
    },

    cancelService(id, reasons) {
      return axiosConfig
        .post("/services/" + id + "/cancel", reasons)
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          console.error(error);
          throw error;
        });
    },
  },
});
