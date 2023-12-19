import axiosConfig from "@/service/axiosConfig";
import { defineStore } from "pinia";

export const useAnnouncementsStore = defineStore("announcements", {
  actions: {
    getAnnouncements(params) {
      return axiosConfig
        .get("/messages", { params })
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
