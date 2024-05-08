import { defineStore } from "pinia";

import axiosConfig from "@/service/axiosConfig";

export const useEmployeesStore = defineStore("employees", {
  actions: {
    getTeams() {
      return axiosConfig
        .get("/teams")
        .then((response) => {
          const data = response.data.data;
          return { data };
        })
        .catch((error) => {
          console.error(error);
        });
    },
  },
});
