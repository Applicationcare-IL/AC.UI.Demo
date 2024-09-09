import { defineStore } from "pinia";

import { AuthService } from "@/service/AuthService";
import { useOptionSetsStore } from "@/stores/optionSets";
import { usePermissionsStore } from "@/stores/permissionsStore";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    isAuthenticated: localStorage.getItem("isAuthenticated")
      ? JSON.parse(localStorage.getItem("isAuthenticated"))
      : false,
    user: JSON.parse(localStorage.getItem("user")),
    token: localStorage.getItem("token"),
  }),
  getters: {
    userFullName(state) {
      return state.user.name + " " + state.user.surname;
    },
    team(state) {
      return state.user.team;
    },
  },
  actions: {
    login(email, password) {
      const optionSetsStore = useOptionSetsStore();
      const permissionsStore = usePermissionsStore();

      return Promise.resolve(
        AuthService.login(email, password)
          .then(async (response) => {
            this.isAuthenticated = true;
            this.token = response.data.data.token;
            localStorage.setItem("token", this.token);
            localStorage.setItem("isAuthenticated", true);

            await optionSetsStore.preloadOptionSets();
            await permissionsStore.fetchPermissionsFromApi();
          })
          .catch((error) => {
            console.error(error);
            return error.response;
          })
      );
    },
    logout() {
      this.isAuthenticated = false;
      this.token = null;
      localStorage.setItem("isAuthenticated", false);
      localStorage.setItem("token", null);
      localStorage.clear();
      // refresh the page using javascript
      location.reload();
      // router.push("/login");
    },
    forgotPassword(email) {
      return Promise.resolve(
        AuthService.forgotPassword(email)
          .then((response) => {
            return response.data;
          })
          .catch((error) => {
            console.error(error);
          })
      );
    },
    resetPassword(email, token, password, password_confirmation) {
      return Promise.resolve(
        AuthService.resetPassword(email, token, password, password_confirmation)
          .then((response) => {
            return response.data;
          })
          .catch((error) => {
            console.error(error);
            return error.response.data;
          })
      );
    },
    userData() {
      return Promise.resolve(
        AuthService.userData()
          .then((response) => {
            this.user = response.data.data;
            localStorage.setItem("user", JSON.stringify(this.user));
          })
          .catch((error) => {
            console.error(error);
          })
      );
    },
  },
});
