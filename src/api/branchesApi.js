import axiosClient from "./axiosClient"
const branchesApi = {
  getAllBranches: ({ limit, page, order, startDate, endDate, status, price, dateSort }) => {
    const params = {
      limit,
      page,
      order,
      startDate,
      endDate,
      status,
      price,
      dateSort
    }

    const validParams = Object.fromEntries(Object.entries(params).filter(([_, value]) => value !== undefined && value))

    const queryString = new URLSearchParams(validParams).toString()
    const url = `api/v1/sucursal/${queryString ? `?${queryString}` : ""}`

    return axiosClient.get(url)
  },

  getBranch: (id) => axiosClient.get(`api/v1/sucursal/${id}`),

  updateBranches: (params, id) => axiosClient.patch(`api/v1/sucursal/${id}`, params),

  getBranchesByRestaurant: ({ limit, page, order, startDate, endDate, status, price, dateSort }) => {
    const params = {
      limit,
      page,
      order,
      startDate,
      endDate,
      status,
      price,
      dateSort
    }

    const validParams = Object.fromEntries(Object.entries(params).filter(([_, value]) => value !== undefined && value))

    const queryString = new URLSearchParams(validParams).toString()
    const url = `api/v1/restaurant/sucursals/get-all${queryString ? `?${queryString}` : ""}`

    return axiosClient.get(url)
  }
}

export default branchesApi
