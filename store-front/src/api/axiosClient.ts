import axios from "axios";
import { getSession } from "next-auth/react";

const axiosClient = axios.create({
  timeout: 10000,
  withCredentials: true,
});

axiosClient.interceptors.request.use(
  async (config) => {
    if (typeof window !== "undefined") {
      const storeId = sessionStorage.getItem("storeFrontId") || "";
      const actorId = localStorage.getItem("actorId") || "";
      if (!config.headers.storeId) {
        config.headers.storeId = storeId;
      }
      if (!config.headers.actorId) {
        config.headers.actorId = actorId;
      }
    }
    if (!config.headers?.Authorization) {
      const session = await getSession();
      if (session?.error === "RefreshFailed") {
        localStorage.removeItem("actorId");
      }
      const token = session?.accessToken;
      if (token) {
        if (config.headers) {
          config.headers["Authorization"] = `Bearer ${token}`;
        }
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosClient;
