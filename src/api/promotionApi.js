import axiosClient from "./axiosClient"

const promotionApi = {
  // Create Offer
  createOffer: (params) => axiosClient.post("api/v1/offer", params),

  // Add dishes to offer
  addDishesToOffer: (params, promotionId) => axiosClient.post(`api/v1/offer/${promotionId}/dishes`, params),

  // Delete offer
  deleteOffer: () => axiosClient.post("api/v1/offer"),

  // Get offer by restaurante -> admin-restaurant
  getPromotionByRestaurant: () => axiosClient.get("api/v1/offer"),

  // Get offer by restaurant -> super-admin
  getPromotionByRestaurantSuperAdmin: (restaurantId) => axiosClient.get(`api/v1/offer/${restaurantId}`),

  // Update or Add offer images
  addImage: (promotionId, params) =>
    axiosClient.post(`api/v1/offer/${promotionId}/images`, params, {
      contentType: `multipart/form-data; boundary=${params._boundary}`
    }),
  // Update offer status
  updateStatus: (promotionId, params) => axiosClient.post(`api/v1/offer/status/${promotionId}`, params)
}

export default promotionApi
