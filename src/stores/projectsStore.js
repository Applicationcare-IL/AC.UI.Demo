import axiosConfig from "@/service/axiosConfig";
import { defineStore } from "pinia";

export const useProjectsStore = defineStore("projects", {
  actions: {
    getProjectsFromApi(params) {
      console.log(params);
      return axiosConfig
        .get("/projects")
        .then((response) => {
          console.log(response);
          const data = response.data.data.map((project) => {
            // return this.mapProject(project);
            return project;
          });
          const totalRecords = response.data.meta.total;
          console.log(data, totalRecords);
          return { data, totalRecords };
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
