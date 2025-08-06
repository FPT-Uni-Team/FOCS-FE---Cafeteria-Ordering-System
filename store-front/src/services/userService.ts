import axiosClient from "@/api/axiosClient";
import endpoints from "../api/endpoint";
import { UserResponse } from "@/types/userProfile";

const userService = {
  detail: (token?: string) => {
    return axiosClient.get(endpoints.user.profile(), {
      headers: token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : {},
    });
  },
  update: (data: UserResponse) => {
    return axiosClient.put(endpoints.user.profile(), data);
  },
};

export default userService;
