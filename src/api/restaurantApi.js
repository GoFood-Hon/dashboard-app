import axiosClient from "./axiosClient"

const restaurantsApi = {
  getAllRestaurants: (page, limit) => axiosClient.get(`api/v1/restaurant?page=${page}&limit=${limit}`),

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
    })
}

export default restaurantsApi
