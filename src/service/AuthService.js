import axiosConfig from "@/service/axiosConfig";

export const AuthService = {
  login(email, password) {
    return axiosConfig.post("/auth/login", { email, password });
  },
  forgotPassword(email) {
    return axiosConfig.post("/auth/forgot-password", { email });
  },
  userData() {
    return axiosConfig.get("/auth/profile");
  },
};
