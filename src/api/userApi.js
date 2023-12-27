import axiosClient from "./axiosClient"

const userApi = {
  createUser: (params) => axiosClient.post("api/v1/users/create-user", params),

  getUsersByRestaurant: ({ limit, page, order, id, startDate, endDate, status, price, dateSort }) => {
    const params = {
      limit,
      page,
      order,
      startDate,
      endDate,
      status,
      price,
      dateSort
    }

    const validParams = Object.fromEntries(Object.entries(params).filter(([_, value]) => value !== undefined && value))

    const queryString = new URLSearchParams(validParams).toString()

    const url = `api/v1/users/${id}/restaurant${queryString ? `?${queryString}` : ""}`

    return axiosClient.get(url)
  }
}

export default userApi
