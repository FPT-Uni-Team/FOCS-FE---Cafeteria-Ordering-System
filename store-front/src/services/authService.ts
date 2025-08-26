import { SignUpFormData } from "@/utils/validations/authSchema";
import axiosClient from "../api/axiosClient";
import endpoints from "../api/endpoint";

interface LoginPayload {
  email: string;
  password: string;
}

export interface DeviceToken {
  token: string;
  deviceId: string;
  platform: string;
  createdAt: string;
  lastUsedAt: string;
  actorId: string;
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
  sendOtp: (phone: string) => {
    return axiosClient.post(endpoints.auth.sendOtp(phone));
  },
  verifyOtp: (data: { phone: string; otp: string }) => {
    return axiosClient.post(endpoints.auth.verifyOtp(), data);
  },
  storeMobileToken: (data: DeviceToken) => {
    return axiosClient.post(endpoints.auth.mobileToken(), data);
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
