import axios from "axios";
import { getSession } from "next-auth/react";

const axiosClient = axios.create({
  headers: {
    storeId:
      typeof window !== "undefined"
        ? localStorage.getItem("storeFrontId") || ""
        : "",
    actorId:
      typeof window !== "undefined"
        ? localStorage.getItem("actorId") || ""
        : "",
  },
  timeout: 10000,
  withCredentials: true,
});

axiosClient.interceptors.request.use(
  async (config) => {
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
