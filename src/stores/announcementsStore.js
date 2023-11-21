import axiosConfig from "@/service/axiosConfig";
import { defineStore } from "pinia";

export const useTasksStore = defineStore("tasks", {
  actions: {
    getAnnouncements(params) {
      return axiosConfig
        .get("/messages", { params })
        .then((response) => {
          const data = response.data.data;
          return { data };
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
});
