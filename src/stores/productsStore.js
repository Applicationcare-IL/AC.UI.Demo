import { defineStore } from "pinia";

import axiosConfig from "@/service/axiosConfig";

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
    getProduct(id) {
      return axiosConfig
        .get("/products/" + id)
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          console.error(error);
        });
    },
    createProduct(product) {
      return axiosConfig
        .post("/products", product)
        .then((response) => {
          return response;
        })
          .catch((error) => {
              console.error(error);
              throw new Error(error);
          });
    },
      updateProduct(id, product) {
          return axiosConfig
              .patch("/products/" + id, product)
              .then((response) => {
                  return response;
              })
        .catch((error) => {
          console.error(error);
          throw new Error(error);
        });
    },
  },
});
