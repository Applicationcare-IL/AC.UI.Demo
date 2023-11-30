import axiosConfig from "@/service/axiosConfig";
import { defineStore } from "pinia";

export const usePermissionsStore = defineStore("permissions", {
  state: () => ({
    permissions: {},
  }),
  getters: {
    isPermissionsLoaded: (state) => {
      // return Object.keys(state.permissions).length > 0;
      return false;
    },
  },
  actions: {
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

    getPermissionsFromApi() {},

    getPermissions() {
      const permissions = {
        contacts: {
          all: true,
          my_team: true,
          my: true,
          related: true,
          read: true,
          create: true,
          update: true,
          delete: true,
          assign: true,
          export: true,
          activate: true,
          deactivate: true,
          restricted_area: true,
        },
        customers: {
          all: true,
          my_team: true,
          my: true,
          related: true,
          read: true,
          create: true,
          update: true,
          delete: true,
          assign: true,
          export: true,
          activate: true,
          deactivate: true,
          restricted_area: true,
          hobbies: true,
        },
        tasks: {
          all: true,
          my_team: true,
          my: true,
          related: true,
          read: true,
          create: true,
          update: true,
          delete: true,
          assign: true,
          export: true,
          activate: true,
          deactivate: true,
          restricted_area: true,
        },
        services: {
          all: true,
          my_team: true,
          my: true,
          related: true,
          read: true,
          create: true,
          update: true,
          delete: true,
          assign: true,
          export: true,
          activate: true,
          deactivate: true,
          restricted_area: true,
        },
        global: {
          admin_zone: true,
          is_team_manager: true,
          is_support_rep: true,
          call: true,
          sms: true,
          mail: true,
          whatsapp: true,
          customer_api_scope: true,
          enable_location: true,
          enable_location_maps: true,
          unlock_employees: true,
          recurring_tasks: true,
          deal_discount: true,
          management_discount: true,
          ceo_discount: true,
        },
        products: {
          all: true,
          my_team: true,
          my: true,
          related: true,
          read: true,
          create: true,
          update: true,
          delete: true,
          assign: true,
          export: true,
          activate: true,
          deactivate: true,
          restricted_area: true,
        },
        sales: {
          all: true,
          my_team: true,
          my: true,
          related: true,
          read: true,
          create: true,
          update: true,
          delete: true,
          assign: true,
          export: true,
          activate: true,
          deactivate: true,
          restricted_area: true,
        },
      };

      this.permissions = permissions;

      return Promise.resolve(permissions);
    },
  },
});
