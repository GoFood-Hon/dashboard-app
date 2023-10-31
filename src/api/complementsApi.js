import axiosClient from "./axiosClient"

const complementsApi = {
  getAddOnByRestaurant: (restaurantId) => axiosClient.get(`api/v1/addon/${restaurantId}`),
  createAddOn: (params) => axiosClient.post("api/v1/addon/", params),
  updateAddOn: (params, addonId) => axiosClient.patch(`api/v1/addon/${addonId}`, params),
  deleteAddOn: (addonId) => axiosClient.del(`api/v1/addon/${addonId}`)
}

export default complementsApi
