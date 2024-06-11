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
    cancelProject(id) {
      return axiosConfig
        .post("/projects/" + id + "/cancel")
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
    assignContactToProject({ project, contact, customer, role }) {
      return axiosConfig
        .post("/projects/contacts", {
          project,
          contact,
          customer,
          role,
        })
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          console.error(error);
          throw error;
        });
    },
    updateTeamMember(projectId, teamMemberId, params) {
      return axiosConfig
        .patch(`/projects/${projectId}/team/${teamMemberId}`, params)
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          console.error(error);
          throw error;
        });
    },
    unassignContactFromProject({ project_id, contact_id, customer_id, role_id }) {
      return axiosConfig
        .delete("/projects/contacts", {
          data: { project_id, contact_id, customer_id, role_id },
        })
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
    // TEAM
    getProjectTeam(projectId, params) {
      return axiosConfig
        .get("/projects/" + projectId + "/team", { params })
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          console.error(error);
        });
    },
    getProjectTeamRoles(projectId, params) {
      return axiosConfig
        .get("/projects/" + projectId + "/team/roles", { params })
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          console.error(error);
        });
    },
    exportProjects() {
      return axiosConfig
        .get("/projects/export")
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          console.error(error);
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
    getBudgetItems(params) {
      return axiosConfig
        .get("/budget-items", { params })
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          console.error(error);
        });
    },
    getBudgetItem(itemId) {
      return axiosConfig
        .get("/budget-items/" + itemId)
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          console.error(error);
        });
    },
    createBudgetItem(data) {
      return axiosConfig
        .post("/budget-items", data)
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          console.error(error);
        });
    },
    updateBudgetItem(itemId, data) {
      return axiosConfig
        .patch("/budget-items/" + itemId, data)
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
    calculateBudgetItem(itemId, data) {
      return axiosConfig
        .post("/budget-items/" + itemId + "/calculate", data)
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          console.error(error);
        });
    },
    calculateNewBudgetItem(data) {
      return axiosConfig
        .post("/budgets/calculateBudgetItem", data)
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
    // MILESTONE
    createMilestone(data) {
      return axiosConfig
        .post("/milestones", data)
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          console.error(error);
          throw error;
        });
    },
    getProjectMilestone(milestoneId) {
      return axiosConfig
        .get("/milestones/" + milestoneId)
        .then((response) => {
          return response.data.data;
        })
        .catch((error) => {
          console.error(error);
        });
    },
    getMilestones(params) {
      return axiosConfig
        .get("/milestones", { params })
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          console.error(error);
        });
    },
    updateProjectMilestone(milestoneId, data) {
      return axiosConfig
        .patch("/milestones/" + milestoneId, data)
        .then((response) => {
          return response.data.data;
        })
        .catch((error) => {
          console.error(error);
        });
    },
  },
});
