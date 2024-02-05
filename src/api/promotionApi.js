import axiosClient from "./axiosClient"

const promotionApi = {
  createOffer: (params) => axiosClient.post("api/v1/offer", params),

  addDishesToOffer: (params, promotionId) => axiosClient.post(`api/v1/offer/${promotionId}/dishes`, params),

  deleteOffer: () => axiosClient.post("api/v1/offer"),

  // admin-restaurant
  getPromotionByRestaurant: () => axiosClient.get("api/v1/offer"),

  // super-admin
  getPromotionByRestaurantSuperAdmin: (restaurantId) => axiosClient.get(`api/v1/offer/${restaurantId}`),

  updatePromotions: (promotionId) => axiosClient.post(`api/v1/offer/${promotionId}/images`, params),

  updateStatus: (promotionId, params) => axiosClient.post(`api/v1/offer/status/${promotionId}`, params)
}

export default promotionApi
