import axiosClient from "./axiosClient"

const restaurantsApi = {
  getAllRestaurants: ({ limit, page, order }) => {
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

  getRestaurant: (restaurantId) => axiosClient.get(`api/v1/restaurant/${restaurantId}`),

  createRestaurant: (params) =>
    axiosClient.post("api/v1/restaurant", params, { contentType: `multipart/form-data; boundary=${params._boundary}` }),

  updateRestaurant: (params, restaurantId) =>
    axiosClient.patch(`api/v1/restaurant/${restaurantId}`, params, {
      headers: {
        "Content-Type": `multipart/form-data; boundary=${params._boundary}`
      }
    }),
  deleteRestaurant: (restaurantId) => axiosClient.del(`api/v1/restaurant/${restaurantId}`),

  addImage: (restaurantId, params) =>
    axiosClient.post(`api/v1/restaurant/${restaurantId}/images`, params, {
      contentType: `multipart/form-data; boundary=${params._boundary}`
    }),

  // BANK INFORMATION
  getBankList: () => axiosClient.get(`api/v1/restaurant/banks/get-all`)
}

export default restaurantsApi
