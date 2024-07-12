import { defineStore } from "pinia";

import axiosConfig from "@/service/axiosConfig";

export const usePermissionsStore = defineStore("permissions", {
  state: () => ({
    // Code managed permissions
    permissions: {
      employees: {
        create: true,
      },
      teams: {
        create: true,
      },
      roles: {
        create: true,
      },
      quickCodes: {
        create: true,
      },
      messages: {
        create: true,
      },
      milestones: {
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
