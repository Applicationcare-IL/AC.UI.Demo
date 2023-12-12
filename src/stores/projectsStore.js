import axiosConfig from "@/service/axiosConfig";
import { defineStore } from "pinia";

export const useProjectsStore = defineStore("projects", {
  actions: {
    getProjectsFromApi(params) {
      return axiosConfig
        .get("/projects", { params })
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    getProjectFromApi(id) {
      return axiosConfig
        .get("/projects/" + id)
        .then((response) => {
          console.log(response);
          const project = response.data.data;
          return this.mapService(project);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    createProject(project) {
      return axiosConfig
        .post("/projects", project)
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          console.log(error);
          throw error;
        });
    },

    updateService(id, project) {
      console.log(project);
      return axiosConfig
        .patch("/projects/" + id, project)
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
