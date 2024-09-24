import axiosClient from "./axiosClient"

const restaurantsApi = {
  getAllRestaurants: ({ limit, page, order } = {}) => {
    const params = {
      limit,
      page,
      order
    }
    const validParams = Object.fromEntries(Object.entries(params).filter(([_, value]) => value !== undefined && value))

    const queryString = new URLSearchParams(validParams).toString()

    const url = `api/v1/restaurant${queryString ? `?${queryString}` : ""}`

    return axiosClient.get(url)
  },

  // GET
  getRestaurant: (restaurantId) => axiosClient.get(`api/v1/restaurant/${restaurantId}`),

  // POST
  createRestaurant: (params) => axiosClient.post("api/v1/restaurant/", params),

  // UPDATE
  updateRestaurant: (params, restaurantId) => axiosClient.patch(`api/v1/restaurant/${restaurantId}`, params),

  // DELETE
  deleteRestaurant: (restaurantId) => axiosClient.delete(`api/v1/restaurant/${restaurantId}`),

  // POST IMAGE
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
