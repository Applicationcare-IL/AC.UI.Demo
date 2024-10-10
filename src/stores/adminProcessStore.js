import { defineStore } from "pinia";

import axiosConfig from "@/service/axiosConfig";

export const useAdminProcessStore = defineStore("adminProcesses", {
  actions: {
    getProcesses(params) {
      return axiosConfig
        .get("/admin/processes", { params })
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          console.error(error);
        });
    },
    getProcess(id) {
      return axiosConfig
        .get(`/admin/processes/${id}`)
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          console.error(error);
        });
    },
    createProcess(process) {
      return axiosConfig
        .post("/admin/processes", process)
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          console.error(error);
        });
    },
    updateProcess(processId, data) {
      return axiosConfig
        .patch(`/admin/processes/${processId}`, data)
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          console.error(error);
        });
    },
    deleteProcess(processId) {
      return axiosConfig
        .delete(`/admin/processes/${processId}`)
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          console.error(error);
        });
    },
  },
});
