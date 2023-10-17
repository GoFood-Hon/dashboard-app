import axiosClient from "./axiosClient"

const authApi = {
  signup: (params) => axiosClient.post("api/v1/users/signup", params),
  login: (params) => axiosClient.post("api/v1/users/login", params),
  verifyToken: () => axiosClient.get("api/v1/auth/refresh-token"),
  getUser: () => axiosClient.get("api/v1/users/me")
}

export default authApi
