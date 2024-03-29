import { defineStore } from "pinia";

import axiosConfig from "@/service/axiosConfig";

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
