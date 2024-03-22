import { defineStore } from "pinia";

import axiosConfig from "@/service/axiosConfig";

export const useTasksStore = defineStore("tasks", {
  actions: {
    createTask(task) {
      return axiosConfig
        .post("/tasks", task)
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          console.error(error);
          throw error;
        });
    },
    updateTask(id, task) {
      return axiosConfig
        .patch("/tasks/" + id, task)
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          console.error(error);
          throw error;
        });
    },
    getTasksFromApi(params) {
      return axiosConfig
        .get("/tasks", { params })
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          console.error(error);
        });
    },
    getTasksTypesFromApi(params) {
      return axiosConfig
        .get("/tasks/types", { params })
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          console.error(error);
        });
    },
    getSignatureTaskFromApi(params) {
      return axiosConfig
        .get("/signatures", { params })
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          console.error(error);
        });
    },
    getTaskFromApi(id) {
      return axiosConfig
        .get("/tasks/" + id)
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          console.error(error);
        });
    },
    completeTask(id) {
      return axiosConfig
        .post("/tasks/" + id + "/complete")
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          console.error(error);
          throw error;
        });
    },
    completeTasks(ids, reasons) {
      const params = {
        ids: ids,
        completion_reason_1: reasons?.completion_reason_1,
        completion_reason_2: reasons?.completion_reason_2,
      };
      return axiosConfig
        .post("/tasks/complete", params)
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          console.error(error);
          throw error;
        });
    },
    signTask(signatureId, data) {
      return axiosConfig
        .patch("/signatures/" + signatureId, data)
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          console.error(error);
          throw error;
        });
    },

    generateSignaturesDocument(projectId) {
      return axiosConfig
        .post("/signatures/generate-pdf", { project: projectId })
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          console.error(error);
          throw error;
        });
    },
    getTopTaskFamilies(params) {
      return axiosConfig
        .get("/tasks/trending-areas", { params })
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          console.error(error);
        });
    },
  },
});
