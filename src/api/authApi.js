import axiosClient from "./axiosClient"

const authApi = {
  signup: (params) => axiosClient.post("api/v1/users/signup", params),
  login: (params) => axiosClient.post("api/v1/users/login", params),
  verifyToken: (refreshToken) => axiosClient.get("api/v1/auth/refresh-token", { refreshToken }),
  getUser: () => axiosClient.get("api/v1/users/me"),
  forgotPassword: (params) => axiosClient.post("api/v1/users/forgotPassword", params),
  resetPassword: (params) => axiosClient.patch("api/v1/users/resetPassword", params),
  verifyOTP: (params) => axiosClient.post("api/v1/users/verifyToken", params),
  updateUser: (params) => axiosClient.post("api/v1/users/update-me", params)
}

export default authApi
