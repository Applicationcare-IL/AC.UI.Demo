import axiosConfig from "@/service/axiosConfig";
import { defineStore } from "pinia";

export const useProductsStore = defineStore("products", {
  actions: {
    getProducts(params) {
      return axiosConfig
        .get("/products", { params })
        .then((response) => {
          return response;
        })
        .catch((error) => {
          console.error(error);
        });
    },
    getProduct(params) {
      return axiosConfig
        .get("/products/" + params)
        .then((response) => {
          return response;
        })
        .catch((error) => {
          console.error(error);
        });
    },
    createProdocut(product) {
      return axiosConfig
        .post("/products", product)
        .then((response) => {
          return response;
        })
        .catch((error) => {
          console.error(error);
        });
    },
  },
});
