import { defineStore } from "pinia";

import axiosConfig from "@/service/axiosConfig";

export const useContactsStore = defineStore("contacts", {
  state: () => ({
    selectedContacts: [],
  }),
  actions: {
    getContactFromApi(id) {
      return axiosConfig
        .get("/contacts/" + id)
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          console.error(error);
        });
    },

    getContactsFromApi(params) {
      return axiosConfig
        .get("/contacts", { params })
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          console.error(error);
        });
    },

    createContact(contact) {
      return axiosConfig
        .post("/contacts", contact)
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          console.error(error);
          throw error;
        });
    },

    updateContact(id, contact) {
      return axiosConfig
        .patch("/contacts/" + id, contact)
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          console.error(error);
          throw error;
        });
    },

    activateContact(id) {
      return axiosConfig
        .post("/contacts/" + id + "/activate")
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          console.error(error);
        });
    },

    deactivateContact(id) {
      return axiosConfig
        .post("/contacts/" + id + "/deactivate")
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          console.error(error);
        });
    },

    checkIfContactExists(contactNumber) {
      return axiosConfig
        .get("/contacts", { params: { contact_number: contactNumber } })
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

    // SELECTED CONTACTS
    setSelectedContacts(contacts) {
      this.selectedContacts = contacts;
    },
    addSelectedContact(contact) {
      this.selectedContacts.push(contact);
    },
    removeSelectedContact(contact) {
      this.selectedContacts = this.selectedContacts.filter(
        (item) => item.id !== contact.id
      );
    },
    resetSelectedContacts() {
      this.selectedContacts = [];
    },
    exportContacts() {
      return axiosConfig
        .get("/contacts/export")
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          console.error(error);
        });
    },
  },
});
