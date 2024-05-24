import { defineStore } from "pinia";

import axiosConfig from "@/service/axiosConfig";

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

    activateCustomer(id) {
      return axiosConfig
        .post("/customers/" + id + "/activate")
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          console.error(error);
          throw error;
        });
    },
    deactivateCustomer(id) {
      return axiosConfig
        .post("/customers/" + id + "/deactivate")
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
    assignAssetToCustomer(customerId, asset) {
      const params = {
        customer_id: customerId,
        ...asset,
      };

      return axiosConfig
        .post("/customers/assets", params)
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          console.error(error);
          throw error;
        });
    },
    unassignAssetFromCustomer(customerId, assetId) {
      const params = {
        customer_id: customerId,
        asset_id: assetId,
      };

      return axiosConfig
        .delete("/customers/assets", { data: params })
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          console.error(error);
          throw error;
        });
    },
    exportCustomers(params) {
      return axiosConfig
        .get("/customers/export", { params })
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          console.error(error);
        });
    },
    checkIfCustomerExists(customerNumber) {
      return axiosConfig
        .get("/customers", { params: { number: customerNumber } })
        .then((response) => {
          if (response.data.meta.total > 0) {
            return true;
          }

          return false;
        })
        .catch((error) => {
          console.error(error);
        });
    },
  },
});
