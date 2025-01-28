import axiosClient from "./axiosClient"

const promotionApi = {
  // Create Offer
  createOffer: (params) => axiosClient.post("api/v1/offer", params),

  // Add dishes to offer
  addDishesToOffer: (params, promotionId) => axiosClient.post(`api/v1/offer/${promotionId}/dishes`, params),

  // Delete offer
  deleteOffer: (promotionId) => axiosClient.delete(`api/v1/offer/${promotionId}`),

  getPromotionByRestaurant: ({ limit, page, order, search_field, search } = {}) => {
    const params = {
      limit,
      page,
      order,
      search_field,
      search
    }
    const validParams = Object.fromEntries(Object.entries(params).filter(([_, value]) => value !== undefined && value))

    const queryString = new URLSearchParams(validParams).toString()

    const url = `api/v1/offer${queryString ? `?${queryString}` : ""}`

    return axiosClient.get(url)
  },

  // Get offer by restaurant -> super-admin
  getPromotionByRestaurantSuperAdmin: (restaurantId) => axiosClient.get(`api/v1/offer/${restaurantId}`),

  // Update or Add offer images
  addImage: (promotionId, params) =>
    axiosClient.post(`api/v1/offer/${promotionId}/images`, params, {
      contentType: `multipart/form-data; boundary=${params._boundary}`
    }),
  // Update offer status
  updateOffer: (promotionId, params) => axiosClient.patch(`api/v1/offer/${promotionId}`, params),

  updateOfferStatus: (promotionId, params) => axiosClient.patch(`api/v1/offer/status/${promotionId}`, params),

  getAllDishes: (restaurantId) => axiosClient.get(`api/v1/restaurant/${restaurantId}/dishes-names`)
}

export default promotionApi
