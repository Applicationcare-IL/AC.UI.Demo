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
          return response.data;
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
    updateProject(id, project) {
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
    assignContactToProject(projectId, contact) {
      const params = {
        project_id: projectId,
        ...contact,
      };

      return axiosConfig
        .post("/projects/contacts", params)
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          console.log(error);
          throw error;
        });
    },
    unassignContactFromProject(projectId, contactId) {
      const params = {
        project_id: projectId,
        contact_id: contactId,
      };

      return axiosConfig
        .delete("/projects/contacts", { data: params })
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
