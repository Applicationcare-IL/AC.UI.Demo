import { defineStore } from "pinia";

import axiosConfig from "@/service/axiosConfig";

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
    getQuickCodes() {
      return axiosConfig
        .get("/services/quick-codes")
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          console.error(error);
        });
    },
    getSLADistribution(params) {
      return axiosConfig
        .get("/services/by-sla", { params })
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          console.error(error);
        });
    },
    getTrendingAreas(params) {
      return axiosConfig
        .get("/services/trending-areas", { params })
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          console.error(error);
        });
    },
    exportServices(params) {
      return axiosConfig
        .get("/services/export", { params })
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          console.error(error);
        });
    },
    getSLATableData(params) {
      return axiosConfig
        .get("/services/areas-by-sla", { params })
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          console.error(error);
        });
    },
    linkServices(params) {
      return axiosConfig
        .post("/services/link-all", params)
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          console.error(error);
          throw error;
        });
    },
    linkService(params) {
      return axiosConfig
        .post("/services/link", params)
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          console.error(error);
          throw error;
        });
    },
    unlinkService(params) {
      return axiosConfig
        .post("/services/unlink", params)
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          console.error(error);
          throw error;
        });
    },
    getAvgDuration(params) {
      return axiosConfig
        .get("/services/avg-duration", { params })
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          console.error(error);
        });
    },
  },
});
