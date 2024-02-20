import { defineStore } from "pinia";

import axiosConfig from "@/service/axiosConfig";

export const useLicensingStore = defineStore("licensing", {
  state: () => ({
    licensing: [],
  }),
  actions: {
    fetchLicensing() {
      return axiosConfig
        .get("/licensing")
        .then((response) => {
          this.licensing = response.data;
        })
        .catch((error) => {
          console.error(error);
        });
    },
  },
});
