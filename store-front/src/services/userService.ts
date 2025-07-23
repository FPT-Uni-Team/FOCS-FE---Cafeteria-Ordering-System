import axiosClient from "@/api/axiosClient";
import endpoints from "../api/endpoint";

const userService = {
  detail: (token?: string) => {
    return axiosClient.get(endpoints.user.profile(), {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
};

export default userService;
