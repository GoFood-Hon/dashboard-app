import axiosClient from "./axiosClient"

const loyaltyApi = {
  //Loyalty Programs
  getLoyaltyProgramsByRestaurant: (restaurantId) => axiosClient.get(`api/v1/restaurant/${restaurantId}/loyalty-program`),

  getAllLoyaltyPrograms: ({ page, limit, order, orderby, search, search_field, status }) => {
    const params = {
      page,
      limit,
      order,
      orderby,
      search,
      search_field,
      status
    }

    const validParams = Object.fromEntries(Object.entries(params).filter(([_, value]) => value !== undefined && value))

    const queryString = new URLSearchParams(validParams).toString()
    const url = `api/v1/loyalty-program${queryString ? `?${queryString}` : ""}`
    return axiosClient.get(url)
  },

  getLoyaltyProgram: (id) => axiosClient.get(`api/v1/loyalty-program/${id}`),

  createLoyaltyProgram: (params) => axiosClient.post(`api/v1/loyalty-program/`, params),

  updateLoyaltyProgram: (id, params) => axiosClient.patch(`api/v1/loyalty-program/${id}`, params),

  //Loyalty Cards with Rewards
  createLoyaltyCardWithReward: (loyaltyProgramId, params) =>
    axiosClient.post(`api/v1/loyalty-program/${loyaltyProgramId}/redeemable-card-with-reward`, params),

  deleteLoyaltyCardWithReward: (loyaltyProgramId, redeemableCardId) =>
    axiosClient.delete(`api/v1/loyalty-program/${loyaltyProgramId}/redeemable-card-with-reward/${redeemableCardId}`),

  //Loyalty Program Rewards
  createCardReward: (params) => axiosClient.post(`api/v1/loyalty-program/card-reward/`, params),

  updateCardReward: (id, params) => axiosClient.patch(`api/v1/loyalty-program/card-reward/${id}`, params),

  deleteCardReward: (id) => axiosClient.delete(`api/v1/loyalty-program/card-reward/${id}`),

  //Loyalty Program Cards
  createLoyaltyCard: (loyaltyProgramId, params) => axiosClient.post(`api/v1/loyalty-program/${loyaltyProgramId}/card/`, params),

  updateCardReward: (loyaltyProgramId, id, params) =>
    axiosClient.patch(`api/v1/loyalty-program/${loyaltyProgramId}/card/${id}`, params),

  deleteCardReward: (loyaltyProgramId, id) => axiosClient.delete(`api/v1/loyalty-program/${loyaltyProgramId}/card/${id}`),

  //Rewards Tracking endpoints
  getUserLoyaltyCards: ({ restaurantId, page, limit, identityNumber, loyaltyCardCode, isRedeemed }) => {
    const params = {
      restaurantId,
      page,
      limit,
      identityNumber,
      loyaltyCardCode,
      isRedeemed
    }

    const validParams = Object.fromEntries(Object.entries(params).filter(([_, value]) => value !== undefined))

    const queryString = new URLSearchParams(validParams).toString()
    const url = `api/v1/loyalty-program/user-loyalty-cards${queryString ? `?${queryString}` : ""}`
    return axiosClient.get(url)
  },

  markLoyaltyCardAsRedeemed: (loyaltyCardId) => axiosClient.patch(`api/v1/loyalty-program/redeem-loyalty-card/${loyaltyCardId}`)
}

export default loyaltyApi
