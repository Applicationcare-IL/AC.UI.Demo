import axiosConfig from "@/service/axiosConfig";
import { defineStore } from "pinia";

export const useJournalStore = defineStore("journal", {
  actions: {
    getJournalFromApi(params) {
      return axiosConfig
        .get("/journal", { params })
        .then((response) => {
          return response;
        })
        .catch((error) => {
          console.error(error);
        });
    },
    postJournalInApi(params) {
      return axiosConfig
        .post("/journal", params)
        .then((response) => {})
        .catch((error) => {
          console.error(error);
        });
    },
  },
});
