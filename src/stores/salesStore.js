import { defineStore } from "pinia";

import axiosConfig from "@/service/axiosConfig";

export const useSalesStore = defineStore("sales", {
  actions: {
    getSales(params) {
      return axiosConfig
        .get("/sales", { params })
        .then((response) => {
          return response;
        })
        .catch((error) => {
          console.error(error);
        });
    },
    getSale(id) {
      return axiosConfig
        .get("/sales/" + id)
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          console.error(error);
        });
    },
    createSale(sale) {
      return axiosConfig
        .post("/sales", sale)
        .then((response) => {
          return response;
        })
        .catch((error) => {
          console.error(error);
          throw error;
        });
    },
    updateSale(id, sale) {
      return axiosConfig
        .patch("/sales/" + id, sale)
        .then((response) => {
          return response;
        })
        .catch((error) => {
          console.error(error);
          throw error;
        });
    },
    cancelSale(id) {
      return axiosConfig
        .post("/sales" + id + "/cancel")
        .then((response) => {
          return response;
        })
        .catch((error) => {
          console.error(error);
          throw error;
        });
    },
    getSaleProducts(id, params) {
      return axiosConfig
        .get("/sales/" + id + "/product-offered", { params })
        .then((response) => {
          return response;
        })
        .catch((error) => {
          console.error(error);
        });
    },
  },
});
