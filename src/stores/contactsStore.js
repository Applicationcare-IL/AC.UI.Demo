import axiosConfig from "@/service/axiosConfig";

import { defineStore } from "pinia";
import { useOptionSetsStore } from "@/stores/optionSets";

const optionSetsStore = useOptionSetsStore();

export const useContactsStore = defineStore("contacts", {
  actions: {
    getContactFromApi(id) {
      return axiosConfig
        .get("/contacts/" + id)
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },

    getContactsFromApi(params) {
      return axiosConfig
        .get("/contacts", { params })
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },

    createContact(contact) {
      return axiosConfig
        .post("/contacts", contact)
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          console.log(error);
          throw error;
        });
    },

    updateContact(id, contact) {
      console.log(contact);
      return axiosConfig
        .patch("/contacts/" + id, contact)
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
        .patch("/contacts/" + id, params)
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
