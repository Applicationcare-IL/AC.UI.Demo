import axiosConfig from "@/service/axiosConfig";

export const AuthService = {
  login(email, password) {
    return axiosConfig.post("/auth/login", { email, password });
  },
  forgotPassword(email) {
    return axiosConfig.post("/auth/email-reset-password", { email });
  },
  resetPassword(email, token, password, password_confirmation) {
    return axiosConfig.post("/auth/reset-password", {
      email,
      token,
      password,
      password_confirmation,
    });
  },
  userData() {
    return axiosConfig.get("/auth/profile");
  },
};
