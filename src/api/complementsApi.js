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

    const url = `api/v1/restaurant/${restaurantId}/addons${queryString ? `?${queryString}` : ""}`

    return axiosClient.get(url)
  },

  addImage: (dishId, params) =>
    axiosClient.post(`api/v1/addon/${dishId}/images`, params, {
      contentType: `multipart/form-data; boundary=${params._boundary}`
    }),

  createAddOn: (params) => axiosClient.post("api/v1/addon/", params),

  updateAddOn: (params, addonId) => axiosClient.patch(`api/v1/addon/${addonId}`, params),
  deleteAddOn: (addonId) => axiosClient.del(`api/v1/addon/${addonId}`)
}

export default complementsApi
