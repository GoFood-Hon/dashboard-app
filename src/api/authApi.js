import axiosClient from "./axiosClient"

const authApi = {
  signup: (params) => axiosClient.post("api/v1/users/signup", params),
  login: (params) => axiosClient.post("api/v1/users/login", params),
  verifyToken: () => axiosClient.get("api/v1/auth/refresh-token"),
  getUser: () => axiosClient.get("api/v1/users/me"),
  forgotPassword: (params) => axiosClient.post("api/v1/users/forgotPassword", params),
  resetPassword: (params) => axiosClient.patch("api/v1/users/resetPassword", params),
  verifyOTP: (params) => axiosClient.post("api/v1/users/verifyToken", params)
}

export default authApi
