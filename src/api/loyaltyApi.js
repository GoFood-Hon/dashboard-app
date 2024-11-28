import axiosClient from "./axiosClient"

const loyaltyApi = {
  //Loyalty Programs
  getLoyaltyProgramsByRestaurant: ({ restaurantId, page, limit, order, orderBy }) => {
    const params = {
      page,
      limit,
      order,
      orderBy
    }

    const validParams = Object.fromEntries(Object.entries(params).filter(([_, value]) => value !== undefined && value))

    const queryString = new URLSearchParams(validParams).toString()
    const url = `api/v1/restaurant/${restaurantId}/loyalty-program${queryString ? `?${queryString}` : ""}`

    return axiosClient.get(url)
  },

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

  //Loyalty Program Rewards
  createCardReward: (params) => axiosClient.post(`api/v1/loyalty-program/card-reward/`, params),

  updateCardReward: (id, params) => axiosClient.patch(`api/v1/loyalty-program/card-reward/${id}`, params),

  deleteCardReward: (id) => axiosClient.delete(`api/v1/loyalty-program/card-reward/${id}`),

  //Loyalty Program Cards
  createLoyaltyCard: (loyaltyProgramId, params) => axiosClient.post(`api/v1/loyalty-program/${loyaltyProgramId}/card/`, params),

  updateCardReward: (loyaltyProgramId, id, params) =>
    axiosClient.patch(`api/v1/loyalty-program/${loyaltyProgramId}/card/${id}`, params),

  deleteCardReward: (loyaltyProgramId, id) => axiosClient.delete(`api/v1/loyalty-program/${loyaltyProgramId}/card/${id}`)
}

export default loyaltyApi
