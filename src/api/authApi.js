import axiosClient from "./axiosClient"

const authApi = {
  signup: (params) => axiosClient.post("api/v1/users/signup", params),

  login: (params) => axiosClient.post("api/v1/users/login", params),

  verifyToken: (refreshToken) => axiosClient.get("api/v1/auth/refresh-token", { refreshToken }),

  getUser: () => axiosClient.get("api/v1/users/me"),

  forgotPassword: (params) => axiosClient.post("api/v1/users/forgot-password", params),

  resetPassword: (params) => axiosClient.patch("api/v1/users/resetPassword", params),

  verifyOTP: (params) => axiosClient.post("api/v1/users/verifyToken", params),

  updateUser: (params) => axiosClient.post("api/v1/users/update-me", params),

  addImage: (params) =>
    axiosClient.post("api/v1/users/update-image", params, {
      contentType: `multipart/form-data; boundary=${params._boundary}`
    }),

  changePassword: (params) => axiosClient.patch("api/v1/users/change-password", params),

  createNewAdmin: (params) => axiosClient.post("api/v1/users/signup", params),

  createNewUser: (params) => axiosClient.post("api/v1/users/create-user", params)
}

export default authApi
