import { SignUpFormData } from "@/utils/validations/authSchema";
import axiosClient from "../api/axiosClient";
import endpoints from "../api/endpoint";

interface LoginPayload {
  phone: string;
  password: string;
}

const authService = {
  login: (data: LoginPayload) => {
    return axiosClient.post(endpoints.auth.login(), data);
  },
  refreshToken: () => {
    return axiosClient.post(
      endpoints.auth.refresh(),
      {},
      {
        withCredentials: true,
      }
    );
  },
  signUp: (data: SignUpFormData) => {
    return axiosClient.post(endpoints.auth.signUp(), data);
  },
  forgotPassword: (data: { email: string }) => {
    return axiosClient.post(endpoints.auth.forgotPassword(), data);
  },
  resetPassword: (data: {
    email: string;
    token: string | null;
    new_password: string;
    confirm_password: string;
  }) => {
    return axiosClient.post(endpoints.auth.resetPassWord(), data);
  },
};

export default authService;
