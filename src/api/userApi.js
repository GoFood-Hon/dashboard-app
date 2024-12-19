import axiosClient from "./axiosClient"

const userApi = {
  createUser: (params) => axiosClient.post("api/v1/users/create-user", params),

  getUsersByRestaurant: ({ restaurantId, limit, page, order, search_field, search }) => {
    const params = {
      limit,
      page,
      order,
      search_field,
      search
    }

    const validParams = Object.fromEntries(Object.entries(params).filter(([_, value]) => value !== undefined && value))

    const queryString = new URLSearchParams(validParams).toString()

    const url = `api/v1/users/${restaurantId}/restaurant${queryString ? `?${queryString}` : ""}`

    return axiosClient.get(url)
  },

  getUsersByBranch: ({ limit, page, order, orderBy, id, startDate, endDate, status, price, dateSort }) => {
    const params = {
      limit,
      page,
      order,
      orderBy,
      startDate,
      endDate,
      status,
      price,
      dateSort
    }

    const validParams = Object.fromEntries(Object.entries(params).filter(([_, value]) => value !== undefined && value))

    const queryString = new URLSearchParams(validParams).toString()

    const url = `api/v1/users/${id}/sucursal${queryString ? `?${queryString}` : ""}`

    return axiosClient.get(url)
  },

  updateUserRestaurant: (params, userId) => axiosClient.patch(`api/v1/users/update-user/${userId}`, params),

  getAdminUsers: ({ limit, page, order, search_field, search } = {}) => {
    const params = {
      limit,
      page,
      order,
      search_field,
      search
    }

    const validParams = Object.fromEntries(Object.entries(params).filter(([_, value]) => value !== undefined && value !== ""))

    const queryString = new URLSearchParams(validParams).toString()
    const url = `api/v1/users/admin-restaurant/get-all${queryString ? `?${queryString}` : ""}`

    return axiosClient.get(url)
  },

  updateAdminUser: (id, params) => axiosClient.put(`api/v1/users/admin-restaurant/${id}`, params),

  deleteAdminUser: (id) => axiosClient.delete(`api/v1/users/admin-restaurant/${id}`),

  addImage: (id, params) =>
    axiosClient.post(`api/v1/users/update-image-user/${id}`, params, {
      contentType: `multipart/form-data; boundary=${params._boundary}`
    }),

  addDriverToSucursal: (params) => axiosClient.post("api/v1/users/assign-driver", params),

  deleteDriverFromSucursal: (params) =>
    axiosClient.delete(`api/v1/users/remove-driver-sucursal`, {
      data: params
    })
}

export default userApi
