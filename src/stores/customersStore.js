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
          console.error(error);
        });
    },

    getCustomersFromApi(params) {
      return axiosConfig
        .get("/customers", { params })
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          console.error(error);
        });
    },

    createCustomer(customer) {
      return axiosConfig
        .post("/customers", customer)
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          console.error(error);
          throw error;
        });
    },

    updateCustomer(id, customer) {
      return axiosConfig
        .patch("/customers/" + id, customer)
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          console.error(error);
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
          console.error(error);
          throw error;
        });
    },
    assignContactToCustomer(customerId, contact) {
      const params = {
        customer_id: customerId,
        ...contact,
      };

      return axiosConfig
        .post("/customers/contacts", params)
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          console.error(error);
          throw error;
        });
    },
    unassignContactFromCustomer(customerId, contactId) {
      const params = {
        customer_id: customerId,
        contact_id: contactId,
      };

      return axiosConfig
        .delete("/customers/contacts", { data: params })
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
