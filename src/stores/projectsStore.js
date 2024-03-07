import { defineStore } from "pinia";

import axiosConfig from "@/service/axiosConfig";

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
    updateProjectConfig(id, config) {
      return axiosConfig
        .post("/projects/" + id + "/config", config)
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
    // BUDGETS
    updateBudget(projectId, data) {
      return axiosConfig
        .patch("/projects/" + projectId + "/budget", data)
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          console.error(error);
        });
    },
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
    getBudgetItems(projectId, params) {
      return axiosConfig
        .get("/projects/" + projectId + "/budget-items", { params })
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          console.error(error);
        });
    },
    getBudgetItem(projectId, itemId) {
      return axiosConfig
        .get("/projects/" + projectId + "/budget-items/" + itemId)
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          console.error(error);
        });
    },
    createBudgetItem(projectId, data) {
      return axiosConfig
        .post("/projects/" + projectId + "/budget-items", data)
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          console.error(error);
        });
    },
    updateBudgetItem(projectId, itemId, data) {
      return axiosConfig
        .patch("/projects/" + projectId + "/budget-items/" + itemId, data)
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          console.error(error);
        });
    },
    calculateBudget(projectId, data) {
      return axiosConfig
        .post("/projects/" + projectId + "/budget-calculate", data)
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          console.error(error);
        });
    },
    // PAYMENTS
    createProjectPayment(projectId, data) {
      return axiosConfig
        .post("/projects/" + projectId + "/payments", data)
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          console.error(error);
        });
    },
    updateProjectPayment(projectId, paymentId, data) {
      return axiosConfig
        .patch("/projects/" + projectId + "/payments/" + paymentId, data)
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          console.error(error);
        });
    },
    getProjectPayments(projectId, params) {
      return axiosConfig
        .get("/projects/" + projectId + "/payments", { params })
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          console.error(error);
        });
    },
    createMilestone(projectId, data) {
      return axiosConfig
        .post("/projects/" + projectId + "/milestones", data)
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          console.error(error);
          throw error;
        });
    },
    getProjectMilestones(projectId, params) {
      return axiosConfig
        .get("/projects/" + projectId + "/milestones", { params })
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          console.error(error);
        });
    },
  },
});
