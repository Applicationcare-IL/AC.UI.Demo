import { defineStore } from "pinia";
import { useRouter } from "vue-router";

import { AuthService } from "@/service/AuthService";

const router = useRouter();

export const useAuthStore = defineStore("auth", {
  state: () => ({
    isAuthenticated: localStorage.getItem("isAuthenticated"),
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
      return Promise.resolve(
        AuthService.login(email, password)
          .then((response) => {
            this.isAuthenticated = true;
            this.token = response.data.data.token;
            localStorage.setItem("token", this.token);
            localStorage.setItem("isAuthenticated", true);
          })
          .catch((error) => {
            console.error(error);
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
