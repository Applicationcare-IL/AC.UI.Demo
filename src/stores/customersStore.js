import axiosConfig from "@/service/axiosConfig";

import { defineStore } from "pinia";
import { useOptionSetsStore } from "@/stores/optionSets";

const optionSetsStore = useOptionSetsStore();

export const useCustomersStore = defineStore("customers", {
  actions: {
    getCustomerFromApi(id) {
      return axiosConfig
        .get("/customers/" + id)
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },

    getCustomersFromApi(params) {
      console.log(params);
      return axiosConfig
        .get("/customers", { params })
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },

    createCustomer(customer) {
      return axiosConfig
        .post("/customers", customer)
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          console.log(error);
          throw error;
        });
    },

    updateCustomer(id, customer) {
      console.log(customer);
      return axiosConfig
        .patch("/customers/" + id, customer)
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          console.log(error);
          throw error;
        });
    },

    updateState(id, state) {
      const params = {
        state: optionSetsStore.getId("state", state),
      };

      return axiosConfig
        .patch("/customers/" + id, params)
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          console.log(error);
          throw error;
        });
    },
  },
});
