import axiosConfig from "@/service/axiosConfig";
import { defineStore } from "pinia";

export const useSearchStore = defineStore("search", {
  actions: {
    globalSearch(params) {
      return axiosConfig
        .get("/global/search", { params })
        .then((response) => {
          console.log(response);
          const results = response.data.data;
          return results;
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
});
