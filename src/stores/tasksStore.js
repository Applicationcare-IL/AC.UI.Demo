import axiosConfig from "@/service/axiosConfig";
import { defineStore } from "pinia";

export const useTasksStore = defineStore("tasks", {
  actions: {
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
  },
});
