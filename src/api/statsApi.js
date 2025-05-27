import axiosClient from "./axiosClient"

const statsApi = {
  getAllRestaurantsNoPagination: ({ restaurantId, startDate, endDate }) => {
    const params = {
      restaurantId,
      startDate,
      endDate
    }

    const validParams = Object.fromEntries(Object.entries(params).filter(([_, value]) => value !== undefined && value))

    const queryString = new URLSearchParams(validParams).toString()

    const url = `api/v1/stats/dish-sales-stats${queryString ? `?${queryString}` : ""}`

    return axiosClient.get(url)
  }
}

export default statsApi