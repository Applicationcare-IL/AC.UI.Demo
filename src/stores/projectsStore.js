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
          console.error(error);
        });
    },
    getProjectFromApi(id) {
      return axiosConfig
        .get("/projects/" + id)
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          console.error(error);
        });
    },
    createProject(project) {
      return axiosConfig
        .post("/projects", project)
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          console.error(error);
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
          console.error(error);
          throw error;
        });
    },
    assignContactToProject(projectId, contact) {
      const params = {
        project: projectId,
        ...contact,
      };

      return axiosConfig
        .post("/projects/contacts", params)
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          console.error(error);
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
          console.error(error);
          throw error;
        });
    },
    addServiceArea(projectId, serviceArea) {
      return axiosConfig
        .post(`/projects/${projectId}/service-area`, serviceArea)
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          console.error(error);
          throw error;
        });
    },
    removeServiceArea(projectId, serviceArea) {
      return axiosConfig
        .delete(`/projects/${projectId}/service-area`, { data: serviceArea })
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          console.error(error);
          throw error;
        });
    },
    getProjectCustomers(projectId, params) {
      return axiosConfig
        .get(`/projects/${projectId}/customers`, { params })
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          console.error(error);
          throw error;
        });
    },
    createProjectCustomer(projectId, data) {
      return axiosConfig
        .post(`/projects/${projectId}/customers`, data)
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          console.error(error);
          throw error;
        });
    },
    updateProjectCustomer(projectId, data) {
      return axiosConfig
        .patch(`/projects/${projectId}/customers`, data)
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          console.error(error);
          throw error;
        });
    },
    deleteProjectCustomer(projectId, params) {
      return axiosConfig
        .delete(`/projects/${projectId}/customers`, { data: params })
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          console.error(error);
          throw error;
        });
    },
  },
});
