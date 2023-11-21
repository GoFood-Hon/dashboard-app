import axiosClient from "./axiosClient"

const complementsApi = {
  getAddOnByRestaurant: ({ limit, page, order, restaurantId, startDate, endDate, status, price, category }) => {
    const params = {
      limit,
      page,
      order,
      startDate,
      endDate,
      status,
      price,
      category
    }

    const validParams = Object.fromEntries(Object.entries(params).filter(([_, value]) => value !== undefined && value))

    const queryString = new URLSearchParams(validParams).toString()

    const url = `api/v1/addon/${restaurantId}${queryString ? `?${queryString}` : ""}`

    return axiosClient.get(url)
  },

  createAddOn: (params) => axiosClient.post("api/v1/addon/", params),
  updateAddOn: (params, addonId) => axiosClient.patch(`api/v1/addon/${addonId}`, params),
  deleteAddOn: (addonId) => axiosClient.del(`api/v1/addon/${addonId}`)
}

export default complementsApi
