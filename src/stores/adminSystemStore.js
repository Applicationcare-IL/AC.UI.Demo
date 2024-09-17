import { defineStore } from "pinia";

import axiosConfig from "@/service/axiosConfig";

export const useAdminSystemStore = defineStore("adminSystem", {
  actions: {
    getEasymazeEntitiesList(params) {
      return axiosConfig
        .get("/admin/system/easymaze-entities", { params })
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          console.error(error);
        });
    },
    getSALValue() {
      return axiosConfig
        .get("/admin/system/sla")
        .then(({ data }) => {
          return data.data.value;
        })
        .catch((error) => {
          console.error(error);
        });
    },
    updateSLAValue(SLAValue) {
      return axiosConfig
        .patch("/admin/system/sla", SLAValue)
        .then(({ data }) => {
          return data;
        })
        .catch((error) => {
          console.error(error);
        });
    },
  },
});
