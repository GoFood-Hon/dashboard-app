import axiosClient from "./axiosClient"

const statsApi = {
  getMainCardsStats: ({ restaurantId, startDate, endDate }) => {
    const params = {
      restaurantId,
      startDate,
      endDate
    }

    const validParams = Object.fromEntries(Object.entries(params).filter(([_, value]) => value !== undefined && value))

    const queryString = new URLSearchParams(validParams).toString()

    const url = `api/v1/stats/kpis-by-range${queryString ? `?${queryString}` : ""}`

    return axiosClient.get(url)
  },

  getMainAdminCardsStats: ({ startDate, endDate }) => {
    const params = {
      startDate,
      endDate
    }

    const validParams = Object.fromEntries(Object.entries(params).filter(([_, value]) => value !== undefined && value))

    const queryString = new URLSearchParams(validParams).toString()

    const url = `api/v1/stats/global-kpis-by-range${queryString ? `?${queryString}` : ""}`

    return axiosClient.get(url)
  },

  getSellsAndOrdersData: ({ restaurantId, sucursalId, startDate, endDate, type }) => {
    const params = {
      restaurantId,
      sucursalId,
      startDate,
      endDate,
      type
    }

    const validParams = Object.fromEntries(Object.entries(params).filter(([_, value]) => value !== undefined && value))

    const queryString = new URLSearchParams(validParams).toString()

    const url = `api/v1/stats/suborders-service-stats-by-range${queryString ? `?${queryString}` : ""}`

    return axiosClient.get(url)
  },

  getMostSelledProducts: ({ restaurantId, startDate, endDate }) => {
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
