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
    createOfferedProducts(saleId, productIds) {
      return axiosConfig
        .post("/sales/" + saleId + "/product-offered", { ids: productIds })
        .then((response) => {
          return response;
        })
        .catch((error) => {
          console.error(error);
          throw error;
        });
    },
    updateOfferedProduct(saleId, productId, params) {
      return axiosConfig
        .patch("/sales/" + saleId + "/product-offered/" + productId, params)
        .then((response) => {
          return response;
        })
        .catch((error) => {
          console.error(error);
          throw error;
        });
    },
    orderSaleProducts(saleId, params) {
      return axiosConfig
        .post("/sales/" + saleId + "/order", params)
        .then((response) => {
          return response;
        })
        .catch((error) => {
          console.error(error);
          throw error;
        });
    },
  },
});
