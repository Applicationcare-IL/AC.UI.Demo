import { defineStore } from "pinia";
import axiosConfig from "@/service/axiosConfig";

export const useUtilsStore = defineStore("utils", {
  id: "debounce",
  state: () => ({
    selectedElements: {},
    searchString: {},
    filters: {},
    debounceTimer: null,
    entity: "",
    dateFormat: "DD/MM/YY",
  }),
  actions: {
    getNextEntityID(params) {
      return axiosConfig
        .get("/next-id", { params })
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          console.error(error);
        });
    },
    debounceAction(callback, delay = 500) {
      if (this.debounceTimer) {
        clearTimeout(this.debounceTimer);
      }

      this.debounceTimer = setTimeout(() => {
        callback();
      }, delay);
    },
    cancelDebounce() {
      if (this.debounceTimer) {
        clearTimeout(this.debounceTimer);
        this.debounceTimer = null;
      }
    },
    //Style related Actions
    getStatusConditionalStyle: (status) => {
      return [
        {
          "bg-green-200 text-green-900": ["active", "open"].includes(status),
          "bg-red-100 text-red-900": ["terminated", "not_active"].includes(
            status
          ),
        },
      ];
    },
    resetElements() {
      this.selectedElements = {};
    },
  },
});
