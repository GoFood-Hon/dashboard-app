import axiosClient from "./axiosClient"

const userApi = {
  createUser: (params) => axiosClient.post("api/v1/users/create-user", params)
}

export default userApi
