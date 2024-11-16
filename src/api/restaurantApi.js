import axiosClient from "./axiosClient"

const restaurantsApi = {
  getAllRestaurantsNoPagination: ({ order, orderBy }) => {
    const params = {
      order,
      orderBy
    }

    const validParams = Object.fromEntries(Object.entries(params).filter(([_, value]) => value !== undefined && value))

    const queryString = new URLSearchParams(validParams).toString()

    const url = `api/v1/restaurant/no-pagination${queryString ? `?${queryString}` : ""}`

    return axiosClient.get(url)
  },

  getAllRestaurants: ({ limit, page, order, search_field, search } = {}) => {
    const params = {
      limit,
      page,
      order,
      search_field,
      search
    }
    const validParams = Object.fromEntries(Object.entries(params).filter(([_, value]) => value !== undefined && value))

    const queryString = new URLSearchParams(validParams).toString()

    const url = `api/v1/restaurant${queryString ? `?${queryString}` : ""}`

    return axiosClient.get(url)
  },

  getRestaurant: (restaurantId) => axiosClient.get(`api/v1/restaurant/${restaurantId}`),

  createRestaurant: (params) => axiosClient.post("api/v1/restaurant/", params),

  updateRestaurant: (params, restaurantId) => axiosClient.patch(`api/v1/restaurant/${restaurantId}`, params),

  deleteRestaurant: (restaurantId) => axiosClient.delete(`api/v1/restaurant/${restaurantId}`),

  addImage: (restaurantId, params) =>
    axiosClient.post(`api/v1/restaurant/${restaurantId}/images`, params, {
      contentType: `multipart/form-data; boundary=${params._boundary}`
    }),

  // BANK INFORMATION
  getBankList: () => axiosClient.get(`api/v1/restaurant/banks/get-all`),

  // BANNER IMAGE
  updateBannerImage: (restaurantId, params) =>
    axiosClient.post(`api/v1/restaurant/${restaurantId}/banner-dishes`, params, {
      contentType: `multipart/form-data; boundary=${params._boundary}`
    })
}

export default restaurantsApi
