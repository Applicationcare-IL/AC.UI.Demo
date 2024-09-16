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
          throw error;
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
          throw error;
        });
    },
    duplicateProduct(id, name) {
      return axiosConfig
        .post("/products/" + id + "/duplicate", { name })
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          console.error(error);
          throw error;
        });
    },
    newProductVersion(id) {
      return axiosConfig
        .post("/products/" + id + "/new-version")
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          console.error(error);
          throw error;
        });
    },
    activateProduct(id) {
      return axiosConfig
        .post("/products/" + id + "/activate")
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          console.error(error);
          throw error;
        });
    },
    deactivateProduct(id) {
      return axiosConfig
        .post("/products/" + id + "/deactivate")
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          console.error(error);
          throw error;
        });
    },
    // DISCOUNTS
    getProductDiscounts(productId, params) {
      return axiosConfig
        .get("/products/" + productId + "/discounts", { params })
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          console.error(error);
          throw error;
        });
    },
    addProductDiscount(productId, params) {
      return axiosConfig
        .post("/products/" + productId + "/discounts", params)
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          console.error(error);
          throw error;
        });
    },
    updateProductDiscount(productId, discountId, params) {
      return axiosConfig
        .patch("/products/" + productId + "/discounts/" + discountId, params)
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          console.error(error);
          throw error;
        });
    },
    deleteProductDiscount(productId, discountId) {
      return axiosConfig
        .delete("/products/" + productId + "/discounts/" + discountId)
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          console.error(error);
          throw error;
        });
    },
    checkIfDiscountExists({ productId, quantity }) {
      return axiosConfig
        .post("/products/" + productId + "/discounts/exists", { quantity })
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          console.error(error);
          throw error;
        });
    },
    // RELATED PRODUCTS
    getRelatedProducts(productId, params) {
      return axiosConfig
        .get("/products/" + productId + "/related", { params })
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          console.error(error);
          throw error;
        });
    },
    getProductRelationshipTypes() {
      return axiosConfig
        .get("/products/relationship-types")
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          console.error(error);
          throw error;
        });
    },
    addRelatedProduct(productId, params) {
      return axiosConfig
        .post("/products/" + productId + "/related", params)
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          console.error(error);
          throw error;
        });
    },
    addRelatedProductBulk(productId, relationships) {
      return axiosConfig
        .post("/products/" + productId + "/related/bulk", relationships)
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          console.error(error);
          throw error;
        });
    },
    updateRelatedProduct(productId, relatedProductId, params) {
      return axiosConfig
        .patch("/products/" + productId + "/related/" + relatedProductId, params)
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          console.error(error);
          throw error;
        });
    },
    deleteRelatedProduct(productId, relatedProductId) {
      return axiosConfig
        .delete("/products/" + productId + "/related/" + relatedProductId)
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
