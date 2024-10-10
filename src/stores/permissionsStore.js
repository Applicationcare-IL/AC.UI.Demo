import { defineStore } from "pinia";

import axiosConfig from "@/service/axiosConfig";

export const usePermissionsStore = defineStore("permissions", {
  state: () => ({
    // Code managed permissions
    permissions: {
      budgets: {
        create: true,
        update: true,
      },
      "budget-items": {
        update: true,
      },
      employees: {
        create: true,
        update: true,
      },
      teams: {
        create: true,
        update: true,
      },
      roles: {
        create: true,
        update: true,
      },
      "quick-codes": {
        create: true,
        update: true,
      },
      messages: {
        create: true,
        update: true,
      },
      classifications: {
        create: true,
      },
      processes: {
        create: true,
      },
      triggers: {
        create: true,
      },
      milestones: {
        update: true,
      },
      reports: {
        create: true,
        assign: false,
      },
      "admin-reports": {
        create: true,
        update: true,
      },
    },
    isPermissionsLoaded: false,
  }),
  actions: {
    /**
     * Check if the user has a specific permission
     * @param {string} permission entity.action
     * @returns
     */
    can(permission) {
      const permissions = permission.split(".");

      const entity = permissions[0];
      const action = permissions[1];

      if (this.permissions[entity] === undefined) {
        return false;
      }

      if (this.permissions[entity][action] === undefined) {
        return false;
      }

      return this.permissions[entity][action];
    },
    permissionExists(permission) {
      const permissions = permission.split(".");

      const entity = permissions[0];
      const action = permissions[1];

      if (this.permissions[entity] === undefined) {
        return false;
      }

      if (this.permissions[entity][action] === undefined) {
        return false;
      }

      return true;
    },
    fetchPermissionsFromApi() {
      return axiosConfig
        .get("/auth/permissions")
        .then((response) => {
          this.permissions = {
            ...this.permissions,
            ...response.data.data,
          };

          this.isPermissionsLoaded = true;
        })
        .catch((error) => {
          console.error(error);
        });
    },
  },
});
