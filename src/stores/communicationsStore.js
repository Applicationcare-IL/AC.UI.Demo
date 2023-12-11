import axiosConfig from "@/service/axiosConfig";
import { defineStore } from "pinia";

export const useCommunicationsStore = defineStore("communications", {
  actions: {
    sendSMS(params) {
      return axiosConfig
        .post("/comunications/sms", params)
        .then((response) => {
          const data = response.data.data;
          return { data };
        })
        .catch((error) => {
          console.log(error);
        });
    },
    sendEmail(params) {
      return axiosConfig
        .post("/comunications/email", params)
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
