import { defineStore } from "pinia";

import axiosConfig from "@/service/axiosConfig";

export const useCallsStore = defineStore("calls", {
  actions: {
    takeCall(callId, params) {
      return axiosConfig
        .post("/call/" + callId + "/take", params)
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
