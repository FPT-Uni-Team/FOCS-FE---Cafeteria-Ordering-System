import axios from "axios";
import { getSession } from "next-auth/react";

const axiosClient = axios.create({
  headers: {
    storeId: "550e8400-e29b-41d4-a716-446655440000",
  },
  timeout: 10000,
});

axiosClient.interceptors.request.use(
  async (config) => {
    const session = await getSession();
    const token = session?.accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosClient;
