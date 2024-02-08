import { defineStore } from "pinia";

import axiosConfig from "@/service/axiosConfig";

export const useBudgetsStore = defineStore("budgets", {
  actions: {
    // createTask(task) {
    //   return axiosConfig
    //     .post("/tasks", task)
    //     .then((response) => {
    //       return response.data;
    //     })
    //     .catch((error) => {
    //       console.error(error);
    //       throw error;
    //     });
    // },
    // updateTask(id, task) {
    //   return axiosConfig
    //     .patch("/tasks/" + id, task)
    //     .then((response) => {
    //       return response.data;
    //     })
    //     .catch((error) => {
    //       console.error(error);
    //       throw error;
    //     });
    // },
    getProjectBudget(projectId) {
      return axiosConfig
        .get("/projects/" + projectId + "/budget")
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          console.error(error);
        });
    },
  },
});
