import axiosConfig from "@/service/axiosConfig";
import { defineStore } from "pinia";

export const useTasksStore = defineStore("tasks", {
  actions: {
    createTask(task) {
      return axiosConfig
        .post("/tasks", task)
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          console.log(error);
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
          console.log(error);
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
          console.log(error);
        });
    },
    getTasksTypesFromApi(params) {
      return axiosConfig
        .get("/tasks/types", { params })
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    getTaskFromApi(id) {
      return axiosConfig
        .get("/tasks/" + id)
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    completeTask(id) {
      return axiosConfig
        .post("/tasks/" + id + "/complete")
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          console.log(error);
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
          console.log(error);
          throw error;
        });
    },
  },
});
